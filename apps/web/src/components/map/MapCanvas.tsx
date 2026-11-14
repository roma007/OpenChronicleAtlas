import type {
  AtlasRouteFeature,
  AtlasTerritoryFeature,
  RouteGeometry,
} from '@atlas/shared';
import {
  applyEventFilters,
  buildRouteGeometry,
  clusterEvents,
  eventStart,
  latestEventAt,
  parseDateString,
  partialPathAt,
  resolveLocalized,
  routeStyleForSegmentType,
  wgs84ToGcj02,
  type AtlasEventCluster,
} from '@atlas/shared';
import { useEffect, useRef, useState } from 'react';
import { amapStyleId, loadAMap } from '../../map/amap';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';

const INITIAL_CENTER: [number, number] = [106.5, 32];
const BUBBLE_DURATION_MS = 4000;
const BUBBLE_MIN_GAP_MS = 1200;
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;
const DEFENSE_TICK_INTERVAL_M = 24000;
const DEFENSE_TICK_MIN_ZOOM = 6;
const ROUTE_LABEL_MIN_ZOOM = 6;
const ROUTE_LABEL_PROGRESS = 0.45;
const ROUTE_HEAD_MIN_ZOOM = 5;
const ROUTE_LABEL_PADDING_PX = 3;

interface LineEntry {
  feature: AtlasRouteFeature;
  geometry: RouteGeometry;
  line: any;
  label: any | null;
  /** 番号牌已换算到 GCJ-02 的落点，用于屏幕空间避让 */
  labelPoint: [number, number] | null;
  labelText: string;
  labelPriority: number;
  /** 线头箭头：随播放沿路线移动 */
  head: { marker: any; element: HTMLElement } | null;
  /** 当前时间进度，供标签避让与线头箭头复用 */
  progress: number;
  ticks: Array<{ marker: any; progress: number }>;
  strongpoints: Array<{ marker: any; progress: number }>;
}

interface ScreenRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface MarkerEntry {
  cluster: AtlasEventCluster;
  marker: any;
  element: HTMLButtonElement;
  countEl: HTMLSpanElement | null;
}

interface TerritoryEntry {
  feature: AtlasTerritoryFeature;
  polygons: any[];
  label: any;
}

function ringCenter(rings: [number, number][][]): [number, number] {
  const ring = rings[0] ?? [];
  if (ring.length === 0) return [0, 0];
  let lng = 0;
  let lat = 0;
  for (const [x, y] of ring) {
    lng += x;
    lat += y;
  }
  return [lng / ring.length, lat / ring.length];
}

function toGcjPoint(coordinate: [number, number]): [number, number] {
  const point = wgs84ToGcj02(coordinate[0], coordinate[1]);
  return [point.lng, point.lat];
}

/** 以公里为单位在局部平面上偏移一个经纬度点 */
function offsetPoint(
  point: [number, number],
  eastKm: number,
  northKm: number,
): [number, number] {
  const latRad = (point[1] * Math.PI) / 180;
  const lngScale = Math.max(0.2, Math.cos(latRad));
  return [
    point[0] + eastKm / (KM_PER_DEG_LNG_AT_EQUATOR * lngScale),
    point[1] + northKm / KM_PER_DEG_LAT,
  ];
}

