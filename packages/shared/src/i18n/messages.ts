import type { Locale } from './locale';

const zh = {
  'app.title': '史迹 · 时空地图',
  'app.tagline':
    '以地图与时间轴浏览历史专题的路线、事件与时空演变。专题以数据包接入，平台不绑定单一历史叙事。',
  'app.footer': '史迹 · 时空地图 — M7 示例数据',
  'app.footerData': '数据为示意初稿，待史料校订',
  'privacy.link': '隐私政策',
  'offline.banner': '当前离线，已缓存内容仍可浏览。',

  'nav.backToAtlases': '← 专题',
  'nav.search': '搜索',
  'nav.filters': '筛选',
  'nav.closeFilters': '关闭筛选',
  'nav.retry': '重试',
  'nav.reset': '重置',

  'common.loading': '加载中…',
  'common.start': '开始',
  'common.end': '结束',
  'common.all': '全部',
  'common.share': '分享',
  'common.shared': '已分享',
  'common.viewDetails': '查看详情',
  'common.time': '时间',
  'common.place': '地点',
  'common.entity': '主体',
  'common.category': '类型',
  'common.sources': '史料来源',
  'common.relatedEvents': '关联事件',
  'common.segment': '{count} 段',
  'common.segments': '{count} 段',
  'common.events': '{count} 个事件',

  'gallery.subtitle': '历史专题',
  'gallery.count': '{count} 个专题',
  'gallery.searchEvents': '搜索事件 →',
  'gallery.dataContract': '数据契约 v1.0.0',
  'gallery.mapService': '地图服务 · 高德',
  'gallery.empty': '还没有专题数据包。请按 docs/schema/atlas-schema-v1.0.0.md 添加。',
  'gallery.errorTitle': '专题索引加载失败',

  'search.title': '检索',
  'search.subtitle': '按事件名、地名、类型或日期查找，点击结果直接跳到对应时间点。',
  'search.placeholder': '例如：遵义、zunyi、1935',
  'search.allAtlases': '全部专题',
  'search.result': '找到 {count} 条结果',
  'search.results': '找到 {count} 条结果',
  'search.promptTitle': '输入关键词开始检索',
  'search.promptBody': '支持事件名、地名、类型与日期，例如「遵义」「贵州」「1935」「重要会议」。',
  'search.emptyTitle': '没有找到匹配事件',
  'search.emptyBody': '试试更短的关键词，或切换到「全部专题」。',
  'search.clear': '清空搜索',
  'search.note': '检索支持中文、拼音、首字母与英文子串匹配；暂不支持分词与纠错。',
  'search.errorTitle': '搜索数据加载失败',
  'search.atlasFilter': '按专题筛选',

  'atlas.loading': '正在加载专题数据…',
  'atlas.errorTitle': '专题加载失败',
  'atlas.backToGallery': '返回专题列表',
  'atlas.mapAttribution': '高德地图 · 坐标 WGS84 → GCJ-02',
  'atlas.draft': '数据初稿 · 待史料校订',
  'atlas.filters': '筛选',

  'legend.layers': '路线图层',
  'legend.filters': '筛选',
  'legend.hint': '与时间轴叠加：只显示已发生且符合条件的事件。',
  'legend.reset': '重置',

  'timeline.label': '专题时间轴',
  'timeline.play': '播放',
  'timeline.pause': '暂停',
  'timeline.hint': '拖动时间轴或播放',
  'timeline.zoomIn': '放大时间轴',
  'timeline.zoomOut': '缩小时间轴',
  'timeline.zoomAll': '全',
  'timeline.jumpToDate': '跳转到日期',

  'detail.title': '事件详情',
  'detail.close': '关闭详情',
  'detail.rendering': '正在渲染详情…',

  'map.title': '历史专题地图',
  'map.errorTitle': '地图加载失败',
  'map.errorBody':
    '请检查 apps/web/.env.local 中的 VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE，以及高德控制台的域名白名单。',
  'map.clusterLabel': '{count} 个事件，点击放大',
  'map.eventLabel': '{name}，查看详情',
  'map.bubbleClose': '关闭事件气泡',

  'card.coverAlt': '{title} 封面',
  'card.enter': '进入专题',

  'language.zh': '中文',
  'language.en': 'EN',
  'language.toggle': '切换语言',

  'privacy.title': '隐私政策',
  'privacy.updated': '更新日期：2026-11-04',
  'privacy.back': '← 返回',
  'privacy.s1.title': '1. 我们收集什么',
  'privacy.s1.body':
    '本应用不要求注册账号，不收集姓名、手机号、邮箱等个人身份信息。\n专题数据为静态历史资料，不包含个人信息。',
  'privacy.s2.title': '2. 高德地图 SDK',
  'privacy.s2.body':
    '本应用使用高德地图 SDK 提供地图展示服务。SDK 提供者为高德软件有限公司，可能收集设备信息、网络信息、地图交互所需的信息（本版本不申请定位权限），用于地图渲染、坐标转换与服务可用性保障。',
  'privacy.s3.title': '3. 权限说明',
  'privacy.s3.body':
    '当前版本不申请定位权限，也不读取通讯录、相册、麦克风等与功能无关的权限。\n如未来启用「我的位置」，会在使用前单独征得你的同意，并更新本政策。',
  'privacy.s4.title': '4. 分享链接',
  'privacy.s4.body':
    '分享链接仅包含专题、时间点、事件与地图视野参数，不包含任何个人身份信息。\n链接由你主动分享，我们不做访问统计。',
  'privacy.s5.title': '5. 数据存储与第三方',
  'privacy.s5.body':
    '专题数据以静态文件形式托管，通过 CDN 分发。除高德地图 SDK 外，本应用不集成广告、统计或用户画像类第三方 SDK。',
  'privacy.s6.title': '6. 联系我们',
  'privacy.s6.body': '如对本政策有疑问，请通过项目仓库联系我们。',
  'privacy.amapPolicy': '高德地图开放平台隐私权政策',

  'consent.title': '隐私说明',
  'consent.body1':
    '本应用使用高德地图 SDK 提供地图展示服务。SDK 可能收集设备信息、网络信息与地图交互所需的位置信息（本版本不申请定位权限）。',
  'consent.body2':
    '我们不会将上述信息用于广告或出售。继续使用前，请阅读并同意高德地图开放平台隐私权政策。',
  'consent.amapPolicy': '查看《高德地图开放平台隐私权政策》',
  'consent.ourPolicy': '查看本应用隐私政策',
  'consent.agree': '同意并继续',
  'consent.rejectNote': '拒绝将无法加载地图，但可返回退出应用。',
} as const;

