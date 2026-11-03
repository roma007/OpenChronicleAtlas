# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构与 [语义化版本](https://semver.org/lang/zh-CN/)。
版本号与里程碑 tag 对应：`v0.1.0-m1`、`v0.2.0-m2` ……

## [Unreleased]

### Added
- 项目启动：建立 `/docs` 留档体系（conversations / plans / decisions / changelog / releases / schema）与文档模板。
- 建立根 `README.md`：双仓库地址、双推配置、技术栈、数据契约速览、里程碑状态。
- 建立数据契约 `atlas-schema v1.0.0` 文档。
- 产出 M1 plan 与 design 文档、ADR-0001/0002/0003。
- 初始化 git 仓库并完成 GitHub / Gitee 首次双推（`4c73ba6`），统一开发分支为 `main`。
- 底图改用高德地图：新增 ADR-0004、`docs/guides/amap-setup.md`，更新 M1 plan/design 与 README（GCJ-02 坐标转换、分平台 Key）。
- 补充 iOS 高德 Key 申请说明（Bundle ID `com.openchronicle.atlas`、`atlas-ios`）。
- 补充 Web 端 Key 类型说明（JS API vs Web 服务）。

### Changed
- 无。

### Fixed
- 无。

### Docs
- `docs/conversations/2026-11-03-项目启动与M1方案.md`

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
