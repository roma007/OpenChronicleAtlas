import type { Locale } from './locale';

const TAG_LABELS: Record<string, { zh: string; en: string }> = {
  中国近代史: { zh: '中国近代史', en: 'Modern Chinese history' },
  军事: { zh: '军事', en: 'Military' },
  长征: { zh: '长征', en: 'Long March' },
  中国历史: { zh: '中国历史', en: 'Chinese history' },
  航海: { zh: '航海', en: 'Maritime' },
  明代: { zh: '明代', en: 'Ming dynasty' },
  丝绸之路: { zh: '丝绸之路', en: 'Silk Road' },
  佛教: { zh: '佛教', en: 'Buddhism' },
};

export function tagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS[tag]?.[locale] ?? tag;
}
