import {
  applyEventFilters,
  buildRouteGeometry,
  eventStart,
  latestEventAt,
  partialPathAt,
  resolveLocalized,
  wgs84ToGcj02,
} from '@atlas/shared';
import { MapView, Marker, Polyline, type MapViewRef } from 'expo-gaode-map';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii } from '../../theme';

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

  const geometries = useMemo(() => {
    if (!dataset) return new Map();
    return new Map(
      dataset.routes.map((route, index) => [
        `${route.properties.entityId}:${route.properties.order}:${index}`,
        buildRouteGeometry(route),
      ]),
    );
  }, [dataset]);

  const visibleEvents = useMemo(() => {
    if (!dataset) return [];
    return applyEventFilters(dataset.events, filters).filter(
      (event) =>
        event.entityIds.some((entityId) => activeEntityIds.has(entityId)) &&
        eventStart(event) <= currentTime,
    );
  }, [dataset, filters, activeEntityIds, currentTime]);

  const latest = useMemo(
    () => latestEventAt(visibleEvents, currentTime),
    [visibleEvents, currentTime],
  );

  const routeShapes = useMemo(() => {
    if (!dataset) return [];
    return dataset.routes
      .filter((route) => activeEntityIds.has(route.properties.entityId))
      .map((route, index) => {
        const key = `${route.properties.entityId}:${route.properties.order}:${index}`;
        const geometry = geometries.get(key);
        const start = new Date(`${route.properties.startDate}T00:00:00Z`).getTime();
        const end = new Date(`${route.properties.endDate}T00:00:00Z`).getTime();
        const rawProgress =
          end === start ? (currentTime >= end ? 1 : -1) : (currentTime - start) / (end - start);
        // 起点当天也显示一小段，避免路线在出发日完全消失
        const progress = rawProgress === 0 ? 0.001 : Math.min(1, rawProgress);
        const points =
          geometry && progress > 0
            ? partialPathAt(geometry, progress).map(([lng, lat]) => toGcj(lng, lat))
            : [];
        const entity = dataset.entitiesById.get(route.properties.entityId);
        return { key, points, color: entity?.color ?? colors.cinnabar };
      })
      .filter((shape) => shape.points.length >= 2);
  }, [dataset, activeEntityIds, geometries, currentTime]);

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
        {routeShapes.map((shape) => (
          <Polyline
            key={shape.key}
            points={shape.points}
            strokeColor={shape.color}
            strokeWidth={4}
            zIndex={50}
          />
        ))}

        {visibleEvents.map((event) => {
          const entity = dataset.entitiesById.get(event.entityIds[0] ?? '');
          const point = toGcj(event.location.lng, event.location.lat);
          const active = latest?.id === event.id;
          return (
            <Marker
              key={event.id}
              position={point}
              cacheKey={event.id}
              onMarkerPress={() => {
                pause();
                selectEvent(event.id);
              }}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: entity?.color ?? colors.cinnabar },
                  active && styles.dotActive,
                ]}
              />
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
