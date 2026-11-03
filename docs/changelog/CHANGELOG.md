# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构与 [语义化版本](https://semver.org/lang/zh-CN/)。
版本号与里程碑 tag 对应：`v0.1.0-m1`、`v0.2.0-m2` ……

## [Unreleased]

### Added
- M2 方案：通用时间轴、路线生长动画、事件显隐与气泡；新增 plan/design/ADR-0005（待确认后实施）。

### Changed
- 无。

### Fixed
- 无。

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
