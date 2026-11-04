import type { AtlasDataset, LocalizedString } from '../types';
import { resolveLocalized } from '../i18n/localized';
import { categorySearchText } from '../i18n/categories';
import { pinyin } from 'pinyin-pro';
import type { SearchEntry, SearchIndex } from './types';

/** 索引时把所有语言变体拼在一起，保证中英文都能搜到 */
function allLocalized(value: LocalizedString | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return Object.values(value)
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .join(' ');
}

/** 归一化：NFKC、小写、折叠空白 */
export function normalizeText(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** 去掉 Markdown 标记，避免索引里出现 # * 链接语法 */
export function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toSyllables(text: string): string[] {
  const cjk = text.match(/[\u4e00-\u9fff]+/g);
  if (!cjk) return [];
  return pinyin(cjk.join(' '), { toneType: 'none', type: 'array' });
}

/** 全拼：空格形式 + 连写形式，支持 zun yi / zunyi 两种输入 */
function toPinyin(text: string): string {
  const syllables = toSyllables(text);
  if (syllables.length === 0) return '';
  return normalizeText(`${syllables.join(' ')} ${syllables.join('')}`);
}

/** 首字母只取事件名，降低短查询的误命中 */
function toInitials(text: string): string {
  const syllables = toSyllables(text);
  if (syllables.length === 0) return '';
  const initials = syllables.map((syllable) => syllable[0] ?? '').join('');
  return normalizeText(`${initials} ${syllables.map((syllable) => syllable[0] ?? '').join(' ')}`);
}

export function buildSearchIndex(datasets: AtlasDataset[], locale = 'zh'): SearchIndex {
  const entries: SearchEntry[] = [];

  for (const dataset of datasets) {
    const atlasTitle = resolveLocalized(dataset.manifest.title, locale);

    for (const event of dataset.events) {
      const entities = event.entityIds
        .map((id) => dataset.entitiesById.get(id))
        .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity))
        .map((entity) => allLocalized(entity.name))
        .join(' ');

      const name = allLocalized(event.name);
      const place = allLocalized(event.location.place);
      const summary = allLocalized(event.summary);
      const description = stripMarkdown(allLocalized(event.description));
      const category = categorySearchText(event.category);

      const pinyinText = toPinyin(
        [name, place, summary, description, category, entities].join(' '),
      );
      const initials = toInitials(name);

      entries.push({
        atlasId: dataset.manifest.id,
        atlasTitle,
        event,
        fields: {
          name,
          place,
          summary,
          description,
          category,
          entities,
          date: event.date,
          pinyin: pinyinText,
          initials,
        },
      });
    }
  }

  return { entries };
}
