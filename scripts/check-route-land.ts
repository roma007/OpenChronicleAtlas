import fs from 'node:fs';
import path from 'node:path';
import { loadAtlas, type AtlasRouteFeature, type DataSource } from '../packages/shared/src/index.ts';

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
  all?: boolean;
  segment: string;
  thresholdKm: number;
  json: boolean;
  allSegments: boolean;
}

interface AllowEntry {
  entityId: string;
  from: [number, number];
  to: [number, number];
  reason: string;
}

interface LandRun {
  entityId: string;
  featureIndex: number;
  segmentIndex: number;
  from: [number, number];
  to: [number, number];
  landKm: number;
  longestKm: number;
  start: [number, number];
  end: [number, number];
  allowed?: string;
}

const LAND_FILE = path.resolve('scripts/data/ne_50m_land.geojson');
const EARTH_RADIUS_KM = 6371;
const SAMPLE_STEP_KM = 2;

function printUsage(): void {
  console.log(`用法：pnpm check:land [选项]

判断航线是否穿越陆地（默认只查 naval 航线）。

选项：
  --atlas <id>       只检查指定专题，如 zheng-he（默认 zheng-he）
  --all              检查全部专题
  --segment <type>   只检查指定 segmentType，默认 naval；all 表示全部
  --threshold <km>   连续陆地超过该长度才报错，默认 25
  --json             以 JSON 输出
  -h, --help         显示帮助`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    segment: 'naval',
    thresholdKm: 25,
    json: false,
    allSegments: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--atlas') {
      options.atlas = argv[++i];
      if (!options.atlas) throw new Error('--atlas 需要专题 id');
    } else if (arg === '--all') {
      options.all = true;
    } else if (arg === '--segment') {
      const value = argv[++i];
      if (!value) throw new Error('--segment 需要类型');
      if (value === 'all') options.allSegments = true;
      else options.segment = value;
    } else if (arg === '--threshold') {
      const value = Number(argv[++i]);
      if (!Number.isFinite(value) || value <= 0) throw new Error('--threshold 需要正数');
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
  return options;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

type Ring = Array<[number, number]>;
interface LandPolygon {
  bbox: [number, number, number, number];
  outer: Ring;
  holes: Ring[];
}

function ringBbox(ring: Ring): [number, number, number, number] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}

function pointInRing(point: [number, number], ring: Ring): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInLand(point: [number, number], land: LandPolygon[]): boolean {
  for (const polygon of land) {
    const [minX, minY, maxX, maxY] = polygon.bbox;
    if (point[0] < minX || point[0] > maxX || point[1] < minY || point[1] > maxY) continue;
    if (!pointInRing(point, polygon.outer)) continue;
    let inHole = false;
    for (const hole of polygon.holes) {
      if (pointInRing(point, hole)) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

function loadLand(): LandPolygon[] {
  const raw = JSON.parse(fs.readFileSync(LAND_FILE, 'utf8')) as {
    features: Array<{
      geometry:
        | { type: 'Polygon'; coordinates: number[][][] }
        | { type: 'MultiPolygon'; coordinates: number[][][][] };
    }>;
  };
  const polygons: LandPolygon[] = [];
  for (const feature of raw.features) {
    const { geometry } = feature;
    const groups =
      geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    for (const group of groups) {
      const [outer, ...holes] = group;
      if (!outer) continue;
      const outerRing = outer.map(([x, y]) => [x!, y!] as [number, number]);
      const holeRings = holes.map((ring) =>
        ring.map(([x, y]) => [x!, y!] as [number, number]),
      );
      polygons.push({
        bbox: ringBbox(outerRing),
        outer: outerRing,
        holes: holeRings,
      });
    }
  }
  return polygons;
}

function pointAt(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function scanFeature(
  feature: AtlasRouteFeature,
  featureIndex: number,
  land: LandPolygon[],
  thresholdKm: number,
): LandRun[] {
  const coords = feature.geometry.coordinates as Array<[number, number]>;
  const runs: LandRun[] = [];

  for (let i = 1; i < coords.length; i += 1) {
    const from = coords[i - 1]!;
    const to = coords[i]!;
    const totalKm = haversineKm(from, to);
    const steps = Math.max(1, Math.ceil(totalKm / SAMPLE_STEP_KM));
    const stepKm = totalKm / steps;

    let runKm = 0;
    let longestKm = 0;
    let runStart: [number, number] | null = null;
    let runEnd: [number, number] | null = null;
    let longestStart: [number, number] | null = null;
    let longestEnd: [number, number] | null = null;

    for (let s = 0; s <= steps; s += 1) {
      const point = pointAt(from, to, s / steps);
      const onLand = pointInLand(point, land);
      if (onLand) {
        if (runKm === 0) runStart = point;
        runKm += stepKm;
        runEnd = point;
        if (runKm > longestKm) {
          longestKm = runKm;
          longestStart = runStart;
          longestEnd = runEnd;
        }
      } else {
        runKm = 0;
        runStart = null;
        runEnd = null;
      }
    }

    if (longestKm >= thresholdKm && longestStart && longestEnd) {
      runs.push({
        entityId: feature.properties.entityId,
        featureIndex,
        segmentIndex: i,
        from,
        to,
        landKm: totalKm,
        longestKm,
        start: longestStart,
        end: longestEnd,
      });
    }
  }

  return runs;
}

function samePoint(a: [number, number], b: [number, number]): boolean {
  return Math.abs(a[0] - b[0]) < 0.02 && Math.abs(a[1] - b[1]) < 0.02;
}

function loadAllowlist(atlasDir: string): AllowEntry[] {
  const file = path.join(atlasDir, 'land-legs.allow.json');
  if (!fs.existsSync(file)) return [];
  const entries = JSON.parse(fs.readFileSync(file, 'utf8')) as AllowEntry[];
  for (const entry of entries) {
    if (!entry.reason?.trim()) {
      throw new Error(`${file} 中的例外必须写 reason：${JSON.stringify(entry)}`);
    }
    if (!entry.entityId || !entry.from || !entry.to) {
      throw new Error(`${file} 中的例外需要 entityId / from / to：${JSON.stringify(entry)}`);
    }
  }
  return entries;
}

function formatPoint(point: [number, number]): string {
  return `${point[1].toFixed(2)}N, ${point[0].toFixed(2)}E`;
}

function findAllow(run: LandRun, allowlist: AllowEntry[]): AllowEntry | undefined {
  return allowlist.find(
    (entry) =>
      entry.entityId === run.entityId &&
      ((samePoint(entry.from, run.from) && samePoint(entry.to, run.to)) ||
        (samePoint(entry.from, run.to) && samePoint(entry.to, run.from))),
  );
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

if (!fs.existsSync(LAND_FILE)) {
  console.error(`❌ 缺少岸线数据：${LAND_FILE}（见 scripts/data/README.md）`);
  process.exit(2);
}

const land = loadLand();
const allIds = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const DEFAULT_ATLAS = 'zheng-he';
const targetAtlas = options.all ? undefined : (options.atlas ?? DEFAULT_ATLAS);
const ids = targetAtlas ? allIds.filter((id) => id === targetAtlas) : allIds;

if (ids.length === 0) {
  console.error(`❌ 未找到专题：${targetAtlas ?? '(全部)'}`);
  process.exit(2);
}

const summaries: Array<{
  id: string;
  routes: number;
  issues: number;
  longestKm: number;
}> = [];
const issues: LandRun[] = [];

for (const id of ids) {
  try {
    const dataset = await loadAtlas(path.join(root, id, 'manifest.json'), { dataSource });
    const allowlist = loadAllowlist(path.join(root, id));
    const features = dataset.routes
      .map((feature, index) => ({ feature, index }))
      .filter(({ feature }) => {
        if (options.allSegments) return true;
        return feature.properties.segmentType === options.segment;
      });

    const runs: LandRun[] = [];
    for (const { feature, index } of features) {
      for (const run of scanFeature(feature, index, land, options.thresholdKm)) {
        const allowed = findAllow(run, allowlist);
        run.allowed = allowed?.reason;
        runs.push(run);
      }
    }

    const blocking = runs.filter((run) => !run.allowed);
    summaries.push({
      id,
      routes: features.length,
      issues: blocking.length,
      longestKm: runs.reduce((max, run) => Math.max(max, run.longestKm), 0),
    });
    issues.push(...runs);
  } catch (error) {
    console.error(`❌ ${id}: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

if (options.json) {
  console.log(
    JSON.stringify(
      {
        thresholdKm: options.thresholdKm,
        segment: options.allSegments ? 'all' : options.segment,
        atlases: summaries,
        issues,
      },
      null,
      2,
    ),
  );
} else {
  for (const summary of summaries) {
    const mark = summary.issues === 0 ? '✅' : '❌';
    console.log(
      `${mark} ${summary.id}: ${summary.routes} 条航线，${summary.issues} 段穿越陆地`,
    );
  }

  const allowed = issues.filter((run) => run.allowed);
  if (issues.length > 0) {
    console.log('');
    for (const run of issues) {
      const head = `${run.entityId} 第 ${run.segmentIndex} 段（${formatPoint(run.from)} → ${formatPoint(run.to)}）`;
      if (run.allowed) {
        console.log(`   · ${head} 陆地约 ${run.longestKm.toFixed(0)}km，已登记：${run.allowed}`);
      } else {
        console.log(
          `   - ${head} 连续陆地约 ${run.longestKm.toFixed(0)}km（${formatPoint(run.start)} → ${formatPoint(run.end)}）`,
        );
      }
    }
  }

  const blocking = issues.length - allowed.length;
  console.log(
    `\n共 ${summaries.length} 个专题，陆地连续超过 ${options.thresholdKm}km 的航段 ${issues.length} 处，` +
      `其中 ${allowed.length} 处已登记例外，${blocking} 处待处理。`,
  );
}

process.exit(issues.some((run) => !run.allowed) ? 1 : 0);

export type { LandRun };
