# 文档留档总则（docs）

本目录是 OpenChronicle Atlas 的**可追溯交付物**。任何需求、决策、变更、疑问与答复都必须落到这里；
任何代码、数据、配置改动都必须先有对应的 plan/design 文档。

## 目录

```
docs/
├── README.md                       # 本文件：留档规范与索引
├── conversations/                  # 对话档案（一轮一文件）
│   ├── _TEMPLATE.md
│   └── YYYY-MM-DD-<主题>.md
├── plans/                          # 计划与方案
│   ├── _TEMPLATE-plan.md
│   ├── _TEMPLATE-design.md
│   └── YYYY-MM-DD-<任务名>-plan.md / -design.md
├── decisions/                      # 架构决策记录
│   ├── _TEMPLATE.md
│   └── ADR-0001-<标题>.md
├── changelog/
│   └── CHANGELOG.md
├── releases/                       # 里程碑与发布说明
│   ├── _TEMPLATE.md
│   └── YYYY-MM-DD-<版本>-<里程碑>.md
├── guides/                         # 配置与操作指南（高德 Key、签名等）
│   └── amap-setup.md
└── schema/                         # 数据契约（版本化）
    └── atlas-schema-v1.0.0.md
```

## 每个任务的强制流程

1. **记录对话**：`docs/conversations/YYYY-MM-DD-<主题>.md`，含时间、参与者、原始需求、决策、疑问、待办。
2. **编写计划**：`docs/plans/` 下产出 `-plan.md`（目标/范围/步骤/风险/验收）与 `-design.md`（架构/数据结构/接口/取舍）。
3. **提交留档**：仅包含文档的 `docs:` 提交，推送 GitHub + Gitee 两个仓库。
4. **实施开发**：按计划编码；偏离计划必须先更新文档并说明原因。
5. **更新记录**：更新 `docs/changelog/CHANGELOG.md` 与相关文档后，再提交代码。
6. **里程碑归档**：`docs/releases/` 写发布说明，双仓打 tag（如 `v0.1.0-m1`）。

> 铁律：宁可延期，不可无档开发。缺失文档视为任务未完成。

## 命名规范

- 日期一律 `YYYY-MM-DD`（本地日期）。
- 文件名使用中文主题或任务名，避免空格，用 `-` 连接。
- ADR 编号四位递增，一经发布不修改编号；结论变更以新 ADR 覆盖并注明 `Supersedes`。

## 索引

### 对话档案
- [2026-11-03 项目启动与 M1 方案](conversations/2026-11-03-项目启动与M1方案.md)
- [2026-11-03 底图改用高德与 Android Key 申请](conversations/2026-11-03-底图改用高德与AndroidKey申请.md)
- [2026-11-03 iOS 高德 Key 申请](conversations/2026-11-03-iOSKey申请.md)
- [2026-11-03 Web Key 类型选择（JS API vs Web 服务）](conversations/2026-11-03-WebKey类型选择说明.md)
- [2026-11-03 Web 端 (JS API) Key 申请](conversations/2026-11-03-WebJSAPIKey申请.md)
- [2026-11-03 三端 Key 交付与 M1 启动](conversations/2026-11-03-Key交付与M1启动.md)

### 计划与方案
- [2026-11-03 M1 初始化脚手架 - 计划](plans/2026-11-03-M1-初始化脚手架-plan.md)
- [2026-11-03 M1 初始化脚手架 - 方案](plans/2026-11-03-M1-初始化脚手架-design.md)

### 架构决策
- [ADR-0001 三端技术选型与 monorepo 架构](decisions/ADR-0001-三端技术选型与monorepo架构.md)
- [ADR-0002 数据契约与 schema 版本策略](decisions/ADR-0002-数据契约与schema版本策略.md)
- [ADR-0003 双远程仓库同步策略](decisions/ADR-0003-双远程仓库同步策略.md)
- [ADR-0004 底图改用高德地图与坐标体系](decisions/ADR-0004-底图改用高德地图与坐标体系.md)

### 配置指南
- [高德地图 Key 与签名配置](guides/amap-setup.md)

### 数据契约
- [Atlas Schema v1.0.0](schema/atlas-schema-v1.0.0.md)

### 发布说明
- [v0.1.0-m1（M1）](releases/2026-11-03-v0.1.0-m1.md)
