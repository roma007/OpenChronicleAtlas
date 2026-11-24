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
- **提交必须同时更新服务器**：每次 commit 后必须执行 `pnpm release`，完成构建、备份、同步、自检与 `/srv/ops` 登记；只 commit / push 不算完成。发布被跨项目请求或漂移检查硬拦时，先处理或显式 `--ack-open`，不得跳过。
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
8. **路线端点铁律：不准出现无来由的线头，也不准出现无后续的线尾。**
   - 每段路线的**起点**必须满足其一：落在同实体另一段路线上（默认 10km 内）、落在同实体事件上（10km 内）、或是该实体按日期排序的第一条路线（根据地 / 出发地）。
   - 每段路线的**终点**同理：接上后续路线、落在事件上、或是该实体的最后一条路线（终点 / 会师地）。
   - 防线（`defense`）、航线（`naval`）、补给线（`supply`）与国民党军追击 / 封锁线（`kmt-*` 实体）端点天然独立，不适用。
   - 确属史实终点却无法接线的，必须写进该专题的 `route-endpoints.allow.json`，逐条注明 `reason`；**禁止口头豁免、禁止靠调大阈值绕过**。
   - 每次改动路线后必须运行：

     ```bash
     pnpm check:heads                # 默认检查 long-march
     pnpm check:heads --atlas <id>   # 改动其它专题时
     ```

     必须输出 `0 个无来由端点` 才允许提交。
   - 新加事件时同步检查事件锚点：事件正文写到的后续行动、会师、撤离，若已有路线经过，必须让路线接上或补线，不能只在正文里写。
9. **海路铁律：船不能走大陆。** `segmentType` 为 `naval` 的航线必须走水面，不能是两点直线。
   - 每次改动海运航线后必须运行 `pnpm check:land`（默认查 `zheng-he`，`--atlas <id>` 查其它专题，`--all` 查全部）。
   - 判据是 Natural Earth `ne_50m_land`（`scripts/data/`，public domain），沿航段每 2km 采样，
     **连续陆地超过 25km** 才报错。阈值不取更小，是因为 50m 岸线在三角洲、海峡、珊瑚礁处只有
     几公里精度，取小值会把正常贴岸航行误判为穿陆；取 25km 仍能拦住任何真正的跨陆直线（数百公里）。
   - 确属内河航段（长江口、穆西河、珠江等）或岸线概化无法表达的窄水道，登记到该专题
     `land-legs.allow.json`，逐条写 `reason`；**禁止调大阈值绕过**。
   - 内陆目的地（麦加、艾哈迈达巴德、榜葛剌王城等）不要拉一条穿陆航线过去，
     改为事件标 `extensions.routeEvent = false`，航线只到最近的海港。
10. **行动分段铁律：一次行动要拆成多段，不要一个要素画全程。**
   - 一个实体（一次航次 / 一次战役 / 一条长征路线）对应多个路线要素，每段有自己的
     `startDate` / `endDate`、实体内唯一的 `order` 和可读的 `name`（如「归程」「分䑸」）。
   - 分段边界必须**共用同一个锚点坐标**，否则 `check:heads` 会报无来由端点。
   - 单一连续航线无法同时满足史料日期时（同一批人不可能同时在两地），该段标为
     「分䑸 / 分遣」并允许时间区间重叠，**不要为对齐而篡改事件日期**。
   - 反例：郑和七次下西洋曾各用一条线，图例显示「1 段」，时间轴按弧长插值导致船位失真，
     已按本规则拆成 39 段（见 M170）。
