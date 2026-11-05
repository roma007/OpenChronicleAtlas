import type { AtlasDataset, AtlasEvent, AtlasTime, LocalizedString } from '../types';

export interface SearchEntry {
  atlasId: string;
  atlasTitle: LocalizedString;
  event: AtlasEvent;
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
  event: AtlasEvent;
  score: number;
  field: keyof SearchEntry['fields'];
  snippet: string;
}

export type { AtlasDataset };
