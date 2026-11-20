import {
  applyEventFilters,
  parseDateString,
  regionAncestors,
  regionName,
  resolveLocalized,
  type AtlasRegion,
} from '@atlas/shared';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';
import { useI18n } from '../../hooks/useI18n';

const FIRST_LEVEL = new Set<AtlasRegion['level']>(['province', 'municipality', 'overseas']);

interface RegionFilterProps {
  onNavigate?: () => void;
}

export function RegionFilter({ onNavigate }: RegionFilterProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const filters = useAtlasStore((state) => state.filters);
  const toggleRegion = useAtlasStore((state) => state.toggleRegion);
  const setRegions = useAtlasStore((state) => state.setRegions);
  const focusRegion = useAtlasStore((state) => state.focusRegion);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const pause = useAtlasStore((state) => state.pause);
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [showEvents, setShowEvents] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

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

  const childrenByParent = useMemo(() => {
    const map = new Map<string, AtlasRegion[]>();
    if (!dataset) return map;
    for (const region of dataset.regions) {
      if (!region.parentId || FIRST_LEVEL.has(region.level)) continue;
      const list = map.get(region.parentId) ?? [];
      list.push(region);
      map.set(region.parentId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => regionName(a, locale).localeCompare(regionName(b, locale), locale));
    }
    return map;
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

  useEffect(() => {
    if (!dataset) return;
    setExpandedCounties((previous) => {
      const next = new Set(previous);
      let changed = false;
      for (const id of filters.regionIds) {
        const region = dataset.regionsById.get(id);
        if (!region) continue;
        if (region.level === 'county') {
          if (!next.has(region.id)) {
            next.add(region.id);
            changed = true;
          }
        } else if (region.level === 'place' && region.parentId) {
          const parent = dataset.regionsById.get(region.parentId);
          if (parent?.level === 'county' && !next.has(parent.id)) {
            next.add(parent.id);
            changed = true;
          }
        }
      }
      return changed ? next : previous;
    });
  }, [dataset, filters.regionIds]);

  if (!dataset || dataset.regions.length === 0) return null;

  const activeFirst = firstLevel.filter((region) => expandedFirst.has(region.id));
  const visibleFirst = firstLevel.filter(
    (region) =>
      (eventCounts.get(region.id) ?? 0) > 0 ||
      (routeCounts.get(region.id) ?? 0) > 0 ||
      selected.has(region.id) ||
      expandedFirst.has(region.id),
  );
  const queryText = query.trim().toLowerCase();
  const matchesQuery = (region: AtlasRegion) => {
    if (!queryText) return true;
    const haystack = [
      regionName(region, locale),
      region.modernName ? resolveLocalized(region.modernName, locale) : '',
      ...(region.aliases ?? []),
    ].join(' ');
    return haystack.toLowerCase().includes(queryText);
  };
  const countLabel = (region: AtlasRegion) => {
    const events = eventCounts.get(region.id) ?? 0;
    const routes = routeCounts.get(region.id) ?? 0;
    return routes > 0 ? `${events} / ${routes}` : String(events);
  };

  const regionEvents = applyEventFilters(dataset.events, filters).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const visibleRegionEvents = showAllEvents ? regionEvents : regionEvents.slice(0, 12);

  const groups = activeFirst.map((first) => {
    const direct = childrenByParent.get(first.id) ?? [];
    const counties = direct
      .filter((region) => region.level === 'county')
      .map((county) => {
        const places = childrenByParent.get(county.id) ?? [];
        const matching = places.filter(matchesQuery);
        const countyMatches = matchesQuery(county);
        return {
          county,
          places: countyMatches ? places : matching,
          visible: countyMatches || matching.length > 0,
        };
      })
      .filter((entry) => entry.visible);
    const directPlaces = direct.filter(
      (region) => region.level === 'place' && matchesQuery(region),
    );
    return { first, counties, directPlaces };
  });
  const hasRows = groups.some(
    (group) => group.counties.length > 0 || group.directPlaces.length > 0,
  );

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
            {groups.map((group) => (
              <View key={group.first.id} style={styles.group}>
                <Text style={styles.groupTitle}>{regionName(group.first, locale)}</Text>
                {group.counties.map(({ county, places }) => {
                  const expanded = expandedCounties.has(county.id) || Boolean(queryText);
                  const active = selected.has(county.id);
                  return (
                    <View key={county.id}>
                      <View style={styles.countyRow}>
                        <Pressable
                          onPress={() =>
                            setExpandedCounties((previous) => {
                              const next = new Set(previous);
                              if (next.has(county.id)) next.delete(county.id);
                              else next.add(county.id);
                              return next;
                            })
                          }
                          accessibilityLabel={t(
                            expanded ? 'legend.collapseCounty' : 'legend.expandCounty',
                          )}
                          style={styles.chevron}
                        >
                          <Text style={styles.chevronText}>{expanded ? '▾' : '▸'}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => toggleRegion(county.id)}
                          style={[styles.row, styles.rowFlex, active && styles.rowActive]}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                        >
                          <Text style={[styles.countyText, active && styles.rowTextActive]}>
                            {regionName(county, locale)}
                          </Text>
                          <Text style={styles.count}>{countLabel(county)}</Text>
                        </Pressable>
                      </View>
                      {expanded ? (
                        places.length > 0 ? (
                          places.map((place) => {
                            const placeActive = selected.has(place.id);
                            return (
                              <Pressable
                                key={place.id}
                                onPress={() => toggleRegion(place.id)}
                                style={[styles.placeRow, placeActive && styles.rowActive]}
                                accessibilityRole="button"
                                accessibilityState={{ selected: placeActive }}
                              >
                                <Text
                                  style={[styles.rowText, placeActive && styles.rowTextActive]}
                                  numberOfLines={1}
                                >
                                  · {regionName(place, locale)}
                                </Text>
                                {place.modernName ? (
                                  <Text style={styles.modern} numberOfLines={1}>
                                    {resolveLocalized(place.modernName, locale)}
                                  </Text>
                                ) : null}
                                <Text style={styles.count}>{countLabel(place)}</Text>
                              </Pressable>
                            );
                          })
                        ) : (
                          <Text style={styles.empty}>{t('legend.noRegionMatch')}</Text>
                        )
                      ) : null}
                    </View>
                  );
                })}
                {group.directPlaces.map((place) => {
                  const active = selected.has(place.id);
                  return (
                    <Pressable
                      key={place.id}
                      onPress={() => toggleRegion(place.id)}
                      style={[styles.placeRow, active && styles.rowActive]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.rowText, active && styles.rowTextActive]} numberOfLines={1}>
                        · {regionName(place, locale)}
                      </Text>
                      {place.modernName ? (
                        <Text style={styles.modern} numberOfLines={1}>
                          {resolveLocalized(place.modernName, locale)}
                        </Text>
                      ) : null}
                      <Text style={styles.count}>{countLabel(place)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
            {!hasRows ? <Text style={styles.empty}>{t('legend.noRegionMatch')}</Text> : null}
          </ScrollView>
          <Text style={styles.hint}>{t('legend.regionHint')}</Text>

          <View style={styles.eventsBlock}>
            <Pressable
              onPress={() => setShowEvents((value) => !value)}
              style={styles.eventsToggle}
            >
              <Text style={styles.eventsTitle}>
                {t('legend.regionEvents')} · {regionEvents.length}
              </Text>
              <Text style={styles.eventsChevron}>{showEvents ? '▾' : '▸'}</Text>
            </Pressable>
            {showEvents ? (
              <View style={styles.eventsList}>
                {visibleRegionEvents.map((event) => {
                  const color =
                    dataset.entitiesById.get(event.entityIds[0] ?? '')?.color ?? colors.cinnabar;
                  return (
                    <Pressable
                      key={event.id}
                      onPress={() => {
                        pause();
                        setCurrentTime(parseDateString(event.date));
                        selectEvent(event.id);
                        onNavigate?.();
                      }}
                      style={styles.eventRow}
                    >
                      <Text style={styles.eventDate}>{event.date}</Text>
                      <View style={[styles.eventDot, { backgroundColor: color }]} />
                      <Text style={styles.eventName} numberOfLines={1}>
                        {resolveLocalized(event.name, locale)}
                      </Text>
                    </Pressable>
                  );
                })}
                {regionEvents.length === 0 ? (
                  <Text style={styles.empty}>{t('legend.noRegionEvents')}</Text>
                ) : null}
              </View>
            ) : null}
            {showEvents && regionEvents.length > 12 ? (
              <Pressable onPress={() => setShowAllEvents((value) => !value)}>
                <Text style={styles.eventsMore}>
                  {t(showAllEvents ? 'legend.showLessRegionEvents' : 'legend.showAllRegionEvents')}
                </Text>
              </Pressable>
            ) : null}
          </View>
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
  list: { maxHeight: 260 },
  group: { marginBottom: 6 },
  groupTitle: {
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.inkSoft,
    opacity: 0.45,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  countyRow: { flexDirection: 'row', alignItems: 'center' },
  rowFlex: { flex: 1 },
  chevron: {
    width: 22,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: { fontSize: 10, color: colors.inkSoft, opacity: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 28,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  rowActive: { backgroundColor: colors.cinnabar + '14' },
  rowText: { fontSize: 10, color: colors.inkSoft },
  rowTextActive: { color: colors.cinnabar },
  countyText: { fontSize: 11, color: colors.inkSoft, fontWeight: '500' },
  modern: { flex: 1, fontSize: 9, color: colors.inkSoft, opacity: 0.55 },
  count: { fontSize: 9, color: colors.inkSoft, opacity: 0.6 },
  empty: { fontSize: 9, color: colors.inkSoft, opacity: 0.45, padding: 6 },
  hint: { fontSize: 9, lineHeight: 13, color: colors.inkSoft, opacity: 0.55 },
  eventsBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.ink + '12',
    paddingTop: spacing.sm,
    gap: 4,
  },
  eventsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  eventsTitle: { fontSize: 10, letterSpacing: 1, color: colors.inkSoft },
  eventsChevron: { fontSize: 10, color: colors.inkSoft, opacity: 0.5 },
  eventsList: { gap: 2 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  eventDate: { width: 62, fontSize: 9, color: colors.inkSoft, opacity: 0.55 },
  eventDot: { width: 6, height: 6, borderRadius: 3 },
  eventName: { flex: 1, fontSize: 10, color: colors.inkSoft },
  eventsMore: { fontSize: 9, color: colors.cinnabar, opacity: 0.8, paddingVertical: 4 },
});
