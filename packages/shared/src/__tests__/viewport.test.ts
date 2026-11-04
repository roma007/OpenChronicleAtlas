import { describe, expect, it } from 'vitest';
import { createTimeline } from '../timeline/core';
import {
  MAX_TIMELINE_ZOOM,
  centerViewportStart,
  createViewport,
  timelineSpan,
} from '../timeline/viewport';

const timeline = createTimeline({ start: '1934-10-10', end: '1936-10-22' });

describe('timeline viewport', () => {
  it('0 级为全量时间轴', () => {
    const viewport = createViewport(timeline, 0);
    expect(viewport.start).toBe(timeline.start);
    expect(viewport.end).toBe(timeline.end);
    expect(viewport.totalMs).toBe(timeline.totalMs);
  });

  it('每升一级跨度减半，最小 1 天', () => {
    const level1 = timelineSpan(timeline, 1);
    const level2 = timelineSpan(timeline, 2);
    expect(level1).toBeCloseTo(timeline.totalMs / 2, -3);
    expect(level2).toBeCloseTo(timeline.totalMs / 4, -3);
    expect(timelineSpan(timeline, MAX_TIMELINE_ZOOM)).toBeGreaterThanOrEqual(86_400_000);
  });

  it('视口不会越出全量范围', () => {
    const viewport = createViewport(timeline, 4, timeline.end);
    expect(viewport.end).toBe(timeline.end);
    expect(viewport.start).toBeGreaterThanOrEqual(timeline.start);

    const early = createViewport(timeline, 4, timeline.start - 1_000_000);
    expect(early.start).toBe(timeline.start);
  });

  it('以当前时间为中心', () => {
    const center = timeline.start + timeline.totalMs / 2;
    const start = centerViewportStart(timeline, 3, center);
    const viewport = createViewport(timeline, 3, start);
    expect(viewport.start).toBe(start);
    expect(viewport.start).toBeLessThanOrEqual(center);
    expect(viewport.end).toBeGreaterThanOrEqual(center);
  });
});
