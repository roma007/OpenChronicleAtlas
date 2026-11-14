# Agent 铁律

本文件是自动化开发与发布流程的最高约束。任何提交都必须遵守。

> **本文件由 AI 代理自动加载；`docs/` 下的文件不会。**
> 因此规则、红线、可执行命令写在本文件；推导过程与历史记录放 `docs/`，需要时按下表主动读取：
>
> | 场景 | 必读 |
> | --- | --- |
> | 发布 / 回滚 / 线上更新 | 本文件第 7 节（可执行流程） |
> | 线上环境、临时访问、已知坑 | 本文件第 6 节 |
> | **跨项目协作 / 动共享资源** | **本文件第 8 节** + `ssh quizgo 'cat /srv/ops/CONTRACT.md'` |
> | 设计方案 / 实施计划 | `docs/plans/`、`docs/decisions/` |
> | 变更记录 | `docs/changelog/CHANGELOG.md` |
>
> **跨仓库操作**（涉及服务器上的 OpenQuizGo 服务、nginx、备份）时，
> OpenCode 只会加载当前目录的 AGENTS.md。协作不靠人传话，走服务器上的 `/srv/ops/`（见第 8 节）；
> 需要读对方规约时再主动读 `../OpenQuizGo/AGENTS.md`。

## 1. 版本铁律（由 Git 钩子自动执行）

> 这一节不依赖人记：`.githooks/pre-commit` 在每次提交时自动完成升版与校验。

1. 版本号格式固定 `1.0.X`，每次提交 `X + 1`。
2. **不要手动改版本**。钩子会自动执行 `pnpm version:bump`，更新下列位置并暂存：
   - 根 `package.json`
   - `apps/web/package.json`
   - `apps/mobile/package.json`
   - `packages/shared/package.json`
   - `apps/desktop/package.json`
   - `apps/desktop/src-tauri/Cargo.toml`
   - `apps/desktop/src-tauri/Cargo.lock`
   - `apps/desktop/src-tauri/tauri.conf.json`（`version` 与 `bundle.macOS.bundleVersion`）
   - `apps/mobile/app.json`
   - `apps/mobile/app.config.ts`（`version`、`buildNumber`、`versionCode`）
   - 生成的 `apps/mobile/android/app/build.gradle`
   - 生成的 `apps/mobile/ios/app/Info.plist`
3. 构建号由版本推导，且被 `check:versions` 强校验：`major * 10000 + minor * 100 + patch`。
   - `1.0.0` → `10000`，`1.0.5` → `10005`
   - 构建号领先或落后于版本都会被拒绝提交（防止「构建号 10005、版本 1.0.3」这类漂移）
4. 每次提交都会执行 `pnpm check:versions`，必须输出 `✅ 版本一致`。
5. 首次启用（每个新克隆一次）：`pnpm install` 的 `prepare` 会自动设置
   `core.hooksPath`；没生效时手动 `git config core.hooksPath .githooks` 并确认
   `git config --get core.hooksPath` 输出 `.githooks`。
6. 需要指定版本（例如构建号已领先、要一次补齐）：`pnpm version:bump 1.0.5`。
   钩子检测到已升版就不再自增；版本禁止倒退。
7. 合并 / 变基 / cherry-pick / revert 时钩子自动跳过，不会重复自增。
   `git commit --amend` 补提交时加 `SKIP_VERSION_BUMP=1`，否则会再升一版。
8. 每个提交必须同时暂存 `docs/changelog/CHANGELOG.md`，否则钩子拒绝提交。
   确属例外用 `ALLOW_NO_CHANGELOG=1 git commit ...`。
9. 禁止 `git commit --no-verify`。唯一正当场景是钩子本身故障，且必须在同一次提交里修好。
10. 提交后打 tag 并推送两端：

    ```bash
    V=$(node -p "require('./package.json').version")
    git tag -a "v$V" -m "v$V"
    ```

    Git tag 使用 `v1.0.X`，例如 `v1.0.5`、`v1.0.6`。

## 2. 提交铁律

- 提交信息使用 Conventional Commits：`feat:`、`fix:`、`docs:`、`chore:`、`ci:`。
- 提交必须同时包含版本升级与变更内容，不允许先提交代码再补版本。
- 禁止提交任何密钥、证书、`.env.local`、keystore、provisioning profile。
- 推送同时覆盖 GitHub 与 Gitee；推送后校验两端 `main` 指向同一 commit。

## 3. 发布铁律

