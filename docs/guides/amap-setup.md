# 高德地图 Key 与签名配置指南

- **日期**：2026-11-03
- **关联**：[ADR-0004](../decisions/ADR-0004-底图改用高德地图与坐标体系.md)
- **适用**：Web / Android / iOS 三端
- **原则**：Key、安全密钥、签名文件、证书**一律不入库**；本文只记录申请步骤与配置位置。

---

## 1. 应用标识（Key 绑定，先定后申请）

| 项 | 值 | 说明 |
| --- | --- | --- |
| Android `applicationId` | `com.openchronicle.atlas` | 必须与高德 Key 的 PackageName 完全一致 |
| iOS `Bundle Identifier` | `com.openchronicle.atlas` | 必须与高德 iOS Key 的 Bundle ID 完全一致 |
| Android Key 名称 | `atlas-android` | 控制台展示用 |
| Web Key 名称 | `atlas-web` | 控制台展示用 |
| iOS Key 名称 | `atlas-ios` | 控制台展示用 |

> 包名/Bundle ID 一经申请 Key 后不要修改；修改会导致 Key 失效，需要重新申请。

---

## 2. Key 清单

| 平台 | 绑定信息 | 用途 | 状态 | 注入方式 |
| --- | --- | --- | --- | --- |
| Android | PackageName + 发布版 SHA1 + 调试版 SHA1 | 地图 SDK（后续可加定位 SDK） | **已配置（本地）** | `EXPO_PUBLIC_AMAP_ANDROID_KEY` |
| Web 端 (JS API) | 域名白名单 + 安全密钥 | Web 地图 | **已配置（本地）** | `VITE_AMAP_KEY` / `VITE_AMAP_SECURITY_CODE` |
| iOS | Bundle ID | iOS 地图 SDK | **已配置（本地）** | `EXPO_PUBLIC_AMAP_IOS_KEY` |
| Web 服务 | IP / 域名白名单 | 可选：地理编码、REST 检索 | 按需 | 服务端环境变量 |

> 三端 Key 与 Web 安全密钥均已申请，**值只存放于本地 `.env.local`，本文与仓库不记录明文**。上线前建议重置 Web 安全密钥（曾在聊天中传递）。

---

## 3. Android Key 申请表单逐项填写

对照控制台「为「史迹」添加 Key」页面：

| 表单项 | 填写值 / 操作 |
| --- | --- |
| **Key 名称** | `atlas-android` |
| **服务平台** | 选择 **Android 平台** |
| **可使用服务** | 勾选 **Android 地图 SDK**；若 M1 后需要「我的位置」，再勾选 **Android 定位 SDK**（可后续修改） |
| **发布版安全码 SHA1** | `EA:94:B4:C2:A2:44:ED:D6:D9:65:84:6C:3A:D2:80:11:8F:46:F9:96` |
| **调试版安全码 SHA1** | `51:54:06:91:3E:27:9D:30:7F:24:3A:DC:F4:8B:EB:56:89:6B:4A:52`（本机 `~/.android/debug.keystore`） |
| **PackageName** | `com.openchronicle.atlas` |
| 协议 | 勾选同意《高德地图开放平台服务协议》与《隐私权政策》 |

> 调试版 SHA1 只对「当前这台机器的 debug keystore」有效。换机器、CI 构建或删除 `~/.android/debug.keystore` 后 SHA1 会变化，需要把新 SHA1 补登记（可再申请一个调试 Key）。
> 发布版 SHA1 必须来自**长期保存的 release keystore**，丢失后无法更新已上架应用。

---

## 4. 获取 SHA1

### 4.1 调试版（本机默认）

```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android -keypass android | grep "SHA1:"
```

本机结果：

```
SHA1: 51:54:06:91:3E:27:9D:30:7F:24:3A:DC:F4:8B:EB:56:89:6B:4A:52
```

### 4.2 发布版（项目 release keystore）

项目 release keystore 存放于仓库之外（默认 `~/.openchronicle/atlas-release.keystore`），口令存于 `~/.openchronicle/atlas-keystore.properties`（权限 600）。

```bash
keytool -list -v \
  -keystore ~/.openchronicle/atlas-release.keystore \
  -alias atlas | grep "SHA1:"
```

本项目当前 release keystore 的 SHA1（2026-11-03 生成）：

```
SHA1: EA:94:B4:C2:A2:44:ED:D6:D9:65:84:6C:3A:D2:80:11:8F:46:F9:96
SHA256: CF:85:D0:57:1B:28:09:8A:6C:66:86:33:DF:64:28:6C:60:88:4E:3D:31:37:E1:1A:44:15:5E:63:8B:11:F8:24
```

> keystore：`~/.openchronicle/atlas-release.keystore`；口令：`~/.openchronicle/atlas-keystore.properties`（权限 600）。
> 两者均在仓库之外，**必须离线备份**。本文只记录 SHA1 指纹（公开信息），不记录口令。

