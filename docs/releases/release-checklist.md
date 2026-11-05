# 发布前检查清单（M42）

- **日期**：2026-11-05
- **适用版本**：源码 `0.42.0`；M42 发布说明 `v0.42.0-m42`，双仓 tag 已创建
- **范围**：iOS / Android / Web / 合规 / 文档与回滚
- **状态**：**未达发布条件**。五项外部阻塞（iOS 账号、真机、商店账号、正式域名、高德商用许可）未解除
- **关联文档**：
  - [英文商店元数据](store-metadata-en.md)
  - [中文商店元数据草稿](store-metadata.md)
  - [M42 发布说明](2026-11-05-v0.42.0-m42.md)
  - [全项目收尾审计](2026-11-04-final-audit.md)
  - [部署指南](../guides/deployment.md)
  - [完整开发计划与进度清单](../plans/2026-11-05-完整开发计划与进度清单-plan.md)

> 用法：`[x]` 表示已核验；`[ ]` 表示未完成/未复验；`⛔` 表示当前阻塞；`⚠️` 表示高风险待办。
> 本文档只做检查与记录，不执行安装、构建、部署、提交或推送。

---

## 0. 当前基线（编写时快照）

| 项目 | 现状 | 证据 |
| --- | --- | --- |
| 分支 / HEAD | `main`（最终提交以 `git log` 为准） | `git log` |
| 最新 tag | `v0.42.0-m42` | `git tag` |
| 双仓 remote | `origin` 双 pushurl（GitHub + Gitee），另有 `gitee` fetch | `git remote -v` |
| 源码版本 | 根包 / Web / Shared / Mobile 均为 `0.42.0` | `package.json` |
| Android 源配置 | `versionName 0.42.0` / `versionCode 39` | `apps/mobile/android/app/build.gradle` |
| Android 上次产物 | `0.5.0` / `versionCode 2` 的 APK；**0.42.0 构建失败：dl.google.com 依赖下载超时** | 全项目审计 + Gradle 日志 |
| iOS 源配置 | `CFBundleShortVersionString 0.42.0` / `CFBundleVersion 39`；已对齐 | `apps/mobile/ios/app/Info.plist` |
| iOS 产物 | 无 IPA；AMap iOS SDK 无 arm64 模拟器切片 | 全项目审计 |
| 专题数据（应用内） | 4 个已索引专题 / 118 事件 / 127 路线段 | `data/atlases/index.json` 及 manifest 统计 |
| 专题数据（含草稿） | 4 个专题 / 118 事件 / 127 路线段；全部已加入 `index.json` | M42 发布说明 + `validate:data` |
| Web 生产地址 | `https://open-chronicle-atlas-mengfeng007-7858.vercel.app` | M31 发布说明 |
| 正式域名 | **未绑定** | 部署指南 |
| 隐私政策 | Web `/privacy` 与移动端首启隐私说明均含高德披露 | 代码核验 |
| 定位权限 | Android manifest 显式移除；iOS 无 `NSLocation*` | 代码核验 |
| 商店截图 | iOS 4 张 1290×2796、Android 4 张 1080×1920，均为 Web 占位 | `screenshots/README.md` |
| 高德商用许可 | **未确认** | 仓库内无许可凭证 |

---

## 1. 阻塞项总览

### 1.1 外部阻塞（必须由用户提供）

