import { Pressable, StyleSheet, Text } from 'react-native';
import { useI18n } from '../../hooks/useI18n';
import { colors, radii, spacing } from '../../theme';

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const next = locale === 'zh' ? 'en' : 'zh';

  return (
    <Pressable
      onPress={() => setLocale(next)}
      accessibilityRole="button"
      accessibilityLabel={t('language.toggle')}
      style={styles.button}
    >
      <Text style={[styles.text, locale === 'zh' && styles.active]}>中文</Text>
      <Text style={styles.separator}>/</Text>
      <Text style={[styles.text, locale === 'en' && styles.active]}>EN</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  text: { fontSize: 10, color: colors.inkSoft },
  active: { color: colors.cinnabar, fontWeight: '700' },
  separator: { fontSize: 10, color: colors.inkSoft + '55' },
});
