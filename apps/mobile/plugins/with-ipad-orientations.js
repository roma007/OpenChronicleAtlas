const { withInfoPlist } = require('expo/config-plugins');

/**
 * iPhone 保持竖屏，iPad 允许横竖屏与分屏。
 * Expo 的 orientation 配置会同时写入 iPad，因此这里在 prebuild 后覆盖。
 */
module.exports = function withIpadOrientations(config) {
  return withInfoPlist(config, (config) => {
    config.modResults['UISupportedInterfaceOrientations~ipad'] = [
      'UIInterfaceOrientationPortrait',
      'UIInterfaceOrientationPortraitUpsideDown',
      'UIInterfaceOrientationLandscapeLeft',
      'UIInterfaceOrientationLandscapeRight',
    ];
    config.modResults.UIRequiresFullScreen = false;
    return config;
  });
};
