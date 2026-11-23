# 京杭大运河 OSM 航道几何接入（M284）

- **日期**：2026-11-23
- **批次**：M284
- **对象**：`data/atlases/grand-canal/routes/canal.geojson`
- **数据源**：OpenStreetMap `waterway=canal` 关系 [1112801（京杭大运河）](https://www.openstreetmap.org/relation/1112801)

## 1. 为什么用 OSM

现有开源数据里，能覆盖京杭大运河**现存航道中心线**的只有 OpenStreetMap：

- CHGIS 的自然地理数据是 CC-BY-NC-SA，禁止商业使用，与本项目 CC-BY-4.0 不兼容；
- Natural Earth 的河流中心线不含中国大运河；
- 各类“大运河遗产”数据集多为学术或商业授权，不能直接入库。

OSM 数据为 ODbL 1.0，允许使用与再分发，但派生数据库需保留 ODbL 与署名。

## 2. 处理流程

1. 读取关系 1112801 的成员，只保留 `role=main_stream` 的 142 条 way。
2. 通过 Overpass API 分批取回 142 条 way 的几何。
3. 按关系成员顺序拼接；遇到反向 way 自动翻转。
4. 按大于 20km 的缺口切块，从北京附近开始贪心排序，避免关系顺序中的支线回跳。
5. 用 Douglas-Peucker 0.02°（约 2km）简化，得到北京—杭州主线 2,934 个点。
6. 按原有航段起止点，把主线切成 12 段现存运河航线：
   - 7 济宁—临清、8 北京—通州、9 临清—济宁、10 北京—天津、11 北京—杭州、
     12 天津—德州、13 德州—临清、14 扬州—镇江、15 济宁—淮安、16 淮安—扬州、
     17 苏州—杭州、18 镇江—苏州。
7. 每段保留原起止点，若 OSM 端点偏离超过 200m，则补一段短连接线，保证 `check:heads` 锚点不变。
8. 航段属性改为：
   - `precision: "gis"`
   - `geometryBasis: "osm-waterway"`
   - `source: "OpenStreetMap relation 1112801"`
   - `license: "ODbL-1.0"`

## 3. 哪些段仍是示意

隋唐通济渠、永济渠、汴河（1—6）与 1855 年黄河改道影响段（19）**仍为示意折线**：

- 通济渠、永济渠大部分河段已湮没，OSM 没有完整中心线；
- 无开放授权的历史水系矢量数据可替代；
- 继续按《隋书》《中国运河志》记载的沿线城镇连线，标 `precision: "schematic"`。

## 4. 精度与限制

- OSM 是**现代**航道中心线，不等同于隋唐宋元明的历史河道；现存运河段在明清—现代经过改线、疏浚、裁弯。
- 简化容差 0.02°（约 2km），保留大弯，抹去小弯；如需更精细可降到 0.005°。
- 关系 1112801 含 `side_stream` 支线，本批已排除，只保留 `main_stream`。
- 端点补线是直线连接，长度一般 2—10km，已在路线描述中说明「按原起止点截取」。

## 5. 许可与署名

- 航道几何：© OpenStreetMap contributors，ODbL 1.0。
- 事件文本：CC-BY-4.0。
- 署名与许可说明写入 `data/atlases/ATTRIBUTION.md` 与 `grand-canal/manifest.json` 的 `license` 字段。
- 不把 OSM 数据与 CC-BY-4.0 混为一谈；ODbL 只覆盖 OSM 派生几何。

## 6. 验证

```bash
pnpm validate:data
pnpm check:heads --atlas grand-canal
pnpm check:routes --atlas grand-canal
pnpm typecheck && pnpm lint && pnpm test
pnpm build:search-index
pnpm build:mobile-data --check
```
