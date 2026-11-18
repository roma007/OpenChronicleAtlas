import { resolveLocalized, type AtlasCoverText } from '@atlas/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resolveDataImage } from '../data/client';
import type { RootStackParamList } from '../navigation/types';
import { useAtlasStore } from '../stores/useAtlasStore';
import { colors, radii, spacing } from '../theme';
import { AboutModal } from '../components/common/AboutModal';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { PrivacyPolicyModal } from '../components/common/PrivacyPolicyModal';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

/** 封面副文字（年代）统一放大 130%。 */
const SUB_SCALE = 1.3;


function CoverOverlay({
  coverText,
  title,
  width,
}: {
  coverText: AtlasCoverText;
  title: string;
  width: number;
}) {
  const unit = width / 100;
  const size = (ratio: number, min: number, max: number) =>
    Math.max(min, Math.min(max, unit * ratio));
  const shadow = {
    textShadowColor: 'rgba(243,234,217,0.9)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 1 },
  };

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {[0.7, 0.68, 0.62, 0.48, 0.25, 0.07].map((opacity, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${index * 12}%`,
            width: '12.5%',
            backgroundColor: colors.parchment,
            opacity,
          }}
        />
      ))}

      <View
        style={{
          position: 'absolute',
          left: unit * 6.9,
          right: unit * 14,
          top: unit * 8.6,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: size(8.6, 22, 40),
            color: colors.ink,
            ...shadow,
            fontWeight: '700',
          }}
        >
          {title}
        </Text>
        {coverText.years ? (
          <Text
            style={{
              marginTop: unit * 1.8 * SUB_SCALE,
              fontSize: size(2.5, 10, 15) * SUB_SCALE,
              color: colors.inkSoft,
              fontWeight: '600',
              ...shadow,
              letterSpacing: unit * 0.14,
            }}
          >
            {coverText.years}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function GalleryScreen({ navigation }: Props) {
  const index = useAtlasStore((state) => state.index);
  const loading = useAtlasStore((state) => state.loading);
  const error = useAtlasStore((state) => state.error);
  const loadIndex = useAtlasStore((state) => state.loadIndex);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const fromCache = useAtlasStore((state) => state.fromCache);
  const clearCache = useAtlasStore((state) => state.clearCache);
  const dataUpdateAvailable = useAtlasStore((state) => state.dataUpdateAvailable);
  const checkDataUpdate = useAtlasStore((state) => state.checkDataUpdate);
  const applyDataUpdate = useAtlasStore((state) => state.applyDataUpdate);
  const { locale, t } = useI18n();
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 3 : width >= 680 ? 2 : 1;
  const cardWidth =
    (width - spacing.lg * 2 - spacing.lg * (columns - 1)) / columns;
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    void loadIndex().then(() => checkDataUpdate());
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkDataUpdate();
    });
    return () => subscription.remove();
  }, [loadIndex, checkDataUpdate]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <FlatList
        key={`gallery-${columns}`}
        data={index ?? []}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.gridRow : undefined}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
              <LanguageToggle />
            </View>
            <Text style={styles.title}>{t('app.title')}</Text>
            {fromCache ? (
              <View style={styles.cacheBadge}>
                <Text style={styles.cacheBadgeText}>{t('offline.cacheBadge')}</Text>
              </View>
            ) : null}
            {dataUpdateAvailable ? (
              <View style={styles.updateBanner}>
                <Text style={styles.updateText}>{t('dataUpdate.available')}</Text>
                <Pressable
                  style={styles.updateButton}
                  onPress={() => void applyDataUpdate()}
                >
                  <Text style={styles.updateButtonText}>{t('dataUpdate.refresh')}</Text>
                </Pressable>
              </View>
            ) : null}
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
        ListFooterComponent={
          index && index.length > 0 ? (
            <View style={styles.cacheFooter}>
              <Pressable
                style={styles.cacheButton}
                onPress={() => {
                  Alert.alert(t('cache.clear'), t('cache.clearConfirm'), [
                    { text: t('cache.cancel'), style: 'cancel' },
                    {
                      text: t('cache.clear'),
                      style: 'destructive',
                      onPress: () => {
                        void clearCache().then(() => setCleared(true));
                      },
                    },
                  ]);
                }}
              >
                <Text style={styles.cacheButtonText}>
                  {cleared ? t('cache.cleared') : t('cache.clear')}
                </Text>
              </Pressable>
              <Text style={styles.cacheHint}>{t('cache.clearHint')}</Text>
              <View style={styles.footerLinks}>
                <Pressable style={styles.privacyLink} onPress={() => setPrivacyOpen(true)}>
                  <Text style={styles.privacyLinkText}>{t('privacy.title')}</Text>
                </Pressable>
                <Pressable style={styles.privacyLink} onPress={() => setAboutOpen(true)}>
                  <Text style={styles.privacyLinkText}>{t('about.title')}</Text>
                </Pressable>
              </View>
            </View>
          ) : undefined
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
          const coverSource = resolveDataImage(item.cover);
          return (
            <Pressable
              style={[styles.card, columns > 1 && styles.cardGrid]}
              accessibilityRole="button"
              accessibilityLabel={`${title} · ${t('card.aiCover')}`}
              onPress={() => navigation.navigate('Atlas', { atlasId: item.id })}
            >
              <View style={styles.coverWrap}>
                {coverSource ? (
                  <Image source={coverSource} style={styles.cover} resizeMode="cover" />
                ) : (
                  <View style={[styles.cover, styles.coverFallback]}>
                    <Text style={styles.coverFallbackText}>{title.slice(0, 1)}</Text>
                  </View>
                )}
                {item.coverText ? (
                  <CoverOverlay
                    coverText={item.coverText}
                    title={title}
                    width={cardWidth}
                  />
                ) : null}
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>{t('card.aiCover')}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      <PrivacyPolicyModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <AboutModal visible={aboutOpen} onClose={() => setAboutOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  list: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  gridRow: { gap: spacing.lg },
  cardGrid: { flex: 1, minWidth: 0 },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cacheBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ochre + '22',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cacheBadgeText: { fontSize: 10, color: colors.inkSoft },
  updateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.cinnabar + '12',
    borderRadius: radii.md,
    padding: spacing.md,
  },
  updateText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.inkSoft },
  updateButton: {
    backgroundColor: colors.cinnabar,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  updateButtonText: { color: colors.parchment, fontSize: 12, fontWeight: '600' },
  cacheFooter: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md },
  footerLinks: { flexDirection: 'row', gap: spacing.lg },
  privacyLink: { paddingTop: spacing.sm },
  privacyLinkText: { fontSize: 12, color: colors.cinnabar, textDecorationLine: 'underline' },
  cacheButton: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  cacheButtonText: { fontSize: 11, color: colors.inkSoft },
  cacheHint: { fontSize: 10, color: colors.inkSoft, opacity: 0.6, textAlign: 'center' },
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
  coverWrap: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', backgroundColor: colors.parchmentDeep },
  cover: { width: '100%', height: '100%' },
  aiBadge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: colors.ink + 'A6',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  aiBadgeText: { fontSize: 10, color: colors.parchment, fontWeight: '600' },
  coverFallback: { alignItems: 'center', justifyContent: 'center' },
  coverFallbackText: { fontSize: 48, color: colors.inkSoft, opacity: 0.3 },
});
