# M98 桌面端 Tauri 与多商店发布 — 方案

- **日期**：2026-11-11
- **里程碑**：M98
- **状态**：实施中
- **关联**：
  - [M98 计划](2026-11-11-M98-桌面端Tauri与多商店发布-plan.md)
  - [发布前检查清单](../releases/release-checklist.md)
  - [商店上架元数据](../releases/store-metadata.md)

## 1. 端与产物矩阵

| 端 | 工程 | 产物 | 商店 |
| --- | --- | --- | --- |
| Web / PWA | `apps/web` | 静态站点 | Vercel / Cloudflare Pages |
| iPhone + iPad | `apps/mobile` | 通用 `.ipa` | App Store Connect |
| Android 手机/平板 | `apps/mobile` | `.aab` / `.apk` | Google Play、华为 AppGallery、国内商店 |
| macOS | `apps/desktop` | `.app` / `.dmg` / Mac App Store 包 | Mac App Store、官网直发 |
| Windows | `apps/desktop` | NSIS `.exe` | Microsoft Store（Win32 提交） |

## 2. 为什么桌面端用 Tauri 复用 Web

1. 桌面端不需要高德原生 SDK；Web 版已经使用高德 JS API，WebView 可直接运行；
2. 地图、时间轴、筛选、搜索、分享、隐私页全部复用，避免第三套 UI；
3. Tauri 使用系统 WebView（macOS WKWebView / Windows WebView2），安装包约 10–20MB，明显小于 Electron；
4. Rust 工具链在本机已具备，后续可扩展原生菜单、文件导出、自动更新；
5. 数据包随安装包内置，离线可浏览（地图瓦片仍需联网）。

### 放弃的方案

| 方案 | 放弃原因 |
| --- | --- |
| Electron | 包体 100MB+、内存占用高；本项目不需要 Node 主进程能力 |
| react-native-macos / react-native-windows | 与 Expo 版本耦合，`expo-gaode-map` 无桌面实现，维护成本最高 |
| Mac Catalyst | React Native 不支持 |
| 仅 PWA | 无法提交 Mac App Store；Windows 商店体验受限 |

## 3. 工程结构

```
apps/desktop/
├── package.json
├── README.md
└── src-tauri/
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    ├── capabilities/default.json
    ├── entitlements.plist
    ├── icons/
    └── src/{main.rs,lib.rs}
```

- `frontendDist` 指向 `../../web/dist`；
- `beforeBuildCommand` 调用 `pnpm --filter @atlas/web build:desktop`；
- 桌面模式（Vite `mode=desktop`）下：
  - 关闭 `vite-plugin-pwa`（Tauri 自定义协议不支持 Service Worker）；
  - 使用 `HashRouter`，避免 WebView 内刷新 404；
  - 外链通过 `tauri-plugin-opener` 交给系统浏览器。

## 4. 桌面配置

| 项 | 值 |
| --- | --- |
| 产品名 | 史迹 |
| Identifier | `com.openchronicle.atlas.desktop` |
| 窗口 | 1280×800，最小 1024×640，居中、可缩放 |
| macOS 最低版本 | 13.0 |
| macOS 沙盒 | `com.apple.security.app-sandbox` + `com.apple.security.network.client` |
| Windows WebView2 | `downloadBootstrapper` |
| 安装包目标 | macOS：app/dmg；Windows：NSIS（中文 productName 下 WiX MSI 不可用） |

> Identifier 与移动端 `com.openchronicle.atlas` 区分，避免 App Store Connect 中 iOS 与 macOS 记录冲突。

## 5. 发布流水线

### 5.1 Apple

- iOS/iPadOS：Xcode Archive 或 EAS Build 产出 `.ipa` → Transporter/altool 上传 → TestFlight → App Store 审核；
- macOS：本机 `tauri build` 产出 `.app`，用 `productbuild`/Transporter 提交 Mac App Store（需 Mac App Distribution 证书与 provisioning profile）；
- Windows 机器不可用时，由 GitHub Actions `windows-latest` 构建。

### 5.2 华为 AppGallery

- 复用 Android 签名 AAB/APK；
- 需要华为开发者实名认证、软著、APP 备案、隐私政策 URL；
- 纯血鸿蒙（HarmonyOS NEXT）不兼容 APK，需另立 ArkTS 工程，不在本里程碑范围。

### 5.3 Microsoft Store

- 暂无 Partner Center 账号，先产出 NSIS；
- 后续注册后以 Win32（EXE）方式提交，或改用 MSIX 打包；
- 需要 Privacy Policy URL、支持 URL、商店截图。

## 6. 风险

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 高德 Web Key 未绑定桌面来源 | 地图无法加载 | 在高德控制台为桌面端配置 Key/安全密钥；或用代理域名 |
| Mac App Store 4.2 最低功能审查 | 被拒 | 强化离线数据、原生菜单、分享/导出、桌面快捷键 |
| Tauri 首次构建下载依赖慢 | 构建超时 | 使用镜像/CI 缓存；本机已具备 Rust |
| Windows 无签名证书 | SmartScreen 警告 | 购买代码签名证书或走 Microsoft Store 签名 |
| 中区 App Store / 国内安卓要求 APP 备案 | 无法上架 | 提前完成 APP 备案与软著 |

## 7. 数据与合规

- 不新增权限；
- 不采集定位；
- 隐私政策继续披露高德地图 SDK/JS API；
- 桌面端不引入自动更新与遥测。
