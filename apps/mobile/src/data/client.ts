import { loadAtlas, loadAtlasIndex } from '@atlas/shared';

const DEFAULT_BASE = 'http://10.0.2.2:5180/data/atlases';

export const DATA_BASE = (process.env.EXPO_PUBLIC_DATA_BASE_URL ?? DEFAULT_BASE).replace(
  /\/+$/,
  '',
);

export const fetchAtlasIndex = () => loadAtlasIndex(`${DATA_BASE}/index.json`);
export const fetchAtlas = (atlasId: string) => loadAtlas(`${DATA_BASE}/${atlasId}/manifest.json`);