11. **史料考证铁律（政治红线，优先于一切进度）。**
   - 任何事件、任何路线、任何一句话，都必须先用**可核查的史料**考证，再写入数据。
     没有史料支撑的「通行说法」只能作为待考线索，不能当作定论，更不能据此画精确路线。
   - **主体必须对得上**：日军做的事只能挂 `japanese-invasion`，中国军队做的事只能挂对应部队，
     国际组织/会议只能挂 `international`，民众行为只能挂 `china-people`。
     禁止把不同主体、不同时间、不同地点的行动拼成一条线，禁止「张冠李戴」。
   - 每条新增或修改的事件必须附 `sources`，至少两条独立来源；
     优先顺序：档案/方志/党史正本/当时报刊 > 学术著作 > 纪念馆与政府网站 > 百科。
     能查到页码、卷次、日期的必须写进 `note`；只有网络转载的，注明转载源与访问日期。
   - 日期、地名、部队番号、伤亡数字必须逐项核对。异说并存时，正文写「通行说法 / 另有异说」，
     并在 `docs/research/` 的研究笔记里列出两种说法；**不得为了让时间轴好看而改日期**。
   - 考证不实的，宁可不加、标 `routeEvent: false` 或写「待考」，也不许编。
     不确定的路线只能标 `precision: schematic`，端点必须有史实锚点；禁止用直线硬连。
   - 每个批次提交前必须完成：
     ```bash
     pnpm validate:data
     pnpm check:routes --atlas anti-japanese-war
     pnpm check:heads --atlas anti-japanese-war
     pnpm check:land --atlas anti-japanese-war   # 涉及海路时
     pnpm typecheck && pnpm lint && pnpm test
     ```
     并在 `docs/research/` 写本批次的史料核对表（事件 → 日期 → 出处 → 主体 → 存疑点）。
   - 这条铁律适用于每一个小任务，不因「只是补一个点」「只是改一条线」而豁免。
     **史实错误是政治问题，错了会死人；宁可少一条，不可错一条。**

## 5. 文档铁律

- 每轮对话：`docs/conversations/`
- 计划与方案：`docs/plans/`
- 架构决策：`docs/decisions/`
- 变更记录：`docs/changelog/CHANGELOG.md`
- 发布说明：`docs/releases/`
- 文档与代码同一次提交，不允许事后补文档。

## 6. 线上访问与临时通道（备案已通过）

> **ICP 备案于 2026-11-23 通过**，备案号 `粤ICP备2026058093号-2`（页脚已展示，链接工信部查询页）。
> 「备案前不得启用 80/443」的红线**已解除**，80/443 转为正式对外端口，走 HTTPS。
> 切换动作在 QuizGo 侧（容器 + conf 正源），Atlas 提请求：`/srv/ops/requests/2026-11-23-atlas-to-quizgo-enable-443-tls.md`。

### 环境

| 项 | 值 |
| --- | --- |
| 服务器 | 阿里云 华南3（广州）`ecs.e-c1m1.large` 2C2G / 40G |
| 公网 IP | `8.163.122.39` |
| Tailscale IP | `100.65.110.80`（hostname `quizgo-ecs`） |
| SSH | `ssh quizgo`（走 Tailscale，**唯一长期通道**）；`ssh quizgo-pub`（走公网，仅 `TCP 22 → 223.73.119.15/32` 临时放行，2026-11-21 复核后删除） |
| Atlas 部署目录 | `/srv/atlas`（nginx 只读挂载） |
| nginx 配置 | `/srv/nginx/conf.d/atlas.conf`（仓库 `OpenQuizGo/deploy/nginx/`） |
| 正式入口 | `https://atlas.openapp.asia`（443）；`http://` 一律 301 |
| 调试入口 | `http://quizgo-ecs:8081` / `http://100.65.110.80:8081`（tailnet） |
| TLS 证书 | `/srv/nginx/certs/{atlas,quiz}.openapp.asia.{pem,key}`，DigiCert DV，**到期 2027-02-21 07:59 CST** |
| 备案 | ICP `粤ICP备2026058093号-2`（已上线）；公安联网备案 2026-11-24 已提交，出号后 30 日内挂页脚 |

### 访问方式

```bash
open https://atlas.openapp.asia     # 正式入口（TLS）
open http://quizgo-ecs:8081         # tailnet 调试口，无 TLS，仅供排障
```

- 正式入口要求证书就位；证书在 `/srv/nginx/certs/`，由 QuizGo 的 web 容器只读挂载
- **证书不得放进 `conf.d/`**：`--with-nginx` 的 `rsync --delete` 会删掉
- 证书 SAN 含 `www.atlas.openapp.asia` / `www.quiz.openapp.asia`，`server_name` 已写成两条；
  但 **`www.*` 的 A 记录尚未添加**（2026-11-24 实测 `dig` 为空），所以 `https://www.atlas…` 目前解析失败。
  要么在云解析加一条 A → `8.163.122.39`，要么一直按「证书含 SAN、DNS 未启用」理解，不要误判成配置错误
