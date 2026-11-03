import type { AtlasTime, DateString } from '../types';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/** 解析 YYYY-MM-DD 为 UTC 日粒度时间戳；非法日期抛错。 */
export function parseDateString(input: DateString): AtlasTime {
  const m = DATE_RE.exec(input);
  if (!m) throw new Error(`非法日期（应为 YYYY-MM-DD）：${input}`);

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const t = Date.UTC(year, month - 1, day);
  const check = new Date(t);

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`非法日期：${input}`);
  }

  return t;
}

export function toDateString(t: AtlasTime): DateString {
  return new Date(t).toISOString().slice(0, 10);
}

export function clampTime(t: AtlasTime, start: AtlasTime, end: AtlasTime): AtlasTime {
  return Math.min(Math.max(t, start), end);
}

export function diffDays(a: AtlasTime, b: AtlasTime): number {
  return Math.round((a - b) / DAY_MS);
}

export function formatDate(t: AtlasTime, locale = 'zh-CN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(t);
}

export function formatRange(start: AtlasTime, end: AtlasTime, locale = 'zh-CN'): string {
  if (start === end) return formatDate(start, locale);
  return `${formatDate(start, locale)} — ${formatDate(end, locale)}`;
}

export { DAY_MS };
