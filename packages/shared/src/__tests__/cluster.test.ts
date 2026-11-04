import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { clusterEvents } from '../geo/cluster';

function event(id: string, lng: number, lat: number): AtlasEvent {
  return {
    id,
    atlasId: 'demo',
    name: { zh: id },
    date: '1935-01-01',
    location: { lng, lat },
    entityIds: ['demo'],
    category: '行军',
    summary: { zh: id },
  };
}

describe('clusterEvents', () => {
  it('空输入返回空数组', () => {
    expect(clusterEvents([], 5)).toEqual([]);
  });

  it('同格事件合并，中心取平均坐标', () => {
    const clusters = clusterEvents([event('a', 100, 30), event('b', 100.1, 30.1)], 5);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.events.map((item) => item.id)).toEqual(['a', 'b']);
    expect(clusters[0]!.center[0]).toBeCloseTo(100.05, 5);
    expect(clusters[0]!.center[1]).toBeCloseTo(30.05, 5);
  });

  it('跨格事件不合并', () => {
    const clusters = clusterEvents([event('a', 100, 30), event('b', 110, 35)], 5);
    expect(clusters).toHaveLength(2);
  });

  it('缩放增大后同一批事件拆分', () => {
    const events = [event('a', 100, 30), event('b', 100.6, 30.6)];
    const low = clusterEvents(events, 4);
    const high = clusterEvents(events, 10);
    expect(low).toHaveLength(1);
    expect(high).toHaveLength(2);
  });

  it('聚合 id 在相同缩放下稳定', () => {
    const events = [event('a', 100, 30), event('b', 100.1, 30.1)];
    const first = clusterEvents(events, 5).map((cluster) => cluster.id);
    const second = clusterEvents([...events].reverse(), 5).map((cluster) => cluster.id);
    expect(second).toEqual(first);
  });
});
