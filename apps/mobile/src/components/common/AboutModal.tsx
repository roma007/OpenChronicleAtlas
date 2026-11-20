import * as Linking from 'expo-linking';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appJson from '../../../app.json';
import { useI18n } from '../../hooks/useI18n';
import { colors, radii, spacing } from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ATTRIBUTION_URL =
  'https://github.com/roma007/OpenChronicleAtlas/blob/main/data/atlases/ATTRIBUTION.md';
const REPO_URL = 'https://github.com/roma007/OpenChronicleAtlas';

/** App 内「关于」：版本、AI 生成内容说明与来源入口，离线可读。 */
export function AboutModal({ visible, onClose }: Props) {
  const { t } = useI18n();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.link}>{t('about.back')}</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{t('about.title')}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.version')}</Text>
            <Text style={styles.value}>{appJson.expo.version}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('about.aiTitle')}</Text>
            <Text style={styles.paragraph}>{t('about.aiBody')}</Text>
            <Text style={styles.paragraph}>{t('about.aiCovers')}</Text>
            <Text style={styles.paragraph}>{t('about.aiText')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('about.regionsTitle')}</Text>
            <Text style={styles.paragraph}>{t('about.regionsBody')}</Text>
            <Pressable onPress={() => void Linking.openURL(ATTRIBUTION_URL)}>
              <Text style={styles.link}>{t('about.regionsAttribution')}</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('about.sources')}</Text>
            <Pressable onPress={() => void Linking.openURL(ATTRIBUTION_URL)}>
              <Text style={styles.link}>{t('about.aiMore')}</Text>
            </Pressable>
            <Pressable onPress={() => void Linking.openURL(REPO_URL)}>
              <Text style={styles.link}>{t('about.repo')}</Text>
            </Pressable>
          </View>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t('about.back')}</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  label: { fontSize: 13, color: colors.inkSoft, opacity: 0.7 },
  value: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  section: { gap: spacing.xs, marginTop: spacing.sm },
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
