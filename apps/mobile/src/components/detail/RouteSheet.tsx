import { resolveLocalized, segmentTypeLabel } from '@atlas/shared';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';
import { useI18n } from '../../hooks/useI18n';

export function RouteSheet() {
  const dataset = useAtlasStore((state) => state.dataset);
  const selectedRoute = useAtlasStore((state) => state.selectedRoute);
  const selectRoute = useAtlasStore((state) => state.selectRoute);
  const focusRoute = useAtlasStore((state) => state.focusRoute);
  const { locale, t } = useI18n();

  if (!dataset || !selectedRoute) return null;
  const route = dataset.routes.find(
    (item) =>
      item.properties.entityId === selectedRoute.entityId &&
      item.properties.order === selectedRoute.order,
  );
  if (!route) return null;

  const entity = dataset.entitiesById.get(route.properties.entityId);
  const name =
    resolveLocalized(route.properties.name, locale) ||
    resolveLocalized(entity?.name, locale) ||
    route.properties.entityId;
  const description = resolveLocalized(route.properties.description, locale);

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={() => selectRoute(null)}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.category}>
            {segmentTypeLabel(route.properties.segmentType, locale)}
          </Text>
          <Pressable style={styles.close} onPress={() => selectRoute(null)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.highlighted}>{t('route.highlighted')}</Text>

          <View style={styles.meta}>
            <Text style={styles.metaLabel}>{t('common.time')}</Text>
            <Text style={styles.metaValue}>
              {route.properties.startDate} — {route.properties.endDate}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaLabel}>{t('common.entity')}</Text>
            <Text style={styles.metaValue}>
              {resolveLocalized(entity?.name, locale) || route.properties.entityId}
            </Text>
          </View>

          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={styles.primary}
              onPress={() => focusRoute(route.properties.entityId, route.properties.order)}
            >
              <Text style={styles.primaryText}>{t('route.focus')}</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => selectRoute(null)}>
              <Text style={styles.secondaryText}>{t('detail.close')}</Text>
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
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ink + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: colors.inkSoft },
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.ink, lineHeight: 32 },
  highlighted: { fontSize: 10, color: colors.inkSoft, opacity: 0.55 },
  meta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  metaLabel: { width: 42, fontSize: 11, color: colors.inkSoft, opacity: 0.6 },
  metaValue: { flex: 1, fontSize: 12, color: colors.inkSoft },
  description: {
    marginTop: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.cinnabar + '66',
    paddingLeft: spacing.md,
    fontSize: 13,
    lineHeight: 22,
    color: colors.ink,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  primary: {
    backgroundColor: colors.cinnabar,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  primaryText: { color: colors.parchment, fontSize: 12 },
  secondary: {
    borderWidth: 1,
    borderColor: colors.ink + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  secondaryText: { color: colors.inkSoft, fontSize: 12 },
});
