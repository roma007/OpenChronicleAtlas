import {
  buildSearchIndex,
  resolveLocalized,
  searchEvents,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const datasets = useAtlasStore((state) => state.searchDatasets);
  const loading = useAtlasStore((state) => state.searchLoading);
  const error = useAtlasStore((state) => state.searchError);
  const loadSearchData = useAtlasStore((state) => state.loadSearchData);

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [atlasFilter, setAtlasFilter] = useState('');

  useEffect(() => {
    void loadSearchData();
  }, [loadSearchData]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const index = useMemo(() => (datasets ? buildSearchIndex(datasets) : null), [datasets]);

  const hits = useMemo(() => {
    if (!index || !debounced) return [];
    return searchEvents(debounced, index, {
      atlasId: atlasFilter || undefined,
      limit: 50,
    });
  }, [index, debounced, atlasFilter]);

  const atlases =
    datasets?.map((dataset) => ({
      id: dataset.manifest.id,
      title: resolveLocalized(dataset.manifest.title),
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
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 专题</Text>
        </Pressable>
        <Text style={styles.title}>检索</Text>
        <Text style={styles.subtitle}>按事件名、地名、类型或日期查找。</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="例如：遵义、贵州、1935"
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
            <Text style={[styles.chipText, !atlasFilter && styles.chipTextActive]}>全部专题</Text>
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
      </View>

      {loading && !datasets ? (
        <ActivityIndicator color={colors.cinnabar} style={styles.loading} />
      ) : error ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>搜索数据加载失败</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => void loadSearchData()}>
            <Text style={styles.retryText}>重试</Text>
          </Pressable>
        </View>
      ) : !debounced ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>输入关键词开始检索</Text>
          <Text style={styles.emptyText}>
            支持事件名、地名、类型与日期，例如「遵义」「贵州」「1935」「重要会议」。
          </Text>
        </View>
      ) : (
        <FlatList
          data={hits}
          keyExtractor={(item) => `${item.atlasId}:${item.event.id}`}
          contentContainerStyle={styles.results}
          ListHeaderComponent={
            <Text style={styles.count}>找到 {hits.length} 条结果</Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>没有找到匹配事件</Text>
              <Text style={styles.emptyText}>试试更短的关键词，或切换到「全部专题」。</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.result} onPress={() => openHit(item)}>
              <View style={styles.resultTitleRow}>
                <Text style={styles.resultTitle}>{resolveLocalized(item.event.name)}</Text>
                <Text style={styles.resultDate}>{item.event.date}</Text>
              </View>
              <Text style={styles.resultSnippet} numberOfLines={2}>
                {item.snippet}
              </Text>
              <Text style={styles.resultMeta}>
                {item.atlasTitle} · {item.event.category}
                {resolveLocalized(item.event.location.place)
                  ? ` · ${resolveLocalized(item.event.location.place)}`
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
