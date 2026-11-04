import { resolveLocalized, tagLabel } from '@atlas/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DATA_BASE } from '../data/client';
import type { RootStackParamList } from '../navigation/types';
import { useAtlasStore } from '../stores/useAtlasStore';
import { colors, radii, spacing } from '../theme';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

export function GalleryScreen({ navigation }: Props) {
  const index = useAtlasStore((state) => state.index);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadIndex = useAtlasStore((state) => state.loadIndex);
  const { locale, t } = useI18n();

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <FlatList
        data={index ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
              <LanguageToggle />
            </View>
            <Text style={styles.title}>{t('app.title')}</Text>
            <Text style={styles.subtitle}>{t('app.tagline')}</Text>
            <Pressable
              style={styles.searchButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.searchButtonText}>{t('gallery.searchEvents')}</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>{t('gallery.subtitle')}</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.cinnabar} style={styles.loading} />
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>{t('gallery.errorTitle')}</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retry} onPress={() => void loadIndex()}>
                <Text style={styles.retryText}>{t('nav.retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.empty}>{t('gallery.empty')}</Text>
          )
        }
        renderItem={({ item }) => {
          const title = resolveLocalized(item.title, locale);
          return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('Atlas', { atlasId: item.id })}
            >
              {item.cover ? (
                <Image
                  source={{ uri: `${DATA_BASE}/${item.cover}` }}
                  style={styles.cover}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cover, styles.coverFallback]}>
                  <Text style={styles.coverFallbackText}>{title.slice(0, 1)}</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{title}</Text>
                  <Text style={styles.cardYears}>
                    {item.timeRange.start.slice(0, 4)} — {item.timeRange.end.slice(0, 4)}
                  </Text>
                </View>
                {item.subtitle ? (
                  <Text style={styles.cardSubtitle}>{resolveLocalized(item.subtitle, locale)}</Text>
                ) : null}
                <View style={styles.tags}>
                  {(item.tags ?? []).map((tag) => (
                    <Text key={tag} style={styles.tag}>
                      {tagLabel(tag, locale)}
                    </Text>
                  ))}
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  list: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontSize: 10, letterSpacing: 3, color: colors.cinnabar, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 14, lineHeight: 22, color: colors.inkSoft },
  searchButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.ink + '22',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginTop: spacing.sm,
  },
  searchButtonText: { color: colors.inkSoft, fontSize: 13 },
  sectionTitle: {
    marginTop: spacing.lg,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: 2,
  },
  loading: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.inkSoft, marginTop: spacing.xl },
  errorBox: { padding: spacing.lg, borderWidth: 1, borderColor: colors.cinnabar + '44', borderRadius: radii.md },
  errorTitle: { color: colors.cinnabar, fontSize: 16, fontWeight: '600' },
  errorText: { color: colors.inkSoft, fontSize: 13, marginTop: spacing.sm },
  retry: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.cinnabar,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  retryText: { color: colors.parchment, fontSize: 13 },
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink + '14',
  },
  cover: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.parchmentDeep },
  coverFallback: { alignItems: 'center', justifyContent: 'center' },
  coverFallbackText: { fontSize: 48, color: colors.inkSoft, opacity: 0.3 },
  cardBody: { padding: spacing.lg, gap: spacing.sm },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: 24, fontWeight: '700', color: colors.ink },
  cardYears: { fontSize: 12, color: colors.inkSoft },
  cardSubtitle: { fontSize: 13, color: colors.inkSoft },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tag: {
    fontSize: 11,
    color: colors.inkSoft,
    backgroundColor: colors.parchmentDeep,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
});
