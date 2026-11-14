const { withXcodeProject } = require('expo/config-plugins');

/**
 * 在 Xcode Archive 时自动把 RN / ReactNativeDependencies / hermesvm 的 dSYM
 * 复制进 archive 的 dSYMs 目录，避免 Organizer 上传时出现 Upload Symbols Failed。
 *
 * 前提：先运行过一次 `bash scripts/ios-dsyms.sh --prepare-only` 准备缓存。
 * 缓存不存在时脚本会跳过，不阻塞构建。
 */
module.exports = function withIosDsyms(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const target = project.pbxTargetByName('app');
    if (!target) return config;

    const phases = project.hash.project.objects.PBXShellScriptBuildPhase ?? {};
    const exists = Object.values(phases).some(
      (phase) => phase && phase.name === 'Inject RN dSYMs',
    );
    if (exists) return config;

    const shellScript = [
      'if [ "${ACTION:-}" = "install" ]; then',
      '  bash "$SRCROOT/../../../scripts/ios-dsyms.sh" --copy-dsym-dir "$DWARF_DSYM_FOLDER_PATH" || true',
      'fi',
    ].join('\n');

    project.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Inject RN dSYMs', target.uuid, {
      shellPath: '/bin/sh',
      shellScript,
    });

    return config;
  });
};
