#!/usr/bin/env bash
set -euo pipefail

# 补齐 Expo / React Native 预编译框架缺失的 dSYM。
#
# React Native 0.88 + Expo 58 默认使用预编译的 React.framework、
# ReactNativeDependencies.framework 与 hermesvm.framework，它们不带 dSYM，
# Xcode 上传 App Store 时会提示 Upload Symbols Failed。
#
# 本脚本从 React Native Maven 仓库下载对应版本的官方 dSYM，并按需复制进
# 最新（或指定）的 .xcarchive/dSYMs 目录。
#
# 用法：
#   bash scripts/ios-dsyms.sh                 # 处理最近一次 Archive
#   bash scripts/ios-dsyms.sh --prepare-only  # 只下载/解压，不写 archive
#   bash scripts/ios-dsyms.sh /path/to/app.xcarchive

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_ROOT="${HOME}/Library/Caches/atlas-ios-dsyms"

RN_VERSION="$(node -p "require('${ROOT}/apps/mobile/package.json').dependencies['react-native'].replace(/^[~^]/, '')")"
PODFILE_LOCK="${ROOT}/apps/mobile/ios/Podfile.lock"
if [[ ! -f "${PODFILE_LOCK}" ]]; then
  echo "错误：找不到 ${PODFILE_LOCK}，请先执行 pod install。" >&2
  exit 1
fi
HERMES_VERSION="$(grep -m1 'hermes-engine (' "${PODFILE_LOCK}" | sed -E 's/.*\(([^)]+)\).*/\1/')"
if [[ -z "${HERMES_VERSION}" ]]; then
  echo "错误：无法从 Podfile.lock 读取 hermes-engine 版本。" >&2
  exit 1
fi

DEST="${CACHE_ROOT}/rn-${RN_VERSION}"
EXTRACT="${DEST}/extracted"
mkdir -p "${DEST}" "${EXTRACT}/core" "${EXTRACT}/deps" "${EXTRACT}/hermes"

# Xcode Archive 的 Run Script 阶段调用：只使用已缓存 dSYM，不下载，失败也不阻塞构建。
if [[ "${1:-}" == "--copy-dsym-dir" ]]; then
  DEST_DIR="${2:-}"
  CORE_DSYM="${EXTRACT}/core/ios-arm64/React.framework.dSYM"
  DEPS_DSYM="${EXTRACT}/deps/ios-arm64/ReactNativeDependencies.framework.dSYM"
  HERMES_DSYM="$(find "${EXTRACT}/hermes" -type d -name 'hermesvm.framework.dSYM' | head -1 || true)"
  if [[ -z "${DEST_DIR}" || ! -d "${CORE_DSYM}" || ! -d "${DEPS_DSYM}" || -z "${HERMES_DSYM}" ]]; then
    echo "提示：dSYM 缓存未准备，跳过注入。先运行 bash scripts/ios-dsyms.sh --prepare-only" >&2
    exit 0
  fi
  mkdir -p "${DEST_DIR}"
  rm -rf "${DEST_DIR}/React.framework.dSYM" \
         "${DEST_DIR}/ReactNativeDependencies.framework.dSYM" \
         "${DEST_DIR}/hermesvm.framework.dSYM"
  cp -R "${CORE_DSYM}" "${DEPS_DSYM}" "${HERMES_DSYM}" "${DEST_DIR}/"
  echo "已注入 RN / Hermes dSYM → ${DEST_DIR}"
  exit 0
fi

BASE_RN="https://repo.reactnative.dev/maven2/com/facebook/react/react-native-artifacts/${RN_VERSION}"
BASE_HERMES="https://repo.reactnative.dev/maven2/com/facebook/hermes/hermes-ios/${HERMES_VERSION}"

CORE_TGZ="${DEST}/react-native-artifacts-${RN_VERSION}-reactnative-core-dSYM-release.tar.gz"
DEPS_TGZ="${DEST}/react-native-artifacts-${RN_VERSION}-reactnative-dependencies-dSYM-release.tar.gz"
HERMES_TGZ="${DEST}/hermes-ios-${HERMES_VERSION}-hermes-framework-dSYM-release.tar.gz"

download() {
  local url="$1" file="$2"
  if [[ ! -s "${file}" ]]; then
    echo "下载 $(basename "${file}") ..."
    curl -fL --retry 3 --progress-bar -o "${file}.part" "${url}"
    mv "${file}.part" "${file}"
  fi
}

# 下载体积较大（约 600MB），只在首次运行时发生。
download "${BASE_RN}/$(basename "${CORE_TGZ}")" "${CORE_TGZ}"
download "${BASE_RN}/$(basename "${DEPS_TGZ}")" "${DEPS_TGZ}"
download "${BASE_HERMES}/$(basename "${HERMES_TGZ}")" "${HERMES_TGZ}"

