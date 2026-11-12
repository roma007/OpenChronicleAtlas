const { withInfoPlist } = require('expo/config-plugins');

/**
 * LSMinimumSystemVersion 是 macOS 专用键。
 * Expo 模板会在 iOS Info.plist 中写入默认值 12.0；App Store 上传时若该键为
 * 16.0 ~ 25.x 会被 91164 校验拒绝，因此这里直接移除，仅保留
 * IPHONEOS_DEPLOYMENT_TARGET / MinimumOSVersion 作为 iOS 最低版本。
 */
module.exports = function withRemoveMacosPlist(config) {
  return withInfoPlist(config, (config) => {
    delete config.modResults.LSMinimumSystemVersion;
    return config;
  });
};
