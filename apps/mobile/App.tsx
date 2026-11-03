import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.kicker}>OPENCHRONICLE ATLAS</Text>
        <Text style={styles.title}>史迹 · 时空地图</Text>
        <Text style={styles.subtitle}>移动端骨架（M1）</Text>
        <Text style={styles.note}>
          地图、时间轴与事件详情将在 M4 接入高德地图 SDK。{'\n'}
          当前工程仅用于验证 monorepo、Expo 配置与双端包名。
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3ead9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 12,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 4,
    color: '#8c2f24',
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#231c15',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a3d30',
  },
  note: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 22,
    color: '#6b5a48',
  },
});
