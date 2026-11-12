/**
 * 线上 Web 站点地址（用于隐私政策等外链）。
 *
 * 说明：
 * - 专题数据已改为内置（见 src/data/client.ts），不再依赖该域名；
 * - 以后绑定正式域名时，设置 EXPO_PUBLIC_SITE_URL 或修改此处即可；
 * - Vercel 地址在中国大陆可能不可达，App 内隐私说明不依赖外部链接。
 */
export const SITE_URL =
  process.env.EXPO_PUBLIC_SITE_URL ??
  'https://open-chronicle-atlas-mengfeng007-7858.vercel.app';

export const PRIVACY_URL = (
  process.env.EXPO_PUBLIC_PRIVACY_URL ?? `${SITE_URL}/privacy`
).replace(/\/+$/, '');

/** App 内隐私政策章节（与 Web `/privacy` 共用 i18n 文案）。 */
export const PRIVACY_SECTIONS = [
  ['privacy.s1.title', 'privacy.s1.body'],
  ['privacy.s2.title', 'privacy.s2.body'],
  ['privacy.s3.title', 'privacy.s3.body'],
  ['privacy.s4.title', 'privacy.s4.body'],
  ['privacy.s5.title', 'privacy.s5.body'],
  ['privacy.s6.title', 'privacy.s6.body'],
] as const;
