const STORAGE_KEY = 'atlas:error-log';
const MAX_ENTRIES = 20;

export interface ClientErrorRecord {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  context: string;
  url: string;
}

/** 生成可读错误编号：ERR-<base36 时间>-<4 位 base36 随机> */
export function createErrorId(
  now: number = Date.now(),
  random: () => number = Math.random,
): string {
  const timePart = now.toString(36).toUpperCase();
  const randomPart = Math.floor(random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0');
  return `ERR-${timePart}-${randomPart}`;
}

export function serializeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

function readLog(): ClientErrorRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ClientErrorRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLog(records: ClientErrorRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records.slice(-MAX_ENTRIES)),
    );
  } catch {
    // sessionStorage 可能被禁用或已满；降级为仅 console。
  }
}

/** 记录客户端错误：console + sessionStorage，不发送网络请求 */
export function reportClientError(
  error: unknown,
  context = 'unknown',
): ClientErrorRecord {
  const { message, stack } = serializeError(error);
  const record: ClientErrorRecord = {
    id: createErrorId(),
    timestamp: new Date().toISOString(),
    message,
    stack,
    context,
    url: typeof window === 'undefined' ? '' : window.location.href,
  };

  console.error(`[atlas:${record.id}] ${context}`, error);

  const records = readLog();
  records.push(record);
  writeLog(records);

  return record;
}

export function getRecentClientErrors(): ClientErrorRecord[] {
  return readLog();
}

/** 安装全局 error / unhandledrejection 监听，返回清理函数 */
export function installGlobalErrorHandlers(): () => void {
  if (typeof window === 'undefined') return () => {};

  const onError = (event: ErrorEvent) => {
    reportClientError(event.error ?? event.message, 'window.error');
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    reportClientError(event.reason, 'window.unhandledrejection');
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);

  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
