import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpoGaodeMapModule } from 'expo-gaode-map';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Linking as RNLinking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AtlasScreen } from './screens/AtlasScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { SearchScreen } from './screens/SearchScreen';
import { colors, radii, spacing } from './theme';
import { LanguageToggle } from './components/common/LanguageToggle';
import { useI18n } from './hooks/useI18n';
import { useAtlasStore } from './stores/useAtlasStore';
import type { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function parseDeepLink(url: string): { atlasId: string; t?: string; event?: string } | null {
  try {
    const parsed = Linking.parse(url);
    const path = parsed.path ?? '';
    const match = /^atlas\/([a-z0-9-]+)$/.exec(path);
    if (!match) return null;
    const query = parsed.queryParams ?? {};
    return {
      atlasId: match[1]!,
      t: typeof query.t === 'string' ? query.t : undefined,
      event: typeof query.event === 'string' ? query.event : undefined,
    };
  } catch {
    return null;
  }
}

export default function App() {
  const [privacyReady, setPrivacyReady] = useState(false);
  const { t } = useI18n();
  const hydrateLocale = useAtlasStore((state) => state.hydrateLocale);

  useEffect(() => {
    void hydrateLocale();
  }, [hydrateLocale]);

  useEffect(() => {
    try {
      const status = ExpoGaodeMapModule.getPrivacyStatus();
      if (status.hasAgree && status.isReady) setPrivacyReady(true);
    } catch {
      // 模块不可用时仍允许进入应用，地图页会显示错误
      setPrivacyReady(true);
    }
  }, []);

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      const target = parseDeepLink(url);
      if (!target || !navigationRef.isReady()) return;
      navigationRef.navigate('Atlas', target);
    };

    void Linking.getInitialURL().then(handleUrl);
    const subscription = Linking.addEventListener('url', (event) => handleUrl(event.url));
    return () => subscription.remove();
  }, []);

  const agreePrivacy = () => {
    try {
      ExpoGaodeMapModule.setPrivacyConfig({
        hasShow: true,
        hasContainsPrivacy: true,
        hasAgree: true,
        privacyVersion: '1',
      });
    } catch {
      // 忽略：地图页会提示模块错误
    }
    setPrivacyReady(true);
  };

  if (!privacyReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.privacyContent}>
            <View style={styles.privacyHeader}>
              <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
              <LanguageToggle />
            </View>
            <Text style={styles.title}>{t('consent.title')}</Text>
            <Text style={styles.paragraph}>{t('consent.body1')}</Text>
            <Text style={styles.paragraph}>{t('consent.body2')}</Text>
            <Pressable
              onPress={() => {
                void RNLinking.openURL('https://lbs.amap.com/pages/privacy/');
              }}
            >
              <Text style={styles.link}>{t('consent.amapPolicy')}</Text>
            </Pressable>
            {process.env.EXPO_PUBLIC_PRIVACY_URL ? (
              <Pressable
                onPress={() => {
                  void RNLinking.openURL(process.env.EXPO_PUBLIC_PRIVACY_URL!);
                }}
              >
                <Text style={styles.link}>{t('consent.ourPolicy')}</Text>
              </Pressable>
            ) : null}
            <Pressable style={styles.primaryButton} onPress={agreePrivacy}>
              <Text style={styles.primaryButtonText}>{t('consent.agree')}</Text>
            </Pressable>
            <Text style={styles.note}>{t('consent.rejectNote')}</Text>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="Atlas" component={AtlasScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  privacyContent: { padding: spacing.xl, gap: spacing.md },
  privacyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontSize: 11, letterSpacing: 4, color: colors.cinnabar, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '700', color: colors.ink, marginTop: spacing.sm },
  paragraph: { fontSize: 14, lineHeight: 23, color: colors.inkSoft },
  link: { fontSize: 14, color: colors.cinnabar, textDecorationLine: 'underline' },
  primaryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.cinnabar,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.parchment, fontSize: 15, fontWeight: '600' },
  note: { fontSize: 12, color: colors.inkSoft, opacity: 0.7 },
});
