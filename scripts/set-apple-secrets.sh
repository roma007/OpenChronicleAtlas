#!/usr/bin/env bash
# 上传 Apple 签名材料到 GitHub Actions Secrets。
# 用法：
#   bash scripts/set-apple-secrets.sh /path/to/distribution.p12 /path/to/profile.mobileprovision
# 需要先 gh auth login。
set -euo pipefail

REPO="${GITHUB_REPO:-roma007/OpenChronicleAtlas}"
BUNDLE_ID="${APPLE_BUNDLE_ID:-com.openchronicle.atlas}"

if [ "$#" -ne 2 ]; then
  echo "用法: bash scripts/set-apple-secrets.sh <distribution.p12> <profile.mobileprovision>" >&2
  exit 1
fi

P12="$1"
PROFILE="$2"

if [ ! -f "$P12" ] || [ ! -f "$PROFILE" ]; then
  echo "证书或描述文件不存在" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "未安装 GitHub CLI：brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "请先执行：gh auth login" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

security cms -D -i "$PROFILE" > "$TMP_DIR/profile.plist" 2>/dev/null
PROFILE_NAME="$(plutil -extract Name raw -o - "$TMP_DIR/profile.plist")"
TEAM_ID="$(plutil -extract TeamIdentifier.0 raw -o - "$TMP_DIR/profile.plist")"
APP_ID="$(plutil -extract Entitlements.application-identifier raw -o - "$TMP_DIR/profile.plist" 2>/dev/null || true)"

echo "描述文件: $PROFILE_NAME"
echo "Team ID:  $TEAM_ID"
echo "App ID:   ${APP_ID:-未知}"

if [ -n "$APP_ID" ] && [ "$APP_ID" != "$TEAM_ID.$BUNDLE_ID" ]; then
  echo "⚠️  App ID 与 $BUNDLE_ID 不一致，请确认描述文件" >&2
fi

read -rsp "输入 .p12 导出密码: " P12_PASSWORD
echo

gh secret set APPLE_TEAM_ID --repo "$REPO" --body "$TEAM_ID" >/dev/null
gh secret set APPLE_PROVISIONING_PROFILE_NAME --repo "$REPO" --body "$PROFILE_NAME" >/dev/null
gh secret set APPLE_CERTIFICATE_PASSWORD --repo "$REPO" --body "$P12_PASSWORD" >/dev/null
gh secret set APPLE_CERTIFICATE_BASE64 --repo "$REPO" \
  --body "$(base64 < "$P12" | tr -d '\n')" >/dev/null
gh secret set APPLE_PROVISIONING_PROFILE_BASE64 --repo "$REPO" \
  --body "$(base64 < "$PROFILE" | tr -d '\n')" >/dev/null

echo "已上传："
echo "  APPLE_TEAM_ID"
echo "  APPLE_CERTIFICATE_BASE64"
echo "  APPLE_CERTIFICATE_PASSWORD"
echo "  APPLE_PROVISIONING_PROFILE_BASE64"
echo "  APPLE_PROVISIONING_PROFILE_NAME"
