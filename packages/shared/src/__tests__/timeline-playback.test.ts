import { describe, expect, it } from 'vitest';
import { createTimeline } from '../timeline/core';
import {
  advancePlayback,
  createPlaybackAnchors,
  DEFAULT_PLAYBACK_DURATION_MS,
  EVENT_PLAYBACK_GAP_MS,
} from '../timeline/playback';

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

describe('advancePlayback 事件锚点', () => {
  const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });
  const day = 86_400_000;
  const firstEvent = timeline.start + day;
  const secondEvent = timeline.start + day * 30;
  const thirdEvent = timeline.start + day * 200;
  const anchors = createPlaybackAnchors(timeline, [secondEvent, firstEvent, thirdEvent, firstEvent]);

  it('锚点排序去重并补齐首尾', () => {
    expect(anchors).toEqual([timeline.start, firstEvent, secondEvent, thirdEvent, timeline.end]);
  });

  it('跨度不同的相邻事件之间耗时都是 3 秒', () => {
    const first = advancePlayback(timeline.start, EVENT_PLAYBACK_GAP_MS, timeline, 1, { anchors });
    expect(first.time).toBeCloseTo(firstEvent, 5);

    const second = advancePlayback(first.time, EVENT_PLAYBACK_GAP_MS, timeline, 1, { anchors });
    expect(second.time).toBeCloseTo(secondEvent, 5);

    const third = advancePlayback(second.time, EVENT_PLAYBACK_GAP_MS, timeline, 1, { anchors });
    expect(third.time).toBeCloseTo(thirdEvent, 5);
  });

  it('区间内按比例推进，倍速缩短间隔耗时', () => {
    const halfway = advancePlayback(timeline.start, EVENT_PLAYBACK_GAP_MS / 2, timeline, 1, {
      anchors,
    });
    expect(halfway.time).toBeCloseTo(timeline.start + day / 2, 5);

    const fast = advancePlayback(timeline.start, EVENT_PLAYBACK_GAP_MS / 2, timeline, 2, {
      anchors,
    });
    expect(fast.time).toBeCloseTo(firstEvent, 5);
  });

  it('越过最后一个事件后仍在 3 秒内到达终点', () => {
    const step = advancePlayback(thirdEvent, EVENT_PLAYBACK_GAP_MS * 2, timeline, 1, { anchors });
    expect(step.ended).toBe(true);
    expect(step.time).toBe(timeline.end);
  });
});
