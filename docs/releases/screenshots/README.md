# 商店截图（准备中）

本目录存放上架用截图与商店素材。

## 当前状态

App Store Connect 现在要求的 iPhone 尺寸是 **iPhone（中等显示屏，Dynamic Island）**，不是 6.9" 大屏。

| 用途 | 文件 | 尺寸 | 数量 |
| --- | --- | --- | --- |
| iPhone（中等显示屏）**必填** | `iphone-medium-01-home.jpg` ～ `-04-search.jpg` | 1206×2622 | 4 |
| iPad 13 英寸 **必填**（App 支持 iPad） | `ipad-13-01-home.jpg` ～ `-04-search.jpg` | 2064×2752 | 4 |
| iPhone 6.9" 大屏（可选） | `iphone-69-*.jpg` | 1320×2868 | 4 |
| iPhone Duo（2027-04 起才强制） | 未生成 | 外屏 1398×2034 / 内屏 2007×2853 | — |
| Apple Watch | 不适用（App 不支持 watchOS） | — | — |

以上截图均为 **Web 版按 App 界面渲染** 的占位图，用于先完成提审；有真机后建议替换。

## 上传顺序

**iPhone（中等显示屏）**

| 顺序 | 画面 | 文件 |
| --- | --- | --- |
| 1 | 首页专题卡片墙 | `appstore-upload/iphone-medium/01-home.jpg` |
| 2 | 专题地图 + 时间轴 | `appstore-upload/iphone-medium/02-atlas.jpg` |
| 3 | 事件详情 + 史料来源 | `appstore-upload/iphone-medium/03-detail.jpg` |
| 4 | 搜索 / 筛选 | `appstore-upload/iphone-medium/04-search.jpg` |

**iPad 13 英寸**

| 顺序 | 画面 | 文件 |
| --- | --- | --- |
| 1 | 首页专题卡片墙 | `appstore-upload/ipad-13/01-home.jpg` |
| 2 | 专题地图 + 时间轴 | `appstore-upload/ipad-13/02-atlas.jpg` |
| 3 | 事件详情 + 史料来源 | `appstore-upload/ipad-13/03-detail.jpg` |
| 4 | 搜索 / 筛选 | `appstore-upload/ipad-13/04-search.jpg` |

## 生成方式

```bash
# 1. 启动 Web
cd apps/web && pnpm dev --host 127.0.0.1 --port 5180

# 2. Playwright + 本机 Edge
#    iPhone 6.9": 440×956@3x → 1320×2868
#    iPhone 中屏: 由 6.9" 等比例缩放到 1206×2622
#    iPad 13": 1032×1376@2x → 2064×2752
node scripts/capture-store-screenshots.mjs
```

> 页面内不含浏览器地址栏、调试浮层或个人信息；地图截图需等待高德瓦片加载约 15 秒。

## 提审规则

- 截图不得包含个人信息、测试账号、调试浮层、`localhost`、浏览器地址栏或「Beta」字样。
- 同一组截图语言一致；英文商店配英文截图。
- 首两张放核心体验（首页 + 时间轴地图）。
- 截图内容需与 App 实际功能一致，不宣传当前版本没有的功能。
