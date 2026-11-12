const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 内置专题数据包含 .geojson；按 JSON 源码解析，而不是当作静态资源。
config.resolver.sourceExts.push('geojson');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'geojson');
config.transformer.babelTransformerPath = require.resolve('./metro.transformer.js');

module.exports = config;
