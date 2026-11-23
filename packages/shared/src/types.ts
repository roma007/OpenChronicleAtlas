/** 多语言字符串：单语言可直接用 string，多语言用 { zh, en? } */
export type LocalizedString = string | { zh: string; en?: string };

/** 日期字符串：YYYY-MM-DD */
export type DateString = string;

/** 平台内部时间：UTC 日粒度 epoch 毫秒 */
export type AtlasTime = number;

export type IssueLevel = 'error' | 'warning';

export interface AtlasIssue {
  level: IssueLevel;
  /** JSON Path，如 events[0].location.lng */
  path: string;
  message: string;
}

export interface AtlasEntity {
  id: string;
  name: LocalizedString;
  color: string;
  description?: LocalizedString;
  order?: number;
  /** 客户端扩展字段，例如 legend: false 表示只在地图上显示、不进入图例 */
  extensions?: Record<string, unknown>;
}

/** 封面上的文字版式，与封面图分离，由客户端叠加渲染 */
export interface AtlasCoverText {
  /** 英文专题名，存在时使用「详版」版式 */
  enTitle?: string;
  /** 年代，如 190—280 或 1934 — 1936 */
  years?: string;
  /** 中文关键词行 */
  keywords?: string;
  /** 英文关键词行 */
  keywordsEn?: string;
  /** 简版品牌行前缀，如「史迹 · 时空地图」 */
  brand?: string;
  /** 底部注记（中文） */
  note?: string;
  /** 底部注记（英文） */
  noteEn?: string;
}

export interface AtlasManifest {
  schemaVersion: string;
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  timeRange: { start: DateString; end: DateString };
  cover?: string;
  coverText?: AtlasCoverText;
  description?: LocalizedString;
  defaultView: { center: [number, number]; zoom: number };
  routes: string[];
  events: string[];
  /** 可选：时代地理分布（半透明疆域遮罩）数据文件，相对 manifest 路径 */
  territories?: string[];
  /** 可选：历史行政区/地点字典，相对 manifest 路径 */
  regions?: string;
  /** 可选：事件/路线 → 地区索引，相对 manifest 路径 */
  regionIndex?: string;
  entities: AtlasEntity[];
  tags?: string[];
  license?: string;
  updatedAt?: DateString;
  extensions?: Record<string, unknown>;
}

export type RegionLevel = 'province' | 'municipality' | 'county' | 'place' | 'overseas';

/** 历史行政区/地点节点。省、院辖市为一级，县/市/地点为二级。 */
export interface AtlasRegion {
  id: string;
  level: RegionLevel;
  parentId: string | null;
  name: LocalizedString;
  shortName?: LocalizedString;
  aliases?: string[];
  modernName?: LocalizedString;
  validFrom?: DateString;
  validTo?: DateString;
  /** 院辖市/地点在地图上的落点 */
  point?: [number, number];
  extensions?: Record<string, unknown>;
}

export interface AtlasRegionFile {
  schemaVersion: string;
  frame: string;
  regions: AtlasRegion[];
}

export interface AtlasRouteRegionEntry {
  regionIds: string[];
  endpointRegionIds?: string[];
}

export interface AtlasRegionIndex {
  schemaVersion: string;
  generatedAt?: DateString;
  events: Record<string, string[]>;
  routes: Record<string, AtlasRouteRegionEntry>;
}

export interface AtlasSummary {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  cover?: string;
  coverText?: AtlasCoverText;
  timeRange: { start: DateString; end: DateString };
  tags?: string[];
  /** 相对 data/atlases 的 manifest 路径，如 long-march/manifest.json */
  path: string;
}

export interface AtlasIndex {
  schemaVersion: string;
  dataVersion?: string;
  atlases: AtlasSummary[];
}

export type RouteSegmentType =
  | 'advance'
  | 'retreat'
  | 'defense'
  | 'counterattack'
  | 'naval'
  /** 分䑸：与主队并行的分遣队航线 */
  | 'detachment'
  | 'supply'
  /** 运河、渠道等内河航道 */
  | 'canal'
  | 'other';

export interface AtlasRouteProperties {
  entityId: string;
  startDate: DateString;
  endDate: DateString;
  order: number;
  segmentType?: RouteSegmentType;
  name?: LocalizedString;
  description?: LocalizedString;
  /** 地图上的番号短标识，如「粤军 第一集团军」 */
  label?: LocalizedString;
  /** 番号标识落点 [lng, lat]，缺省取路线中点 */
  labelPoint?: [number, number];
  /** 路线经过的行政区/地点 id（构建时生成） */
  regionIds?: string[];
  /** 路线起点、终点所在地区 id（构建时生成） */
  endpointRegionIds?: string[];
  extensions?: Record<string, unknown>;
}

export interface AtlasRouteFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  properties: AtlasRouteProperties;
}

export interface AtlasRouteFile {
  type: 'FeatureCollection';
  features: AtlasRouteFeature[];
}

/** 面环：[[lng, lat], ...]，首尾应闭合 */
export type AtlasRing = [number, number][];

export interface AtlasTerritoryProperties {
  entityId: string;
  startDate: DateString;
  endDate: DateString;
  order?: number;
  name?: LocalizedString;
  description?: LocalizedString;
  /** 地图上的短标识，如「魏」「汉」「吴」 */
  label?: LocalizedString;
  /** 标识落点 [lng, lat]，缺省取外环顶点平均值 */
  labelPoint?: [number, number];
  /** 填充不透明度，0—0.6，默认 0.16 */
  opacity?: number;
  extensions?: Record<string, unknown>;
}

export interface AtlasTerritoryFeature {
  type: 'Feature';
  geometry:
    | { type: 'Polygon'; coordinates: AtlasRing[] }
    | { type: 'MultiPolygon'; coordinates: AtlasRing[][] };
  properties: AtlasTerritoryProperties;
}

export interface AtlasTerritoryFile {
  type: 'FeatureCollection';
  features: AtlasTerritoryFeature[];
}

export interface AtlasImage {
  src: string;
  caption?: LocalizedString;
  credit?: string;
  license?: string;
  width?: number;
  height?: number;
}

export interface AtlasSource {
  title: string;
  url?: string;
  author?: string;
  year?: number;
  note?: string;
}

export interface AtlasEvent {
  id: string;
  atlasId: string;
  name: LocalizedString;
  aliases?: LocalizedString[];
  date: DateString;
  endDate?: DateString;
  location: {
    lng: number;
    lat: number;
    place?: LocalizedString;
    /** 行政区/地点 id，从省到最细一级（构建时生成） */
    regionIds?: string[];
  };
  entityIds: string[];
  category: string;
  summary: LocalizedString;
  description?: LocalizedString;
  images?: AtlasImage[];
  sources?: AtlasSource[];
  relatedIds?: string[];
  importance?: 1 | 2 | 3;
  extensions?: Record<string, unknown>;
}

export interface AtlasDataset {
  manifest: AtlasManifest;
  routes: AtlasRouteFeature[];
  events: AtlasEvent[];
  territories: AtlasTerritoryFeature[];
  regions: AtlasRegion[];
  regionIndex: AtlasRegionIndex | null;
  eventsById: ReadonlyMap<string, AtlasEvent>;
  entitiesById: ReadonlyMap<string, AtlasEntity>;
  eventsByEntity: ReadonlyMap<string, AtlasEvent[]>;
  regionsById: ReadonlyMap<string, AtlasRegion>;
  warnings: AtlasIssue[];
}
