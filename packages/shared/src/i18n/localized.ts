import type { LocalizedString } from '../types';

/**
 * 按 locale 解析多语言字符串。
 * 优先级：locale 主语言 → zh → 第一个非空值。
 */
export function resolveLocalized(value: LocalizedString | undefined, locale = 'zh'): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;

  const lang = locale.split('-')[0] as 'zh' | 'en';
  const direct = value[lang];
  if (direct) return direct;
  if (value.zh) return value.zh;

  const first = Object.values(value).find((v) => typeof v === 'string' && v.length > 0);
  return first ?? '';
}
