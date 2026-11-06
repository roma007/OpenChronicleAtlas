# OpenChronicle Atlas（史迹·时空地图）

> 通用历史事件时空地图平台：以「地图 + 时间轴」为核心交互，展示任意历史专题的路线、事件与时空演变。
> 平台不绑定任何单一历史事件，长征、抗战、丝绸之路、大航海等均作为可插拔的「专题数据集（Atlas Dataset）」接入。

当前状态：**M53 已完成（v0.53.0-m53）：陕北红军苏区前置节点补齐；iOS 真机、正式域名与商店提交待账号/许可**
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
- 留档总则：[`docs/README.md`](docs/README.md)
- 数据契约：[`docs/schema/atlas-schema-v1.0.0.md`](docs/schema/atlas-schema-v1.0.0.md)
- 高德 Key 与签名指南：[`docs/guides/amap-setup.md`](docs/guides/amap-setup.md)
- M1 计划：[`docs/plans/2026-11-03-M1-初始化脚手架-plan.md`](docs/plans/2026-11-03-M1-初始化脚手架-plan.md)
- M1 方案：[`docs/plans/2026-11-03-M1-初始化脚手架-design.md`](docs/plans/2026-11-03-M1-初始化脚手架-design.md)

---

## 三、技术栈（已定，见 ADR-0001 / ADR-0004）

| 层 | 选型 |
| --- | --- |
| 包管理 / monorepo | pnpm workspaces + Turborepo（可选） |
| 语言 | TypeScript 5.x（strict） |
| Web | React 19 + Vite + **高德地图 JS API 2.0** + Tailwind CSS + Zustand |
| 移动端 | React Native 0.88 + Expo SDK 58（dev build）+ **`expo-gaode-map`**（M4 接入），一套代码出 Android / iOS |
| 底图 | **高德地图**（Android/iOS SDK + Web JS API 2.0）；数据保持 WGS84，渲染前转 GCJ-02 |
| 共享层 | `packages/shared`：纯 TS，无 DOM / RN 依赖 |
| 数据校验 | zod（schema v1.0.0） |
| 数据托管 | 纯静态 JSON / GeoJSON（`/data/atlases`），后续可迁移 Supabase |
| 部署 | Web：Vercel / Cloudflare Pages；移动端：EAS Build 产出 APK / IPA |

**高德 Key 配置**：Web 用 `VITE_AMAP_KEY` + `VITE_AMAP_SECURITY_CODE`；移动端用 `EXPO_PUBLIC_AMAP_ANDROID_KEY` / `EXPO_PUBLIC_AMAP_IOS_KEY`。申请与填写步骤见 [`docs/guides/amap-setup.md`](docs/guides/amap-setup.md)。

---

## 四、目录结构（规划）

```
OpenChronicleAtlas/
├── apps/
│   ├── web/                 # Web 端（React + Vite + 高德 JS API 2.0）
│   └── mobile/              # React Native (Expo) 空壳；android/ios 由 prebuild 生成
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

---

## 七、提交规范

- 约定式提交：`feat: / fix: / docs: / refactor: / chore: / test: / build:`。
- `docs:` 专用于留档类提交。
- 每次功能完成后推送 GitHub 与 Gitee 双仓，并核对两端 commit 一致。
- 里程碑结束双仓打 tag，如 `v0.1.0-m1`。
- 不提交密钥、证书、签名文件、大体积二进制素材；素材置于 `data/atlases/<id>/assets` 并标注来源。