- 版本必须是 `1.0.X`，且移动端 `versionCode` / `buildNumber` 必须递增。
- 上架前必须通过：`pnpm typecheck`、`pnpm lint`、`pnpm check:versions`、`pnpm validate:data`。
- GitHub Actions 必须产出对应版本的安装包；tag 推送必须生成 GitHub Release。
- 不跳过任何平台的构建；无法签名的平台必须在发布说明中标注原因。

## 4. 数据铁律

`data/atlases/**` 是唯一数据源：Web、移动端与桌面端共享同一份数据，**禁止在客户端维护副本或独立数据库**。
移动端「内置数据」只是构建时生成的 `require` 清单，不是第二份数据。

1. 任何数据变更（事件、路线、专题、封面、索引）后必须依次执行：

   ```bash
   pnpm validate:data
   pnpm build:search-index
   pnpm build:mobile-data
   ```

2. `pnpm build:search-index` 生成的 `data/atlases/search-index.json`，以及它回写的 `data/atlases/index.json` 中 `dataVersion`，必须一并提交，禁止手改。
3. `pnpm build:mobile-data` 生成的 `apps/mobile/src/generated/atlasData.ts` 必须一并提交，禁止手改；新增或删除文件（`.json` / `.geojson` / `.jpg` / `.png` / `.webp` 封面）时绝不能漏，否则 App 会报「内置数据缺少文件」。
4. 修改专题内容必须同步该专题 `manifest.json` 的 `updatedAt`（`YYYY-MM-DD`，取实际改动日期），否则 `dataVersion` 与客户端数据更新提示不会变化。
5. 封面使用 `1600×900` 位图（`png` 优先）；`.svg` 封面不会进入移动端内置映射，界面会退化为字母占位。
6. 提交前 `pnpm build:mobile-data --check` 必须输出 `✅ 移动端内置数据映射已是最新`。
7. 数据与生成物必须同一次提交，禁止「先提数据、后补索引」。

## 5. 文档铁律

- 每轮对话：`docs/conversations/`
- 计划与方案：`docs/plans/`
- 架构决策：`docs/decisions/`
- 变更记录：`docs/changelog/CHANGELOG.md`
- 发布说明：`docs/releases/`
- 文档与代码同一次提交，不允许事后补文档。

## 6. 线上预览与临时访问（备案前）

> **备案通过前，禁止把 nginx 切到 80/443 对外。** 域名解析已指向公网 IP，
> 一旦在 80/443 上提供服务即属未备案对外，可能被封端口并影响备案审核。

### 环境

| 项 | 值 |
| --- | --- |
| 服务器 | 阿里云 华南3（广州）`ecs.e-c1m1.large` 2C2G / 40G |
| 公网 IP | `8.163.122.39` |
| Tailscale IP | `100.65.110.80`（hostname `quizgo-ecs`） |
| SSH | `ssh quizgo`（走 Tailscale，推荐）；`ssh quizgo-pub`（走公网，出口 IP 变了会失效） |
| Atlas 部署目录 | `/srv/atlas`（nginx 只读挂载） |
| nginx 配置 | `/srv/nginx/conf.d/atlas.conf`（仓库 `OpenQuizGo/deploy/nginx/`） |

### 访问方式（调试通道，不涉及备案）

```bash
open http://quizgo-ecs:8081    # 或 http://100.65.110.80:8081
```

- 访问方需加入同一 tailnet（同账号登录 Tailscale），手机 4G 亦可
- nginx 只放行 `127.0.0.1` 与 `100.64.0.0/10`，其余 403；安全组也未放行 8081，公网无法直连
- 深链（`/atlas/*`、`/search`）由 nginx 做 SPA 回退，可直接访问

### 构建与部署

```bash
# 本地构建（不要在服务器上构建，服务器只有 2G 内存）
pnpm build

# 同步到服务器（静态文件，nginx 只读挂载，无需重启）
rsync -az --delete apps/web/dist/ quizgo:/srv/atlas/
```

