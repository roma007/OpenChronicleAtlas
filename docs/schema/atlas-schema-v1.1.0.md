# Atlas Schema v1.1.0（专题数据契约）

- **版本**：1.1.0
- **状态**：正式
- **日期**：2026-11-05
- **适用范围**：`data/atlases/<atlasId>/` 下所有数据包；Web / Android / iOS 三端共用
- **基础版本**：[Atlas Schema v1.0.0](atlas-schema-v1.0.0.md)
- **变更策略**：见 [ADR-0002](../decisions/ADR-0002-数据契约与schema版本策略.md)
- **演进决策**：见 [ADR-0009](../decisions/ADR-0009-Schema-v1.1演进.md)

> v1.1.0 是向后兼容的小版本：只新增可选字段，不修改既有字段语义。
> 读取方必须继续接受 v1.0.0 数据；写入方可将 `schemaVersion` 标为 `1.1.0`。

---

## 1. 相对 v1.0.0 的变化

| 变化 | 位置 | 必填 | 说明 |
| --- | --- | --- | --- |
| 事件别名 `aliases` | `AtlasEvent` | ⬜ | 同一事件的其他通行名称 |
| 路线分段类型 `segmentType` | `AtlasRouteProperties` | ⬜ | 进攻、撤退、防御、反击等语义 |
| `schemaVersion` | `manifest.json` / `index.json` | ✅ | 新数据建议写 `1.1.0` |

未变化：

- `DateString` 仍为 `YYYY-MM-DD`，暂不支持公元前日期；
- 事件、路线、实体、来源、图片等既有字段语义不变；
- 搜索索引文件格式不变。

---

## 2. 事件别名

### 2.1 定义

```ts
aliases?: LocalizedString[];
```

- 可选；用于同一事件的不同通行名称；
- 每项遵循 `LocalizedString` 规则；
- 不替代 `name`，搜索结果仍展示 `name`；
- 别名会进入搜索索引的名称字段，与正式名同权重。

### 2.2 示例

```jsonc
{
  "id": "lugouqiao-incident-1937-07",
  "name": { "zh": "卢沟桥事变", "en": "Marco Polo Bridge Incident" },
  "aliases": [
    { "zh": "七七事变", "en": "July 7 Incident" }
  ],
  "date": "1937-07-07"
}
```

### 2.3 约束

- 别名不得为空字符串；
- 同一事件的别名应避免与正式名完全重复；
- 别名不参与事件详情标题展示，只用于检索与说明。

---

## 3. 路线分段类型

### 3.1 定义

```ts
type RouteSegmentType =
  | 'advance'
  | 'retreat'
  | 'defense'
  | 'counterattack'
  | 'naval'
  | 'supply'
  | 'other';

segmentType?: RouteSegmentType;
```

| 值 | 含义 |
| --- | --- |
| `advance` | 进攻 / 前进 |
| `retreat` | 撤退 / 突围 |
| `defense` | 防御 / 驻守 |
| `counterattack` | 反击 / 反攻 |
| `naval` | 航行 / 海上路线 |
| `supply` | 补给 / 运输 |
| `other` | 其他 |

### 3.2 示例

```jsonc
{
  "type": "Feature",
  "geometry": { "type": "LineString", "coordinates": [[112.94, 28.23], [113.13, 29.36]] },
  "properties": {
    "entityId": "china-resistance",
    "startDate": "1941-12-24",
    "endDate": "1942-01-15",
    "order": 18,
    "segmentType": "counterattack",
    "name": { "zh": "第三次长沙会战（中国军队反击）" }
  }
}
```

### 3.3 约束

- 可选字段；缺失时按 `other` 处理；
- 当前只做契约与校验，UI 图例与线型后续接入；
- 不得用 `segmentType` 替代 `name` 或 `description`。

---

## 4. 兼容性

- v1.0.0 数据无需修改即可被 v1.1 读取方加载；
- v1.1 数据在旧读取方中会忽略新增字段，仍可正常展示；
- 若旧读取方严格校验未知字段，应升级到支持 v1.1 的版本；
- `schemaVersion` 的 major 仍为 `1`，loader 继续接受 `1.x`。

---

## 5. 公元前日期（未支持）

v1.1 仍不支持公元前日期。相关评估与后续计划见 [ADR-0009](../decisions/ADR-0009-Schema-v1.1演进.md)。

未来若支持，必须同时更新：

- `DateString` 解析与校验；
- 时间轴刻度与范围；
- 日期格式化与分享参数；
- 全部专题数据与搜索索引。
