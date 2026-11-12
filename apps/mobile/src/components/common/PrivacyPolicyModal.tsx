import * as Linking from 'expo-linking';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIVACY_SECTIONS } from '../../config';
import { useI18n } from '../../hooks/useI18n';
import { colors, radii, spacing } from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** App 内隐私政策（离线可读，不依赖外部域名）。 */
export function PrivacyPolicyModal({ visible, onClose }: Props) {
  const { t } = useI18n();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.link}>{t('privacy.back')}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{t('privacy.title')}</Text>
          <Text style={styles.note}>{t('privacy.updated')}</Text>
          {PRIVACY_SECTIONS.map(([title, body]) => (
            <View key={title} style={styles.section}>
              <Text style={styles.sectionTitle}>{t(title)}</Text>
              <Text style={styles.paragraph}>{t(body)}</Text>
            </View>
          ))}
          <Pressable
            onPress={() => {
              void Linking.openURL('https://lbs.amap.com/pages/privacy/');
            }}
          >
            <Text style={styles.link}>{t('privacy.amapPolicy')}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t('privacy.back')}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  content: { padding: spacing.xl, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontSize: 11, letterSpacing: 4, color: colors.cinnabar, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '700', color: colors.ink, marginTop: spacing.sm },
  note: { fontSize: 12, color: colors.inkSoft, opacity: 0.7 },
  section: { gap: spacing.xs },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  paragraph: { fontSize: 14, lineHeight: 23, color: colors.inkSoft },
  link: { fontSize: 14, color: colors.cinnabar, textDecorationLine: 'underline' },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.cinnabar,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  buttonText: { color: colors.parchment, fontSize: 15, fontWeight: '600' },
});
