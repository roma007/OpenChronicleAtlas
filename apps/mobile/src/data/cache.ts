import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpDataSource, type DataSource } from '@atlas/shared';

const CACHE_PREFIX = 'atlas-cache:v1:';

let cacheHit = false;

/** 每次加载前重置，避免上一次加载的缓存命中污染本次状态 */
export function resetCacheHit(): void {
  cacheHit = false;
}

/** 读取并清除缓存命中标记 */
export function consumeCacheHit(): boolean {
  const value = cacheHit;
  cacheHit = false;
  return value;
}

/** 只删除专题数据缓存，不影响语言等其他键 */
export async function clearAtlasCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
  if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
}

function cacheKey(path: string): string {
  return `${CACHE_PREFIX}${path}`;
}

/**
 * 包装 HttpDataSource：网络成功时写入 AsyncStorage，失败时回退缓存。
 * 只缓存公开静态数据（index / manifest / routes / events）。
 */
export class CachedHttpDataSource implements DataSource {
  private readonly inner = new HttpDataSource();

  async readText(path: string): Promise<string> {
    try {
      const text = await this.inner.readText(path);
      try {
        await AsyncStorage.setItem(cacheKey(path), text);
      } catch {
        // 缓存写入失败不影响本次加载
      }
      return text;
    } catch (error) {
      try {
        const cached = await AsyncStorage.getItem(cacheKey(path));
        if (cached !== null) {
          cacheHit = true;
          return cached;
        }
      } catch {
        // 缓存读取失败时抛出原始网络错误
      }
      throw error;
    }
  }

  resolve(baseDir: string, relative: string): string {
    return this.inner.resolve(baseDir, relative);
  }

  dirname(file: string): string {
    return this.inner.dirname(file);
  }
}
