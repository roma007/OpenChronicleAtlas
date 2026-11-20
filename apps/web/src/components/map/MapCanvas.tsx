import type {
  AtlasEvent,
  AtlasRegion,
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
  matchesRegionFilter,
  isRegionDescendant,
  parseDateString,
  partialPathAt,
  regionAncestors,
  regionShortName,
  resolveLocalized,
  routeStyleForSegmentType,
  segmentTypeLabel,
  wgs84ToGcj02,
} from '@atlas/shared';
import { useEffect, useRef, useState } from 'react';
import { amapStyleId, loadAMap } from '../../map/amap';
import { routeProgress, sampleRouteAt } from '../../map/route-visuals';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { useI18n } from '../../hooks/useI18n';
import { RouteTooltip } from './RouteTooltip';

const INITIAL_CENTER: [number, number] = [106.5, 32];
const BUBBLE_DURATION_MS = 4000;
const BUBBLE_MIN_GAP_MS = 1200;
/** 拖动时间轴时的事件气泡：跟手更新，不需要播放时那么长的间隔 */
const SCRUB_BUBBLE_MIN_GAP_MS = 120;
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;
const DEFENSE_TICK_INTERVAL_M = 24000;
const DEFENSE_TICK_MIN_ZOOM = 6;
const ROUTE_LABEL_MIN_ZOOM = 6;
const ROUTE_LABEL_PROGRESS = 0.45;
const ROUTE_HEAD_MIN_ZOOM = 5;
const ROUTE_LABEL_PADDING_PX = 3;
/** 线头尾迹长度（米），只画在活跃路线的线头后方 */
const ROUTE_TRAIL_LENGTH_M = 14000;
/** 抵达涟漪持续时间 */
const ROUTE_ARRIVAL_MS = 1500;
/** 拖动时间轴时限制涟漪密度：同时最多几圈、两圈之间至少隔多久 */
const ARRIVAL_MAX_ACTIVE = 6;
const ARRIVAL_MIN_GAP_MS = 90;
/** 未尽之路（淡墨预告线）最低缩放 */
const ROUTE_GHOST_MIN_ZOOM = 5;
/** 到达该缩放级别后，同一格内的多个事件改为散点显示，避免聚合点无法展开 */
const MARKER_SPIDERFY_ZOOM = 12;
const MARKER_SPIDERFY_RADIUS_PX = 22;

interface LineEntry {
  feature: AtlasRouteFeature;
  geometry: RouteGeometry;
  line: any;
  /** 未尽之路：整条路线的淡墨虚线，行进时垫在实线下面 */
  ghost: any | null;
  /** 线头后方的光晕尾迹 */
  trail: any | null;
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
  /** 跨省路线筛选时显示的起点、终点标签 */
  endpointMarkers: any[];
  endpointMeta: Array<{ point: [number, number]; text: string }>;
  /** 原始线宽与透明度，缩放、聚焦时在此基础上调整 */
  baseWeight: number;
  baseOpacity: number;
  dimmed: boolean;
}

interface RouteTipState {
  x: number;
  y: number;
  title: string;
  meta: string;
  detail?: string;
}

interface ScreenRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface MarkerEntry {
  events: AtlasEvent[];
  marker: any;
  element: HTMLButtonElement;
  countEl: HTMLSpanElement | null;
}

interface MarkerGroup {
  key: string;
  events: AtlasEvent[];
  center: [number, number];
  offset: { x: number; y: number } | null;
}

interface TerritoryEntry {
  feature: AtlasTerritoryFeature;
  polygons: any[];
  label: any;
}

interface RegionLabelEntry {
  region: AtlasRegion;
  label: any;
  text: string;
  point: [number, number];
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
): ReturnType<typeof sampleRouteAt> {
  return sampleRouteAt(geometry, distance);
}

/** 线头后方一小段尾迹：按等弧长采样，保证折线均匀 */
function trailPath(geometry: RouteGeometry, progress: number): [number, number][] {
  const end = geometry.totalLength * progress;
  const start = Math.max(0, end - ROUTE_TRAIL_LENGTH_M);
  const steps = 10;
  const points: [number, number][] = [];
  for (let index = 0; index <= steps; index += 1) {
    const sample = sampleRoute(geometry, start + ((end - start) * index) / steps);
    if (sample) points.push(toGcjPoint(sample.point));
  }
  return points;
}

/** 抵达终点时放一圈扩散涟漪，1.5s 后自动移除；拖动时间轴时按密度限流 */
interface ArrivalState {
  timers: number[];
  active: number;
  lastAt: number;
}

