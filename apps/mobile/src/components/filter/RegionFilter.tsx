import {
  regionAncestors,
  regionName,
  resolveLocalized,
  type AtlasRegion,
} from '@atlas/shared';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';
import { useI18n } from '../../hooks/useI18n';

const FIRST_LEVEL = new Set<AtlasRegion['level']>(['province', 'municipality', 'overseas']);

export function RegionFilter() {
  const dataset = useAtlasStore((state) => state.dataset);
  const filters = useAtlasStore((state) => state.filters);
  const toggleRegion = useAtlasStore((state) => state.toggleRegion);
  const setRegions = useAtlasStore((state) => state.setRegions);
  const focusRegion = useAtlasStore((state) => state.focusRegion);
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');

  const selected = useMemo(() => new Set(filters.regionIds), [filters.regionIds]);

  const expandedFirst = useMemo(() => {
    if (!dataset) return new Set<string>();
    const result = new Set<string>();
    for (const id of selected) {
      const ancestors = regionAncestors(dataset.regionsById, id);
      const first = ancestors.find((region) => FIRST_LEVEL.has(region.level));
      if (first) result.add(first.id);
    }
    return result;
  }, [dataset, selected]);

  const firstLevel = useMemo(() => {
    if (!dataset) return [];
    return dataset.regions
      .filter((region) => FIRST_LEVEL.has(region.level))
      .sort((a, b) => regionName(a, locale).localeCompare(regionName(b, locale), locale));
  }, [dataset, locale]);

  const eventCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of dataset?.events ?? []) {
      for (const id of event.location.regionIds ?? []) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
    return counts;
  }, [dataset]);

  const routeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const route of dataset?.routes ?? []) {
      for (const id of route.properties.regionIds ?? []) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
    return counts;
  }, [dataset]);

  if (!dataset || dataset.regions.length === 0) return null;

  const activeFirst = firstLevel.filter((region) => expandedFirst.has(region.id));
  const visibleFirst = firstLevel.filter(
    (region) =>
      (eventCounts.get(region.id) ?? 0) > 0 ||
      (routeCounts.get(region.id) ?? 0) > 0 ||
      selected.has(region.id) ||
      expandedFirst.has(region.id),
  );
  const children = activeFirst.length
    ? dataset.regions
        .filter((region) => {
          if (FIRST_LEVEL.has(region.level)) return false;
          let current: AtlasRegion | undefined = region;
          while (current && !FIRST_LEVEL.has(current.level)) {
            current = current.parentId ? dataset.regionsById.get(current.parentId) : undefined;
          }
          return current ? expandedFirst.has(current.id) : false;
        })
        .filter((region) => {
          if (!query.trim()) return true;
          const haystack = [
            regionName(region, locale),
            region.modernName ? resolveLocalized(region.modernName, locale) : '',
            ...(region.aliases ?? []),
          ].join(' ');
          return haystack.toLowerCase().includes(query.trim().toLowerCase());
        })
        .sort((a, b) => regionName(a, locale).localeCompare(regionName(b, locale), locale))
    : [];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('legend.regions')}</Text>
        {filters.regionIds.length > 0 ? (
          <View style={styles.headerActions}>
            <Pressable onPress={() => focusRegion(filters.regionIds[0]!)} style={styles.clear}>
              <Text style={styles.clearText}>{t('legend.focusRegion')}</Text>
            </Pressable>
            <Pressable onPress={() => setRegions([])} style={styles.clear}>
              <Text style={styles.clearText}>{t('legend.clearRegions')}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.chips}>
        {visibleFirst.map((region) => {
          const active = selected.has(region.id);
          const partial = !active && expandedFirst.has(region.id);
          const count = eventCounts.get(region.id) ?? 0;
          return (
            <Pressable
              key={region.id}
              onPress={() => toggleRegion(region.id)}
              style={[styles.chip, active && styles.chipActive, partial && styles.chipPartial]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, (active || partial) && styles.chipTextActive]}>
                {regionName(region, locale)} {count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeFirst.length > 0 ? (
        <View style={styles.children}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('legend.searchRegion')}
            placeholderTextColor={colors.inkSoft + '66'}
            style={styles.search}
          />
          <ScrollView style={styles.list} nestedScrollEnabled>
            {children.map((region) => {
              const active = selected.has(region.id);
              const count = eventCounts.get(region.id) ?? 0;
              return (
                <Pressable
                  key={region.id}
                  onPress={() => toggleRegion(region.id)}
                  style={[styles.row, active && styles.rowActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.rowText, active && styles.rowTextActive]}>
                    {region.level === 'county' ? '' : '· '}
                    {regionName(region, locale)}
                  </Text>
                  {region.modernName ? (
                    <Text style={styles.modern} numberOfLines={1}>
                      {resolveLocalized(region.modernName, locale)}
                    </Text>
                  ) : null}
                  <Text style={styles.count}>{count}</Text>
                </Pressable>
              );
            })}
            {children.length === 0 ? (
              <Text style={styles.empty}>{t('legend.noRegionMatch')}</Text>
            ) : null}
          </ScrollView>
          <Text style={styles.hint}>{t('legend.regionHint')}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 12, letterSpacing: 2, color: colors.inkSoft, opacity: 0.8 },
  headerActions: { flexDirection: 'row', gap: 6 },
  clear: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  clearText: { fontSize: 10, color: colors.inkSoft },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipActive: { borderColor: colors.cinnabar + '88', backgroundColor: colors.cinnabar + '18' },
  chipPartial: { borderColor: colors.cinnabar + '55', backgroundColor: colors.cinnabar + '0d' },
  chipText: { fontSize: 10, color: colors.inkSoft },
  chipTextActive: { color: colors.cinnabar },
  children: { gap: 6 },
  search: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    color: colors.ink,
  },
  list: { maxHeight: 220 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  rowActive: { backgroundColor: colors.cinnabar + '14' },
  rowText: { fontSize: 11, color: colors.inkSoft },
  rowTextActive: { color: colors.cinnabar },
  modern: { flex: 1, fontSize: 9, color: colors.inkSoft, opacity: 0.55 },
  count: { fontSize: 9, color: colors.inkSoft, opacity: 0.6 },
  empty: { fontSize: 10, color: colors.inkSoft, opacity: 0.5, padding: 6 },
  hint: { fontSize: 9, lineHeight: 13, color: colors.inkSoft, opacity: 0.55 },
});
