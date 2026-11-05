# 商店元数据（英文版）— v0.32.0

- **日期**：2026-11-05
- **适用版本**：`0.32.0`（Android `versionCode 29`；iOS build `29`）
- **适用商店**：Apple App Store、Google Play、国内应用商店（如适用）
- **状态**：M32 提审草稿。账号、真机截图、自定义域名、高德商用许可均未确认，**不可直接提交**
- **关联文档**：
  - [中文商店元数据草稿](store-metadata.md)（已同步为 0.32.0、4 个专题）
  - [M32 发布说明](2026-11-05-v0.32.0-m32.md)
  - [全项目收尾审计](2026-11-04-final-audit.md)
  - [部署指南](../guides/deployment.md)
  - [截图目录](screenshots/README.md)
  - [发布前检查清单](release-checklist.md)

> 本文档只写商店文案与披露口径，不修改任何代码、配置或数据。
> 所有「待确认」项必须由用户或高德侧书面确认后再提交，不得用推测内容替代。

---

## 1. 商店文案（English）

### 1.1 App name

| 项目 | 内容 | 限制 |
| --- | --- | --- |
| English name | **OpenChronicle Atlas** | 19 / 30 字符 |
| Chinese name（参考） | **史迹 · 时空地图** | 9 字符（含空格与间隔号） |

说明：

- 应用内英文标题目前为 `Chronicles Atlas`，与商店名 `OpenChronicle Atlas` 不完全一致；建议提审前统一品牌名，但这属于代码/文案改动，不在本文档范围内。
- iOS `CFBundleDisplayName` 与 Android `app_name` 当前均为「史迹」，即设备桌面图标显示中文名；英文商店名与桌面名不一致属于可接受状态，但需在审核备注中说明。

### 1.2 Subtitle（Apple，≤ 30 字符）

> **History on Maps & Timelines**

27 / 30 字符。

Google Play 无独立副标题字段，可将同一句放入短描述开头。

### 1.3 Short description（Google Play，≤ 80 字符）

> **Explore history through maps and timelines. Drag time and watch routes unfold.**

78 / 80 字符（含空格与句号）。

### 1.4 Promotional text（Apple，可选，≤ 170 字符）

> **Four atlases, one timeline: the Long March, Zheng He’s voyages, Xuanzang’s Silk Road, and China’s War of Resistance. Search by category or date.**

148 / 170 字符。该字段可在不重新提审的情况下更新，但不得包含价格、排名或未经验证的宣传语。

### 1.5 Long description（≤ 4000 字符）

> **OpenChronicle Atlas is a general-purpose atlas of history, built around two simple ideas: a map and a timeline.**
>
> Choose an atlas, then drag or play the timeline. Routes grow as the story advances, events appear at their moment in time, and tapping a marker opens its details, sources, and related events. You can filter by category or date, search across every atlas, and share a link to a specific moment.
>
> The platform is not tied to a single historical narrative. Each atlas is a pluggable dataset, so new topics can be added without changing the app.
>
> **Included atlases**
>
> • The Long March (1934–1936)
> • Zheng He’s Voyages (1405–1433)
> • Silk Road: Xuanzang’s Journey (629–645)
> • The War of Resistance Against Japan (1931–1945)
>
> **Features**
>
> • Map and timeline playback, zoom, and event markers
> • Event details with descriptions, sources, and related events
> • Cross-atlas search with category and date filters
> • Chinese and English interface
> • Shareable deep links to atlases, events, and map views
> • Available as a web app and on mobile
>
> OpenChronicle Atlas is free. There is no account, no advertising, and no in-app purchase. The current version does not request location permission. Map display is provided by AMap (AutoNavi).
>
> The historical data is an illustrative draft compiled for education and exploration. It is not an authoritative historical record; please consult the cited sources and scholarly literature.

字符数约 1,380，低于 4000 上限。

写作口径说明：

- 不写「最完整」「权威」「唯一」等无法证明的表述；
- 不写「离线可用」作为通用卖点（当前仅 Web PWA 有离线能力，移动端未做完整离线地图）；
- 不写「无追踪」绝对表述；准确说法是「除隐私政策披露的地图 SDK 外，不集成广告、统计或用户画像 SDK」；
- 历史数据明确标注为示意初稿，避免误导；
- 商店文案按 **4 个已索引专题** 编写；四个专题均已加入 `index.json`，首页正常显示。

