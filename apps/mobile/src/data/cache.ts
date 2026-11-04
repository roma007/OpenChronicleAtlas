import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpDataSource, type DataSource } from '@atlas/shared';

const CACHE_PREFIX = 'atlas-cache:v1:';

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
        if (cached !== null) return cached;
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
