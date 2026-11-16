import fs from 'node:fs';
import path from 'node:path';
import {
  AtlasDataError,
  distancePointToRouteKm,
  loadAtlas,
  resolveLocalized,
  type AtlasRouteFeature,
  type DataSource,
} from '../packages/shared/src/index.ts';

class FsDataSource implements DataSource {
  async readText(file: string): Promise<string> {
    return fs.promises.readFile(file, 'utf8');
  }

  resolve(baseDir: string, relative: string): string {
    return path.resolve(baseDir, relative);
  }

  dirname(file: string): string {
    return path.dirname(file);
  }
}

interface CliOptions {
  atlas?: string;
  entity?: string;
  all: boolean;
  thresholdKm: number;
  json: boolean;
}

interface AllowEntry {
  entityId: string;
  order: number;
  endpoint: 'start' | 'end';
  reason: string;
}

interface EndpointIssue {
  atlasId: string;
  entityId: string;
  order: number;
  endpoint: 'start' | 'end';
  routeName: string;
  startDate: string;
  endDate: string;
  distanceToRouteKm: number;
  nearestRouteOrder: number | null;
  distanceToEventKm: number;
  nearestEventId: string | null;
  point: [number, number];
}

const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG_AT_EQUATOR = 111.32;
const DEFAULT_THRESHOLD_KM = 10;
const DEFAULT_ATLAS = 'long-march';

function printUsage(): void {
  console.log(`用法：pnpm check:heads [选项]

检查路线端点是否「有来由的线头、有后续的线尾」：
每个端点必须落在同实体另一段路线上、或同实体事件上（阈值默认 10km），
或是该实体的第一条路线起点 / 最后一条路线终点。
防线、航线、补给线与国民党军追击/封锁线不适用。

选项：
  --atlas <id>       只检查指定专题，默认 ${DEFAULT_ATLAS}
  --entity <id>      只检查指定实体（配合 --atlas，用于分批核查）
  --all              检查全部专题
  --threshold <km>   距离阈值，默认 ${DEFAULT_THRESHOLD_KM}
  --json             以 JSON 输出
  -h, --help         显示帮助`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { all: false, thresholdKm: DEFAULT_THRESHOLD_KM, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--atlas') {
      options.atlas = argv[++i];
      if (!options.atlas) throw new Error('--atlas 需要专题 id');
    } else if (arg === '--entity') {
      options.entity = argv[++i];
      if (!options.entity) throw new Error('--entity 需要实体 id');
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--threshold') {
      const value = Number(argv[++i]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error('--threshold 需要大于 0 的数字（公里）');
      }
      options.thresholdKm = value;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else {
      throw new Error(`未知参数：${arg}`);
    }
  }
  if (options.all && options.atlas) throw new Error('--all 与 --atlas 不能同时使用');
  return options;
}

function distanceKm(a: [number, number], b: [number, number]): number {
  const lat = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const x = (b[0] - a[0]) * KM_PER_DEG_LNG_AT_EQUATOR * Math.cos(lat);
  const y = (b[1] - a[1]) * KM_PER_DEG_LAT;
  return Math.hypot(x, y);
}

function loadAllowlist(atlasDir: string): Set<string> {
  const file = path.join(atlasDir, 'route-endpoints.allow.json');
  if (!fs.existsSync(file)) return new Set();
  const entries = JSON.parse(fs.readFileSync(file, 'utf8')) as AllowEntry[];
  const keys = new Set<string>();
  for (const entry of entries) {
    if (!entry.reason?.trim()) {
      throw new Error(`${file} 中的例外必须写 reason：${JSON.stringify(entry)}`);
    }
    keys.add(`${entry.entityId}:${entry.order}:${entry.endpoint}`);
  }
  return keys;
}

function isExemptEntity(entityId: string): boolean {
  return entityId.startsWith('kmt');
}

function isExemptSegmentType(type: string | undefined): boolean {
  return type === 'defense' || type === 'naval' || type === 'supply';
}

const root = path.resolve('data/atlases');
const dataSource = new FsDataSource();
let options: CliOptions;

try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(`❌ ${(error as Error).message}`);
  printUsage();
  process.exit(2);
}

const allIds = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const ids = options.all ? allIds : allIds.filter((id) => id === (options.atlas ?? DEFAULT_ATLAS));

if (ids.length === 0) {
  console.error(`❌ 未找到专题：${options.atlas ?? DEFAULT_ATLAS}`);
  process.exit(2);
}

const issues: EndpointIssue[] = [];
const summaries: Array<{ id: string; routes: number; issues: number }> = [];
let failed = 0;

