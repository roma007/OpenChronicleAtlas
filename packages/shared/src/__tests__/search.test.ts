import { describe, expect, it } from 'vitest';
import type { AtlasDataset, AtlasEvent } from '../types';
import { buildSearchIndex } from '../search/index';
import { searchEvents } from '../search/query';

function makeEvent(partial: Partial<AtlasEvent> & Pick<AtlasEvent, 'id' | 'name' | 'date'>): AtlasEvent {
  return {
    atlasId: 'demo',
    location: { lng: 106, lat: 27 },
    entityIds: ['central'],
    category: '行军',
    summary: { zh: '摘要' },
    ...partial,
  };
}

const events: AtlasEvent[] = [
  makeEvent({
    id: 'zunyi-1935-01',
    name: { zh: '遵义会议', en: 'Zunyi Conference' },
    date: '1935-01-15',
    location: { lng: 106.92, lat: 27.72, place: { zh: '贵州遵义' } },
    category: '重要会议',
    summary: { zh: '确立毛泽东在党中央和红军的领导地位。' },
    description: { zh: '## 背景\n\n1935 年 1 月，中共中央政治局扩大会议在遵义召开。' },
  }),
  makeEvent({
    id: 'xiangjiang-1934-11',
    name: { zh: '湘江战役' },
    date: '1934-11-27',
    location: { lng: 111.07, lat: 25.93, place: { zh: '广西全州' } },
    category: '战斗',
    summary: { zh: '长征初期最惨烈的战役。' },
  }),
  makeEvent({
    id: 'sidu-chishui-1935-03',
    name: { zh: '四渡赤水' },
    date: '1935-03-21',
    location: { lng: 106.19, lat: 28.33, place: { zh: '贵州习水' } },
    category: '行军',
    summary: { zh: '摆脱敌军围追堵截。' },
  }),
];

const dataset: AtlasDataset = {
  manifest: {
    schemaVersion: '1.0.0',
    id: 'demo',
    title: { zh: '示例专题' },
    timeRange: { start: '1934-10-10', end: '1936-10-22' },
    defaultView: { center: [106, 27], zoom: 5 },
    routes: [],
    events: [],
    entities: [{ id: 'central', name: { zh: '中央红军' }, color: '#b22222' }],
  },
  routes: [],
  events,
  eventsById: new Map(events.map((event) => [event.id, event])),
  entitiesById: new Map([['central', { id: 'central', name: { zh: '中央红军' }, color: '#b22222' }]]),
  eventsByEntity: new Map([['central', events]]),
  warnings: [],
};

const index = buildSearchIndex([dataset]);

describe('searchEvents', () => {
  it('按事件名搜索', () => {
    const hits = searchEvents('遵义', index);
    expect(hits[0]?.event.id).toBe('zunyi-1935-01');
    expect(hits[0]?.field).toBe('name');
  });

  it('按地名搜索', () => {
    const hits = searchEvents('全州', index);
    expect(hits[0]?.event.id).toBe('xiangjiang-1934-11');
    expect(hits[0]?.field).toBe('place');
  });

  it('按日期搜索', () => {
    const hits = searchEvents('1935-03', index);
    expect(hits[0]?.event.id).toBe('sidu-chishui-1935-03');
    expect(hits[0]?.field).toBe('date');
  });

  it('按类型与实体搜索', () => {
    expect(searchEvents('重要会议', index)[0]?.event.id).toBe('zunyi-1935-01');
    expect(searchEvents('中央红军', index)).toHaveLength(3);
  });

  it('英文不区分大小写', () => {
    const hits = searchEvents('zunyi', index);
    expect(hits[0]?.event.id).toBe('zunyi-1935-01');
  });

  it('空查询返回空数组', () => {
    expect(searchEvents('   ', index)).toEqual([]);
  });

  it('支持 atlasId / 时间范围 / limit 过滤', () => {
    expect(searchEvents('1935', index, { atlasId: 'other' })).toEqual([]);
    expect(searchEvents('1935', index, { limit: 1 })).toHaveLength(1);
    expect(
      searchEvents('遵义', index, {
        from: Date.UTC(1935, 0, 1),
        to: Date.UTC(1935, 0, 31),
      }),
    ).toHaveLength(1);
  });

  it('片段包含查询词', () => {
    const hit = searchEvents('遵义', index)[0]!;
    expect(hit.snippet).toContain('遵义');
  });
});
