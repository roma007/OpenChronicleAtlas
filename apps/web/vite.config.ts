import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(rootDir, '../../data');

const MIME: Record<string, string> = {
  '.json': 'application/json; charset=utf-8',
  '.geojson': 'application/geo+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** 开发时把 /data 映射到仓库根 data/；构建时拷贝到 dist/data。 */
function atlasDataPlugin(): Plugin {
  return {
    name: 'atlas-data',
    configureServer(server) {
      server.middlewares.use('/data', (req, res, next) => {
        const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
        const file = path.join(dataDir, urlPath);

        if (!file.startsWith(`${dataDir}${path.sep}`) || !fs.existsSync(file)) {
          next();
          return;
        }
        if (fs.statSync(file).isDirectory()) {
          next();
          return;
        }

        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      const out = path.resolve(rootDir, 'dist/data');
      fs.rmSync(out, { recursive: true, force: true });
      fs.cpSync(dataDir, out, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), atlasDataPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    port: 5173,
  },
});
