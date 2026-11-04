import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '史迹',
  slug: config.slug ?? 'openchronicle-atlas',
  version: '0.15.0',
  scheme: 'atlas',
  ios: {
    ...config.ios,
    supportsTablet: true,
    bundleIdentifier: 'com.openchronicle.atlas',
    infoPlist: {
      NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
    },
  },
  android: {
    ...config.android,
    package: 'com.openchronicle.atlas',
    versionCode: 12,
    blockedPermissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
  },
  plugins: [
    ['expo-build-properties', { android: { usesCleartextTraffic: true } }],
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
