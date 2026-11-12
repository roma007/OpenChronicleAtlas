# 多商店提交指南（Apple / 华为 / 微软）

- **日期**：2026-11-11
- **适用版本**：`1.0.0`（M98 起的桌面与移动发布流程；此后每次提交按 `agent.md` 递增 1.0.X）
- **关联**：
  - [发布前检查清单](../releases/release-checklist.md)
  - [中文商店元数据](../releases/store-metadata.md)
  - [英文商店元数据](../releases/store-metadata-en.md)
  - [桌面端工程](../../apps/desktop/README.md)

> 本文只描述可执行步骤，不包含账号、证书或密钥。所有签名材料不得提交到仓库。

## 0. 产物矩阵

| 平台 | 构建命令 | 产物 | 提交入口 |
| --- | --- | --- | --- |
| iPhone / iPad | Xcode Archive 或 EAS | `.ipa` | App Store Connect |
| macOS | `pnpm --filter @atlas/desktop bundle:mac` | `.app` / `.dmg` / `.pkg` | Mac App Store / 官网 |
| Android | `pnpm --filter @atlas/mobile android:bundle` | `.aab` | 华为 AppGallery / Google Play |
| Android 侧载 | `pnpm --filter @atlas/mobile android:apk` | `.apk` | 官网 / 国内商店 |
| Windows | `pnpm --filter @atlas/desktop bundle:win` 或 GitHub Actions | NSIS `.exe` | Microsoft Store |

---

## 1. 通用准备（三端都需要）

| 材料 | 说明 |
| --- | --- |
| 隐私政策 URL | 必须使用正式域名，不能是 `*.vercel.app` 临时地址 |
| 支持 URL | 可用 GitHub 仓库或产品页 |
| 应用图标 | 1024×1024，无透明通道问题 |
| 商店截图 | 手机、平板、桌面分别准备 |
| 软件著作权 | 国内安卓市场通常要求；建议提前申请 |
| APP 备案号 | 中国大陆分发需要；由接入服务商（阿里云/腾讯云/华为云）协助备案 |
| 高德商用许可 | 书面确认地图服务可用于上架；确认 Key 配额、来源限制、审图号 |
| 内容分级 | 教育/参考类，无用户生成内容、无广告 |

> **APP 备案注意**：Vercel 不是中国大陆接入服务商，无法直接为 APP 备案。建议把静态数据与隐私政策镜像到华为云 OBS / 阿里云 OSS + CDN，并绑定已备案域名，再用于商店填写。

### 1.1 GitHub Actions 自动构建

`.github/workflows/build-installers.yml` 在 **push main**、**push tag `v*-m*`** 或手动触发时运行，产出：

| Artifact | 内容 | 条件 |
| --- | --- | --- |
| `atlas-web` | Web/PWA 静态包 zip | 始终 |
| `atlas-macos-arm64` / `atlas-macos-x64` | `.dmg` + `.app.tar.gz` | 始终 |
| `atlas-windows` | NSIS `.exe` | 始终 |
| `atlas-android-debug` | 可安装的 debug APK | 始终 |
| `atlas-android-release` | 签名 AAB + APK | 配置 Android keystore secrets |
| `atlas-ios` | 签名 IPA + dSYM | 配置 Apple 签名 secrets |

推送 tag 时，workflow 会自动创建 GitHub Release 并附上上述产物。

**GitHub 仓库 Secrets（Settings → Secrets and variables → Actions）：**

