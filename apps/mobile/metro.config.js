const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// 强制 Metro 把 apps/mobile 当作项目根，不从 monorepo 根解析入口文件。
config.unstable_projectRoot = projectRoot;

// 内置专题数据包含 .geojson；按 JSON 源码解析，而不是当作静态资源。
config.resolver.sourceExts.push('geojson');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'geojson');
config.transformer.babelTransformerPath = require.resolve('./metro.transformer.js');

module.exports = config;
