import { describe, expect, it } from 'vitest';
import { territoryFileSchema } from '../schema/atlas';
import { validateCrossFile } from '../schema/validate';
import type { AtlasManifest, AtlasTerritoryFeature } from '../types';

const manifest: AtlasManifest = {
  schemaVersion: '1.1.0',
  id: 'demo',
  title: 'Demo',
  timeRange: { start: '0600-01-01', end: '0700-12-31' },
  defaultView: { center: [108, 34], zoom: 4 },
  routes: [],
  events: [],
  entities: [{ id: 'tang', name: 'Tang', color: '#b83232' }],
};

const polygonTerritory: AtlasTerritoryFeature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [100, 30],
        [110, 30],
        [110, 40],
        [100, 40],
        [100, 30],
      ],
    ],
  },
  properties: {
    entityId: 'tang',
    startDate: '0618-06-01',
    endDate: '0907-04-30',
    opacity: 0.16,
  },
};

describe('territory schema', () => {
  it('接受 Polygon 与 MultiPolygon', () => {
    expect(
      territoryFileSchema.safeParse({
        type: 'FeatureCollection',
        features: [polygonTerritory],
      }).success,
    ).toBe(true);

    const multi = {
      ...polygonTerritory,
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          polygonTerritory.geometry.type === 'Polygon'
            ? polygonTerritory.geometry.coordinates
            : [],
        ],
      },
    };
    expect(
      territoryFileSchema.safeParse({ type: 'FeatureCollection', features: [multi] }).success,
    ).toBe(true);
  });

  it('接受文字标识与落点', () => {
    const withLabel = {
      type: 'FeatureCollection',
      features: [
        {
          ...polygonTerritory,
          properties: {
            ...polygonTerritory.properties,
            label: { zh: '魏', en: 'Wei' },
            labelPoint: [112, 37],
          },
        },
      ],
    };
    expect(territoryFileSchema.safeParse(withLabel).success).toBe(true);
  });

  it('拒绝越界的标识落点', () => {
    const invalid = {
      type: 'FeatureCollection',
      features: [
        {
          ...polygonTerritory,
          properties: {
            ...polygonTerritory.properties,
            labelPoint: [200, 37],
          },
        },
      ],
    };
    expect(territoryFileSchema.safeParse(invalid).success).toBe(false);
  });

  it('拒绝过高的不透明度', () => {
    const invalid = {
      type: 'FeatureCollection',
      features: [
        {
          ...polygonTerritory,
          properties: { ...polygonTerritory.properties, opacity: 0.9 },
        },
      ],
    };
    expect(territoryFileSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('territory cross-file validation', () => {
  it('未知实体报错', () => {
    const issues = validateCrossFile(
      manifest,
      [],
      [],
      [
        {
          ...polygonTerritory,
          properties: { ...polygonTerritory.properties, entityId: 'missing' },
        },
      ],
    );
    expect(issues.some((issue) => issue.level === 'error' && issue.path.includes('entityId'))).toBe(
      true,
    );
  });

  it('有效疆域不报错', () => {
    const issues = validateCrossFile(manifest, [], [], [polygonTerritory]);
    expect(issues.filter((issue) => issue.level === 'error')).toHaveLength(0);
  });
});
