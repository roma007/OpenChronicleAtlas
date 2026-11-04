# OpenChronicle Atlas（史迹·时空地图）

> 通用历史事件时空地图平台：以「地图 + 时间轴」为核心交互，展示任意历史专题的路线、事件与时空演变。
> 平台不绑定任何单一历史事件，长征、抗战、丝绸之路、大航海等均作为可插拔的「专题数据集（Atlas Dataset）」接入。

当前状态：**M6 已完成（v0.6.0-m6）：地图聚合与时间轴缩放；iOS 真机、正式域名与商店提交待账号/许可**
数据契约版本：**atlas-schema v1.0.0**

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

| 里程碑 | 内容 | 状态 |
| --- | --- | --- |
| M1 | 仓库与双远程 + monorepo 脚手架 + 留档体系 + 数据加载器 + Web 静态地图/路线/节点 | ✅ v0.1.0-m1 |
| M2 | 通用时间轴（拖动/播放/刻度自适应）+ 路线动画 + 节点高亮（Web） | ✅ v0.2.0-m2 |
| M3 | 事件详情 + 搜索/筛选 + 分享（Web） | ✅ v0.3.0-m3 |
| M4 | 共享层抽离 + Android APK + iOS IPA + 三端一致性验证 | ⚠️ Android 完成；iOS 阻塞 |
| M5 | 第二专题 + 上架准备 + 部署上线 + 双仓 tag | ✅ v0.5.0-m5（部署/iOS 待账号） |

---

## 七、提交规范

- 约定式提交：`feat: / fix: / docs: / refactor: / chore: / test: / build:`。
- `docs:` 专用于留档类提交。
- 每次功能完成后推送 GitHub 与 Gitee 双仓，并核对两端 commit 一致。
- 里程碑结束双仓打 tag，如 `v0.1.0-m1`。
- 不提交密钥、证书、签名文件、大体积二进制素材；素材置于 `data/atlases/<id>/assets` 并标注来源。
