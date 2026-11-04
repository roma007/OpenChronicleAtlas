import type { AtlasEvent } from '../types';
import { eventEnd, eventStart } from './events';
import type { Timeline } from './types';

export interface TimelineEventMarker {
  event: AtlasEvent;
  /** 事件起点相对时间轴的比例，可能小于 0 或大于 1 */
  ratio: number;
  /** 事件终点比例；无 endDate 时等于 ratio */
  endRatio: number;
}

function rawRatio(time: number, timeline: Timeline): number {
  if (timeline.totalMs === 0) return 0;
  return (time - timeline.start) / timeline.totalMs;
}

/** 计算事件在时间轴上的位置；不做视口过滤 */
export function timelineEventMarkers(
  events: AtlasEvent[],
  timeline: Timeline,
): TimelineEventMarker[] {
  return events
    .map((event) => {
      const start = eventStart(event);
      const end = event.endDate ? eventEnd(event) : start;
      return {
        event,
        ratio: rawRatio(start, timeline),
        endRatio: rawRatio(end, timeline),
      };
    })
    .sort((a, b) => a.ratio - b.ratio);
}