| 编号 | 阻塞项 | 当前状态 | 影响 | 解除条件 |
| --- | --- | --- | --- | --- |
| **B1** | **iOS 账号/证书** | ⛔ 未确认 Apple Developer 账号、Distribution 证书、Provisioning Profile（仓库/审计无凭证） | 无法 archive、TestFlight、提审 | 加入 Apple Developer Program；创建 App ID、证书、Profile |
| **B2** | **真机** | ⛔ 未确认 iPhone 真机；Android 仅 TV 模拟器验证 | iOS 无法验证（AMap 无 arm64 模拟器切片）；截图非真机；Android 手机布局未复验 | 提供 iPhone（arm64）与 Android 手机/平板 |
| **B3** | **商店账号** | ⛔ 未确认 App Store Connect / Google Play Console / 国内商店账号 | 无法创建应用记录、填写隐私表单、提交审核 | 注册并完成开发者验证；确认是否做国内市场 |
| **B4** | **正式域名** | ⛔ 仅 `*.vercel.app`；未确认自定义域名与 DNS 权限 | 隐私政策/数据 URL 不稳定；中国大陆可能不可达；商店 URL 不合规风险 | 提供域名与 DNS；绑定 Vercel/Cloudflare；配置 HTTPS |
| **B5** | **高德商用许可** | ⛔ 未确认商用/上架授权、配额、审图号（仓库无许可凭证） | 合规风险；可能被要求下架 | 取得高德书面许可/合同；确认 Key 绑定、配额、审图号 |

### 1.2 内部待办（可自行完成，但仍阻塞发布）

| 编号 | 待办 | 当前状态 | 说明 |
| --- | --- | --- | --- |
| B6 | iOS 版本号对齐 | ✅ `0.42.0 (39)` | 已对齐 |
| B7 | Android 0.42.0 APK/AAB 重建 | ⚠️ 构建失败：dl.google.com 依赖下载超时 | 网络恢复后重试 |
| B8 | 真机截图替换 | ⛔ 依赖 B2 | 当前为 Web 占位图 |
| B9 | Web 安全密钥重置 | ⚠️ 曾出现在临时构建/聊天 | 重置 `securityJsCode`，配置代理 |
| B10 | Android 敏感权限清理 | ✅ 已在 `blockedPermissions` 屏蔽 | 已处理 |
| B11 | Android 明文流量关闭 | ✅ `usesCleartextTraffic="false"` | 已处理 |

---

## 2. iOS 检查清单

> 本节多数项目受 **B1（账号/证书）** 与 **B2（真机）** 阻塞；未解除前无法完成 archive、TestFlight、真机验收与真机截图。

### 2.1 账号与协议

- [ ] Apple Developer Program 有效（个人/组织类型已确认）
- [ ] App Store Connect 已创建 App 记录，Bundle ID 为 `com.openchronicle.atlas`
- [ ] 团队角色/权限已配置（提审人、开发者、财务）
- [ ] 付费应用协议、税务、银行信息已填写（免费应用也需完成必要协议）
- [ ] 审核联系人姓名、邮箱、电话已填写（不得使用占位信息）
- [ ] 双重认证已开启，账号恢复方式已备份

### 2.2 签名与证书

- [ ] Apple Distribution 证书已创建并在钥匙串中可用
- [ ] App ID 已启用所需能力（当前仅需基础能力；无推送/定位/后台模式）
- [ ] App Store Distribution Provisioning Profile 已生成并与 Bundle ID 匹配
- [ ] 证书与 Profile 已离线备份（加密存储，不入库）
- [ ] 确认 Xcode 自动签名/手动签名方式，团队一致

### 2.3 构建与版本

- [x] `CFBundleShortVersionString` 已对齐为 `0.42.0`
- [x] `CFBundleVersion` 已递增为 `39`
- [ ] ⚠️ 统一最低系统：Xcode `IPHONEOS_DEPLOYMENT_TARGET` 为 16.4，Info.plist `LSMinimumSystemVersion` 仍为 12.0
- [ ] 使用 Release 配置 archive，确认无 Dev Menu、无调试浮层
- [ ] archive 内 `Info.plist` 版本号、Bundle ID、显示名与商店记录一致
- [ ] 生成 `.ipa` 并通过 Xcode Organizer / Transporter 上传 TestFlight
- [ ] dSYM 已保留并上传（用于崩溃符号化）
- [ ] 导出合规（Export Compliance）已填写；仅标准 HTTPS 加密时按豁免条款处理
- [ ] App 图标 1024×1024 无透明、无圆角；启动图正常
- [ ] 确认 Info.plist 无定位/相机/麦克风/通讯录等未使用权限描述
- [ ] ATS 配置仅保留必要的本地调试例外；生产接口全部 HTTPS
- [ ] `UIRequiredDeviceCapabilities` 的 `arm64` 与目标设备一致
- [ ] 若保留 iPad 支持，确认 iPad 布局与四方向旋转正常

