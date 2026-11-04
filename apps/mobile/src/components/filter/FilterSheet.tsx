import {
  applyEventFilters,
  collectCategories,
  resolveLocalized,
} from '@atlas/shared';
import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function FilterSheet({ visible, onClose }: FilterSheetProps) {
  const dataset = useAtlasStore((state) => state.dataset);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const toggleEntity = useAtlasStore((state) => state.toggleEntity);
  const filters = useAtlasStore((state) => state.filters);
  const setFilters = useAtlasStore((state) => state.setFilters);
  const toggleCategory = useAtlasStore((state) => state.toggleCategory);
  const resetFilters = useAtlasStore((state) => state.resetFilters);

  const [fromDraft, setFromDraft] = useState(filters.from ?? '');
  const [toDraft, setToDraft] = useState(filters.to ?? '');

  useEffect(() => {
    setFromDraft(filters.from ?? '');
    setToDraft(filters.to ?? '');
  }, [filters.from, filters.to]);

  if (!dataset) return null;

  const entities = [...dataset.manifest.entities].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const categories = collectCategories(dataset.events);
  const filtered = applyEventFilters(dataset.events, filters).filter((event) =>
    event.entityIds.some((id) => activeEntityIds.has(id)),
  );

  const applyDates = () => {
    setFilters({
      ...filters,
      from: /^\d{4}-\d{2}-\d{2}$/.test(fromDraft) ? fromDraft : undefined,
      to: /^\d{4}-\d{2}-\d{2}$/.test(toDraft) ? toDraft : undefined,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'} onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>筛选</Text>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>路线主体</Text>
            <Text style={styles.count}>{filtered.length} / {dataset.events.length}</Text>
          </View>
          {entities.map((entity) => {
            const active = activeEntityIds.has(entity.id);
            return (
              <Pressable
                key={entity.id}
                style={styles.entityRow}
                onPress={() => toggleEntity(entity.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <View
                  style={[
                    styles.entityDot,
                    { backgroundColor: entity.color, opacity: active ? 1 : 0.3 },
                  ]}
                />
                <Text style={[styles.entityName, !active && styles.dim]}>
                  {resolveLocalized(entity.name)}
                </Text>
                <Text style={styles.check}>{active ? '✓' : ''}</Text>
              </Pressable>
            );
          })}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>事件类型</Text>
          <View style={styles.chips}>
            {categories.map((category) => {
              const active = filters.categories.includes(category);
              return (
                <Pressable
                  key={category}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleCategory(category)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>时间段</Text>
          <View style={styles.dateRow}>
            <TextInput
              value={fromDraft}
              onChangeText={setFromDraft}
              onEndEditing={applyDates}
              placeholder="开始 YYYY-MM-DD"
              placeholderTextColor={colors.inkSoft + '66'}
              style={styles.dateInput}
              keyboardType="numbers-and-punctuation"
            />
            <TextInput
              value={toDraft}
              onChangeText={setToDraft}
              onEndEditing={applyDates}
              placeholder="结束 YYYY-MM-DD"
              placeholderTextColor={colors.inkSoft + '66'}
              style={styles.dateInput}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <Text style={styles.hint}>与时间轴叠加：只显示已发生且符合条件的事件。</Text>

          <Pressable
            style={styles.reset}
            onPress={() => {
              resetFilters();
              setFromDraft('');
              setToDraft('');
            }}
          >
            <Text style={styles.resetText}>重置筛选</Text>
          </Pressable>
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
  title: { fontSize: 22, fontWeight: '700', color: colors.ink },
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 12, letterSpacing: 2, color: colors.inkSoft, opacity: 0.8 },
  count: { fontSize: 11, color: colors.inkSoft },
  entityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 8,
  },
  entityDot: { width: 10, height: 10, borderRadius: 5 },
  entityName: { flex: 1, fontSize: 14, color: colors.ink },
  dim: { opacity: 0.4 },
  check: { fontSize: 13, color: colors.cinnabar },
  divider: { height: 1, backgroundColor: colors.ink + '12', marginVertical: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.ink + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.cinnabar + '16', borderColor: colors.cinnabar + '66' },
  chipText: { fontSize: 12, color: colors.inkSoft },
  chipTextActive: { color: colors.cinnabar },
  dateRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.inkSoft,
    backgroundColor: colors.white,
  },
  hint: { fontSize: 11, lineHeight: 17, color: colors.inkSoft, opacity: 0.7, marginTop: spacing.sm },
  reset: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.ink + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetText: { fontSize: 12, color: colors.inkSoft },
});
