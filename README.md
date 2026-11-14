# OpenChronicle Atlas（史迹·时空地图）

> 通用历史事件时空地图平台：以「地图 + 时间轴」为核心交互，展示任意历史专题的路线、事件与时空演变。
> 平台不绑定任何单一历史事件，长征、抗战、丝绸之路、大航海等均作为可插拔的「专题数据集（Atlas Dataset）」接入。

当前状态：**v1.0.1：品牌 Logo「青铜 · 朱砂」定稿并替换全端图标；Tauri 2 桌面端、iPad 与多商店发布流水线已就绪；每次提交按 [`AGENTS.md`](AGENTS.md) 铁律递增 `1.0.X`。Windows/Android 安装包已由 GitHub Actions 产出，iOS 待签名 Secrets。**
数据契约版本：**atlas-schema v1.1.0**

---

## 一、双远程仓库

| 平台 | 地址 |
| --- | --- |
| GitHub | `git@github.com:roma007/OpenChronicleAtlas.git` |
| Gitee | `git@gitee.com:roma007007/OpenChronicleAtlas.git` |

### 克隆后一次性配置（推荐：单 remote 双 pushurl）

```bash
git remote add origin git@github.com:roma007/OpenChronicleAtlas.git
git remote set-url --add --push origin git@github.com:roma007/OpenChronicleAtlas.git
git remote set-url --add --push origin git@gitee.com:roma007007/OpenChronicleAtlas.git
```

此后 `git push origin <branch>` 会同时推送到 GitHub 与 Gitee。

备选方案（两个独立 remote）：

```bash
git remote add github git@github.com:roma007/OpenChronicleAtlas.git
git remote add gitee  git@gitee.com:roma007007/OpenChronicleAtlas.git
git push github <branch> && git push gitee <branch>
```

### 校验双端一致

```bash
git ls-remote origin            # 应看到两条推送地址
git rev-parse HEAD
git ls-remote github refs/heads/main
git ls-remote gitee  refs/heads/main   # 两值应与本地 HEAD 相同
```

---

## 二、留档规范（铁律）

本项目的文档留档是**交付物的一部分**，缺失文档视为任务未完成。

| 目录 | 用途 |
| --- | --- |
| [`docs/conversations/`](docs/conversations/) | 每轮对话档案，一轮一文件 |
| [`docs/plans/`](docs/plans/) | 开发计划（plan）与技术方案（design） |
| [`docs/decisions/`](docs/decisions/) | 架构决策记录 ADR |
| [`docs/changelog/`](docs/changelog/) | 变更记录 CHANGELOG |
| [`docs/releases/`](docs/releases/) | 里程碑与发布说明 |
| [`docs/schema/`](docs/schema/) | 数据契约（平台核心契约）版本化文档 |
| [`docs/guides/`](docs/guides/) | 配置与操作指南（高德 Key、签名等） |

执行流程：**记录对话 → 编写 plan/design → 提交留档（双仓）→ 按计划实施 → 更新 CHANGELOG → 里程碑打 tag**。
禁止「先写代码后补文档」。

入口文档：
- Agent 铁律：[`AGENTS.md`](AGENTS.md)（每次提交必须递增 `1.0.X`）
- 留档总则：[`docs/README.md`](docs/README.md)
- 数据契约：[`docs/schema/atlas-schema-v1.0.0.md`](docs/schema/atlas-schema-v1.0.0.md)
- 高德 Key 与签名指南：[`docs/guides/amap-setup.md`](docs/guides/amap-setup.md)
- 多商店提交指南：[`docs/guides/store-submission.md`](docs/guides/store-submission.md)
- M1 计划：[`docs/plans/2026-11-03-M1-初始化脚手架-plan.md`](docs/plans/2026-11-03-M1-初始化脚手架-plan.md)
- M1 方案：[`docs/plans/2026-11-03-M1-初始化脚手架-design.md`](docs/plans/2026-11-03-M1-初始化脚手架-design.md)

---

## 三、技术栈（已定，见 ADR-0001 / ADR-0004）

