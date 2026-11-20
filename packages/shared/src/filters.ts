import type { AtlasEvent, DateString } from './types';
import { parseDateString } from './time/date';
import { matchesRegionFilter } from './regions';

export interface AtlasFilters {
  categories: string[];
  from?: DateString;
  to?: DateString;
  /** 选中的省/县市/地点 id；空数组表示不过滤 */
  regionIds: string[];
}

export const EMPTY_FILTERS: AtlasFilters = { categories: [], regionIds: [] };

export function collectCategories(events: Array<{ category: string }>): string[] {
  return [...new Set(events.map((event) => event.category))].sort((a, b) => a.localeCompare(b));
}

export function applyEventFilters(
  events: AtlasEvent[],
  filters: AtlasFilters,
): AtlasEvent[] {
  const categories = new Set(filters.categories);
  const regionIds = filters.regionIds ?? [];
  const from = filters.from ? parseDateString(filters.from) : undefined;
  const to = filters.to ? parseDateString(filters.to) : undefined;

  if (from !== undefined && to !== undefined && from > to) return [];

  return events.filter((event) => {
    if (categories.size > 0 && !categories.has(event.category)) return false;

    if (!matchesRegionFilter(event.location.regionIds, regionIds)) return false;

    const date = parseDateString(event.date);
    if (from !== undefined && date < from) return false;
    if (to !== undefined && date > to) return false;

    return true;
  });
}
