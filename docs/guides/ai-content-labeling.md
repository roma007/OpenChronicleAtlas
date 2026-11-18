# AI 生成内容标识与提审口径

- **日期**：2026-11-18
- **依据**：《人工智能生成合成内容标识办法》（国信办通字〔2025〕2 号，2025-09-01 施行）、
  GB 45438-2025《网络安全技术 人工智能生成合成内容标识方法》
- **关联**：
  - [来源与许可](../../data/atlases/ATTRIBUTION.md)
  - [封面登记表](../../data/atlases/ai-content.json)
  - [商店元数据（中文）](../releases/store-metadata.md)
  - [商店元数据（英文）](../releases/store-metadata-en.md)
  - [多商店提交指南](store-submission.md)

> 本文是项目内部的执行口径，不是法律意见。涉及提审表单的最终选择，以提交时商店后台
> 的原文与最新监管要求为准。

## 1. 结论：本项目属于哪一类

| 问题 | 结论 | 说明 |
| --- | --- | --- |
| 是否提供生成式 AI 服务 | **否** | 没有 AI 对话、AI 绘图、AI 摘要等用户可触发的生成功能 |
| 是否属于《标识办法》第二条的“服务提供者” | **不直接属于** | 第二条限定于算法推荐、深度合成、生成式 AI 三类服务；本项目是静态历史地图 |
| 是否包含 AI 生成合成内容 | **是** | 11 张专题封面 + 3 张事件配图由豆包 AI 生成 |
| 是否需要向应用商店声明 | **是** | 《标识办法》第七条要求分发平台核验；提审表单可能分别询问“是否提供生成服务”和“是否包含 AI 生成内容” |
| 是否可以直接写“无 AI” | **不可以** | 应用不含生成功能，但含 AI 生成封面，二者不能混为一谈 |

因此采用的口径是：

> **不提供人工智能生成合成服务，但包含人工智能生成的封面与事件示意插画；已做显式与隐式标识。**

## 2. 标识方式

### 2.1 显式标识

| 位置 | 形式 | 实现 |
| --- | --- | --- |
| 封面与事件配图本身 | 右下角「豆包 AI 生成」水印 | 生成工具水印，**未裁剪、未抹除** |
| Web 专题卡片 | 左下角「AI 生成示意图」角标 | `apps/web/src/components/atlas/AtlasCard.tsx` |
| 移动端专题卡片 | 左下角「AI 生成示意图」角标 | `apps/mobile/src/screens/GalleryScreen.tsx` |
| Web 关于页 | 「人工智能生成内容说明」一节 | `apps/web/src/pages/AboutPage.tsx` |
| 移动端「关于」 | 同上的离线说明与来源入口 | `apps/mobile/src/components/common/AboutModal.tsx` |

### 2.2 隐式标识

封面 JPEG 写入 XMP：

- 命名空间：`http://www.tc260.org.cn/ns/AIGC/1.0/`
- 字段：`TC260:AIGC`
- 值：JSON 字符串，字段如下：

| 字段 | 本项目取值 |
| --- | --- |
| `Label` | `1`（属于人工智能生成合成内容） |
| `ContentProducer` | `豆包（字节跳动）` |
| `ProduceID` | `atlas-cover-<atlasId>` |
| `ReservedCode1` | 空 |
| `ContentPropagator` | `史迹 · 时空地图（OpenChronicle Atlas）` |
| `PropagateID` | `atlas-cover-<atlasId>` |
| `ReservedCode2` | 空 |

写入脚本：`scripts/aigc-labels.ts`

```bash
pnpm apply:aigc   # 写入 / 更新 XMP，按 MD5 重命名封面，并同步 manifest 与 index.json
pnpm check:aigc   # 只校验，validate:data 会自动调用
pnpm validate:data
```

校验内容：

- 每张封面在 `data/atlases/ai-content.json` 的 `covers` 有登记，文件名为 `cover-<md5>.jpg`；
- 每张事件配图在 `figures` 有登记（`atlasId` + `eventId`），文件名为 `fig-<md5>.jpg`，
  且该事件确实引用了它；反向也校验「登记了却没人引用」；
- 尺寸均为 1600×900；
- 含 `TC260:AIGC`，且 `ProduceID` 与登记主体一致（封面 `atlas-cover-<专题>`，
  配图 `atlas-figure-<专题>-<事件>`）；
- 登记表声明 `watermarkRetained: true`。

> 水印是否仍在图上目前靠人工复核：脚本能校验“声明保留”，不能识别图片是否被裁切。
> 每次换图后必须打开封面确认右下角水印仍可见。

## 3. 商店提审话术

### 3.1 中文

**是否提供人工智能生成合成服务？**

> 否。本应用是静态历史地图与时间轴浏览工具，不提供 AI 对话、AI 绘图、AI 摘要等
> 由用户触发的生成功能。

**应用是否包含人工智能生成合成内容？**

> 是。应用内 11 张专题封面与 3 张事件配图为项目负责人使用「豆包 AI」生成的示意插画，不是史实图像。
> 图片右下角均保留「豆包 AI 生成」水印，专题卡片标注「AI 生成示意图」，
> 文件元数据写入 GB 45438-2025 规定的 `TC260:AIGC` 隐式标识。封面用于专题入口，
> 事件配图用于事件详情，均在图片下方注明「豆包 AI 生成（示意图）」与「非史实图像」，
> 不参与史料来源的表达。

