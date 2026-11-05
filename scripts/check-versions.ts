import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];

function read(relative: string): string | null {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    warnings.push(`跳过不存在的文件：${relative}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

function expect(label: string, actual: string | null, expected: string) {
  if (actual === null) return;
  if (actual !== expected) {
    errors.push(`${label}: 期望 ${expected}，实际 ${actual}`);
  }
}

const rootPkg = JSON.parse(read('package.json') ?? '{}') as { version?: string };
const expectedVersion = rootPkg.version;
if (!expectedVersion) {
  console.error('无法读取根 package.json 的 version');
  process.exit(1);
}

for (const file of ['apps/web/package.json', 'apps/mobile/package.json', 'packages/shared/package.json']) {
  const text = read(file);
  if (text) {
    const version = (JSON.parse(text) as { version?: string }).version ?? null;
    expect(`${file} version`, version, expectedVersion);
  }
}

const appJson = read('apps/mobile/app.json');
if (appJson) {
  const version = (JSON.parse(appJson) as { expo?: { version?: string } }).expo?.version ?? null;
  expect('apps/mobile/app.json expo.version', version, expectedVersion);
}

const appConfig = read('apps/mobile/app.config.ts');
let expectedBuild: string | null = null;
if (appConfig) {
  const version = /version:\s*'([^']+)'/.exec(appConfig)?.[1] ?? null;
  expectedBuild = /versionCode:\s*(\d+)/.exec(appConfig)?.[1] ?? null;
  const buildNumber = /buildNumber:\s*'([^']+)'/.exec(appConfig)?.[1] ?? null;
  expect('apps/mobile/app.config.ts version', version, expectedVersion);
  if (expectedBuild) expect('apps/mobile/app.config.ts buildNumber', buildNumber, expectedBuild);
  if (!expectedBuild) warnings.push('apps/mobile/app.config.ts 未找到 versionCode');
}

const gradle = read('apps/mobile/android/app/build.gradle');
if (gradle) {
  const versionName = /versionName\s+"([^"]+)"/.exec(gradle)?.[1] ?? null;
  const versionCode = /versionCode\s+(\d+)/.exec(gradle)?.[1] ?? null;
  expect('android versionName', versionName, expectedVersion);
  if (expectedBuild) expect('android versionCode', versionCode, expectedBuild);
}

const plist = read('apps/mobile/ios/app/Info.plist');
if (plist) {
  const version = /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/.exec(plist)?.[1] ?? null;
  const build = /<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/.exec(plist)?.[1] ?? null;
  expect('ios CFBundleShortVersionString', version, expectedVersion);
  if (expectedBuild) expect('ios CFBundleVersion', build, expectedBuild);
}

for (const warning of warnings) console.warn(`⚠️  ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`❌ ${error}`);
  process.exit(1);
}
console.log(`✅ 版本一致：${expectedVersion}${expectedBuild ? ` / build ${expectedBuild}` : ''}`);
