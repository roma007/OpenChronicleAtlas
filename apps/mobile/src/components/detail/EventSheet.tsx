import {
  applyEventFilters,
  categoryLabel,
  eventStart,
  formatDate,
  neighborEvents,
  parseDateString,
  resolveLocalized,
  toDateString,
} from '@atlas/shared';
import * as Linking from 'expo-linking';
import { Image, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DATA_BASE } from '../../data/client';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';
import { Markdown } from '../common/Markdown';
import { useI18n } from '../../hooks/useI18n';

export function EventSheet() {
  const dataset = useAtlasStore((state) => state.dataset);
  const selectedEventId = useAtlasStore((state) => state.selectedEventId);
  const selectEvent = useAtlasStore((state) => state.selectEvent);
  const pause = useAtlasStore((state) => state.pause);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const mapView = useAtlasStore((state) => state.mapView);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const { locale, t, dateLocale } = useI18n();

  const event =
    selectedEventId && dataset ? dataset.eventsById.get(selectedEventId) : undefined;

  if (!event || !dataset) return null;

  const filtered = applyEventFilters(dataset.events, filters).filter((item) =>
    item.entityIds.some((id) => activeEntityIds.has(id)),
  );
  const pool = filtered.some((item) => item.id === event.id) ? filtered : dataset.events;
  const neighbors = neighborEvents(pool, event.id);

  const goToEvent = (target: typeof neighbors.previous) => {
    if (!target) return;
    pause();
    setCurrentTime(eventStart(target));
    selectEvent(target.id);
  };

  const dateText = event.endDate
    ? `${formatDate(parseDateString(event.date), dateLocale)} — ${formatDate(
        parseDateString(event.endDate),
        dateLocale,
      )}`
    : formatDate(parseDateString(event.date), dateLocale);

  const entities = event.entityIds
    .map((id) => dataset.entitiesById.get(id))
    .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity));

  const related = (event.relatedIds ?? [])
    .map((id) => dataset.eventsById.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const share = async () => {
    const queryParams: Record<string, string> = {
      t: toDateString(currentTime),
      event: event.id,
      lang: locale,
      entities: [...activeEntityIds].join(','),
    };
    if (filters.categories.length > 0) {
      queryParams.categories = filters.categories.join(',');
    }
    if (filters.from) queryParams.from = filters.from;
    if (filters.to) queryParams.to = filters.to;
    if (mapView) {
      queryParams.view = `${mapView.lng.toFixed(6)},${mapView.lat.toFixed(6)},${mapView.zoom.toFixed(2)}`;
    }
    const url = Linking.createURL(`/atlas/${dataset.manifest.id}`, { queryParams });
    await Share.share({ title: resolveLocalized(event.name, locale), message: url, url });
  };

  return (
    <Modal visible animationType="slide" presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'} onRequestClose={() => selectEvent(null)}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.category}>{categoryLabel(event.category, locale)}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.action} onPress={() => void share()}>
              <Text style={styles.actionText}>{t('common.share')}</Text>
            </Pressable>
            <Pressable style={styles.close} onPress={() => selectEvent(null)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{resolveLocalized(event.name, locale)}</Text>

          <View style={styles.meta}>
            <Text style={styles.metaLabel}>{t('common.time')}</Text>
            <Text style={styles.metaValue}>{dateText}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaLabel}>{t('common.place')}</Text>
            <Text style={styles.metaValue}>
              {resolveLocalized(event.location.place, locale) ||
                `${event.location.lng}, ${event.location.lat}`}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaLabel}>{t('common.entity')}</Text>
            <Text style={styles.metaValue}>
              {entities.map((entity) => resolveLocalized(entity.name, locale)).join(locale === 'en' ? ', ' : '、')}
            </Text>
          </View>

          <Text style={styles.summary}>{resolveLocalized(event.summary, locale)}</Text>

          {resolveLocalized(event.description, locale) ? (
            <View style={styles.markdown}>
              <Markdown>{resolveLocalized(event.description, locale)}</Markdown>
            </View>
          ) : null}

          {event.images?.map((image) => {
            const uri = image.src.startsWith('http')
              ? image.src
              : `${DATA_BASE}/${dataset.manifest.id}/${image.src}`;
            return (
              <View key={image.src} style={styles.imageBlock}>
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                {image.caption ? (
                  <Text style={styles.caption}>{resolveLocalized(image.caption, locale)}</Text>
                ) : null}
                <Text style={styles.imageUri}>{uri}</Text>
              </View>
            );
          })}

          {related.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('common.relatedEvents')}</Text>
              <View style={styles.relatedRow}>
                {related.map((item) => (
                  <Pressable key={item.id} style={styles.related} onPress={() => selectEvent(item.id)}>
                    <Text style={styles.relatedText}>{resolveLocalized(item.name, locale)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {event.sources?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('common.sources')}</Text>
              {event.sources.map((source) => (
                <Text key={`${source.title}-${source.year ?? ''}`} style={styles.source}>
                  {source.title}
                  {source.author ? ` · ${source.author}` : ''}
                  {source.year ? ` · ${source.year}` : ''}
                  {source.note ? `\n${source.note}` : ''}
                </Text>
              ))}
            </View>
          ) : null}

          <View style={styles.navRow}>
            <Pressable
              style={[styles.navButton, !neighbors.previous && styles.navButtonDisabled]}
              disabled={!neighbors.previous}
              onPress={() => goToEvent(neighbors.previous)}
              accessibilityRole="button"
              accessibilityLabel={t('event.previous')}
            >
              <Text style={styles.navText}>← {t('event.previous')}</Text>
            </Pressable>
            <Pressable
              style={[styles.navButton, !neighbors.next && styles.navButtonDisabled]}
              disabled={!neighbors.next}
              onPress={() => goToEvent(neighbors.next)}
              accessibilityRole="button"
              accessibilityLabel={t('event.next')}
            >
              <Text style={styles.navText}>{t('event.next')} →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  category: {
    fontSize: 11,
    color: colors.cinnabar,
    backgroundColor: colors.cinnabar + '14',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  action: {
    borderWidth: 1,
    borderColor: colors.ink + '22',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  actionText: { fontSize: 11, color: colors.inkSoft },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ink + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: colors.inkSoft, fontSize: 13 },
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.sm },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink },
  meta: { flexDirection: 'row', gap: spacing.md, marginTop: 2 },
  metaLabel: { width: 40, fontSize: 12, color: colors.inkSoft, opacity: 0.7 },
  metaValue: { flex: 1, fontSize: 13, color: colors.inkSoft },
  summary: {
    marginTop: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.cinnabar + '66',
    paddingLeft: spacing.md,
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
  },
  markdown: { marginTop: spacing.md },
  imageBlock: { marginTop: spacing.md, gap: 4 },
  image: { width: '100%', aspectRatio: 16 / 9, borderRadius: 8, backgroundColor: colors.parchmentDeep },
  imagePlaceholder: { fontSize: 13, color: colors.inkSoft },
  caption: { fontSize: 11, color: colors.inkSoft, opacity: 0.8 },
  imageUri: { fontSize: 9, color: colors.inkSoft, opacity: 0.5 },
  section: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.ink + '14', paddingTop: spacing.md },
  sectionTitle: { fontSize: 11, letterSpacing: 2, color: colors.inkSoft, opacity: 0.7 },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  related: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  relatedText: { fontSize: 12, color: colors.inkSoft },
  source: { fontSize: 11, lineHeight: 18, color: colors.inkSoft, marginTop: 6 },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ink + '14',
  },
  navButton: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  navButtonDisabled: { opacity: 0.35 },
  navText: { fontSize: 12, color: colors.inkSoft },
});
