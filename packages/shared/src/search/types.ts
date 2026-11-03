import type { AtlasDataset, AtlasEvent, AtlasTime } from '../types';

export interface SearchEntry {
  atlasId: string;
  atlasTitle: string;
  event: AtlasEvent;
  fields: {
    name: string;
    place: string;
    summary: string;
    description: string;
    category: string;
    entities: string;
    date: string;
  };
}

export interface SearchIndex {
  entries: SearchEntry[];
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
  atlasTitle: string;
  event: AtlasEvent;
  score: number;
  field: keyof SearchEntry['fields'];
  snippet: string;
}

export type { AtlasDataset };