生成新 keystore（**仅在还没有 release keystore 时执行**；口令自行设置，切勿写入仓库或聊天记录）：

```bash
mkdir -p ~/.openchronicle
keytool -genkeypair -v \
  -keystore ~/.openchronicle/atlas-release.keystore \
  -alias atlas \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=OpenChronicle Atlas, OU=Mobile, O=OpenChronicle, L=Beijing, ST=Beijing, C=CN"
chmod 600 ~/.openchronicle/atlas-release.keystore
```

> 必须把 keystore 与口令备份到密码管理器/离线介质。丢失 = 无法发布应用更新（只能换包名重新上架）。

### 4.3 从 APK 反查（校验用）

```bash
keytool -printcert -jarfile app-release.apk | grep "SHA1:"
```

---

## 5. Web 端 (JS API) Key

### 5.1 为什么选「Web 端 (JS API)」而不是「Web 服务」

| 对比项 | **Web 端 (JS API)** | **Web 服务** |
| --- | --- | --- |
| 运行位置 | 浏览器前端 | 服务端（Node / Java / Nginx 代理等） |
| 典型用途 | 交互地图渲染、Marker / Polyline、前端地图插件 | REST 接口：地理编码、POI 搜索、路径规划、静态地图、坐标转换 |
| 鉴权方式 | Key + **安全密钥 `securityJsCode`** + **域名白名单** | Key + **IP 白名单**（或服务端签名） |
| 能否直接显示交互地图 | ✅ 能 | ❌ 不能，只返回数据/图片 |
| Key 暴露风险 | 必然出现在前端，靠域名白名单 + jscode 限制 | 绝不可出现在前端 |

本项目 Web 端要在浏览器里显示可交互地图、路线和事件 Marker，因此**必须使用 JS API Key**。
「Web 服务」Key 用于后端调用 REST（例如 M3 若做服务端搜索代理、地理编码），两者是**互补关系，不是替代关系**；需要时可以再申请一个 Web 服务 Key，放在服务端环境变量中。

### 5.2 申请步骤

对照控制台「为「史迹」添加 Key」页面：

| 表单项 | 填写值 / 操作 |
| --- | --- |
| **Key 名称** | `atlas-web` |
| **服务平台** | 选择 **Web 端 (JS API)** |
| **可使用服务** | 只勾选 **JavaScript API 地图组件**；室内地图 / 地铁图暂不需要 |
| **域名白名单** | 开发期可留空（无域名限制）；建议至少填 `localhost`、`127.0.0.1`，生产再加正式域名 |
| 协议 | 勾选同意《高德地图开放平台服务协议》与《隐私权政策》 |

域名白名单说明：

- 留空 = 任何域名都能用这个 Key，开发方便但泄露风险高；**仅建议用于开发 Key**。
- 生产环境填正式域名，如 `atlas.example.com`；支持子域名通配符 `*.example.com`。
- 白名单只校验浏览器 `Referer`，不能阻止服务端盗用；生产还需配合 `securityJsCode` 代理。
- 若本地开发填 `localhost` 后仍鉴权失败，可先留空，或改用 `127.0.0.1` 再试。

申请完成后的操作：

1. 在 Key 详情页复制 **Key** 与 **安全密钥 `securityJsCode`**（2021-12-02 后申请的 Key 必须配套使用；安全密钥不在申请表单里，创建后在详情页查看）。
2. 写入 `apps/web/.env.local`（已 gitignore）：

   ```bash
   VITE_AMAP_KEY=你的Web端Key
   VITE_AMAP_SECURITY_CODE=你的安全密钥
   ```

3. 前端加载（开发环境明文方式）：

   ```ts
   // apps/web/src/map/amap.ts
   window._AMapSecurityConfig = { securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE };
   const AMap = await AMapLoader.load({
     key: import.meta.env.VITE_AMAP_KEY,
     version: '2.0',
     plugins: ['AMap.Scale', 'AMap.ToolBar'],
   });
   ```

4. **生产环境**：按官方文档用 Nginx/Node 代理 `/_AMapService/` 转发并注入 `jscode`，避免安全密钥明文暴露。

> Web Key 与 Android Key **不能混用**；用错平台的 Key 会报 `INVALID_USER_KEY` / 鉴权失败。

---

## 6. iOS Key（M4 前完成，当前申请中）

对照控制台「为「史迹」添加 Key」页面：

| 表单项 | 填写值 / 操作 |
| --- | --- |
| **Key 名称** | `atlas-ios` |
| **服务平台** | 选择 **iOS 平台** |
| **可使用服务** | 勾选 **iOS 地图 SDK**；定位 SDK 待启用「我的位置」时再加 |
| **安全码 Bundle ID** | `com.openchronicle.atlas` |
| 协议 | 勾选同意《高德地图开放平台服务协议》与《隐私权政策》 |

