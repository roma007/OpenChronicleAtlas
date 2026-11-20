import type {
  AtlasEvent,
  AtlasIssue,
  AtlasManifest,
  AtlasRegion,
  AtlasRegionIndex,
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
  regions: AtlasRegion[] = [],
  regionIndex: AtlasRegionIndex | null = null,
): AtlasIssue[] {
  const issues: AtlasIssue[] = [];
  const entityIds = new Set(manifest.entities.map((e) => e.id));
  const regionIds = new Set<string>();
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

  const regionParents = new Map<string, string | null>();
  regions.forEach((region, index) => {
    const path = `regions[${index}]`;
    if (regionIds.has(region.id)) {
      issues.push({
        level: 'error',
        path: `${path}.id`,
        message: `地区 id "${region.id}" 重复`,
      });
    }
    regionIds.add(region.id);
    regionParents.set(region.id, region.parentId);
    if (region.parentId && !regions.some((item) => item.id === region.parentId)) {
      issues.push({
        level: 'error',
        path: `${path}.parentId`,
        message: `parentId "${region.parentId}" 不存在于 regions`,
      });
    }
    if (region.level === 'province' || region.level === 'municipality' || region.level === 'overseas') {
      if (region.parentId !== null) {
        issues.push({
          level: 'warning',
          path: `${path}.parentId`,
          message: `${region.level} 通常应为一级地区（parentId: null）`,
        });
      }
    }
  });

  // 防止循环父子关系
  for (const id of regionIds) {
    const seen = new Set<string>();
    let current: string | null | undefined = id;
    while (current) {
      if (seen.has(current)) {
        issues.push({
          level: 'error',
          path: `regions.${id}.parentId`,
          message: '地区父子关系存在循环',
        });
        break;
      }
      seen.add(current);
      current = regionParents.get(current) ?? null;
    }
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

    for (const id of p.regionIds ?? []) {
      if (!regionIds.has(id)) {
        issues.push({
          level: 'error',
          path: `${path}.regionIds`,
          message: `地区 id "${id}" 不存在于 regions`,
        });
      }
    }
    for (const id of p.endpointRegionIds ?? []) {
      if (!regionIds.has(id)) {
        issues.push({
          level: 'error',
          path: `${path}.endpointRegionIds`,
          message: `地区 id "${id}" 不存在于 regions`,
        });
      }
    }

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

    for (const id of event.location.regionIds ?? []) {
      if (!regionIds.has(id)) {
        issues.push({
          level: 'error',
          path: `${path}.location.regionIds`,
          message: `地区 id "${id}" 不存在于 regions`,
        });
      }
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

  // regionIndex 的键必须能对应到真实事件/路线
  if (regionIndex) {
    const routeKeys = new Set(
      routes.map((route) => `${route.properties.entityId}:${route.properties.order}`),
    );
    for (const [eventId, ids] of Object.entries(regionIndex.events)) {
      if (!eventIds.has(eventId)) {
        issues.push({
          level: 'error',
          path: `regionIndex.events.${eventId}`,
          message: 'regionIndex 引用了不存在的事件',
        });
      }
      for (const id of ids) {
        if (!regionIds.has(id)) {
          issues.push({
            level: 'error',
            path: `regionIndex.events.${eventId}`,
            message: `地区 id "${id}" 不存在于 regions`,
          });
        }
      }
    }
    for (const [key, entry] of Object.entries(regionIndex.routes)) {
      if (!routeKeys.has(key)) {
        issues.push({
          level: 'error',
          path: `regionIndex.routes.${key}`,
          message: 'regionIndex 引用了不存在的路线（entityId:order）',
        });
      }
      for (const id of [...entry.regionIds, ...(entry.endpointRegionIds ?? [])]) {
        if (!regionIds.has(id)) {
          issues.push({
            level: 'error',
            path: `regionIndex.routes.${key}`,
            message: `地区 id "${id}" 不存在于 regions`,
          });
        }
      }
    }
  }

  return issues;
}
