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

## 五代十国专题

五代十国专题的疆域底面来自 **Seshat Cliopatria**（CC BY 4.0）。源数据对多数小政权只给单一切片
（如南唐 960—969、马楚 926—959），无法表现中途得失，本项目以其面做并/差推导细切片，
并补三处源数据未覆盖的区域：

- **福州（威武军）**：947 年入吴越，用阿里云 DataV / 高德现代「福州市 + 宁德市」行政边界 ∩ 闽面近似，标 `precision: schematic`；
- **秦凤四州（秦、凤、成、阶）**：957 年入后周，用现代天水市、成县、徽县、两当、武都、康县、凤县边界 ∩ 后蜀面近似；
- **泉漳（清源军）**：945—978 年由留从效、陈洪进据守，用现代泉州市、漳州市、莆田市、厦门市边界 ∩ 闽面近似；
- **武平**：952—963 年据湖南的地方政权，直接复用马楚湖南面，非独立测绘图；
- **唐（893—907）**：直接复用 Cliopatria `Tang Dynasty` 900—910 切片（与隋唐专题同源），并按吴越、杨吴面扣除其实际控制区，避免同期重叠。
- **据地/立国分离（2026-11-27）**：新增 `extensions.polityStatus`。立国面（`state`）用实线，藩镇据地（`regime`）用虚线且填充减半，部族羁縻（`tribal`）用点线浅填充。吴越 893—906、楚 896—906、闽 893—908、前蜀 893—906、南汉 905—916、荆南 907—923、杨吴 893—901 的据地面，以及岐（893—923）、晋（河东，893—923）、燕（895—906 刘仁恭、907—910 刘守光）、定难军、朔方军、归义军、静海军（905—939）、播州（杨氏）均按此规则显示。
- **唐面重新切片（2026-11-27）**：唐面按楚（896）、南汉（905）两个据地起点切成四段，每段减去同期所有非唐面，只保留唐廷直接控制区；`extensions.clipNote` 记录扣减数量。
- **新增 17 个政权/部族面（2026-11-27）**：岐、晋（河东）、燕、定难军、朔方军、归义军、甘州回鹘、吐蕃诸部、静海军、交趾、南诏、大长和、大天兴、大义宁、大理、播州（杨氏）、牂牁诸部。除南诏—大理五面跨期借用 Cliopatria `Kingdom of Dali` 960—969 面外，其余均用阿里云 DataV.GeoAtlas 现代省/市/县界与唐面做交、差推导，标 `precision: schematic`。
  这些面只表达大致范围，不是五代十国州界；南诏—大理五面与 9—10 世纪实际疆界有出入，已逐面写入 `extensions.note`。
- **海南岛**：Cliopatria 南汉切片未含海南，按现代海南省主岛并入南汉面，标 `schematic`。

上述近似面只表达大致范围，不是五代州界，不得作为边界测量或领土主张依据。

## 抗日战争专题

### 民国省界示意

抗日战争专题的 1931 / 1932—1937 / 1938—1944 / 1945 四张省界示意面来自 **江山时序（jiangshan-map）** 的一级政区 `region` 图层。

- 仓库：https://github.com/DeanChensj/jiangshan-map
- 文件：由 `scripts/export_geojson.js` 从 `js/atlas_snapshots.js` 导出 `snapshots/*.geojson`，再由 `scripts/import-roc-provinces.py` 提取 `layer=region` 要素
- 许可：**GPL-3.0**（仅 `region` 图层）；该项目的 `prefecture` 图层来自 CHGIS V6，本项目**不使用、不转载**
- 修改：按 1931、1932—1937、1938—1944、1945 四个时段筛选；简化到约 0.01°；补 `regionId`、短名、标识点、日期范围、来源与精度标记
- 精度：**手工绘制示意，非测绘边界**；界面标注「历史省界（示意）」，只描边不填充
- 范围：中华民国名义省区，不表示伪满洲国、汪伪政权或抗日根据地的实际控制线

> 该 GeoJSON 数据文件（`data/atlases/anti-japanese-war/territories/roc-provinces.geojson`）单独按 **GPL-3.0** 提供；本仓库其余代码与数据仍按 MIT 许可。转载或截图时请注明「江山时序 Jiangshan Atlas」及上述来源。

### 县治标注点位

- 县/地点标注点优先使用 **GeoNames**（https://www.geonames.org/，CC BY 4.0）的中国 populated places 坐标，按县名与 60km 邻域匹配；共 142 个县采用 GeoNames 点；
- 29 个县使用本项目事件中“县治同名地点”的坐标（如清苑县→保定、临榆县→山海关）；
- 其余 17 个县仍用事件坐标平均点，仅为示意；
- 所有县治点位登记在 `county-seats.json`，`scripts/build-region-data.py` 构建时优先应用；
- 点位只用于地图标注，不表示精确县治位置或县界。

