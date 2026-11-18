import type { AtlasRouteFeature, AtlasTime, DateString } from '../types';
import { DAY_MS, parseDateString, toDateString } from '../time/date';
import type { Timeline } from './types';

export function createTimeline(range: { start: DateString; end: DateString }): Timeline {
  const start = parseDateString(range.start);
  const end = parseDateString(range.end);
  if (end < start) throw new Error('timeRange.end 不能早于 timeRange.start');

  return {
    start,
    end,
    totalMs: end - start,
    totalDays: Math.round((end - start) / DAY_MS),
  };
}

/**
 * 当前筛选出的路线图层的最小开始日期与最大结束日期。
 * 返回 null 表示没有可用路线，调用方应回退到专题自身的 timeRange。
 */
export function routeDateRange(
  routes: AtlasRouteFeature[],
  isIncluded: (entityId: string) => boolean,
): { start: DateString; end: DateString } | null {
  let start: DateString | null = null;
  let end: DateString | null = null;
  for (const route of routes) {
    if (!isIncluded(route.properties.entityId)) continue;
    const routeStart = route.properties.startDate;
    const routeEnd = route.properties.endDate;
    if (start === null || routeStart < start) start = routeStart;
    if (end === null || routeEnd > end) end = routeEnd;
  }
  return start === null || end === null ? null : { start, end };
}

export function timeToRatio(time: AtlasTime, timeline: Timeline): number {
  if (timeline.totalMs === 0) return 0;
  return Math.min(1, Math.max(0, (time - timeline.start) / timeline.totalMs));
}

export function snapToDay(time: AtlasTime): AtlasTime {
  const date = new Date(time);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function ratioToTime(ratio: number, timeline: Timeline): AtlasTime {
  const clamped = Math.min(1, Math.max(0, ratio));
  return snapToDay(timeline.start + clamped * timeline.totalMs);
}

export function stepDays(time: AtlasTime, days: number): AtlasTime {
  return snapToDay(time + days * DAY_MS);
}

export function clampToTimeline(time: AtlasTime, timeline: Timeline): AtlasTime {
  return Math.min(timeline.end, Math.max(timeline.start, time));
}

export { toDateString };
