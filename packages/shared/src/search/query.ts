import { eventStart } from '../timeline/events';
import { normalizeText } from './index';
import type { SearchEntry, SearchHit, SearchIndex, SearchOptions } from './types';

const FIELD_BASE: Record<keyof SearchEntry['fields'], number> = {
  name: 80,
  place: 60,
  category: 40,
  entities: 30,
  summary: 25,
  date: 20,
  description: 15,
};

interface Match {
  score: number;
  field: keyof SearchEntry['fields'];
}

function matchField(
  field: keyof SearchEntry['fields'],
  text: string,
  query: string,
): Match | null {
  if (!text) return null;
  const normalized = normalizeText(text);
  if (!normalized.includes(query)) return null;

  const base = FIELD_BASE[field];
  const score = normalized === query ? base + 20 : base;
  return { score, field };
}

function bestMatch(entry: SearchEntry, query: string): Match | null {
  let best: Match | null = null;

  for (const field of Object.keys(entry.fields) as Array<keyof SearchEntry['fields']>) {
    const match = matchField(field, entry.fields[field], query);
    if (match && (!best || match.score > best.score)) best = match;
  }

  return best;
}

function makeSnippet(text: string, query: string, radius = 30): string {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query);
  if (index < 0) return text.slice(0, radius * 2);

  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + query.length + radius);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export function searchEvents(
  query: string,
  index: SearchIndex,
  options: SearchOptions = {},
): SearchHit[] {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const hits: SearchHit[] = [];

  for (const entry of index.entries) {
    if (options.atlasId && entry.atlasId !== options.atlasId) continue;
    if (options.category && entry.event.category !== options.category) continue;
    if (options.entityId && !entry.event.entityIds.includes(options.entityId)) continue;

    const start = eventStart(entry.event);
    if (options.from !== undefined && start < options.from) continue;
    if (options.to !== undefined && start > options.to) continue;

    const match = bestMatch(entry, normalized);
    if (!match) continue;

    hits.push({
      atlasId: entry.atlasId,
      atlasTitle: entry.atlasTitle,
      event: entry.event,
      score: match.score,
      field: match.field,
      snippet: makeSnippet(entry.fields[match.field], normalized),
    });
  }

  return hits
    .sort((a, b) => b.score - a.score || b.event.date.localeCompare(a.event.date))
    .slice(0, options.limit ?? 50);
}
