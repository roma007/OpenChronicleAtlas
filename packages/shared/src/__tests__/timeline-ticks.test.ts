import { describe, expect, it } from 'vitest';
import { createTimeline } from '../timeline/core';
import { generateTicks } from '../timeline/ticks';

describe('generateTicks', () => {
  it('两年跨度在桌面宽度下选择月刻度且数量受控', () => {
    const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });
    const ticks = generateTicks(timeline, 1200, { minLabelPx: 72 });

    expect(ticks.length).toBeGreaterThanOrEqual(4);
    expect(ticks.length).toBeLessThanOrEqual(12);
    expect(ticks.every((tick) => tick.ratio >= 0 && tick.ratio <= 1)).toBe(true);
    expect(ticks.some((tick) => tick.unit === 'month')).toBe(true);
    expect(ticks[0]!.time).toBeGreaterThanOrEqual(timeline.start);
    expect(ticks.at(-1)!.time).toBeLessThanOrEqual(timeline.end);
  });

  it('移动端窄屏刻度更少', () => {
    const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });
    const desktop = generateTicks(timeline, 1200, { minLabelPx: 72 });
    const mobile = generateTicks(timeline, 390, { minLabelPx: 56 });

    expect(mobile.length).toBeLessThanOrEqual(desktop.length);
    expect(mobile.length).toBeLessThanOrEqual(6);
  });

  it('短跨度选择日刻度', () => {
    const timeline = createTimeline({ start: '1935-01-01', end: '1935-01-10' });
    const ticks = generateTicks(timeline, 800);
    expect(ticks.length).toBe(10);
    expect(ticks.every((tick) => tick.unit === 'day')).toBe(true);
    expect(ticks[0]!.label).toBe('01-01');
  });

  it('超长跨度选择年刻度', () => {
    const timeline = createTimeline({ start: '1800-01-01', end: '1900-01-01' });
    const ticks = generateTicks(timeline, 1000);
    expect(ticks.every((tick) => tick.unit === 'year')).toBe(true);
    expect(ticks.length).toBeLessThanOrEqual(12);
  });

  it('刻度时间严格递增且不重复', () => {
    const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });
    const ticks = generateTicks(timeline, 1000);
    const times = ticks.map((tick) => tick.time);
    expect(new Set(times).size).toBe(times.length);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
});
