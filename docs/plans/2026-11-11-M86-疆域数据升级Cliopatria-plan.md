# M86 疆域数据升级为 Cliopatria — 计划

- **日期**：2026-11-11
- **里程碑**：M86（v0.86.0-m86）
- **状态**：已完成
- **关联**：
  - [对话档案](../conversations/2026-11-11-M86-疆域数据升级Cliopatria.md)
  - [M86 方案](2026-11-11-M86-疆域数据升级Cliopatria-design.md)
  - [疆域数据来源与许可](../../data/atlases/ATTRIBUTION.md)
  - [完整开发计划与进度清单](2026-11-05-完整开发计划与进度清单-plan.md)

## 1. 背景

M83—M85 的疆域面为手绘示意数据，平均 13.3 个顶点，边界误差约 100—300 km。用户要求提升到「可以免费获取到的最高精度」。经过许可与覆盖评估，选择 CC BY 4.0 的 Seshat Cliopatria。

## 2. 目标

1. 用 Cliopatria 多边形替换三国、隋唐、宋元的手绘疆域面；
2. 按 Cliopatria 的政权时段切分，保留时间变化；
3. 新增宋元实体 `western-xia`、`dali`；
4. 增加可复现的导入脚本与 CC BY 4.0 署名；
5. 保持数据契约 `1.1.0`。

## 3. 范围

- `data/atlases/three-kingdoms/territories/territories.geojson`；
- `data/atlases/sui-tang/territories/territories.geojson`；
- `data/atlases/song-yuan/territories/territories.geojson`；
- `data/atlases/song-yuan/manifest.json`（新增 2 个实体）；
- `data/atlases/ATTRIBUTION.md`（新增）；
- `scripts/import-cliopatria-territories.py`（新增）；
- `docs/schema/atlas-schema-v1.1.0.md`、README；
- 文档、版本、tag。

## 4. 实施步骤

| 步骤 | 内容 | 产出 |
| --- | --- | --- |
| S1 | 对话、plan/design 留档 | docs |
| S2 | 下载 Cliopatria 并编写导入脚本 | script |
| S3 | 导入三专题疆域面、新增实体 | data |
| S4 | 重叠检查、校验、索引 | data |
| S5 | 构建、部署、双仓 tag | `v0.86.0-m86` |

## 5. 风险

| 风险 | 影响 | 处理 |
| --- | --- | --- |
| Cliopatria 边界仍为学术估算 | 误认为精确国界 | 标注 `precision: dataset` + 署名 + 说明 |
| 政权时段首尾重叠 | 同期面重叠 | 调整衔接日期并做网格采样 |
| 文件体积增大 | 加载变慢 | 保留原始几何，当前三文件合计约 1.5 MB |
| 许可要求 | 合规风险 | CC BY 4.0 署名 + ATTRIBUTION.md |
| 新增实体无事件 | 图例显示 0 段 | 可接受，仅用于疆域背景 |

## 6. 验收

- 三专题疆域面全部来自 Cliopatria；
- 同期不同政权 0 个非预期重叠；
- 安史控制区保留为有意叠加；
- 9 专题 / 531 事件 / 443 路线段校验通过；
- 双仓 tag 一致。
