import type {
  AtlasDataset,
  AtlasEvent,
  AtlasRouteFeature,
  LocalizedString,
} from '../types';
import { parseDateString } from '../time/date';

const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;
const DEFAULT_THRESHOLD_KM = 30;

export type RouteQaIssueKind = 'no-active-route' | 'too-far';

export interface RouteQaIssue {
  atlasId: string;
  eventId: string;
  eventName: LocalizedString;
  entityId: string;
  kind: RouteQaIssueKind;
  startDate: string;
  endDate: string;
  thresholdKm: number;
  /** 仅 too-far 时存在，单位公里 */
  distanceKm?: number;
}

export interface RouteQaOptions {
  /** 距离阈值，单位公里；默认 30 */
  thresholdKm?: number;
}

/** 把经度差归一化到 [-180, 180]，避免跨日期变更线时取到长路径 */
function normalizeLngDelta(delta: number): number {
  let value = delta;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

/** 以 origin 为原点做局部切平面投影，返回公里坐标 */
function projectToLocalKm(
  origin: [number, number],
  target: [number, number],
): [number, number] {
  const latRad = (origin[1] * Math.PI) / 180;
  const x =
    normalizeLngDelta(target[0] - origin[0]) *
    KM_PER_DEG_LNG_AT_EQUATOR *
    Math.cos(latRad);
  const y = (target[1] - origin[1]) * KM_PER_DEG_LAT;
  return [x, y];
}

/**
 * 点到线段的最短距离（公里）。
 * 使用以 point 为原点的局部切平面投影，30km 级别检查足够精确。
 */
export function distancePointToSegmentKm(
  point: [number, number],
  start: [number, number],
  end: [number, number],
): number {
  const [ax, ay] = projectToLocalKm(point, start);
  const [bx, by] = projectToLocalKm(point, end);
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(ax, ay);
  }

  const rawT = -(ax * dx + ay * dy) / lengthSquared;
  const t = Math.min(1, Math.max(0, rawT));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

/** 点到折线路线的最短距离（公里） */
export function distancePointToRouteKm(
  point: [number, number],
  route: AtlasRouteFeature,
): number {
  const coordinates = route.geometry.coordinates;
  if (coordinates.length === 0) return Number.POSITIVE_INFINITY;
  if (coordinates.length === 1) {
    return distancePointToSegmentKm(point, coordinates[0]!, coordinates[0]!);
  }

  let best = Number.POSITIVE_INFINITY;
  for (let i = 1; i < coordinates.length; i += 1) {
    best = Math.min(
      best,
      distancePointToSegmentKm(point, coordinates[i - 1]!, coordinates[i]!),
    );
  }
  return best;
}

/** 路线是否在事件日期区间内有效（区间有重叠即可） */
export function isRouteActiveForEvent(
  route: AtlasRouteFeature,
  event: AtlasEvent,
): boolean {
  const eventStart = parseDateString(event.date);
  const eventEnd = parseDateString(event.endDate ?? event.date);
  const routeStart = parseDateString(route.properties.startDate);
  const routeEnd = parseDateString(route.properties.endDate);
  return routeStart <= eventEnd && routeEnd >= eventStart;
}

/**
 * 检查单个专题的事件-路线一致性。
 * - 政治/外交等 `extensions.routeEvent = false` 的事件跳过；
 * - 每个事件对每个实体找活动路线；
 * - 无活动路线或距离超过阈值时返回问题。
 */
export function checkDatasetRoutes(
  dataset: AtlasDataset,
  options: RouteQaOptions = {},
): RouteQaIssue[] {
  const thresholdKm = options.thresholdKm ?? DEFAULT_THRESHOLD_KM;
  const issues: RouteQaIssue[] = [];

  for (const event of dataset.events) {
    if (event.extensions?.routeEvent === false) continue;

    const eventEnd = event.endDate ?? event.date;
    const point: [number, number] = [event.location.lng, event.location.lat];

    for (const entityId of event.entityIds) {
      const activeRoutes = dataset.routes.filter(
        (route) =>
          route.properties.entityId === entityId &&
          isRouteActiveForEvent(route, event),
      );

      if (activeRoutes.length === 0) {
        issues.push({
          atlasId: dataset.manifest.id,
          eventId: event.id,
          eventName: event.name,
          entityId,
          kind: 'no-active-route',
          startDate: event.date,
          endDate: eventEnd,
          thresholdKm,
        });
        continue;
      }

      const distanceKm = Math.min(
        ...activeRoutes.map((route) => distancePointToRouteKm(point, route)),
      );

      if (distanceKm > thresholdKm) {
        issues.push({
          atlasId: dataset.manifest.id,
          eventId: event.id,
          eventName: event.name,
          entityId,
          kind: 'too-far',
          startDate: event.date,
          endDate: eventEnd,
          thresholdKm,
          distanceKm,
        });
      }
    }
  }

  return issues;
}

/** 检查多个专题 */
export function checkDatasetsRoutes(
  datasets: AtlasDataset[],
  options: RouteQaOptions = {},
): RouteQaIssue[] {
  return datasets.flatMap((dataset) => checkDatasetRoutes(dataset, options));
}
