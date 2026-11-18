import type { Locale } from './i18n/locale';
import type { RouteSegmentType } from './types';

export interface RouteStyle {
  weight: number;
  opacity: number;
  dash: 'solid' | 'dashed' | 'dotted';
}

const STYLES: Record<RouteSegmentType, RouteStyle> = {
  advance: { weight: 4, opacity: 0.85, dash: 'solid' },
  counterattack: { weight: 5, opacity: 0.95, dash: 'solid' },
  defense: { weight: 3, opacity: 0.8, dash: 'dotted' },
  retreat: { weight: 3, opacity: 0.8, dash: 'dashed' },
  naval: { weight: 4, opacity: 0.85, dash: 'dashed' },
  detachment: { weight: 3, opacity: 0.75, dash: 'dotted' },
  supply: { weight: 3, opacity: 0.75, dash: 'dotted' },
  other: { weight: 3, opacity: 0.75, dash: 'solid' },
};

const LABELS: Record<Locale, Record<RouteSegmentType, string>> = {
  zh: {
    advance: '进攻 / 前进',
    retreat: '撤退 / 突围',
    defense: '防御 / 驻守',
    counterattack: '反击 / 反攻',
    naval: '航行',
    detachment: '分䑸',
    supply: '补给 / 运输',
    other: '其他',
  },
  en: {
    advance: 'Advance',
    retreat: 'Retreat',
    defense: 'Defense',
    counterattack: 'Counterattack',
    naval: 'Naval',
    detachment: 'Detachment',
    supply: 'Supply',
    other: 'Other',
  },
};

export function routeStyleForSegmentType(type?: RouteSegmentType): RouteStyle {
  return STYLES[type ?? 'other'];
}

export function segmentTypeLabel(
  type: RouteSegmentType | undefined,
  locale: Locale,
): string {
  const key = type ?? 'other';
  return LABELS[locale]?.[key] ?? LABELS.zh[key];
}