function emitArrival(
  map: any,
  AMap: any,
  point: [number, number],
  color: string,
  state: ArrivalState,
) {
  const now = performance.now();
  if (
    state.active >= ARRIVAL_MAX_ACTIVE ||
    now - state.lastAt < ARRIVAL_MIN_GAP_MS
  ) {
    return;
  }
  state.active += 1;
  state.lastAt = now;

  const element = document.createElement('span');
  element.className = 'atlas-arrival';
  element.style.setProperty('--marker-color', color);
  const marker = new AMap.Marker({
    position: toGcjPoint(point),
    content: element,
    anchor: 'center',
    zIndex: 96,
    bubble: true,
  });
  map.add(marker);
  state.timers.push(
    window.setTimeout(() => {
      map.remove(marker);
      state.active = Math.max(0, state.active - 1);
    }, ROUTE_ARRIVAL_MS + 200),
  );
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

/** 从「北平—保定」这类路线名里取起终点，供跨省筛选时标注 */
function routeEndpointLabels(
  route: AtlasRouteFeature,
  locale: 'zh' | 'en',
): [string, string] {
  const raw = resolveLocalized(route.properties.name, locale);
  const cleaned = raw.replace(/（[^）]*）|\([^)]*\)/g, '').trim();
  const parts = cleaned
    .split(/[—–\-→至]/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) return [parts[0]!, parts.at(-1)!];
  return ['', ''];
}

