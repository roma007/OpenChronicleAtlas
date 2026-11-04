# 商店截图（准备中）

本目录存放上架用截图与商店素材。

## 当前状态

- **Web 移动端截图**：已生成，分辨率 1290×2796（iPhone 6.7"）与 1080×1920（Android）。
- **移动端真机截图**：待 Android 手机 / iPhone 真机，当前 Android 仅 TV 模拟器、iOS 受 AMap SDK 切片限制。
- **替换规则**：商店提审前用真机截图替换 Web 占位图，画面内容保持一致。

## 文件

| 文件 | 画面 | 尺寸 |
| --- | --- | --- |
| `ios-01-home.jpg` | 首页专题卡片墙 | 1290×2796 |
| `ios-02-atlas.jpg` | 郑和专题地图 + 时间轴 | 1290×2796 |
| `ios-03-detail.jpg` | 事件详情 | 1290×2796 |
| `ios-04-search.jpg` | 搜索/筛选 | 1290×2796 |
| `android-01-home.jpg` | 首页 | 1080×1920 |
| `android-02-atlas.jpg` | 专题地图 | 1080×1920 |
| `android-03-detail.jpg` | 详情 | 1080×1920 |
| `android-04-search.jpg` | 搜索 | 1080×1920 |

## 生成方式

```bash
# Web 移动端（Playwright）
node scripts/capture-store-screenshots.mjs
```

脚本位于仓库根 `scripts/`，需要本地 Web 服务运行在 `http://127.0.0.1:5180`。

依赖：

```bash
pnpm add -Dw playwright
npx playwright install chromium
# 本机若只有 Edge：PLAYWRIGHT_CHANNEL=msedge node scripts/capture-store-screenshots.mjs
```
