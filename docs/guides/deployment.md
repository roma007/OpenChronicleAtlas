# 部署指南（Vercel / Cloudflare Pages）

- **日期**：2026-11-04
- **关联**：[ADR-0008](../decisions/ADR-0008-静态部署与资源托管方案.md)
- **目标**：把 Web 与 `/data/atlases` 部署为同一域名下的静态站点，供 Web 与移动端共用。

---

## 1. 构建产物

```bash
pnpm install --frozen-lockfile
pnpm --filter @atlas/web build
```

产物：

```
apps/web/dist/
├── index.html
├── assets/
└── data/atlases/        # Vite 插件从仓库根 data/ 拷贝
    ├── index.json
    ├── long-march/
    └── zheng-he/
```

---

## 2. Vercel

1. 导入仓库 `roma007/OpenChronicleAtlas`。
2. Framework Preset：Vite（`vercel.json` 已声明）。
3. Build Command：`pnpm --filter @atlas/web build`。
4. Output Directory：`apps/web/dist`。
5. 环境变量：

```
VITE_AMAP_KEY=...
VITE_AMAP_SECURITY_CODE=...
VITE_AMAP_STYLE_ID=（可选）
```

6. 当前生产部署（已认领）：

```
https://open-chronicle-atlas-mengfeng007-7858.vercel.app
```

> 中国大陆网络可能对 `*.vercel.app` 存在 DNS 污染或不可达；建议在 Vercel 绑定自定义域名后使用自有域名访问。

7. 无账号时可先创建临时预览（60 分钟，需 claim）：

```bash
npx vercel deploy --temporary --yes \
  --build-env VITE_AMAP_KEY=... \
  --build-env VITE_AMAP_SECURITY_CODE=...
```

8. 部署后访问：
   - `https://<domain>/`
   - `https://<domain>/search`
   - `https://<domain>/privacy`
   - `https://<domain>/data/atlases/index.json`

> 国内访问 Vercel 可能较慢，可绑定自定义域名或使用 Cloudflare Pages。

---

## 3. Cloudflare Pages（备选）

1. 连接仓库，构建命令：`pnpm --filter @atlas/web build`。
2. 输出目录：`apps/web/dist`。
3. 环境变量同上。
4. `wrangler.toml` 已提供 `pages_build_output_dir`，也可用：

```bash
pnpm --filter @atlas/web build
npx wrangler pages deploy apps/web/dist --project-name openchronicle-atlas
```

---

## 4. 移动端配置

移动端默认**离线内置** `data/atlases`（构建时由 `pnpm build:mobile-data` 生成静态映射），
无需配置数据域名；地图瓦片仍由高德 SDK 联网加载。

如需切换到远端数据（以后建好服务器）：

```bash
# apps/mobile/.env.local（可选）
EXPO_PUBLIC_DATA_BASE_URL=https://<domain>/data/atlases
EXPO_PUBLIC_PRIVACY_URL=https://<domain>/privacy
```

- 配置 `EXPO_PUBLIC_DATA_BASE_URL` 后为「远端优先 + 内置回退」；不配置则完全使用内置数据。
- 修改数据或环境变量后需要重新执行 `pnpm build:mobile-data`（`prebuild` 已自动执行）并重新构建。
- 生产必须 HTTPS；Android 的 `usesCleartextTraffic` 仅用于开发。
- iOS 真机/IPA 仍需 Apple Developer 账号。

---

## 5. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 打开旧 `*.tmp.now` 显示「应用配置错误」 | 旧别名指向匿名空部署 | 使用新的 production URL |
| 页面要求 Vercel 登录 | Deployment Protection / SSO | `vercel project protection disable --sso` |
| 中国大陆无法解析 `*.vercel.app` | DNS 污染/网络限制 | 绑定自定义域名，或使用 Cloudflare Pages / VPN |
| 构建报 100MB 文件限制 | 上传了 APK/原生目录 | 保留 `.vercelignore`（已排除 apps/mobile、docs、dist、APK） |

## 6. 校验清单

- [ ] `/data/atlases/index.json` 返回 200，包含两个专题。
- [ ] 首页显示两张卡片。
- [ ] `/search` 可跨专题搜索。
- [ ] `/privacy` 可访问。
- [ ] 高德 Key 未出现在仓库；仅平台环境变量。
- [ ] 移动端能读取部署域名数据。
- [ ] `Cache-Control` 对 `/data/*` 生效。
