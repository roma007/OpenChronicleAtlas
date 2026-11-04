# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构与 [语义化版本](https://semver.org/lang/zh-CN/)。
版本号与里程碑 tag 对应：`v0.1.0-m1`、`v0.2.0-m2` ……

## [Unreleased]

### Added
- 无。

### Changed
- 无。

### Fixed
- 无。

---

## [v0.17.0-m17] - 2026-11-05

### Added
- 共享 `neighborEvents` 事件前后邻居计算与单测。
- Web 详情「上一事件 / 下一事件」与 Alt+← / Alt+→ 快捷键。
- 移动端详情上一/下一事件导航。
- 导航按当前筛选与图层集合计算，首尾禁用。

### Changed
- 四包版本统一为 `0.17.0`；Android `versionCode` 升为 14。

### Docs
- `docs/plans/2026-11-05-M17-事件前后导航-plan.md`
- `docs/plans/2026-11-05-M17-事件前后导航-design.md`
- `docs/releases/2026-11-05-v0.17.0-m17.md`
- `docs/conversations/2026-11-05-M17启动与事件前后导航方案.md`

---

## [v0.16.0-m16] - 2026-11-05

### Added
- Web Skip Link「跳到主要内容」与各页面主内容 landmark。
- 事件详情打开时焦点进入、关闭后恢复。
- 时间轴当前事件 `aria-live="polite"` 与事件点 `aria-current`。
- 移动端专题卡片/时间轴事件点可访问标签。
- PWA 更新提示 `role="status"`。

### Changed
- 四包版本统一为 `0.16.0`；Android `versionCode` 升为 13。

### Docs
- `docs/plans/2026-11-05-M16-无障碍键盘体验-plan.md`
- `docs/plans/2026-11-05-M16-无障碍键盘体验-design.md`
- `docs/releases/2026-11-05-v0.16.0-m16.md`
- `docs/conversations/2026-11-05-M16启动与无障碍键盘体验方案.md`

---

## [v0.15.0-m15] - 2026-11-05

### Added
- PWA 新版本提示与手动刷新（`registerType: 'prompt'`）。
- `/about` 关于页：版本、数据契约、地图服务、缓存管理、仓库链接。
- Web 缓存占用/条目显示与清除入口。
- 关于/更新/缓存相关中英文案。

### Changed
- 四包版本统一为 `0.15.0`；Android `versionCode` 升为 12。
- 新增依赖 `workbox-window`。
- `vercel.json` 增加 `/about` rewrite。

### Fixed
- 修复 PWA 新版本静默接管、用户无法选择刷新时机的问题。

### Docs
- `docs/plans/2026-11-05-M15-更新提示与关于页-plan.md`
- `docs/plans/2026-11-05-M15-更新提示与关于页-design.md`
- `docs/releases/2026-11-05-v0.15.0-m15.md`
- `docs/conversations/2026-11-05-M15启动与更新提示关于页方案.md`

---

## [v0.14.0-m14] - 2026-11-04

### Added
- 长征 5 个多日事件补充 `endDate`（湘江战役、猴场会议、遵义会议、娄山关战斗、直罗镇战役）。
- Web / 移动端时间轴持续时间条。
- 当前事件区间高亮。

### Changed
- 四包版本统一为 `0.14.0`；Android `versionCode` 升为 11。

### Docs
- `docs/plans/2026-11-04-M14-事件持续时间-plan.md`
- `docs/plans/2026-11-04-M14-事件持续时间-design.md`
- `docs/releases/2026-11-04-v0.14.0-m14.md`
- `docs/conversations/2026-11-04-M14启动与事件持续时间方案.md`

---

## [v0.13.0-m13] - 2026-11-04

### Added
- 共享 `timelineEventMarkers` 事件标记计算与单测。
- Web 时间轴事件点：当前事件高亮、点击跳转并打开详情。
- 移动端时间轴事件点：点击跳转并打开详情。
- 事件点随图层/筛选/缩放联动。

### Changed
- 四包版本统一为 `0.13.0`；Android `versionCode` 升为 10。

### Docs
- `docs/plans/2026-11-04-M13-时间轴事件标记-plan.md`
- `docs/plans/2026-11-04-M13-时间轴事件标记-design.md`
- `docs/releases/2026-11-04-v0.13.0-m13.md`
- `docs/conversations/2026-11-04-M13启动与时间轴事件标记方案.md`

---

