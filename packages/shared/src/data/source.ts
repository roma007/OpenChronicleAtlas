/**
 * 数据源抽象：Web 用 fetch，Node 校验脚本用 fs，RN 可复用 fetch。
 * 所有方法只处理字符串路径，不关心运行时。
 */
export interface DataSource {
  readText(path: string): Promise<string>;
  /** 把相对路径解析到 baseDir（目录）下 */
  resolve(baseDir: string, relative: string): string;
  /** 返回文件所在目录 */
  dirname(file: string): string;
}

export class AtlasDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AtlasDataError';
  }
}

export class HttpDataSource implements DataSource {
  private readonly fetchImpl: typeof fetch;

  constructor(fetchImpl: typeof fetch = fetch) {
    // 必须绑定 globalThis：浏览器中把 fetch 存为实例属性后再以方法调用会抛 Illegal invocation
    this.fetchImpl = fetchImpl.bind(globalThis);
  }

  async readText(path: string): Promise<string> {
    const res = await this.fetchImpl(this.toAbsolute(path));
    if (!res.ok) {
      throw new AtlasDataError(`加载失败 ${path}: HTTP ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  resolve(baseDir: string, relative: string): string {
    const base = this.toAbsolute(baseDir);
    return new URL(relative, base.endsWith('/') ? base : `${base}/`).toString();
  }

  dirname(file: string): string {
    return new URL('.', this.toAbsolute(file)).toString();
  }

  /** 浏览器中把相对路径补全为绝对 URL；非浏览器环境要求绝对 URL。 */
  private toAbsolute(path: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
    const base =
      typeof globalThis.location !== 'undefined' ? globalThis.location.href : undefined;
    if (!base) {
      throw new AtlasDataError(
        `无法解析相对路径 "${path}"：当前环境没有 location，请传入绝对 URL 或使用自定义 DataSource`,
      );
    }
    return new URL(path, base).toString();
  }
}
