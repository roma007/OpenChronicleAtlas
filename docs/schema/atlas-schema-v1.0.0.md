# Atlas Schema v1.0.0（专题数据契约）

- **版本**：1.0.0
- **状态**：草案（M1 随代码落地 zod 实现后转正式）
- **日期**：2026-11-03
- **适用范围**：`data/atlases/<atlasId>/` 下所有数据包；Web / Android / iOS 三端共用
- **变更策略**：见 [ADR-0002](../decisions/ADR-0002-数据契约与schema版本策略.md)

> 平台只认本契约，不认任何具体历史专题。新增专题 = 新增一个符合本契约的数据包。

---

## 1. 数据包目录约定

```
data/atlases/<atlasId>/
├── manifest.json            # 必需，专题清单
├── routes/
│   └── *.geojson            # 必需（至少一个），按时间分段的路线
├── events/
│   └── *.json               # 必需（至少一个），事件数组
└── assets/                  # 可选，封面与图片
    └── ...
```

- `<atlasId>` 使用 `^[a-z0-9][a-z0-9-]*$`（小写字母、数字、连字符）。
- 所有路径字段均为**相对于 `manifest.json` 所在目录**的相对路径；也允许 `https://` 绝对 URL。
- 文件名建议与内容对应，避免中文与空格。

---

## 2. 通用类型

### 2.1 LocalizedString

```ts
type LocalizedString = string | { zh: string; en?: string };
```

- 单语言时可直接写 `string`。
- 多语言时至少提供 `zh`；缺失 `en` 时回退 `zh`。
- 渲染优先级：当前 locale → `zh` → 第一个可用值。

### 2.2 DateString / DateTimeString

| 类型 | 格式 | 示例 |
| --- | --- | --- |
| `DateString` | `YYYY-MM-DD` | `1935-01-15` |
| `DateTimeString` | ISO 8601（含时区或 `Z`） | `1935-01-15T09:30:00+08:00` |

- 平台内部统一转换为 **UTC 日粒度 epoch 毫秒**（`Date.UTC(y, m-1, d)`），避免时区导致时间轴漂移。
- 若提供 `DateTimeString`，取其 UTC 日期的 00:00 作为该事件的日粒度时间点。
- 结束时间早于开始时间视为**数据错误**，校验失败。

### 2.3 HexColor

`^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$`，如 `#b22222`。

---

## 3. manifest.json

### 3.1 示例

```jsonc
{
  "schemaVersion": "1.0.0",
  "id": "long-march",
  "title": { "zh": "长征", "en": "The Long March" },
  "subtitle": { "zh": "1934—1936", "en": "1934–1936" },
  "timeRange": { "start": "1934-10-10", "end": "1936-10-22" },
  "cover": "assets/cover.jpg",
  "description": { "zh": "## 简介\n中央红军……", "en": "## Overview\n…" },
  "defaultView": { "center": [108, 30], "zoom": 5 },
  "routes": ["routes/central-red-army.geojson"],
  "events": ["events/events.json"],
  "entities": [
    {
      "id": "central-red-army",
      "name": { "zh": "中央红军", "en": "Central Red Army" },
      "color": "#b22222",
      "description": { "zh": "红一方面军主力" }
    }
  ],
  "tags": ["中国近代史", "军事"],
  "license": "CC-BY-4.0",
  "updatedAt": "2026-11-03",
  "extensions": {}
}
```

### 3.2 字段定义

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `schemaVersion` | `string` | ✅ | 语义化版本，当前 `1.0.0` |
| `id` | `string` | ✅ | 与目录名一致，`^[a-z0-9][a-z0-9-]*$` |
| `title` | `LocalizedString` | ✅ | 专题标题 |
| `subtitle` | `LocalizedString` | ⬜ | 副标题，常为年代跨度 |
| `timeRange` | `{ start: DateString; end: DateString }` | ✅ | 时间轴总范围，`end >= start` |
| `cover` | `string` | ⬜ | 封面图路径/URL，建议 16:9，≥ 1200×675 |
| `description` | `LocalizedString` | ⬜ | Markdown 简介 |
| `defaultView` | `{ center: [lng, lat]; zoom: number }` | ✅ | 初始地图视野；`lng ∈ [-180,180]`，`lat ∈ [-85,85]`，`zoom ∈ [0,22]` |
| `routes` | `string[]` | ✅ | GeoJSON 文件路径，至少 1 个 |
| `events` | `string[]` | ✅ | 事件 JSON 文件路径，至少 1 个 |
| `entities` | `Entity[]` | ✅ | 路线主体（部队/商队/船队…），至少 1 个 |
| `tags` | `string[]` | ⬜ | 分类标签，用于首页筛选 |
| `license` | `string` | ⬜ | 数据许可，建议 SPDX 标识 |
| `updatedAt` | `DateString` | ⬜ | 数据最后更新日期 |
| `extensions` | `object` | ⬜ | 预留扩展位，平台忽略未知键 |

