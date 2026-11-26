import { loadAtlas, loadAtlasIndex, loadSearchIndex, type DataSource } from '@atlas/shared';
import type { ImageSourcePropType } from 'react-native';
import { CachedHttpDataSource } from './cache';

/**
 * 数据策略：仅使用远端数据（atlas.openapp.asia）。
 * 网络成功时数据写入 AsyncStorage 缓存，离线时回退缓存。
 */
const REMOTE_BASE = (process.env.EXPO_PUBLIC_DATA_BASE_URL ?? '').replace(/\/+$/, '');

if (!REMOTE_BASE) {
  // 开发期忘记配 .env.local 时尽早暴露，避免静默走旧路径
  console.warn('[atlas] EXPO_PUBLIC_DATA_BASE_URL 未配置，远端数据不可用');
}

export const DATA_BASE = REMOTE_BASE;

const dataSource: DataSource = new CachedHttpDataSource();

/**
 * 解析数据包内的图片路径：远端模式返回 HTTP URL。
 */
export function resolveDataImage(
  relativePath: string | undefined,
  atlasId?: string,
): ImageSourcePropType | null {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return { uri: relativePath };

  const key = relativePath.replace(/^\/+/, '');
  const fullKey = atlasId && !key.startsWith(`${atlasId}/`) ? `${atlasId}/${key}` : key;

  return { uri: `${REMOTE_BASE}/${fullKey}` };
}

export const fetchAtlasIndex = () =>
  loadAtlasIndex(`${DATA_BASE}/index.json`, { dataSource });

export const fetchAtlas = (atlasId: string) =>
  loadAtlas(`${DATA_BASE}/${atlasId}/manifest.json`, { dataSource });

export const fetchSearchIndex = () =>
  loadSearchIndex(`${DATA_BASE}/search-index.json`, { dataSource });

/** 拉取远端最新 dataVersion，用于和本地缓存版本对比提示用户更新。 */
export async function fetchLatestDataVersion(): Promise<string | undefined> {
  if (!REMOTE_BASE) return undefined;
  try {
    const response = await fetch(`${REMOTE_BASE}/index.json?t=${Date.now()}`);
    if (!response.ok) return undefined;
    const raw = (await response.json()) as { dataVersion?: string };
    return raw.dataVersion;
  } catch {
    return undefined;
  }
}