CORE_DSYM="${EXTRACT}/core/ios-arm64/React.framework.dSYM"
DEPS_DSYM="${EXTRACT}/deps/ios-arm64/ReactNativeDependencies.framework.dSYM"

if [[ ! -d "${CORE_DSYM}" ]]; then
  tar -xzf "${CORE_TGZ}" -C "${EXTRACT}/core" ios-arm64/React.framework.dSYM
fi
if [[ ! -d "${DEPS_DSYM}" ]]; then
  tar -xzf "${DEPS_TGZ}" -C "${EXTRACT}/deps" ios-arm64/ReactNativeDependencies.framework.dSYM
fi

if ! find "${EXTRACT}/hermes" -type d -name 'hermesvm.framework.dSYM' | grep -q .; then
  HERMES_MEMBER="$(tar -tzf "${HERMES_TGZ}" | grep -E '(^|/)iphoneos/hermesvm\.framework\.dSYM/$' | head -1)"
  if [[ -z "${HERMES_MEMBER}" ]]; then
    echo "错误：hermes dSYM 包中未找到 iphoneos/hermesvm.framework.dSYM。" >&2
    exit 1
  fi
  tar -xzf "${HERMES_TGZ}" -C "${EXTRACT}/hermes" "${HERMES_MEMBER}"
fi
HERMES_DSYM="$(find "${EXTRACT}/hermes" -type d -name 'hermesvm.framework.dSYM' | head -1)"

if [[ -z "${HERMES_DSYM}" ]]; then
  echo "错误：hermesvm.framework.dSYM 解压失败。" >&2
  exit 1
fi

echo "dSYM 已准备："
dwarfdump --uuid "${CORE_DSYM}" | sed 's/^/  /'
dwarfdump --uuid "${DEPS_DSYM}" | sed 's/^/  /'
dwarfdump --uuid "${HERMES_DSYM}" | sed 's/^/  /'

if [[ "${1:-}" == "--prepare-only" ]]; then
  exit 0
fi

ARCHIVE="${1:-}"
if [[ -z "${ARCHIVE}" ]]; then
  ARCHIVE="$(ls -td "${HOME}"/Library/Developer/Xcode/Archives/*/*.xcarchive 2>/dev/null | head -1 || true)"
fi

if [[ -z "${ARCHIVE}" || ! -d "${ARCHIVE}" ]]; then
  echo "未找到 .xcarchive。dSYM 已缓存，Archive 后重新运行本脚本即可。" >&2
  exit 1
fi

echo "写入 archive：${ARCHIVE}"
mkdir -p "${ARCHIVE}/dSYMs"
rm -rf "${ARCHIVE}/dSYMs/React.framework.dSYM" \
       "${ARCHIVE}/dSYMs/ReactNativeDependencies.framework.dSYM" \
       "${ARCHIVE}/dSYMs/hermesvm.framework.dSYM"
cp -R "${CORE_DSYM}" "${ARCHIVE}/dSYMs/"
cp -R "${DEPS_DSYM}" "${ARCHIVE}/dSYMs/"
cp -R "${HERMES_DSYM}" "${ARCHIVE}/dSYMs/"

APP="$(find "${ARCHIVE}/Products/Applications" -maxdepth 1 -name '*.app' -type d | head -1 || true)"
if [[ -n "${APP}" ]]; then
  echo "校验 UUID："
  failed=0
  for fw in React ReactNativeDependencies hermesvm; do
    BIN="$(find "${APP}" -path "*/${fw}.framework/${fw}" -type f | head -1 || true)"
    DSYM="${ARCHIVE}/dSYMs/${fw}.framework.dSYM"
    if [[ -z "${BIN}" || ! -d "${DSYM}" ]]; then
      echo "  ⚠️  跳过 ${fw}（archive 中未找到对应 framework）"
      continue
    fi
    BIN_UUID="$(dwarfdump --uuid "${BIN}" | awk '{print $2}' | head -1)"
    DSYM_UUID="$(dwarfdump --uuid "${DSYM}" | awk '{print $2}' | head -1)"
    if [[ "${BIN_UUID}" == "${DSYM_UUID}" ]]; then
      echo "  ✅ ${fw}: ${BIN_UUID}"
    else
      echo "  ❌ ${fw}: framework=${BIN_UUID} dSYM=${DSYM_UUID}"
      failed=1
    fi
  done
  if [[ "${failed}" -ne 0 ]]; then
    echo "dSYM UUID 不匹配，请确认 React Native / Hermes 版本与 archive 一致。" >&2
    exit 1
  fi
fi

echo "完成。现在可以在 Xcode Organizer 中上传该 archive。"