| Secret | 用途 |
| --- | --- |
| `VITE_AMAP_KEY` | Web 高德 JS Key |
| `VITE_AMAP_SECURITY_CODE` | Web 高德安全密钥 |
| `VITE_AMAP_DESKTOP_KEY` | 桌面端高德 JS Key（未配置时回退 Web Key） |
| `VITE_AMAP_DESKTOP_SECURITY_CODE` | 桌面端安全密钥 |
| `EXPO_PUBLIC_AMAP_ANDROID_KEY` | Android 高德 Key |
| `EXPO_PUBLIC_AMAP_IOS_KEY` | iOS 高德 Key |
| `ANDROID_KEYSTORE_BASE64` | Android release keystore（base64） |
| `ANDROID_KEYSTORE_PASSWORD` | keystore 密码 |
| `ANDROID_KEY_ALIAS` | key alias |
| `ANDROID_KEY_PASSWORD` | key 密码 |
| `APPLE_TEAM_ID` | Apple Team ID |
| `APPLE_CERTIFICATE_BASE64` | Apple Distribution `.p12`（base64） |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12` 密码 |
| `APPLE_PROVISIONING_PROFILE_BASE64` | App Store `.mobileprovision`（base64） |
| `APPLE_PROVISIONING_PROFILE_NAME` | profile 名称（需与安装后一致） |

可选 Repository variable：`SHARE_BASE_URL`（桌面端分享链接的正式 Web 域名）。

配置完本地 `.env.local` 后，可直接运行：

```bash
gh auth login
bash scripts/set-github-secrets.sh
```

脚本只上传 Secret 名称与值，不会把 Key 写入仓库；检测到 `~/.openchronicle/atlas-keystore.properties` 时会一并上传 Android 签名。

Apple 签名材料可单独上传：

```bash
bash scripts/set-apple-secrets.sh /path/to/distribution.p12 /path/to/profile.mobileprovision
```

脚本会从 `.mobileprovision` 解析 Team ID 与 profile 名称，并提示输入 `.p12` 密码。

> 未配置高德 Key 时，CI 仍会产出安装包，但地图无法加载；未配置 Android keystore 时只产出 debug APK；未配置 Apple 签名时 iOS job 自动跳过。

### 版本号规则

- 移动端 `version` / iOS `buildNumber` / Android `versionCode` 必须递增；
- 桌面端 `apps/desktop/package.json`、`src-tauri/Cargo.toml`、`tauri.conf.json` 三处版本保持一致；
- 数据版本 `data/atlases/index.json` 的 `dataVersion` 与发布说明一致。

---

## 2. Apple App Store Connect

### 2.1 iOS / iPadOS

**准备**

1. Apple Developer Program 有效，完成付费应用协议、税务与银行信息；
2. 在 Certificates, Identifiers & Profiles 创建 App ID：`com.openchronicle.atlas`；
3. 创建 App Store Distribution 证书与 Provisioning Profile；
4. 在 App Store Connect 创建 App，Bundle ID 选择上述 App ID，勾选 iPhone 与 iPad。

**构建（二选一）**

A. 本机 Xcode：

```bash
pnpm --filter @atlas/mobile prebuild:clean
open apps/mobile/ios/app.xcworkspace
```

在 Xcode 中选择 `Any iOS Device (arm64)` → Product → Archive → Distribute App → App Store Connect。

B. EAS Build：

```bash
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest init          # 首次，写入 projectId
pnpm eas:build:ios
pnpm eas:submit:ios
```

**iPad 必查**

- `apps/mobile/app.config.ts` 已启用 `supportsTablet`；
- 自定义插件 `apps/mobile/plugins/with-ipad-orientations.js` 已写入 iPad 四方向与 `UIRequiresFullScreen=false`；
- 重新执行 `prebuild:clean` 后，检查 `ios/app/Info.plist` 中 `UISupportedInterfaceOrientations~ipad`；
- 准备 13 英寸 iPad 截图，并在审核备注中说明 iPad 布局。

**TestFlight**

上传后等待处理完成 → 内部测试 → 外部测试（可选）→ 提交审核。审核备注需说明：

- 无定位权限；
- 地图服务由高德提供；
- 数据为离线内置，首次启动无需登录。

### 2.2 macOS（Mac App Store）

**方案 A：iPad 版上 Mac（最快）**

在 App Store Connect 的 App 信息页勾选 “Make this app available on Mac”。无需新工程，但交互仍是 iPad 形态，且需确认高德 iOS SDK 在 Apple Silicon Mac 正常。

> 方案 A 与方案 B **二选一**。两者 Bundle ID 不同，同时提交会在 Mac App Store 出现两个同名应用，也会分散评价与下载。

**方案 B：Tauri 桌面版（推荐正式版）**

1. 在 Apple Developer 创建 macOS App ID：`com.openchronicle.atlas.desktop`；
2. 创建 Mac App Distribution 证书与 Mac Installer Distribution 证书；
3. 创建 Mac App Store Provisioning Profile；
4. 本机构建：

```bash
export APPLE_SIGNING_IDENTITY="Apple Distribution: <Team Name> (<TEAMID>)"
export APPLE_TEAM_ID="<TEAMID>"
pnpm --filter @atlas/desktop exec tauri build --bundles app
```

5. 打包为 `.pkg`：

```bash
productbuild \
  --component "apps/desktop/src-tauri/target/release/bundle/macos/史迹.app" /Applications \
  --sign "3rd Party Mac Developer Installer: <Team Name> (<TEAMID>)" \
  "史迹.pkg"
```

6. 用 Transporter 或 `xcrun altool` 上传：

```bash
xcrun altool --upload-app -f "史迹.pkg" -t macos \
  --apiKey "<App Store Connect API Key ID>" \
  --apiIssuer "<Issuer ID>"
```

7. 在 App Store Connect 创建 macOS App 记录，等待构建处理后提交审核。

**审核风险**：Mac App Store 指南 4.2（Minimum Functionality）可能质疑“网页套壳”。建议在审核备注中强调：10 个离线专题数据包、桌面大屏布局、系统浏览器外链、无账号依赖。后续可增加原生菜单、导出/打印、快捷键以增强桌面属性。

**签名注意**：`src-tauri/entitlements.plist` 已启用 App Sandbox 与 `com.apple.security.network.client`；高德地图需要出网权限。

### 2.3 macOS 官网直发（DMG）

不走 Mac App Store 时，需要 Developer ID 证书 + 公证，否则用户首次打开会被 Gatekeeper 拦截：

```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: <Team Name> (<TEAMID>)"
export APPLE_ID="<Apple ID>"
export APPLE_PASSWORD="<App 专用密码>"
export APPLE_TEAM_ID="<TEAMID>"
pnpm --filter @atlas/desktop bundle:mac
```

Tauri 会签名并尝试公证。若需手动处理：

```bash
codesign --deep --force --options runtime \
  --sign "Developer ID Application: <Team Name> (<TEAMID>)" \
  "apps/desktop/src-tauri/target/release/bundle/macos/史迹.app"

