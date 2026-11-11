import { describe, expect, it } from 'vitest';
import type { AtlasDataset, AtlasEvent, AtlasRouteFeature } from '../types';
import {
  checkDatasetRoutes,
  distancePointToRouteKm,
  distancePointToSegmentKm,
} from '../qa/routes';

function makeRoute(
  coordinates: [number, number][],
  overrides: Partial<AtlasRouteFeature['properties']> = {},
): AtlasRouteFeature {
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates },
    properties: {
      entityId: 'force',
      startDate: '1935-01-01',
      endDate: '1935-12-31',
      order: 1,
      ...overrides,
    },
  };
}

function makeEvent(overrides: Partial<AtlasEvent> = {}): AtlasEvent {
  return {
    id: 'e1',
    atlasId: 'demo',
    name: { zh: '测试事件', en: 'Test event' },
    date: '1935-01-01',
    location: { lng: 0, lat: 0 },
    entityIds: ['force'],
    category: '战役',
    summary: { zh: '摘要', en: 'Summary' },
    ...overrides,
  };
}

function makeDataset(
  routes: AtlasRouteFeature[],
  events: AtlasEvent[],
): AtlasDataset {
  const entity = { id: 'force', name: 'Force', color: '#000000' };
  return {
    manifest: {
      schemaVersion: '1.0.0',
      id: 'demo',
      title: 'Demo',
      timeRange: { start: '1935-01-01', end: '1935-12-31' },
      defaultView: { center: [0, 0], zoom: 4 },
      routes: [],
      events: [],
      entities: [entity],
    },
    routes,
    events,
    territories: [],
    eventsById: new Map(events.map((event) => [event.id, event])),
    entitiesById: new Map([[entity.id, entity]]),
    eventsByEntity: new Map([['force', events]]),
    warnings: [],
  };
}

describe('route QA distance', () => {
  it('点在路线上时距离约为 0', () => {
    expect(distancePointToSegmentKm([0, 0], [0, 0], [0, 1])).toBeCloseTo(0, 5);
  });

  it('点到线段端点的距离约等于经度一度', () => {
    const distance = distancePointToSegmentKm([1, 0], [0, 0], [0, 1]);
    expect(distance).toBeGreaterThan(110);
    expect(distance).toBeLessThan(112);
  });

  it('点超出线段端点时取端点距离', () => {
    const distance = distancePointToSegmentKm([0, 2], [0, 0], [0, 1]);
    expect(distance).toBeGreaterThan(110);
    expect(distance).toBeLessThan(112);
  });

  it('折线路线取所有线段的最小距离', () => {
    const route = makeRoute([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(distancePointToRouteKm([0.5, 1], route)).toBeCloseTo(0, 5);
  });
});

describe('checkDatasetRoutes', () => {
  it('事件在活动路线上时无问题', () => {
    const dataset = makeDataset(
      [makeRoute([[0, 0], [1, 0]])],
      [makeEvent({ location: { lng: 0.5, lat: 0 } })],
    );
    expect(checkDatasetRoutes(dataset)).toEqual([]);
  });

  it('事件距离超过阈值时报告 too-far', () => {
    const dataset = makeDataset(
      [makeRoute([[0, 0], [1, 0]])],
      [makeEvent({ location: { lng: 0, lat: 1 } })],
    );
    const issues = checkDatasetRoutes(dataset);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.kind).toBe('too-far');
    expect(issues[0]!.distanceKm).toBeGreaterThan(100);
  });

  it('没有活动路线时报告 no-active-route', () => {
    const dataset = makeDataset(
      [makeRoute([[0, 0], [1, 0]], { startDate: '1936-01-01', endDate: '1936-12-31' })],
      [makeEvent()],
    );
    const issues = checkDatasetRoutes(dataset);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.kind).toBe('no-active-route');
  });

  it('routeEvent=false 的事件被跳过', () => {
    const dataset = makeDataset(
      [],
      [makeEvent({ extensions: { routeEvent: false } })],
    );
    expect(checkDatasetRoutes(dataset)).toEqual([]);
  });

  it('多日事件与路线日期区间重叠即可', () => {
    const dataset = makeDataset(
      [makeRoute([[0, 0], [1, 0]], { startDate: '1935-01-05', endDate: '1935-01-06' })],
      [makeEvent({ date: '1935-01-01', endDate: '1935-01-10' })],
    );
    expect(checkDatasetRoutes(dataset)).toEqual([]);
  });

  it('阈值可覆盖', () => {
    const dataset = makeDataset(
      [makeRoute([[0, 0], [1, 0]])],
      [makeEvent({ location: { lng: 0, lat: 0.2 } })],
    );
    expect(checkDatasetRoutes(dataset)).toEqual([]);
    const issues = checkDatasetRoutes(dataset, { thresholdKm: 10 });
    expect(issues).toHaveLength(1);
    expect(issues[0]!.kind).toBe('too-far');
  });
});