- 调试口只放行 `127.0.0.1` 与 `100.64.0.0/10`，安全组也未放行 8081
- 深链（`/atlas/*`、`/search`）由 nginx 做 SPA 回退，可直接访问
- **Service Worker 只在 https 下注册**（`http://100.65.110.80:8081` 不是 secure context）。
  2026-11-24 已在正式站实测：SW `activated` 且正在控制页面，
  `workbox-precache-v2` / `atlas-data` / `atlas-images` 三个缓存均已建立，控制台无报错

### 安全组现状（2026-11-14 收口，2026-11-23 加回 80/443）

| 规则 | 用途 | 期限 |
| --- | --- | --- |
| `TCP 80` / `TCP 443` | 正式对外（备案已通过） | 长期 |
| `TCP 22 → 223.73.119.15/32` | 临时 SSH | 2026-11-21 复核后删除；删前先实测控制台 VNC 可登 |
| `UDP 41641` | Tailscale 直连打洞 | 长期 |
| `ICMP` | 排障 | 长期 |

**80/443 于 2026-11-14 删除、2026-11-23 备案通过后加回、2026-11-24 实测公网可通**；
两者必须与 `listen 80/443` 同步，只加安全组不切配置 = 80 超时，只切配置不加安全组 = 同样超时。

验收用服务器上的自探（`ssh quizgo '/srv/ops/bin/status.sh'` 的「公网暴露自探」段）：
判据来自 `/srv/ops/state/exposure.json`（缺失时按全部 `blocked`）。
现状（2026-11-24 切 TLS 时由 QuizGo 写入）：`80/443 = allowed`，`8080/8081/8082 = blocked`。
该探针只测安全组、不测监听；且 22 规则按源限流，从服务器自身发起**测不出**，闭环只能从 `/32` 那一侧或控制台规则列表确认。

### 证书续期（90 天，必须写进日历）

免费 DV 证书只有 90 天，**一年要换 4 次**。这是最容易漏、漏了就是整站白屏的一项。

| 项 | 值 |
| --- | --- |
| 当前证书 | DigiCert DV 单域名 ×2（`atlas` / `quiz`），SAN 各含自己的 `www` |
| 到期 | **2027-02-21 07:59 CST**（`notAfter` Feb 20 23:59:59 GMT） |
| 监控 | `status.sh` 的「TLS 证书」段：剩 <14 天显示 ⏳，过期显示 ❌ |
| 重签动作 | 阿里云 → 数字证书管理服务 → 个人测试证书（免费版）→ 申请 → 自动 DNS 验证 → 签发后下载 Nginx 格式 |
| 落地 | 覆盖 `/srv/nginx/certs/<域名>.pem|.key`（`600`，属主 `ecs-user`，目录 `700`） |
| 生效 | 通知 QuizGo：`docker exec quizgo-web-1 nginx -t && docker exec quizgo-web-1 nginx -s reload` |
| 额度 | 免费额度 20 张/年，两个域名一年 8 张，够用 |

- **建议提前 30 天**（2027-01-22 前）申请；不要等到剩几天，CA 审核与 DNS 传播都有不确定性。
- 证书**归 Atlas**（申请、下载、上传、校验），QuizGo 只负责 `nginx -t` + `reload`。
- 改名或换路径必须提前提请求——`ssl_certificate` 在共享 conf 里，路径写错 443 直接起不来。
- 想改成 acme.sh 自动续期时另立议题（需改共享 nginx 的证书路径与 reload 钩子），不要临时起意。

### 本地开发

```bash
pnpm dev                    # http://127.0.0.1:5180
VITE_DEV_PORT=5181 pnpm dev # 临时换端口
```

- Atlas 固定使用 **5180**，避免与本机其他 Vite 项目争 5173；
- `strictPort: true`：端口被占用时直接报错，不静默换号；
- 本机 8081 可能属于其他项目（如 Expo）；Atlas 线上预览是 `http://quizgo-ecs:8081`，不是本机 8081。

### 构建与部署

```bash
# 本地构建（不要在服务器上构建，服务器只有 2G 内存）
pnpm build

# 同步到服务器（静态文件，nginx 只读挂载，无需重启）
rsync -az --delete apps/web/dist/ quizgo:/srv/atlas/
```

部署后自检（`pnpm release` 的第 7 步已包含，手工排查时用）：

