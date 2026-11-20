import type { AtlasRegion } from '@atlas/shared';
import {
  applyEventFilters,
  buildRouteGeometry,
  clusterEvents,
  eventStart,
  latestEventAt,
  matchesRegionFilter,
  partialPathAt,
  parseDateString,
  regionAncestors,
  regionShortName,
  resolveLocalized,
  routeStyleForSegmentType,
  wgs84ToGcj02,
} from '@atlas/shared';
import { MapView, Marker, Polygon, Polyline, type MapViewRef } from 'expo-gaode-map';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii } from '../../theme';
import { useI18n } from '../../hooks/useI18n';

function toGcj(lng: number, lat: number) {
  const point = wgs84ToGcj02(lng, lat);
  return { latitude: point.lat, longitude: point.lng };
}

export function AtlasMap() {
  const mapRef = useRef<MapViewRef>(null);
  const [mapReady, setMapReady] = useState(false);

  const dataset = useAtlasStore((state) => state.dataset);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);
  const setMapView = useAtlasStore((state) => state.setMapView);
  const mapView = useAtlasStore((state) => state.mapView);
  const showAdminBoundaries = useAtlasStore((state) => state.showAdminBoundaries);
  const showRegionLabels = useAtlasStore((state) => state.showRegionLabels);
  const regionFocus = useAtlasStore((state) => state.regionFocus);
  const routeFocus = useAtlasStore((state) => state.routeFocus);
  const toggleRegion = useAtlasStore((state) => state.toggleRegion);
  const { locale } = useI18n();
  const zoom = mapView?.zoom ?? dataset?.manifest.defaultView.zoom ?? 4;

  const geometries = useMemo(() => {
    if (!dataset) return new Map();
    return new Map(
      dataset.routes.map((route, index) => [
        `${route.properties.entityId}:${route.properties.order}:${index}`,
        buildRouteGeometry(route),
      ]),
    );
  }, [dataset]);

  const boundaryPeriod =
    currentTime < parseDateString('1932-01-01')
      ? '1931'
      : currentTime < parseDateString('1938-01-01')
        ? '1932'
        : currentTime < parseDateString('1945-01-01')
          ? '1938'
          : '1945';

  const adminPolygons = useMemo(() => {
    if (!dataset || !showAdminBoundaries) return [];
    const periodStart =
      boundaryPeriod === '1931'
        ? parseDateString('1931-09-18')
        : boundaryPeriod === '1932'
          ? parseDateString('1932-01-01')
          : boundaryPeriod === '1938'
            ? parseDateString('1938-01-01')
            : parseDateString('1945-01-01');
    const periodEnd =
      boundaryPeriod === '1931'
        ? parseDateString('1931-12-31')
        : boundaryPeriod === '1932'
          ? parseDateString('1937-12-31')
          : boundaryPeriod === '1938'
            ? parseDateString('1944-12-31')
            : parseDateString('1945-12-31');
    const result: Array<{
      key: string;
      points: Array<{ latitude: number; longitude: number }>;
      fillColor: string;
      strokeColor: string;
      strokeWidth: number;
    }> = [];
    for (const [index, feature] of dataset.territories.entries()) {
      if (feature.properties.extensions?.kind !== 'admin-boundary') continue;
      const start = parseDateString(feature.properties.startDate);
      const end = parseDateString(feature.properties.endDate);
      if (end < periodStart || start > periodEnd) continue;
      const regionId =
        typeof feature.properties.extensions?.regionId === 'string'
          ? feature.properties.extensions.regionId
          : undefined;
      const selected = Boolean(regionId && filters.regionIds.includes(regionId));
      const parts =
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      for (const [partIndex, rings] of parts.entries()) {
        const outer = rings[0];
        if (!outer || outer.length < 3) continue;
        result.push({
          key: `${feature.properties.entityId}:${index}:${partIndex}`,
          points: outer.map(([lng, lat]) => toGcj(lng, lat)),
          fillColor: selected ? 'rgba(140,47,36,0.12)' : 'rgba(0,0,0,0)',
          strokeColor: selected ? '#8c2f24' : '#6b7280',
          strokeWidth: selected ? 2 : 1,
        });
      }
    }
    return result;
  }, [dataset, showAdminBoundaries, boundaryPeriod, filters.regionIds]);

  const regionLabels = useMemo(() => {
    if (!dataset || !showRegionLabels) return [];
    const selected = new Set(filters.regionIds);
    const expanded = new Set<string>();
    for (const id of filters.regionIds) {
      for (const region of regionAncestors(dataset.regionsById, id)) {
        expanded.add(region.id);
      }
    }
    const minZoomFor = (level: string) =>
      level === 'municipality' ? 4.5 : level === 'county' ? 7 : 9;
    return dataset.regions
      .filter(
        (region) =>
          region.point &&
          (region.level === 'county' ||
            region.level === 'place' ||
            region.level === 'municipality'),
      )
      .filter((region) => {
        const selectedHere = selected.has(region.id);
        const ancestorSelected = expanded.has(region.id);
        return (
          selectedHere ||
          (ancestorSelected && zoom >= 6.5) ||
          zoom >= minZoomFor(region.level)
        );
      })
      .sort((a, b) => {
        const priority = (region: AtlasRegion) => {
          if (selected.has(region.id)) return 0;
          if (expanded.has(region.id)) return 1;
          if (region.level === 'municipality') return 2;
          if (region.level === 'county') return 3;
          return 4;
        };
        return priority(a) - priority(b);
      })
      .slice(0, 80)
      .map((region) => ({
        id: region.id,
        point: toGcj(region.point![0], region.point![1]),
        text: regionShortName(region, locale),
        selected: selected.has(region.id),
      }));
  }, [dataset, showRegionLabels, filters.regionIds, zoom, locale]);

  const visibleEvents = useMemo(() => {
    if (!dataset) return [];
    return applyEventFilters(dataset.events, filters).filter(
      (event) =>
        event.entityIds.some((entityId) => activeEntityIds.has(entityId)) &&
        eventStart(event) <= currentTime,
    );
  }, [dataset, filters, activeEntityIds, currentTime]);

  const filteredEvents = useMemo(() => {
    if (!dataset) return [];
    return applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((entityId) => activeEntityIds.has(entityId)),
    );
  }, [dataset, filters, activeEntityIds]);

  const clusters = useMemo(
    () => clusterEvents(filteredEvents, zoom),
    [filteredEvents, zoom],
  );

  const latest = useMemo(
    () => latestEventAt(visibleEvents, currentTime),
    [visibleEvents, currentTime],
  );

  const routeShapes = useMemo(() => {
    if (!dataset) return [];
    return dataset.routes
      .filter((route) => {
        const entity = dataset.entitiesById.get(route.properties.entityId);
        // legend: false 的实体（如海防线）不进入图例，但作为地图背景始终显示。
        const alwaysVisible = entity?.extensions?.legend === false;
        if (!alwaysVisible && !activeEntityIds.has(route.properties.entityId)) return false;
        if (
          !alwaysVisible &&
          filters.regionIds.length > 0 &&
          !matchesRegionFilter(route.properties.regionIds, filters.regionIds)
        ) {
          return false;
        }
        return true;
      })
      .map((route, index) => {
        const key = `${route.properties.entityId}:${route.properties.order}:${index}`;
        const geometry = geometries.get(key);
        const start = new Date(`${route.properties.startDate}T00:00:00Z`).getTime();
        const end = new Date(`${route.properties.endDate}T00:00:00Z`).getTime();
        const rawProgress =
          route.properties.extensions?.static === true
            ? currentTime >= start
              ? 1
              : -1
            : end === start
              ? currentTime >= end
                ? 1
                : -1
              : (currentTime - start) / (end - start);
        // 起点当天也显示一小段，避免路线在出发日完全消失
        const progress = rawProgress === 0 ? 0.001 : Math.min(1, rawProgress);
        const points =
          geometry && progress > 0
            ? partialPathAt(geometry, progress).map(([lng, lat]) => toGcj(lng, lat))
            : [];
        const entity = dataset.entitiesById.get(route.properties.entityId);
        const style = routeStyleForSegmentType(route.properties.segmentType);
        const name = resolveLocalized(route.properties.name, locale)
          .replace(/（[^）]*）|\([^)]*\)/g, '')
          .trim();
        const parts = name.split(/[—–\-→至]/).map((part) => part.trim()).filter(Boolean);
        const labels = parts.length >= 2 ? [parts[0], parts.at(-1) as string] : ['', ''];
        const first = route.geometry.coordinates[0];
        const last = route.geometry.coordinates.at(-1);
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
        const crossesRegions =
          new Set(
            (route.properties.regionIds ?? []).filter((id) => firstLevelIds.has(id)),
          ).size > 1;
        return {
          key,
          points,
          color: entity?.color ?? colors.cinnabar,
          strokeWidth: style.weight,
          dotted: style.dash !== 'solid',
          endpoints:
            crossesRegions && zoom >= 6 && filters.regionIds.length > 0 && first && last
              ? [
                  { point: toGcj(first[0], first[1]), label: labels[0] || (locale === 'en' ? 'Start' : '起点'), kind: 'start' as const },
                  { point: toGcj(last[0], last[1]), label: labels[1] || (locale === 'en' ? 'End' : '终点'), kind: 'end' as const },
                ]
              : [],
        };
      })
      .filter((shape) => shape.points.length >= 2);
  }, [dataset, activeEntityIds, geometries, currentTime, filters.regionIds, locale, zoom]);

  const allPoints = useMemo(() => {
    if (!dataset) return [];
    const points = dataset.routes.flatMap((route) =>
      route.geometry.coordinates.map(([lng, lat]) => toGcj(lng, lat)),
    );
    return points;
  }, [dataset]);

  useEffect(() => {
    if (!mapReady || !dataset) return;
    const timer = setTimeout(() => {
      if (selectedEventId) {
        const event = dataset.eventsById.get(selectedEventId);
        if (event) {
          const point = toGcj(event.location.lng, event.location.lat);
          void mapRef.current?.moveCamera({ target: point, zoom: 6 }, 300);
          return;
        }
      }
      if (allPoints.length > 0) {
        void mapRef.current?.fitToCoordinates(allPoints, {
          paddingFactor: 0.15,
          minZoom: 4.5,
          maxZoom: 10,
          duration: 300,
        });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [mapReady, dataset, selectedEventId, allPoints]);

  useEffect(() => {
    if (!mapReady || !dataset || !regionFocus) return;
    const id = regionFocus.regionId;
    if (!dataset.regionsById.has(id)) return;
    const points: Array<{ latitude: number; longitude: number }> = [];
    const region = dataset.regionsById.get(id);
    if (region?.point) points.push(toGcj(region.point[0], region.point[1]));
    for (const event of dataset.events) {
      if (event.location.regionIds?.includes(id)) {
        points.push(toGcj(event.location.lng, event.location.lat));
      }
    }
    for (const route of dataset.routes) {
      if (!route.properties.regionIds?.includes(id)) continue;
      route.geometry.coordinates.forEach(([lng, lat], index) => {
        if (
          index === 0 ||
          index === route.geometry.coordinates.length - 1 ||
          index % 8 === 0
        ) {
          points.push(toGcj(lng, lat));
        }
      });
    }
    for (const child of dataset.regions) {
      if (!child.point) continue;
      if (regionAncestors(dataset.regionsById, child.id).some((item) => item.id === id)) {
        points.push(toGcj(child.point[0], child.point[1]));
      }
    }
    if (points.length === 0) return;
    if (points.length === 1) {
      void mapRef.current?.moveCamera({ target: points[0]!, zoom: 9 }, 300);
      return;
    }
    void mapRef.current?.fitToCoordinates(points, {
      paddingFactor: 0.2,
      minZoom: 4.5,
      maxZoom: 10,
      duration: 300,
    });
  }, [mapReady, dataset, regionFocus]);

  useEffect(() => {
    if (!mapReady || !dataset || !routeFocus) return;
    const route = dataset.routes.find(
      (item) =>
        item.properties.entityId === routeFocus.entityId &&
        item.properties.order === routeFocus.order,
    );
    if (!route) return;
    const points = route.geometry.coordinates.map(([lng, lat]) => toGcj(lng, lat));
    if (points.length === 0) return;
    if (points.length === 1) {
      void mapRef.current?.moveCamera({ target: points[0]!, zoom: 9 }, 300);
      return;
    }
    void mapRef.current?.fitToCoordinates(points, {
      paddingFactor: 0.2,
      minZoom: 4.5,
      maxZoom: 10,
      duration: 300,
    });
  }, [mapReady, dataset, routeFocus]);

  if (!dataset) return null;

  const initial = toGcj(
    dataset.manifest.defaultView.center[0],
    dataset.manifest.defaultView.center[1],
  );
  const styleId = process.env.EXPO_PUBLIC_AMAP_STYLE_ID;

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialCameraPosition={{
          target: initial,
          zoom: dataset.manifest.defaultView.zoom,
        }}
        scaleControlsEnabled
        compassEnabled={false}
        zoomControlsEnabled={false}
        labelsEnabled
        buildingsEnabled={false}
        customMapStyle={styleId ? { styleId } : undefined}
        onLoad={() => setMapReady(true)}
        onMapPress={() => selectEvent(null)}
        onCameraIdle={(event) => {
          const camera = event.nativeEvent.cameraPosition;
          if (!camera.target) return;
          setMapView({
            lng: camera.target.longitude,
            lat: camera.target.latitude,
            zoom: camera.zoom ?? dataset.manifest.defaultView.zoom,
          });
        }}
      >
        {adminPolygons.map((polygon) => (
          <Polygon
            key={polygon.key}
            points={polygon.points}
            fillColor={polygon.fillColor}
            strokeColor={polygon.strokeColor}
            strokeWidth={polygon.strokeWidth}
            zIndex={10}
          />
        ))}

        {routeShapes.map((shape) => (
          <Polyline
            key={shape.key}
            points={shape.points}
            strokeColor={shape.color}
            strokeWidth={shape.strokeWidth}
            dotted={shape.dotted}
            zIndex={50}
          />
        ))}

        {routeShapes.flatMap((shape) =>
          shape.endpoints.map((endpoint, index) => (
            <Marker
              key={`${shape.key}:endpoint:${index}`}
              position={endpoint.point}
              cacheKey={`${shape.key}:endpoint:${index}:${endpoint.label}`}
              zIndex={70}
            >
              <View
                style={[
                  styles.endpoint,
                  endpoint.kind === 'end' ? styles.endpointEnd : styles.endpointStart,
                ]}
              >
                <Text style={styles.endpointText} numberOfLines={1}>
                  {locale === 'en'
                    ? `${endpoint.kind === 'start' ? 'From' : 'To'} ${endpoint.label}`
                    : `${endpoint.kind === 'start' ? '起' : '终'} ${endpoint.label}`}
                </Text>
              </View>
            </Marker>
          )),
        )}

        {regionLabels.map((region) => (
          <Marker
            key={`region:${region.id}`}
            position={region.point}
            cacheKey={`region:${region.id}:${region.selected ? 1 : 0}`}
            zIndex={30}
            onMarkerPress={() => toggleRegion(region.id)}
          >
            <View style={[styles.regionLabel, region.selected && styles.regionLabelSelected]}>
              <Text style={[styles.regionLabelText, region.selected && styles.regionLabelTextSelected]}>
                {region.text}
              </Text>
            </View>
          </Marker>
        ))}

        {clusters.map((cluster) => {
          const visible = cluster.events.filter((event) => eventStart(event) <= currentTime);
          if (visible.length === 0) return null;

          const isCluster = visible.length > 1;
          let lng = 0;
          let lat = 0;
          for (const event of visible) {
            lng += event.location.lng;
            lat += event.location.lat;
          }
          const center: [number, number] = isCluster
            ? [lng / visible.length, lat / visible.length]
            : [visible[0]!.location.lng, visible[0]!.location.lat];
          const point = toGcj(center[0], center[1]);
          const entity = dataset.entitiesById.get(visible[0]!.entityIds[0] ?? '');
          const active = visible.some((event) => event.id === latest?.id);

          return (
            <Marker
              key={cluster.id}
              position={point}
              cacheKey={`${cluster.id}:${visible.length}:${active ? 1 : 0}`}
              onMarkerPress={() => {
                if (visible.length === 1) {
                  pause();
                  selectEvent(visible[0]!.id);
                  return;
                }
                void mapRef.current?.moveCamera(
                  { target: point, zoom: Math.min(zoom + 2, 12) },
                  300,
                );
              }}
            >
              {isCluster ? (
                <View
                  style={[
                    styles.cluster,
                    { backgroundColor: entity?.color ?? colors.cinnabar },
                    active && styles.clusterActive,
                  ]}
                >
                  <Text style={styles.clusterText}>{visible.length}</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: entity?.color ?? colors.cinnabar },
                    active && styles.dotActive,
                  ]}
                />
              )}
            </Marker>
          );
        })}
      </MapView>

      {latest ? (
        <View style={styles.currentBadge} pointerEvents="none">
          <Text style={styles.currentName} numberOfLines={1}>
            {resolveLocalized(latest.name)}
          </Text>
          <Text style={styles.currentDate}>{latest.date}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.parchment,
  },
  dotActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: colors.ochre,
  },
  cluster: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.parchment,
  },
  clusterActive: {
    borderWidth: 3,
    borderColor: colors.ochre,
  },
  clusterText: {
    color: colors.parchment,
    fontSize: 11,
    fontWeight: '700',
  },
  endpoint: {
    backgroundColor: colors.parchment + 'F2',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  endpointStart: { borderColor: colors.cinnabar + '88' },
  endpointEnd: { borderColor: '#1f4e7988' },
  endpointText: { fontSize: 10, color: colors.ink },
  regionLabel: {
    backgroundColor: colors.parchment + 'DD',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.ink + '33',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  regionLabelSelected: {
    borderColor: colors.cinnabar + '99',
    backgroundColor: colors.cinnabar + '1A',
  },
  regionLabelText: { fontSize: 9, color: colors.inkSoft },
  regionLabelTextSelected: { color: colors.cinnabar, fontWeight: '700' },
  currentBadge: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 96,
    alignItems: 'center',
  },
  currentName: {
    backgroundColor: colors.parchment + 'EE',
    color: colors.ink,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  currentDate: {
    marginTop: 2,
    fontSize: 10,
    color: colors.inkSoft,
  },
});
