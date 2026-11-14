#!/usr/bin/env bash
# Atlas Web 静态站发布 —— AGENTS.md 第 7 节的可执行版本
#
#   pnpm deploy              # 正式发布
#   pnpm deploy --dry-run    # 只打印将执行的动作
#   pnpm deploy --ack-open   # 已知 /srv/ops 有给 atlas 的请求，仍然发布
#   pnpm deploy --skip-checks# 跳过 typecheck/lint（不建议）
#
# 设计与红线见 AGENTS.md 第 6、7、8 节。改流程时：先改本脚本，再改那一节。
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

HOST="${OPS_SSH_HOST:-quizgo}"
DRY=0
ACK_OPEN=0
SKIP_CHECKS=0

for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY=1 ;;
    --ack-open)    ACK_OPEN=1 ;;
    --skip-checks) SKIP_CHECKS=1 ;;
    -h|--help)     sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "未知参数：$arg" >&2; exit 2 ;;
  esac
done

run() {
  if [ "$DRY" = 1 ]; then
    printf '[dry-run] %s\n' "$*"
  else
    eval "$@"
  fi
}

fail() {
  echo "❌ $*" >&2
  exit 2
}

echo "== 0. 工作区 =="
if [ -n "$(git status --porcelain)" ]; then
  git status --porcelain | sed 's/^/  /' >&2
  fail "工作区不干净。发布必须对应一个 commit：About 页的版本来自构建那一刻的 package.json。"
fi
echo "  ✅ 干净，HEAD=$(git rev-parse --short HEAD)  version=$(node -p "require('./package.json').version")"

echo
echo "== 1. /srv/ops 待办 =="
inbox="$(ssh -o BatchMode=yes -o ConnectTimeout=5 "$HOST" "/srv/ops/bin/inbox.sh atlas" 2>/dev/null || true)"
if [ -z "$inbox" ]; then
  echo "  （连不上 $HOST，跳过）"
else
  printf '%s\n' "$inbox" | sed 's/^/  /'
  if printf '%s' "$inbox" | grep -q '⬜'; then
    if [ "$ACK_OPEN" = 1 ]; then
      echo "  ↷ 已用 --ack-open 放行（请确认这些请求与本次发布无关）"
    else
      fail "有发给 atlas 的未处理请求。处理完再发布，或确认无关后加 --ack-open。"
    fi
  fi
fi

echo
echo "== 2. 共享面漂移 =="
status="$(ssh -o BatchMode=yes -o ConnectTimeout=5 "$HOST" "/srv/ops/bin/status.sh" 2>/dev/null || true)"
if [ -z "$status" ]; then
  echo "  （连不上 $HOST，跳过）"
else
  printf '%s\n' "$status" | sed -n '/漂移检测/,/待处理请求/p' | sed '$d' | sed 's/^/  /'
  if printf '%s' "$status" | grep -q '⚠️'; then
    fail "存在漂移告警。先弄清谁改了服务器（看 /srv/ops/journal），再发布。"
  fi
fi

if [ "$SKIP_CHECKS" = 0 ]; then
  echo
  echo "== 3. 前置检查 =="
  run pnpm -s check:versions
  run pnpm -s build:mobile-data --check
  run pnpm -s validate:data
fi

echo
echo "== 4. 构建 =="
run pnpm -s build
if [ "$DRY" = 0 ]; then
  # build:search-index 会重写 generatedAt，属于构建副产物，还原成提交里的版本
  git checkout -- data/atlases/search-index.json 2>/dev/null || true
fi

echo
echo "== 5. 回滚点 =="
run "ssh -o BatchMode=yes $HOST 'sudo rm -rf /srv/atlas.prev && sudo cp -a /srv/atlas /srv/atlas.prev && test -f /srv/atlas.prev/index.html && echo \"  回滚点 OK\"'"

echo
echo "== 6. 同步 =="
run "rsync -az --delete apps/web/dist/ $HOST:/srv/atlas/"

echo
echo "== 7. 自检 =="
if [ "$DRY" = 1 ]; then
  echo "  [dry-run] 跳过"
else
  ok=1
  for path in "/" "/search" "/atlas/three-kingdoms"; do
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://quizgo-ecs:8081$path" || echo 000)"
    printf '  %-24s %s\n' "$path" "$code"
    [ "$code" = "200" ] || ok=0
  done
  cc="$(curl -sI http://quizgo-ecs:8081/sw.js | grep -i '^cache-control' | tr -d '\r' || true)"
  printf '  %-24s %s\n' "/sw.js" "${cc:-<无>}"
  printf '%s' "$cc" | grep -qi 'no-cache' || ok=0
  [ "$ok" = 1 ] || fail "自检未通过。回滚：ssh $HOST 'sudo rsync -a --delete /srv/atlas.prev/ /srv/atlas/'"
fi

echo
echo "== 8. 登记 =="
if [ "$DRY" = 1 ]; then
  echo "  [dry-run] 跳过"
else
  INDEX_MD5="$(python3 -c "import hashlib;print(hashlib.md5(open('apps/web/dist/index.html','rb').read()).hexdigest())")"
  EVENTS="$(python3 -c "import json;print(len(json.load(open('apps/web/dist/data/atlases/search-index.json'))['entries']))" 2>/dev/null ||
            python3 -c "import json;print(len(json.load(open('data/atlases/search-index.json'))['entries']))")"
  VERSION="$(node -p "require('./package.json').version")"
  COMMIT="$(git rev-parse HEAD)"
  NOW="$(date '+%Y-%m-%dT%H:%M:%S%z')"

  ssh -o BatchMode=yes "$HOST" "cat > /srv/ops/state/atlas.json" <<JSON
{
  "project": "atlas",
  "updatedAt": "$NOW",
  "updatedBy": "atlas-ai",
  "release": { "version": "$VERSION", "commit": "$COMMIT" },
  "verify": { "indexMd5": "$INDEX_MD5", "events": $EVENTS }
}
JSON
  ssh -o BatchMode=yes "$HOST" "echo '$NOW [atlas]  deploy  | atlas $VERSION -> /srv/atlas | $EVENTS events | self-check ok' >> /srv/ops/journal/\$(date +%Y-%m).log"
  echo "  已登记 state/atlas.json（$VERSION / $EVENTS events）并写入 journal"
fi

echo
echo "== 9. 收尾校验 =="
if [ "$DRY" = 1 ]; then
  echo "  [dry-run] 跳过"
else
  status2="$(ssh -o BatchMode=yes -o ConnectTimeout=5 "$HOST" "/srv/ops/bin/status.sh" 2>/dev/null || true)"
  printf '%s\n' "$status2" | sed -n '/漂移检测/,/待处理请求/p' | sed '$d' | sed 's/^/  /'
  if printf '%s' "$status2" | grep -q '⚠️'; then
    fail "登记后仍有漂移，请检查 state/atlas.json 是否与实际一致。"
  fi
fi

echo
if [ "$DRY" = 1 ]; then
  echo "✅ 演练完成：未构建、未备份、未同步、未登记"
else
  echo "✅ 发布完成：$(node -p "require('./package.json').version")"
fi