### 2.4 真机验收

- [ ] iPhone 真机安装成功（非模拟器；AMap iOS SDK 无 arm64 模拟器切片）
- [ ] 首页 4 个专题卡片正常加载
- [ ] 长征 / 郑和 / 玄奘 / 抗日战争四个专题均可打开
- [ ] 时间轴播放、暂停、拖动、缩放、事件点点击正常
- [ ] 事件详情、史料来源、关联事件、前后导航正常
- [ ] 搜索关键词 `1935`、类型筛选、日期区间筛选、重置筛选正常
- [ ] 中英文切换正常；英文长文本不截断
- [ ] 分享/深链 `atlas://` 可打开对应专题/事件/时间点
- [ ] 弱网/断网有可理解的错误提示，不白屏
- [ ] 首次启动隐私说明、高德条款链接、同意流程正常
- [ ] 状态栏、刘海/灵动岛、安全区、横竖屏无遮挡
- [ ] 返回手势、Home 指示条、后台恢复行为正常
- [ ] 无崩溃、无内存告警、无地图 Key 错误

### 2.5 截图与商店素材

- [ ] iPhone 6.9" 真机截图（建议 1320×2868）3–10 张
- [ ] iPhone 6.5" 截图（1284×2778 或 1242×2688，按后台槽位）
- [ ] iPad 13" 截图（2064×2752，`supportsTablet: true` 时必须）
- [ ] 英文商店配英文截图；中文商店配中文截图
- [ ] 首两张为核心体验（首页 + 时间轴地图）
- [ ] 截图无个人信息、调试浮层、浏览器地址栏、`localhost`、Beta 字样

### 2.6 商店信息

- [ ] App 名称 `OpenChronicle Atlas`、副标题 `History on Maps & Timelines`
- [ ] 描述、关键词、What’s New 按 [英文商店元数据](store-metadata-en.md) 填写
- [ ] 主分类 Education，次分类 Reference
- [ ] 年龄分级问卷完成（建议 4+，以问卷结果为准）
- [ ] App Privacy 表单与高德 SDK 实际行为一致（不得默认 “Data Not Collected”）
- [ ] 隐私政策 URL 可公开访问（正式域名 `/privacy`）
- [ ] Support URL 可访问（GitHub 仓库）
- [ ] 审核备注已填写（无账号、无广告、无内购、无定位、数据为示意初稿）
- [ ] 价格 Free、销售地区、发布方式（手动/自动/分阶段）已确认
- [ ] 若做中国大陆区，确认 APP 备案、ICP、地图审图号等要求

---

## 3. Android 检查清单

> 本节受 **B2（Android 真机）** 与 **B3（商店账号）** 阻塞；构建可先做，提审需账号与真机验收。

### 3.1 账号与协议

- [ ] Google Play Console 账号有效，开发者验证完成
- [ ] 已创建应用记录，包名 `com.openchronicle.atlas`
- [ ] 付款资料/税务信息已完成（免费应用也需账号完整）
- [ ] 审核联系人、开发者邮箱、网站已填写
- [ ] 双重认证已开启
- [ ] 国内商店账号（如小米/华为/OPPO/vivo/应用宝）按需准备

### 3.2 签名与密钥

- [ ] ⚠️ Upload keystore 已生成，路径在仓库外（如 `~/.openchronicle/`）
- [ ] ⚠️ keystore 口令、alias、口令已离线备份（加密存储）
- [ ] ⚠️ 启用 Play App Signing，确认 upload key 与 app signing key 的 SHA-1
- [ ] ⚠️ 高德 Android Key 已绑定 release SHA-1；启用 Play App Signing 后补绑 Google 签名 SHA-1
- [ ] ⚠️ 确认 keystore 未被 `.gitignore` 遗漏、未进入构建产物或文档

