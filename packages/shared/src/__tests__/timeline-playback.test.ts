import { describe, expect, it } from 'vitest';
import { createTimeline } from '../timeline/core';
import { advancePlayback, DEFAULT_PLAYBACK_DURATION_MS } from '../timeline/playback';

describe('advancePlayback', () => {
  const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });

  it('按真实时间推进', () => {
    const step = advancePlayback(timeline.start, 1000, timeline, 1);
    expect(step.ended).toBe(false);
    expect(step.time).toBeGreaterThan(timeline.start);
    expect(step.time).toBeLessThan(timeline.end);
  });

  it('倍速越快推进越多', () => {
    const normal = advancePlayback(timeline.start, 1000, timeline, 1);
    const fast = advancePlayback(timeline.start, 1000, timeline, 4);
    expect(fast.time).toBeGreaterThan(normal.time);
  });

  it('到达终点时结束并固定在终点', () => {
    const step = advancePlayback(
      timeline.end - 1000,
      DEFAULT_PLAYBACK_DURATION_MS * 10,
      timeline,
      4,
    );
    expect(step.ended).toBe(true);
    expect(step.time).toBe(timeline.end);
  });

  it('零跨度时间轴立即结束', () => {
    const zero = createTimeline({ start: '1935-01-01', end: '1935-01-01' });
    expect(advancePlayback(zero.start, 100, zero, 1)).toEqual({
      time: zero.start,
      ended: true,
    });
  });
});