### 1.6 Keywords（Apple，≤ 100 字符，逗号分隔）

> **history,historical map,timeline,atlas,China,Long March,Zheng He,Silk Road,War of Resistance,education**

83 / 100 字符。

Google Play 无关键词字段，依靠标题、短描述和长描述覆盖上述词；不要堆砌无关热词。

### 1.7 Categories

| 商店 | 主分类 | 次分类 / 标签 | 说明 |
| --- | --- | --- | --- |
| App Store | Education | Reference | 历史教育内容，非新闻、非导航 |
| Google Play | Education | History, Maps | Application 类型，免费 |
| 国内商店 | 教育 | 参考 / 历史 | 按各商店分类体系选择 |

### 1.8 URLs、价格与分级

| 项目 | 内容 | 状态 |
| --- | --- | --- |
| Price | Free | 已确定 |
| Privacy Policy URL（正式） | `https://<domain>/privacy` | ⛔ 域名未定 |
| Privacy Policy URL（当前临时） | `https://open-chronicle-atlas-mengfeng007-7858.vercel.app/privacy` | 据 M19 记录已部署，**待复验**；`*.vercel.app` 在中国大陆可能不可达，不建议作为正式提审地址 |
| Support URL | `https://github.com/roma007/OpenChronicleAtlas` | 可用 |
| Marketing URL（可选） | `https://<domain>/about` | ⛔ 域名未定 |
| Copyright | `2026 OpenChronicle Atlas` | 待用户确认著作权主体 |
| Age rating（建议） | Apple 4+ / Google Everyone（如问卷涉及战争/暴力描述，按实际上调） | 最终以内容分级问卷为准 |
| In-app purchases | None | 已确定 |
| Ads | None | 已确定 |

### 1.9 What’s New（0.32.0）

> **More Anti-Japanese War campaigns, a built-in route QA command, and refreshed release documentation. Search and timeline behavior unchanged.**

如后续发布新版本，需按实际变更重写，不得沿用本段。

### 1.10 中文商店文案（参考，非英文版主体）

| 项目 | 内容 |
| --- | --- |
| 应用名称 | 史迹 · 时空地图 |
| 副标题 | 历史事件时空地图 |
| 短描述 | 以地图与时间轴浏览历史专题：拖动时间轴，看路线生长、事件浮现。 |
| 长描述 | 史迹 · 时空地图是一个通用历史事件时空地图平台。选择专题后，拖动或播放时间轴，观察路线随历史推进而生长；点击节点查看事件详情、史料来源与关联事件。平台不绑定单一历史叙事，专题以数据包接入，可扩展至更多历史主题。当前专题：长征（1934—1936）、郑和下西洋（1405—1433）、丝绸之路·玄奘西行（629—645）、抗日战争（1931—1945）。地图服务由高德地图提供，当前版本不申请定位权限。历史数据为示意初稿，仅供学习与探索，请以引用史料为准。 |
| 分类 | 教育 / 参考 |

> 中文文案中的专题数量、版本信息必须与英文版一致；[store-metadata.md](store-metadata.md) 已同步为「四个专题 / 0.32.0」。

---

## 2. iOS 与 Android 差异

