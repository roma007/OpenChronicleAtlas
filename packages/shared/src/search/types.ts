import type { AtlasDataset, AtlasTime, LocalizedString } from '../types';

export interface SearchEvent {
  id: string;
  name: LocalizedString;
  date: string;
  endDate?: string;
  location: { lng: number; lat: number; place?: LocalizedString };
  entityIds: string[];
  category: string;
  summary: LocalizedString;
  importance?: 1 | 2 | 3;
}

export interface SearchEntry {
  atlasId: string;
  atlasTitle: LocalizedString;
  event: SearchEvent;
  fields: {
    name: string;
    place: string;
    summary: string;
    description: string;
    category: string;
    entities: string;
    date: string;
    pinyin: string;
    initials: string;
  };
}

export interface SearchIndex {
  entries: SearchEntry[];
}

export interface SearchIndexFile extends SearchIndex {
  schemaVersion: string;
  generatedAt: string;
}

export interface SearchOptions {
  atlasId?: string;
  category?: string;
  entityId?: string;
  from?: AtlasTime;
  to?: AtlasTime;
  limit?: number;
}

export interface SearchHit {
  atlasId: string;
  atlasTitle: LocalizedString;
  event: SearchEvent;
  score: number;
  field: keyof SearchEntry['fields'];
  snippet: string;
}

export type { AtlasDataset };
