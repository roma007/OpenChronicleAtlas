import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '史迹',
  slug: config.slug ?? 'openchronicle-atlas',
  version: '1.0.2',
  scheme: 'atlas',
  ios: {
    ...config.ios,
    supportsTablet: true,
    buildNumber: '10002',
    bundleIdentifier: 'com.openchronicle.atlas',
    appleTeamId: 'R2TCRBA6NZ',
    infoPlist: {
      NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      LSMinimumSystemVersion: '16.4',
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    ...config.android,
    package: 'com.openchronicle.atlas',
    versionCode: 10002,
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