### 3.3 构建与版本

- [x] `versionName` 为 `0.42.0`
- [x] `versionCode` 为 `39`；若已上传过同码，必须递增
- [ ] ⚠️ 重新构建 0.42.0 release 产物（2026-11-05 尝试失败：dl.google.com 依赖下载超时）
- [ ] Play 上传使用 `.aab`；侧载/国内商店按需提供 `.apk`
- [ ] Release 签名生效，安装包签名校验通过
- [ ] `minifyEnabled` / `shrinkResources` 策略确认（当前关闭；开启后需回归地图/反射/序列化）
- [ ] `targetSdkVersion 36`，`minSdkVersion 24`
- [ ] 包含 64 位架构；Play 64 位要求满足
- [x] `SYSTEM_ALERT_WINDOW` 已在 `blockedPermissions` 屏蔽
- [ ] ⚠️ 复核 `READ/WRITE_EXTERNAL_STORAGE`（maxSdk 32）与 `VIBRATE` 是否业务必需
- [x] `android:usesCleartextTraffic` 已为 `false`
- [ ] `allowBackup` 策略确认（当前 true；如含敏感缓存需排除）
- [ ] 高德 Key 不写入日志、不进入截图、不进入公开文档
- [ ] `EXPO_PUBLIC_DATA_BASE_URL` 指向正式 HTTPS 域名
- [ ] 确认无 Expo Dev Client / Dev Menu / 调试依赖进入 release

### 3.4 真机验收

- [ ] Android 手机真机安装成功（当前仅 TV 模拟器验证）
- [ ] 首页 4 个专题卡片正常加载
- [ ] 长征 / 郑和 / 玄奘 / 抗日战争四个专题均可打开
- [ ] 时间轴播放、暂停、拖动、缩放、事件点点击正常
- [ ] 事件详情、史料来源、关联事件、前后导航正常
- [ ] 搜索关键词、类型筛选、日期区间、重置筛选正常
- [ ] 中英文切换正常
- [ ] 分享/深链 `atlas://` 正常
- [ ] 弱网/断网提示正常
- [ ] 首次启动隐私说明与高德条款链接正常
- [ ] 系统返回键/手势、后台恢复、分屏/旋转（如支持）正常
- [ ] Android 平板/大屏布局验收（如声明支持）
- [ ] 无崩溃、无 ANR、无地图 Key 错误、无定位权限弹窗

### 3.5 截图与商店素材

- [ ] 手机真机截图（1080×1920 起，建议 1440×2560）2–8 张
- [ ] 7" 平板截图 1200×1920（可选）
- [ ] 10" 平板截图 1600×2560（可选）
- [ ] Feature graphic 1024×500，无透明、重要文字避开边缘
- [ ] 应用图标 512×512，32-bit PNG，无透明
- [ ] 截图语言与商店语言一致，无调试信息

### 3.6 商店信息

- [ ] 标题、短描述、完整描述按 [英文商店元数据](store-metadata-en.md) 填写
- [ ] 应用类型 Applications，分类 Education，标签 History/Maps
- [ ] 内容分级问卷完成（建议 Everyone，以问卷结果为准）
- [ ] Data safety 表单与高德 SDK 实际行为一致
- [ ] 广告声明：无广告
- [ ] 目标受众/儿童政策确认（当前不面向儿童专门设计）
- [ ] 隐私政策 URL 可公开访问
- [ ] 审核备注已填写
- [ ] 国内商店：APP 备案、ICP、软著/授权材料按各商店要求准备

---

## 4. Web 检查清单

> 本节受 **B4（域名/DNS）** 阻塞；域名未定时可先在临时部署验证，但不能作为正式商店/隐私 URL。

### 4.1 域名与 HTTPS

