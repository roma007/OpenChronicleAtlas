#!/usr/bin/env bash
# 从本地 .env.local 读取高德 Key 并写入 GitHub Actions Secrets。
# 需要先安装 gh 并执行 gh auth login。
set -euo pipefail

REPO="${GITHUB_REPO:-roma007/OpenChronicleAtlas}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v gh >/dev/null 2>&1; then
  echo "未安装 GitHub CLI：brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "请先执行：gh auth login" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
[ -f "$ROOT/apps/web/.env.local" ] && . "$ROOT/apps/web/.env.local"
# shellcheck disable=SC1091
[ -f "$ROOT/apps/mobile/.env.local" ] && . "$ROOT/apps/mobile/.env.local"
set +a

set_secret() {
  local name="$1"
  local value="${2:-}"
  if [ -z "$value" ]; then
    echo "skip $name (empty)"
    return
  fi
  gh secret set "$name" --repo "$REPO" --body "$value" >/dev/null
  echo "set  $name"
}

echo "上传高德 Key 到 $REPO"
set_secret VITE_AMAP_KEY "${VITE_AMAP_KEY:-}"
set_secret VITE_AMAP_SECURITY_CODE "${VITE_AMAP_SECURITY_CODE:-}"
set_secret VITE_AMAP_DESKTOP_KEY "${VITE_AMAP_DESKTOP_KEY:-}"
set_secret VITE_AMAP_DESKTOP_SECURITY_CODE "${VITE_AMAP_DESKTOP_SECURITY_CODE:-}"
set_secret EXPO_PUBLIC_AMAP_ANDROID_KEY "${EXPO_PUBLIC_AMAP_ANDROID_KEY:-}"
set_secret EXPO_PUBLIC_AMAP_IOS_KEY "${EXPO_PUBLIC_AMAP_IOS_KEY:-}"

if [ -n "${VITE_SHARE_BASE_URL:-}" ]; then
  gh variable set SHARE_BASE_URL --repo "$REPO" --body "$VITE_SHARE_BASE_URL" >/dev/null
  echo "set  SHARE_BASE_URL (variable)"
fi

KEYSTORE_PROPS="$HOME/.openchronicle/atlas-keystore.properties"
if [ -f "$KEYSTORE_PROPS" ]; then
  echo "检测到 Android release keystore，上传签名 Secrets"
  set -a
  # shellcheck disable=SC1090
  . "$KEYSTORE_PROPS"
  set +a
  STORE_FILE="${storeFile:-}"
  if [ -n "$STORE_FILE" ] && [ -f "$STORE_FILE" ]; then
    gh secret set ANDROID_KEYSTORE_BASE64 --repo "$REPO" \
      --body "$(base64 < "$STORE_FILE" | tr -d '\n')" >/dev/null
    echo "set  ANDROID_KEYSTORE_BASE64"
    set_secret ANDROID_KEYSTORE_PASSWORD "${storePassword:-}"
    set_secret ANDROID_KEY_ALIAS "${keyAlias:-}"
    set_secret ANDROID_KEY_PASSWORD "${keyPassword:-}"
  else
    echo "skip Android keystore（storeFile 不存在）"
  fi
else
  echo "skip Android keystore（未找到 $KEYSTORE_PROPS）"
fi

echo
echo "iOS 签名 Secrets 需要手动准备："
echo "  APPLE_TEAM_ID / APPLE_CERTIFICATE_BASE64 / APPLE_CERTIFICATE_PASSWORD"
echo "  APPLE_PROVISIONING_PROFILE_BASE64 / APPLE_PROVISIONING_PROFILE_NAME"
