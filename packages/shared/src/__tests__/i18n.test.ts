import { describe, expect, it } from 'vitest';
import { normalizeLocale, nextLocale, localeTag } from '../i18n/locale';
import { messages, translate } from '../i18n/messages';
import { categoryLabel, categorySearchText } from '../i18n/categories';
import { tagLabel } from '../i18n/tags';

describe('locale', () => {
  it('归一化语言标签', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('EN')).toBe('en');
    expect(normalizeLocale('zh-CN')).toBe('zh');
    expect(normalizeLocale(null)).toBe('zh');
    expect(normalizeLocale('fr')).toBe('zh');
  });

  it('语言标签与切换', () => {
    expect(localeTag('en')).toBe('en-US');
    expect(localeTag('zh')).toBe('zh-CN');
    expect(nextLocale('zh')).toBe('en');
    expect(nextLocale('en')).toBe('zh');
  });
});

describe('messages', () => {
  it('中英文 key 完全一致', () => {
    expect(Object.keys(messages.en).sort()).toEqual(Object.keys(messages.zh).sort());
  });

  it('占位符替换', () => {
    expect(translate('zh', 'search.results', { count: 3 })).toBe('找到 3 条结果');
    expect(translate('en', 'search.results', { count: 3 })).toBe('3 results');
  });

  it('缺失参数保留占位符', () => {
    expect(translate('en', 'search.results')).toBe('{count} results');
  });
});

describe('categories', () => {
  it('中英文分类映射', () => {
    expect(categoryLabel('重要会议', 'zh')).toBe('重要会议');
    expect(categoryLabel('重要会议', 'en')).toBe('Key meeting');
    expect(categoryLabel('未知', 'en')).toBe('未知');
  });

  it('搜索文本同时包含中英文', () => {
    expect(categorySearchText('会师')).toBe('会师 Link-up');
  });

  it('标签映射与回退', () => {
    expect(tagLabel('长征', 'en')).toBe('Long March');
    expect(tagLabel('未知', 'en')).toBe('未知');
  });
});