/** 取路线某里程处的点、法线方向与行进方向（角度制，0=正北，顺时针） */
function sampleRoute(
  geometry: RouteGeometry,
  distance: number,
): { point: [number, number]; normal: [number, number]; bearing: number } | null {
  const { coordinates, cumulative, totalLength } = geometry;
  if (coordinates.length < 2 || totalLength === 0) return null;

  const target = Math.min(Math.max(distance, 0), totalLength);
  let low = 1;
  let high = cumulative.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (cumulative[mid]! < target) low = mid + 1;
    else high = mid;
  }

  const index = Math.max(1, low);
  const start = coordinates[index - 1]!;
  const end = coordinates[index]!;
  const segmentStart = cumulative[index - 1]!;
  const segmentLength = cumulative[index]! - segmentStart;
  const ratio = segmentLength === 0 ? 0 : (target - segmentStart) / segmentLength;
  const point: [number, number] = [
    start[0] + (end[0] - start[0]) * ratio,
    start[1] + (end[1] - start[1]) * ratio,
  ];

  const latRad = (point[1] * Math.PI) / 180;
  const east = (end[0] - start[0]) * KM_PER_DEG_LNG_AT_EQUATOR * Math.cos(latRad);
  const north = (end[1] - start[1]) * KM_PER_DEG_LAT;
  const length = Math.hypot(east, north) || 1;
  const tangentEast = east / length;
  const tangentNorth = north / length;
  return {
    point,
    normal: [-tangentNorth, tangentEast],
    bearing: (Math.atan2(tangentEast, tangentNorth) * 180) / Math.PI,
  };
}

/** 估算番号牌在屏幕上的外接框，避免逐帧读取 DOM 造成布局抖动 */
function estimateLabelRect(
  text: string,
  x: number,
  y: number,
): ScreenRect {
  let wide = 0;
  let narrow = 0;
  for (const char of text) {
    if (/[\u2e80-\u9fff\uf900-\ufaff]/.test(char)) wide += 1;
    else narrow += 1;
  }
  // 汉字约 11px，西文约 6.2px，左右 padding 与边框合计约 14px
  const width = wide * 11 + narrow * 6.2 + 14;
  const height = 18;
  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height / 2,
    bottom: y + height / 2,
  };
}

function rectsOverlap(a: ScreenRect, b: ScreenRect): boolean {
  return !(
    a.right + ROUTE_LABEL_PADDING_PX < b.left ||
    a.left - ROUTE_LABEL_PADDING_PX > b.right ||
    a.bottom + ROUTE_LABEL_PADDING_PX < b.top ||
    a.top - ROUTE_LABEL_PADDING_PX > b.bottom
  );
}

