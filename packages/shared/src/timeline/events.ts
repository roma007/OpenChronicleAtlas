import type { AtlasEvent, AtlasTime } from '../types';
import { DAY_MS, parseDateString } from '../time/date';

export function eventStart(event: AtlasEvent): AtlasTime {
  return parseDateString(event.date);
}

/** 无 endDate 的事件视为持续一天 */
export function eventEnd(event: AtlasEvent): AtlasTime {
  return event.endDate ? parseDateString(event.endDate) : eventStart(event) + DAY_MS;
}

export function isEventActive(event: AtlasEvent, time: AtlasTime): boolean {
  return eventStart(event) <= time && time <= eventEnd(event);
}

/** 该时间点之前已经发生的事件（含持续事件） */
export function visibleEventsAt(events: AtlasEvent[], time: AtlasTime): AtlasEvent[] {
  return events.filter((event) => eventStart(event) <= time);
}

/** 时间点之前最近发生的事件；用于高亮与气泡 */
export function latestEventAt(
  events: AtlasEvent[],
  time: AtlasTime,
): AtlasEvent | undefined {
  let latest: AtlasEvent | undefined;
  let latestStart = Number.NEGATIVE_INFINITY;

  for (const event of events) {
    const start = eventStart(event);
    if (start <= time && start > latestStart) {
      latest = event;
      latestStart = start;
    }
  }

  return latest;
}
