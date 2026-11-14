#!/usr/bin/env bash
# 拉取 /srv/ops 里发给本项目的未处理请求（只读，离线时安静失败）
#
#   pnpm ops:inbox            # 给 atlas 的
#   pnpm ops:inbox quizgo     # 给 quizgo 的
set -uo pipefail

HOST="${OPS_SSH_HOST:-quizgo}"
ME="${1:-atlas}"
TIMEOUT="${OPS_SSH_TIMEOUT:-5}"

if ! command -v ssh >/dev/null 2>&1; then
  echo "  （跳过：没有 ssh）"
  exit 0
fi

out="$(ssh -o BatchMode=yes -o ConnectTimeout="$TIMEOUT" "$HOST" "/srv/ops/bin/inbox.sh $ME" 2>/dev/null || true)"
if [ -z "$out" ]; then
  echo "  （跳过：连不上 $HOST，或 /srv/ops 尚未部署）"
  exit 0
fi
printf '%s\n' "$out"
