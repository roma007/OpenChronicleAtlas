# 全项目收尾审计（M1–M5）

- **日期**：2026-11-04
- **审计范围**：仓库结构、文档留档、构建与测试、数据、三端交付、部署、安全、上架准备
- **审计时 HEAD**：`c55a57b`（版本号对齐前）
- **结论**：**代码与文档主线完成；线上正式部署、iOS 真机/IPA、商店提交受外部账号与高德 SDK 限制**

---

## 1. 仓库与同步

| 项 | 结果 |
| --- | --- |
| 分支 | `main`（开发）、Gitee `master`（镜像） |
| GitHub `main` | `c55a57b` |
| Gitee `main` | `c55a57b` |
| Gitee `master` | `c55a57b` |
| 远程 | `origin` 双 pushurl（GitHub + Gitee），另保留 `gitee` fetch 远程 |
| tag | `v0.1.0-m1`、`v0.2.0-m2`、`v0.3.0-m3`、`v0.4.0-m4`、`v0.5.0-m5` |
| 工作区 | 审计时干净（仅版本号对齐待提交） |

**结论**：双仓同步正常，tag 齐全。

---

## 2. 文档留档

| 项 | 结果 |
| --- | --- |
| 必需目录 | `conversations / plans / decisions / changelog / releases / schema / guides` 全部存在 |
| 模板 | 对话、plan、design、ADR、release 模板齐全 |
| 对话档案 | 10 份，覆盖项目启动至 M5 |
| 计划/方案 | M1–M5 各一份 plan + design |
| ADR | ADR-0001 – ADR-0008 |
| 发布说明 | M1–M5 + 商店元数据 + 截图说明 |
| 内部链接 | 扫描 46 个 Markdown，**0 个断链** |
| CHANGELOG | 已记录 M1–M5 |

**结论**：文档体系完整，可追溯。

---

## 3. 构建与测试

| 命令 | 结果 |
| --- | --- |
| `pnpm -r typecheck` | ✅ 三包通过 |
| `pnpm lint` | ✅ 0 error |
| `pnpm test` | ✅ 57 tests passed |
| `pnpm build` | ✅ Web 构建成功，Markdown 分块 |
| `pnpm validate:data` | ✅ 2 专题 / 54 事件 / 17 路线段 |
| `apps/web/dist/data` | ✅ 含 long-march、zheng-he |

**结论**：主线质量门禁全部通过。

---

## 4. 数据与专题

| 专题 | 事件 | 路线段 | 实体 | 状态 |
| --- | --- | --- | --- | --- |
| 长征 | 28 | 9 | 6 | 示意初稿，待史料校订 |
| 郑和下西洋 | 26 | 8 | 3 | 示意初稿，待史料校订 |

- 两专题均通过 schema 校验；
- 第二专题未改代码，验证「专题可插拔」；
- 跨专题搜索、首页卡片墙正常。

---

## 5. 三端交付

### Web

- 首页、专题地图、时间轴、详情、搜索、筛选、分享、深链、隐私页均可用；
- Vercel 临时预览已验证：首页、`/privacy`、`/search`、`/atlas/zheng-he`、`/data/atlases/index.json`；
- 生产环境变量与域名待配置。

### Android

| 项 | 结果 |
| --- | --- |
| APK | `apps/mobile/android/app/build/outputs/apk/release/app-release.apk` |
| 大小 | 131MB |
| 版本 | `0.5.0` / versionCode 2 |
| 签名 | release keystore，SHA-1 `EA:94:...:F9:96` |
| 安装 | API 34 模拟器成功 |
| 功能 | 地图、时间轴、详情、搜索、筛选、分享 |
| 限制 | minify 关闭；TV 模拟器布局非手机；真机待复验 |

### iOS

| 项 | 结果 |
| --- | --- |
| 编译 | ✅ 模拟器 x86_64 编译成功 |
| 安装 | ⛔ 失败：AMap iOS SDK 无 arm64 模拟器切片 |
| IPA | ⛔ 未产出：无 Apple Developer 账号/证书/真机 |

**结论**：Android 可交付；iOS 需真机 + 账号。

---

## 6. 安全与密钥

| 检查 | 结果 |
| --- | --- |
| 仓库内 Key 明文 | ✅ 未发现 |
| keystore / 证书 | ✅ 未入库，`.gitignore` 覆盖 |
| `.env.local` | ✅ 忽略 |
| Android Key 绑定 | 包名 + release/debug SHA1 |
| iOS Key 绑定 | Bundle ID |
| 临时部署 | ⚠️ 前端产物含 Web Key 与 securityJsCode（JS API 固有）；建议认领后重置安全密钥 |
| 隐私政策 | ✅ Web `/privacy`，含高德 SDK 披露 |

**建议**：

1. 认领 Vercel 部署后配置正式环境变量；
2. 重置 Web 安全密钥；
3. 生产环境配置 `/_AMapService/` 代理；
4. 离线备份 release keystore 与口令。

---

## 7. 部署与上架

| 项 | 状态 |
| --- | --- |
| Vercel 配置 | ✅ `vercel.json`（SPA rewrites、缓存、安全头） |
| Vercel 临时预览 | ✅ `https://fleet-scarlet-8eoesag.tmp.now`（匿名，需 claim） |
| 正式部署/域名 | ⏸ 待账号 |
| Cloudflare 备选 | ✅ `wrangler.toml` + 指南 |
| 图标/启动图/Feature Graphic | ✅ |
| 商店截图 | ✅ 8 张 Web 移动端占位（1290×2796 / 1080×1920） |
| 商店元数据 | ✅ 草稿 |
| 商店提交 | ⏸ 待开发者账号、真机截图、高德商用许可 |

---

## 8. 版本一致性

审计发现根包、Web、Shared、Mobile 的 `package.json` 版本仍为 `0.1.0`，与 M5 的 `0.5.0` 不一致。
**已修复**：四个包统一为 `0.5.0`。

| 包 | 版本 |
| --- | --- |
| root | 0.5.0 |
| @atlas/web | 0.5.0 |
| @atlas/mobile | 0.5.0 |
| @atlas/shared | 0.5.0 |

---

## 9. 遗留问题与风险

| 编号 | 问题 | 影响 | 建议 |
| --- | --- | --- | --- |
| A1 | iOS 无 arm64 模拟器切片 | 无法在 Apple Silicon 模拟器运行 | 真机 + Apple 账号出 IPA；或 Intel Mac |
| A2 | `*.vercel.app` 在中国大陆可能 DNS 不可达 | 线上访问不稳定 | 绑定自定义域名 |
| A3 | 商店账号与高德商用许可 | 无法提审 | 先评估许可与账号 |
| A4 | 截图非真机 | 商店可能拒审 | 真机重拍 |
| A5 | Android minify 关闭 | 包体较大 | CI/高内存环境恢复 R8 |
| A6 | 数据为示意初稿 | 史料准确性 | 人工校订 + sources |
| A7 | 无 Marker 聚合/离线 | 大数据/弱网体验 | M5 后迭代 |
| A8 | Web 安全密钥曾出现在聊天/临时构建 | 滥用风险 | 重置并代理 |

---

## 10. 结论

- **M1–M5 代码与文档主线完成**，双仓同步、tag 齐全；
- **可演示/可安装**：Web 临时预览、Android 0.5.0 APK；
- **未完成的外部依赖**：iOS 真机/IPA、正式部署、商店提交、高德商用许可；
- 建议将上述外部依赖列为「发布阻塞项」，在账号与许可就绪后按 `docs/guides/deployment.md` 与 `docs/releases/store-metadata.md` 执行。