```bash
curl -s -o /dev/null -w "首页 %{http_code}\n" https://atlas.openapp.asia/
curl -s -o /dev/null -w "深链 %{http_code}\n" https://atlas.openapp.asia/search
curl -s -o /dev/null -w "专题 %{http_code}\n" https://atlas.openapp.asia/atlas/three-kingdoms
curl -s -o /dev/null -w "http→https %{http_code}\n" http://atlas.openapp.asia/     # 期望 301
curl -sI https://atlas.openapp.asia/sw.js | grep -i cache-control                # 应为 no-cache
```

> 2026-11-24 起自检一律走 https 正式入口。`http://quizgo-ecs:8081` 只用于排障：
> 它不校验证书、也没有 Service Worker，不能作为「发布成功」的判据。

### 给外部看效果

**2026-11-24 起站点已公网可访问**（`https://atlas.openapp.asia`），直接把链接发给对方即可，
不再需要 Tailscale 共享节点或临时放开 8081。

| 场景 | 做法 |
| --- | --- |
| 普通分享 | 直接给 `https://atlas.openapp.asia` |
| 未上线前的预览 | tailnet 的 `http://quizgo-ecs:8081`（仅限已在 tailnet 内的设备） |
| 公网隧道（ngrok / Cloudflare Tunnel） | ⚠️ 不推荐，有合规风险；既已备案上线，没有理由再用 |

### 硬性约束

1. `atlas.conf` 的正文在 **OpenQuizGo 仓库**，Atlas 不直接改服务器文件，一律提请求（见第 8 节耦合点）
2. 不要把任何密钥、`.env`、证书写入仓库
3. 数据改动仍走 `pnpm validate:data` → `build:search-index` → `build:mobile-data`，生成物一并提交
4. 服务器上的 `/srv/atlas` 是构建产物，**不要**在服务器上改内容，改动一律走仓库 → 构建 → rsync
5. 安全组、Tailscale、iptables 属**人工**，AI 不得自行修改；只可读、可提请求、可自探
6. 除 80/443 外不得新增公网端口；临时对外演示只加非标端口 + 对方 IP `/32`，用完立刻删
7. 证书放 `/srv/nginx/certs/`（700，文件 600），**不得**放进 `conf.d/`（会被 `rsync --delete` 删掉）
8. HSTS **已于 2026-11-24 开启**（`max-age=31536000`，未含 `preload`）。回滚成本高（浏览器缓存一年），
   彻底放弃 TLS 前先想清楚：降级只能靠同域 https 继续可用，改回 http 不再可行
9. TLS 只覆盖 `openapp.asia` 的两个子域；新增域名要重签证书 + 改共享 conf，两者都得走请求

## 7. 发布与线上更新（Web 静态站）

> 服务器只承载 **Web 静态站**；移动端与桌面端走 GitHub Release，不涉及服务器发布。

### 7.1 什么时候必须更新服务器

**自 v1.0.14 起，每次提交都必须跟随一次服务器更新（见第 2 节提交铁律）。** 不再按「用户能不能看出区别」攒发布；只 commit / push 视为未完成。

| 变更类型 | 是否发布 | 说明 |
| --- | --- | --- |
| 页面 / 交互 / 文案 / 样式 | ✅ 必须 | 用户可见 |
| `data/atlases/**`（事件、专题、封面、路线、索引） | ✅ 必须 | 不发则线上内容不更新 |
| bug 修复、安全修复 | ✅ 必须（安全类立刻发） | |
| 只改文档、注释、测试 | ✅ 必须 | 按提交铁律，每次提交都发 |
| 纯重构且行为不变 | ✅ 必须 | 按提交铁律，每次提交都发 |
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
curl -s -o /dev/null -w "首页 %{http_code}\n" https://atlas.openapp.asia/
curl -s -o /dev/null -w "深链 %{http_code}\n" https://atlas.openapp.asia/search
curl -s -o /dev/null -w "专题 %{http_code}\n" https://atlas.openapp.asia/atlas/three-kingdoms
curl -s -o /dev/null -w "http→https %{http_code}\n" http://atlas.openapp.asia/    # 期望 301
curl -sI https://atlas.openapp.asia/sw.js | grep -i cache-control               # 应为 no-cache
curl -s https://atlas.openapp.asia/ | grep -c '粤ICP备2026058093号-2'            # 页脚备案号，应 ≥1
```

六条全过才算发布成功，`pnpm release` 第 7 步会逐条跑并打印。
PWA 用户刷新即更新（`sw.js` 不缓存），无需额外操作。

### 7.4 回滚

```bash
ssh quizgo 'sudo rsync -a --delete /srv/atlas.prev/ /srv/atlas/'
```

静态站回滚是**秒级且无损**的，这也是必须先备份上一版的原因。

### 7.5 红线

1. `atlas.conf` 与 `quiz.conf` 的正源在 OpenQuizGo 仓库；Atlas 改配置一律走 `requests/`，不直接改服务器文件
2. 不在服务器上构建、不直接修改 `/srv/atlas`
3. 不把密钥、证书、`.env` 提交进仓库
4. 数据与生成物必须同一次提交（见第 4 节）
5. Service Worker 只在 https 生效；改 PWA 相关文件必须在 `https://atlas.openapp.asia` 上验证，调试口验证不算

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
   需要重启（例如改证书、动挂载）走 `requests/` 请对方做。
