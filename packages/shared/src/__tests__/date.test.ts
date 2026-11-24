import { describe, expect, it } from 'vitest';
import {
  clampTime,
  compareDateStrings,
  diffDays,
  formatDate,
  isValidDateString,
  parseDateString,
  resolveDatePrecision,
  toDateString,
} from '../time/date';

describe('parseDateString', () => {
  it('解析合法日期为 UTC 日粒度', () => {
    expect(parseDateString('1935-01-15')).toBe(Date.UTC(1935, 0, 15));
  });

  it('支持闰年 2 月 29 日', () => {
    expect(parseDateString('1936-02-29')).toBe(Date.UTC(1936, 1, 29));
  });

  it('拒绝不存在的日期', () => {
    expect(() => parseDateString('2023-02-29')).toThrow('非法日期');
    expect(() => parseDateString('2023-13-01')).toThrow('非法日期');
    expect(() => parseDateString('2023-1-1')).toThrow('非法日期');
  });

  it('往返转换保持日期不变', () => {
    expect(toDateString(parseDateString('1934-10-10'))).toBe('1934-10-10');
  });

  it('支持公元前年份并往返一致', () => {
    const time = parseDateString('-0475-06-01');
    expect(toDateString(time)).toBe('-0475-06-01');
    // 前 475 年 6 月 1 日早于公元 1 年
    expect(time).toBeLessThan(parseDateString('0001-01-01'));
  });

  it('不存在公元 0 年', () => {
    expect(() => parseDateString('0000-01-01')).toThrow('不存在公元 0 年');
    expect(() => parseDateString('-0000-01-01')).toThrow('不存在公元 0 年');
  });

  it('支持 1—99 年，不会被当成 19xx 年', () => {
    const time = parseDateString('0050-06-01');
    expect(toDateString(time)).toBe('0050-06-01');
    expect(formatDate(time, 'zh-CN', 'year')).toBe('50年');
  });

  it('isValidDateString 同时接受公元前后并拒绝非法值', () => {
    expect(isValidDateString('-0260-07-15')).toBe(true);
    expect(isValidDateString('1935-01-15')).toBe(true);
    expect(isValidDateString('-0260-02-30')).toBe(false);
    expect(isValidDateString('1935-1-15')).toBe(false);
    expect(isValidDateString(1234)).toBe(false);
  });
});

describe('compareDateStrings', () => {
  it('按时间戳比较，公元前不被字符串序反转', () => {
    expect(compareDateStrings('-0475-01-01', '-0300-01-01')).toBeLessThan(0);
    expect(compareDateStrings('-0221-01-01', '-0475-12-31')).toBeGreaterThan(0);
    expect(compareDateStrings('-0475-01-01', '0190-02-01')).toBeLessThan(0);
    expect(compareDateStrings('1935-01-15', '1935-01-15')).toBe(0);
  });
});

describe('时间计算', () => {
  it('clampTime 限制在区间内', () => {
    const start = parseDateString('1934-10-10');
    const end = parseDateString('1936-10-22');
    expect(clampTime(start - 1, start, end)).toBe(start);
    expect(clampTime(end + 1, start, end)).toBe(end);
  });

  it('diffDays 计算天数差', () => {
    expect(diffDays(parseDateString('1935-01-15'), parseDateString('1935-01-10'))).toBe(5);
  });

  it('formatDate 使用 UTC，不受本地时区影响', () => {
    expect(formatDate(parseDateString('1935-01-15'), 'zh-CN')).toContain('1935');
  });

  it('formatDate 支持年 / 月精度', () => {
    const time = parseDateString('0960-01-01');
    expect(formatDate(time, 'zh-CN', 'year')).toBe('960年');
    expect(formatDate(time, 'zh-CN', 'month')).toBe('960年1月');
    expect(formatDate(time, 'zh-CN', 'day')).toBe('960年1月1日');
  });

  it('formatDate 公元前中英文输出', () => {
    const time = parseDateString('-0475-06-01');
    expect(formatDate(time, 'zh-CN', 'year')).toBe('前475年');
    expect(formatDate(time, 'zh-CN', 'month')).toBe('前475年6月');
    expect(formatDate(time, 'zh-CN', 'day')).toBe('前475年6月1日');
    expect(formatDate(time, 'en', 'year')).toBe('475 BCE');
    expect(formatDate(time, 'en', 'day')).toBe('1 June 475 BCE');
  });

  it('单选主体时按时间跨度细化年精度', () => {
    const yearMs = 365.25 * 86_400_000;
    expect(resolveDatePrecision('year', 1, 4 * yearMs)).toBe('day');
    expect(resolveDatePrecision('year', 1, 50 * yearMs)).toBe('month');
    expect(resolveDatePrecision('year', 1, 300 * yearMs)).toBe('year');
    expect(resolveDatePrecision('year', 2, 4 * yearMs)).toBe('year');
    expect(resolveDatePrecision('day', 1, 4 * yearMs)).toBe('day');
  });
});
