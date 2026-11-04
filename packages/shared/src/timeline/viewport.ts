import type { AtlasTime } from '../types';
import { DAY_MS } from '../time/date';
import type { Timeline } from './types';

export const MAX_TIMELINE_ZOOM = 8;

/** 指定缩放级别下视口的时间跨度（毫秒），最小为 1 天 */
export function timelineSpan(timeline: Timeline, level: number): number {
  const safeLevel = Math.min(MAX_TIMELINE_ZOOM, Math.max(0, Math.round(level)));
  return Math.max(DAY_MS, timeline.totalMs / 2 ** safeLevel);
}

/** 把视口起点限制在全量时间轴内 */
export function clampViewportStart(
  timeline: Timeline,
  level: number,
  start: AtlasTime,
): AtlasTime {
  const span = timelineSpan(timeline, level);
  const maxStart = Math.max(timeline.start, timeline.end - span);
  return Math.min(Math.max(start, timeline.start), maxStart);
}

/** 以某个时间为中心计算视口起点 */
export function centerViewportStart(
  timeline: Timeline,
  level: number,
  time: AtlasTime,
): AtlasTime {
  const span = timelineSpan(timeline, level);
  return clampViewportStart(timeline, level, time - span / 2);
}

/** 根据缩放级别与起点生成视口时间轴；起点为空时从全量起点开始 */
export function createViewport(
  timeline: Timeline,
  level: number,
  viewStart?: AtlasTime | null,
): Timeline {
  const span = timelineSpan(timeline, level);
  const start = clampViewportStart(timeline, level, viewStart ?? timeline.start);
  const end = Math.min(timeline.end, start + span);
  return {
    start,
    end,
    totalMs: end - start,
    totalDays: Math.round((end - start) / DAY_MS),
  };
}