4. **只写自己的东西**：`state/atlas.json` 只有 Atlas 写，`state/quizgo.json` 只有 QuizGo 写；
   `state/exposure.json` 由**执行切换**的一方写（切换公网端口时）。
5. **发布必登记**：第 7 节第 6 步，写 state + journal，且 `status.sh` 漂移检测全绿才算完成。
6. **漂移告警不许忽略**：`status.sh` 报 drift 说明有改动没登记，先查 journal 再动手。

### 为什么不会漏

「写进 AGENTS.md 要求自己记得」不可靠。所以把「读」挂到三条**自动会发生**的路径上：

| 触点 | 时机 | 强度 |
| --- | --- | --- |
| `.githooks/pre-commit` | 每次提交 | 提示（不阻塞；见下方说明） |
| `pnpm release` | 每次发布 | **硬拦**：有未处理请求必须显式 `--ack-open` |
| `status.sh` | 任何服务器操作前后 | 一次性看到版本、漂移、待办 |
| 交互式登录提示 | `ssh quizgo` 登录时 | 一行计数：`[/srv/ops] 待办请求：atlas N 条 · quizgo M 条` |

登录提示位于服务器 `~/.bashrc.d/ops-inbox.sh`，**只在交互式 shell** 生效（`$-` 含 `i`），
所以 `ssh quizgo '命令'`、`rsync` 等非交互路径完全不受影响（已实测）。删该文件即关闭。

> sshd 的 `Banner` 方案已评估并**否决**：Banner 在认证前发送，公网可见，只能放计数；
> 且需改 `sshd_config` 并 reload sshd。同样的可见性用一个 `~/.bashrc.d` 文件就能拿到，风险为零。

提交钩子只提示、不拦截，是因为请求可能长期挂在对方那里——不能让它堵住本仓库的正常提交。
真正拦人的是发布脚本：那次动作会改变线上，值得停下来看一眼。

**它防不住什么**：AI 完全不碰 git、不发布、也不看服务器时，仍然看不到请求。
这种情况只能靠对方在 journal 里写 `incident`，或由用户直接指派。机制提供可见性，不提供强制。

### 共享面归属（摘要，完整见 CONTRACT.md）

| 资源 | 所有者 |
| --- | --- |
| `quizgo-web-1` 容器、`/srv/nginx/nginx.conf`、`conf.d/quiz.conf` | QuizGo |
| `conf.d/atlas.conf` | **源文件在 OpenQuizGo 仓库**，Atlas 提请求修改（见下） |
| `/srv/atlas`、`/srv/atlas.prev` | **Atlas** |
| 端口 8081 / 8082 | Atlas / QuizGo（tailnet 调试口） |
| 端口 80 / 443 | **QuizGo 配置**（`quizgo-web-1`）；备案已通过，正式对外走 TLS |
| `/srv/nginx/certs` | QuizGo 容器挂载；证书由用户提供，不进仓库 |
| `/srv/ops` | 共同（写入规则见 CONTRACT.md 第 4 节） |

> **耦合点**：QuizGo 的 `--with-nginx` 用 `rsync --delete` 同步 `deploy/nginx/conf.d/`，
> 会覆盖甚至删除不在其仓库里的 conf。所以 Atlas 要改 `atlas.conf`（备案后换域名、加证书）
> 时，**必须把新内容写进 `requests/` 交给 QuizGo 提交同步**，直接改服务器文件会被下次发布覆盖。
