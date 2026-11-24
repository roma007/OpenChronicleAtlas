# 战国疆域数据源核查与接入

- **日期**：2026-11-24
- **结论**：已接入 Seshat Cliopatria v0.2.1，生成 58 个世纪切片、3861 个顶点，
  写入 `data/atlases/warring-states/territories/territories.geojson`（约 234 KB）
- **许可**：Cliopatria 为 CC BY 4.0，已在 `manifest.license` 与要素 `extensions` 中署名

## 1. 取数过程

| 步骤 | 结果 |
| --- | --- |
| `api.github.com` 查 latest release | 200，`v0.2.1`，release 无资产 |
| `git/trees/main?recursive=1` | 找到根目录 `cliopatria.geojson.zip` |
| `raw.githubusercontent.com` 下载 | 44 MB，解压得 `cliopatria_polities_only_v021.geojson`（165 MB） |
| 筛选七雄 | `Name ∈ {Qin,Chu,Qi,Yan,Zhao,Wei,Han}`，`ToYear ≥ -475 且 FromYear ≤ -221` |

> 2026-11-24 通过本机代理（`127.0.0.1:12334`）成功获取；此前直连失败。

## 2. 切片规则

- Cliopatria 以世纪/数十年为一段，各段 `FromYear`/`ToYear` 不重叠；
- 按专题时间范围 `-475 … -221` 裁剪：`start = max(FromYear, -475)`，`end = min(ToYear, -221)`；
- 相邻切片若因裁剪重叠，前一刀截止到下一段起始前一年，避免同一时段两块面叠加加深；
- 日期写历史纪年：`-0475-01-01` = 前 475 年（无公元 0 年）。

各实体切片数：楚 14、秦 12、齐 8、魏 8、赵 7、韩 6、燕 3。
赵、魏、韩最早切片始于前 404 年，符合三家分晋（前 403 年列为诸侯）的史实——
前 475—前 405 年三晋尚未立国，地图上不显示其疆域是正确的。

## 3. 属性与免责

每个要素：

```json
{
  "entityId": "qin",
  "startDate": "-0315-01-01",
  "endDate": "-0279-12-31",
  "opacity": 0.16,
  "extensions": {
    "precision": "dataset",
    "source": "Seshat Cliopatria (CC BY 4.0)",
    "sourceVersion": "v0.2.1",
    "sourceFile": "cliopatria_polities_only_v021.geojson"
  }
}
```

- `precision: dataset` 表示来自数据集，而非精确国界；
- 专题 `description` 已注明「学术估算的世纪切片，非精确国界」；
- 未纳入的政权：宋、鲁、越、中山、周（Later Zhou）——专题实体仅设七雄，
  如需展示需先加实体与颜色，另立批次。

## 4. 北方部族范围（手绘示意）

Cliopatria 对战国时段的部族覆盖不足，无法直接切片，因此五个部族范围全部手绘，
属性标 `precision: schematic`、`kind: tribal-range`、`dashed: true`，前端以虚线描边渲染，
表示「活动区域」，不是国界。

| 实体 | 时期 | 依据 |
| --- | --- | --- |
| 匈奴 `xiongnu` | 约前 350—前 221 | 《史记·匈奴列传》《赵世家》；阴山南北，赵武灵王、李牧与之交战 |
| 东胡 `donghu` | 前 475—前 221 | 《史记·匈奴列传》；西拉木伦河、老哈河流域，约前 300 年为秦开所破 |
| 林胡 `linhu` | 前 475—约前 300 | 《史记·赵世家》《匈奴列传》；晋西北至河套以东，为赵武灵王所破 |
| 楼烦 `loufan` | 前 475—约前 300 | 同上；晋西北、陕北，部分南迁 |
| 义渠 `yiqu` | 前 475—前 272 | 《史记·匈奴列传》《后汉书·西羌传》；陇东，前 272 年为秦所灭 |

**Cliopatria 查证结论（v0.2.1，2026-11-24 复核）**：

- `Xiongnu` 仅从前 208 年起有切片，落在本专题时间范围之外（前 221 年结束），不可用；
- `Zhongshan` 有前 366—前 302、前 301—前 292 两段，属中山国而非北方部族，本期未纳入；
- `Donghu`、`Linhu`、`Loufan`、`Yiqu` 在数据集中均无对应 polity。

因此这五个面不标 `source: Seshat Cliopatria`，而标「依《史记》《中国历史地图集》手绘示意」；
专题 `license` 与 `description` 均已区分「七雄取自数据集」与「部族为手绘示意」。

## 5. 后续

- [ ] 若需更细粒度（如逐年）疆域，可评估 Cliopatria 的更细切片或其他数据集；
- [ ] 战国早期（前 475—前 405）可考虑补「晋」实体，以显示三家分晋前的格局；
- [ ] 疆域面与事件的年代对齐需在三端人工验收时抽查（如长平之战时秦赵边界）；
- [ ] 部族范围可在有更可靠考古/历史地理成果时替换为矢量数据集，当前手绘仅作示意。