| 项目 | iOS | Android |
| --- | --- | --- |
| 商店 | App Store | Google Play（及国内商店） |
| Bundle ID / package | `com.openchronicle.atlas` | `com.openchronicle.atlas` |
| 商店显示名 | OpenChronicle Atlas | OpenChronicle Atlas |
| 设备桌面名 | 史迹（`CFBundleDisplayName`） | 史迹（`app_name`） |
| 版本号（源配置） | `CFBundleShortVersionString` 为 **0.32.0** | `versionName` 为 **0.32.0** |
| 构建号 | `CFBundleVersion` 为 **29**，每次上传必须递增 | `versionCode` 为 **29**，每次上传必须递增 |
| 最低系统 | iOS 16.4（`IPHONEOS_DEPLOYMENT_TARGET` 与 `LSMinimumSystemVersion` 均为 16.4） | Android 7.0 / API 24（`minSdkVersion 24`） |
| 目标 SDK | 以当前 Xcode 正式版为准 | `targetSdkVersion 36` |
| 架构 | 要求 arm64；AMap iOS SDK 无 arm64 模拟器切片，**必须真机验证** | 确认包含 64 位；Play 要求 64 位 |
| 平板 | `supportsTablet: true`，需 iPad 截图与布局验收 | 未限制平板，建议补 7"/10" 截图与验收 |
| 屏幕方向 | iPhone 竖屏 + 倒置；iPad 四方向 | `MainActivity` 固定竖屏 |
| 签名 | Apple Distribution 证书 + Provisioning Profile | Upload keystore / Play App Signing |
| 产物 | `.xcarchive` / `.ipa`（TestFlight 或 App Store） | `.aab`（Play）；`.apk` 仅侧载/国内商店按需 |
| 深链 scheme | `atlas://`、`com.openchronicle.atlas://` | `atlas://` |
| 定位权限 | 未申请（Info.plist 无 `NSLocation*`） | 未申请（manifest 用 `tools:node="remove"` 移除粗略/精确定位） |
| 明文 HTTP | ATS 默认阻断；仅允许本地网络调试 | `usesCleartextTraffic="false"` 已关闭 |
| 当前发布状态 | ⛔ 无账号/证书/真机，未产出 IPA | ⚠️ 源配置为 0.32.0 / versionCode 29，但上次实际 APK 为 0.5.0 / versionCode 2，需重建 |

> **版本号已对齐**：iOS `0.32.0 (29)`、Android `0.32.0 (29)`。archive 前仍需确认构建产物中的版本号。
> 最低系统已统一为 iOS 16.4（`IPHONEOS_DEPLOYMENT_TARGET` 与 `LSMinimumSystemVersion` 一致）。

---

## 3. 权限说明

### 3.1 Android（按当前主 manifest）

| 权限 | 用途 | 提审口径 |
| --- | --- | --- |
| `INTERNET` | 加载地图瓦片、专题数据与分享链接 | 必需 |
| `ACCESS_NETWORK_STATE` | 高德 SDK 判断网络可用性 | 地图 SDK 必需 |
| `ACCESS_WIFI_STATE` | 高德 SDK 网络状态判断 | 地图 SDK 必需 |
| `READ_EXTERNAL_STORAGE`（maxSdk 32） | Expo/RN 模板默认，当前业务未见使用 | 按最小权限原则复核，能移除则移除 |
| `WRITE_EXTERNAL_STORAGE`（maxSdk 32） | Expo/RN 模板默认，当前业务未见使用 | 同上 |
| `VIBRATE` | Expo/RN 模板默认，当前业务未见触感调用 | 复核后决定是否保留 |
| `SYSTEM_ALERT_WINDOW` | Expo 开发期悬浮窗权限；**release 合并清单中仍存在** | ⚠️ 提审前必须确认是否业务需要；不需要则从主 manifest 移除 |
| 定位权限 | **未申请** | manifest 使用 `tools:node="remove"` 移除 `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` |
| 相机 / 麦克风 / 通讯录 / 相册 | **未申请** | 与功能无关 |

补充：

- manifest 中存在高德 `com.amap.api.location.APSService` 组件，这是 SDK 包内组件；应用未声明定位权限，也未调用设备定位接口。
- `android:allowBackup="true"` 当前开启；提审前确认本地缓存/偏好是否需要排除备份。
- `android:usesCleartextTraffic="true"` 当前开启，生产必须关闭，否则与「HTTPS 传输」的商店声明不一致。

### 3.2 iOS

| 项目 | 状态 | 说明 |
| --- | --- | --- |
| 定位（`NSLocationWhenInUseUsageDescription` 等） | **未申请** | Info.plist 中无任何 `NSLocation*` 键 |
| 相机 / 麦克风 / 通讯录 / 相册 | **未申请** | 无对应 usage description |
| 网络 | 使用 | 通过 HTTPS 加载地图与专题数据 |
| ATS | 仅 `NSAllowsLocalNetworking` | 生产接口必须 HTTPS；本地调试例外 |
| 后台模式 | 未声明 | 无后台定位、后台刷新 |
| 跟踪（ATT） | 未请求 | 未集成广告/归因 SDK；仍需按高德 SDK 实际行为确认 |

