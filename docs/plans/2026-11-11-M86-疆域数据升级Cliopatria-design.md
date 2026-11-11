# M86 疆域数据升级为 Cliopatria — 方案

- **日期**：2026-11-11
- **里程碑**：M86（v0.86.0-m86）
- **状态**：执行中
- **关联计划**：[2026-11-11-M86-疆域数据升级Cliopatria-plan.md](2026-11-11-M86-疆域数据升级Cliopatria-plan.md)

## 1. 数据源

| 项 | 值 |
| --- | --- |
| 数据集 | Seshat Cliopatria |
| 版本 | `cliopatria_polities_only_v021.geojson` |
| 记录数 | 13,797 条政权 / 时段记录 |
| 覆盖 | 3400 BCE—2024 CE |
| 许可 | CC BY 4.0 |
| 仓库 | https://github.com/Seshat-Global-History-Databank/cliopatria |
| 论文 | Bennett, Mutch & Chalstrey, *Scientific Data* (2025) |

## 2. 导入映射

脚本：`scripts/import-cliopatria-territories.py`

```
python3 scripts/import-cliopatria-territories.py /path/to/cliopatria_polities_only_v021.geojson
```

- 按 `Name + FromYear + ToYear` 精确匹配记录；
- 将记录映射到本项目 `entityId`；
- 按专题时间范围裁剪起止日期；
- 保留原始 Polygon / MultiPolygon；
- 写入 `label`、`labelPoint`、`opacity`、`extensions`。

## 3. 三国

| 实体 | Cliopatria 记录 | 本项目时段 |
| --- | --- | --- |
| 曹魏 | Cao Wei 224—237 / 238—262 / 263—264 | 0220-01-01 → 0266-01-31 |
| 蜀汉 | Shu Han 224—237 / 238—260 / 261—262 | 0221-04-01 → 0263-10-31 |
| 东吴 | Eastern Wu 207—237 / 238—262 / 263—269 / 270—282 | 0229-04-01 → 0280-03-31 |
| 西晋 | Western Jin 265—282 | 0266-02-01 → 0280-03-31 |

共 11 个面。263 年蜀汉灭亡与魏接收之间按 263-10-31 / 263-11-01 衔接。

## 4. 隋唐

| 实体 | Cliopatria 记录 | 本项目时段 |
| --- | --- | --- |
| 隋 | Sui Dynasty 587—591 至 617—622 | 0581-02-01 → 0618-05-31 |
| 唐 | Tang Dynasty 623—625 至 900—910 | 0618-06-01 → 0907-04-30 |
| 吐蕃 | Tibetan Empire 623—626 至 840—849 | 0620-01-01 → 0850-12-31 |
| 安史 | 无 Cliopatria 记录 | 保留手绘示意面 0755-11-01 → 0763-03-31 |

共 63 个面。唐、吐蕃按 Cliopatria 时段逐段切换。

## 5. 宋元

| 实体 | Cliopatria 记录 | 本项目时段 |
| --- | --- | --- |
| 北宋 | Northern Song 961—969 至 1126—1138 | 0960-02-01 → 1127-03-31 |
| 辽 | Liao Dynasty 960—979 至 1111—1125 | 0960-02-01 → 1125-03-31 |
| 金 | Great Jin 1126—1138 至 1227—1235 | 1126-01-01 → 1234-02-28 |
| 南宋 | Southern Song 1139—1240 至 1272—1278 | 1127-06-01 → 1279-03-31 |
| 西夏 | Western Xia 1040—1125 至 1220—1226 | 1038-10-01 → 1227-07-31 |
| 蒙古 | Mongol Empire 1206—1209 至 1272—1278 | 1206-01-01 → 1279-03-31 |
| 大理 | Kingdom of Dali 947—969 至 1250—1259 | 0960-02-01 → 1253-12-31 |

共 42 个面。新增实体：

| id | 名称 | 颜色 |
| --- | --- | --- |
| `western-xia` | 西夏 / Western Xia | `#6b7c3a` |
| `dali` | 大理 / Dali | `#c05621` |

## 6. 重叠处理

- 同期不同政权按 Cliopatria 记录切分；
- 对衔接月份做微调：
  - 蜀汉结束 0263-10-31，曹魏接收面从 0263-11-01 开始；
  - 西夏结束 1227-07-31，蒙古 1227 面从 1227-08-01 开始；
- 安史控制区与唐面重叠为有意叠加；
- 使用 1° 网格采样检查，非预期重叠为 0。

## 7. 许可与署名

- 每个疆域面 `extensions.source = "Seshat Cliopatria (CC BY 4.0)"`；
- 每个面保留 `sourceFeature`（名称、年份、Wikidata）；
- 新增 `data/atlases/ATTRIBUTION.md`；
- 三个 manifest 的 `license` 更新为 CC BY 4.0 + Cliopatria 说明；
- README 增加数据来源与许可章节。

## 8. 验收

- 三国 11 面、隋唐 63 面、宋元 42 面；
- 非预期重叠 0；
- 版本 `0.86.0` / build 83。
