import type { AtlasEvent, DateString } from './types';
import { parseDateString } from './time/date';

export interface AtlasFilters {
  categories: string[];
  from?: DateString;
  to?: DateString;
}

export const EMPTY_FILTERS: AtlasFilters = { categories: [] };

export function collectCategories(events: Array<{ category: string }>): string[] {
  return [...new Set(events.map((event) => event.category))].sort((a, b) => a.localeCompare(b));
}

export function applyEventFilters(
  events: AtlasEvent[],
  filters: AtlasFilters,
): AtlasEvent[] {
  const categories = new Set(filters.categories);
  const from = filters.from ? parseDateString(filters.from) : undefined;
  const to = filters.to ? parseDateString(filters.to) : undefined;

  if (from !== undefined && to !== undefined && from > to) return [];

  return events.filter((event) => {
    if (categories.size > 0 && !categories.has(event.category)) return false;

    const date = parseDateString(event.date);
    if (from !== undefined && date < from) return false;
    if (to !== undefined && date > to) return false;

    return true;
  });
}