### 3.3 商店隐私声明口径

| 商店 | 字段 | 建议口径 | 状态 |
| --- | --- | --- | --- |
| App Store | App Privacy | 按高德 SDK 实际收集行为填写；**不得默认选择 “Data Not Collected”**，除非高德书面确认 SDK 不收集任何数据 | ⛔ 待确认 |
| Google Play | Data safety | 同上；设备/网络信息是否由 SDK 收集、是否共享，需与高德合规文档一致 | ⛔ 待确认 |
| 两者 | Ads | 无广告 | 已确认 |
| 两者 | In-app purchases | 无 | 已确认 |
| 两者 | Account deletion | 不适用（无账号体系） | 已确认 |
| 两者 | Tracking | 应用自身未集成广告/统计/画像 SDK；不请求 ATT | ⚠️ 应用侧已确认；SDK 侧行为待高德确认 |

> 商店隐私表单是开发者对 SDK 行为的声明，不能只照抄应用自身代码。高德 SDK 的设备信息、网络信息收集应如实披露。

---

## 4. 高德 SDK 合规披露

### 4.1 披露表（可直接用于隐私政策/商店说明）

| 项目 | 内容 |
| --- | --- |
| SDK 提供者 | 高德软件有限公司（AutoNavi Software Co., Ltd.） |
| SDK 名称 | 高德地图 SDK（Android / iOS，经 `expo-gaode-map` 接入）；高德地图 JS API 2.0（Web） |
| 使用目的 | 地图渲染、坐标转换（WGS84 → GCJ-02）、地图交互、服务可用性保障 |
| 可能收集的信息 | 设备信息、网络信息、地图交互所需信息（以高德官方隐私政策为准） |
| 是否收集定位 | **不申请定位权限，未主动调用设备定位接口**；SDK 是否基于网络信息做粗略定位，以高德隐私政策为准 |
| 是否共享给第三方 | 应用自身不向第三方共享；地图服务由高德提供，其数据处理以高德隐私政策为准；不用于广告或用户画像 |
| 是否含广告 | 否 |
| 高德隐私政策 | <https://lbs.amap.com/pages/privacy/> |
| 应用隐私政策 | `https://<domain>/privacy`（当前临时地址见 §1.8） |
| 应用内披露 | 移动端首次启动展示隐私说明，含高德 SDK 披露与「同意并继续」；Web 端 `/privacy` 页面含高德条款链接 |
| 地图署名 | 专题页展示「高德地图 · 坐标 WGS84 → GCJ-02」；首页展示「地图服务 · 高德」 |

### 4.2 许可与国内合规

| 项目 | 当前状态 | 提审前动作 |
| --- | --- | --- |
| 高德商用/上架许可 | **未确认**（仓库内无许可凭证） | 向高德确认商用授权范围、配额、上架地区；保留书面凭证 |
| Android Key 绑定 | 包名 + release/debug SHA-1 | 确认 release SHA-1 与商店签名一致；启用 Play App Signing 后需绑定 Google 签名 SHA-1 |
| iOS Key 绑定 | Bundle ID `com.openchronicle.atlas` | 确认与 App Store 记录一致 |
| Web Key 绑定 | 域名白名单 | 绑定正式自定义域名；不要依赖 `*.vercel.app` |
| Web 安全密钥 | 曾出现在临时构建/聊天中 | **重置 securityJsCode**，并通过 `/_AMapService/` 代理，避免前端明文 |
| 地图审图号 / 测绘资质 | **未确认** | 如在中国大陆公开发行，确认高德底图审图号及服务资质覆盖；历史路线为示意，不表达行政边界主张 |
| SDK 隐私政策更新 | 需持续跟踪 | 上架前复核高德最新版隐私政策与合规文档 |

> 以上为合规检查项，不构成法律意见。高德许可、审图号、商店隐私表单的最终口径应由用户与高德/法务确认。

---

## 5. 截图清单与尺寸建议

### 5.1 建议画面（6 张）

