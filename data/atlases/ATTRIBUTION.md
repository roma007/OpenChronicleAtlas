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

## 封面图来源与许可

专题封面均为公有领域（Public Domain）或 CC0 的历史画作、老照片与实物照片，统一裁切为 16:9、缩放为 1600×900，并转为 JPEG。原图仅作构图裁切；封面上的专题标题、年代、关键词、OpenChronicle Atlas 标识与「示意图」注记为本站叠加的文字版式，不属于原图。

| 专题 | 封面 | 作者 / 来源 | 许可 |
| --- | --- | --- | --- |
| 三国 | 商喜《关羽擒将图》（明） | 故宫博物院藏；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Shang_Xi,_Guan_Yu_Captures_General_Pang_De.JPG) | Public Domain |
| 隋唐 | 阎立本《步辇图》（唐，宋摹本） | 故宫博物院藏；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Emperor_Taizong_gives_an_audience_to_the_ambassador_of_Tibet.jpg) | Public Domain |
| 宋元 | 张择端《清明上河图》虹桥段（北宋） | 故宫博物院藏；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Along_the_River_During_the_Qingming_Festival_%28detail_of_original%29.jpg) | Public Domain |
| 明清 | 徐扬等《乾隆南巡图》第四卷（清） | 大都会艺术博物馆；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E6%B8%85_%E5%BE%90%E6%8F%9A%E7%AD%89_%E4%B9%BE%E9%9A%86%E5%8D%97%E5%B7%A1%E5%9C%96,_%E7%AC%AC%E5%9B%9B%E5%8D%B7%EF%B9%95%E9%BB%83%E6%B7%AE%E4%BA%A4%E6%B5%81-The_Qianlong_Emperor%27s_Southern_Inspection_Tour,_Scroll_Four-_The_Confluence_of_the_Huai_and_Yellow_Rivers_%28Qianlong_nanxun,_juan_si-_Huang_Huai_jiaoliu%29_MET_DP105279.jpg) | CC0 |
| 郑和下西洋 | 郑和宝船模型（博物馆藏） | 摄影：Gary Todd；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Zheng_He_Treasure_Ship_Model_%2815829289311%29.jpg) | CC0 |
| 京杭大运河 | 「Peking end of world famous grand canal」（约 1900 年） | 美国国会图书馆；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Peking_end_of_world_famous_grand_canal_LCCN2006691458.jpg) | Public Domain |
| 徐霞客游记 | 石涛《黄山图》（清） | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Shitao02.jpg) | Public Domain |
| 玄奘西行 | 《玄奘负笈图》（日本摹本） | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Xuanzang_w.jpg) | Public Domain |
| 长征 | 九曲黄河第一湾（若尔盖草地） | 摄影：Zhangmoon618；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E4%B9%9D%E6%9B%B2%E9%BB%84%E6%B2%B3%E7%AC%AC%E4%B8%80%E6%B9%BE1.JPG) | Public Domain |
| 西路军 | 祁连山 | 摄影：Stefan Wagener；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Qilian_landscape.jpg) | CC BY 2.0 |
| 抗日战争 | 八路军在浮图峪长城作战（1938） | 摄影：沙飞；[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Eighth_Route_Army_fighting_on_Futuyu_Great_Wall,_1938.jpg) | Public Domain |

说明：

- 长征封面为红军经过的草地地貌照片，不是历史现场照片；西路军封面为祁连山今貌。
- 郑和封面为宝船模型照片，不是明代原物。
- 封面只作版式装饰，事件、路线与结论仍以各专题正文和来源为准。
