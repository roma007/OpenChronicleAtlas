import { describe, expect, it } from 'vitest';
import { parseDateString } from '../time/date';
import {
  clampToTimeline,
  createTimeline,
  ratioToTime,
  snapToDay,
  stepDays,
  timeToRatio,
} from '../timeline/core';

describe('timeline core', () => {
  const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });

  it('创建时间轴并计算总天数', () => {
    expect(timeline.totalDays).toBe(743);
    expect(timeline.start).toBe(Date.UTC(1934, 9, 10));
    expect(timeline.end).toBe(Date.UTC(1936, 9, 22));
  });

  it('比例与时间互转', () => {
    expect(timeToRatio(timeline.start, timeline)).toBe(0);
    expect(timeToRatio(timeline.end, timeline)).toBe(1);

    const mid = ratioToTime(0.5, timeline);
    expect(timeToRatio(mid, timeline)).toBeCloseTo(0.5, 2);
  });

  it('比例越界会 clamp', () => {
    expect(timeToRatio(timeline.start - 1000, timeline)).toBe(0);
    expect(timeToRatio(timeline.end + 1000, timeline)).toBe(1);
    expect(ratioToTime(-1, timeline)).toBe(timeline.start);
    expect(ratioToTime(2, timeline)).toBe(timeline.end);
  });

  it('snapToDay 去掉时分秒', () => {
    const t = Date.UTC(1935, 0, 15, 13, 45, 30);
    expect(snapToDay(t)).toBe(Date.UTC(1935, 0, 15));
  });

  it('stepDays 按天步进并 clamp', () => {
    const start = parseDateString('1935-01-01');
    expect(stepDays(start, 7)).toBe(parseDateString('1935-01-08'));
    expect(clampToTimeline(stepDays(timeline.end, 10), timeline)).toBe(timeline.end);
  });
});
