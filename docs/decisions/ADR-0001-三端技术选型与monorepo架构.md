# ADR-0001：三端技术选型与 monorepo 架构

- **状态**：已接受（待用户最终确认）
- **日期**：2026-11-03
- **决策者**：项目负责人 + AI 开发助手
- **关联**：`docs/plans/2026-11-03-M1-初始化脚手架-design.md`

## 背景（Context）

项目要求同时交付 Web、Android、iOS 三端，共享同一套数据 schema 与业务逻辑（数据加载、时间轴计算、事件筛选）。
若三端各自实现，时间轴与路线动画的行为容易出现偏差，维护成本三倍。需求文档建议 Web 用 React 技术栈，
移动端在 React Native (Expo) 与 Flutter 之间二选一，且必须在 M1 前确定。

## 选项（Options）

### 移动端

| 选项 | 优点 | 缺点 |
| --- | --- | --- |
| **React Native + Expo + maplibre-react-native** | 与 Web 同为 TS/React，`packages/shared` 可直接复用；Expo EAS Build 统一产出 APK/IPA；团队心智负担低 | MapLibre RN 为原生模块，不能用 Expo Go，需 dev build / prebuild；原生层问题需 Xcode/Gradle 经验 |
| Flutter + maplibre | 渲染性能好、UI 一致性强 | 需用 Dart 重写 shared 逻辑，或维护跨语言 FFI；三端逻辑难以真正共享；团队需双语言栈 |

### 仓库组织

| 选项 | 优点 | 缺点 |
| --- | --- | --- |
| **pnpm workspaces monorepo** | shared 源码直接引用、类型实时联动；一次提交同时更新三端；双仓推送简单 | 仓库体积增长；CI 需按包过滤 |
| 多仓库 + npm 私有包 | 仓库独立、权限清晰 | 版本发布繁琐，早期迭代成本高；容易出现三端版本漂移 |

## 决策（Decision）

1. 采用 **pnpm workspaces monorepo**，目录：`apps/web`、`apps/mobile`、`packages/shared`、`data/atlases`、`docs`。
2. Web：**React 18 + TypeScript(strict) + Vite + MapLibre GL JS + Tailwind CSS + Zustand**。
3. 移动端：**React Native + Expo（dev build / prebuild）+ `@maplibre/maplibre-react-native`**，一套代码打包 Android 与 iOS。
4. 共享层：`packages/shared` 为**框架无关纯 TS 包**，只依赖标准 Web API 子集（`fetch` 由调用方注入），不引入 React / RN / DOM 类型。
5. 构建编排：M1 仅用 pnpm workspace scripts；M2 若构建耗时明显再评估 Turborepo。
6. 包命名统一 `@atlas/shared`、`@atlas/web`、`@atlas/mobile`，内部通过 `workspace:*` 引用。

## 后果（Consequences）

### 正面
- 时间轴、数据加载、筛选逻辑只实现一次，三端行为天然一致。
- TypeScript 类型与 zod schema 在编译期即可发现三端契约不一致。
- 双仓同步只需推送一个仓库。

### 负面 / 代价
- Expo 需要 dev build 才能加载 MapLibre 原生模块，M4 的打包链路比纯 JS 项目复杂（EAS Build / 本地 Xcode）。
- monorepo 的依赖提升可能导致 RN 的 Metro 解析问题，需要在 `metro.config.js` 配置 workspace 解析。
- Web 与 RN 的 MapLibre API 不同，地图适配层必须分开实现（shared 只负责数据与时间计算）。

### 后续行动
- M1 建立 monorepo 与 mobile 空壳，验证 `expo prebuild` 可执行。
- M4 前完成 EAS / 本地签名链路验证，并在 `docs/` 提供签名配置说明（密钥不入库）。
- 若 M4 发现 MapLibre RN 无法满足动画需求，另立 ADR 评估降级方案（静态路线 + 时间过滤）。
