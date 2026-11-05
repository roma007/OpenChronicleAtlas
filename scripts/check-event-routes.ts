import fs from 'node:fs';
import path from 'node:path';
import {
  AtlasDataError,
  checkDatasetRoutes,
  loadAtlas,
  resolveLocalized,
  type DataSource,
  type RouteQaIssue,
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
  thresholdKm: number;
  json: boolean;
}

function printUsage(): void {
  console.log(`用法：pnpm check:routes [选项]

选项：
  --atlas <id>       只检查指定专题，如 anti-japanese-war
  --threshold <km>   距离阈值，默认 30
  --json             以 JSON 输出
  -h, --help         显示帮助`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { thresholdKm: 30, json: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--atlas') {
      options.atlas = argv[++i];
      if (!options.atlas) throw new Error('--atlas 需要专题 id');
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

  return options;
}

function formatIssue(issue: RouteQaIssue): string {
  const name = resolveLocalized(issue.eventName, 'zh');
  const range =
    issue.startDate === issue.endDate
      ? issue.startDate
      : `${issue.startDate} → ${issue.endDate}`;

  if (issue.kind === 'no-active-route') {
    return `${issue.eventId}「${name}」[${issue.entityId}] ${range}：无活动路线`;
  }

  return `${issue.eventId}「${name}」[${issue.entityId}] ${range}：${issue.distanceKm?.toFixed(0)}km > ${issue.thresholdKm}km`;
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

const ids = options.atlas ? allIds.filter((id) => id === options.atlas) : allIds;

if (ids.length === 0) {
  console.error(`❌ 未找到专题：${options.atlas ?? '(全部)'}`);
  process.exit(2);
}

const summaries: Array<{
  id: string;
  events: number;
  routes: number;
  issues: number;
}> = [];
const allIssues: RouteQaIssue[] = [];
let failed = 0;

for (const id of ids) {
  try {
    const dataset = await loadAtlas(path.join(root, id, 'manifest.json'), {
      dataSource,
    });
    const issues = checkDatasetRoutes(dataset, {
      thresholdKm: options.thresholdKm,
    });

    summaries.push({
      id,
      events: dataset.events.length,
      routes: dataset.routes.length,
      issues: issues.length,
    });
    allIssues.push(...issues);
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
      {
        thresholdKm: options.thresholdKm,
        atlases: summaries,
        issues: allIssues,
        failed,
      },
      null,
      2,
    ),
  );
} else {
  for (const summary of summaries) {
    const mark = summary.issues === 0 ? '✅' : '❌';
    console.log(
      `${mark} ${summary.id}: ${summary.events} 事件 / ${summary.routes} 路线段，${summary.issues} 个问题`,
    );
  }

  if (allIssues.length > 0) {
    console.log('');
    for (const issue of allIssues) {
      console.log(`   - ${formatIssue(issue)}`);
    }
  }

  const totalEvents = summaries.reduce((sum, item) => sum + item.events, 0);
  const totalRoutes = summaries.reduce((sum, item) => sum + item.routes, 0);
  console.log(
    `\n共 ${summaries.length} 个专题，${totalEvents} 个事件，${totalRoutes} 段路线，${allIssues.length} 个问题（阈值 ${options.thresholdKm}km）。`,
  );
}

process.exit(failed > 0 || allIssues.length > 0 ? 1 : 0);
