export type Locale = 'zh' | 'en';

export const DEFAULT_LOCALE: Locale = 'zh';
export const SUPPORTED_LOCALES: Locale[] = ['zh', 'en'];

/** 归一化语言标签：en / en-US / EN → en，其余 → zh */
export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const lang = value.toLowerCase().split('-')[0];
  return lang === 'en' ? 'en' : 'zh';
}

/** 传给 Intl / formatDate 的语言标签 */
export function localeTag(locale: Locale): string {
  return locale === 'en' ? 'en-US' : 'zh-CN';
}

export function nextLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}
