import fs from 'node:fs';
import path from 'node:path';
import { distanceKm, loadAtlas, type DataSource } from '../packages/shared/src/index.ts';


function pointInRing(
  point: [number, number],
  ring: [number, number][],
): boolean {
  let inside = false;
  for (let index = 0; index < ring.length; index += 1) {
    const [x1, y1] = ring[index]!;
    const [x2, y2] = ring[(index + 1) % ring.length]!;
    if (y1 > point[1] !== y2 > point[1]) {
      const x = x1 + ((point[1] - y1) * (x2 - x1)) / (y2 - y1);
      if (point[0] < x) inside = !inside;
    }
  }
  return inside;
}

/** 取线段中点两侧各 km 公里的点，用于判断线段是否切过省域内部。 */
function perpendicularOffsets(
  a: [number, number],
  b: [number, number],
  km: number,
): [[number, number], [number, number]] | null {
  const midLng = (a[0] + b[0]) / 2;
  const midLat = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const scale = Math.cos((midLat * Math.PI) / 180);
  const norm = Math.hypot(dx * scale, dy);
  if (norm === 0) return null;
  const ux = -dy / norm;
  const uy = dx / norm;
  const dLng = (ux * km) / (111.32 * scale);
  const dLat = (uy * km) / 110.57;
  return [
    [midLng + dLng, midLat + dLat],
    [midLng - dLng, midLat - dLat],
  ];
}

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

const root = path.resolve('data/atlases');
const ids = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const source = new FsDataSource();
let failed = false;
let checked = 0;

for (const id of ids) {
  const manifestPath = path.join(root, id, 'manifest.json');
  const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8')) as {
    regions?: string;
    regionIndex?: string;
  };
  if (!manifest.regions) continue;
  checked += 1;

  const dataset = await loadAtlas(manifestPath, { dataSource: source });
  const missingEvents = dataset.events.filter(
    (event) => !event.location.regionIds || event.location.regionIds.length === 0,
  );
  const missingRoutes = dataset.routes.filter(
    (route) => !route.properties.regionIds || route.properties.regionIds.length === 0,
  );
  const firstLevel = dataset.regions.filter(
    (region) =>
      region.level === 'province' ||
      region.level === 'municipality' ||
      region.level === 'overseas',
  );
  const orphanPlaces = dataset.regions.filter(
    (region) => region.level === 'place' && !region.parentId,
  );

  const problems: string[] = [];
  if (!manifest.regionIndex) problems.push('manifest 缺少 regionIndex');
  if (firstLevel.length === 0) problems.push('regions 中没有一级地区');
  if (missingEvents.length > 0) {
    problems.push(`事件缺少地区：${missingEvents.length} 条（如 ${missingEvents[0]?.id}）`);
  }
  if (missingRoutes.length > 0) {
    problems.push(`路线缺少地区：${missingRoutes.length} 段`);
  }
  if (orphanPlaces.length > 0) {
    problems.push(`地点缺少上级：${orphanPlaces.length} 条`);
  }

  // 省界回归检查：源数据的环里混有跨省域的直线（海南曾是三角形，
  // 陕西/甘肃/湖北等是一条或几条斜线）。修复见 scripts/roc_ring_repair.py。
  if (id === 'anti-japanese-war') {
    const suspicious = new Set<string>();
    for (const feature of dataset.territories) {
      const ext = feature.properties.extensions ?? {};
      if (ext.kind !== 'admin-boundary') continue;
      const regionId = typeof ext.regionId === 'string' ? ext.regionId : '?';
      const parts =
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      for (const rings of parts) {
        for (const ring of rings) {
          const points = ring.slice(0, -1) as [number, number][];
          if (points.length < 3) continue;
          for (let index = 1; index < ring.length; index += 1) {
            const a = ring[index - 1] as [number, number];
            const b = ring[index] as [number, number];
            const length = distanceKm(a, b);
            if (length <= 80) continue;
            // 判据只看几何，不看长度：真正横跨省域的直线，其中点两侧 20km
            // 都落在本省环内；而真实长直边界（川康界、新疆—苏联界、
            // 宁夏—蒙古沙漠界等）总有一侧在本省之外。
            const offsets = perpendicularOffsets(a, b, 20);
            const cutsThrough =
              offsets !== null &&
              pointInRing(offsets[0], points) &&
              pointInRing(offsets[1], points);
            if (cutsThrough) {
              suspicious.add(`${regionId} ${Math.round(length)}km`);
            }
          }
        }
      }
    }
    if (suspicious.size > 0) {
      const sample = Array.from(suspicious).slice(0, 6).join('、');
      problems.push(`省界存在横跨省域的直线 ${suspicious.size} 处：${sample}`);
    }
  }

  if (problems.length > 0) {
    failed = true;
    console.error(`❌ ${id}: ${problems.join('；')}`);
  } else {
    console.log(
      `✅ ${id}: ${dataset.regions.length} 个地区（${firstLevel.length} 个一级）/ ` +
        `${dataset.events.length} 事件 / ${dataset.routes.length} 路线，归属完整`,
    );
  }
}

if (checked === 0) {
  console.log('ℹ️ 没有启用地区索引的专题，跳过。');
} else if (failed) {
  process.exit(1);
} else {
  console.log(`✅ 地区索引检查通过：${checked} 个专题`);
}
