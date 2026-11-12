import { loadAtlas, loadAtlasIndex, loadSearchIndex, type DataSource } from '@atlas/shared';
import type { ImageSourcePropType } from 'react-native';
import { BUNDLED_DATA_BASE, BundledDataSource, getBundledImage } from './bundled';
import { CachedHttpDataSource } from './cache';

/**
 * 数据策略：
 * - 默认：使用打包进 App 的 data/atlases（离线可用）；
 * - 配置 EXPO_PUBLIC_DATA_BASE_URL 后：远端优先，失败时回退到内置数据。
 *   以后建好服务器，只需设置该变量并重新打包，不需要改数据格式。
 */
const REMOTE_BASE = (process.env.EXPO_PUBLIC_DATA_BASE_URL ?? '').replace(/\/+$/, '');

export const DATA_BASE = REMOTE_BASE || BUNDLED_DATA_BASE;

class RemoteWithBundledFallback implements DataSource {
  private readonly remote = new CachedHttpDataSource();
  private readonly bundled = new BundledDataSource();

  async readText(path: string): Promise<string> {
    try {
      return await this.remote.readText(path);
    } catch (error) {
      const relative = path.startsWith(REMOTE_BASE)
        ? path.slice(REMOTE_BASE.length)
        : path.replace(/^bundled:\/\/atlases/, '');
      try {
        return await this.bundled.readText(
          `${BUNDLED_DATA_BASE}/${relative.replace(/^\/+/, '')}`,
        );
      } catch {
        throw error;
      }
    }
  }

  resolve(baseDir: string, relative: string): string {
    return this.remote.resolve(baseDir, relative);
  }

  dirname(file: string): string {
    return this.remote.dirname(file);
  }
}

const dataSource: DataSource = REMOTE_BASE
  ? new RemoteWithBundledFallback()
  : new BundledDataSource();

/**
 * 解析数据包内的图片路径：
 * - 远端模式返回 HTTP URL；
 * - 内置模式返回本地 asset（SVG 暂不支持，返回 null 由界面走占位）。
 */
export function resolveDataImage(
  relativePath: string | undefined,
  atlasId?: string,
): ImageSourcePropType | null {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return { uri: relativePath };

  const key = relativePath.replace(/^\/+/, '');
  const fullKey = atlasId && !key.startsWith(`${atlasId}/`) ? `${atlasId}/${key}` : key;

  if (REMOTE_BASE) return { uri: `${REMOTE_BASE}/${fullKey}` };

  return getBundledImage(fullKey) ?? null;
}

export const fetchAtlasIndex = () =>
  loadAtlasIndex(`${DATA_BASE}/index.json`, { dataSource });

export const fetchAtlas = (atlasId: string) =>
  loadAtlas(`${DATA_BASE}/${atlasId}/manifest.json`, { dataSource });

export const fetchSearchIndex = () =>
  loadSearchIndex(`${DATA_BASE}/search-index.json`, { dataSource });

/** 仅远端模式可用；内置模式返回 undefined，避免请求 bundled:// 地址。 */
export async function fetchLatestDataVersion(): Promise<string | undefined> {
  if (!REMOTE_BASE) return undefined;
  const response = await fetch(`${REMOTE_BASE}/index.json?t=${Date.now()}`);
  if (!response.ok) return undefined;
  const raw = (await response.json()) as { dataVersion?: string };
  return raw.dataVersion;
}