| 层 | 选型 |
| --- | --- |
| 包管理 / monorepo | pnpm workspaces + Turborepo（可选） |
| 语言 | TypeScript 5.x（strict） |
| Web | React 19 + Vite + **高德地图 JS API 2.0** + Tailwind CSS + Zustand |
| 移动端 | React Native 0.88 + Expo SDK 58（dev build）+ **`expo-gaode-map`**（M4 接入），一套代码出 Android / iOS / iPadOS |
| 桌面端 | **Tauri 2**（Rust + 系统 WebView）复用 `apps/web` 构建产物，一套代码出 macOS / Windows |
| 底图 | **高德地图**（Android/iOS SDK + Web JS API 2.0）；数据保持 WGS84，渲染前转 GCJ-02 |
| 共享层 | `packages/shared`：纯 TS，无 DOM / RN 依赖 |
| 数据校验 | zod（schema v1.0.0） |
| 数据托管 | 纯静态 JSON / GeoJSON（`/data/atlases`），后续可迁移 Supabase |
| 部署 | Web：Vercel / Cloudflare Pages；移动端：Xcode / EAS Build 产出 IPA、AAB；桌面端：Tauri 产出 DMG / NSIS EXE，GitHub Actions 构建 Windows |

**高德 Key 配置**：Web 用 `VITE_AMAP_KEY` + `VITE_AMAP_SECURITY_CODE`；桌面端优先用 `VITE_AMAP_DESKTOP_KEY` + `VITE_AMAP_DESKTOP_SECURITY_CODE`（未配置时回退 Web Key）；移动端用 `EXPO_PUBLIC_AMAP_ANDROID_KEY` / `EXPO_PUBLIC_AMAP_IOS_KEY`。申请与填写步骤见 [`docs/guides/amap-setup.md`](docs/guides/amap-setup.md)。

### 桌面端命令

```bash
pnpm desktop:dev            # 启动 Tauri + Vite
pnpm desktop:bundle:mac     # macOS .app / .dmg（需在 macOS 执行）
pnpm desktop:bundle:win     # Windows NSIS .exe（需在 Windows 执行）
```

推送到 GitHub `main` 会自动运行 `.github/workflows/build-installers.yml`，产出 Web、macOS（arm64/x64）、Windows、Android 安装包；推送 `v*-m*` tag 会自动创建 GitHub Release。iOS 配置 Apple 签名 secrets 后自动产出 IPA。首次构建需下载 Rust crates，约 5–10 分钟；后续增量构建会快很多。

---

## 四、目录结构（规划）

```
OpenChronicleAtlas/
├── apps/
│   ├── web/                 # Web 端（React + Vite + 高德 JS API 2.0）
│   ├── mobile/              # React Native (Expo)，覆盖 iOS / iPadOS / Android；android/ios 由 prebuild 生成
│   └── desktop/             # Tauri 2 桌面端（macOS / Windows），复用 web 构建产物
├── packages/
│   └── shared/              # 共享逻辑：类型、schema 校验、数据加载、时间轴计算、筛选
├── data/
│   └── atlases/
│       └── long-march/      # 示例专题：长征
│           ├── manifest.json
│           ├── routes/
│           ├── events/
│           └── assets/
├── docs/                    # 对话档案、计划方案、ADR、CHANGELOG、发布说明、数据契约
└── 项目初始需求.txt
```

---

## 五、数据契约速览（v1.0.0）

> 完整定义见 [`docs/schema/atlas-schema-v1.0.0.md`](docs/schema/atlas-schema-v1.0.0.md)。
> 兼容策略：`schemaVersion` 采用 `MAJOR.MINOR.PATCH`；MINOR 只增不改，MAJOR 破坏性变更需提供迁移脚本与 ADR。

```jsonc
// manifest.json
{
  "schemaVersion": "1.0.0",
  "id": "long-march",
  "title": { "zh": "长征", "en": "The Long March" },
  "subtitle": { "zh": "1934—1936", "en": "1934–1936" },
  "timeRange": { "start": "1934-10-10", "end": "1936-10-22" },
  "cover": "assets/cover.jpg",
  "description": { "zh": "……Markdown 简介", "en": "…" },
  "defaultView": { "center": [108, 30], "zoom": 5 },
  "routes": ["routes/central-red-army.geojson"],
  "events": ["events/events.json"],
  "entities": [{ "id": "central-red-army", "name": { "zh": "中央红军" }, "color": "#b22222" }]
}
```

