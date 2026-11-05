# M35 Schema v1.1 演进评估与兼容实现 — 计划

- **日期**：2026-11-05
- **里程碑**：M35（v0.35.0-m35）
- **状态**：执行中
- **关联**：
  - [对话档案](../conversations/2026-11-05-M35启动与Schema演进.md)
  - [M35 方案](2026-11-05-M35-Schema演进评估-design.md)
  - [完整开发计划与进度清单](2026-11-05-完整开发计划与进度清单-plan.md)

## 1. 背景

数据契约 v1.0.0 已稳定支撑 4 个专题。继续扩展时需要评估三类演进：公元前日期、事件别名、路线分段类型。前两者影响数据表达，第三者影响路线语义与未来样式。

## 2. 目标

1. 产出 ADR-0009，明确三类演进取舍；
2. 以可选字段实现事件别名；
3. 以可选枚举实现路线分段类型；
4. 别名进入搜索索引；
5. 发布 schema v1.1 文档并升级 manifest。

## 3. 范围

- `docs/decisions/ADR-0009-...`（新建）；
- `docs/schema/atlas-schema-v1.1.0.md`（新建）；
- `packages/shared/src/types.ts`；
- `packages/shared/src/schema/atlas.ts`；
- `packages/shared/src/search/index.ts`；
- `data/atlases/*/manifest.json`、`data/atlases/index.json`；
- `data/atlases/anti-japanese-war/events/events.json`；
- 测试、版本、tag。

## 4. 实施步骤

| 步骤 | 内容 | 产出 |
| --- | --- | --- |
| S1 | 对话、plan/design 留档 | docs |
| S2 | ADR-0009 与 schema v1.1 | docs |
| S3 | 类型、zod、搜索改造 | shared |
| S4 | 别名数据与 manifest 升级 | data |
| S5 | 测试、版本、部署、tag | `v0.35.0-m35` |

## 5. 风险

| 风险 | 影响 | 处理 |
| --- | --- | --- |
| 别名导致搜索误命中 | 体验 | 别名只加入 name 字段，权重与正式名相同 |
| schema 版本升级影响旧数据 | 兼容性 | 新字段全部可选，loader 仍支持 major 1 |
| 公元前日期实现复杂 | 排期 | 本轮只评估，不实现 |

## 6. 验收

- `aliases` / `segmentType` 校验通过；
- 别名搜索命中；
- manifest 全部 1.1.0；
- schema 文档与 ADR 完成；
- 测试、lint、typecheck、build 通过；
- 双仓 tag 一致。