部署后自检：

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://quizgo-ecs:8081/
curl -s -o /dev/null -w "%{http_code}\n" http://quizgo-ecs:8081/atlas/<任意专题>
```

### 给非 tailnet 用户临时看效果

| 方式 | 做法 | 说明 |
| --- | --- | --- |
| Tailscale 共享节点（推荐） | Tailscale 后台 → Machines → Share | 只共享 `quizgo-ecs` 一个节点 |
| 临时放开非标端口 | 安全组加 `TCP 8081 → 对方 IP/32` | 非 80/443，一般不涉及备案；用完立即删除 |
| 公网隧道（ngrok / Cloudflare Tunnel） | — | ⚠️ 不推荐，有合规风险 |

### 硬性约束

1. 备案通过前，`atlas.conf` 保持 `listen 8081`，不得改成 80/443
2. 不要把任何密钥、`.env`、证书写入仓库
3. 数据改动仍走 `pnpm validate:data` → `build:search-index` → `build:mobile-data`，生成物一并提交
4. 服务器上的 `/srv/atlas` 是构建产物，**不要**在服务器上改内容，改动一律走仓库 → 构建 → rsync

## 7. 发布与线上更新（Web 静态站）

> 服务器只承载 **Web 静态站**；移动端与桌面端走 GitHub Release，不涉及服务器发布。

### 7.1 什么时候必须更新服务器

判断口诀：**用户能不能看出区别？** 能看出 → 发布；看不出且不涉及安全 → 攒到下次一起发。

| 变更类型 | 是否发布 | 说明 |
| --- | --- | --- |
| 页面 / 交互 / 文案 / 样式 | ✅ 必须 | 用户可见 |
| `data/atlases/**`（事件、专题、封面、路线、索引） | ✅ 必须 | 不发则线上内容不更新 |
| bug 修复、安全修复 | ✅ 必须（安全类立刻发） | |
| 只改文档、注释、测试 | ❌ 不发 | |
| 纯重构且行为不变 | ⏳ 可攒 | 跟下次功能一起发 |
| feature 分支、本地实验 | ❌ 不发 | 未合并不发 |

### 7.2 发布流程（6 步，可停机为零）

```bash
pnpm release                 # 第 6 节的检查 + 备份 + 同步 + 自检 + 登记，一步到底
pnpm release --dry-run       # 只打印将执行的动作
pnpm release --ack-open      # 已知 /srv/ops 有给 atlas 的请求，仍要发布
```

脚本 `scripts/deploy.sh` 就是本节的可执行实现：**改流程先改脚本，再改本节**。
它会在两个地方硬拦：工作区不干净、有未处理的跨项目请求、共享面有漂移告警。

手工执行的等价步骤（仅用于理解，不要替代脚本）：

```bash
# 0. 前置检查（提交前必须通过）
pnpm typecheck && pnpm lint && pnpm validate:data
pnpm check:versions            # 必须输出 ✅ 版本一致

# 1. 数据变了才需要（build 已包含 search-index，但不含移动端数据）
pnpm build:mobile-data

# 2. 先提交，再构建。顺序不能反：
#    钩子在提交时升版，About 页嵌的是构建那一刻的 package.json version，
#    先构建后提交 = 线上显示旧版本号。
#    发布后再提交纯文档改动，线上版本会滞后一档（About 显示的是已发布的构建），属正常。
git add -A && git commit ...

# 3. 构建（本地构建，禁止在服务器构建）
pnpm build

# 4. 保留上一版，便于秒级回滚
#    /srv 属 root，这里必须 sudo；没有回滚点就不要往下走。
ssh quizgo 'sudo rm -rf /srv/atlas.prev && sudo cp -a /srv/atlas /srv/atlas.prev && test -f /srv/atlas.prev/index.html && echo "回滚点 OK"'
#    必须先看到「回滚点 OK」，否则中止发布。

# 5. 同步（--delete 清掉旧 hash 资源；nginx 只读挂载，无需重启）
rsync -az --delete apps/web/dist/ quizgo:/srv/atlas/

# 6. 登记（第 8 节）：写 state + journal，再确认无漂移
ssh quizgo 'cat > /srv/ops/state/atlas.json' <<'JSON'
{
  "project": "atlas",
  "updatedAt": "2026-11-14T18:20:00+08:00",
  "release": { "version": "1.0.7", "commit": "61e7b9b" },
  "verify": { "indexMd5": "<md5 apps/web/dist/index.html>", "events": 719 }
}
JSON
ssh quizgo "echo '$(date '+%Y-%m-%dT%H:%M%z') [atlas] deploy | atlas 1.0.7 | 719 events | ok' >> /srv/ops/journal/\$(date +%Y-%m).log"
ssh quizgo '/srv/ops/bin/status.sh'   # 漂移检测必须全绿
```

### 7.3 发布后自检

```bash
curl -s -o /dev/null -w "首页 %{http_code}\n" http://quizgo-ecs:8081/
curl -s -o /dev/null -w "深链 %{http_code}\n" http://quizgo-ecs:8081/search
curl -s -o /dev/null -w "专题 %{http_code}\n" http://quizgo-ecs:8081/atlas/three-kingdoms
curl -sI http://quizgo-ecs:8081/sw.js | grep -i cache-control   # 应为 no-cache
```

四条全过才算发布成功。PWA 用户刷新即更新（`sw.js` 不缓存），无需额外操作。

### 7.4 回滚

```bash
ssh quizgo 'sudo rsync -a --delete /srv/atlas.prev/ /srv/atlas/'
```

静态站回滚是**秒级且无损**的，这也是必须先备份上一版的原因。

### 7.5 红线

1. 备案通过前，`atlas.conf` 保持 `listen 8081`，**不得**改成 80/443
2. 不在服务器上构建、不直接修改 `/srv/atlas`
3. 不把密钥、证书、`.env` 提交进仓库
4. 数据与生成物必须同一次提交（见第 4 节）

## 8. 与 OpenQuizGo 的跨项目协作

Atlas 与 OpenQuizGo 共用一台 ECS、一个 nginx 容器、一份磁盘。协调**不靠人传话**，
全部走服务器上的 `/srv/ops/`，两个项目的 AI 都能读写。

| 要做什么 | 命令 |
| --- | --- |
| 读契约（归属表 / 四步流程 / 红线） | `ssh quizgo 'cat /srv/ops/CONTRACT.md'` |
| 看有没有人找我 | `pnpm ops:inbox` |
| 看双方真实状态与漂移 | `ssh quizgo '/srv/ops/bin/status.sh'` |
| 要对方做事 | 在 `/srv/ops/requests/` 新建文件，格式见该目录 `README.md` |
| 记一笔 | 追加到 `/srv/ops/journal/YYYY-MM.log` |
| 登记本次发布 | `pnpm release` 自动完成 |

### 必须遵守

1. **开工先看**：任何涉及服务器的任务，先跑一次 `status.sh`，末尾有 `⬜` 就先读请求文件。
2. **改共享面先拿锁**：`/srv/nginx/**` 归两个项目共有，改动前
   `ssh quizgo 'flock /srv/ops/locks/nginx.lock -c "<命令>"'`。拿不到锁说明对方正在动，等。
3. **nginx 容器归 QuizGo**：`quizgo-web-1` 只读，**不得** restart / recreate。
   需要重启（例如备案后切 80/443）走 `requests/` 请对方做。
4. **只写自己的东西**：`state/atlas.json` 只有 Atlas 写，`state/quizgo.json` 只有 QuizGo 写。
5. **发布必登记**：第 7 节第 6 步，写 state + journal，且 `status.sh` 漂移检测全绿才算完成。
6. **漂移告警不许忽略**：`status.sh` 报 drift 说明有改动没登记，先查 journal 再动手。

### 为什么不会漏

「写进 AGENTS.md 要求自己记得」不可靠。所以把「读」挂到三条**自动会发生**的路径上：

| 触点 | 时机 | 强度 |
| --- | --- | --- |
| `.githooks/pre-commit` | 每次提交 | 提示（不阻塞；见下方说明） |
| `pnpm release` | 每次发布 | **硬拦**：有未处理请求必须显式 `--ack-open` |
| `status.sh` | 任何服务器操作前后 | 一次性看到版本、漂移、待办 |

提交钩子只提示、不拦截，是因为请求可能长期挂在对方那里——不能让它堵住本仓库的正常提交。
真正拦人的是发布脚本：那次动作会改变线上，值得停下来看一眼。

**它防不住什么**：AI 完全不碰 git、不发布、也不看服务器时，仍然看不到请求。
这种情况只能靠对方在 journal 里写 `incident`，或由用户直接指派。机制提供可见性，不提供强制。

### 共享面归属（摘要，完整见 CONTRACT.md）

| 资源 | 所有者 |
| --- | --- |
| `quizgo-web-1` 容器、`/srv/nginx/nginx.conf`、`conf.d/quiz.conf` | QuizGo |
| `conf.d/atlas.conf`、`/srv/atlas`、`/srv/atlas.prev` | **Atlas** |
| 端口 8081 / 8082 | Atlas / QuizGo |
| 端口 80 / 443 | **双方共同决定**，备案前任何一方不得启用 |
| `/srv/ops` | 共同（写入规则见 CONTRACT.md 第 4 节） |
