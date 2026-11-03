import type { AtlasRouteFeature } from '../types';
import type { RouteGeometry } from './types';

const EARTH_RADIUS = 6_371_000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

/** 球面距离（米） */
export function haversine(a: [number, number], b: [number, number]): number {
  const dLat = toRadians(b[1] - a[1]);
  const dLng = toRadians(b[0] - a[0]);
  const lat1 = toRadians(a[1]);
  const lat2 = toRadians(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

export function buildRouteGeometry(feature: AtlasRouteFeature): RouteGeometry {
  const coordinates = feature.geometry.coordinates;
  const cumulative: number[] = [0];

  for (let i = 1; i < coordinates.length; i += 1) {
    cumulative.push(cumulative[i - 1]! + haversine(coordinates[i - 1]!, coordinates[i]!));
  }

  return {
    coordinates,
    cumulative,
    totalLength: cumulative[cumulative.length - 1] ?? 0,
  };
}

/**
 * 按进度 0..1 截断路线，返回从起点到当前点的坐标数组。
 * progress <= 0 返回空数组；>= 1 返回完整路线。
 */
export function partialPathAt(
  geometry: RouteGeometry,
  progress: number,
): [number, number][] {
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped <= 0 || geometry.totalLength === 0) return [];
  if (clamped >= 1) return geometry.coordinates;

  const target = geometry.totalLength * clamped;

  let low = 0;
  let high = geometry.cumulative.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (geometry.cumulative[mid]! < target) low = mid + 1;
    else high = mid;
  }

  const index = Math.max(1, low);
  const start = geometry.coordinates[index - 1]!;
  const end = geometry.coordinates[index]!;
  const segmentStart = geometry.cumulative[index - 1]!;
  const segmentLength = geometry.cumulative[index]! - segmentStart;
  const ratio = segmentLength === 0 ? 0 : (target - segmentStart) / segmentLength;

  const point: [number, number] = [
    start[0] + (end[0] - start[0]) * ratio,
    start[1] + (end[1] - start[1]) * ratio,
  ];

  return [...geometry.coordinates.slice(0, index), point];
}
