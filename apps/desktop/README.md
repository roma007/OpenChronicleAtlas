# 史迹 · 时空地图 桌面端

macOS / Windows 桌面端，使用 [Tauri 2](https://v2.tauri.app/) 复用 `apps/web` 的构建产物。

## 开发

```bash
pnpm install
pnpm --filter @atlas/desktop dev
```

`dev` 会启动 Vite（`apps/web`）并打开 Tauri 窗口。

## 构建

```bash
# 当前平台
pnpm --filter @atlas/desktop bundle

# 仅 macOS（需在 macOS 上执行）
pnpm --filter @atlas/desktop bundle:mac

# 仅 Windows（需在 Windows 上执行）
pnpm --filter @atlas/desktop bundle:win
```

产物位于 `src-tauri/target/release/bundle/`：

- macOS：`macos/史迹.app`、`dmg/史迹_*.dmg`
- Windows：`msi/史迹_*.msi`、`nsis/史迹_*_x64-setup.exe`

## 图标

```bash
pnpm --filter @atlas/desktop icon
```

图标源为 `apps/mobile/assets/icon.png`（1024×1024）。

## 商店

- Apple / 华为 / 微软的提交步骤见 [`docs/guides/store-submission.md`](../../docs/guides/store-submission.md)；
- macOS 已启用 App Sandbox 与出网权限，供 Mac App Store 使用；
- Windows 商店暂无 Partner Center 账号，先产出 MSI/NSIS。

## 注意

- 桌面端优先读取 `VITE_AMAP_DESKTOP_KEY` / `VITE_AMAP_DESKTOP_SECURITY_CODE`，未配置时回退 `VITE_AMAP_KEY`；
- 上线前需在高德控制台确认桌面 Key 的来源限制与商用许可；
- 桌面构建会关闭 PWA、改用 HashRouter；
- 不包含自动更新与遥测。