for (const id of ids) {
  const atlasDir = path.join(root, id);
  try {
    const dataset = await loadAtlas(path.join(atlasDir, 'manifest.json'), { dataSource });
    const allowlist = loadAllowlist(atlasDir);
    const byEntity = new Map<string, AtlasRouteFeature[]>();
    for (const route of dataset.routes) {
      const entityId = route.properties.entityId;
      if (options.entity && entityId !== options.entity) continue;
      const list = byEntity.get(entityId);
      if (list) list.push(route);
      else byEntity.set(entityId, [route]);
    }

    let atlasIssues = 0;
    for (const [entityId, routes] of byEntity) {
      if (isExemptEntity(entityId)) continue;
      routes.sort(
        (a, b) =>
          a.properties.startDate.localeCompare(b.properties.startDate) ||
          a.properties.order - b.properties.order,
      );
      const events = dataset.events.filter((event) => event.entityIds.includes(entityId));
      for (let index = 0; index < routes.length; index += 1) {
        const route = routes[index]!;
        if (isExemptSegmentType(route.properties.segmentType)) continue;
        const coordinates = route.geometry.coordinates as [number, number][];
        for (const endpoint of ['start', 'end'] as const) {
          if (endpoint === 'start' && index === 0) continue;
          if (endpoint === 'end' && index === routes.length - 1) continue;
          const point = endpoint === 'start' ? coordinates[0]! : coordinates[coordinates.length - 1]!;

          let distanceToRouteKm = Number.POSITIVE_INFINITY;
          let nearestRouteOrder: number | null = null;
          for (const other of routes) {
            if (other === route) continue;
            const distance = distancePointToRouteKm(point, other);
            if (distance < distanceToRouteKm) {
              distanceToRouteKm = distance;
              nearestRouteOrder = other.properties.order;
            }
          }

          let distanceToEventKm = Number.POSITIVE_INFINITY;
          let nearestEventId: string | null = null;
          for (const event of events) {
            const distance = distanceKm(point, [event.location.lng, event.location.lat]);
            if (distance < distanceToEventKm) {
              distanceToEventKm = distance;
              nearestEventId = event.id;
            }
          }

          if (
            distanceToRouteKm <= options.thresholdKm ||
            distanceToEventKm <= options.thresholdKm
          ) {
            continue;
          }
          if (allowlist.has(`${entityId}:${route.properties.order}:${endpoint}`)) continue;

          atlasIssues += 1;
          issues.push({
            atlasId: id,
            entityId,
            order: route.properties.order,
            endpoint,
            routeName: resolveLocalized(route.properties.name, 'zh'),
            startDate: route.properties.startDate,
            endDate: route.properties.endDate,
            distanceToRouteKm,
            nearestRouteOrder,
            distanceToEventKm,
            nearestEventId,
            point,
          });
        }
      }
    }
    summaries.push({ id, routes: dataset.routes.length, issues: atlasIssues });
  } catch (error) {
    failed += 1;
    if (error instanceof AtlasDataError) {
      console.error(`❌ ${id}: ${error.message}`);
    } else {
      console.error(`❌ ${id}:`, error);
    }
  }
}

if (options.json) {
  console.log(
    JSON.stringify(
      { thresholdKm: options.thresholdKm, atlases: summaries, issues, failed },
      null,
      2,
    ),
  );
} else {
  for (const summary of summaries) {
    const mark = summary.issues === 0 ? '✅' : '❌';
    console.log(`${mark} ${summary.id}: ${summary.routes} 段路线，${summary.issues} 个无来由端点`);
  }
  if (issues.length > 0) {
    console.log('');
    for (const issue of issues) {
      const endpointLabel = issue.endpoint === 'start' ? '线头' : '线尾';
      const nearestRoute =
        issue.nearestRouteOrder === null ? '无' : `#${issue.nearestRouteOrder}`;
      const nearestEvent = issue.nearestEventId ?? '无';
      console.log(
        `   - ${issue.atlasId} ${issue.entityId} #${issue.order} ${endpointLabel}「${issue.routeName}」` +
          ` [${issue.startDate} → ${issue.endDate}]：` +
          `距最近路线 ${issue.distanceToRouteKm.toFixed(1)}km（${nearestRoute}）、` +
          `距最近事件 ${issue.distanceToEventKm.toFixed(1)}km（${nearestEvent}）`,
      );
    }
    console.log('');
    console.log(
      '   处理方式：补连接线、补事件锚点，或在该专题 route-endpoints.allow.json 中登记并写明原因。',
    );
  }
  const totalIssues = summaries.reduce((sum, item) => sum + item.issues, 0);
  console.log(
    `\n共 ${summaries.length} 个专题，${summaries.reduce((sum, item) => sum + item.routes, 0)} 段路线，` +
      `${totalIssues} 个无来由端点（阈值 ${options.thresholdKm}km）。`,
  );
}

process.exit(failed > 0 || issues.length > 0 ? 1 : 0);
