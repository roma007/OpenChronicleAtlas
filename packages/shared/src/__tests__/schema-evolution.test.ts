import { describe, expect, it } from 'vitest';
import { eventSchema, routeFeatureSchema } from '../schema/atlas';
import type { AtlasDataset, AtlasEvent } from '../types';
import { buildSearchIndex } from '../search/index';
import { searchEvents } from '../search/query';

const event = {
  id: 'lugouqiao-incident-1937-07',
  atlasId: 'demo',
  name: { zh: '卢沟桥事变', en: 'Marco Polo Bridge Incident' },
  aliases: [{ zh: '七七事变', en: 'July 7 Incident' }],
  date: '1937-07-07',
  location: { lng: 116.21, lat: 39.85, place: { zh: '北平卢沟桥' } },
  entityIds: ['force'],
  category: '事变',
  summary: { zh: '日军进攻宛平城。' },
};

const route = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [112.94, 28.23],
      [113.13, 29.36],
    ],
  },
  properties: {
    entityId: 'force',
    startDate: '1941-12-24',
    endDate: '1942-01-15',
    order: 1,
    segmentType: 'counterattack',
    name: { zh: '反击路线' },
  },
};

describe('Schema v1.1', () => {
  it('接受事件别名', () => {
    expect(eventSchema.safeParse(event).success).toBe(true);
  });

  it('拒绝空别名', () => {
    const invalid = { ...event, aliases: [{ zh: '' }] };
    expect(eventSchema.safeParse(invalid).success).toBe(false);
  });

  it('接受路线分段类型', () => {
    expect(routeFeatureSchema.safeParse(route).success).toBe(true);
  });

  it('拒绝未知路线分段类型', () => {
    const invalid = {
      ...route,
      properties: { ...route.properties, segmentType: 'unknown' },
    };
    expect(routeFeatureSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('别名搜索', () => {
  it('别名与正式名同权重进入搜索', () => {
    const dataset: AtlasDataset = {
      manifest: {
        schemaVersion: '1.1.0',
        id: 'demo',
        title: 'Demo',
        timeRange: { start: '1937-01-01', end: '1937-12-31' },
        defaultView: { center: [116, 40], zoom: 5 },
        routes: [],
        events: [],
        entities: [{ id: 'force', name: 'Force', color: '#000000' }],
      },
      routes: [],
      events: [event as AtlasEvent],
      territories: [],
      eventsById: new Map([['lugouqiao-incident-1937-07', event as AtlasEvent]]),
      entitiesById: new Map([['force', { id: 'force', name: 'Force', color: '#000000' }]]),
      eventsByEntity: new Map([['force', [event as AtlasEvent]]]),
      warnings: [],
    };

    const index = buildSearchIndex([dataset]);
    const hits = searchEvents('七七事变', index);
    expect(hits[0]?.event.id).toBe('lugouqiao-incident-1937-07');
    expect(hits[0]?.field).toBe('name');
  });
});
