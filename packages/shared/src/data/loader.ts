import type {
  AtlasDataset,
  AtlasEvent,
  AtlasIndex,
  AtlasIssue,
  AtlasManifest,
  AtlasRouteFeature,
} from '../types';
import {
  atlasIndexSchema,
  eventSchema,
  manifestSchema,
  routeFileSchema,
} from '../schema/atlas';
import { validateCrossFile } from '../schema/validate';
import type { SearchIndexFile } from '../search/types';
import { HttpDataSource, AtlasDataError, type DataSource } from './source';

export { AtlasDataError };

export class AtlasValidationError extends AtlasDataError {
  constructor(public readonly issues: AtlasIssue[]) {
    const errors = issues.filter((i) => i.level === 'error').length;
    super(`专题数据校验失败（${errors} 项 error）`);
    this.name = 'AtlasValidationError';
  }
}

export interface LoadAtlasOptions {
  dataSource?: DataSource;
  /** 预留：多语言完整性校验 */
  locale?: string;
  onWarning?: (issue: AtlasIssue) => void;
}

const SUPPORTED_MAJOR = 1;

function toIssues(error: unknown, prefix: string): AtlasIssue[] {
  if (
    typeof error === 'object' &&
    error !== null &&
    'issues' in error &&
    Array.isArray((error as { issues: unknown[] }).issues)
  ) {
    return (error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues.map(
      (issue) => ({
        level: 'error' as const,
        path: [prefix, ...issue.path.map(String)].filter(Boolean).join('.'),
        message: issue.message,
      }),
    );
  }

  return [
    {
      level: 'error',
      path: prefix,
      message: error instanceof Error ? error.message : String(error),
    },
  ];
}

async function readJson(dataSource: DataSource, path: string): Promise<unknown> {
  const text = await dataSource.readText(path);
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new AtlasDataError(`${path} 不是合法 JSON：${(error as Error).message}`);
  }
}

function assertSchemaVersion(manifest: AtlasManifest): AtlasIssue[] {
  const major = Number(manifest.schemaVersion.split('.')[0]);
  if (major !== SUPPORTED_MAJOR) {
    return [
      {
        level: 'error',
        path: 'manifest.schemaVersion',
        message: `不支持的 schemaVersion ${manifest.schemaVersion}，客户端仅支持 ${SUPPORTED_MAJOR}.x`,
      },
    ];
  }
  return [];
}

export async function loadAtlas(
  manifestUrl: string,
  options: LoadAtlasOptions = {},
): Promise<AtlasDataset> {
  const dataSource = options.dataSource ?? new HttpDataSource();
  const issues: AtlasIssue[] = [];

  const manifestParsed = manifestSchema.safeParse(await readJson(dataSource, manifestUrl));
  if (!manifestParsed.success) {
    throw new AtlasValidationError(toIssues(manifestParsed.error, 'manifest'));
  }
  const manifest = manifestParsed.data as AtlasManifest;

  issues.push(...assertSchemaVersion(manifest));

  const baseDir = dataSource.dirname(manifestUrl);

  const routeFiles = await Promise.all(
    manifest.routes.map((routePath) => readJson(dataSource, dataSource.resolve(baseDir, routePath))),
  );

  const eventFiles = await Promise.all(
    manifest.events.map((eventPath) => readJson(dataSource, dataSource.resolve(baseDir, eventPath))),
  );

  const routes: AtlasRouteFeature[] = [];
  routeFiles.forEach((file, index) => {
    const parsed = routeFileSchema.safeParse(file);
    if (!parsed.success) {
      issues.push(...toIssues(parsed.error, `routes[${index}]`));
      return;
    }
    routes.push(...(parsed.data.features as AtlasRouteFeature[]));
  });

  const events: AtlasEvent[] = [];
  eventFiles.forEach((file, index) => {
    const parsed = eventSchema.array().safeParse(file);
    if (!parsed.success) {
      issues.push(...toIssues(parsed.error, `events[${index}]`));
      return;
    }
    events.push(...(parsed.data as AtlasEvent[]));
  });

  issues.push(...validateCrossFile(manifest, routes, events));

  const errors = issues.filter((issue) => issue.level === 'error');
  if (errors.length > 0) {
    throw new AtlasValidationError(errors);
  }

  const warnings = issues.filter((issue) => issue.level === 'warning');
  warnings.forEach((issue) => options.onWarning?.(issue));

  events.sort((a, b) => a.date.localeCompare(b.date));

  const eventsById = new Map(events.map((event) => [event.id, event]));
  const entitiesById = new Map(manifest.entities.map((entity) => [entity.id, entity]));

  const eventsByEntity = new Map<string, AtlasEvent[]>();
  for (const event of events) {
    for (const entityId of event.entityIds) {
      const list = eventsByEntity.get(entityId) ?? [];
      list.push(event);
      eventsByEntity.set(entityId, list);
    }
  }
  for (const list of eventsByEntity.values()) {
    list.sort((a, b) => a.date.localeCompare(b.date));
  }

  return {
    manifest,
    routes,
    events,
    eventsById,
    entitiesById,
    eventsByEntity,
    warnings,
  };
}

export async function loadAtlasIndex(
  indexUrl: string,
  options: LoadAtlasOptions = {},
): Promise<AtlasIndex> {
  const dataSource = options.dataSource ?? new HttpDataSource();
  const parsed = atlasIndexSchema.safeParse(await readJson(dataSource, indexUrl));
  if (!parsed.success) {
    throw new AtlasValidationError(toIssues(parsed.error, 'index'));
  }
  return parsed.data as AtlasIndex;
}

/** 加载构建期搜索索引；只做最小结构校验 */
export async function loadSearchIndex(
  indexUrl: string,
  options: LoadAtlasOptions = {},
): Promise<SearchIndexFile> {
  const dataSource = options.dataSource ?? new HttpDataSource();
  const raw = await readJson(dataSource, indexUrl);
  if (
    typeof raw !== 'object' ||
    raw === null ||
    !Array.isArray((raw as { entries?: unknown }).entries)
  ) {
    throw new AtlasDataError('搜索索引格式错误：缺少 entries 数组');
  }
  return raw as SearchIndexFile;
}
