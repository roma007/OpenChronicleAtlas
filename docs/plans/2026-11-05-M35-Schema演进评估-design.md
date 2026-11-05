# M35 Schema v1.1 演进评估与兼容实现 — 方案

- **日期**：2026-11-05
- **里程碑**：M35（v0.35.0-m35）
- **状态**：已完成
- **关联计划**：[2026-11-05-M35-Schema演进评估-plan.md](2026-11-05-M35-Schema演进评估-plan.md)

## 1. 三类演进评估

### 1.1 事件别名（采纳）

- 字段：`AtlasEvent.aliases?: LocalizedString[]`
- 用途：同一事件的不同通行名称，如「七七事变」与「卢沟桥事变」。
- 兼容性：可选字段，旧数据不受影响。
- 搜索：别名拼入 `fields.name`，与正式名同权重。

### 1.2 路线分段类型（采纳）

- 字段：`AtlasRouteProperties.segmentType?: RouteSegmentType`
- 枚举：
  - `advance` 进攻/前进
  - `retreat` 撤退/突围
  - `defense` 防御
  - `counterattack` 反击
  - `naval` 航行
  - `supply` 补给
  - `other` 其他
- 兼容性：可选字段，旧数据不受影响。
- 本轮只定义类型与校验，不接入 UI 样式。

### 1.3 公元前日期（暂缓）

- 现状：`DateString` 固定 `YYYY-MM-DD`，时间轴与格式化均按公元日期处理。
- 可选方案：
  1. 扩展为带符号年份（`-0218-01-01`）；
  2. 使用 ISO 8601 扩展日期；
  3. 增加 `dateLabel` 仅用于展示，内部仍用近似公元日期。
- 结论：暂缓到 v2.0。需要同时改造日期解析、时间轴刻度、格式化、分享参数与全部数据，风险高于本轮范围。

## 2. 类型与校验

`packages/shared/src/types.ts`：

```ts
export type RouteSegmentType =
  | 'advance'
  | 'retreat'
  | 'defense'
  | 'counterattack'
  | 'naval'
  | 'supply'
  | 'other';

export interface AtlasRouteProperties {
  // ...
  segmentType?: RouteSegmentType;
}

export interface AtlasEvent {
  // ...
  aliases?: LocalizedString[];
}
```

`packages/shared/src/schema/atlas.ts`：

- `routeSegmentTypeSchema = z.enum([...])`；
- route properties 增加 `segmentType` 可选；
- event 增加 `aliases: z.array(localizedStringSchema).optional()`。

## 3. 搜索

`buildSearchIndex` 中：

```ts
const name = [
  allLocalized(event.name),
  ...(event.aliases ?? []).map(allLocalized),
].join(' ');
```

- 别名进入 `fields.name`；
- 搜索结果仍展示正式名；
- 不需要修改 `SearchEvent` 摘要。

## 4. 数据

为 6 个事件补充别名：

- 九一八事变：沈阳事变；
- 卢沟桥事变：七七事变；
- 平型关大捷：平型关战斗；
- 台儿庄战役：台儿庄大捷；
- 百团大战：百团战役；
- 第一次长沙会战：长沙会战。

manifest 与 `index.json` 的 `schemaVersion` 升为 `1.1.0`。

## 5. 测试

- `aliases` 通过 eventSchema；
- `segmentType` 通过 routeFeatureSchema；
- 未知 segmentType 被拒绝；
- 搜索「七七事变」命中卢沟桥事变。

## 6. 验收

- schema v1.1 文档与 ADR-0009；
- manifest 1.1.0；
- 别名搜索可用；
- 版本 `0.35.0` / build 32；
- 双仓 tag。
