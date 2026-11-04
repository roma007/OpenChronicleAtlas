import { EMPTY_FILTERS, parseDateString, resolveLocalized } from '@atlas/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventSheet } from '../components/detail/EventSheet';
import { FilterSheet } from '../components/filter/FilterSheet';
import { AtlasMap } from '../components/map/AtlasMap';
import { Timeline } from '../components/timeline/Timeline';
import type { RootStackParamList } from '../navigation/types';
import { useAtlasStore } from '../stores/useAtlasStore';
import { colors, radii, spacing } from '../theme';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Atlas'>;

export function AtlasScreen({ route, navigation }: Props) {
  const { atlasId, t: initialTime, event: eventId, share } = route.params;
  const insets = useSafeAreaInsets();

  const dataset = useAtlasStore((state) => state.dataset);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadAtlas = useAtlasStore((state) => state.loadAtlas);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);
  const fromCache = useAtlasStore((state) => state.fromCache);
  const setLocale = useAtlasStore((state) => state.setLocale);
  const setActiveEntities = useAtlasStore((state) => state.setActiveEntities);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const { locale, t } = useI18n();

  const appliedRef = useRef(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    void loadAtlas(atlasId);
  }, [atlasId, loadAtlas]);

  useEffect(() => {
    appliedRef.current = false;
  }, [atlasId, dataset]);

  useEffect(() => {
    if (!dataset || appliedRef.current) return;
    appliedRef.current = true;

    pause();
    if (share?.locale) setLocale(share.locale);
    if (share?.entities) setActiveEntities(share.entities);
    if (share?.categories || share?.from || share?.to) {
      setFilters({
        ...EMPTY_FILTERS,
        categories: share.categories ?? [],
        from: share.from,
        to: share.to,
      });
    }
    if (initialTime) {
      try {
        setCurrentTime(parseDateString(initialTime));
      } catch {
        // 非法时间忽略
      }
    }
    if (eventId && dataset.eventsById.has(eventId)) {
      selectEvent(eventId);
    }
  }, [
    dataset,
    initialTime,
    eventId,
    share,
    pause,
    setLocale,
    setActiveEntities,
    setFilters,
    setCurrentTime,
    selectEvent,
  ]);

  const manifest = dataset && dataset.manifest.id === atlasId ? dataset.manifest : null;

  return (
    <View style={styles.root}>
      <AtlasMap />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable style={styles.pill} onPress={() => navigation.goBack()}>
            <Text style={styles.pillText}>{t('nav.backToAtlases')}</Text>
          </Pressable>
          <Pressable style={styles.pill} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.pillText}>{t('nav.search')}</Text>
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {manifest ? resolveLocalized(manifest.title, locale) : t('common.loading')}
            </Text>
            {manifest?.subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {resolveLocalized(manifest.subtitle, locale)}
              </Text>
            ) : null}
            {fromCache ? (
              <Text style={styles.cacheBadge}>{t('offline.cacheBadge')}</Text>
            ) : null}
          </View>

          <LanguageToggle />
          <Pressable style={styles.pill} onPress={() => setFilterOpen(true)}>
            <Text style={styles.pillText}>{t('atlas.filters')}</Text>
          </Pressable>
        </View>
      </View>

      <Timeline />
      <EventSheet />
      <FilterSheet visible={filterOpen} onClose={() => setFilterOpen(false)} />

      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.cinnabar} />
          <Text style={styles.overlayText}>{t('atlas.loading')}</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.overlay}>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>{t('atlas.errorTitle')}</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => void loadAtlas(atlasId)}>
              <Text style={styles.retryText}>{t('nav.retry')}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.parchment + 'F2',
    borderBottomWidth: 1,
    borderBottomColor: colors.ink + '12',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: { fontSize: 11, color: colors.inkSoft },
  titleBlock: { flex: 1, marginLeft: spacing.xs },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 10, color: colors.inkSoft },
  cacheBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
    fontSize: 9,
    color: colors.inkSoft,
    backgroundColor: colors.ochre + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.parchment + 'E6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    zIndex: 20,
  },
  overlayText: { fontSize: 13, color: colors.inkSoft },
  errorBox: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cinnabar + '44',
    backgroundColor: colors.parchment,
    gap: spacing.sm,
  },
  errorTitle: { fontSize: 18, fontWeight: '700', color: colors.cinnabar },
  errorText: { fontSize: 13, color: colors.inkSoft },
  retry: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cinnabar,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  retryText: { color: colors.parchment, fontSize: 13 },
});