### 3.3 Entity

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | ✅ | 专题内唯一，`^[a-z0-9][a-z0-9-]*$` |
| `name` | `LocalizedString` | ✅ | 展示名 |
| `color` | `HexColor` | ✅ | 路线与图例颜色，需与底图对比度达标 |
| `description` | `LocalizedString` | ⬜ | 主体简介 |
| `order` | `number` | ⬜ | 图例排序，默认按数组顺序 |

---

## 4. 路线 GeoJSON

### 4.1 示例

```jsonc
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[116.02, 25.85], [115.5, 26.2], [114.9, 26.6]]
      },
      "properties": {
        "entityId": "central-red-army",
        "startDate": "1934-10-10",
        "endDate": "1934-11-01",
        "order": 1,
        "name": { "zh": "突破第一道封锁线" },
        "description": { "zh": "……" }
      }
    }
  ]
}
```

### 4.2 约束

- 顶层 `type` 必须为 `FeatureCollection`。
- `geometry.type` 仅支持 `LineString`（v1.0.0）；`MultiLineString` 预留到 MINOR 版本。
- 坐标顺序为 `[lng, lat]`，WGS84（EPSG:4326）。
- **展示层**：高德地图使用 GCJ-02，渲染前由 `packages/shared/src/geo/coordinate.ts` 统一转换；数据文件本身不得写入 GCJ-02。
- `properties` 字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `entityId` | `string` | ✅ | 必须存在于 `manifest.entities` |
| `startDate` | `DateString` | ✅ | 该段开始日期 |
| `endDate` | `DateString` | ✅ | 该段结束日期，`>= startDate` |
| `order` | `number` | ✅ | 同实体内的行进顺序，从 1 开始，允许重复但需能稳定排序 |
| `name` | `LocalizedString` | ⬜ | 段落名 |
| `description` | `LocalizedString` | ⬜ | 段落说明 |
| `extensions` | `object` | ⬜ | 预留 |

- **动画语义**：时间 `t` 落在 `[startDate, endDate]` 内时，按线段长度比例生长；`t >= endDate` 整段显示；`t < startDate` 隐藏。
- 同一实体的所有分段必须能被 `order` 串成一条连续路径；段间允许存在跳跃（如空运、海运换乘），由数据作者在 `name` 中说明。

---

## 5. 事件 JSON

### 5.1 示例

```jsonc
[
  {
    "id": "zunyi-1935-01",
    "atlasId": "long-march",
    "name": { "zh": "遵义会议", "en": "Zunyi Conference" },
    "date": "1935-01-15",
    "endDate": "1935-01-17",
    "location": { "lng": 106.92, "lat": 27.72, "place": { "zh": "贵州遵义" } },
    "entityIds": ["central-red-army"],
    "category": "重要会议",
    "summary": { "zh": "确立毛泽东在党中央和红军的领导地位。" },
    "description": { "zh": "## 背景\n……" },
    "images": [
      { "src": "assets/zunyi.jpg", "caption": { "zh": "遵义会议会址" }, "credit": "…", "license": "CC-BY-SA-4.0" }
    ],
    "sources": [
      { "title": "中国共产党历史（第一卷）", "url": "https://…", "author": "中共中央党史研究室", "year": 2011 }
    ],
    "relatedIds": ["sidu-chishui-1935-01"],
    "extensions": {}
  }
]
```

