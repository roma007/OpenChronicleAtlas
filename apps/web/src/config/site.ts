/**
 * 站点级合规信息 —— 备案号变化时只改这里。
 *
 * ICP 备案号是硬性要求：首页页脚必须展示，并链接到工信部查询页。
 * 公安联网备案号（`SITE_PSB`）拿到后只填 code，见下方注释；留空则页脚不显示。
 * 两个号都不随语言变化——它们是行政登记信息，不做翻译。
 */
export const SITE_ICP = {
  number: '粤ICP备2026058093号-2',
  href: 'https://beian.miit.gov.cn/',
} as const;

/**
 * 公安联网备案号：拿到后**只填 code**（备案号里的数字串，例如 44011302001234），
 * number 与查询链接都由它派生——三处各写一遍必然会写歪一处。
 * 空字符串时页脚不显示。
 */
const PSB_CODE = '44011302006250';

export const SITE_PSB = {
  code: PSB_CODE,
  number: PSB_CODE ? `粤公网安备${PSB_CODE}号` : '',
  href: `https://beian.mps.gov.cn/#/query/webSearch?code=${PSB_CODE}`,
} as const;