- [ ] 正式域名已确定（自定义域名，不依赖 `*.vercel.app`）
- [ ] DNS A/CNAME 已配置，TTL 合理（切换前建议低 TTL）
- [ ] TLS 证书有效、自动续期；`http` 301 跳转 `https`
- [ ] HSTS 已评估并配置（确认不会锁死错误域名）
- [ ] `www` 与裸域 canonical 策略确定
- [ ] 中国大陆网络可访问性测试（DNS、CDN、首屏）
- [ ] 旧 `*.vercel.app` / `*.tmp.now` 地址不再作为商店/隐私 URL

### 4.2 构建与环境变量

- [ ] Vercel/Cloudflare 项目归属已认领，团队权限明确
- [ ] 生产环境变量：`VITE_AMAP_KEY`、`VITE_AMAP_SECURITY_CODE`、可选 `VITE_AMAP_STYLE_ID`
- [ ] ⚠️ Web Key 已重置；旧 Key/securityJsCode 已失效
- [ ] ⚠️ `/_AMapService/` 代理已配置，securityJsCode 不以前端明文暴露
- [ ] 高德 Web Key 域名白名单绑定正式域名
- [ ] 构建命令 `pnpm --filter @atlas/web build` 可复现
- [ ] 产物包含 `data/atlases/index.json` 与 4 个专题
- [ ] SPA rewrites 正常（`/search`、`/privacy`、`/atlas/*` 直接访问不 404）
- [ ] `/data/*` 缓存头生效；HTML 不长期缓存
- [ ] PWA manifest、图标、主题色正确；离线策略符合预期
- [ ] Source map 策略确认（生产不公开敏感源码/密钥）

### 4.3 线上冒烟

- [ ] `/` 返回 200，显示 4 张专题卡片
- [ ] `/atlas/long-march`、`/atlas/zheng-he`、`/atlas/xuanzang`、`/atlas/anti-japanese-war` 可打开
- [ ] `/search` 关键词、类型、日期筛选、重置正常
- [ ] `/privacy` 返回 200，中英文内容完整，高德链接可点
- [ ] `/data/atlases/index.json` 返回 200，含 4 个专题
- [ ] 深链/分享链接可还原专题、时间点、事件、地图视野
- [ ] 未知路径回退首页，不白屏
- [ ] 移动端视口布局、触控、时间轴拖动正常
- [ ] 键盘可操作、焦点可见、对比度可接受
- [ ] 首屏性能与地图加载在可接受范围（记录 Lighthouse/网络面板结果）
- [ ] 无混合内容警告、无 Key 错误、无 CORS 错误

### 4.4 运维与回滚准备

- [ ] Vercel Deployment Protection 已关闭（公开访问不需要登录）
- [ ] 记录当前生产 deployment ID / URL
- [ ] 日志、错误监控、uptime 检查已配置（或明确暂不配置）
- [ ] 回滚步骤已演练（见 §6.5）
- [ ] 自定义域名切换前保留旧部署可访问

---

## 5. 合规检查清单

> 本节受 **B5（高德许可）** 与 **B4（隐私政策正式 URL）** 阻塞；高德书面确认前不得公开上架。

### 5.1 隐私政策

- [ ] 正式隐私政策 URL 可公开访问（HTTPS，无需登录）
- [ ] 中英文版本内容一致，更新日期明确
- [ ] 高德 SDK 披露完整：提供者、SDK 名称、收集信息、目的、隐私政策链接
- [ ] 「本版本不申请定位权限」与实际 manifest/Info.plist 一致
- [ ] 无账号、无广告、无画像的表述与实际依赖一致
- [ ] 数据存储、CDN、第三方共享、保留期限说明合理
- [ ] 联系方式可用（GitHub Issues 或用户指定邮箱）
- [ ] 移动端首次启动隐私说明与同意流程可复现
- [ ] 儿童隐私/目标受众说明（如适用）
- [ ] 隐私政策变更记录与版本号

### 5.2 高德许可与地图合规