const en: Record<keyof typeof zh, string> = {
  'app.title': 'Chronicles Atlas',
  'app.tagline':
    'Explore historical atlases through maps and timelines. Atlases are pluggable data packages; the platform does not prescribe a single historical narrative.',
  'app.footer': 'Chronicles Atlas — M7 sample data',
  'app.footerData': 'Illustrative draft data, pending historical review',
  'privacy.link': 'Privacy Policy',
  'offline.banner': 'You are offline. Cached content is still available.',

  'nav.backToAtlases': '← Atlases',
  'nav.search': 'Search',
  'nav.filters': 'Filters',
  'nav.closeFilters': 'Close filters',
  'nav.retry': 'Retry',
  'nav.reset': 'Reset',

  'common.loading': 'Loading…',
  'common.start': 'Start',
  'common.end': 'End',
  'common.all': 'All',
  'common.share': 'Share',
  'common.shared': 'Shared',
  'common.viewDetails': 'View details',
  'common.time': 'Time',
  'common.place': 'Place',
  'common.entity': 'Entity',
  'common.category': 'Category',
  'common.sources': 'Sources',
  'common.relatedEvents': 'Related events',
  'common.segment': '{count} segment',
  'common.segments': '{count} segments',
  'common.events': '{count} events',

  'gallery.subtitle': 'Historical atlases',
  'gallery.count': '{count} atlases',
  'gallery.searchEvents': 'Search events →',
  'gallery.dataContract': 'Data contract v1.0.0',
  'gallery.mapService': 'Map service · AMap',
  'gallery.empty':
    'No atlas data packages yet. Add one following docs/schema/atlas-schema-v1.0.0.md.',
  'gallery.errorTitle': 'Failed to load atlas index',

  'search.title': 'Search',
  'search.subtitle':
    'Find events by name, place, category, or date. Click a result to jump to that point in time.',
  'search.placeholder': 'e.g. Zunyi, zunyi, 1935',
  'search.allAtlases': 'All atlases',
  'search.result': '{count} result',
  'search.results': '{count} results',
  'search.promptTitle': 'Enter a keyword to search',
  'search.promptBody':
    'Supports event names, places, categories, and dates, e.g. “Zunyi”, “Guizhou”, “1935”, “Key meeting”.',
  'search.emptyTitle': 'No matching events',
  'search.emptyBody': 'Try a shorter keyword, or switch to “All atlases”.',
  'search.clear': 'Clear search',
  'search.note':
    'Search supports Chinese, pinyin, initials, and English substring matching; word segmentation and spell correction are not yet supported.',
  'search.errorTitle': 'Failed to load search data',
  'search.atlasFilter': 'Filter by atlas',

  'atlas.loading': 'Loading atlas data…',
  'atlas.errorTitle': 'Failed to load atlas',
  'atlas.backToGallery': 'Back to atlases',
  'atlas.mapAttribution': 'AMap · WGS84 → GCJ-02',
  'atlas.draft': 'Illustrative draft · pending historical review',
  'atlas.filters': 'Filters',

  'legend.layers': 'Route layers',
  'legend.filters': 'Filters',
  'legend.hint':
    'Combined with the timeline: only events that have occurred and match the filters are shown.',
  'legend.reset': 'Reset',

  'timeline.label': 'Atlas timeline',
  'timeline.play': 'Play',
  'timeline.pause': 'Pause',
  'timeline.hint': 'Drag the timeline or press play',
  'timeline.zoomIn': 'Zoom in timeline',
  'timeline.zoomOut': 'Zoom out timeline',
  'timeline.zoomAll': 'All',
  'timeline.jumpToDate': 'Jump to date',

  'detail.title': 'Event details',
  'detail.close': 'Close details',
  'detail.rendering': 'Rendering details…',

  'map.title': 'Historical atlas map',
  'map.errorTitle': 'Failed to load map',
  'map.errorBody':
    'Check VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE in apps/web/.env.local and the domain allowlist in the AMap console.',
  'map.clusterLabel': '{count} events, click to zoom in',
  'map.eventLabel': '{name}, view details',
  'map.bubbleClose': 'Close event bubble',

  'card.coverAlt': '{title} cover',
  'card.enter': 'Open atlas',

  'language.zh': '中文',
  'language.en': 'EN',
  'language.toggle': 'Switch language',

  'privacy.title': 'Privacy Policy',
  'privacy.updated': 'Updated: 2026-11-04',
  'privacy.back': '← Back',
  'privacy.s1.title': '1. What we collect',
  'privacy.s1.body':
    'This app does not require an account and does not collect names, phone numbers, email addresses, or other personal identifiers.\nAtlas data consists of static historical materials and contains no personal information.',
  'privacy.s2.title': '2. AMap SDK',
  'privacy.s2.body':
    'This app uses the AMap SDK to provide map display. The SDK provider is AutoNavi Software Co., Ltd. (高德软件有限公司), which may collect device information, network information, and information required for map interaction (this version does not request location permission) for map rendering, coordinate conversion, and service availability.',
  'privacy.s3.title': '3. Permissions',
  'privacy.s3.body':
    'This version does not request location permission and does not access contacts, photos, microphone, or other permissions unrelated to its features.\nIf “My location” is enabled in the future, we will ask for your consent separately and update this policy.',
  'privacy.s4.title': '4. Shared links',
  'privacy.s4.body':
    'Shared links contain only atlas, time, event, and map view parameters; they do not contain personal identifiers.\nLinks are shared by you voluntarily; we do not perform visit analytics.',
  'privacy.s5.title': '5. Data storage and third parties',
  'privacy.s5.body':
    'Atlas data is hosted as static files and distributed via CDN. Apart from the AMap SDK, this app does not integrate advertising, analytics, or profiling SDKs.',
  'privacy.s6.title': '6. Contact',
  'privacy.s6.body':
    'If you have questions about this policy, please contact us through the project repository.',
  'privacy.amapPolicy': 'AMap Open Platform Privacy Policy',

  'consent.title': 'Privacy notice',
  'consent.body1':
    'This app uses the AMap SDK to provide map display. The SDK may collect device information, network information, and location information required for map interaction (this version does not request location permission).',
  'consent.body2':
    'We do not use this information for advertising or sell it. Before continuing, please read and agree to the AMap Open Platform privacy policy.',
  'consent.amapPolicy': 'View AMap Open Platform Privacy Policy',
  'consent.ourPolicy': "View this app's Privacy Policy",
  'consent.agree': 'Agree and continue',
  'consent.rejectNote':
    'If you decline, maps cannot load, but you can go back and exit the app.',
};

export const messages = { zh, en } as const;

export type MessageKey = keyof typeof zh;

/** 读取文案；缺失时回退中文，再回退 key 本身 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = messages[locale]?.[key] ?? messages.zh[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    params[name] !== undefined ? String(params[name]) : match,
  );
}
