import { describe, expect, it } from 'vitest';
import type { AtlasEvent, AtlasRegion } from '../types';
import { applyEventFilters } from '../filters';
import {
  expandRegionSelection,
  isRegionDescendant,
  matchesRegionFilter,
  normalizeRegionSelection,
  regionAncestors,
} from '../regions';

const regions: AtlasRegion[] = [
  { id: 'hebei', level: 'province', parentId: null, name: '河北省' },
  { id: 'county-baoding', level: 'county', parentId: 'hebei', name: '保定县' },
  { id: 'place-lugouqiao', level: 'place', parentId: 'county-baoding', name: '卢沟桥' },
  { id: 'shandong', level: 'province', parentId: null, name: '山东省' },
];

const events: AtlasEvent[] = [
  {
    id: 'a',
    atlasId: 'demo',
    name: 'A',
    date: '1937-07-07',
    location: { lng: 116.2, lat: 39.6, regionIds: ['hebei', 'county-baoding', 'place-lugouqiao'] },
    entityIds: ['force'],
    category: '战役',
    summary: 'A',
  },
  {
    id: 'b',
    atlasId: 'demo',
    name: 'B',
    date: '1938-01-01',
    location: { lng: 117.0, lat: 36.6, regionIds: ['shandong'] },
    entityIds: ['force'],
    category: '战役',
    summary: 'B',
  },
  {
    id: 'c',
    atlasId: 'demo',
    name: 'C',
    date: '1945-09-02',
    location: { lng: 139.7, lat: 35.7, regionIds: [] },
    entityIds: ['force'],
    category: '国际',
    summary: 'C',
  },
];

describe('matchesRegionFilter', () => {
  it('空选择表示不过滤', () => {
    expect(matchesRegionFilter(['hebei'], [])).toBe(true);
  });

  it('命中任一地区即保留', () => {
    expect(matchesRegionFilter(['hebei', 'county-baoding'], ['county-baoding'])).toBe(true);
    expect(matchesRegionFilter(['hebei'], ['shandong'])).toBe(false);
  });

  it('没有地区归属的事件在筛选时排除', () => {
    expect(matchesRegionFilter(undefined, ['hebei'])).toBe(false);
  });
});

describe('regionAncestors / expandRegionSelection', () => {
  const byId = new Map(regions.map((region) => [region.id, region]));

  it('返回从省到当前节点的路径', () => {
    expect(regionAncestors(byId, 'place-lugouqiao').map((region) => region.id)).toEqual([
      'hebei',
      'county-baoding',
      'place-lugouqiao',
    ]);
  });

  it('展开选择时包含祖先', () => {
    expect([...expandRegionSelection(byId, ['place-lugouqiao'])]).toEqual([
      'hebei',
      'county-baoding',
      'place-lugouqiao',
    ]);
  });

  it('只保留最具体选区：省被子节点覆盖', () => {
    expect(normalizeRegionSelection(byId, ['hebei', 'county-baoding'])).toEqual([
      'county-baoding',
    ]);
    expect(normalizeRegionSelection(byId, ['hebei', 'place-lugouqiao'])).toEqual([
      'place-lugouqiao',
    ]);
    expect(normalizeRegionSelection(byId, ['hebei', 'shandong'])).toEqual([
      'hebei',
      'shandong',
    ]);
  });

  it('判断后代关系', () => {
    expect(isRegionDescendant(byId, 'place-lugouqiao', 'hebei')).toBe(true);
    expect(isRegionDescendant(byId, 'shandong', 'hebei')).toBe(false);
  });
});

describe('applyEventFilters 地区维度', () => {
  it('按省筛选包含省内所有地点', () => {
    expect(
      applyEventFilters(events, { categories: [], regionIds: ['hebei'] }).map((event) => event.id),
    ).toEqual(['a']);
  });

  it('按县筛选', () => {
    expect(
      applyEventFilters(events, { categories: [], regionIds: ['county-baoding'] }).map(
        (event) => event.id,
      ),
    ).toEqual(['a']);
  });

  it('地区与时间、类型叠加', () => {
    expect(
      applyEventFilters(events, {
        categories: ['战役'],
        regionIds: ['shandong'],
        from: '1937-01-01',
        to: '1938-12-31',
      }).map((event) => event.id),
    ).toEqual(['b']);
  });

  it('多选地区为并集', () => {
    expect(
      applyEventFilters(events, { categories: [], regionIds: ['hebei', 'shandong'] }).map(
        (event) => event.id,
      ),
    ).toEqual(['a', 'b']);
  });
});
