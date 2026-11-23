import { describe, expect, it } from 'vitest';
import type { AtlasRouteFeature } from '@atlas/shared';
import { parseDateString } from '@atlas/shared';
import { routeProgress } from '../route-visuals';

const feature = (extensions: Record<string, unknown>): AtlasRouteFeature =>
  ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [116, 39],
        [117, 38],
      ],
    },
    properties: {
      entityId: 'grand-canal',
      startDate: '0605-01-01',
      endDate: '0907-01-01',
      order: 20,
      segmentType: 'canal',
      extensions,
    },
  }) as AtlasRouteFeature;

describe('routeProgress', () => {
  it('staticUntilEnd 只在起止日期内整段显示', () => {
    const route = feature({ static: true, staticUntilEnd: true });
    expect(routeProgress(route, parseDateString('0604-01-01'))).toBe(-1);
    expect(routeProgress(route, parseDateString('0700-01-01'))).toBe(1);
    expect(routeProgress(route, parseDateString('0907-01-01'))).toBe(1);
    expect(routeProgress(route, parseDateString('0908-01-01'))).toBe(-1);
  });

  it('static 仍可作为起点后长期显示的背景线', () => {
    const route = feature({ static: true });
    expect(routeProgress(route, parseDateString('0908-01-01'))).toBe(1);
  });
});
