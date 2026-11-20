# Atlas Schema v1.2.0（专题数据契约）

- **版本**：1.2.0
- **状态**：正式
- **日期**：2026-11-20
- **适用范围**：`data/atlases/<atlasId>/` 下所有数据包；Web / Android / iOS 三端共用
- **基础版本**：[Atlas Schema v1.1.0](atlas-schema-v1.1.0.md)
- **变更策略**：见 [ADR-0002](../decisions/ADR-0002-数据契约与schema版本策略.md)
- **演进决策**：见 [ADR-0011](../decisions/ADR-0011-地区索引与历史省界.md)

> v1.2.0 是向后兼容的小版本：只新增可选字段，不修改既有字段语义。
> 读取方必须继续接受 v1.0/v1.1 数据；写入方可把 `schemaVersion` 标为 `1.2.0`。

---

## 1. 相对 v1.1.0 的变化

| 变化 | 位置 | 必填 | 说明 |
| --- | --- | --- | --- |
| 地区字典 `regions` | `manifest.json` | ⬜ | 历史行政区/地点字典文件，相对 manifest 路径 |
| 地区索引 `regionIndex` | `manifest.json` | ⬜ | 事件/路线 → 地区 id 的构建期索引 |
| 事件地区 `regionIds` | `AtlasEvent.location` | ⬜ | 从省到最细一级的地区 id |
| 路线地区 `regionIds` | `AtlasRouteProperties` | ⬜ | 路线经过的地区 id |
| 路线端点地区 `endpointRegionIds` | `AtlasRouteProperties` | ⬜ | 起点、终点所在地区 id |
| `schemaVersion` | `manifest.json` | ✅ | 新数据建议写 `1.2.0` |

未变化：

- `DateString` 仍为 `YYYY-MM-DD`；
- 事件、路线、实体、来源、图片等既有字段语义不变；
- 搜索索引文件格式不变；
- 旧客户端忽略新增字段，仍可加载。

---

## 2. 地区字典

### 2.1 manifest

```jsonc
{
  "schemaVersion": "1.2.0",
  "regions": "regions.json",
  "regionIndex": "region-index.json"
}
```

### 2.2 `regions.json`

```jsonc
{
  "schemaVersion": "1.0.0",
  "frame": "ROC-1937",
  "regions": [
    {
      "id": "hebei",
      "level": "province",
      "parentId": null,
      "name": { "zh": "河北省", "en": "Hebei Province" },
      "shortName": { "zh": "河北", "en": "Hebei" },
      "aliases": ["河北"],
      "modernName": { "zh": "今河北省、北京市、天津市" },
      "validFrom": "1931-09-18",
      "validTo": "1945-12-31"
    },
    {
      "id": "county-hebei-qingyuan",
      "level": "county",
      "parentId": "hebei",
      "name": { "zh": "清苑县" },
      "aliases": ["清苑"]
    },
    {
      "id": "place-hebei-baoding",
      "level": "place",
      "parentId": "county-hebei-qingyuan",
      "name": { "zh": "保定" },
      "aliases": ["河北保定"],
      "modernName": { "zh": "今河北保定" },
      "point": [115.49, 38.87]
    }
  ]
}
```

`level` 枚举：

| 值 | 说明 |
| --- | --- |
| `province` | 省 |
| `municipality` | 院辖市 / 英属香港等省级并列单位 |
| `county` | 县、省辖市或地理区（如海南岛） |
| `place` | 镇、关、岛、战场等地点 |
| `overseas` | 海外 |

约束：

- `id` 只含小写字母、数字、连字符；
- `parentId` 必须存在，一级地区为 `null`；
- 父子关系不得成环；
- `place` 必须有 `parentId`；
- `point` 为 `[lng, lat]`，WGS84。

---

## 3. 地区索引

`region-index.json` 由构建脚本生成，禁止手改：

```jsonc
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2026-11-20",
  "events": {
    "mukden-incident-1931-09": ["liaoning", "place-liaoning-shenyang"]
  },
  "routes": {
    "japanese-invasion:1": {
      "regionIds": ["liaoning", "jilin", "place-..."] ,
      "endpointRegionIds": ["liaoning", "jilin"]
    }
  }
}
```

- `routes` 的键为 `entityId:order`；
- 所有 id 必须存在于 `regions.json`；
- 事件、路线键必须能对应到真实数据。

---

## 4. 事件与路线

### 4.1 事件

```jsonc
{
  "location": {
    "lng": 116.2,
    "lat": 39.6,
    "place": { "zh": "河北保定" },
    "regionIds": ["hebei", "county-hebei-qingyuan", "place-hebei-baoding"]
  }
}
```

### 4.2 路线

```jsonc
{
  "properties": {
    "regionIds": ["hebei", "shanxi", "place-..."],
    "endpointRegionIds": ["hebei", "shanxi"]
  }
}
```

---

## 5. 筛选语义

- `regionIds` 为空：不过滤；
- 选中多个地区：并集（任一命中即保留）；
- 选区同时包含省和其下县时，**只保留最具体的一级**（县覆盖省），避免按县筛选退化成按省；
- 跨省路线不裁剪：只要 `regionIds` 命中选区，整条保留；端点标签在放大到 6 级后显示。

---

## 6. 校验

- `pnpm validate:data` 会调用 `scripts/check-region-index.ts`；
- 校验：所有 `regionIds` 存在、父子关系有效、事件/路线归属完整、`regionIndex` 键可对应；
- 省界 GeoJSON 仍走 `territories` 校验，`extensions.kind = "admin-boundary"` 只描边不填充。