## [v0.12.0-m12] - 2026-11-04

### Added
- 分享链接保存语言（`lang`）、图层（`entities`）、类型（`categories`）与时间段（`from`/`to`）。
- Web 打开分享链接后恢复语言、图层、筛选与时间点。
- 移动端深链复用 `decodeShareState` 并恢复分享状态。
- 两端 store 新增 `setActiveEntities`。

### Changed
- 四包版本统一为 `0.12.0`；Android `versionCode` 升为 9。
- 旧分享链接保持兼容。

### Fixed
- 修复分享链接打开后语言、图层与筛选丢失的问题。

### Docs
- `docs/plans/2026-11-04-M12-分享链接增强-plan.md`
- `docs/plans/2026-11-04-M12-分享链接增强-design.md`
- `docs/releases/2026-11-04-v0.12.0-m12.md`
- `docs/conversations/2026-11-04-M12启动与分享链接增强方案.md`

---

## [v0.11.0-m11] - 2026-11-04

### Added
- 移动端语言持久化：AsyncStorage `atlas-locale` + 启动 `hydrateLocale()`。
- 缓存命中检测与「离线缓存」徽标（首页、专题页）。
- 首页「清除离线缓存」入口与确认弹窗。
- 缓存/离线相关中英文案。

### Changed
- 四包版本统一为 `0.11.0`；Android `versionCode` 升为 8。

### Fixed
- 修复移动端重启后语言恢复默认中文的问题。
- 修复清除缓存可能误删语言设置的风险（仅删除 `atlas-cache:v1:`）。

### Docs
- `docs/plans/2026-11-04-M11-移动端体验收尾-plan.md`
- `docs/plans/2026-11-04-M11-移动端体验收尾-design.md`
- `docs/releases/2026-11-04-v0.11.0-m11.md`
- `docs/conversations/2026-11-04-M11启动与移动端体验收尾方案.md`

---

## [v0.10.0-m10] - 2026-11-04

### Added
- 郑和专题航线补齐去程/返程，共 20 段。
- 郑和航线名称与描述英文。
- `extensions.routeEvent = false` 支持标记非路线事件。

### Changed
- 郑和 26 个事件与航线时间对齐；出发事件 2—12km，其余路线事件 0km。
- 分䑸访问榜葛剌事件只绑定 `detached-squadron`。
- 四包版本统一为 `0.10.0`；Android `versionCode` 升为 7。

### Fixed
- 修复郑和返航事件偏离航线 9342km、港口事件偏离 721—1428km 的问题。

### Docs
- `docs/plans/2026-11-04-M10-郑和航线时间校正-plan.md`
- `docs/plans/2026-11-04-M10-郑和航线时间校正-design.md`
- `docs/releases/2026-11-04-v0.10.0-m10.md`
- `docs/conversations/2026-11-04-M10启动与郑和航线校正方案.md`

---

## [v0.9.0-m9] - 2026-11-04

### Added
- 中文全拼检索（`zunyi` / `zun yi`）。
- 事件名首字母检索（`zy` → 遵义会议），按前缀匹配降低噪音。
- 中英文混合查询。
- `pinyin-pro` 依赖与独立构建 chunk。

### Changed
- 搜索提示与占位符更新为支持拼音/首字母。
- 拼音匹配片段回退原文，不高亮拼音。
- 四包版本统一为 `0.9.0`；Android `versionCode` 升为 6。

### Docs
- `docs/plans/2026-11-04-M9-检索增强-plan.md`
- `docs/plans/2026-11-04-M9-检索增强-design.md`
- `docs/releases/2026-11-04-v0.9.0-m9.md`
- `docs/conversations/2026-11-04-M9启动与检索增强方案.md`

---

## [v0.8.0-m8] - 2026-11-04

### Added
- Web PWA 离线支持：应用壳预缓存、专题数据/封面/地图瓦片运行时缓存。
- Web 离线提示 `OfflineBanner` 与 `useOnlineStatus`。
- PWA manifest 与 192/512/1024 图标。
- 移动端 `CachedHttpDataSource`：AsyncStorage 缓存专题数据，断网回退。
- `@react-native-async-storage/async-storage@2.2.0` 依赖。

### Changed
- 四包版本统一为 `0.8.0`；Android `versionCode` 升为 5。
- `vercel.json` 为 `sw.js` / `manifest.webmanifest` 增加 no-cache 头。

### Fixed
- 弱网/断网时专题数据与详情不可用的问题。

