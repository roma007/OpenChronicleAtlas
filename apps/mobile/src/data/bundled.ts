import { AtlasDataError, type DataSource } from '@atlas/shared';
import { BUNDLED_IMAGES, BUNDLED_TEXT } from '../generated/atlasData';

/**
 * 内置数据（离线）数据源。
 *
 * 数据在构建时由 scripts/build-mobile-data.ts 生成静态 require 映射，
 * 不依赖网络；loader / schema 校验逻辑与 Web 端完全一致。
 */
export const BUNDLED_DATA_BASE = 'bundled://atlases';

function normalizeKey(input: string): string {
  let key = input;
  if (key.startsWith(BUNDLED_DATA_BASE)) key = key.slice(BUNDLED_DATA_BASE.length);
  key = key.replace(/^\/+/, '');
  const queryIndex = key.indexOf('?');
  return queryIndex >= 0 ? key.slice(0, queryIndex) : key;
}

export class BundledDataSource implements DataSource {
  async readText(path: string): Promise<string> {
    const key = normalizeKey(path);
    const loader = BUNDLED_TEXT[key];
    if (!loader) {
      throw new AtlasDataError(`内置数据缺少文件：${key}`);
    }
    return JSON.stringify(loader());
  }

  resolve(baseDir: string, relative: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(relative)) return relative;
    const dir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
    return `${dir}${relative}`;
  }

  dirname(file: string): string {
    const index = file.lastIndexOf('/');
    return index >= 0 ? file.slice(0, index + 1) : '';
  }
}

/** 返回内置图片模块（可直接作为 <Image source={...}>），缺失时返回 undefined。 */
export function getBundledImage(relative: string | undefined): number | undefined {
  if (!relative) return undefined;
  return BUNDLED_IMAGES[relative.replace(/^\/+/, '')];
}
