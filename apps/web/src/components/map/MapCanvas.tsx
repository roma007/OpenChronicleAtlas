import type { AtlasEvent, AtlasRouteFeature, RouteGeometry } from '@atlas/shared';
import {
  buildRouteGeometry,
  eventStart,
  latestEventAt,
  parseDateString,
  partialPathAt,
  resolveLocalized,
  wgs84ToGcj02,
} from '@atlas/shared';
import { useEffect, useRef, useState } from 'react';
import { amapStyleId, loadAMap } from '../../map/amap';
import { useAtlasStore } from '../../stores/useAtlasStore';

const INITIAL_CENTER: [number, number] = [106.5, 32];
const BUBBLE_DURATION_MS = 4000;
const BUBBLE_MIN_GAP_MS = 1200;

interface LineEntry {
  feature: AtlasRouteFeature;
  geometry: RouteGeometry;
  line: any;
}

interface MarkerEntry {
  event: AtlasEvent;
  marker: any;
  element: HTMLButtonElement;
}

function toGcjPoint(coordinate: [number, number]): [number, number] {
  const point = wgs84ToGcj02(coordinate[0], coordinate[1]);
  return [point.lng, point.lat];
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const amapRef = useRef<any>(null);
  const lineEntriesRef = useRef<Map<string, LineEntry>>(new Map());
  const markerEntriesRef = useRef<Map<string, MarkerEntry>>(new Map());
  const lastProgressRef = useRef<Map<string, number>>(new Map());
  const fittedAtlasIdRef = useRef<string | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const lastBubbleRef = useRef<{ id: string; at: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);

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
      lastProgressRef.current.clear();
      fittedAtlasIdRef.current = null;
      setReady(false);
    };
  }, []);

  // 建立/重建覆盖物：只在专题或图层开关变化时执行
  useEffect(() => {
    const map = mapRef.current;
    const AMap = amapRef.current;
    if (!map || !AMap || !dataset || !ready) return;

    const oldOverlays = [
      ...Array.from(lineEntriesRef.current.values(), (entry) => entry.line),
      ...Array.from(markerEntriesRef.current.values(), (entry) => entry.marker),
    ];
    if (oldOverlays.length > 0) map.remove(oldOverlays);

    lineEntriesRef.current.clear();
    markerEntriesRef.current.clear();
    lastProgressRef.current.clear();
    lastBubbleRef.current = null;
    clearBubble();

    const overlays: any[] = [];

    for (const route of dataset.routes) {
      const entity = dataset.entitiesById.get(route.properties.entityId);
      if (!entity || !activeEntityIds.has(entity.id)) continue;

      const geometry = buildRouteGeometry(route);
      const line = new AMap.Polyline({
        path: route.geometry.coordinates.map(toGcjPoint),
        strokeColor: entity.color,
        strokeWeight: 4,
        strokeOpacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
        showDir: true,
        zIndex: 50,
      });
      line.hide();
      map.add(line);

      const key = `${route.properties.entityId}:${route.properties.order}:${route.properties.startDate}`;
      lineEntriesRef.current.set(key, { feature: route, geometry, line });
      overlays.push(line);
    }

    for (const event of dataset.events) {
      if (!event.entityIds.some((entityId) => activeEntityIds.has(entityId))) continue;

      const primaryEntityId = event.entityIds[0];
      const entity = primaryEntityId ? dataset.entitiesById.get(primaryEntityId) : undefined;
      const color = entity?.color ?? '#8c2f24';
      const point = wgs84ToGcj02(event.location.lng, event.location.lat);

      const element = document.createElement('button');
      element.type = 'button';
      element.className = 'atlas-marker';
      element.style.setProperty('--marker-color', color);
      element.setAttribute('aria-label', `${resolveLocalized(event.name)}，查看详情`);
      element.innerHTML = '<span class="atlas-marker__dot"></span>';
      element.addEventListener('click', (clickEvent) => {
        clickEvent.stopPropagation();
        useAtlasStore.getState().pause();
        useAtlasStore.getState().selectEvent(event.id);
        clearBubble();
      });

      const marker = new AMap.Marker({
        position: [point.lng, point.lat],
        content: element,
        anchor: 'bottom-center',
        zIndex: 100,
      });
      marker.hide();
      map.add(marker);

      markerEntriesRef.current.set(event.id, { event, marker, element });
      overlays.push(marker);
    }

    if (overlays.length > 0 && fittedAtlasIdRef.current !== dataset.manifest.id) {
      map.setFitView(overlays, true, [90, 90, 150, 90], 10);
      if (map.getZoom() < 4.5) {
        map.setZoomAndCenter(4.5, map.getCenter());
      }
      fittedAtlasIdRef.current = dataset.manifest.id;
    }
  }, [dataset, activeEntityIds, ready]);

  // 时间变化：更新路线截断与 Marker 可见性
  useEffect(() => {
    if (!dataset || !ready) return;

    for (const [key, entry] of lineEntriesRef.current) {
      const start = parseDateString(entry.feature.properties.startDate);
      const end = parseDateString(entry.feature.properties.endDate);
      const progress =
        end === start
          ? currentTime >= end
            ? 1
            : 0
          : Math.min(1, Math.max(0, (currentTime - start) / (end - start)));

      const previous = lastProgressRef.current.get(key) ?? -1;
      if (progress <= 0) {
        entry.line.hide();
        lastProgressRef.current.set(key, 0);
        continue;
      }

      if (Math.abs(progress - previous) < 0.001) {
        entry.line.show();
        continue;
      }

      const path = partialPathAt(entry.geometry, progress).map(toGcjPoint);
      if (path.length >= 2) {
        entry.line.setPath(path);
        entry.line.show();
        lastProgressRef.current.set(key, progress);
      } else {
        entry.line.hide();
      }
    }


    const activeEvents = dataset.events.filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
    const latest = latestEventAt(activeEvents, currentTime);

    for (const entry of markerEntriesRef.current.values()) {
      const visible = eventStart(entry.event) <= currentTime;
      entry.marker[visible ? 'show' : 'hide']();
      entry.element.classList.toggle(
        'atlas-marker--active',
        visible && entry.event.id === latest?.id,
      );
    }
  }, [currentTime, dataset, activeEntityIds, ready]);

  // 播放跨过事件时弹出气泡（固定 UI，避免 InfoWindow 被视口裁切）
  useEffect(() => {
    const setBubbleEvent = useAtlasStore.getState().setBubbleEvent;

    if (!ready || !dataset || !playing) {
      lastBubbleRef.current = null;
      setBubbleEvent(null);
      return;
    }

    const activeEvents = dataset.events.filter((event) =>
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
  }, [currentTime, playing, dataset, activeEntityIds, ready]);

  // 选中事件后定位
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !dataset || !selectedEventId) return;

    const event = dataset.eventsById.get(selectedEventId);
    if (!event) return;

    const point = wgs84ToGcj02(event.location.lng, event.location.lat);
    map.setZoomAndCenter(Math.max(map.getZoom(), 6), [point.lng, point.lat], true);
  }, [selectedEventId, dataset]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" aria-label="历史专题地图" />

      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-parchment/95 p-6">
          <div className="max-w-md rounded-2xl border border-cinnabar/30 bg-parchment p-6 text-center shadow-panel">
            <h2 className="font-serif text-xl text-cinnabar">地图加载失败</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{error}</p>
            <p className="mt-3 text-xs leading-5 text-ink-soft/70">
              请检查 apps/web/.env.local 中的 VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE，以及高德控制台的域名白名单。
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
