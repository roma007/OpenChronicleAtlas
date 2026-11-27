import { describe, expect, it } from 'vitest';
import { territoryPolityStatus, territoryVisualStyle } from '../territory-style';
import type { AtlasTerritoryFeature } from '../types';

function feature(extensions?: Record<string, unknown>): AtlasTerritoryFeature {
  return {
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
      entityId: 'demo',
      startDate: '0900-01-01',
      endDate: '0910-12-31',
      extensions,
    },
  };
}

describe('territory polity status', () => {
  it('默认视为已立国', () => {
    expect(territoryPolityStatus(feature())).toBe('state');
    expect(territoryPolityStatus(feature({ polityStatus: 'unknown' }))).toBe('state');
  });

  it('立国面实线、正常填充', () => {
    const style = territoryVisualStyle(feature());
    expect(style).toMatchObject({
      status: 'state',
      fillOpacity: 0.16,
      dashed: false,
      italic: false,
      neutralStroke: false,
    });
  });

  it('藩镇据地画虚线、降透明度、标识斜体', () => {
    const style = territoryVisualStyle(feature({ polityStatus: 'regime' }));
    expect(style.status).toBe('regime');
    expect(style.dashed).toBe(true);
    expect(style.italic).toBe(true);
    expect(style.fillOpacity).toBeCloseTo(0.088);
    expect(style.neutralStroke).toBe(false);
  });

  it('部族羁縻用浅色点线与中性灰', () => {
    const style = territoryVisualStyle(feature({ polityStatus: 'tribal' }));
    expect(style.status).toBe('tribal');
    expect(style.dashed).toBe(true);
    expect(style.fillOpacity).toBe(0.05);
    expect(style.neutralStroke).toBe(true);
  });

  it('显式 dashed 在立国面上仍生效', () => {
    expect(territoryVisualStyle(feature({ dashed: true })).dashed).toBe(true);
  });
});
