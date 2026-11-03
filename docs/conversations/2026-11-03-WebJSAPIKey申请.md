# 对话档案：Web 端 (JS API) Key 申请

- **日期**：2026-11-03
- **时间**：21:00（CST）
- **参与者**：用户（项目负责人）、AI 开发助手（DeepSeek V4.1 Flash / OpenCode）
- **关联里程碑**：M1（Web 地图）
- **关联文档**：
  - `docs/guides/amap-setup.md` §5
  - `docs/decisions/ADR-0004-底图改用高德地图与坐标体系.md`
  - `docs/conversations/2026-11-03-WebKey类型选择说明.md`

## 1. 原始需求

用户贴出高德控制台 **Web 端 (JS API)** 的 Key 申请页，表单包含：

> Key 名称 / 服务平台（Android、iOS、Web端 JS API、Web服务…）
> 可使用服务（JavaScript API 地图组件、室内地图 JS API、地铁图 JS API）
> 域名白名单（非必填，留空表示无域名限制，支持 `*.domain.com` 通配符）
> 服务协议与隐私政策。

用户需要：**这份 Web Key 表单怎么填**，以及申请后的配置步骤。

## 2. 需求拆解

| 编号 | 需求点 | 类型 | 优先级 |
| --- | --- | --- | --- |
| R1 | 给出 Web JS API Key 表单逐项填写值 | 配置 | P0 |
| R2 | 域名白名单的开发/生产策略 | 安全 | P0 |
| R3 | 说明安全密钥 `securityJsCode` 的获取与配置 | 工程 | P0 |
| R4 | 记录到留档体系并双仓同步 | 文档 | P0 |

## 3. 讨论与决策

| 编号 | 议题 | 结论 | 依据 |
| --- | --- | --- | --- |
| D1 | Key 名称 | `atlas-web` | 与 `atlas-android` / `atlas-ios` 命名一致 |
| D2 | 服务平台 | **Web 端 (JS API)** | 浏览器内交互地图 |
| D3 | 可使用服务 | 只勾 **JavaScript API 地图组件**；室内地图/地铁图不需要 | 当前功能范围 |
| D4 | 域名白名单（开发） | 先填 `localhost` 与 `127.0.0.1`；若表单不接受，再留空 | 兼顾本地开发与最低限度限制 |
| D5 | 域名白名单（生产） | 上线前改为正式域名（支持 `*.example.com`），并配合 `securityJsCode` 代理 | 防盗用 |
| D6 | 安全密钥 | 创建后到 Key 详情页复制 `securityJsCode`；不在申请表单里 | 高德 2021-12-02 后规则 |
| D7 | 注入方式 | `VITE_AMAP_KEY` / `VITE_AMAP_SECURITY_CODE` → `apps/web/.env.local` | 指南 §7.1 |
| D8 | 是否申请 Web 服务 Key | 暂不；M3 若做服务端检索/地理编码再申请 | 见 Web Key 类型对话 |

## 4. 疑问与答复

| 编号 | 疑问 | 答复 | 状态 |
| --- | --- | --- | --- |
| Q1 | 域名白名单留空会怎样？ | 任何域名都能使用该 Key，开发方便但泄露风险高；只建议开发 Key 留空 | 已确认 |
| Q2 | `localhost` 能填进白名单吗？ | 多数情况下可以；若被拒或鉴权失败，改用 `127.0.0.1` 或开发期留空 | 待实测 |
| Q3 | 安全密钥在哪里拿？ | Key 创建成功后，在控制台 Key 详情/设置页查看「安全密钥」 | 已确认 |
| Q4 | 能否用 Web 服务 Key 代替？ | 不能，Web 服务 Key 不提供浏览器地图渲染能力，且必须放服务端 | 已确认 |
| Q5 | 自定义地图样式要单独申请吗？ | 不需要，JS API 内通过 `mapStyle: 'amap://styles/<styleId>'` 引用 | 已确认 |

## 5. 本轮产出

- 更新 `docs/guides/amap-setup.md` §5.2：Web 表单逐项填写、域名白名单策略、安全密钥与注入步骤
- 新增本对话档案
- 更新 `docs/README.md` 索引与 `docs/changelog/CHANGELOG.md`

### 提交与同步

| 提交 | 内容 | GitHub | Gitee |
| --- | --- | --- | --- |
| `0449ffa` | docs: 补充 Web JS API Key 申请说明 | ✅ | ✅ |

**同步核对**：本地 HEAD、GitHub `main`、Gitee `main` 均为 `0449ffa584979e4ae335756c7ce2bea735c6a34c`。

## 6. 待办（TODO）

- [ ] 用户提交 Web JS API Key（`atlas-web`，勾选 JavaScript API 地图组件）。
- [ ] 复制 Key 与安全密钥，写入 `apps/web/.env.local`（不入库）。
- [ ] 实测 `localhost` / `127.0.0.1` 白名单是否可用；不可用则开发期留空。
- [ ] 生产域名确定后更新白名单，并配置 `/_AMapService/` 代理。
- [ ] Key 就绪后联调 M1 Web 地图。

## 7. 下一轮入口

- 下一步建议：三端 Key 已覆盖申请流程，开始 monorepo 脚手架 + shared（schema/loader/坐标/时间）+ 长征数据包；地图联调等 Web Key 到位。
- 需要用户确认：是否现在开始编码（M1 T1–T14）。
