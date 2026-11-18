import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 给专题封面写入 GB 45438-2025 / TC260 的 AIGC 隐式标识，并校验。
 *
 *   pnpm apply:aigc   # 写入 / 更新元数据，按 MD5 重命名封面，并同步 manifest / index
 *   pnpm check:aigc   # 只校验（validate:data 会调用）
 *
 * 隐式标识使用 XMP：命名空间 http://www.tc260.org.cn/ns/AIGC/1.0/，
 * 字段 TC260:AIGC，值为包含 Label / ContentProducer / ProduceID /
 * ContentPropagator / PropagateID 等字段的 JSON 字符串。
 */

const atlasRoot = path.resolve('data/atlases');
const registryPath = path.join(atlasRoot, 'ai-content.json');
const indexPath = path.join(atlasRoot, 'index.json');
const apply = process.argv.includes('--apply');
const today = new Date().toISOString().slice(0, 10);

const XMP_HEADER = Buffer.concat([
  Buffer.from('http://ns.adobe.com/xap/1.0/', 'ascii'),
  Buffer.from([0]),
]);

interface CoverEntry {
  atlasId: string;
  file: string;
  tool: string;
  generatedAt: string;
  watermark: string;
  watermarkRetained: boolean;
  implicitLabel: string;
}

interface Registry {
  schemaVersion: string;
  updatedAt: string;
  policy: string;
  contentProducer: string;
  contentPropagator: string;
  explicitLabel: string;
  covers: CoverEntry[];
}

interface ManifestFile {
  file: string;
  json: Record<string, unknown>;
  cover: string;
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

function writeJson(file: string, value: unknown): void {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function jpegSize(buffer: Buffer): { width: number; height: number } | null {
  let i = 2;
  while (i + 9 < buffer.length) {
    if (buffer[i] !== 0xff) return null;
    const marker = buffer[i + 1]!;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0xda || marker === 0xd9 || marker === 0x00) return null;
    const length = buffer.readUInt16BE(i + 2);
    if (length < 2) return null;
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: buffer.readUInt16BE(i + 5),
        width: buffer.readUInt16BE(i + 7),
      };
    }
    i += 2 + length;
  }
  return null;
}

function readXmp(buffer: Buffer): string | null {
  let i = 2;
  while (i + 4 <= buffer.length) {
    if (buffer[i] !== 0xff) return null;
    const marker = buffer[i + 1]!;
    if (marker === 0xda || marker === 0xd9) return null;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const length = buffer.readUInt16BE(i + 2);
    const end = i + 2 + length;
    if (length < 2 || end > buffer.length) return null;
    if (marker === 0xe1) {
      const payload = buffer.subarray(i + 4, end);
      if (payload.subarray(0, XMP_HEADER.length).equals(XMP_HEADER)) {
        return payload.subarray(XMP_HEADER.length).toString('utf8');
      }
    }
    i = end;
  }
  return null;
}

function stripXmp(buffer: Buffer): Buffer {
  const parts: Buffer[] = [buffer.subarray(0, 2)];
  let i = 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xff) {
      parts.push(buffer.subarray(i));
      break;
    }
    const marker = buffer[i + 1]!;
    if (marker === 0xda) {
      parts.push(buffer.subarray(i));
      break;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(buffer.subarray(i, i + 2));
      i += 2;
      continue;
    }
    if (i + 4 > buffer.length) {
      parts.push(buffer.subarray(i));
      break;
    }
    const length = buffer.readUInt16BE(i + 2);
    const end = i + 2 + length;
    if (length < 2 || end > buffer.length) {
      parts.push(buffer.subarray(i));
      break;
    }
    const payload = buffer.subarray(i + 4, end);
    if (marker === 0xe1 && payload.subarray(0, XMP_HEADER.length).equals(XMP_HEADER)) {
      i = end;
      continue;
    }
    parts.push(buffer.subarray(i, end));
    i = end;
  }
  return Buffer.concat(parts);
}