/** 番号牌缺省落点：路线中点向法线方向偏移，避免压住线本身 */
function defaultLabelPoint(geometry: RouteGeometry): [number, number] {
  const sample = sampleRoute(geometry, geometry.totalLength * 0.5);
  if (!sample) return geometry.coordinates[0]!;
  const [normalEast, normalNorth] = sample.normal;
  return offsetPoint(sample.point, normalEast * 7, normalNorth * 7);
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const amapRef = useRef<any>(null);
  const lineEntriesRef = useRef<Map<string, LineEntry>>(new Map());
  const markerEntriesRef = useRef<Map<string, MarkerEntry>>(new Map());
  const territoryEntriesRef = useRef<Map<string, TerritoryEntry>>(new Map());
  const lastProgressRef = useRef<Map<string, number>>(new Map());
  const fittedAtlasIdRef = useRef<string | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const lastBubbleRef = useRef<{ id: string; at: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const showTerritories = useAtlasStore((state) => state.showTerritories);
  const viewRequest = useAtlasStore((state) => state.viewRequest);
  const { locale, t } = useI18n();

  const clearBubble = () => {
    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    useAtlasStore.getState().setBubbleEvent(null);
  };

  useEffect(() => {
    let cancelled = false;
    let map: any;

    loadAMap()
      .then((AMap) => {
        if (cancelled || !containerRef.current) return;

        amapRef.current = AMap;
        map = new AMap.Map(containerRef.current, {
          viewMode: '2D',
          zoom: 4,
          center: INITIAL_CENTER,
          mapStyle: amapStyleId(),
          showLabel: true,
        });
        map.addControl(new AMap.Scale());
        map.on('click', () => useAtlasStore.getState().selectEvent(null));

        const syncView = () => {
          const center = map.getCenter();
          const nextZoom = map.getZoom();
          setZoom(nextZoom);
          useAtlasStore.getState().setMapView({
            lng: center.getLng(),
            lat: center.getLat(),
            zoom: nextZoom,
          });
        };
        map.on('moveend', syncView);
        map.on('zoomend', syncView);

        mapRef.current = map;
        setReady(true);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });

    return () => {
      cancelled = true;
      if (bubbleTimerRef.current !== null) window.clearTimeout(bubbleTimerRef.current);
      map?.destroy();
      mapRef.current = null;
      amapRef.current = null;
      lineEntriesRef.current.clear();
      markerEntriesRef.current.clear();
      territoryEntriesRef.current.clear();
      lastProgressRef.current.clear();
      fittedAtlasIdRef.current = null;
      setReady(false);
    };
  }, []);

  // 建立/重建时代疆域遮罩：多边形置于路线与标记之下
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldOverlays = Array.from(territoryEntriesRef.current.values()).flatMap((entry) => [
      ...entry.polygons,
      entry.label,
    ]);
    if (oldOverlays.length > 0) map.remove(oldOverlays);
    territoryEntriesRef.current.clear();

    dataset.territories.forEach((feature, index) => {
      const entity = dataset.entitiesById.get(feature.properties.entityId);
      if (!entity) return;

      const parts =
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;

      const polygons = parts.map((rings) => {
        const polygon = new AMap.Polygon({
          path: rings.map((ring) => ring.map(toGcjPoint)),
          fillColor: entity.color,
          fillOpacity: feature.properties.opacity ?? 0.16,
          strokeColor: entity.color,
          strokeOpacity: 0.55,
          strokeWeight: 1.2,
          bubble: true,
          zIndex: 10,
        });
        polygon.hide();
        map.add(polygon);
        return polygon;
      });

      const labelSource = feature.properties.label ?? feature.properties.name ?? entity.name;
      const labelPoint = feature.properties.labelPoint ?? ringCenter(parts[0] ?? []);
      const label = new AMap.Text({
        text: resolveLocalized(labelSource, locale),
        position: toGcjPoint(labelPoint),
        anchor: 'center',
        zIndex: 20,
        bubble: true,
        style: {
          'font-size': '12px',
          'font-family': '"Songti SC", "STSong", serif',
          'font-weight': '600',
          color: entity.color,
          'background-color': 'rgba(247, 241, 229, 0.78)',
          border: `1px solid ${entity.color}55`,
          'border-radius': '999px',
          padding: '1px 6px',
          'white-space': 'nowrap',
          'pointer-events': 'none',
        },
      });
      label.hide();
      map.add(label);

      const key = `${feature.properties.entityId}:${index}`;
      territoryEntriesRef.current.set(key, { feature, polygons, label });
    });
  }, [dataset, ready, locale]);

  // 建立/重建路线：只在专题或图层开关变化时执行
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldOverlays = Array.from(lineEntriesRef.current.values()).flatMap((entry) => [
      entry.line,
      ...(entry.label ? [entry.label] : []),
      ...(entry.head ? [entry.head.marker] : []),
      ...entry.ticks.map((tick) => tick.marker),
      ...entry.strongpoints.map((point) => point.marker),
    ]);
    if (oldOverlays.length > 0) map.remove(oldOverlays);

    lineEntriesRef.current.clear();
    lastProgressRef.current.clear();
    lastBubbleRef.current = null;
    clearBubble();

    const lines: any[] = [];

    for (const route of dataset.routes) {
      const entity = dataset.entitiesById.get(route.properties.entityId);
      if (!entity || !activeEntityIds.has(entity.id)) continue;

      const geometry = buildRouteGeometry(route);
      const style = routeStyleForSegmentType(route.properties.segmentType);
      const isDefense = route.properties.segmentType === 'defense';
      const isKmt = route.properties.entityId.startsWith('kmt-');
      const hasLabel = Boolean(route.properties.label);
      // 只有显式写了番号 label 的防御线才启用齿线/据点符号，避免影响其他专题
      const useDefenseSymbol = isDefense && hasLabel;
      const weight = isKmt ? (isDefense ? style.weight : Math.max(2, style.weight - 1)) : style.weight;
      const opacity = isKmt ? Math.min(style.opacity, isDefense ? 0.65 : 0.6) : style.opacity;

      const line = new AMap.Polyline({
        path: route.geometry.coordinates.map(toGcjPoint),
        strokeColor: entity.color,
        strokeWeight: weight,
        strokeOpacity: opacity,
        // 防御线用细实线打底，齿线与据点另行绘制，避免普通点虚线读成“行程”
        strokeStyle: useDefenseSymbol ? 'solid' : style.dash === 'solid' ? 'solid' : 'dashed',
        strokeDasharray: useDefenseSymbol
          ? undefined
          : style.dash === 'dotted'
            ? [2, 4]
            : style.dash === 'dashed'
              ? [10, 6]
              : undefined,
        lineJoin: 'round',
        lineCap: 'round',
        showDir: !useDefenseSymbol,
        zIndex: 50,
      });
      line.hide();
      map.add(line);

      let label: any | null = null;
      let labelPoint: [number, number] | null = null;
      let labelText = '';
      if (route.properties.label) {
        const rawPoint = route.properties.labelPoint ?? defaultLabelPoint(geometry);
        labelPoint = toGcjPoint(rawPoint);
        labelText = resolveLocalized(route.properties.label, locale);
        label = new AMap.Text({
          text: labelText,
          position: labelPoint,
          anchor: 'center',
          // 高于事件聚合气泡，避免番号牌被“2”“6”这类计数圆点盖住
          zIndex: 120,
          bubble: true,
          style: {
            'font-size': '11px',
            'font-family': '"Songti SC", "STSong", serif',
            'font-weight': '600',
            color: entity.color,
            'background-color': 'rgba(247, 241, 229, 0.9)',
            border: `1px solid ${entity.color}66`,
            'border-radius': '999px',
            padding: '1px 6px',
            'white-space': 'nowrap',
            'pointer-events': 'none',
            'box-shadow': '0 1px 4px rgba(35, 28, 21, 0.18)',
          },
        });
        label.hide();
        map.add(label);
      }

      // 线头箭头：行进中的路线在线头显示一个指向当前推进方向的箭头；防御线没有推进方向
      let head: { marker: any; element: HTMLElement } | null = null;
      if (!isDefense) {
        const element = document.createElement('span');
        element.className = 'atlas-route-head';
        element.style.setProperty('--marker-color', entity.color);
        const marker = new AMap.Marker({
          position: toGcjPoint(route.geometry.coordinates.at(-1) ?? route.geometry.coordinates[0]!),
          content: element,
          anchor: 'center',
          zIndex: 58,
          bubble: true,
        });
        marker.hide();
        map.add(marker);
        head = { marker, element };
      }

      const ticks: Array<{ marker: any; progress: number }> = [];
      if (useDefenseSymbol && geometry.totalLength >= 30000) {
        for (
          let distance = DEFENSE_TICK_INTERVAL_M / 2;
          distance < geometry.totalLength;
          distance += DEFENSE_TICK_INTERVAL_M
        ) {
          const sample = sampleRoute(geometry, distance);
          if (!sample) continue;
          const [normalEast, normalNorth] = sample.normal;
          const bearing = (Math.atan2(normalEast, normalNorth) * 180) / Math.PI;

          const element = document.createElement('span');
          element.className = 'atlas-defense-tick';
          element.style.setProperty('--marker-color', entity.color);
          element.style.transform = `rotate(${bearing}deg)`;

          const marker = new AMap.Marker({
            position: toGcjPoint(sample.point),
            content: element,
            anchor: 'center',
            zIndex: 52,
            bubble: true,
          });
          marker.hide();
          map.add(marker);
          ticks.push({ marker, progress: distance / geometry.totalLength });
        }
      }

      const strongpoints: Array<{ marker: any; progress: number }> = [];
      if (useDefenseSymbol) {
        const endpoints: Array<[[number, number], number]> = [];
        const first = route.geometry.coordinates[0];
        const last = route.geometry.coordinates.at(-1);
        if (first) endpoints.push([first, 0]);
        if (last) endpoints.push([last, 1]);

        for (const [coordinate, progress] of endpoints) {
          const element = document.createElement('span');
          element.className = 'atlas-strongpoint';
          element.style.setProperty('--marker-color', entity.color);
          const marker = new AMap.Marker({
            position: toGcjPoint(coordinate),
            content: element,
            anchor: 'center',
            zIndex: 90,
            bubble: true,
          });
          marker.hide();
          map.add(marker);
          strongpoints.push({ marker, progress });
        }
      }

      const key = `${route.properties.entityId}:${route.properties.order}:${route.properties.startDate}`;
      lineEntriesRef.current.set(key, {
        feature: route,
        geometry,
        line,
        label,
        labelPoint,
        labelText,
        // 防御线优先保留番号；其余按路线顺序，保证避让结果稳定
        labelPriority: (useDefenseSymbol ? 0 : 1000) + route.properties.order,
        head,
        progress: 0,
        ticks,
        strongpoints,
      });
      lines.push(line);
    }

    if (lines.length > 0 && fittedAtlasIdRef.current !== dataset.manifest.id) {
      if (!useAtlasStore.getState().selectedEventId) {
        map.setFitView(lines, true, [90, 90, 150, 90], 10);
        if (map.getZoom() < 4.5) {
          map.setZoomAndCenter(4.5, map.getCenter());
        }
      }
      fittedAtlasIdRef.current = dataset.manifest.id;
    }
  }, [dataset, activeEntityIds, ready, locale]);

  // 建立/重建事件 Marker：随缩放级别聚合
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldMarkers = Array.from(markerEntriesRef.current.values(), (entry) => entry.marker);
    if (oldMarkers.length > 0) map.remove(oldMarkers);
    markerEntriesRef.current.clear();

    const currentTime = useAtlasStore.getState().currentTime;
    const filteredEvents = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const clusters = clusterEvents(filteredEvents, zoom);
    const latest = latestEventAt(filteredEvents, currentTime);

    for (const cluster of clusters) {
      const primaryEntityId = cluster.events[0]?.entityIds[0];
      const entity = primaryEntityId ? dataset.entitiesById.get(primaryEntityId) : undefined;
      const color = entity?.color ?? '#8c2f24';
      const point = wgs84ToGcj02(cluster.center[0], cluster.center[1]);
      const isCluster = cluster.events.length > 1;

      const element = document.createElement('button');
      element.type = 'button';
      element.className = isCluster ? 'atlas-marker atlas-marker--cluster' : 'atlas-marker';
      element.style.setProperty('--marker-color', color);
      element.innerHTML = isCluster
        ? `<span class="atlas-marker__count">${cluster.events.length}</span>`
        : '<span class="atlas-marker__dot"></span>';
      element.setAttribute(
        'aria-label',
        isCluster
          ? t('map.clusterLabel', { count: cluster.events.length })
          : t('map.eventLabel', { name: resolveLocalized(cluster.events[0]!.name, locale) }),
      );

      const countEl = isCluster
        ? element.querySelector<HTMLSpanElement>('.atlas-marker__count')
        : null;

      element.addEventListener('click', (clickEvent) => {
        clickEvent.stopPropagation();
        const state = useAtlasStore.getState();
        const visibleEvents = cluster.events.filter(
          (event) => eventStart(event) <= state.currentTime,
        );
        if (visibleEvents.length === 1) {
          state.pause();
          state.selectEvent(visibleEvents[0]!.id);
          clearBubble();
          return;
        }
        const currentMap = mapRef.current;
        if (!currentMap) return;
        const target = wgs84ToGcj02(cluster.center[0], cluster.center[1]);
        currentMap.setZoomAndCenter(
          Math.min(currentMap.getZoom() + 2, 12),
          [target.lng, target.lat],
          true,
        );
      });

      const marker = new AMap.Marker({
        position: [point.lng, point.lat],
        content: element,
        anchor: 'bottom-center',
        zIndex: isCluster ? 110 : 100,
      });

      const visibleEvents = cluster.events.filter((event) => eventStart(event) <= currentTime);
      if (visibleEvents.length === 0) {
        marker.hide();
      } else {
        marker.show();
        element.classList.toggle(
          'atlas-marker--active',
          visibleEvents.some((event) => event.id === latest?.id),
        );
      }
      map.add(marker);

      markerEntriesRef.current.set(cluster.id, { cluster, marker, element, countEl });
    }
  }, [dataset, activeEntityIds, filters, ready, zoom, locale]);

  // 时间变化：更新路线截断与 Marker 可见性
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!dataset || !ready || !map || !AMap) return;

    for (const [key, entry] of lineEntriesRef.current) {
      const start = parseDateString(entry.feature.properties.startDate);
      const end = parseDateString(entry.feature.properties.endDate);
      const rawProgress =
        end === start
          ? currentTime >= end
            ? 1
            : -1
          : (currentTime - start) / (end - start);

      const previous = lastProgressRef.current.get(key) ?? -1;
      if (rawProgress < 0) {
        entry.line.hide();
        entry.label?.hide();
        entry.progress = 0;
        entry.head?.marker.hide();
        for (const tick of entry.ticks) tick.marker.hide();
        for (const point of entry.strongpoints) point.marker.hide();
        lastProgressRef.current.set(key, 0);
        continue;
      }

      // 起点当天也显示一小段，避免路线在出发日完全消失
      const progress = rawProgress === 0 ? 0.001 : Math.min(1, rawProgress);
      const pathChanged = Math.abs(progress - previous) >= 0.001;
      entry.progress = progress;

      if (pathChanged) {
        const path = partialPathAt(entry.geometry, progress).map(toGcjPoint);
        if (path.length < 2) {
          entry.line.hide();
          entry.label?.hide();
          entry.head?.marker.hide();
          for (const tick of entry.ticks) tick.marker.hide();
          for (const point of entry.strongpoints) point.marker.hide();
          continue;
        }
        entry.line.setPath(path);
        lastProgressRef.current.set(key, progress);
      }

      entry.line.show();

      // 线头箭头：显示在路线当前推进位置，路线走完后收起
      if (entry.head) {
        const sample =
          zoom >= ROUTE_HEAD_MIN_ZOOM && progress > 0.01 && progress < 0.999
            ? sampleRoute(entry.geometry, entry.geometry.totalLength * progress)
            : null;
        if (sample) {
          entry.head.marker.setPosition(toGcjPoint(sample.point));
          entry.head.element.style.transform = `rotate(${sample.bearing}deg)`;
          entry.head.marker.show();
        } else {
          entry.head.marker.hide();
        }
      }

      // 防御齿线：只显示已经被时间轴“画到”的部分；缩放过小时退化为细实线
      for (const tick of entry.ticks) {
        const visible = zoom >= DEFENSE_TICK_MIN_ZOOM && tick.progress <= progress + 0.001;
        tick.marker[visible ? 'show' : 'hide']();
      }

      // 据点：起点在路线出现后显示，终点在路线走完后显示
      for (const point of entry.strongpoints) {
        const visible = point.progress === 0 ? progress > 0 : progress >= 0.999;
        point.marker[visible ? 'show' : 'hide']();
      }
    }

    // 番号牌：先按时间与缩放筛选，再做屏幕空间避让，重叠时保留优先级高的
    const labelCandidates = Array.from(lineEntriesRef.current.values())
      .filter((entry) => entry.label !== null)
      .sort((a, b) => a.labelPriority - b.labelPriority);

    const placedRects: ScreenRect[] = [];
    for (const entry of labelCandidates) {
      const label = entry.label;
      const point = entry.labelPoint;
      if (!label) continue;
      const visible =
        zoom >= ROUTE_LABEL_MIN_ZOOM &&
        entry.progress >= ROUTE_LABEL_PROGRESS &&
        point !== null;
      if (!visible || !point) {
        label.hide();
        continue;
      }
      const containerPoint = map.lngLatToContainer(new AMap.LngLat(point[0], point[1]));
      const rect = estimateLabelRect(entry.labelText, containerPoint.x, containerPoint.y);
      if (placedRects.some((placed) => rectsOverlap(placed, rect))) {
        label.hide();
        continue;
      }
      placedRects.push(rect);
      label.show();
    }


    for (const entry of territoryEntriesRef.current.values()) {
      const { feature } = entry;
      const start = parseDateString(feature.properties.startDate);
      const end = parseDateString(feature.properties.endDate);
      const visible =
        showTerritories &&
        activeEntityIds.has(feature.properties.entityId) &&
        currentTime >= start &&
        currentTime <= end;
      for (const polygon of entry.polygons) {
        polygon[visible ? 'show' : 'hide']();
      }
      entry.label[visible ? 'show' : 'hide']();
    }

    const activeEvents = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const latest = latestEventAt(activeEvents, currentTime);

    for (const entry of markerEntriesRef.current.values()) {
      const visibleEvents = entry.cluster.events.filter(
        (event) => eventStart(event) <= currentTime,
      );
      const visible = visibleEvents.length > 0;
      entry.marker[visible ? 'show' : 'hide']();
      if (!visible) continue;

      if (entry.countEl) {
        entry.countEl.textContent = String(visibleEvents.length);
      }
      entry.element.classList.toggle(
        'atlas-marker--active',
        visibleEvents.some((event) => event.id === latest?.id),
      );
    }
  }, [currentTime, dataset, activeEntityIds, filters, ready, showTerritories, locale, zoom]);

  // 播放跨过事件时弹出气泡（固定 UI，避免 InfoWindow 被视口裁切）
  useEffect(() => {
    const setBubbleEvent = useAtlasStore.getState().setBubbleEvent;

    if (!ready || !dataset || !playing) {
      lastBubbleRef.current = null;
      setBubbleEvent(null);
      return;
    }

    const activeEvents = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const latest = latestEventAt(activeEvents, currentTime);
    if (!latest) return;

    const previous = lastBubbleRef.current;
    if (previous?.id === latest.id) return;

    const now = Date.now();
    if (previous && now - previous.at < BUBBLE_MIN_GAP_MS) return;

    lastBubbleRef.current = { id: latest.id, at: now };
    setBubbleEvent(latest.id);

    if (bubbleTimerRef.current !== null) window.clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => {
      useAtlasStore.getState().setBubbleEvent(null);
      bubbleTimerRef.current = null;
    }, BUBBLE_DURATION_MS);
  }, [currentTime, playing, dataset, activeEntityIds, filters, ready]);

  // 选中事件后定位（深链带 view 时优先恢复视野）
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !dataset || !selectedEventId) return;
    if (useAtlasStore.getState().viewRequest) return;

    const event = dataset.eventsById.get(selectedEventId);
    if (!event) return;

    const point = wgs84ToGcj02(event.location.lng, event.location.lat);
    const zoom = Math.max(map.getZoom(), 6);

    // 放到下一帧，确保不会被同批 effect 里的 fitView 覆盖
    const frame = window.requestAnimationFrame(() => {
      if (mapRef.current === map) {
        map.setZoomAndCenter(zoom, [point.lng, point.lat], true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedEventId, dataset, ready]);

  // 深链恢复视野
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !viewRequest) return;
    map.setZoomAndCenter(
      viewRequest.view.zoom,
      [viewRequest.view.lng, viewRequest.view.lat],
      true,
    );
    useAtlasStore.setState({ viewRequest: null });
  }, [viewRequest, ready]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" aria-label={t('map.title')} />

      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-parchment/95 p-6">
          <div className="max-w-md rounded-2xl border border-cinnabar/30 bg-parchment p-6 text-center shadow-panel">
            <h2 className="font-serif text-xl text-cinnabar">{t('map.errorTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{error}</p>
            <p className="mt-3 text-xs leading-5 text-ink-soft/70">
              {t('map.errorBody')}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
