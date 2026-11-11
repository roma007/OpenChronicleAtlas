const { withGradleProperties } = require('expo/config-plugins');

/**
 * React Native 0.88 的 react-android AAR 较大，默认 2GB 堆在 Jetifier
 * 阶段容易 OOM。prebuild 时统一提升 Gradle 堆上限。
 */
module.exports = function withAndroidGradle(config) {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;
    const setProperty = (key, value) => {
      const existing = properties.find(
        (item) => item.type === 'property' && item.key === key,
      );
      if (existing) {
        existing.value = value;
      } else {
        properties.push({ type: 'property', key, value });
      }
    };

    setProperty('org.gradle.jvmargs', '-Xmx4096m -XX:MaxMetaspaceSize=1024m');
    return config;
  });
};
