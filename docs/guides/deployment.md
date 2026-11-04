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

6. 无账号时可先创建临时预览（60 分钟，需 claim）：

```bash
npx vercel deploy --temporary --yes \
  --build-env VITE_AMAP_KEY=... \
  --build-env VITE_AMAP_SECURITY_CODE=...
```

7. 部署后访问：
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

```bash
# apps/mobile/.env.local
EXPO_PUBLIC_DATA_BASE_URL=https://<domain>/data/atlases
EXPO_PUBLIC_PRIVACY_URL=https://<domain>/privacy
```

- 生产必须 HTTPS；Android 的 `usesCleartextTraffic` 仅用于开发。
- 修改环境变量后需要重新 prebuild/构建。
- iOS 真机/IPA 仍需 Apple Developer 账号。

---

## 5. 校验清单

- [ ] `/data/atlases/index.json` 返回 200，包含两个专题。
- [ ] 首页显示两张卡片。
- [ ] `/search` 可跨专题搜索。
- [ ] `/privacy` 可访问。
- [ ] 高德 Key 未出现在仓库；仅平台环境变量。
- [ ] 移动端能读取部署域名数据。
- [ ] `Cache-Control` 对 `/data/*` 生效。