| 序号 | 画面 | 英文 caption 建议 | iOS 尺寸 | Android 尺寸 |
| --- | --- | --- | --- | --- |
| 1 | 首页专题卡片墙（4 个专题） | Four atlases, one timeline | 1320×2868 | 1080×1920 |
| 2 | 长征专题：地图 + 时间轴播放中 | Watch the Long March unfold | 1320×2868 | 1080×1920 |
| 3 | 事件详情：描述 + 史料来源 | Every event has its sources | 1320×2868 | 1080×1920 |
| 4 | 搜索：关键词 + 类型/日期筛选 | Search by keyword, category, or date | 1320×2868 | 1080×1920 |
| 5 | 郑和专题：航线 + 时间轴 | Follow Zheng He’s voyages | 1320×2868 | 1080×1920 |
| 6 | 玄奘专题或中英文切换 | A bilingual historical atlas | 1320×2868 | 1080×1920 |
| 7 | 抗日战争专题：路线 + 时间轴 | Follow China’s War of Resistance | 1320×2868 | 1080×1920 |

### 5.2 当前素材

| 平台 | 文件 | 尺寸 | 状态 |
| --- | --- | --- | --- |
| iOS | `screenshots/ios-01-home.jpg` ~ `ios-04-search.jpg` | 1290×2796 | Web 移动端占位，**非真机** |
| Android | `screenshots/android-01-home.jpg` ~ `android-04-search.jpg` | 1080×1920 | Web 移动端占位，**非真机** |
| 通用 | `apps/mobile/assets/feature-graphic.png` | 1024×500 | 可用，需确认文字安全区 |
| 通用 | `apps/mobile/assets/icon.png` | 1024×1024 | 源图；商店图标需 512×512 无透明通道 |
| 通用 | `apps/mobile/assets/splash.png` | 1284×2778 | 启动图，非商店截图 |

### 5.3 尺寸与规范建议

| 商店 / 位置 | 建议尺寸 | 数量 | 备注 |
| --- | --- | --- | --- |
| App Store iPhone 6.9" | 1320×2868 | 3–10 | 当前 App Store Connect 主要求；以后台实际槽位为准 |
| App Store iPhone 6.5" | 1284×2778 或 1242×2688 | 可选 | 兼容旧槽位；1290×2796 属 6.7"，需确认后台是否接受 |
| App Store iPad 13" | 2064×2752 | 3–10 | `supportsTablet: true` 时必须提供 iPad 截图 |
| Google Play 手机 | 1080×1920（建议 1440×2560） | 2–8 | 9:16；最短边 ≥ 320，最长边 ≤ 3840，比例不超过 2:1 |
| Google Play 7" 平板 | 1200×1920 | 可选 | 建议补 |
| Google Play 10" 平板 | 1600×2560 | 可选 | 建议补 |
| Google Play Feature graphic | 1024×500 | 1 | 无圆角、无透明；重要文字避开边缘 |
| Google Play 图标 | 512×512 | 1 | 32-bit PNG，无透明 |
| App Store 图标 | 1024×1024 | 1 | 无透明、无圆角（系统自动裁切） |

### 5.4 提审规则

- **必须用真机截图替换 Web 占位图**；截图中的地图、状态栏、字体、安全区应与实际 App 一致。
- 截图不得包含个人信息、测试账号、调试浮层、`localhost`、浏览器地址栏或「Beta」字样。
- 界面中的「数据初稿 · 待史料校订」标识如保留，需在审核备注说明数据性质；不得用后期合成隐藏真实 UI 缺陷。
- 同一组截图语言一致；英文商店配英文截图，中文商店配中文截图。
- 首两张放最能说明核心体验的画面（首页 + 时间轴地图），不要把设置页/隐私页放首位。
- 截图顺序与文案需与商店描述一致，不宣传当前版本没有的功能（如离线地图、账号同步）。

---

## 6. 审核备注（Review Notes）

### 6.1 English review notes（可粘贴到 App Store Connect / Play Console）

