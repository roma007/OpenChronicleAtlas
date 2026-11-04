import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { neighborEvents } from '../timeline/neighbors';

function event(id: string, date: string): AtlasEvent {
  return {
    id,
    atlasId: 'demo',
    name: { zh: id },
    date,
    location: { lng: 0, lat: 0 },
    entityIds: ['demo'],
    category: '行军',
    summary: { zh: id },
  };
}

const events = [
  event('a', '1935-01-01'),
  event('b', '1935-01-02'),
  event('c', '1935-01-02'),
  event('d', '1935-01-03'),
];

describe('neighborEvents', () => {
  it('返回前后事件', () => {
    const neighbors = neighborEvents(events, 'b');
    expect(neighbors.previous?.id).toBe('a');
    expect(neighbors.next?.id).toBe('c');
  });

  it('首尾事件没有越界邻居', () => {
    expect(neighborEvents(events, 'a').previous).toBeUndefined();
    expect(neighborEvents(events, 'd').next).toBeUndefined();
  });

  it('日期相同按 ID 排序', () => {
    expect(neighborEvents(events, 'c').previous?.id).toBe('b');
  });

  it('不存在的 ID 返回空对象', () => {
    expect(neighborEvents(events, 'missing')).toEqual({});
  });

  it('不修改输入数组', () => {
    const input = [event('b', '1935-01-02'), event('a', '1935-01-01')];
    neighborEvents(input, 'b');
    expect(input.map((item) => item.id)).toEqual(['b', 'a']);
  });
});