### Docs
- `docs/plans/2026-11-04-M8-离线与弱网体验-plan.md`
- `docs/plans/2026-11-04-M8-离线与弱网体验-design.md`
- `docs/releases/2026-11-04-v0.8.0-m8.md`
- `docs/conversations/2026-11-04-M8启动与离线弱网方案.md`

---

## [v0.7.0-m7] - 2026-11-04

### Added
- Web / 移动端中英文切换，Web 语言持久化到 `localStorage`。
- 共享 i18n 模块：`locale`、`messages`、`categories`、`tags`。
- 54 个事件的英文名称、摘要、描述与地点。
- 郑和专题英文标题、副标题、描述与实体名称/描述。
- 英文日期格式、英文分类名、英文专题标签。
- 英文检索：分类字段同时索引中英文。

### Changed
- 四包版本统一为 `0.7.0`；Android `versionCode` 升为 4。
- 专题索引 `index.json` 同步英文标题与副标题。

### Fixed
- 修复专题卡片只读取中文标题、英文切换后仍显示中文的问题。

### Docs
- `docs/plans/2026-11-04-M7-中英双语-plan.md`
- `docs/plans/2026-11-04-M7-中英双语-design.md`
- `docs/releases/2026-11-04-v0.7.0-m7.md`
- `docs/conversations/2026-11-04-M7启动与中英双语方案.md`

---

## [v0.6.0-m6] - 2026-11-04

### Added
- 共享事件聚合算法 `clusterEvents(events, zoom)`，Web / 移动端复用。
- Web 地图 Marker 聚合：聚合点显示数量，点击放大。
- 移动端地图 Marker 聚合：复用共享算法，点击放大。
- Web / 移动端时间轴 0—8 级缩放，刻度与拖动自适应。
- 共享时间轴视口工具 `createViewport` / `centerViewportStart` / `timelineSpan`。
- 聚合与视口单测（`cluster.test.ts`、`viewport.test.ts`）。

### Changed
- 四包版本统一为 `0.6.0`；Android `versionCode` 升为 3。
- 时间轴缩放后，起止日期显示当前视口范围。

### Docs
- `docs/plans/2026-11-04-M6-地图聚合与时间轴缩放-plan.md`
- `docs/plans/2026-11-04-M6-地图聚合与时间轴缩放-design.md`
- `docs/releases/2026-11-04-v0.6.0-m6.md`
- `docs/conversations/2026-11-04-M6启动与地图聚合缩放方案.md`

---

## [v0.5.0-m5] - 2026-11-04

