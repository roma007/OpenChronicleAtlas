import { describe, expect, it } from 'vitest';
import type { AtlasEvent } from '../types';
import { applyEventFilters, collectCategories, EMPTY_FILTERS } from '../filters';

const events: AtlasEvent[] = [
  {
    id: 'a',
    atlasId: 'demo',
    name: { zh: 'A' },
    date: '1935-01-15',
    location: { lng: 106, lat: 27 },
    entityIds: ['central'],
    category: '重要会议',
    summary: { zh: 'A' },
  },
  {
    id: 'b',
    atlasId: 'demo',
    name: { zh: 'B' },
    date: '1935-03-21',
    location: { lng: 106, lat: 27 },
    entityIds: ['central'],
    category: '行军',
    summary: { zh: 'B' },
  },
  {
    id: 'c',
    atlasId: 'demo',
    name: { zh: 'C' },
    date: '1936-10-09',
    location: { lng: 105, lat: 35 },
    entityIds: ['red-4'],
    category: '会师',
    summary: { zh: 'C' },
  },
];

describe('applyEventFilters', () => {
  it('空筛选返回全部', () => {
    expect(applyEventFilters(events, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('按类型多选过滤', () => {
    expect(applyEventFilters(events, { categories: ['行军', '会师'] }).map((e) => e.id)).toEqual([
      'b',
      'c',
    ]);
  });

  it('按时间段过滤（包含边界）', () => {
    const result = applyEventFilters(events, { categories: [], from: '1935-03-21', to: '1935-03-21' });
    expect(result.map((e) => e.id)).toEqual(['b']);
  });

  it('起止日期倒置返回空数组', () => {
    expect(
      applyEventFilters(events, { categories: [], from: '1936-01-01', to: '1935-01-01' }),
    ).toEqual([]);
  });

  it('收集并排序类型', () => {
    expect(collectCategories(events)).toEqual(['会师', '行军', '重要会议'].sort());
  });
});
