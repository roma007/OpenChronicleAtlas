import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { distanceKm, eventsNearPoint } from '../geo/nearby';

function makeEvent(id: string, lng: number, lat: number): AtlasEvent {
  return {
    id,
    atlasId: 'demo',
    name: id,
    date: '1937-07-07',
    location: { lng, lat },
    entityIds: ['force'],
    category: '军事',
    summary: id,
  };
}

describe('nearby', () => {
  it('计算两点距离', () => {
    expect(distanceKm([116.4, 39.9], [116.4, 39.9])).toBe(0);
    expect(distanceKm([116.4, 39.9], [116.5, 39.9])).toBeGreaterThan(8);
    expect(distanceKm([116.4, 39.9], [116.5, 39.9])).toBeLessThan(10);
  });

  it('按距离排序并截断', () => {
    const events = [
      makeEvent('far', 117.0, 39.9),
      makeEvent('near', 116.41, 39.9),
      makeEvent('middle', 116.45, 39.9),
    ];
    const result = eventsNearPoint(events, [116.4, 39.9], 20, 2);
    expect(result.map((item) => item.event.id)).toEqual(['near', 'middle']);
    expect(result[0]!.distanceKm).toBeLessThan(result[1]!.distanceKm);
  });

  it('超过阈值的事件不返回', () => {
    expect(eventsNearPoint([makeEvent('far', 120, 40)], [116.4, 39.9], 20)).toEqual([]);
  });
});
