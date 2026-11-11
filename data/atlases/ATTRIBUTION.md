# 疆域数据来源与许可

本仓库的「时代疆域遮罩」数据中，隋唐、宋元、三国三个专题的疆域面来自 **Seshat Cliopatria**，按 CC BY 4.0 许可使用。

- 数据集：Cliopatria — A geospatial database of world-wide political entities from 3400 BCE to 2024 CE
- 仓库：https://github.com/Seshat-Global-History-Databank/cliopatria
- 论文：Bennett, J. S., Mutch, E., & Chalstrey, E. (2025). Cliopatria. *Scientific Data*.
- 许可：CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- 引用建议：Seshat Cliopatria, Seshat: Global History Databank, licensed under CC BY 4.0.

## 本项目所做的修改

1. 按各专题时间范围筛选 Cliopatria 的政权记录；
2. 将政权名称映射到本项目的实体（如 Cao Wei → 曹魏、Great Jin → 金）；
3. 对起止年份做少量衔接调整，避免同一时期政权面重叠；
4. 增加中文/英文短标识与标识落点；
5. 保留原始 Polygon / MultiPolygon 几何，未做投影变换。

## 精度说明

Cliopatria 的边界来自历史地图的数字化与人工校订，属于**学术估算**，不是精确国界。其精度高于本项目此前的手绘示意面，但仍不应作为边界测量或领土主张的依据。

## 其他疆域面

- 隋唐专题的「安史叛军控制区」为本项目手绘示意面，不属于 Cliopatria。

## 明清专题

明清专题的疆域面来自 **World Empires** 的年度快照，其底层数据为 Seshat Cliopatria（CC BY 4.0），底图使用 Natural Earth（public domain）。

- 快照年份：1400、1500、1600、1700、1800、1900
- 修改：筛选 Ming / Qing 面，映射到本项目实体，补充时段、标识与说明
- 精度：学术估算，非精确国界
