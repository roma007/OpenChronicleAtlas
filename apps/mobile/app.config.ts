import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '史迹',
  slug: config.slug ?? 'openchronicle-atlas',
  version: '1.0.28',
  scheme: 'atlas',
  ios: {
    ...config.ios,
    supportsTablet: true,
    buildNumber: '10028',
    bundleIdentifier: 'com.openchronicle.atlas',
    appleTeamId: 'R2TCRBA6NZ',
    infoPlist: {
      NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    ...config.android,
    package: 'com.openchronicle.atlas',
    versionCode: 10028,
    blockedPermissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
  },
  plugins: [
    './plugins/with-remove-macos-plist',
    './plugins/with-ios-dsyms',
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