function xmpInsertOffset(buffer: Buffer): number {
  let i = 2;
  if (buffer.length >= 4 && buffer[i] === 0xff && buffer[i + 1] === 0xe0) {
    const length = buffer.readUInt16BE(i + 2);
    if (length >= 2) i += 2 + length;
  }
  return i;
}

function buildAigcValue(atlasId: string, registry: Registry): Record<string, string> {
  return {
    Label: '1',
    ContentProducer: registry.contentProducer,
    ProduceID: `atlas-cover-${atlasId}`,
    ReservedCode1: '',
    ContentPropagator: registry.contentPropagator,
    PropagateID: `atlas-cover-${atlasId}`,
    ReservedCode2: '',
  };
}

function buildXmpPacket(value: Record<string, string>): string {
  const json = JSON.stringify(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return [
    '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="OpenChronicleAtlas AIGC labeler">',
    ' <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '  <rdf:Description rdf:about="" xmlns:TC260="http://www.tc260.org.cn/ns/AIGC/1.0/">',
    `   <TC260:AIGC>${json}</TC260:AIGC>`,
    '  </rdf:Description>',
    ' </rdf:RDF>',
    '</x:xmpmeta>',
    '<?xpacket end="w"?>',
  ].join('\n');
}

function injectXmp(buffer: Buffer, packet: string): Buffer {
  const stripped = stripXmp(buffer);
  const payload = Buffer.concat([XMP_HEADER, Buffer.from(packet, 'utf8')]);
  const segment = Buffer.alloc(4);
  segment[0] = 0xff;
  segment[1] = 0xe1;
  segment.writeUInt16BE(payload.length + 2, 2);
  const offset = xmpInsertOffset(stripped);
  return Buffer.concat([stripped.subarray(0, offset), segment, payload, stripped.subarray(offset)]);
}

function md5(buffer: Buffer): string {
  return createHash('md5').update(buffer).digest('hex');
}

function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function readAigcValue(xmp: string | null): Record<string, string> | null {
  if (!xmp) return null;
  const match = /<TC260:AIGC>([\s\S]*?)<\/TC260:AIGC>/.exec(xmp);
  if (!match) return null;
  try {
    return JSON.parse(decodeXml(match[1]!)) as Record<string, string>;
  } catch {
    return null;
  }
}

function loadManifests(): ManifestFile[] {
  return fs
    .readdirSync(atlasRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .flatMap((atlasId) => {
      const file = path.join(atlasRoot, atlasId, 'manifest.json');
      const json = readJson<Record<string, unknown>>(file);
      const cover = typeof json.cover === 'string' ? json.cover : null;
      return cover ? [{ file, json, cover }] : [];
    });
}

function relativeCover(atlasId: string, filename: string): string {
  return `${atlasId}/assets/${filename}`;
}

function expectedEntry(entry: CoverEntry, registry: Registry): Record<string, string> {
  return buildAigcValue(entry.atlasId, registry);
}

function sameValue(actual: Record<string, string> | null, expected: Record<string, string>): boolean {
  if (!actual) return false;
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
}

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const registry = readJson<Registry>(registryPath);
const manifests = loadManifests();
const entriesByAtlas = new Map(registry.covers.map((entry) => [entry.atlasId, entry]));

if (!apply) {
  const errors: string[] = [];

  for (const manifest of manifests) {
    const atlasId = path.basename(path.dirname(manifest.file));
    const entry = entriesByAtlas.get(atlasId);
    if (!entry) {
      errors.push(`${atlasId}: ai-content.json 缺少封面登记`);
      continue;
    }

    const imagePath = path.join(atlasRoot, atlasId, manifest.cover);
    if (!fs.existsSync(imagePath)) {
      errors.push(`${atlasId}: 封面文件不存在 ${manifest.cover}`);
      continue;
    }

    const buffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    if (!entry.watermarkRetained || !entry.watermark) {
      errors.push(`${atlasId}: 未声明保留「${registry.explicitLabel}」水印`);
    }
    if (entry.file !== relativeCover(atlasId, filename)) {
      errors.push(
        `${atlasId}: ai-content.json 记录 ${entry.file}，manifest 指向 ${relativeCover(atlasId, filename)}`,
      );
    }
    if (filename !== `cover-${md5(buffer).slice(0, 8)}.jpg`) {
      errors.push(`${atlasId}: 文件名不是内容哈希 cover-<md5>.jpg（${filename}）`);
    }

    const size = jpegSize(buffer);
    if (!size || size.width !== 1600 || size.height !== 900) {
      errors.push(`${atlasId}: 封面尺寸应为 1600×900，实际 ${size ? `${size.width}×${size.height}` : '无法读取'}`);
    }

    const actual = readAigcValue(readXmp(buffer));
    if (!sameValue(actual, expectedEntry(entry, registry))) {
      errors.push(`${atlasId}: 缺少或不符合 TC260:AIGC 隐式标识，请运行 pnpm apply:aigc`);
    }
  }

  for (const entry of registry.covers) {
    if (!manifests.some((manifest) => path.basename(path.dirname(manifest.file)) === entry.atlasId)) {
      errors.push(`${entry.atlasId}: ai-content.json 登记了不存在的专题`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`   - ${error}`);
    fail(`AIGC 标识校验失败（${errors.length} 项）`);
  }

  console.log(`✅ AIGC 标识校验通过：${manifests.length} 张封面，水印与 TC260:AIGC 元数据齐全`);
  process.exit(0);
}

const atlasIndex = readJson<{ atlases: Array<Record<string, unknown>> }>(indexPath);
let changed = 0;

for (const manifest of manifests) {
  const atlasId = path.basename(path.dirname(manifest.file));
  const oldImagePath = path.join(atlasRoot, atlasId, manifest.cover);
  if (!fs.existsSync(oldImagePath)) fail(`${atlasId}: 封面文件不存在 ${manifest.cover}`);

  let entry = entriesByAtlas.get(atlasId);
  if (!entry) {
    entry = {
      atlasId,
      file: `${atlasId}/${manifest.cover}`,
      tool: '豆包 AI',
      generatedAt: today,
      watermark: registry.explicitLabel,
      watermarkRetained: true,
      implicitLabel: 'TC260:AIGC',
    };
    registry.covers.push(entry);
    entriesByAtlas.set(atlasId, entry);
  }

  const buffer = fs.readFileSync(oldImagePath);
  const next = injectXmp(buffer, buildXmpPacket(buildAigcValue(atlasId, registry)));
  const filename = `cover-${md5(next).slice(0, 8)}.jpg`;
  const newImagePath = path.join(atlasRoot, atlasId, 'assets', filename);

  if (!fs.existsSync(newImagePath) || !next.equals(fs.readFileSync(newImagePath))) {
    fs.writeFileSync(newImagePath, next);
    changed += 1;
  }
  if (newImagePath !== oldImagePath && fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }

  const nextCover = `assets/${filename}`;
  if (manifest.cover !== nextCover) {
    manifest.json.cover = nextCover;
    if (typeof manifest.json.updatedAt === 'string') manifest.json.updatedAt = today;
    writeJson(manifest.file, manifest.json);
  }

  const nextRelative = relativeCover(atlasId, filename);
  if (entry.file !== nextRelative) entry.file = nextRelative;
  if (!entry.watermarkRetained) entry.watermarkRetained = true;
  if (!entry.watermark) entry.watermark = registry.explicitLabel;

  const indexed = atlasIndex.atlases.find((atlas) => atlas.id === atlasId);
  if (indexed && indexed.cover !== nextRelative) {
    indexed.cover = nextRelative;
  }
}

registry.updatedAt = today;
writeJson(registryPath, registry);
writeJson(indexPath, atlasIndex);

console.log(
  `✅ AIGC 标识已写入：${manifests.length} 张封面${changed > 0 ? `，${changed} 张有变化` : '，无需改动'}`,
);