- 路线：GeoJSON `FeatureCollection`，每个 Feature 的 `properties` 含 `entityId / startDate / endDate / order / name`。
- 事件：JSON 数组，字段 `id / atlasId / name / date / endDate? / location / entityIds / category / summary / description / images / sources / relatedIds`。
- 多语言：`LocalizedString = string | { zh: string; en?: string }`。
- **坐标**：数据包统一使用 WGS84；渲染到高德地图前由 `packages/shared` 转为 GCJ-02，禁止在数据中混用坐标系。
- **Key**：高德 Key 按平台（Android / iOS / Web JS API）分别申请，全部通过环境变量注入，不入库。见 [`docs/guides/amap-setup.md`](docs/guides/amap-setup.md)。

---

## 六、快速开始

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动 Web（默认 http://localhost:5173）
pnpm validate:data    # 校验 data/atlases 下全部专题
pnpm check:routes     # 检查事件-路线距离（默认 30km）
pnpm -r typecheck     # 三包类型检查
pnpm test             # shared 单测
pnpm build            # Web 生产构建（含数据拷贝到 dist/data）
```

本地密钥（已 gitignore，不会入库）：

```bash
# apps/web/.env.local
VITE_AMAP_KEY=...
VITE_AMAP_SECURITY_CODE=...
VITE_AMAP_DESKTOP_KEY=...
VITE_AMAP_DESKTOP_SECURITY_CODE=...

