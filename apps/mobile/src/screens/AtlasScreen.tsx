import { parseDateString, resolveLocalized } from '@atlas/shared';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Atlas'>;

export function AtlasScreen({ route, navigation }: Props) {
  const { atlasId, t, event: eventId } = route.params;
  const insets = useSafeAreaInsets();

  const dataset = useAtlasStore((state) => state.dataset);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadAtlas = useAtlasStore((state) => state.loadAtlas);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);

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
    if (t) {
      try {
        setCurrentTime(parseDateString(t));
      } catch {
        // 非法时间忽略
      }
    }
    if (eventId && dataset.eventsById.has(eventId)) {
      selectEvent(eventId);
    }
  }, [dataset, t, eventId, pause, setCurrentTime, selectEvent]);

  const manifest = dataset && dataset.manifest.id === atlasId ? dataset.manifest : null;

  return (
    <View style={styles.root}>
      <AtlasMap />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable style={styles.pill} onPress={() => navigation.goBack()}>
            <Text style={styles.pillText}>← 专题</Text>
          </Pressable>
          <Pressable style={styles.pill} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.pillText}>搜索</Text>
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {manifest ? resolveLocalized(manifest.title) : '加载中…'}
            </Text>
            {manifest?.subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {resolveLocalized(manifest.subtitle)}
              </Text>
            ) : null}
          </View>

          <Pressable style={styles.pill} onPress={() => setFilterOpen(true)}>
            <Text style={styles.pillText}>筛选</Text>
          </Pressable>
        </View>
      </View>

      <Timeline />
      <EventSheet />
      <FilterSheet visible={filterOpen} onClose={() => setFilterOpen(false)} />

      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.cinnabar} />
          <Text style={styles.overlayText}>正在加载专题数据…</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.overlay}>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>专题加载失败</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => void loadAtlas(atlasId)}>
              <Text style={styles.retryText}>重试</Text>
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