function endpointElement(text: string, kind: 'start' | 'end'): HTMLElement {
  const element = document.createElement('span');
  element.className = 'atlas-route-endpoint';
  element.dataset.kind = kind;
  element.textContent = text;
  return element;
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const amapRef = useRef<any>(null);
  const lineEntriesRef = useRef<Map<string, LineEntry>>(new Map());
  const markerEntriesRef = useRef<Map<string, MarkerEntry>>(new Map());
  const territoryEntriesRef = useRef<Map<string, TerritoryEntry>>(new Map());
  const regionLabelEntriesRef = useRef<Map<string, RegionLabelEntry>>(new Map());
  const routeHighlightRef = useRef<{ halo: any; line: any } | null>(null);
  const lastProgressRef = useRef<Map<string, number>>(new Map());
  const fittedAtlasIdRef = useRef<string | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const lastBubbleRef = useRef<{ id: string; at: number } | null>(null);
  const arrivalStateRef = useRef<ArrivalState>({ timers: [], active: 0, lastAt: -Infinity });
  const zoomScaleRef = useRef(1);

  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [routeTip, setRouteTip] = useState<RouteTipState | null>(null);
  const [regionTip, setRegionTip] = useState<RouteTipState | null>(null);

  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const scrubbing = useAtlasStore((state) => state.scrubbing);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const showTerritories = useAtlasStore((state) => state.showTerritories);
  const showAdminBoundaries = useAtlasStore((state) => state.showAdminBoundaries);
  const showRegionLabels = useAtlasStore((state) => state.showRegionLabels);
  const viewRequest = useAtlasStore((state) => state.viewRequest);
  const regionFocus = useAtlasStore((state) => state.regionFocus);
  const routeFocus = useAtlasStore((state) => state.routeFocus);
  const selectedRoute = useAtlasStore((state) => state.selectedRoute);
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
        map.on('click', () => {
          const state = useAtlasStore.getState();
          state.selectEvent(null);
          state.selectRoute(null);
        });

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
        if (import.meta.env.DEV) {
          (window as unknown as { __atlasMap?: any }).__atlasMap = map;
        }
        setReady(true);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });

    return () => {
      cancelled = true;
      if (bubbleTimerRef.current !== null) window.clearTimeout(bubbleTimerRef.current);
      for (const timer of arrivalStateRef.current.timers) window.clearTimeout(timer);
      arrivalStateRef.current = { timers: [], active: 0, lastAt: -Infinity };
      map?.destroy();
      mapRef.current = null;
      amapRef.current = null;
      lineEntriesRef.current.clear();
      markerEntriesRef.current.clear();
      territoryEntriesRef.current.clear();
      regionLabelEntriesRef.current.clear();
      routeHighlightRef.current = null;
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
      const ext = feature.properties.extensions ?? {};
      const isAdmin = ext.kind === 'admin-boundary';
      const adminRegionId = typeof ext.regionId === 'string' ? ext.regionId : undefined;
      const adminRegion = adminRegionId
        ? dataset.regionsById.get(adminRegionId)
        : undefined;

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
          'pointer-events': isAdmin && adminRegionId ? 'auto' : 'none',
          cursor: isAdmin && adminRegionId ? 'pointer' : 'default',
        },
      });
      label.hide();
      map.add(label);
      if (isAdmin && adminRegionId && adminRegion) {
        const element = label.dom as HTMLElement | undefined;
        element?.addEventListener('click', () => {
          useAtlasStore.getState().toggleRegion(adminRegionId);
        });
        element?.addEventListener('mouseover', (event: MouseEvent) => {
          setRegionTip({
            x: event.clientX,
            y: event.clientY,
            title: resolveLocalized(adminRegion.name, locale),
            meta: [
              t('region.level.province'),
              adminRegion.modernName
                ? resolveLocalized(adminRegion.modernName, locale)
                : '',
            ]
              .filter(Boolean)
              .join(' · '),
            detail: t('region.source.admin-boundary'),
          });
        });
        element?.addEventListener('mouseout', () => setRegionTip(null));
      }

      const key = `${feature.properties.entityId}:${index}`;
      territoryEntriesRef.current.set(key, { feature, polygons, label });
    });
  }, [dataset, ready, locale, t]);

  // 地区标注：县市/地点/院辖市的当时名称，按缩放级别与选区显示
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldLabels = Array.from(regionLabelEntriesRef.current.values(), (entry) => entry.label);
    if (oldLabels.length > 0) map.remove(oldLabels);
    regionLabelEntriesRef.current.clear();

    if (!showRegionLabels) {
      setRegionTip(null);
      return;
    }

    for (const region of dataset.regions) {
      if (!region.point) continue;
      if (region.level !== 'county' && region.level !== 'place' && region.level !== 'municipality') {
        continue;
      }
      const pointSource =
        typeof region.extensions?.pointSource === 'string'
          ? region.extensions.pointSource
          : undefined;
      const isPlace = region.level === 'place';
      const isApprox = region.level === 'county' && pointSource === 'event-average';
      const prefix = isPlace ? '· ' : isApprox ? '≈ ' : '◎ ';
      const labelName =
        region.level === 'county'
          ? resolveLocalized(region.name, locale)
          : regionShortName(region, locale);
      const text = `${prefix}${labelName}`;
      const label = new AMap.Text({
        text,
        position: toGcjPoint(region.point),
        anchor: 'center',
        zIndex: 34,
        bubble: true,
        style: isPlace
          ? {
              'font-size': '9px',
              'font-family': '"Songti SC", "STSong", serif',
              color: '#5b7f6b',
              'background-color': 'rgba(247, 241, 229, 0.7)',
              border: '1px solid rgba(91, 127, 107, 0.3)',
              'border-radius': '999px',
              padding: '0 4px',
              'white-space': 'nowrap',
              'pointer-events': 'auto',
              cursor: 'pointer',
            }
          : {
              'font-size': '10px',
              'font-family': '"Songti SC", "STSong", serif',
              'font-weight': '600',
              color: isApprox ? '#8a6a3b' : '#231c15',
              'background-color': isApprox
                ? 'rgba(247, 241, 229, 0.78)'
                : 'rgba(247, 241, 229, 0.92)',
              border: isApprox
                ? '1px dashed rgba(138, 106, 59, 0.5)'
                : '1px solid rgba(74, 61, 48, 0.22)',
              'border-radius': '999px',
              padding: '0 5px',
              'white-space': 'nowrap',
              'pointer-events': 'auto',
              cursor: 'pointer',
              'box-shadow': '0 1px 3px rgba(35, 28, 21, 0.12)',
            },
      });
      label.hide();
      map.add(label);
      const element = label.dom as HTMLElement | undefined;
      if (element) {
        element.addEventListener('click', () => {
          useAtlasStore.getState().toggleRegion(region.id);
        });
        element.addEventListener('mouseover', (event: MouseEvent) => {
          const modern = region.modernName
            ? resolveLocalized(region.modernName, locale)
            : '';
          const sourceKey = pointSource
            ? (`region.source.${pointSource}` as Parameters<typeof t>[0])
            : undefined;
          setRegionTip({
            x: event.clientX,
            y: event.clientY,
            title: text,
            meta: [t(`region.level.${region.level}`), modern].filter(Boolean).join(' · '),
            detail: sourceKey ? t(sourceKey) : undefined,
          });
        });
        element.addEventListener('mouseout', () => setRegionTip(null));
      }
      regionLabelEntriesRef.current.set(region.id, {
        region,
        label,
        text,
        point: region.point,
      });
    }
  }, [dataset, ready, locale, showRegionLabels, t]);

  // 建立/重建路线：只在专题或图层开关变化时执行
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldOverlays = Array.from(lineEntriesRef.current.values()).flatMap((entry) => [
      entry.line,
      ...(entry.ghost ? [entry.ghost] : []),
      ...(entry.trail ? [entry.trail] : []),
      ...(entry.label ? [entry.label] : []),
      ...(entry.head ? [entry.head.marker] : []),
      ...entry.ticks.map((tick) => tick.marker),
      ...entry.strongpoints.map((point) => point.marker),
      ...entry.endpointMarkers,
    ]);
    if (oldOverlays.length > 0) map.remove(oldOverlays);

    lineEntriesRef.current.clear();
    lastProgressRef.current.clear();
    lastBubbleRef.current = null;
    setRouteTip(null);
    clearBubble();

    const lines: any[] = [];
    const firstLevelIds = new Set(
      dataset.regions
        .filter(
          (region) =>
            region.level === 'province' ||
            region.level === 'municipality' ||
            region.level === 'overseas',
        )
        .map((region) => region.id),
    );

    for (const route of dataset.routes) {
      const entity = dataset.entitiesById.get(route.properties.entityId);
      if (!entity) continue;
      // legend: false 的实体（如海防线）不进入图例，但作为地图背景始终显示。
      const alwaysVisible = entity.extensions?.legend === false;
      if (!alwaysVisible && !activeEntityIds.has(entity.id)) continue;
      if (
        !alwaysVisible &&
        filters.regionIds.length > 0 &&
        !matchesRegionFilter(route.properties.regionIds, filters.regionIds)
      ) {
        continue;
      }

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

      // 未尽之路：整条路线先铺一层淡墨虚线，已走部分由实线盖上去
      const ghost = new AMap.Polyline({
        path: route.geometry.coordinates.map(toGcjPoint),
        strokeColor: entity.color,
        strokeWeight: Math.max(1.5, weight * 0.55),
        strokeOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [3, 8],
        lineJoin: 'round',
        lineCap: 'round',
        bubble: true,
        zIndex: 42,
      });
      ghost.hide();
      map.add(ghost);

      // 线头尾迹：一段逐渐收窄的光晕，跟着线头走
      let trail: any | null = null;
      if (!isDefense) {
        trail = new AMap.Polyline({
          path: route.geometry.coordinates.slice(0, 2).map(toGcjPoint),
          strokeColor: entity.color,
          strokeWeight: weight + 4,
          strokeOpacity: 0.28,
          lineJoin: 'round',
          lineCap: 'round',
          bubble: true,
          zIndex: 56,
        });
        trail.hide();
        map.add(trail);
      }

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

      // 线头：笔尖光点 + 扩散环；防御线没有推进方向
      let head: { marker: any; element: HTMLElement } | null = null;
      if (!isDefense) {
        const element = document.createElement('span');
        element.className = 'atlas-route-head';
        element.style.setProperty('--marker-color', entity.color);
        const core = document.createElement('span');
        core.className = 'atlas-route-head__core';
        const ping = document.createElement('span');
        ping.className = 'atlas-route-head__ping';
        element.append(core, ping);
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

      // 悬停：浮签 + 加粗高亮；点击缩放到整条路线
      const tipTitle = resolveLocalized(
        route.properties.name ?? route.properties.label ?? entity.name,
        locale,
      );
      const tipMeta = `${segmentTypeLabel(route.properties.segmentType, locale)} · ${route.properties.startDate} → ${route.properties.endDate}`;
      const tipDetail =
        route.properties.name && route.properties.label
          ? resolveLocalized(route.properties.label, locale)
          : undefined;
      const restore = () => {
        line.setOptions({
          strokeWeight: weight * zoomScaleRef.current,
          strokeOpacity: opacity,
          zIndex: 50,
        });
        if (map.getContainer) map.getContainer().style.cursor = '';
      };
      line.on('mouseover', (event: any) => {
        line.setOptions({
          strokeWeight: weight * zoomScaleRef.current + 2.5,
          strokeOpacity: Math.min(1, opacity + 0.15),
          zIndex: 62,
        });
        if (map.getContainer) map.getContainer().style.cursor = 'pointer';
        const pointer = event?.originEvent as MouseEvent | undefined;
        setRouteTip({
          x: pointer?.clientX ?? 0,
          y: pointer?.clientY ?? 0,
          title: tipTitle,
          meta: tipMeta,
          detail: tipDetail,
        });
      });
      line.on('mouseout', () => {
        restore();
        setRouteTip(null);
      });
      line.on('click', () => {
        useAtlasStore.getState().selectRoute({
          entityId: route.properties.entityId,
          order: route.properties.order,
        });
        map.setFitView([line], true, [80, 80, 120, 80]);
      });

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

      const endpointLabels = routeEndpointLabels(route, locale);
      const crossesRegions =
        new Set(
          (route.properties.regionIds ?? []).filter((id) => firstLevelIds.has(id)),
        ).size > 1;
      const endpointMeta: Array<{ point: [number, number]; text: string }> = [];
      const endpointMarkers = crossesRegions
        ? [route.geometry.coordinates[0], route.geometry.coordinates.at(-1)]
            .filter((coordinate): coordinate is [number, number] => Boolean(coordinate))
            .map((coordinate, index) => {
              const label = endpointLabels[index] || (locale === 'en' ? (index === 0 ? 'Start' : 'End') : (index === 0 ? '起点' : '终点'));
              const prefix = locale === 'en' ? (index === 0 ? 'From ' : 'To ') : (index === 0 ? '起 ' : '终 ');
              const text = `${prefix}${label}`;
              endpointMeta.push({ point: coordinate, text });
              const element = endpointElement(text, index === 0 ? 'start' : 'end');
              const marker = new AMap.Marker({
                position: toGcjPoint(coordinate),
                content: element,
                anchor: 'bottom-center',
                zIndex: 140,
                bubble: true,
              });
              marker.hide();
              map.add(marker);
              return marker;
            })
        : [];

      const key = `${route.properties.entityId}:${route.properties.order}:${route.properties.startDate}`;
      lineEntriesRef.current.set(key, {
        feature: route,
        geometry,
        line,
        ghost,
        trail,
        label,
        labelPoint,
        labelText,
        // 防御线优先保留番号；其余按路线顺序，保证避让结果稳定
        labelPriority: (useDefenseSymbol ? 0 : 1000) + route.properties.order,
        head,
        progress: 0,
        ticks,
        strongpoints,
        endpointMarkers,
        endpointMeta,
        baseWeight: weight,
        baseOpacity: opacity,
        dimmed: false,
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
  }, [dataset, activeEntityIds, ready, locale, filters.regionIds]);

  // 选中路线：叠一层高亮线 + 外层光晕
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    if (routeHighlightRef.current) {
      map.remove([routeHighlightRef.current.halo, routeHighlightRef.current.line]);
      routeHighlightRef.current = null;
    }
    if (!selectedRoute) return;
    const route = dataset.routes.find(
      (item) =>
        item.properties.entityId === selectedRoute.entityId &&
        item.properties.order === selectedRoute.order,
    );
    if (!route) return;
    const path = route.geometry.coordinates.map(toGcjPoint);
    const halo = new AMap.Polyline({
      path,
      strokeColor: '#f3ead9',
      strokeWeight: 9,
      strokeOpacity: 0.55,
      lineJoin: 'round',
      lineCap: 'round',
      bubble: true,
      zIndex: 78,
    });
    const line = new AMap.Polyline({
      path,
      strokeColor: '#8c2f24',
      strokeWeight: 4.5,
      strokeOpacity: 0.95,
      lineJoin: 'round',
      lineCap: 'round',
      showDir: true,
      bubble: true,
      zIndex: 79,
    });
    map.add(halo);
    map.add(line);
    routeHighlightRef.current = { halo, line };

    return () => {
      if (routeHighlightRef.current) {
        map.remove([routeHighlightRef.current.halo, routeHighlightRef.current.line]);
        routeHighlightRef.current = null;
      }
    };
  }, [selectedRoute, dataset, ready]);

  // 缩放变化时微调线宽：总览更细，放大更醒目
  useEffect(() => {
    if (!ready) return;
    const scale = zoom <= 5 ? 0.78 : zoom >= 9 ? 1.45 : 1;
    zoomScaleRef.current = scale;
    for (const entry of lineEntriesRef.current.values()) {
      entry.line.setOptions({ strokeWeight: entry.baseWeight * scale });
    }
  }, [zoom, ready, dataset]);

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

    // 高缩放级别下把共址事件散开，让每个事件都有自己的圆点
    const markerGroups = clusters.flatMap((cluster): MarkerGroup[] => {
      if (zoom < MARKER_SPIDERFY_ZOOM || cluster.events.length < 2) {
        return [
          { key: cluster.id, events: cluster.events, center: cluster.center, offset: null },
        ];
      }
      // 只把真正贴在一起（约 100m 内）的事件拆成环，位置本就分开的保持原位
      const buckets = new Map<string, AtlasEvent[]>();
      for (const event of cluster.events) {
        const bucketKey = `${Math.round(event.location.lng * 1000)}:${Math.round(event.location.lat * 1000)}`;
        const bucket = buckets.get(bucketKey);
        if (bucket) bucket.push(event);
        else buckets.set(bucketKey, [event]);
      }
      return [...buckets.entries()].flatMap(([bucketKey, events]): MarkerGroup[] => {
        if (events.length === 1) {
          const event = events[0]!;
          return [
            {
              key: `${cluster.id}:${bucketKey}`,
              events,
              center: [event.location.lng, event.location.lat],
              offset: null,
            },
          ];
        }
        return events.map((event, index) => {
          const angle = (index / events.length) * Math.PI * 2 - Math.PI / 2;
          return {
            key: `${cluster.id}:${bucketKey}:${event.id}`,
            events: [event],
            center: [event.location.lng, event.location.lat] as [number, number],
            offset: {
              x: Math.cos(angle) * MARKER_SPIDERFY_RADIUS_PX,
              y: Math.sin(angle) * MARKER_SPIDERFY_RADIUS_PX,
            },
          };
        });
      });
    });

    for (const group of markerGroups) {
      const primaryEntityId = group.events[0]?.entityIds[0];
      const entity = primaryEntityId ? dataset.entitiesById.get(primaryEntityId) : undefined;
      const color = entity?.color ?? '#8c2f24';
      const point = wgs84ToGcj02(group.center[0], group.center[1]);
      const isCluster = group.events.length > 1;

      const element = document.createElement('button');
      element.type = 'button';
      element.className = isCluster ? 'atlas-marker atlas-marker--cluster' : 'atlas-marker';
      element.style.setProperty('--marker-color', color);
      element.innerHTML = isCluster
        ? `<span class="atlas-marker__count">${group.events.length}</span>`
        : '<span class="atlas-marker__dot"></span>';
      element.setAttribute(
        'aria-label',
        isCluster
          ? t('map.clusterLabel', { count: group.events.length })
          : t('map.eventLabel', { name: resolveLocalized(group.events[0]!.name, locale) }),
      );

      const countEl = isCluster
        ? element.querySelector<HTMLSpanElement>('.atlas-marker__count')
        : null;

      element.addEventListener('click', (clickEvent) => {
        clickEvent.stopPropagation();
        const state = useAtlasStore.getState();
        const visibleEvents = group.events.filter(
          (event) => eventStart(event) <= state.currentTime,
        );
        if (visibleEvents.length === 1) {
          state.pause();
          state.selectEvent(visibleEvents[0]!.id);
          clearBubble();
          return;
        }
        if (visibleEvents.length === 0) return;
        const currentMap = mapRef.current;
        if (!currentMap) return;
        const target = wgs84ToGcj02(group.center[0], group.center[1]);
        currentMap.setZoomAndCenter(
          Math.min(currentMap.getZoom() + 2, MARKER_SPIDERFY_ZOOM),
          [target.lng, target.lat],
          true,
        );
      });

      const marker = new AMap.Marker({
        position: [point.lng, point.lat],
        content: element,
        anchor: group.offset ? 'center' : 'bottom-center',
        zIndex: isCluster ? 110 : 100,
        ...(group.offset
          ? { offset: new AMap.Pixel(group.offset.x, group.offset.y) }
          : {}),
      });

      const visibleEvents = group.events.filter((event) => eventStart(event) <= currentTime);
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

      markerEntriesRef.current.set(group.key, {
        events: group.events,
        marker,
        element,
        countEl,
      });
    }
  }, [dataset, activeEntityIds, filters, ready, zoom, locale]);

  // 时间变化：更新路线截断与 Marker 可见性
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!dataset || !ready || !map || !AMap) return;

    const showEndpoints = filters.regionIds.length > 0 && zoom >= 6;

    for (const [key, entry] of lineEntriesRef.current) {
      const rawProgress = routeProgress(entry.feature, currentTime);
      const previous = lastProgressRef.current.get(key) ?? -1;

      if (rawProgress < 0) {
        entry.line.hide();
        entry.ghost?.hide();
        entry.trail?.hide();
        entry.label?.hide();
        entry.progress = 0;
        entry.head?.marker.hide();
        for (const tick of entry.ticks) tick.marker.hide();
        for (const point of entry.strongpoints) point.marker.hide();
        for (const marker of entry.endpointMarkers) marker.hide();
        lastProgressRef.current.set(key, 0);
        continue;
      }

      // 起点当天也显示一小段，避免路线在出发日完全消失
      const progress = rawProgress === 0 ? 0.001 : rawProgress;
      const pathChanged = Math.abs(progress - previous) >= 0.001;
      entry.progress = progress;

      if (pathChanged) {
        const path = partialPathAt(entry.geometry, progress).map(toGcjPoint);
        if (path.length < 2) {
          entry.line.hide();
          entry.ghost?.hide();
          entry.trail?.hide();
          entry.label?.hide();
          entry.head?.marker.hide();
          for (const tick of entry.ticks) tick.marker.hide();
          for (const point of entry.strongpoints) point.marker.hide();
          for (const marker of entry.endpointMarkers) marker.hide();
          continue;
        }
        entry.line.setPath(path);
        lastProgressRef.current.set(key, progress);
      }

      // 抵达终点：放一圈涟漪。播放和拖动时都触发，拖动时按密度限流
      if (previous > 0 && previous < 0.999 && progress >= 0.999) {
        const end = entry.geometry.coordinates.at(-1);
        const entity = dataset.entitiesById.get(entry.feature.properties.entityId);
        if (end) {
          emitArrival(map, AMap, end, entity?.color ?? '#8c2f24', arrivalStateRef.current);
        }
      }

      entry.line.show();
      for (const marker of entry.endpointMarkers) {
        marker[showEndpoints ? 'show' : 'hide']();
      }

      // 未尽之路：整条路线淡墨虚线，已走部分被实线覆盖
      entry.ghost?.[progress < 0.999 && zoom >= ROUTE_GHOST_MIN_ZOOM ? 'show' : 'hide']();

      // 线头尾迹：线头后方 14km 的光晕，跟着推进位置走
      if (entry.trail) {
        const trailVisible =
          zoom >= ROUTE_HEAD_MIN_ZOOM && progress > 0.01 && progress < 0.999;
        if (trailVisible) {
          entry.trail.setPath(trailPath(entry.geometry, progress));
          entry.trail.show();
        } else {
          entry.trail.hide();
        }
      }

      // 线头：显示在路线当前推进位置，路线走完后收起
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

      // 聚焦当前：播放或拖动时间轴时，压暗已经走完的路线
      const shouldDim = (playing || scrubbing) && progress >= 0.999;
      if (shouldDim !== entry.dimmed) {
        entry.line.setOptions({
          strokeOpacity: entry.baseOpacity * (shouldDim ? 0.32 : 1),
        });
        entry.dimmed = shouldDim;
      }

      // 据点：起点在路线出现后显示，终点在路线走完后显示
      for (const point of entry.strongpoints) {
        const visible = point.progress === 0 ? progress > 0 : progress >= 0.999;
        point.marker[visible ? 'show' : 'hide']();
      }
    }

    // 选中路线高亮：跟随时间进度截断
    if (routeHighlightRef.current) {
      const entry = selectedRoute
        ? Array.from(lineEntriesRef.current.values()).find(
            (item) =>
              item.feature.properties.entityId === selectedRoute.entityId &&
              item.feature.properties.order === selectedRoute.order,
          )
        : undefined;
      if (!entry || entry.progress <= 0) {
        routeHighlightRef.current.halo.hide();
        routeHighlightRef.current.line.hide();
      } else {
        const path = partialPathAt(entry.geometry, entry.progress).map(toGcjPoint);
        if (path.length < 2) {
          routeHighlightRef.current.halo.hide();
          routeHighlightRef.current.line.hide();
        } else {
          routeHighlightRef.current.halo.setPath(path);
          routeHighlightRef.current.line.setPath(path);
          routeHighlightRef.current.halo.show();
          routeHighlightRef.current.line.show();
        }
      }
    }

    // 跨省路线端点：只在筛选时显示，按屏幕空间避让，重叠的标签隐藏
    if (!showEndpoints) {
      for (const entry of lineEntriesRef.current.values()) {
        for (const marker of entry.endpointMarkers) marker.hide();
      }
    } else {
      const placedEndpointRects: ScreenRect[] = [];
      for (const entry of lineEntriesRef.current.values()) {
        for (let index = 0; index < entry.endpointMarkers.length; index += 1) {
          const marker = entry.endpointMarkers[index]!;
          const meta = entry.endpointMeta[index];
          if (!meta || entry.progress <= 0) {
            marker.hide();
            continue;
          }
          const point = map.lngLatToContainer(new AMap.LngLat(meta.point[0], meta.point[1]));
          const rect = estimateLabelRect(meta.text, point.x, point.y);
          if (placedEndpointRects.some((placed) => rectsOverlap(placed, rect))) {
            marker.hide();
            continue;
          }
          placedEndpointRects.push(rect);
          marker.show();
        }
      }
    }

    // 地区标注：选区内的县市/地点优先，其次按缩放级别显示
    if (!showRegionLabels) {
      for (const entry of regionLabelEntriesRef.current.values()) entry.label.hide();
    } else {
      const selectedRegionSet = new Set(filters.regionIds);
      const expandedRegionSet = new Set<string>();
      for (const id of filters.regionIds) {
        for (const region of regionAncestors(dataset.regionsById, id)) {
          expandedRegionSet.add(region.id);
        }
      }
      const size = map.getSize();
      const placedRegionRects: ScreenRect[] = [];
      const regionCandidates = Array.from(regionLabelEntriesRef.current.values()).sort(
        (a, b) => {
          const priority = (entry: RegionLabelEntry) => {
            if (selectedRegionSet.has(entry.region.id)) return 0;
            if (expandedRegionSet.has(entry.region.id)) return 1;
            if (entry.region.level === 'municipality') return 2;
            if (entry.region.level === 'county') return 3;
            return 4;
          };
          return priority(a) - priority(b);
        },
      );
      for (const entry of regionCandidates) {
        const selected = selectedRegionSet.has(entry.region.id);
        const ancestorSelected = expandedRegionSet.has(entry.region.id);
        const minZoom =
          entry.region.level === 'municipality'
            ? 4.5
            : entry.region.level === 'county'
              ? 7
              : 9;
        const visible =
          selected || (ancestorSelected && zoom >= 6.5) || zoom >= minZoom;
        if (!visible) {
          entry.label.hide();
          continue;
        }
        const containerPoint = map.lngLatToContainer(
          new AMap.LngLat(entry.point[0], entry.point[1]),
        );
        if (
          containerPoint.x < -80 ||
          containerPoint.x > size.width + 80 ||
          containerPoint.y < -40 ||
          containerPoint.y > size.height + 40
        ) {
          entry.label.hide();
          continue;
        }
        const rect = estimateLabelRect(entry.text, containerPoint.x, containerPoint.y);
        if (placedRegionRects.some((placed) => rectsOverlap(placed, rect))) {
          entry.label.hide();
          continue;
        }
        placedRegionRects.push(rect);
        entry.label.show();
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


    // 纯疆域实体（没有路线与事件）不参与图例筛选，始终跟随「时代疆域遮罩」显示。
    const entitiesWithData = new Set([
      ...dataset.routes.map((route) => route.properties.entityId),
      ...dataset.events.flatMap((event) => event.entityIds),
    ]);

    for (const entry of territoryEntriesRef.current.values()) {
      const { feature } = entry;
      const start = parseDateString(feature.properties.startDate);
      const end = parseDateString(feature.properties.endDate);
      const entityId = feature.properties.entityId;
      const ext = feature.properties.extensions ?? {};
      const isAdmin = ext.kind === 'admin-boundary';
      const regionId = typeof ext.regionId === 'string' ? ext.regionId : undefined;
      const selected = Boolean(isAdmin && regionId && filters.regionIds.includes(regionId));
      const ancestorSelected = Boolean(
        isAdmin &&
          regionId &&
          !selected &&
          filters.regionIds.some((id) =>
            isRegionDescendant(dataset.regionsById, id, regionId),
          ),
      );
      const visible =
        (isAdmin ? showAdminBoundaries : showTerritories) &&
        (entitiesWithData.has(entityId) ? activeEntityIds.has(entityId) : true) &&
        currentTime >= start &&
        currentTime <= end;
      for (const polygon of entry.polygons) {
        polygon[visible ? 'show' : 'hide']();
        if (visible && isAdmin) {
          polygon.setOptions({
            fillColor: selected || ancestorSelected ? '#8c2f24' : '#5b7f6b',
            fillOpacity: selected ? 0.1 : ancestorSelected ? 0.05 : 0,
            strokeColor: selected || ancestorSelected ? '#8c2f24' : '#5b7f6b',
            strokeOpacity: selected ? 0.95 : ancestorSelected ? 0.7 : 0.65,
            strokeWeight: selected ? 2.2 : ancestorSelected ? 1.7 : 1.1,
            strokeStyle: selected || ancestorSelected ? 'solid' : 'dashed',
            strokeDasharray: selected || ancestorSelected ? undefined : [7, 5],
          });
        }
      }
      entry.label[visible && (!isAdmin || zoom >= 6 || selected || ancestorSelected) ? 'show' : 'hide']();
    }

    const activeEvents = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const latest = latestEventAt(activeEvents, currentTime);

    for (const entry of markerEntriesRef.current.values()) {
      const visibleEvents = entry.events.filter(
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
  }, [currentTime, dataset, activeEntityIds, filters, ready, showTerritories, showAdminBoundaries, showRegionLabels, selectedRoute, locale, zoom, playing, scrubbing]);

  // 播放、拖动或时间跳转跨过事件时弹出气泡（固定 UI，避免 InfoWindow 被视口裁切）
  useEffect(() => {
    const setBubbleEvent = useAtlasStore.getState().setBubbleEvent;

    if (!ready || !dataset) {
      lastBubbleRef.current = null;
      setBubbleEvent(null);
      return;
    }

    const activeEvents = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const latest = latestEventAt(activeEvents, currentTime);
    if (!latest) {
      lastBubbleRef.current = null;
      setBubbleEvent(null);
      return;
    }

    const previous = lastBubbleRef.current;
    const showing = useAtlasStore.getState().bubbleEventId;
    if (previous?.id === latest.id && showing === latest.id) {
      // 暂停时让气泡常驻，不再按播放节奏自动消失
      if (!playing && bubbleTimerRef.current !== null) {
        window.clearTimeout(bubbleTimerRef.current);
        bubbleTimerRef.current = null;
      }
      return;
    }

    const now = Date.now();
    const gap = scrubbing ? SCRUB_BUBBLE_MIN_GAP_MS : BUBBLE_MIN_GAP_MS;
    if (previous && now - previous.at < gap) return;

    lastBubbleRef.current = { id: latest.id, at: now };
    setBubbleEvent(latest.id);

    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    // 播放时按节奏 4s 收起；暂停/拖动时保留，直到时间离开该节点或手动关闭
    if (playing) {
      bubbleTimerRef.current = window.setTimeout(() => {
        useAtlasStore.getState().setBubbleEvent(null);
        bubbleTimerRef.current = null;
      }, BUBBLE_DURATION_MS);
    }
  }, [currentTime, playing, scrubbing, dataset, activeEntityIds, filters, ready]);

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

  // 地区筛选「定位」：按选区内的点、事件、路线与省界计算范围
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready || !regionFocus) return;
    const id = regionFocus.regionId;
    if (!dataset.regionsById.has(id)) return;

    const points: [number, number][] = [];
    const region = dataset.regionsById.get(id);
    if (region?.point) points.push(region.point);
    for (const event of dataset.events) {
      if (event.location.regionIds?.includes(id)) {
        points.push([event.location.lng, event.location.lat]);
      }
    }
    for (const route of dataset.routes) {
      if (!route.properties.regionIds?.includes(id)) continue;
      route.geometry.coordinates.forEach((coordinate, index) => {
        if (index === 0 || index === route.geometry.coordinates.length - 1 || index % 8 === 0) {
          points.push(coordinate);
        }
      });
    }
    for (const feature of dataset.territories) {
      if (feature.properties.extensions?.regionId !== id) continue;
      const parts =
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      for (const rings of parts) {
        for (const ring of rings) {
          ring.forEach((coordinate, index) => {
            if (index % 4 === 0) points.push(coordinate);
          });
        }
      }
    }
    for (const child of dataset.regions) {
      if (!child.point) continue;
      if (regionAncestors(dataset.regionsById, child.id).some((item) => item.id === id)) {
        points.push(child.point);
      }
    }
    if (points.length === 0) return;

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
    for (const [lng, lat] of points) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }
    if (maxLng - minLng < 0.02 && maxLat - minLat < 0.02) {
      map.setZoomAndCenter(9, [(minLng + maxLng) / 2, (minLat + maxLat) / 2], true);
    } else {
      map.setBounds(
        new AMap.Bounds([minLng, minLat], [maxLng, maxLat]),
        false,
        [90, 90, 150, 90],
      );
    }
  }, [regionFocus, dataset, ready]);

  // 本区路线「定位」：缩放到单条路线范围
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready || !routeFocus) return;
    const route = dataset.routes.find(
      (item) =>
        item.properties.entityId === routeFocus.entityId &&
        item.properties.order === routeFocus.order,
    );
    if (!route) return;
    const coordinates = route.geometry.coordinates;
    if (coordinates.length === 0) return;
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
    for (const [lng, lat] of coordinates) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }
    if (maxLng - minLng < 0.02 && maxLat - minLat < 0.02) {
      map.setZoomAndCenter(9, [(minLng + maxLng) / 2, (minLat + maxLat) / 2], true);
    } else {
      map.setBounds(
        new AMap.Bounds([minLng, minLat], [maxLng, maxLat]),
        false,
        [90, 90, 150, 90],
      );
    }
  }, [routeFocus, dataset, ready]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" aria-label={t('map.title')} />

      {routeTip ? <RouteTooltip {...routeTip} /> : null}
      {regionTip ? <RouteTooltip {...regionTip} /> : null}

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
