/**
 * 拼音能力按需加载：pinyin-pro 体积较大，不应进入首屏主包。
 * 只有搜索页真正需要拼音增强时才调用 loadPinyinProvider()。
 */
export interface PinyinProvider {
  /** 返回文本中所有汉字的无声调拼音音节。 */
  syllables(text: string): string[];
}

let providerPromise: Promise<PinyinProvider> | null = null;

/** 动态加载 pinyin-pro，并缓存 provider，避免重复解析模块。 */
export function loadPinyinProvider(): Promise<PinyinProvider> {
  if (!providerPromise) {
    providerPromise = import('pinyin-pro')
      .then(({ pinyin }) => ({
        syllables(text: string): string[] {
          const cjk = text.match(/[\u4e00-\u9fff]+/g);
          if (!cjk) return [];
          return pinyin(cjk.join(' '), { toneType: 'none', type: 'array' });
        },
      }))
      .catch((error: unknown) => {
        // 加载失败时清空缓存，允许用户下次进入搜索页时重试。
        providerPromise = null;
        throw error;
      });
  }
  return providerPromise;
}
