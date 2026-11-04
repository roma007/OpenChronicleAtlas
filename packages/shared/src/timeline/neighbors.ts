import type { AtlasEvent } from '../types';

export interface EventNeighbors {
  previous?: AtlasEvent;
  next?: AtlasEvent;
}

/** 按日期与 ID 排序后返回当前事件的前后邻居 */
export function neighborEvents(
  events: AtlasEvent[],
  eventId: string,
): EventNeighbors {
  const sorted = [...events].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
  const index = sorted.findIndex((event) => event.id === eventId);
  if (index < 0) return {};

  return {
    previous: sorted[index - 1],
    next: sorted[index + 1],
  };
}
