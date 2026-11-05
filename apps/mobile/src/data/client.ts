import { loadAtlas, loadAtlasIndex, loadSearchIndex } from '@atlas/shared';
import { CachedHttpDataSource } from './cache';

const DEFAULT_BASE = 'http://10.0.2.2:5180/data/atlases';

export const DATA_BASE = (process.env.EXPO_PUBLIC_DATA_BASE_URL ?? DEFAULT_BASE).replace(
  /\/+$/,
  '',
);

const dataSource = new CachedHttpDataSource();

export const fetchAtlasIndex = () =>
  loadAtlasIndex(`${DATA_BASE}/index.json`, { dataSource });

export const fetchAtlas = (atlasId: string) =>
  loadAtlas(`${DATA_BASE}/${atlasId}/manifest.json`, { dataSource });

export const fetchSearchIndex = () =>
  loadSearchIndex(`${DATA_BASE}/search-index.json`, { dataSource });
