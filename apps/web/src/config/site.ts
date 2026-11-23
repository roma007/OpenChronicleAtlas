/**
 * 站点级合规信息 —— 备案号变化时只改这里。
 *
 * ICP 备案号是硬性要求：首页页脚必须展示，并链接到工信部查询页。
 * 公安联网备案号（`SITE_PSB.number`）拿到后再填；留空则页脚不显示。
 * 两个号都不随语言变化——它们是行政登记信息，不做翻译。
 */
export const SITE_ICP = {
  number: '粤ICP备2026058093号-2',
  href: 'https://beian.miit.gov.cn/',
} as const;

export const SITE_PSB = {
  number: '',
  href: 'https://beian.mps.gov.cn/#/query/webSearch',
} as const;