xcrun notarytool submit "apps/desktop/src-tauri/target/release/bundle/dmg/史迹_1.0.0_aarch64.dmg" \
  --apple-id "<Apple ID>" --team-id "<TEAMID>" --password "<App 专用密码>" --wait

xcrun stapler staple "apps/desktop/src-tauri/target/release/bundle/dmg/史迹_1.0.0_aarch64.dmg"
```

---

## 3. 华为 AppGallery

### 3.1 准备

1. 注册华为开发者账号并完成实名认证；
2. 在 AppGallery Connect 创建应用，包名填 `com.openchronicle.atlas`；
3. 准备软著、APP 备案号、隐私政策 URL、权限说明、应用截图、内容分级；
4. 确认高德地图商用许可覆盖华为渠道。

### 3.2 构建签名 AAB

签名配置使用本机 `~/.openchronicle/atlas-keystore.properties`（不得提交）：

```properties
storeFile=/absolute/path/to/atlas-release.keystore
storePassword=******
keyAlias=atlas
keyPassword=******
```

```bash
pnpm --filter @atlas/mobile prebuild:clean
node apps/mobile/scripts/configure-android-release.mjs
pnpm --filter @atlas/mobile android:bundle
```

产物：`apps/mobile/android/app/build/outputs/bundle/release/app-release.aab`
侧载 APK：`apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

### 3.3 提交

1. AppGallery Connect → 我的应用 → 版本信息 → 上传 AAB/APK；
2. 填写隐私政策、权限使用说明（本应用不申请定位权限）；
3. 选择分类“教育/参考”，填写年龄分级；
4. 提交审核，按驳回意见补充材料。

### 3.4 HarmonyOS 说明

华为新款纯血鸿蒙（HarmonyOS NEXT）不运行 Android APK。AppGallery 仍可分发 Android 版本给 HarmonyOS 4.x 及以下设备；如需覆盖 NEXT，需要单独开发 ArkTS/HAP 工程，`expo-gaode-map` 不可用，不在当前范围。

---

## 4. Microsoft Store

当前暂无 Partner Center 账号，先用 GitHub Actions 产出 NSIS `.exe`，账号就绪后提交。

### 4.1 构建

```bash
pnpm --filter @atlas/desktop bundle:win
```

或手动触发 `.github/workflows/build-installers.yml`，下载 `atlas-windows` artifact。

产物：

- `apps/desktop/src-tauri/target/release/bundle/nsis/史迹_1.0.0_x64-setup.exe`

> Tauri 的 WiX MSI 在中文 `productName` 下会报 `LGHT0311`（代码页 1252），因此默认只出 NSIS。若必须 MSI，可把 `productName` 改为 ASCII，或为 WiX 配置中文代码页后单独启用。

### 4.2 提交

1. 注册 Microsoft Partner Center 开发者账号（个人或企业，按当前政策验证）；
2. 预留应用名称“史迹 · 时空地图”；
3. 选择 Win32 应用（EXE）提交方式；
4. 填写隐私政策 URL、支持 URL、系统要求（Windows 10 1809+，WebView2）；
5. 上传 NSIS EXE，填写年龄分级与商店截图；
6. 提交认证。

### 4.3 签名建议

未签名的 EXE 会触发 SmartScreen 警告。正式发布建议购买代码签名证书（EV 或 OV），或在 Partner Center 使用商店签名。GitHub Actions 中通过 Secrets 注入证书与密码，不得写入仓库。

---

## 5. 提审前统一检查

- [ ] 版本号三处一致，`versionCode` / `buildNumber` 已递增；
- [ ] 数据校验通过：`pnpm validate:data`；
- [ ] Web 构建通过：`pnpm --filter @atlas/web build`；
- [ ] 桌面构建通过：`pnpm --filter @atlas/desktop bundle:mac`；
- [ ] 移动端类型检查通过：`pnpm --filter @atlas/mobile typecheck`；
- [ ] 隐私政策包含高德披露，且 URL 可公开访问；
- [ ] 高德 Key 已按平台绑定，未在前端暴露 `securityJsCode`（Web 建议走代理）；
- [ ] 截图与真机/真桌面一致；
- [ ] 审核备注写明无定位、无登录、无广告、数据离线。

## 6. 回滚

| 平台 | 回滚方式 |
| --- | --- |
| App Store | App Store Connect 移除当前版本，恢复上一版本销售 |
| 华为 | AppGallery 下架当前版本，重新提交旧 AAB |
| Microsoft Store | Partner Center 取消发布/回退到上一提交 |
| Web / 桌面 | Vercel 回滚部署；桌面下载页换回旧安装包 |
