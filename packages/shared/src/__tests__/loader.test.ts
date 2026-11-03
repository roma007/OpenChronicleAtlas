import { describe, expect, it } from 'vitest';
import { AtlasDataError, type DataSource } from '../data/source';
import { AtlasValidationError, loadAtlas, loadAtlasIndex } from '../data/loader';

class MemoryDataSource implements DataSource {
  constructor(private readonly files: Record<string, string>) {}

  async readText(path: string): Promise<string> {
    const content = this.files[path];
    if (content === undefined) throw new AtlasDataError(`文件不存在：${path}`);
    return content;
  }

  resolve(baseDir: string, relative: string): string {
    return new URL(relative, baseDir).toString();
  }

  dirname(file: string): string {
    return new URL('.', file).toString();
  }
}

const BASE = 'https://example.com/atlas/';

const manifest = {
  schemaVersion: '1.0.0',
  id: 'demo',
  title: { zh: '示例专题' },
  timeRange: { start: '1935-01-01', end: '1935-12-31' },
  defaultView: { center: [106.92, 27.72], zoom: 5 },
  routes: ['routes/demo.geojson'],
  events: ['events/events.json'],
  entities: [{ id: 'red-army', name: { zh: '红军' }, color: '#b22222' }],
};

const routeFile = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [106.92, 27.72],
          [106.93, 27.73],
        ],
      },
      properties: {
        entityId: 'red-army',
        startDate: '1935-01-01',
        endDate: '1935-01-02',
        order: 1,
        name: { zh: '测试路段' },
      },
    },
  ],
};

const events = [
  {
    id: 'zunyi-1935-01',
    atlasId: 'demo',
    name: { zh: '遵义会议' },
    date: '1935-01-15',
    location: { lng: 106.92, lat: 27.72, place: { zh: '贵州遵义' } },
    entityIds: ['red-army'],
    category: '重要会议',
    summary: { zh: '测试事件' },
    sources: [],
  },
  {
    id: 'chishui-1935-02',
    atlasId: 'demo',
    name: { zh: '四渡赤水' },
    date: '1935-02-01',
    location: { lng: 105.81, lat: 28.18 },
    entityIds: ['red-army'],
    category: '行军',
    summary: { zh: '测试事件 2' },
    sources: [],
  },
];

function makeSource(overrides: { events?: unknown; manifest?: unknown; route?: unknown } = {}) {
  return new MemoryDataSource({
    [`${BASE}manifest.json`]: JSON.stringify(overrides.manifest ?? manifest),
    [`${BASE}routes/demo.geojson`]: JSON.stringify(overrides.route ?? routeFile),
    [`${BASE}events/events.json`]: JSON.stringify(overrides.events ?? events),
  });
}

describe('loadAtlas', () => {
  it('加载并构建索引，事件按日期排序', async () => {
    const dataset = await loadAtlas(`${BASE}manifest.json`, {
      dataSource: makeSource({ events: [...events].reverse() }),
    });

    expect(dataset.manifest.id).toBe('demo');
    expect(dataset.routes).toHaveLength(1);
    expect(dataset.events.map((e) => e.id)).toEqual(['zunyi-1935-01', 'chishui-1935-02']);
    expect(dataset.eventsById.get('zunyi-1935-01')?.category).toBe('重要会议');
    expect(dataset.entitiesById.get('red-army')?.color).toBe('#b22222');
    expect(dataset.eventsByEntity.get('red-army')).toHaveLength(2);
    expect(dataset.warnings).toEqual([]);
  });

  it('重复事件 id 抛校验错误', async () => {
    const duplicated = [events[0], events[0]];
    await expect(
      loadAtlas(`${BASE}manifest.json`, { dataSource: makeSource({ events: duplicated }) }),
    ).rejects.toBeInstanceOf(AtlasValidationError);
  });

  it('未知 entityId 抛校验错误', async () => {
    const bad = [{ ...events[0], entityIds: ['unknown-army'] }];
    await expect(
      loadAtlas(`${BASE}manifest.json`, { dataSource: makeSource({ events: bad }) }),
    ).rejects.toBeInstanceOf(AtlasValidationError);
  });

  it('不支持的 MAJOR 版本抛错', async () => {
    const future = { ...manifest, schemaVersion: '2.0.0' };
    await expect(
      loadAtlas(`${BASE}manifest.json`, { dataSource: makeSource({ manifest: future }) }),
    ).rejects.toBeInstanceOf(AtlasValidationError);
  });

  it('非法 JSON 抛数据错误', async () => {
    const ds = new MemoryDataSource({
      [`${BASE}manifest.json`]: '{ invalid',
    });
    await expect(loadAtlas(`${BASE}manifest.json`, { dataSource: ds })).rejects.toBeInstanceOf(
      AtlasDataError,
    );
  });
});

describe('loadAtlasIndex', () => {
  it('加载专题索引', async () => {
    const ds = new MemoryDataSource({
      [`${BASE}index.json`]: JSON.stringify({
        schemaVersion: '1.0.0',
        atlases: [
          {
            id: 'demo',
            title: { zh: '示例专题' },
            timeRange: { start: '1935-01-01', end: '1935-12-31' },
            path: 'demo/manifest.json',
          },
        ],
      }),
    });

    const index = await loadAtlasIndex(`${BASE}index.json`, { dataSource: ds });
    expect(index.atlases).toHaveLength(1);
    expect(index.atlases[0]?.path).toBe('demo/manifest.json');
  });
});
