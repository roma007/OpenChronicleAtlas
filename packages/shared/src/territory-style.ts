import type { AtlasTerritoryFeature } from './types';

/**
 * 疆域面的政权状态。
 *
 * - `state`：已立国（王朝、帝国、王国、汗国等），实线面
 * - `regime`：藩镇 / 军镇据地，尚未立国，虚线面
 * - `tribal`：部族 / 羁縻，无国号，浅色点线面
 *
 * 区分「据地」与「立国」是史实表达的一部分：马殷 896 年据湖南、
 * 刘隐 905 年据广州，都不等于楚、南汉已经立国。
 */
export type TerritoryPolityStatus = 'state' | 'regime' | 'tribal';

export interface TerritoryVisualStyle {
  status: TerritoryPolityStatus;
  /** 填充不透明度 */
  fillOpacity: number;
  /** 描边不透明度 */
  strokeOpacity: number;
  dashed: boolean;
  /** 标识文字用斜体，提示「非正式政权」 */
  italic: boolean;
  /** 部族面用中性灰描边，避免被误读为某政权疆域 */
  neutralStroke: boolean;
}

export function territoryPolityStatus(feature: AtlasTerritoryFeature): TerritoryPolityStatus {
  const raw = feature.properties.extensions?.polityStatus;
  return raw === 'regime' || raw === 'tribal' ? raw : 'state';
}

export function territoryVisualStyle(
  feature: AtlasTerritoryFeature,
  baseOpacity = 0.16,
): TerritoryVisualStyle {
  const status = territoryPolityStatus(feature);
  const explicitDashed = feature.properties.extensions?.dashed === true;

  if (status === 'regime') {
    return {
      status,
      fillOpacity: baseOpacity * 0.55,
      strokeOpacity: 0.72,
      dashed: true,
      italic: true,
      neutralStroke: false,
    };
  }

  if (status === 'tribal') {
    return {
      status,
      fillOpacity: Math.min(baseOpacity, 0.05),
      strokeOpacity: 0.4,
      dashed: true,
      italic: false,
      neutralStroke: true,
    };
  }

  return {
    status,
    fillOpacity: baseOpacity,
    strokeOpacity: 0.55,
    dashed: explicitDashed,
    italic: false,
    neutralStroke: false,
  };
}
