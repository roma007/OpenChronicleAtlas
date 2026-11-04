import type { AtlasEvent } from '../types';

export interface AtlasEventCluster {
  /** 稳定的网格键，同一缩放下不随平移变化 */
  id: string;
  events: AtlasEvent[];
  /** 聚类中心的 WGS84 坐标 */
  center: [number, number];
}

const MIN_CELL_DEGREES = 0.05;
const BASE_CELL_DEGREES = 56.25;

/**
 * 按地图缩放级别做经纬网格聚合。
 *
 * 网格从全球固定锚点起算，因此平移地图时聚合结果不会跳动；
 * 缩放级别越高，网格越小，聚合点会自然拆分为单点。
 */
export function clusterEvents(events: AtlasEvent[], zoom: number): AtlasEventCluster[] {
  if (events.length === 0) return [];

  const safeZoom = Number.isFinite(zoom) ? Math.min(22, Math.max(0, zoom)) : 0;
  const cell = Math.max(MIN_CELL_DEGREES, BASE_CELL_DEGREES / 2 ** safeZoom);
  const groups = new Map<string, AtlasEvent[]>();

  for (const event of events) {
    const { lng, lat } = event.location;
    const key = `${Math.floor((lng + 180) / cell)}:${Math.floor((lat + 90) / cell)}`;
    const group = groups.get(key);
    if (group) {
      group.push(event);
    } else {
      groups.set(key, [event]);
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, group]) => {
      let lng = 0;
      let lat = 0;
      for (const event of group) {
        lng += event.location.lng;
        lat += event.location.lat;
      }
      return {
        id,
        events: group,
        center: [lng / group.length, lat / group.length] as [number, number],
      };
    });
}