# apps/mobile/.env.local
EXPO_PUBLIC_AMAP_ANDROID_KEY=...
EXPO_PUBLIC_AMAP_IOS_KEY=...
```

移动端：

```bash
pnpm --filter @atlas/mobile start        # Expo dev server
pnpm --filter @atlas/mobile exec expo prebuild   # 生成 android/ios（已 gitignore）
```

---

## 七、里程碑

> 完整进度与待办清单见 [`docs/plans/2026-11-05-完整开发计划与进度清单-plan.md`](docs/plans/2026-11-05-完整开发计划与进度清单-plan.md)。

| 里程碑 | 内容 | 状态 |
| --- | --- | --- |
| M1 | 仓库与双远程 + monorepo 脚手架 + 留档体系 + 数据加载器 + Web 静态地图/路线/节点 | ✅ v0.1.0-m1 |
| M2 | 通用时间轴（拖动/播放/刻度自适应）+ 路线动画 + 节点高亮（Web） | ✅ v0.2.0-m2 |
| M3 | 事件详情 + 搜索/筛选 + 分享（Web） | ✅ v0.3.0-m3 |
| M4 | 共享层抽离 + Android APK + iOS IPA + 三端一致性验证 | ⚠️ Android 完成；iOS 阻塞 · v0.4.0-m4 |
| M5 | 第二专题 + 上架准备 + 部署上线 + 双仓 tag | ✅ v0.5.0-m5（部署/iOS 待账号） |
| M6 | 地图聚合与时间轴缩放 | ✅ v0.6.0-m6 |
| M7 | 中英双语 | ✅ v0.7.0-m7 |
| M8 | 离线与弱网体验 | ✅ v0.8.0-m8 |
| M9 | 检索增强（拼音/首字母） | ✅ v0.9.0-m9 |
| M10 | 郑和航线时间校正 | ✅ v0.10.0-m10 |
| M11 | 移动端体验收尾 | ✅ v0.11.0-m11 |
| M12 | 分享链接增强 | ✅ v0.12.0-m12 |
| M13 | 时间轴事件标记 | ✅ v0.13.0-m13 |
| M14 | 事件持续时间 | ✅ v0.14.0-m14 |
| M15 | 更新提示与关于页 | ✅ v0.15.0-m15 |
| M16 | 无障碍键盘体验 | ✅ v0.16.0-m16 |
| M17 | 事件前后导航 | ✅ v0.17.0-m17 |
| M18 | 第三专题玄奘西行 | ✅ v0.18.0-m18 |
| M19 | 搜索筛选增强 | ✅ v0.19.0-m19 |
| M20 | 并行开发批次（搜索懒加载、商店元数据、抗战草稿） | ✅ v0.20.0-m20 |
| M21 | 抗日战争专题校正与上线 | ✅ v0.21.0-m21 |
| M22 | 发布阻塞项内部修复 | ✅ v0.22.0-m22 |
| M23 | 抗战路线精修（第一批） | ✅ v0.23.0-m23 |
| M24 | 抗战路线精修（第二批） | ✅ v0.24.0-m24 |
| M25 | 构建期搜索索引 | ✅ v0.25.0-m25 |
| M26 | 抗战路线精修（第三批） | ✅ v0.26.0-m26 |
| M27 | 抗战路线精修（第四批） | ✅ v0.27.0-m27 |
| M28 | 抗战路线精修（第五批） | ✅ v0.28.0-m28 |
| M29 | 抗战路线精修（第六批） | ✅ v0.29.0-m29 |
| M30 | 抗战路线精修（第七批） | ✅ v0.30.0-m30 |
| M31 | 数据 QA 脚本产品化 | ✅ v0.31.0-m31 |
| M32 | 发布文档与进度同步 | ✅ v0.32.0-m32 |
| M33 | Web 错误边界与基础可观测性 | ✅ v0.33.0-m33 |
| M34 | 搜索索引瘦身 | ✅ v0.34.0-m34 |
| M35 | Schema v1.1 演进 | ✅ v0.35.0-m35 |
| M36 | 数据版本与更新提示 | ✅ v0.36.0-m36 |
| M37 | 抗战路线精修（第八批） | ✅ v0.37.0-m37 |
| M38 | 滇西反攻细化 | ✅ v0.38.0-m38 |
| M39 | 抗战史料细化与坐标校订 | ✅ v0.39.0-m39 |
| M40 | 长征/郑和/玄奘史料细化 | ✅ v0.40.0-m40 |
| M41 | 路线分段类型与精度标注 | ✅ v0.41.0-m41 |
| M42 | 路线样式与图例 | ✅ v0.42.0-m42 |
| M43 | 节点与事件扩充（第一批） — 长征/郑和/玄奘 9 个事件与 8 处节点。 | ✅ v0.43.0-m43 |
| M44 | 长征国民党军追堵 — 6 段 KMT 路线、5 个 KMT 事件、直罗镇双方。 | ✅ v0.44.0-m44 |
| M45 | 长征国民党军派系与追击细化 — 派系/部队标注、六盘山追击、赣—湘—黔追击线。 | ✅ v0.45.0-m45 |
| M46 | 长征国民党军追堵扩充（第二批） — 红二/红四方向追堵、湘江拆分。 | ✅ v0.46.0-m46 |
| M47 | 郑和/玄奘节点扩充 — 爪哇、溜山、卜剌哇、呾叉始罗、吠舍离、蓝毗尼。 | ✅ v0.47.0-m47 |
| M48 | 郑和/玄奘节点扩充（第二批） — 祖法儿、竹步、祇园精舍、僧伽施。 | ✅ v0.48.0-m48 |
| M49 | 郑和/玄奘节点扩充（第三批） — 天方、乌仗那、迦湿弥罗、摩揭陀。 | ✅ v0.49.0-m49 |
| M50 | 郑和/玄奘节点扩充（第四批） — 加异勒、小葛兰、柯枝、迦毗罗卫、阿逾陀、憍赏弥。 | ✅ v0.50.0-m50 |
| M51 | 郑和/玄奘节点扩充（第五批） — 南巫里、甘巴里、阿拨把丹、缚喝、萨他泥湿伐罗、秣兔罗。 | ✅ v0.51.0-m51 |
| M52 | 红二、六军团长征主线补齐 — 红六西征、木黄会师、湘鄂川黔反“围剿”、桑植出发、乌蒙山、石鼓、甘孜。 | ✅ v0.52.0-m52 |
| M53 | 陕北红军苏区前置节点补齐 — 照金、南梁、红二十七军、周家硷、三次反“围剿”。 | ✅ v0.53.0-m53 |
| M54 | 红十五军团独立图层 — 独立实体、3 段路线、成立/劳山/榆林桥。 | ✅ v0.54.0-m54 |
| M55 | 红二十五军西征主线补齐 — 何家冲、独树镇、庾家河、鄂豫陕、袁家沟口、西征、四坡村。 | ✅ v0.55.0-m55 |
| M56 | 红十五军团东征西征 — 东征、关上村、兑九峪、回师、西征、盐池、豫旺堡。 | ✅ v0.56.0-m56 |
| M57 | 抗战正面战场与敌后根据地扩充 — 国民党军、八路军、新四军三个实体与 18 个事件。 | ✅ v0.57.0-m57 |
| M58 | 华南敌后与正面战场战区序列 — 华南游击队、5 个战区、日军华南/华中路线。 | ✅ v0.58.0-m58 |
| M59 | 华南纵队与正面战场军级序列 — 珠江/韩江/南路纵队、第29/18集团军/5/74/10军、日军四役。 | ✅ v0.59.0-m59 |
| M60 | 正面战场军级序列第二批 — 第13/18/59/52/35/20 军、日军南口/临沂/五原/长沙、华南根据地。 | ✅ v0.60.0-m60 |
| M61 | 正面战场集团军图层 — 第8/9/14/7/2/31 集团军、日军四役、美合事变。 | ✅ v0.61.0-m61 |
| M62 | 集团军扩充与华南根据地 — 第5/6/10/20/33/3 集团军、日军四役、大岭山/白沙。 | ✅ v0.62.0-m62 |
| M63 | 集团军第三批与华南港九、阳台山 — 第15/19/24/27 集团军、日军南昌/上高/太行山、港九/阳台山。 | ✅ v0.63.0-m63 |
| M64 | 集团军第四批与华南港九营救 — 第16/21/32/9 集团军、日军桂南/大别山、港九营救/五桂山。 | ✅ v0.64.0-m64 |
| M65 | 集团军第五批与华南粤中、五指山 — 第10/26/29/30 集团军、日军鄂西/常德、粤中/五指山。 | ✅ v0.65.0-m65 |
| M66 | 集团军第六批与华南大鹏、六连岭 — 第12/31/27/30 集团军、日军粤北/豫南、大鹏/六连岭。 | ✅ v0.66.0-m66 |
| M67 | 集团军第七批与华南罗浮山、儋州 — 第11/20/31/21 集团军、日军豫中/滇西、罗浮山/儋州。 | ✅ v0.67.0-m67 |
| M68 | 集团军第八批与华南粤北、海陆丰 — 第1/4/5/6 集团军、日军平型关/中条山、粤北/海陆丰。 | ✅ v0.68.0-m68 |
| M69 | 集团军第九批与华南云雾山、尖峰岭 — 第2/3/7/35 集团军、日军桐柏/三水、云雾山/尖峰岭。 | ✅ v0.69.0-m69 |
| M70 | 集团军第十批与华南粤赣湘边、临高 — 第2/3/7/35 集团军、日军郑州/包头/南阳、粤赣湘边/临高。 | ✅ v0.70.0-m70 |
| M71 | 集团军第十一批与华南东江、珠江人物 — 第22/23/25/36/38 集团军、日军襄阳/上饶/金华/洛阳、尹林平/林锵云。 | ✅ v0.71.0-m71 |
| M72 | 集团军第十二批与华南曾生、冯白驹 — 第23/26/11/37 集团军、日军铜陵/宜昌/松山/宾阳、曾生/冯白驹。 | ✅ v0.72.0-m72 |
| M73 | 集团军第十三批与华南昌感、高要 — 第11/20/26/37 集团军、日军龙陵/腾冲/石牌、昌感/高要。 | ✅ v0.73.0-m73 |
| M74 | 新专题「徐霞客游记」 — 23 个事件、21 段路线、1 个实体。 | ✅ v0.74.0-m74 |
| M75 | 新专题「京杭大运河」 — 14 个事件、9 段路线、1 个实体。 | ✅ v0.75.0-m75 |
| M76 | 京杭大运河沿线节点扩充 — 12 个沿线事件、10 段路线。 | ✅ v0.76.0-m76 |
| M77 | 新专题「三国」 — 21 个事件、20 段路线、4 个实体。 | ✅ v0.77.0-m77 |
| M78 | 三国专题扩充 — 14 个事件、13 段路线。 | ✅ v0.78.0-m78 |
| M79 | 新专题「宋元」 — 18 个事件、17 段路线、5 个实体。 | ✅ v0.79.0-m79 |
| M80 | 宋元专题扩充 — 14 个事件、13 段路线。 | ✅ v0.80.0-m80 |
| M81 | 新专题「隋唐」 — 18 个事件、16 段路线、4 个实体。 | ✅ v0.81.0-m81 |
| M82 | 隋唐专题扩充 — 14 个事件、12 段路线。 | ✅ v0.82.0-m82 |
| M83 | 地图时代疆域遮罩 — 契约扩展、15 个示意疆域面、图例开关。 | ✅ v0.83.0-m83 |
| M84 | 疆域文字标识 — 15 个中英文字标识、手动落点、语言切换修复。 | ✅ v0.84.0-m84 |
| M85 | 疆域重叠修正 — 三国/宋元/隋唐共享边界重绘、描边增强。 | ✅ v0.85.0-m85 |
| M86 | 疆域数据升级为 Cliopatria — 116 个 CC BY 4.0 时段面、新增西夏/大理实体。 | ✅ v0.86.0-m86 |
| M87 | 修正疆域标识落点 — 116 个标识点改为面内最远点。 | ✅ v0.87.0-m87 |
| M88 | 宋元补充西夏与大理 — 10 个事件、9 段路线。 | ✅ v0.88.0-m88 |
| M89 | 新专题「明清」 — 16 个事件、16 段路线、6 个疆域面、2 个实体。 | ✅ v0.89.0-m89 |
| M90 | 明清专题扩充 — 12 个事件、12 段路线、明郑实体。 | ✅ v0.90.0-m90 |
| M91 | 明清专题继续扩充 — 12 个事件、11 段路线。 | ✅ v0.91.0-m91 |
| M92 | 明清专题再扩充 — 12 个事件、12 段路线。 | ✅ v0.92.0-m92 |
| M93 | 明清专题补甲午与清末节点 — 12 个事件、12 段路线。 | ✅ v0.93.0-m93 |
| M94 | 明清专题补甲午尾声与乙未战争 — 8 个事件、8 段路线。 | ✅ v0.94.0-m94 |
| M95 | 明清专题补乙未战事与立宪节点 — 12 个事件、12 段路线。 | ✅ v0.95.0-m95 |

---

## 八、数据来源与许可

- 事件、路线与专题文本：项目自行整理，示意初稿，待史料页码级校订；
- 时代疆域面（隋唐、宋元、三国）：**Seshat Cliopatria**，CC BY 4.0；
- 明清疆域面：**World Empires**（底层 Cliopatria），CC BY 4.0；
  - 仓库：https://github.com/Seshat-Global-History-Databank/cliopatria
  - 引用：Bennett, J. S., Mutch, E., & Chalstrey, E. (2025). Cliopatria. *Scientific Data*.
- 详细修改说明与署名见 [`data/atlases/ATTRIBUTION.md`](data/atlases/ATTRIBUTION.md)；
- Cliopatria 边界为学术估算，不是精确国界，不应作为边界测量或领土主张的依据。

---

## 七、提交规范

- 约定式提交：`feat: / fix: / docs: / refactor: / chore: / test: / build:`。
- `docs:` 专用于留档类提交。
- 每次功能完成后推送 GitHub 与 Gitee 双仓，并核对两端 commit 一致。
- 里程碑结束双仓打 tag，如 `v0.1.0-m1`。
- 不提交密钥、证书、签名文件、大体积二进制素材；素材置于 `data/atlases/<id>/assets` 并标注来源。
