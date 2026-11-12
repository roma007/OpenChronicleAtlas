# Agent 铁律

本文件是自动化开发与发布流程的最高约束。任何提交都必须遵守。

## 1. 版本铁律（每次提交必须执行）

1. **每次提交前必须升级版本**，版本号格式固定为 `1.0.X`。
2. 首次迁移：`0.95.0` → `1.0.0`；之后每次提交 `X + 1`：`1.0.1`、`1.0.2`……
3. 禁止只改部分文件。所有版本与构建号必须同步：
   - 根 `package.json`
   - `apps/web/package.json`
   - `apps/mobile/package.json`
   - `packages/shared/package.json`
   - `apps/desktop/package.json`
   - `apps/desktop/src-tauri/Cargo.toml`
   - `apps/desktop/src-tauri/Cargo.lock`
   - `apps/desktop/src-tauri/tauri.conf.json`（`version` 与 `bundle.macOS.bundleVersion`）
   - `apps/mobile/app.json`
   - `apps/mobile/app.config.ts`（`version`、`buildNumber`、`versionCode`）
   - 生成的 `apps/mobile/android/app/build.gradle`
   - 生成的 `apps/mobile/ios/app/Info.plist`
4. 构建号统一由版本推导：`major * 10000 + minor * 100 + patch`。
   - `1.0.0` → `10000`
   - `1.0.1` → `10001`
5. 执行方式：

   ```bash
   pnpm version:bump
   pnpm check:versions
   ```

   `check:versions` 必须输出 `✅ 版本一致`，否则禁止提交。

6. 每个提交必须在 `docs/changelog/CHANGELOG.md` 记录本次版本与变更。
7. Git tag 使用 `v1.0.X`，例如 `v1.0.0`、`v1.0.1`。

## 2. 提交铁律

- 提交信息使用 Conventional Commits：`feat:`、`fix:`、`docs:`、`chore:`、`ci:`。
- 提交必须同时包含版本升级与变更内容，不允许先提交代码再补版本。
- 禁止提交任何密钥、证书、`.env.local`、keystore、provisioning profile。
- 推送同时覆盖 GitHub 与 Gitee；推送后校验两端 `main` 指向同一 commit。

## 3. 发布铁律

- 版本必须是 `1.0.X`，且移动端 `versionCode` / `buildNumber` 必须递增。
- 上架前必须通过：`pnpm typecheck`、`pnpm lint`、`pnpm check:versions`、`pnpm validate:data`。
- GitHub Actions 必须产出对应版本的安装包；tag 推送必须生成 GitHub Release。
- 不跳过任何平台的构建；无法签名的平台必须在发布说明中标注原因。

## 4. 文档铁律

- 每轮对话：`docs/conversations/`
- 计划与方案：`docs/plans/`
- 架构决策：`docs/decisions/`
- 变更记录：`docs/changelog/CHANGELOG.md`
- 发布说明：`docs/releases/`
- 文档与代码同一次提交，不允许事后补文档。
