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

## 郑和下西洋专题

郑和专题的疆域面同样来自 **Seshat Cliopatria**（CC BY 4.0），通过 Seshat API 按政权记录 ID 获取，生成脚本为 `scripts/build-zheng-he-territories.py`。

- 采用政权：明、占城、真腊、暹罗、满者伯夷、苏门答剌、锡兰、毗奢耶那伽罗、巴赫曼尼、榜葛剌、拉苏里、马穆鲁克；
- 时间：按专题范围 1405-07-11 → 1433-07-22 裁剪，明、占城、满者伯夷、马穆鲁克按 Cliopatria 的分段记录切换；
- 补绘：Cliopatria 未收录满剌加、古里（马拉巴尔诸港）、忽鲁谟斯、溜山、佐法儿、东非城邦与古吉拉特，这些面由本项目按史料大致范围手绘，`extensions.precision` 标记为 `schematic`；
- 注记：东番（台湾）为示意标注面，`opacity: 0`，只描边不填充，不表示明朝行政疆域；说明文字为“明朝东南海防范围，未设府县”；
- 海防线：郑和专题另有“明朝海防线”示意线，分大陆海岸与台澎两段，综合明初沿海卫所、巡检司、水寨与明中后期台澎海防；`extensions.precision = "schematic"`，`extensions.static = true`。该实体标记 `extensions.legend = false`，只作为地图背景防线显示，不列入航线图例，也不代表某一年份的精确布防；
- 精度：Cliopatria 面为学术估算，手绘面与海防线仅表示大致范围，均不是精确国界。

## 其他疆域面

- 隋唐专题的「安史叛军控制区」为本项目手绘示意面，不属于 Cliopatria。
- 郑和专题的满剌加、古里、忽鲁谟斯、溜山、佐法儿、东非城邦、古吉拉特为本项目手绘示意面，不属于 Cliopatria。

## 明清专题

明清专题的疆域面来自 **World Empires** 的年度快照，其底层数据为 Seshat Cliopatria（CC BY 4.0），底图使用 Natural Earth（public domain）。

- 快照年份：1400、1500、1600、1700、1800、1900
- 修改：筛选 Ming / Qing 面，映射到本项目实体，补充时段、标识与说明
- 精度：学术估算，非精确国界

## 封面图

专题封面由项目负责人提供（豆包 AI 生成），由原始 2047×1152 统一缩放为 1600×900 JPEG。

- 封面为**示意插画**，不是历史照片或古代画作，人物、服饰、器物与场景不对应具体史实；
- 图中右下角保留生成工具「豆包 AI 生成」水印；
- 封面只叠加标题与年代两项文字，由客户端按 `coverText` 字段渲染，不写入图片；
- 抗日战争（`1.0.88`）、明清（`1.0.88`）封面已更换为新版 AI 插画，仍为示意；
- 此前使用的公有领域画作/老照片封面已于 `1.0.81` 停用，来源记录保留在 git 历史与 CHANGELOG（`1.0.77`—`1.0.80`）。
