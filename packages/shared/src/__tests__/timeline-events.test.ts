import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { parseDateString } from '../time/date';
import {
  eventEnd,
  eventStart,
  isEventActive,
  latestEventAt,
  visibleEventsAt,
} from '../timeline/events';

function makeEvent(id: string, date: string, endDate?: string): AtlasEvent {
  return {
    id,
    atlasId: 'demo',
    name: { zh: id },
    date,
    endDate,
    location: { lng: 106, lat: 27 },
    entityIds: ['demo'],
    category: '测试',
    summary: { zh: id },
  };
}

const events = [
  makeEvent('a', '1935-01-01'),
  makeEvent('b', '1935-01-15', '1935-01-17'),
  makeEvent('c', '1935-02-01'),
];

describe('timeline events', () => {
  it('事件起止时间', () => {
    expect(eventStart(events[1]!)).toBe(parseDateString('1935-01-15'));
    expect(eventEnd(events[1]!)).toBe(parseDateString('1935-01-17'));
    expect(eventEnd(events[0]!)).toBe(parseDateString('1935-01-02'));
  });

  it('visibleEventsAt 只返回已发生事件', () => {
    expect(visibleEventsAt(events, parseDateString('1934-12-31'))).toEqual([]);
    expect(visibleEventsAt(events, parseDateString('1935-01-01')).map((e) => e.id)).toEqual(['a']);
    expect(visibleEventsAt(events, parseDateString('1935-01-20')).map((e) => e.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('latestEventAt 返回最近发生的事件', () => {
    expect(latestEventAt(events, parseDateString('1934-12-31'))).toBeUndefined();
    expect(latestEventAt(events, parseDateString('1935-01-01'))?.id).toBe('a');
    expect(latestEventAt(events, parseDateString('1935-01-16'))?.id).toBe('b');
    expect(latestEventAt(events, parseDateString('1935-03-01'))?.id).toBe('c');
  });

  it('isEventActive 覆盖持续事件区间', () => {
    expect(isEventActive(events[1]!, parseDateString('1935-01-14'))).toBe(false);
    expect(isEventActive(events[1]!, parseDateString('1935-01-15'))).toBe(true);
    expect(isEventActive(events[1]!, parseDateString('1935-01-17'))).toBe(true);
    expect(isEventActive(events[1]!, parseDateString('1935-01-18'))).toBe(false);
  });
});
