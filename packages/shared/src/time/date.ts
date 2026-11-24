import type { AtlasTime, DateString } from '../types';

/**
 * 日期格式：`YYYY-MM-DD`，公元前在年份前加负号，如 `-0475-06-01`。
 * 采用**历史纪年**：-0475 = 前 475 年，不存在公元 0 年（-0001 之后直接是 0001）。
 * JS Date 用的是**天文纪年**（含 0 年），两者差 1，转换见 toAstronomicalYear / toHistoricalYear。
 */
const DATE_RE = /^(-?)(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isZhLocale(locale: string) {
  return locale.toLowerCase().startsWith('zh');
}

function toAstronomicalYear(year: number): number {
  return year < 0 ? year + 1 : year;
}

function toHistoricalYear(year: number): number {
  return year <= 0 ? year - 1 : year;
}

/**
 * 用 setUTCFullYear 构造 UTC 时间戳。
 * 不能直接用 Date.UTC：它会把 0—99 年当成 1900—1999 年。
 */
export function utcFromParts(year: number, monthIndex: number, day: number): AtlasTime {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, monthIndex, day);
  return date.getTime();
}

/** 解析 `YYYY-MM-DD`（支持公元前 `-YYYY-MM-DD`）为 UTC 日粒度时间戳；非法日期抛错。 */
export function parseDateString(input: DateString): AtlasTime {
  const m = DATE_RE.exec(input);
  if (!m) throw new Error(`非法日期（应为 YYYY-MM-DD 或 -YYYY-MM-DD）：${input}`);

  const year = (m[1] === '-' ? -1 : 1) * Number(m[2]);
  const month = Number(m[3]);
  const day = Number(m[4]);
  if (year === 0) throw new Error(`不存在公元 0 年：${input}`);

  const astronomicalYear = toAstronomicalYear(year);
  const t = utcFromParts(astronomicalYear, month - 1, day);
  const check = new Date(t);

  if (
    check.getUTCFullYear() !== astronomicalYear ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`非法日期：${input}`);
  }

  return t;
}

export function isValidDateString(value: unknown): value is DateString {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  try {
    parseDateString(value);
    return true;
  } catch {
    return false;
  }
}

export function toDateString(t: AtlasTime): DateString {
  const date = new Date(t);
  const year = toHistoricalYear(date.getUTCFullYear());
  const sign = year < 0 ? '-' : '';
  const abs = String(Math.abs(year)).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${sign}${abs}-${month}-${day}`;
}

/** 按时间戳比较两个日期字符串；不要用字符串比较，负年份会反向。 */
export function compareDateStrings(a: DateString, b: DateString): number {
  return parseDateString(a) - parseDateString(b);
}

export function clampTime(t: AtlasTime, start: AtlasTime, end: AtlasTime): AtlasTime {
  return Math.min(Math.max(t, start), end);
}

export function diffDays(a: AtlasTime, b: AtlasTime): number {
  return Math.round((a - b) / DAY_MS);
}

export type DatePrecision = 'year' | 'month' | 'day';

/**
 * 年精度专题在「只选一个主体」且时间跨度较短时，允许显示更细的日期：
 * - 跨度 ≤ 10 年：日
 * - 跨度 ≤ 200 年：月
 * - 其余：年
 * 多主体同时显示时仍按专题原始精度，避免把千年跨度写成日。
 */
export function resolveDatePrecision(
  base: DatePrecision,
  activeEntityCount: number,
  spanMs: number,
): DatePrecision {
  if (base !== 'year') return base;
  if (activeEntityCount !== 1) return 'year';
  const years = spanMs / (365.25 * DAY_MS);
  if (years <= 10) return 'day';
  if (years <= 200) return 'month';
  return 'year';
}

/** 公元前只在这里手动格式化，避免三端 Intl 对「纪年」的差异。 */
function formatBceDate(
  year: number,
  monthIndex: number,
  day: number,
  precision: DatePrecision,
  locale: string,
): string {
  const bce = -year;
  if (isZhLocale(locale)) {
    if (precision === 'year') return `前${bce}年`;
    if (precision === 'month') return `前${bce}年${monthIndex + 1}月`;
    return `前${bce}年${monthIndex + 1}月${day}日`;
  }
  if (precision === 'year') return `${bce} BCE`;
  const monthName = EN_MONTHS[monthIndex]!;
  if (precision === 'month') return `${monthName} ${bce} BCE`;
  return `${day} ${monthName} ${bce} BCE`;
}

export function formatDate(
  t: AtlasTime,
  locale = 'zh-CN',
  precision: DatePrecision = 'day',
): string {
  const date = new Date(t);
  const year = toHistoricalYear(date.getUTCFullYear());

  if (year < 0) {
    return formatBceDate(year, date.getUTCMonth(), date.getUTCDate(), precision, locale);
  }

  // Hermes 的 Intl 可能缺少中文 locale 数据，中文走手动格式化保证三端一致
  if (isZhLocale(locale)) {
    if (precision === 'year') return `${year}年`;
    if (precision === 'month') return `${year}年${date.getUTCMonth() + 1}月`;
    return `${year}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
  }

  const options: Intl.DateTimeFormatOptions =
    precision === 'year'
      ? { year: 'numeric' }
      : precision === 'month'
        ? { year: 'numeric', month: 'long' }
        : { year: 'numeric', month: 'long', day: 'numeric' };

  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'UTC',
  }).format(t);
}

/** 时间轴刻度只显示年份（不含「年」字），公元前用「前 475」/「475 BCE」。 */
export function formatTickYear(t: AtlasTime, locale = 'zh-CN'): string {
  const year = toHistoricalYear(new Date(t).getUTCFullYear());
  if (year < 0) return isZhLocale(locale) ? `前${-year}` : `${-year} BCE`;
  return String(year);
}

export function formatRange(start: AtlasTime, end: AtlasTime, locale = 'zh-CN'): string {
  if (start === end) return formatDate(start, locale);
  return `${formatDate(start, locale)} — ${formatDate(end, locale)}`;
}

export { DAY_MS };