### 5.2 字段定义

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | ✅ | **全局唯一**（跨专题），建议 `<slug>-<YYYY-MM>`；`^[a-z0-9][a-z0-9-]*$` |
| `atlasId` | `string` | ✅ | 必须等于所属 manifest 的 `id` |
| `name` | `LocalizedString` | ✅ | 事件名 |
| `date` | `DateString` | ✅ | 事件发生日期（时间轴定位点） |
| `endDate` | `DateString` | ⬜ | 持续型事件结束日期，`>= date` |
| `location` | `Location` | ✅ | 事件地点 |
| `entityIds` | `string[]` | ✅ | 关联主体，至少 1 个，且均存在于 manifest |
| `category` | `string` | ✅ | 事件类型（会议/战斗/行军/外交…），建议各专题内自洽 |
| `summary` | `LocalizedString` | ✅ | 一句话概述（≤ 120 字） |
| `description` | `LocalizedString` | ⬜ | Markdown 详情 |
| `images` | `Image[]` | ⬜ | 图片列表，默认 `[]` |
| `sources` | `Source[]` | ⬜ | 史料来源，默认 `[]` |
| `relatedIds` | `string[]` | ⬜ | 关联事件 id，默认 `[]`；允许跨专题 |
| `importance` | `1 \| 2 \| 3` | ⬜ | 1 最高，用于地图层级与聚合权重，默认 2 |
| `extensions` | `object` | ⬜ | 预留 |

### 5.3 Location

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `lng` | `number` | ✅ | 经度，`[-180, 180]` |
| `lat` | `number` | ✅ | 纬度，`[-85, 85]` |
| `place` | `LocalizedString` | ⬜ | 地名，如「贵州遵义」 |
| `altitude` | `number` | ⬜ | 海拔（米），预留 |

### 5.4 Image

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | ✅ | 相对路径或 URL |
| `caption` | `LocalizedString` | ⬜ | 图注 |
| `credit` | `string` | ⬜ | 作者/提供方 |
| `license` | `string` | ⬜ | 许可标识（SPDX 或说明） |
| `width` / `height` | `number` | ⬜ | 原始尺寸，用于占位防抖动 |

### 5.5 Source

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | ✅ | 史料名称 |
| `url` | `string` | ⬜ | 链接（优先公有领域/可访问来源） |
| `author` | `string` | ⬜ | 作者/机构 |
| `year` | `number` | ⬜ | 出版年份 |
| `note` | `string` | ⬜ | 备注（版本、页码、存疑说明） |

---

## 6. 跨文件一致性校验规则（v1.0.0）

1. `manifest.id` 与目录名一致。
2. `manifest.schemaVersion` 的 MAJOR 必须被客户端支持（当前仅 `1.x`）。
3. 所有 `route.properties.entityId` ∈ `manifest.entities[].id`。
4. 所有 `event.atlasId` = `manifest.id`。
5. 所有 `event.entityIds[]` ∈ `manifest.entities[].id`，且非空。
6. 所有 `event.id` 全局唯一（加载器维护索引，重复即报错）。
7. 所有 `event.relatedIds[]` 必须能在本专题或已加载专题中解析；否则记为 warning，不阻断渲染。
8. `timeRange` 应覆盖所有路线分段与事件的日期；越界记 warning。
9. 路线分段的 `order` 在同一 `entityId` 内应唯一；重复记 warning。
10. 未知字段保留不报错；已知字段类型错误报 error 并给出 JSON Path。

**错误等级**：`error` 阻断加载；`warning` 仅记录并在开发模式控制台输出。

---

## 7. 版本历史

| 版本 | 日期 | 变更 | 兼容性 |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-03 | 首版：manifest / GeoJSON / 事件 / 多语言 / 校验规则 | — |

---

## 8. 演进预留（不早于 1.1.0）

以下字段/能力已预留，实现前需新增 ADR 并升级 MINOR：

- `MultiLineString` / `MultiPolygon` 几何（区域型专题，如战役范围）。
- `entity.relations`（主体间指挥/同盟关系）。
- `event.media.video` / `audio`。
- `route.segments[].elevation`（地形剖面）。
- `manifest.i18n.locales` 声明可用语言列表。
- 时间精度到「时」的 `precision: "day" | "hour"`。
