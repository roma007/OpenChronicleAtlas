# 对话档案：底图改用高德与 Android Key 申请

- **日期**：2026-11-03
- **时间**：19:10（CST）
- **参与者**：用户（项目负责人）、AI 开发助手（DeepSeek V4.1 Flash / OpenCode）
- **关联里程碑**：M1（Web 地图）/ M4（移动端地图）
- **关联文档**：
  - `docs/decisions/ADR-0004-底图改用高德地图与坐标体系.md`
  - `docs/guides/amap-setup.md`
  - `docs/plans/2026-11-03-M1-初始化脚手架-design.md`（已更新地图章节）

## 1. 原始需求

用户决定**改用高德地图**，正在申请 Android 版 Key，并贴出控制台表单：

> 为「史迹」添加 Key
> Key 名称 / 服务平台（Android 平台）/ 可使用服务（Android 地图 SDK、定位 SDK 等）
> 发布版安全码 SHA1 / 调试版安全码 SHA1 / PackageName
> 以及高德服务协议、隐私政策与 SDK 合规说明。

用户需要：**如何填写这份 Android Key 表单**，以及项目侧要做的配套调整。

## 2. 需求拆解

| 编号 | 需求点 | 类型 | 优先级 |
| --- | --- | --- | --- |
| R1 | 底图从 MapLibre/OSM 改为高德 | 架构变更 | P0 |
| R2 | 给出 Android Key 表单逐项填写值（包名、SHA1、服务） | 配置 | P0 |
| R3 | 提供获取调试/发布 SHA1 的方法与项目 keystore 方案 | 工程 | P0 |
| R4 | 说明 Web / iOS Key 的独立申请要求 | 配置 | P1 |
| R5 | 处理高德 GCJ-02 坐标与数据 WGS84 的差异 | 技术方案 | P0 |
| R6 | 记录隐私合规与商用授权要求 | 合规 | P1 |
| R7 | 更新受影响的计划、方案、README、CHANGELOG | 文档 | P0 |

## 3. 讨论与决策

| 编号 | 议题 | 结论 | 依据 |
| --- | --- | --- | --- |
| D1 | 是否保留 MapLibre | **不保留**。Web 改用高德 JS API 2.0，移动端改用 `expo-gaode-map` | ADR-0004 |
| D2 | 移动端高德库 | 选 **`expo-gaode-map`**（Expo Modules + Config Plugin + 新架构）；M4 前做兼容性 PoC，回退候选 `react-native-amap3d` | ADR-0004 |
| D3 | 包名 / Bundle ID | 统一 **`com.openchronicle.atlas`**，申请后不再变更 | ADR-0004 |
| D4 | Key 名称 | Android `atlas-android`、Web `atlas-web`、iOS `atlas-ios` | 指南 §1 |
| D5 | Android 可使用服务 | 先勾 **Android 地图 SDK**；定位 SDK 待启用「我的位置」时再加 | 指南 §3 |
| D6 | 坐标体系 | 数据保持 **WGS84**，渲染前在 shared 转 **GCJ-02**，取点再转回；用离线算法，不依赖网络接口 | ADR-0004 |
| D7 | Web 安全密钥 | 开发用明文 `_AMapSecurityConfig`；生产用代理转发，避免 `securityJsCode` 暴露 | 指南 §5 |
| D8 | 地图风格 | 控制台「自定义地图样式」做低饱和历史风，样式 ID 走配置 | ADR-0004 |
| D9 | 商用授权 | 未购买技术服务许可时仅限短期少量测试；上架前评估购买 | 指南 §8 |
| D10 | 文档先行 | 先更新 ADR/指南/plan/design/README，再改代码（本轮未写业务代码） | 铁律 |

## 4. 疑问与答复

| 编号 | 疑问 | 答复 | 状态 |
| --- | --- | --- | --- |
| Q1 | 调试版 SHA1 用哪个？ | 本机 `~/.android/debug.keystore` 的 SHA1：`51:54:06:91:3E:27:9D:30:7F:24:3A:DC:F4:8B:EB:56:89:6B:4A:52`；换机器/CI 需重新登记 | 已确认 |
| Q2 | 发布版 SHA1 从哪来？ | 已生成项目 release keystore（`~/.openchronicle/atlas-release.keystore`，仓库外保存），SHA1：`EA:94:B4:C2:A2:44:ED:D6:D9:65:84:6C:3A:D2:80:11:8F:46:F9:96`；口令存 `~/.openchronicle/atlas-keystore.properties`（600），需离线备份 | 已确认 |
| Q3 | Android Key 能否用于 Web？ | 不能。Web 必须另申请「Web 端 (JS API)」Key + 安全密钥，并配域名白名单 | 已确认 |
| Q4 | 高德底图与 WGS84 数据错位怎么办？ | shared 统一做 WGS84→GCJ-02 转换；禁止把转换散落在各端 | 已确认 |
| Q5 | 是否需要购买高德商用许可？ | 开发测试可用免费配额；上架/商用/长期大量调用前必须评估购买技术服务许可 | 待用户决策 |
| Q6 | 包名 `com.openchronicle.atlas` 是否接受？ | 已按此申请；如需更换必须在提交 Key 前改，申请后更换需重新申请 Key | 待用户确认 |

## 5. 本轮产出

- 新增 `docs/decisions/ADR-0004-底图改用高德地图与坐标体系.md`
- 新增 `docs/guides/amap-setup.md`（表单填写、SHA1、Key 注入、隐私合规、FAQ）
- 新增本对话档案
- 更新 `docs/plans/2026-11-03-M1-初始化脚手架-design.md` 地图架构/接口/骨架
- 更新 `docs/plans/2026-11-03-M1-初始化脚手架-plan.md` 任务与风险
- 更新 `README.md` 技术栈与底图说明
- 更新 `docs/decisions/ADR-0001-...md` 状态（地图部分被 ADR-0004 取代）
- 更新 `docs/README.md` 索引、`docs/changelog/CHANGELOG.md`

### 提交与同步

| 提交 | 内容 | GitHub | Gitee |
| --- | --- | --- | --- |
| 待回填 | docs: 底图改用高德地图并补充 Key 申请指南 |  |  |

## 6. 待办（TODO）

- [ ] 用户在控制台提交 Android Key（填写 §3 的值）。
- [x] 生成项目 release keystore 并记录 SHA1（`EA:94:...:F9:96`），口令不入库。
- [ ] 离线备份 release keystore 与口令。
- [ ] 申请 Web 端 (JS API) Key 与安全密钥，配置域名白名单。
- [ ] 实现 `packages/shared/src/geo/coordinate.ts`（WGS84 ↔ GCJ-02）与单测。
- [ ] M1 Web 地图改用高德 JS API 2.0（T10 调整）。
- [ ] M4 前完成 `expo-gaode-map` 与 Expo SDK 的兼容性 PoC。
- [ ] 上架前完成高德 SDK 隐私政策披露与初始化合规。

## 7. 下一轮入口

- 下一步建议：拿到 Android Key 后，先落 shared 坐标转换与 M1 Web 地图骨架；移动端地图留到 M4。
- 需要用户确认：包名是否就用 `com.openchronicle.atlas`；是否现在生成 release keystore；Web Key 申请时间。
