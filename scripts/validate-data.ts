import fs from 'node:fs';
import path from 'node:path';
import {
  AtlasDataError,
  loadAtlas,
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
const entries = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = 0;
let totalEvents = 0;
let totalSegments = 0;

for (const id of entries) {
  const manifestPath = path.join(root, id, 'manifest.json');
  try {
    const dataset = await loadAtlas(manifestPath, { dataSource: new FsDataSource() });
    totalEvents += dataset.events.length;
    totalSegments += dataset.routes.length;

    const warnings = dataset.warnings.length;
    console.log(
      `✅ ${id}: ${dataset.events.length} 事件 / ${dataset.routes.length} 路线段` +
        `${warnings > 0 ? ` / ${warnings} warning` : ''}`,
    );
    for (const warning of dataset.warnings) {
      console.log(`   ⚠️  ${warning.path}: ${warning.message}`);
    }
  } catch (error) {
    failed += 1;
    if (error instanceof AtlasDataError) {
      console.error(`❌ ${id}: ${error.message}`);
      if ('issues' in error && Array.isArray(error.issues)) {
        for (const issue of error.issues) {
          console.error(`   - ${issue.path}: ${issue.message}`);
        }
      }
    } else {
      console.error(`❌ ${id}:`, error);
    }
  }
}

console.log(`\n共 ${entries.length} 个专题，${totalEvents} 个事件，${totalSegments} 段路线。`);
process.exit(failed > 0 ? 1 : 0);
