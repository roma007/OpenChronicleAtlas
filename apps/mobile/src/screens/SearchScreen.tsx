import {
  buildSearchIndex,
  categoryLabel,
  collectCategories,
  loadPinyinProvider,
  parseDateString,
  resolveLocalized,
  searchEvents,
  type PinyinProvider,
  type SearchHit,
} from '@atlas/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { useAtlasStore } from '../stores/useAtlasStore';
import { colors, radii, spacing } from '../theme';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const datasets = useAtlasStore((state) => state.searchDatasets);
  const loading = useAtlasStore((state) => state.searchLoading);
  const error = useAtlasStore((state) => state.searchError);
  const loadSearchData = useAtlasStore((state) => state.loadSearchData);
  const { locale, t } = useI18n();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [atlasFilter, setAtlasFilter] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pinyinProvider, setPinyinProvider] = useState<PinyinProvider | null>(null);

  useEffect(() => {
    void loadSearchData();
  }, [loadSearchData]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    void loadPinyinProvider()
      .then((provider) => {
        if (!cancelled) setPinyinProvider(provider);
      })
      .catch(() => {
        // 拼音增强失败时保留基础索引，不影响普通搜索。
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(
    () => (datasets ? buildSearchIndex(datasets, locale, pinyinProvider) : null),
    [datasets, locale, pinyinProvider],
  );

  const toTime = (value: string) => {
    if (!value) return undefined;
    try {
      return parseDateString(value);
    } catch {
      return undefined;
    }
  };

  const hits = useMemo(() => {
    if (!index || !debounced) return [];
    return searchEvents(debounced, index, {
      atlasId: atlasFilter || undefined,
      category: category || undefined,
      from: toTime(from),
      to: toTime(to),
      limit: 50,
    });
  }, [index, debounced, atlasFilter, category, from, to]);

  const categories = useMemo(
    () => (datasets ? collectCategories(datasets.flatMap((dataset) => dataset.events)) : []),
    [datasets],
  );

  const resetFilters = () => {
    setAtlasFilter('');
    setCategory('');
    setFrom('');
    setTo('');
  };

  const atlases =
    datasets?.map((dataset) => ({
      id: dataset.manifest.id,
      title: resolveLocalized(dataset.manifest.title, locale),
    })) ?? [];

  const openHit = (hit: SearchHit) => {
    navigation.navigate('Atlas', {
      atlasId: hit.atlasId,
      t: hit.event.date,
      event: hit.event.id,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{t('nav.backToAtlases')}</Text>
          </Pressable>
          <LanguageToggle />
        </View>
        <Text style={styles.title}>{t('search.title')}</Text>
        <Text style={styles.subtitle}>{t('search.subtitle')}</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.inkSoft + '77'}
          style={styles.input}
          autoFocus
          returnKeyType="search"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            onPress={() => setAtlasFilter('')}
            style={[styles.chip, !atlasFilter && styles.chipActive]}
          >
            <Text style={[styles.chipText, !atlasFilter && styles.chipTextActive]}>{t('search.allAtlases')}</Text>
          </Pressable>
          {atlases.map((atlas) => (
            <Pressable
              key={atlas.id}
              onPress={() => setAtlasFilter(atlas.id)}
              style={[styles.chip, atlasFilter === atlas.id && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, atlasFilter === atlas.id && styles.chipTextActive]}
              >
                {atlas.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            onPress={() => setCategory('')}
            style={[styles.chip, !category && styles.chipActive]}
          >
            <Text style={[styles.chipText, !category && styles.chipTextActive]}>
              {t('search.allCategories')}
            </Text>
          </Pressable>
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.chip, category === item && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
                {categoryLabel(item, locale)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.dateRow}>
          <TextInput
            value={from}
            onChangeText={setFrom}
            placeholder={`${t('common.start')} YYYY-MM-DD`}
            placeholderTextColor={colors.inkSoft + '66'}
            style={styles.dateInput}
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            value={to}
            onChangeText={setTo}
            placeholder={`${t('common.end')} YYYY-MM-DD`}
            placeholderTextColor={colors.inkSoft + '66'}
            style={styles.dateInput}
            keyboardType="numbers-and-punctuation"
          />
          <Pressable onPress={resetFilters} style={styles.reset}>
            <Text style={styles.resetText}>{t('search.resetFilters')}</Text>
          </Pressable>
        </View>
      </View>

      {loading && !datasets ? (
        <ActivityIndicator color={colors.cinnabar} style={styles.loading} />
      ) : error ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>{t('search.errorTitle')}</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => void loadSearchData()}>
            <Text style={styles.retryText}>{t('nav.retry')}</Text>
          </Pressable>
        </View>
      ) : !debounced ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>{t('search.promptTitle')}</Text>
          <Text style={styles.emptyText}>
            {t('search.promptBody')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hits}
          keyExtractor={(item) => `${item.atlasId}:${item.event.id}`}
          contentContainerStyle={styles.results}
          ListHeaderComponent={
            <Text style={styles.count}>{t(hits.length === 1 ? 'search.result' : 'search.results', {
              count: hits.length,
            })}</Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>{t('search.emptyTitle')}</Text>
              <Text style={styles.emptyText}>{t('search.emptyBody')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.result} onPress={() => openHit(item)}>
              <View style={styles.resultTitleRow}>
                <Text style={styles.resultTitle}>{resolveLocalized(item.event.name, locale)}</Text>
                <Text style={styles.resultDate}>{item.event.date.replace(/^0+/, '')}</Text>
              </View>
              <Text style={styles.resultSnippet} numberOfLines={2}>
                {item.snippet}
              </Text>
              <Text style={styles.resultMeta}>
                {item.atlasTitle} · {categoryLabel(item.event.category, locale)}
                {resolveLocalized(item.event.location.place, locale)
                  ? ` · ${resolveLocalized(item.event.location.place, locale)}`
                  : ''}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  header: { padding: spacing.lg, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: colors.inkSoft, fontSize: 13 },
  title: { fontSize: 30, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.inkSoft },
  input: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.ink + '22',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  chips: { gap: spacing.sm, paddingVertical: spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    color: colors.inkSoft,
    backgroundColor: colors.white,
  },
  reset: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  resetText: { fontSize: 10, color: colors.inkSoft },
  chip: {
    borderWidth: 1,
    borderColor: colors.ink + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.cinnabar, borderColor: colors.cinnabar },
  chipText: { fontSize: 12, color: colors.inkSoft },
  chipTextActive: { color: colors.parchment },
  loading: { marginTop: spacing.xl },
  results: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  count: { fontSize: 12, color: colors.inkSoft, marginBottom: spacing.xs },
  result: {
    borderWidth: 1,
    borderColor: colors.ink + '14',
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    gap: 6,
  },
  resultTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  resultTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.ink },
  resultDate: { fontSize: 11, color: colors.inkSoft },
  resultSnippet: { fontSize: 12, lineHeight: 19, color: colors.inkSoft },
  resultMeta: { fontSize: 10, color: colors.inkSoft, opacity: 0.7 },
  emptyBox: { padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
  emptyText: { fontSize: 13, lineHeight: 21, color: colors.inkSoft, textAlign: 'center' },
  retry: {
    marginTop: spacing.md,
    backgroundColor: colors.cinnabar,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  retryText: { color: colors.parchment, fontSize: 13 },
});
