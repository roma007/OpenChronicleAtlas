import fs from 'node:fs';
import path from 'node:path';
import { loadAtlas, type DataSource } from '../packages/shared/src/index.ts';

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
