import { describe, expect, it } from 'vitest';
import type { AtlasRouteFeature } from '../types';
import { buildRouteGeometry, haversine, partialPathAt } from '../timeline/route';

const feature: AtlasRouteFeature = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
  },
  properties: {
    entityId: 'demo',
    startDate: '1935-01-01',
    endDate: '1935-01-03',
    order: 1,
  },
};

describe('route geometry', () => {
  it('计算累计长度', () => {
    const geometry = buildRouteGeometry(feature);
    expect(geometry.cumulative).toHaveLength(3);
    expect(geometry.cumulative[0]).toBe(0);
    expect(geometry.totalLength).toBeGreaterThan(200_000);
    expect(geometry.totalLength).toBeLessThan(230_000);
  });

  it('haversine 一度纬度约 111 公里', () => {
    const distance = haversine([0, 0], [0, 1]);
    expect(distance).toBeGreaterThan(110_000);
    expect(distance).toBeLessThan(112_000);
  });

  it('progress 0 / 0.5 / 1', () => {
    const geometry = buildRouteGeometry(feature);
    expect(partialPathAt(geometry, 0)).toEqual([]);

    const half = partialPathAt(geometry, 0.5);
    expect(half).toHaveLength(2);
    expect(half[0]).toEqual([0, 0]);
    expect(half[1]![1]).toBeCloseTo(1, 5);

    expect(partialPathAt(geometry, 1)).toEqual(feature.geometry.coordinates);
  });

  it('progress 在段内线性插值', () => {
    const geometry = buildRouteGeometry(feature);
    const quarter = partialPathAt(geometry, 0.25);
    expect(quarter.at(-1)![1]).toBeCloseTo(0.5, 5);
  });

  it('越界进度被 clamp', () => {
    const geometry = buildRouteGeometry(feature);
    expect(partialPathAt(geometry, -1)).toEqual([]);
    expect(partialPathAt(geometry, 2)).toEqual(feature.geometry.coordinates);
  });
});