- [ ] 高德商用/上架许可已书面确认（范围、地区、配额、期限）
- [ ] Android Key 绑定 release SHA-1（含 Play App Signing SHA-1）
- [ ] iOS Key 绑定 Bundle ID
- [ ] Web Key 绑定正式域名；securityJsCode 已重置并代理
- [ ] 配额/并发/日调用量满足预期，超限有降级提示
- [ ] 地图署名/版权标识符合高德要求（应用内已展示）
- [ ] 高德 SDK 隐私政策版本已复核（以提交日为准）
- [ ] 中国大陆发行：确认地图审图号、测绘资质、底图合规
- [ ] 历史路线/边界表达审查：不表达行政边界主张，标注示意性质
- [ ] 高德 Logo/商标使用符合品牌规范

### 5.3 商店声明一致性

- [ ] App Store App Privacy 与高德 SDK 行为一致
- [ ] Google Play Data safety 与高德 SDK 行为一致
- [ ] 广告声明：无广告
- [ ] 内购声明：无内购
- [ ] 账号删除：不适用（无账号）
- [ ] 跟踪声明：未集成广告/统计/画像 SDK；未请求 ATT
- [ ] 年龄分级/内容分级问卷与实际内容一致
- [ ] 出口合规/加密声明与实际传输一致
- [ ] 中国大陆：APP 备案、ICP 备案（如自建域名/国内托管）
- [ ] 若使用国内商店，准备软著、授权书、承诺函等材料

### 5.4 内容与知识产权

- [ ] 专题图片、封面、图标、字体授权可追溯
- [ ] 史料来源、作者、年份、链接已标注；无大段未授权转载
- [ ] 历史数据标注「示意初稿」，不宣称权威结论
- [ ] 地图数据版权/署名符合高德要求
- [ ] 开源依赖许可证合规（Expo/React Native/高德 SDK 等）
- [ ] 隐私政策、商店文案、应用内文案无相互矛盾

### 5.5 安全与密钥

- [ ] Web Key/securityJsCode 已重置（曾出现在临时构建/聊天）
- [ ] 移动端 AMap Key 如曾泄露，已评估是否轮换
- [ ] 仓库与 git 历史中无 keystore、证书、口令、`.env.local`
- [ ] CI/构建日志不打印 Key、口令、签名信息
- [ ] 商店账号开启 2FA，恢复码离线保存
- [ ] 依赖漏洞扫描（`pnpm audit` 或等效）结果已评估
- [ ] 备份策略：keystore、证书、Profile、环境变量、部署配置

---

## 6. 文档、发布与回滚

### 6.1 文档更新

- [x] 英文商店元数据初稿已创建：[store-metadata-en.md](store-metadata-en.md)
- [x] 发布检查清单初稿已创建：本文档
- [x] 中文商店元数据已同步到 0.42.0 / 4 个专题
- [x] M42 发布说明已创建：[2026-11-05-v0.42.0-m42.md](2026-11-05-v0.42.0-m42.md)
- [x] `CHANGELOG.md` 已记录 M42（待发布确认）
- [ ] ⚠️ 截图 README 更新为真机截图与最终尺寸
- [ ] ⚠️ 部署指南补充正式域名、DNS、HTTPS、代理配置
- [ ] ⚠️ 隐私政策文档与应用内文案同步
- [x] README 状态已更新为 M42 / 发布候选
- [ ] 全仓 Markdown 内部链接扫描 0 断链
- [ ] 文档中无 Key、口令、个人信息、未确认的账号/许可声明

### 6.2 版本一致性

- [x] 根 `package.json`、`apps/web`、`apps/shared`、`apps/mobile` 版本一致（均为 `0.42.0`）
- [x] `apps/mobile/app.json` 的 `version` 与包版本一致（`0.42.0`）
- [x] `apps/mobile/android/app/build.gradle` 的 `versionName 0.42.0` / `versionCode 39` 正确（产物待重建）
- [x] `apps/mobile/ios/app/Info.plist` 的 `CFBundleShortVersionString 0.42.0` / `CFBundleVersion 39` 正确
- [x] 数据契约版本 `atlas-schema v1.0.0` 未意外变更
- [ ] 如变更数据，`pnpm validate:data` 通过（4 专题 / 118 事件 / 127 路线段；应用内索引 4 专题）
- [ ] 如变更数据，`pnpm check:routes` 通过（事件-路线 0 个 >30km）

