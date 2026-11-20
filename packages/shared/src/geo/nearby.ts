import type { AtlasEvent } from '../types';

export interface NearbyEvent {
  event: AtlasEvent;
  distanceKm: number;
}

const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;

export function distanceKm(a: [number, number], b: [number, number]): number {
  const midLat = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const dx = (a[0] - b[0]) * KM_PER_DEG_LNG_AT_EQUATOR * Math.cos(midLat);
  const dy = (a[1] - b[1]) * KM_PER_DEG_LAT;
  return Math.hypot(dx, dy);
}

/** 找出点位附近的事件，按距离排序；用于路线起终点与事件的关联。 */
export function eventsNearPoint(
  events: AtlasEvent[],
  point: [number, number],
  maxKm = 20,
  limit = 3,
): NearbyEvent[] {
  return events
    .map((event) => ({
      event,
      distanceKm: distanceKm(point, [event.location.lng, event.location.lat]),
    }))
    .filter((item) => item.distanceKm <= maxKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
