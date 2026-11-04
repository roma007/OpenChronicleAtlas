import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { createTimeline } from '../timeline/core';
import { timelineEventMarkers } from '../timeline/markers';

const timeline = createTimeline({ start: '1935-01-01', end: '1935-01-11' });

function event(id: string, date: string, endDate?: string): AtlasEvent {
  return {
    id,
    atlasId: 'demo',
    name: { zh: id },
    date,
    endDate,
    location: { lng: 0, lat: 0 },
    entityIds: ['demo'],
    category: '行军',
    summary: { zh: id },
  };
}

describe('timelineEventMarkers', () => {
  it('无 endDate 时 endRatio 等于 ratio', () => {
    const [marker] = timelineEventMarkers([event('a', '1935-01-06')], timeline);
    expect(marker?.ratio).toBeCloseTo(0.5, 5);
    expect(marker?.endRatio).toBeCloseTo(0.5, 5);
  });

  it('有 endDate 时返回区间', () => {
    const [marker] = timelineEventMarkers(
      [event('a', '1935-01-03', '1935-01-05')],
      timeline,
    );
    expect(marker?.ratio).toBeCloseTo(0.2, 5);
    expect(marker?.endRatio).toBeCloseTo(0.4, 5);
  });

  it('按起点比例升序', () => {
    const markers = timelineEventMarkers(
      [event('b', '1935-01-08'), event('a', '1935-01-03')],
      timeline,
    );
    expect(markers.map((marker) => marker.event.id)).toEqual(['a', 'b']);
  });

  it('保留越界比例，供组件过滤', () => {
    const markers = timelineEventMarkers(
      [event('before', '1934-12-30'), event('after', '1935-01-13')],
      timeline,
    );
    expect(markers[0]?.ratio).toBeLessThan(0);
    expect(markers[1]?.ratio).toBeGreaterThan(1);
  });

  it('空数组返回空', () => {
    expect(timelineEventMarkers([], timeline)).toEqual([]);
  });
});
