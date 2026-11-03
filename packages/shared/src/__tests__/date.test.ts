import { describe, expect, it } from 'vitest';
import {
  clampTime,
  diffDays,
  formatDate,
  parseDateString,
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
});
