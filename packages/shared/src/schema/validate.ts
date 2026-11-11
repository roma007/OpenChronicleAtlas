import type {
  AtlasEvent,
  AtlasIssue,
  AtlasManifest,
  AtlasRouteFeature,
  AtlasTerritoryFeature,
} from '../types';
import { parseDateString } from '../time/date';

/**
 * 跨文件一致性校验。返回 error + warning 列表，调用方决定是否阻断。
 */
export function validateCrossFile(
  manifest: AtlasManifest,
  routes: AtlasRouteFeature[],
  events: AtlasEvent[],
  territories: AtlasTerritoryFeature[] = [],
): AtlasIssue[] {
  const issues: AtlasIssue[] = [];
  const entityIds = new Set(manifest.entities.map((e) => e.id));
  const eventIds = new Set<string>();
  const routeOrders = new Map<string, Set<number>>();

  const rangeStart = parseDateString(manifest.timeRange.start);
  const rangeEnd = parseDateString(manifest.timeRange.end);

  if (rangeStart > rangeEnd) {
    issues.push({
      level: 'error',
      path: 'manifest.timeRange',
      message: 'timeRange.start 不能晚于 timeRange.end',
    });
  }

  routes.forEach((route, index) => {
    const p = route.properties;
    const path = `routes[${index}].properties`;

    if (!entityIds.has(p.entityId)) {
      issues.push({
        level: 'error',
        path: `${path}.entityId`,
        message: `entityId "${p.entityId}" 不存在于 manifest.entities`,
      });
    }

    const start = parseDateString(p.startDate);
    const end = parseDateString(p.endDate);
    if (start > end) {
      issues.push({
        level: 'error',
        path: `${path}.endDate`,
        message: 'endDate 不能早于 startDate',
      });
    }

    const orders = routeOrders.get(p.entityId) ?? new Set<number>();
    if (orders.has(p.order)) {
      issues.push({
        level: 'warning',
        path: `${path}.order`,
        message: `entityId "${p.entityId}" 的 order=${p.order} 重复，时间轴排序可能不稳定`,
      });
    }
    orders.add(p.order);
    routeOrders.set(p.entityId, orders);

    route.geometry.coordinates.forEach(([lng, lat], i) => {
      if (lng < -180 || lng > 180 || lat < -85 || lat > 85) {
        issues.push({
          level: 'error',
          path: `routes[${index}].geometry.coordinates[${i}]`,
          message: `坐标越界：[${lng}, ${lat}]`,
        });
      }
    });
  });

  events.forEach((event, index) => {
    const path = `events[${index}]`;

    if (event.atlasId !== manifest.id) {
      issues.push({
        level: 'error',
        path: `${path}.atlasId`,
        message: `atlasId "${event.atlasId}" 与 manifest.id "${manifest.id}" 不一致`,
      });
    }

    if (eventIds.has(event.id)) {
      issues.push({
        level: 'error',
        path: `${path}.id`,
        message: `事件 id "${event.id}" 重复`,
      });
    }
    eventIds.add(event.id);

    event.entityIds.forEach((id) => {
      if (!entityIds.has(id)) {
        issues.push({
          level: 'error',
          path: `${path}.entityIds`,
          message: `entityId "${id}" 不存在于 manifest.entities`,
        });
      }
    });

    const date = parseDateString(event.date);
    if (event.endDate) {
      const end = parseDateString(event.endDate);
      if (end < date) {
        issues.push({
          level: 'error',
          path: `${path}.endDate`,
          message: 'endDate 不能早于 date',
        });
      }
    }

    if (date < rangeStart || date > rangeEnd) {
      issues.push({
        level: 'warning',
        path: `${path}.date`,
        message: `事件日期 ${event.date} 超出 manifest.timeRange`,
      });
    }
  });

  territories.forEach((territory, index) => {
    const p = territory.properties;
    const path = `territories[${index}].properties`;

    if (!entityIds.has(p.entityId)) {
      issues.push({
        level: 'error',
        path: `${path}.entityId`,
        message: `entityId "${p.entityId}" 不存在于 manifest.entities`,
      });
    }

    const start = parseDateString(p.startDate);
    const end = parseDateString(p.endDate);
    if (start > end) {
      issues.push({
        level: 'error',
        path: `${path}.endDate`,
        message: 'endDate 不能早于 startDate',
      });
    }

    if (end < rangeStart || start > rangeEnd) {
      issues.push({
        level: 'warning',
        path: `${path}.startDate`,
        message: `疆域时间段 ${p.startDate} → ${p.endDate} 与 manifest.timeRange 无重叠`,
      });
    }
  });

  // relatedIds 依赖完整事件集合，单独一轮
  events.forEach((event, index) => {
    (event.relatedIds ?? []).forEach((id) => {
      if (!eventIds.has(id)) {
        issues.push({
          level: 'warning',
          path: `events[${index}].relatedIds`,
          message: `关联事件 "${id}" 不存在`,
        });
      }
    });
  });

  return issues;
}
