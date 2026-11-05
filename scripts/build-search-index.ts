import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildSearchIndex,
  loadAtlas,
  loadPinyinProvider,
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

const root = path.resolve('data/atlases');
const ids = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const dataSource = new FsDataSource();
const datasets = await Promise.all(
  ids.map((id) => loadAtlas(path.join(root, id, 'manifest.json'), { dataSource })),
);
const fingerprint = createHash('sha256')
  .update(
    JSON.stringify(
      datasets.map((dataset) => ({
        manifest: dataset.manifest,
        routes: dataset.routes,
        events: dataset.events,
      })),
    ),
  )
  .digest('hex')
  .slice(0, 12);

const latestUpdatedAt = datasets
  .map((dataset) => dataset.manifest.updatedAt ?? '')
  .sort()
  .at(-1);
const dataVersion = `${latestUpdatedAt || new Date().toISOString().slice(0, 10)}-${fingerprint}`;

const provider = await loadPinyinProvider();
const index = buildSearchIndex(datasets, provider);
const output = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  dataVersion,
  entries: index.entries,
};
const file = path.join(root, 'search-index.json');
const text = `${JSON.stringify(output)}\n`;
await fs.promises.writeFile(file, text, 'utf8');
const indexPath = path.join(root, 'index.json');
const atlasIndex = JSON.parse(await fs.promises.readFile(indexPath, 'utf8')) as Record<
  string,
  unknown
>;
atlasIndex.dataVersion = dataVersion;
await fs.promises.writeFile(
  indexPath,
  `${JSON.stringify(atlasIndex, null, 2)}\n`,
  'utf8',
);

console.log(
  `✅ 搜索索引：${datasets.length} 个专题 / ${index.entries.length} 条事件 / ${(Buffer.byteLength(text) / 1024).toFixed(1)} KB`,
);
console.log(`✅ 数据版本：${dataVersion}`);
