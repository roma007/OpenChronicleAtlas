import { loadAtlas, loadAtlasIndex, loadSearchIndex } from '@atlas/shared';

const RAW_BASE = import.meta.env.VITE_DATA_BASE_URL ?? '/data/atlases';

/** 数据包根路径，如 /data/atlases */
export const DATA_BASE = RAW_BASE.replace(/\/+$/, '');

/** 把数据包内相对路径转为可访问 URL */
export function dataUrl(relativePath: string): string {
  return `${DATA_BASE}/${relativePath.replace(/^\/+/, '')}`;
}

export function fetchAtlasIndex() {
  return loadAtlasIndex(dataUrl('index.json'));
}

export function fetchAtlas(atlasId: string) {
  return loadAtlas(dataUrl(`${atlasId}/manifest.json`));
}

export function fetchSearchIndex() {
  return loadSearchIndex(dataUrl('search-index.json'));
}