**审核备注（可直接粘贴）**

> 本应用不提供生成式 AI 服务。应用内 11 张专题封面与 3 张事件配图为 AI 生成示意插画，
> 已按《人工智能生成合成内容标识办法》与 GB 45438-2025 做显式标识（图片水印 + 界面角标）
> 和隐式标识（XMP `TC260:AIGC`）。说明文档：
> https://github.com/roma007/OpenChronicleAtlas/blob/main/docs/guides/ai-content-labeling.md

### 3.2 English

**Does the app provide AI-generated content services?**

> No. The app is a static historical atlas with maps and timelines. It does not offer
> AI chat, image generation, summarisation, or any other user-triggered generative feature.

**Does the app contain AI-generated content?**

> Yes. The 11 atlas covers are illustrative images generated with Doubao AI. They are not
> historical photographs. The “Doubao AI generated” watermark is retained, each card is
> labelled “AI-generated illustration”, and the files carry a `TC260:AIGC` implicit label
> in their metadata as required by GB 45438-2025. The covers are used only as atlas entry
> artwork and do not represent historical events, routes, or sources.

**Review note**

> This app does not provide generative AI services. Its 11 atlas covers are AI-generated
> illustrative artwork, labelled explicitly (watermark and in-app badge) and implicitly
> (XMP `TC260:AIGC`). Labelling policy:
> https://github.com/roma007/OpenChronicleAtlas/blob/main/docs/guides/ai-content-labeling.md

## 4. 文本内容的 AI 参与说明

专题文本由项目整理，部分段落由 AI 助手起草，之后由人工校订。当前口径：

- 不把 AI 辅助文本描述为“完全人工撰写”；
- 不把 AI 辅助文本描述为“AI 自动生成、未经校对”；
- 统一表述为“项目整理，部分由 AI 辅助起草，经人工校订；仍为示意初稿，待史料页码级校订”。

如果未来把 AI 生成文本直接作为面向用户的独立内容（例如自动生成事件摘要），
应重新评估是否落入《标识办法》第四条、第五条，并按生成合成内容做显式与隐式标识。

## 5. 用户协议条款（草案）

> 状态：草案，尚未作为正式用户协议发布。当前应用无账号、无上传、无用户生成内容，
> 暂不需要独立用户协议；下列条款用于未来启用 AI 功能时并入。

1. **服务性质**：本应用提供历史专题的静态浏览、检索与分享功能，不提供生成式人工智能服务。
2. **AI 内容说明**：应用内专题封面为 AI 生成示意插画，专题文本可能包含 AI 辅助起草内容；
   具体标识见应用内“关于”页与 `ATTRIBUTION`。
3. **标识义务**：用户不得恶意删除、篡改、伪造或隐匿图片水印、界面角标、文件元数据中的
   `TC260:AIGC` 标识，不得为他人实施上述行为提供工具或服务。
4. **分享**：用户分享应用内容时，应保留原始标识；不得以裁剪、压缩、转码等方式去除标识后
   冒充真实历史照片或人工绘制作品。
5. **未来生成功能**：如未来上线 AI 生成或合成功能，服务提供者将按适用法律与标准添加显式、
   隐式标识，并在用户协议中说明标识方法、样式与用户义务；用户申请无显式标识内容的，
   按法律规定另行约定并留存日志。
6. **准确性**：历史内容为示意初稿，不构成权威历史记录；封面为示意插画，不对应具体史实场景。

## 6. 维护流程

新增或替换 AI 封面 / 事件配图时：

1. 确认图片由 AI 生成，保留生成工具水印，不裁掉右下角；
2. 原图缩放到 1600×900 JPEG，放入对应 `data/atlases/<id>/assets/`；
3. 封面在 `data/atlases/ai-content.json` 的 `covers` 登记 `atlasId`、`tool`、`generatedAt`、`watermark`；
   事件配图不需要手工登记——把它写进事件的 `images`，`pnpm apply:aigc` 会自动补 `figures`；
4. 运行 `pnpm apply:aigc`，脚本会写入 XMP 并按 MD5 重命名（封面 `cover-<md5>.jpg`，
   配图 `fig-<md5>.jpg`）；
5. 运行 `pnpm validate:data`、`pnpm build:search-index`、`pnpm build:mobile-data`；
6. 打开 Web 与移动端确认「AI 生成示意图」角标与图片水印都在；
7. 同一次提交更新 `ATTRIBUTION.md`、CHANGELOG 与本说明（如口径有变化）。

新增 AI 文本、AI 图片以外的生成内容（音频、视频、虚拟场景）时，不要直接套用本流程：
先按《标识办法》第四条、第五条评估显式与隐式标识要求。

## 7. 红线

1. 不得裁掉、涂抹、模糊或覆盖「豆包 AI 生成」水印；
2. 不得删除、篡改封面 XMP 中的 `TC260:AIGC`；
3. 不得在商店表单中把“含 AI 生成封面”填成“无 AI 内容”；
4. 不得把 AI 生成封面描述为历史照片、古代画作或人工绘制；
5. 不得在未评估的情况下上线 AI 对话、AI 绘图、AI 摘要等生成功能；
6. 新增 AI 素材不得绕过 `pnpm validate:data` 的 AIGC 校验。