### 6.3 双仓与 tag

- [x] 最终提交已评审，工作区干净
- [x] 版本号与 tag 名称已确认（`v0.42.0-m42`）
- [x] GitHub `main` 与 Gitee `master`/`main` 同步
- [x] 双仓均推送 tag，且指向同一 commit
- [x] `git ls-remote` 校验两仓 refs 一致
- [ ] Release notes 关联 tag、commit、构建产物
- [ ] 构建产物校验和（APK/AAB/IPA）记录并归档

### 6.4 发布执行顺序

1. [ ] 冻结代码，确认本次发布范围
2. [ ] 对齐所有版本号，完成最终构建
3. [ ] 真机验收（iOS/Android/Web 移动端）
4. [ ] 真机截图与商店素材定稿
5. [ ] 商店文案、隐私表单、审核备注填写完成
6. [ ] 域名、HTTPS、隐私政策、高德许可复核
7. [ ] 提交 App Store / Google Play / 国内商店
8. [ ] 打 tag 并双仓推送，归档产物与校验和
9. [ ] 发布后 24–72 小时监控崩溃、地图错误、商店审核反馈

### 6.5 回滚预案

- [ ] Web：保留上一个生产 deployment；回滚时 promote 上一版本，验证 `/`、`/privacy`、`/data/atlases/index.json`
- [ ] Android：保留上一版 AAB/APK；Play 分阶段发布可暂停；**不能降 versionCode**，严重问题用更高 versionCode 发 hotfix
- [ ] iOS：保留上一版 archive/IPA；暂停分阶段发布；严重问题提交更高 build 的 hotfix；必要时下架
- [ ] 数据：保留上一 tag 的 `data/atlases`；回滚后刷新 CDN 缓存，验证 4 个专题
- [ ] 域名/DNS：切换前低 TTL；保留旧部署可访问；回滚 DNS 记录
- [ ] 回滚演练一次，记录耗时与负责人
- [ ] 对外沟通模板（GitHub Issue / 商店更新说明）

---

## 7. 仍需用户提供

| 编号 | 信息 | 用途 | 关联阻塞 |
| --- | --- | --- | --- |
| U1 | Apple Developer Team ID、App Store Connect 权限 | iOS 证书、TestFlight、提审 | B1 |
| U2 | Google Play Console 账号、开发者验证 | Android 提审 | B3 |
| U3 | 国内商店账号（如适用） | 国内分发 | B3 |
| U4 | 正式域名、DNS 管理权限 | 隐私政策/数据 URL、HTTPS | B4 |
| U5 | 高德商用许可/合同、控制台权限 | Key 白名单、配额、合规 | B5 |
| U6 | iPhone 真机（arm64）、Android 手机/平板 | 真机验收与截图 | B2 |
| U7 | 审核联系人姓名、邮箱、电话 | 商店后台 | B1/B3 |
| U8 | 著作权主体/版权行文案 | Copyright 字段 | — |
| U9 | 是否支持 iPad/Android 平板 | 截图与布局范围 | — |
| U10 | 是否做中国大陆发行 | APP 备案、审图号、商店选择 | B5 |
| U11 | M42 最终版本号与 tag | 发布与双仓 tag | — |

---

## 8. 结论

**当前不具备提交条件。** 文案与检查项已就绪，但以下五项必须由用户先解除：

1. iOS 账号/证书；
2. iPhone 与 Android 真机；
3. App Store Connect / Google Play / 国内商店账号；
4. 正式域名与 HTTPS；
5. 高德商用许可。

在上述条件满足前，可继续完成不依赖外部账号的内部项：Android 0.42.0 构建、真机截图替换、Web 密钥重置与回滚演练。
