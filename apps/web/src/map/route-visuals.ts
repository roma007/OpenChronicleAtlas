import type { AtlasRouteFeature, AtlasTime, RouteGeometry } from '@atlas/shared';
import { parseDateString } from '@atlas/shared';

export interface RouteSample {
  point: [number, number];
  /** 法线方向（东、北分量），用于防御齿线等垂直符号 */
  normal: [number, number];
  /** 行进方向，0 = 正北，顺时针，角度制 */
  bearing: number;
}

/**
 * 路线在当前时间下的进度：负数表示尚未出发；1 表示走完。
 * 常驻线（苏区内部机动线等）在起始日整段显示。
 */
export function routeProgress(
  feature: AtlasRouteFeature,
  currentTime: AtlasTime,
): number {
  const start = parseDateString(feature.properties.startDate);
  const end = parseDateString(feature.properties.endDate);
  if (feature.properties.extensions?.static === true) {
    if (feature.properties.extensions?.staticUntilEnd === true) {
      return currentTime >= start && currentTime <= end ? 1 : -1;
    }
    return currentTime >= start ? 1 : -1;
  }
  if (end === start) {
    return currentTime >= end ? 1 : -1;
  }
  const raw = (currentTime - start) / (end - start);
  return raw < 0 ? -1 : Math.min(1, raw);
}

/** 按弧长取路线上的点、法线与行进方向 */
export function sampleRouteAt(
  geometry: RouteGeometry,
  distance: number,
): RouteSample | null {
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

  // 与 MapCanvas 保持一致：用局部平面估算切向
  const KM_PER_DEG_LAT = 110.57;
  const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;
  const latRad = (point[1] * Math.PI) / 180;
  const east =
    (end[0] - start[0]) * KM_PER_DEG_LNG_AT_EQUATOR * Math.cos(latRad);
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