引用建议：GeoNames geographical database, https://www.geonames.org/, licensed under CC BY 4.0.

### 地区索引

- `regions.json`、`region-index.json` 由本项目根据事件地名、省界点面判断与路线采样生成；
- 县级归属只在有把握时挂接，其余标为「地点」，不虚构县界；
- 民国县级地界没有可自由再分发的公开矢量数据，本项目**不绘制县界**。

## 其他疆域面


- 隋唐专题的「安史叛军控制区」为本项目手绘示意面，不属于 Cliopatria。
- 郑和专题的满剌加、古里、忽鲁谟斯、溜山、佐法儿、东非城邦、古吉拉特为本项目手绘示意面，不属于 Cliopatria。

## 明清专题

明清专题的疆域面来自 **World Empires** 的年度快照，其底层数据为 Seshat Cliopatria（CC BY 4.0），底图使用 Natural Earth（public domain）。

- 快照年份：1400、1500、1600、1700、1800、1900
- 修改：筛选 Ming / Qing 面，映射到本项目实体，补充时段、标识与说明
- 精度：学术估算，非精确国界

## 京杭大运河专题

京杭大运河的航道几何分两类：

1. **现存运河段**（会通河、通惠河、南运河、中运河、里运河、江南运河等）：
   取自 **OpenStreetMap** 的 `waterway=canal` 关系
   [1112801（京杭大运河）](https://www.openstreetmap.org/relation/1112801)，
   仅保留 `main_stream` 成员，按关系顺序拼接，用 Douglas-Peucker 0.02° 简化，
   再按本项目原有航段起止点截取。数据 © OpenStreetMap contributors，**ODbL 1.0**。
   下载日期：2026-11-23。
2. **隋唐通济渠、永济渠、汴河及 1855 年黄河改道影响段**：
   无开放授权的历史水系矢量数据，仍按《隋书》《中国运河志》等记载的沿线城镇连线，
   为 `precision: schematic` 示意折线，不是实测河道。

ODbL 只适用于上述 OSM 派生几何；事件文本仍为 CC-BY-4.0。

## 封面图

专题封面由项目负责人提供（豆包 AI 生成），由原始 2047×1152 统一缩放为 1600×900 JPEG。

- 封面为**示意插画**，不是历史照片或古代画作，人物、服饰、器物与场景不对应具体史实；
- 图中右下角保留生成工具「豆包 AI 生成」水印；
- 封面只叠加标题与年代两项文字，由客户端按 `coverText` 字段渲染，不写入图片；
- 抗日战争（`1.0.88`）、明清（`1.0.88`）封面已更换为新版 AI 插画，仍为示意；
- 此前使用的公有领域画作/老照片封面已于 `1.0.81` 停用，来源记录保留在 git 历史与 CHANGELOG（`1.0.77`—`1.0.80`）。

## 人工智能生成内容（AIGC）

本项目不是生成式人工智能服务：应用不提供 AI 对话、AI 绘图、AI 摘要等由用户触发的生成功能。
但专题封面属于人工智能生成合成内容，按《人工智能生成合成内容标识办法》（2025-09-01 施行）
与 GB 45438-2025 做显式与隐式标识。

- **显式标识**：图片右下角保留生成工具水印「豆包 AI 生成」；Web 与移动端的专题卡片另加
  「AI 生成示意图」角标；关于页与移动端「关于」写明封面为 AI 生成示意插画。
- **隐式标识**：11 张封面的 JPEG 文件元数据写入 XMP `TC260:AIGC`，字段包括
  `Label=1`、`ContentProducer=豆包（字节跳动）`、`ProduceID`、`ContentPropagator=史迹 · 时空地图`
  与 `PropagateID`；登记表见 [`ai-content.json`](ai-content.json)。
- **生成时间**：9 张为 2026-11-16，抗日战争与明清两张为 2026-11-17。
- **文本说明**：专题文本由项目整理，部分由 AI 辅助起草，经人工校订；仍为示意初稿，
  待史料页码级校订，不作为权威历史记录。
- **维护**：新增或替换 AI 封面后运行 `pnpm apply:aigc` 写入标识并重命名，
  提交前 `pnpm validate:data` 会校验水印声明、尺寸、文件名与 XMP 字段。

详细口径、商店提审话术与用户协议条款草案见
[`docs/guides/ai-content-labeling.md`](../../docs/guides/ai-content-labeling.md)。