要点：

1. iOS Key **不需要 SHA1**，只绑定 **Bundle ID**；必须与 Xcode 工程的 Bundle Identifier 完全一致（区分大小写）。
2. Expo 项目在 `app.config.ts` 中设置 `ios.bundleIdentifier: 'com.openchronicle.atlas'`，`expo prebuild` 后写入原生工程。
3. 该 Bundle ID 需在 **Apple Developer 后台**注册（EAS Build 可自动注册）；免费个人账号也可用，但上架需付费开发者账号。
4. 若后续增加 Share Extension / Widget 等扩展，扩展有独立 Bundle ID（如 `com.openchronicle.atlas.share`），高德主 Key 不覆盖扩展；扩展内若用地图需单独申请。
5. 注入 `EXPO_PUBLIC_AMAP_IOS_KEY`，通过 `expo-gaode-map` 的 Config Plugin 写入原生工程；修改后必须重新 prebuild + 重建，热更新不生效。
6. iOS Key 不能用于 Android 或 Web；三端 Key 各自独立。

---

## 7. 配置注入

### 7.1 Web（`apps/web/.env.local`，已 gitignore）

```bash
VITE_AMAP_KEY=你的Web端Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
VITE_AMAP_STYLE_ID=自定义样式ID（可选）
```

### 7.2 移动端（`apps/mobile/.env.local`，已 gitignore）

```bash
EXPO_PUBLIC_AMAP_ANDROID_KEY=你的AndroidKey
EXPO_PUBLIC_AMAP_IOS_KEY=你的iOSKey
```

`app.config.ts` 中通过 `expo-gaode-map` 插件注入：

```ts
plugins: [
  ['expo-gaode-map', {
    androidKey: process.env.EXPO_PUBLIC_AMAP_ANDROID_KEY,
    iosKey: process.env.EXPO_PUBLIC_AMAP_IOS_KEY,
    enableLocation: false, // M1 不需要定位，开启前先补隐私政策
  }],
]
```

> 原生 Key 修改后必须重新 `expo prebuild` 并重建 App，热更新不会生效。

### 7.3 安全边界

- Android Key 受 SHA1 + 包名保护；iOS Key 受 Bundle ID 保护；Web Key 本身是公开的，安全性依赖域名白名单 + 安全密钥代理。
- 不要把 `securityJsCode`、keystore、证书提交到仓库；`.gitignore` 已覆盖 `.env*`、`*.keystore`、`*.jks`、`*.p12`。

---

## 8. 隐私合规清单（上架前必须完成）

- [ ] 隐私政策中列出：**高德软件有限公司**、**高德地图 SDK / 高德定位 SDK**、收集的个人信息类型（位置信息、设备标识、网络信息等）、使用目的（地图展示、定位）、隐私政策链接 <https://lbs.amap.com/pages/privacy/>。
- [ ] Android 首次启动先展示隐私弹窗，用户同意后再初始化地图 SDK（`MapsInitializer.updatePrivacyShow/updatePrivacyAgree`；使用 Expo 插件时确认其已处理）。
- [ ] iOS 在 `Info.plist` 提供 `NSLocationWhenInUseUsageDescription`（如启用定位）。
- [ ] 不申请与功能无关的权限；定位仅用于「地图定位」，不上传、不持久化。
- [ ] 若上架/商用，评估购买高德技术服务许可（未购买时配额仅限短期少量测试）。

---

## 9. 常见问题

| 现象 | 可能原因 | 排查 |
| --- | --- | --- |
| 地图空白 / 灰屏 | Key 平台不匹配、包名或 SHA1 不一致 | 核对控制台绑定信息；`keytool` 重新取 SHA1；确认安装包签名 |
| `INVALID_USER_SCODE` | Web 端缺少或错误配置安全密钥 | 检查 `window._AMapSecurityConfig.securityJsCode` 是否在加载前设置 |
| `INVALID_USER_KEY` | Key 拼写错误 / 未启用对应服务 | 控制台核对 Key 与「可使用服务」 |
| 路线整体偏移数百米 | 数据是 WGS84，直接画在 GCJ-02 底图上 | 使用 shared 的 `wgs84ToGcj02` 转换后再渲染 |
| 换电脑后地图不显示 | debug keystore 变化导致 SHA1 变化 | 补登记新调试 SHA1，或统一使用项目 debug keystore |
| 配额超限 | 免费额度用尽或商用未授权 | 控制台查看配额；评估技术服务许可 |

---

## 10. 待回填

- [x] Android 发布版 SHA1：`EA:94:B4:C2:A2:44:ED:D6:D9:65:84:6C:3A:D2:80:11:8F:46:F9:96`
- [x] Android Key 值：已写入本地 `apps/mobile/.env.local`（不入库）
- [x] Web Key / 安全密钥：已写入本地 `apps/web/.env.local`（不入库）
- [ ] 自定义地图样式 ID