### Added
- 第二专题「郑和下西洋」：3 实体 / 8 段航线 / 26 事件 / 封面。
- 多专题首页与跨专题搜索验证。
- Web `/privacy` 隐私政策页与页脚入口。
- 应用图标、Android 自适应图标、启动图、favicon。
- `vercel.json`、`wrangler.toml`、部署指南与商店元数据草稿。
- 移动端 0.5.0 / versionCode 2，Android APK 重建。
- Vercel 临时预览部署（两专题、隐私页、深链），随后认领并部署 production。
- Vercel SPA rewrites（/search、/privacy、/atlas/*）。
- 商店截图（Web 移动端占位，iOS/Android 各 4 张）与 Feature Graphic。
- 全项目收尾审计报告（M1–M5），四包版本统一为 0.5.0。

### Changed
- 首页页脚更新为 M5 示例数据。
- 移动端隐私同意页支持 `EXPO_PUBLIC_PRIVACY_URL`。

### Fixed
- 修正长征「懋功会师」路线时间：中央红军第 6 段改为 6/19 出发；红四方面军拆为「通江—懋功（6/18 到达）」与「懋功—会宁」两段。
- 逐条抽查长征 28 个事件与路线到达时间：中央红军拆为 26 段，瑞金—湘江拆为「瑞金—于都」「于都—宜章」「宜章—湘江」，四渡赤水坐标改至太平渡；起点当天路线不再消失。
- 长征 33 段路线补充中间途经节点（会昌、信丰、汝城、道县、剑河、桐梓、二郎滩、皎平渡、泸沽、达维、两河口、卓克基、班佑、六盘山、平凉等），路线走向更贴近实际。
- 长征 28 个事件补充针对性史料来源（年谱、史料丛书、文献集），遵义会议另加《遵义会议文献》。

### Docs
- `docs/plans/2026-11-04-M5-第二专题与上架部署-plan.md`
- `docs/plans/2026-11-04-M5-第二专题与上架部署-design.md`
- `docs/decisions/ADR-0008-静态部署与资源托管方案.md`
- `docs/guides/deployment.md`
- `docs/releases/store-metadata.md`
- `docs/releases/2026-11-04-v0.5.0-m5.md`

---

## [v0.4.0-m4] - 2026-11-04

### Added
- 移动端 React Navigation（Gallery / Atlas / Search）与高德地图 `expo-gaode-map`。
- 移动端时间轴：拖动、播放/暂停、倍速、日期输入、刻度自适应。
- 移动端详情底部抽屉：Markdown、图片、来源、关联事件、系统分享。
- 移动端搜索与筛选（实体、类型、时间段）。
- 隐私同意页；Android 屏蔽定位权限。
- 深链 `atlas://` 与 `Share.share`。
- Android release APK（release keystore 签名）、`configure-android-release.mjs` 构建脚本。
- 封面 JPEG（RN 不支持 SVG）。

### Changed
- shared 中文日期改为手动格式化，兼容 Hermes 缺少 locale 数据。
- Android release 使用全屏 Modal 展示详情/筛选。
- Android 开发数据允许 cleartext（`expo-build-properties`）。

### Fixed
- 修复 Metro 在 pnpm monorepo 下无法解析 `invariant` 的问题（移除 `disableHierarchicalLookup`）。
- 修复 R8 缺少 AMap 可选类导致的 release 构建失败（ProGuard `-dontwarn`）。

### Known Issues
- iOS 因 AMap SDK 无 arm64 模拟器切片，当前 arm64 Mac 模拟器无法运行；需真机 + Apple 账号出 IPA。
- Android 详情抽屉在 TV 模拟器上宽度异常，待手机真机复验。

### Docs
- `docs/plans/2026-11-03-M4-移动端打包与三端一致性-plan.md`
- `docs/plans/2026-11-03-M4-移动端打包与三端一致性-design.md`
- `docs/decisions/ADR-0007-移动端架构与构建发布方案.md`
- `docs/conversations/2026-11-03-M4启动与移动端打包方案.md`
- `docs/releases/2026-11-04-v0.4.0-m4.md`

---

## [v0.3.0-m3] - 2026-11-03

### Added
- shared 检索：`buildSearchIndex` / `searchEvents`（中英文、字段评分、片段、过滤）。
- shared 筛选：`applyEventFilters` / `collectCategories`。
- shared 分享：`encodeShareState` / `decodeShareState` / `buildShareUrl`。
- 事件详情 Markdown 渲染（`react-markdown` + `remark-gfm` + `rehype-sanitize`），按需加载。
- 详情图片、图注、来源、关联事件与分享按钮。
- `/search` 全局搜索页：专题筛选、关键词高亮、空状态、错误重试。
- 专题侧栏筛选：类型多选、时间段、命中数量、重置；移动端筛选浮层。
- 分享链接与深链恢复（时间、事件、地图视野）。
- 新增 18 个检索/筛选/分享单测（shared 共 57 个）。

### Changed
- 深链带 `view` 时视野优先于事件定位。
- Web Share 1.5 秒超时后降级复制；剪贴板失败用 `execCommand` 兜底。
- Markdown 组件 React.lazy 拆包，主包体积保持可控。

### Fixed
- 修复深链设置事件时间被 StrictMode 二次加载覆盖的问题。
- 修复深链选中事件在 map ready 前设置导致地图不居中的问题。
- 修复分享链接缺少地图视野参数的问题。

### Docs
- `docs/plans/2026-11-03-M3-检索筛选与分享-plan.md`
- `docs/plans/2026-11-03-M3-检索筛选与分享-design.md`
- `docs/decisions/ADR-0006-检索与分享状态方案.md`
- `docs/conversations/2026-11-03-M3启动与检索分享方案.md`
- `docs/releases/2026-11-03-v0.3.0-m3.md`

---

## [v0.2.0-m2] - 2026-11-03

### Added
- `packages/shared/src/timeline`：时间轴核心、年/月/日自适应刻度、路线累计长度与截断插值、事件显隐/当前事件、播放推进。
- 时间轴单测 23 个（shared 共 39 个）。
- Web 底部时间轴：拖动、点击轨道跳转、日期输入、播放/暂停、0.5/1/2/4x、主次刻度。
- 键盘无障碍：方向键 ±1 天、Shift ±7 天、PageUp/PageDown ±30 天、Home/End、空格。
- 地图联动：路线 `Polyline.setPath` 生长、Marker 按时间显隐、当前事件脉冲高亮。
- 播放事件气泡（固定 UI，4 秒自动消失，可查看详情/关闭）。
- 移动端 390px 时间轴与气泡适配。

### Changed
- 播放时间保留亚日精度，UI 仍按日显示；修复每帧 snap 到日边界导致播放不前进。
- 刻度选择增加单位权重，避免 90 天步长的日刻度压过月刻度。

### Fixed
- 修复播放到终点后无法自动停止的问题。
- 修复事件气泡被地图视口裁切的问题（由 `InfoWindow` 改为固定气泡）。

### Docs
- `docs/plans/2026-11-03-M2-通用时间轴-plan.md`
- `docs/plans/2026-11-03-M2-通用时间轴-design.md`
- `docs/decisions/ADR-0005-时间轴与路线动画方案.md`
- `docs/conversations/2026-11-03-M2启动与时间轴方案.md`
- `docs/releases/2026-11-03-v0.2.0-m2.md`

---

## [v0.1.0-m1] - 2026-11-03

### Added
- 项目启动：建立 `/docs` 留档体系（conversations / plans / decisions / changelog / releases / schema / guides）与文档模板。
- 建立根 `README.md`：双仓库地址、双推配置、技术栈、数据契约速览、快速开始、里程碑状态。
- 建立数据契约 `atlas-schema v1.0.0` 文档。
- 产出 M1 plan 与 design 文档、ADR-0001/0002/0003。
- 初始化 git 仓库并完成 GitHub / Gitee 首次双推（`4c73ba6`），统一开发分支为 `main`。
- 底图改用高德地图：新增 ADR-0004、`docs/guides/amap-setup.md`，更新 M1 plan/design 与 README（GCJ-02 坐标转换、分平台 Key）。
- 补充 iOS 高德 Key、Web 端 (JS API) Key 申请说明（`atlas-ios` / `atlas-web`、Bundle ID、域名白名单、安全密钥）。
- 三端 Key 交付并写入本地 `.env.local`（不入库），M1 实施启动。
- pnpm workspaces monorepo：`apps/web`、`apps/mobile`、`packages/shared`。
- `@atlas/shared`：类型、zod schema、数据加载器、跨文件校验、时间函数、WGS84 ↔ GCJ-02、多语言解析。
- Web：首页专题卡片墙、高德 JS API 2.0 地图、按实体分色路线、事件 Marker、只读详情面板、图例开关、时间轴占位。
- 移动端空壳：Expo SDK 58 + RN 0.88，包名/Bundle ID 配置，`expo prebuild` 验证通过。
- `pnpm validate:data` 数据校验脚本。

### Changed
- Web 由 React 18 升级到 **React 19.3**，与 Expo SDK 58 统一版本，避免 `@types/react` 双版本冲突。
- 移动端原生目录改为 Expo prebuild 生成并 gitignore（CNG）。
- 地图 fitView 后限制最小缩放 4.5，改善移动端可读性。

### Fixed
- 修复浏览器中 `fetch` 作为实例方法调用导致的 `Illegal invocation`。
- 修复相对 URL 传入 `HttpDataSource` 时的 `Invalid base URL`。
- 修复移动端 Marker 点击被内部元素拦截。
- 修复事件详情选择后地图动画被 fitView 覆盖的问题（改为立即定位）。

### Data
- 新增 `data/atlases/long-march`：6 个实体、9 段路线、28 个事件、封面 SVG，全部带史料来源（示意初稿，待校订）。

### Docs
- `docs/conversations/2026-11-03-项目启动与M1方案.md`
- `docs/conversations/2026-11-03-底图改用高德与AndroidKey申请.md`
- `docs/conversations/2026-11-03-iOSKey申请.md`
- `docs/conversations/2026-11-03-WebKey类型选择说明.md`
- `docs/conversations/2026-11-03-WebJSAPIKey申请.md`
- `docs/conversations/2026-11-03-Key交付与M1启动.md`
- `docs/releases/2026-11-03-v0.1.0-m1.md`

---

## 版本记录格式说明

每个已发布版本使用如下小节：

```md
## [v0.1.0-m1] - YYYY-MM-DD

### Added
- …

### Changed
- …

### Fixed
- …

### Docs
- …

### Data
- …
```
