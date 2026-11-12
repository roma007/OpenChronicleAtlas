import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relative: string): string {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    throw new Error(`文件不存在：${relative}`);
  }
  return fs.readFileSync(file, 'utf8');
}

function write(relative: string, content: string): void {
  fs.writeFileSync(path.join(root, relative), content);
}

function updateJson(relative: string, mutate: (json: any) => void): void {
  const json = JSON.parse(read(relative));
  mutate(json);
  write(relative, `${JSON.stringify(json, null, 2)}\n`);
}

function replaceOnce(relative: string, pattern: RegExp, replacement: string, label: string): void {
  const text = read(relative);
  if (!pattern.test(text)) {
    throw new Error(`${relative} 未找到 ${label}`);
  }
  write(relative, text.replace(pattern, replacement));
}

const rootPkg = JSON.parse(read('package.json')) as { version?: string };
const current = rootPkg.version;
if (!current) {
  throw new Error('根 package.json 缺少 version');
}

const match = /^1\.0\.(\d+)$/.exec(current);
const next = match ? `1.0.${Number(match[1]) + 1}` : '1.0.0';

const [major, minor, patch] = next.split('.').map(Number) as [number, number, number];
// Android versionCode / iOS build / macOS bundleVersion 共用同一递增号。
const build = String(major * 10000 + minor * 100 + patch);

for (const file of [
  'package.json',
  'apps/web/package.json',
  'apps/mobile/package.json',
  'packages/shared/package.json',
  'apps/desktop/package.json',
]) {
  updateJson(file, (json) => {
    json.version = next;
  });
}

updateJson('apps/mobile/app.json', (json) => {
  json.expo = json.expo ?? {};
  json.expo.version = next;
});

updateJson('apps/desktop/src-tauri/tauri.conf.json', (json) => {
  json.version = next;
  json.bundle = json.bundle ?? {};
  json.bundle.macOS = json.bundle.macOS ?? {};
  json.bundle.macOS.bundleVersion = build;
});

replaceOnce(
  'apps/mobile/app.config.ts',
  /version:\s*'[^']+'/,
  `version: '${next}'`,
  'version',
);
replaceOnce(
  'apps/mobile/app.config.ts',
  /buildNumber:\s*'[^']+'/,
  `buildNumber: '${build}'`,
  'buildNumber',
);
replaceOnce(
  'apps/mobile/app.config.ts',
  /versionCode:\s*\d+/,
  `versionCode: ${build}`,
  'versionCode',
);

replaceOnce(
  'apps/desktop/src-tauri/Cargo.toml',
  /^version = "[^"]+"/m,
  `version = "${next}"`,
  'package version',
);

const cargoLock = path.join(root, 'apps/desktop/src-tauri/Cargo.lock');
if (fs.existsSync(cargoLock)) {
  const text = fs.readFileSync(cargoLock, 'utf8');
  const updated = text.replace(
    /(name = "openchronicle-atlas-desktop"\nversion = ")[^"]+(")/,
    `$1${next}$2`,
  );
  if (updated === text) {
    console.warn('⚠️  Cargo.lock 未找到 desktop 包版本，跳过');
  } else {
    fs.writeFileSync(cargoLock, updated);
  }
}

const gradle = path.join(root, 'apps/mobile/android/app/build.gradle');
if (fs.existsSync(gradle)) {
  let text = fs.readFileSync(gradle, 'utf8');
  text = text.replace(/versionCode\s+\d+/, `versionCode ${build}`);
  text = text.replace(/versionName\s+"[^"]+"/, `versionName "${next}"`);
  fs.writeFileSync(gradle, text);
}

const plist = path.join(root, 'apps/mobile/ios/app/Info.plist');
if (fs.existsSync(plist)) {
  let text = fs.readFileSync(plist, 'utf8');
  text = text.replace(
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/,
    `$1${next}$2`,
  );
  text = text.replace(
    /(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/,
    `$1${build}$2`,
  );
  fs.writeFileSync(plist, text);
}

console.log(`✅ 版本 ${current} → ${next}（build ${build}）`);
