/**
 * 移动端数据构建脚本。
 *
 * 2026-11-25 起，移动端已切至「仅远端模式」（读取 atlas.openapp.asia/data/atlases），
 * 不再打包内置数据。此脚本保留作为管道占位，不再生成任何文件。
 *
 * 数据仍需同步通过 pnpm validate:data 与 pnpm build:search-index 校验，
 * 由 pnpm release 发布到远端后移动端自动获取最新版本。
 */

if (process.argv.includes('--check')) {
  console.log('✅ 移动端已切远端模式，无需校验内置数据映射');
} else {
  console.log('ℹ️  移动端已切远端模式，不再生成内置数据映射');
}
