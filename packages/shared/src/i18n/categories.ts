import type { Locale } from './locale';

interface CategoryLabel {
  zh: string;
  en: string;
}

const CATEGORY_LABELS: Record<string, CategoryLabel> = {
  行军: { zh: '行军', en: 'March' },
  战斗: { zh: '战斗', en: 'Battle' },
  重要会议: { zh: '重要会议', en: 'Key meeting' },
  会师: { zh: '会师', en: 'Link-up' },
  航行: { zh: '航行', en: 'Voyage' },
  外交: { zh: '外交', en: 'Diplomacy' },
  政策: { zh: '政策', en: 'Policy' },
};

export function categoryLabel(category: string, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category;
}

/** 搜索索引使用：同时包含中英文分类名 */
export function categorySearchText(category: string): string {
  const labels = CATEGORY_LABELS[category];
  if (!labels) return category;
  return `${labels.zh} ${labels.en}`;
}

export function knownCategories(): string[] {
  return Object.keys(CATEGORY_LABELS);
}