> Thank you for reviewing OpenChronicle Atlas.
>
> **What the app does:** OpenChronicle Atlas is a historical atlas viewer built around a map and a timeline. Users choose an atlas, play or drag the timeline, and tap event markers to read details, sources, and related events.
>
> **Content:** All content is static historical material bundled with the app or loaded from our HTTPS endpoint. There is no user-generated content, no account system, no advertising, no in-app purchase, and no analytics or profiling SDK. The historical data is an illustrative draft for education and exploration; it is not an authoritative historical record, and sources are cited in the app.
>
> **Location:** This version does not request location permission. The Android manifest explicitly removes coarse and fine location; the iOS Info.plist contains no location usage descriptions. The AMap SDK is used only for map display and is disclosed in our privacy policy and first-launch notice.
>
> **How to test:**
> 1. Open the app and choose any atlas.
> 2. Press Play or drag the timeline; routes grow and event markers appear.
> 3. Tap a marker to open event details, sources, and related events.
> 4. Open Search, enter `1935`, then filter by category or date range.
> 5. Use the language toggle to switch between Chinese and English.
>
> **Contact:** Please use the contact details in App Store Connect / Play Console for review communication. [由用户在商店后台填写，本文档不编造邮箱或电话]
>
> **Notes:** Map services are provided by AMap (AutoNavi). The app does not use the map for turn-by-turn navigation or location-based services.

### 6.2 中文审核说明（内部/国内商店）

- 本应用为历史专题地图浏览工具，不是导航、打车、外卖或社交应用；
- 无账号、无 UGC、无广告、无内购、无直播、无付费内容；
- 当前版本不申请定位权限，不读取通讯录/相册/麦克风；
- 地图由高德提供，首次启动有隐私说明与高德 SDK 披露；
- 历史数据为示意初稿，事件详情内附史料来源，避免被认定为「权威历史结论」；
- 若审核员询问「数据初稿」标识：说明这是内容质量状态提示，不是功能未完成。

### 6.3 审核风险清单

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 截图非真机 | 当前为 Web 占位图，商店可能拒审 | 真机重拍后再提交 |
| iOS 版本号 | 已对齐 0.32.0 / build 29 | 无 |
| `SYSTEM_ALERT_WINDOW` | 已在 `blockedPermissions` 屏蔽 | 无 |
| 明文流量 | Android `usesCleartextTraffic=false` | 已关闭 |
| 高德商用许可 | 未确认 | 取得书面许可后再公开上架 |
| 隐私表单与 SDK 行为不一致 | 默认「不收集」可能不实 | 按高德合规文档填写 |
| iPad 截图缺失 | `supportsTablet: true` | 补 iPad 13" 截图或关闭平板支持 |
| 「数据初稿」文案 | 可能被理解为未完成 | 审核备注说明 + 详情页来源可查 |

---

## 7. 仍需用户提供的信息

| 编号 | 信息 | 用途 | 阻塞 |
| --- | --- | --- | --- |
| U1 | Apple Developer Team ID、App Store Connect 权限 | iOS 证书、TestFlight、提审 | ⛔ |
| U2 | Google Play Console 账号与开发者验证 | Android 提审 | ⛔ |
| U3 | 国内商店开发者账号（如小米/华为/OPPO/vivo/应用宝） | 国内分发 | ⛔（如做国内市场） |
| U4 | 正式域名与 DNS 管理权限 | 隐私政策、数据域名、商店 URL | ⛔ |
| U5 | 高德商用许可/合同、控制台账号 | Key 白名单、配额、合规 | ⛔ |
| U6 | iPhone 真机（arm64）与 Android 真机/平板 | 真机验收与截图 | ⛔ |
| U7 | 审核联系人姓名、邮箱、电话 | 商店后台审核联系 | ⛔ |
| U8 | 著作权主体/版权行文案 | Copyright 字段 | 待确认 |
| U9 | 是否支持 iPad/Android 平板 | 截图与布局范围 | 待确认 |
| U10 | 是否做中国大陆发行 | APP 备案、审图号、商店选择 | 待确认 |
| U11 | 确认 `v0.32.0-m32` 的双仓 tag | 发布与双仓 tag | 待确认 |

---

## 8. 提交前一句话结论

**文案已可按英文商店要求填写；但在 iOS 账号、真机（含真机截图）、商店账号、正式域名、高德商用许可五项外部条件就绪前，本版本不具备提交条件。**
