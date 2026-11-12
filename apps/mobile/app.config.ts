import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '史迹',
  slug: config.slug ?? 'openchronicle-atlas',
  version: '1.0.1',
  scheme: 'atlas',
  ios: {
    ...config.ios,
    supportsTablet: true,
    buildNumber: '10001',
    bundleIdentifier: 'com.openchronicle.atlas',
    infoPlist: {
      NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      LSMinimumSystemVersion: '16.4',
    },
  },
  android: {
    ...config.android,
    package: 'com.openchronicle.atlas',
    versionCode: 10001,
    blockedPermissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
  },
  plugins: [
    './plugins/with-ipad-orientations',
    './plugins/with-android-gradle',
    [
      'expo-build-properties',
      { android: { usesCleartextTraffic: false }, ios: { deploymentTarget: '16.4' } },
    ],
    [
      'expo-gaode-map',
      {
        androidKey: process.env.EXPO_PUBLIC_AMAP_ANDROID_KEY,
        iosKey: process.env.EXPO_PUBLIC_AMAP_IOS_KEY,
        enableLocation: false,
      },
    ],
  ],
});
