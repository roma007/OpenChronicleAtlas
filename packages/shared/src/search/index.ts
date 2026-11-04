import type { AtlasDataset, LocalizedString } from '../types';
import { resolveLocalized } from '../i18n/localized';
import { categorySearchText } from '../i18n/categories';
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

      entries.push({
        atlasId: dataset.manifest.id,
        atlasTitle,
        event,
        fields: {
          name: allLocalized(event.name),
          place: allLocalized(event.location.place),
          summary: allLocalized(event.summary),
          description: stripMarkdown(allLocalized(event.description)),
          category: categorySearchText(event.category),
          entities,
          date: event.date,
        },
      });
    }
  }

  return { entries };
}
