# ADR-0010：桌面端采用 Tauri 2 复用 Web 构建

- **状态**：已接受
- **日期**：2026-11-11
- **决策者**：项目负责人、AI 开发助手
- **关联**：
  - [ADR-0001](ADR-0001-三端技术选型与monorepo架构.md)
  - [ADR-0004](ADR-0004-底图改用高德地图与坐标体系.md)
  - [ADR-0007](ADR-0007-移动端架构与构建发布方案.md)
  - [M98 方案](../plans/2026-11-11-M98-桌面端Tauri与多商店发布-design.md)

## 背景

项目已有 Web（React + Vite + 高德 JS API）与移动端（Expo + React Native + `expo-gaode-map`），需要新增 macOS 与 Windows 端并发布到 Mac App Store 与 Microsoft Store。

约束：

1. 高德原生 SDK 只有 iOS/Android，没有桌面实现；
2. Web 版地图、时间轴、筛选、搜索已完整，可复用；
3. 桌面端包体与内存应可控；
4. 需要支持 Mac App Store 的 App Sandbox。

## 决策

新增 `apps/desktop`，使用 **Tauri 2** 包装 `apps/web` 的构建产物：

- `frontendDist` 指向 `apps/web/dist`；
- 桌面构建使用 Vite `mode=desktop`，关闭 PWA、改用 `HashRouter`；
- 外链通过 `tauri-plugin-opener` 交给系统浏览器；
- macOS 启用 App Sandbox 与 `com.apple.security.network.client`；
- Windows 使用 WebView2，产出 MSI/NSIS；
- 版本与构建号与移动端发布列车对齐（`0.95.0` / build `92`）。

## 备选方案

| 方案 | 结论 | 原因 |
| --- | --- | --- |
| Electron | 放弃 | 包体 100MB+，无 Node 主进程需求 |
| react-native-macos / windows | 放弃 | `expo-gaode-map` 无桌面实现，版本耦合高 |
| Mac Catalyst | 放弃 | React Native 不支持 |
| 仅 PWA | 放弃 | 无法提交 Mac App Store |

## 后果

**正面**

- 一套 Web UI 同时服务 Web 与桌面；
- 安装包小（debug `.app` 约 26MB，DMG 约 8MB）；
- Rust 工具链本机可用，后续可扩展原生菜单、导出、自动更新；
- 不引入第三套地图实现。

**负面 / 风险**

- Mac App Store 可能以 4.2（Minimum Functionality）审查“网页套壳”；
- 桌面端依赖高德 JS API 的 Key 来源限制；
- Windows 构建需要 Windows 机器或 CI；
- Tauri 首次编译耗时较长（约 7–10 分钟）。

## 合规

- 不新增定位权限；
- 不引入遥测与自动更新；
- 隐私政策继续披露高德地图 JS API；
- 桌面端 Bundle ID 使用 `com.openchronicle.atlas.desktop`，避免与 iOS 记录冲突。
