# OpenChronicle Atlas · Logo

**定稿：青铜 · 朱砂（v1）**，中心符号采用「粗路线 + 大定位针」的极简剪影。

## 设计隐喻

- **C 形环**：`Chronicle`（编年）的首字母，也像一卷展开的史册；右侧开口表示「历史叙事向当下开放」。
- **中心符号**：一条粗路线 + 一枚大定位针，针尖直接扎在路线上。
  - 路线 = 地图上的迁徙 / 行军 / 贸易路线；
  - 定位针 = 当前正在阅读的时空坐标；
  - 两者合并为一个连续剪影，只有一个针孔细节，缩小后仍然清晰。
- 整体沿用 OpenReel 的构图语法（深色方底 + 开口 C 环 + 内嵌圆形徽章），只替换中心符号与配色，形成同家族、不同主题的视觉关系。

## 配色

| 方案 | 背景 | 环（浅→深） | 中心符号 | 气质 |
| --- | --- | --- | --- | --- |
| v1 青铜 · 朱砂（定稿） | `#17120E` | `#FDEFD0 → #F0CB8B → #D59A52 → #9E612C` | `#FBE1A8 → #EFB268 → #C34B29` | 史书、青铜器、沉稳 |
| v2 青瓷 · 朱砂 | `#0C1511` | `#E9F9F0 → #ACDCC7 → #519C85 → #226453` | 同上 | 博物馆、清雅 |
| v3 靛蓝 · 鎏金 | `#0C1320` | `#D6E4FF → #93B7F8 → #507FE1 → #274B9D` | 同上 | 延续 OpenReel 家族感 |

## 几何规范（1024 × 1024）

- **画布：全出血直角方图，四角不做圆角**；圆角由 iOS / Android / PWA 等系统在展示时自行裁切，避免二次圆角造成边缘缺白。
- 环：外半径 `330`，内半径 `178`，开口半角 `27°`
- 中心符号安全区：内圆半径 `178`
- 路线：二次贝塞尔 `M 398 590 Q 512 624 618 540`，`stroke-width 46`，圆头端点
- 定位针：宽 `124`、高 `204`，针孔半径 `24`
- 无事件节点、无描边、无阴影；保证 16px 下仍能识别 C 环与定位针

## 文件

| 文件 | 用途 |
| --- | --- |
| `logo-openchronicle-atlas.svg` / `.png` | 定稿矢量源文件 / 1024px 全出血方图 |
| `logo-openchronicle-atlas-v2.svg` / `.png` | 青瓷配色备选 |
| `logo-openchronicle-atlas-v3.svg` / `.png` | 靛蓝配色备选 |
| `index.html` | 三方案对比预览页 |

## 落地注意

- 所有应用图标统一使用**直角全出血方图**：Web `192/512/1024`、Tauri、iOS `1024`、Android legacy / adaptive。
- Android adaptive 前景使用透明底 `adaptive-icon.svg`，背景色 `#17120E`；Android round 图标单独使用 `icon-round.svg`。
- 启动页与商店横幅沿用同一配色：`apps/mobile/assets/splash.svg/png`（1284 × 2778）与 `feature-graphic.svg/png`（1024 × 500），Expo splash、Android `splashscreen_background`、PWA manifest 背景均为 `#17120E`。
- **macOS / Windows 桌面系统不会自动裁切圆角**：当前按项目要求统一使用直角方图；如需更贴近 Dock / 开始菜单的原生观感，可另行导出 macOS squircle 版本。
- 16px 下路线会自然简化，C 环与定位针仍可辨识，属预期。
