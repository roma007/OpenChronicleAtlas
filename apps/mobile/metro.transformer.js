const path = require('node:path');

/**
 * Metro 默认不认识 .geojson，这里把它转成 CommonJS 模块后再交给 Expo 的
 * babel transformer（Expo 的 transform worker 需要 AST，直接返回 code 不够）。
 * 其他扩展名仍原样交给 Expo。
 */
function resolveUpstreamTransformer() {
  const expoPackage = require.resolve('expo/package.json');
  return require.resolve('@expo/metro-config/build/babel-transformer', {
    paths: [path.dirname(expoPackage)],
  });
}

const upstream = require(resolveUpstreamTransformer());

module.exports.transform = function transform(args) {
  if (args.filename.endsWith('.geojson')) {
    const json = JSON.parse(args.src);
    return upstream.transform({
      ...args,
      src: `module.exports = ${JSON.stringify(json)};`,
    });
  }
  return upstream.transform(args);
};

module.exports.getCacheKey = upstream.getCacheKey;
