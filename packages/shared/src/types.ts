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
}

export interface AtlasManifest {
  schemaVersion: string;
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  timeRange: { start: DateString; end: DateString };
  cover?: string;
  description?: LocalizedString;
  defaultView: { center: [number, number]; zoom: number };
  routes: string[];
  events: string[];
  entities: AtlasEntity[];
  tags?: string[];
  license?: string;
  updatedAt?: DateString;
  extensions?: Record<string, unknown>;
}

export interface AtlasSummary {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  cover?: string;
  timeRange: { start: DateString; end: DateString };
  tags?: string[];
  /** 相对 data/atlases 的 manifest 路径，如 long-march/manifest.json */
  path: string;
}

export interface AtlasIndex {
  schemaVersion: string;
  atlases: AtlasSummary[];
}

export type RouteSegmentType =
  | 'advance'
  | 'retreat'
  | 'defense'
  | 'counterattack'
  | 'naval'
  | 'supply'
  | 'other';

export interface AtlasRouteProperties {
  entityId: string;
  startDate: DateString;
  endDate: DateString;
  order: number;
  segmentType?: RouteSegmentType;
  name?: LocalizedString;
  description?: LocalizedString;
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
  location: { lng: number; lat: number; place?: LocalizedString };
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
  eventsById: ReadonlyMap<string, AtlasEvent>;
  entitiesById: ReadonlyMap<string, AtlasEntity>;
  eventsByEntity: ReadonlyMap<string, AtlasEvent[]>;
  warnings: AtlasIssue[];
}
