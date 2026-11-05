import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(rootDir, '../../data');
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, '../../package.json'), 'utf8'),
) as { version: string };

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
  plugins: [
    react(),
    atlasDataPlugin(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        name: '史迹 · 时空地图',
        short_name: '史迹',
        description:
          '以地图与时间轴浏览历史专题的路线、事件与时空演变。',
        lang: 'zh-CN',
        theme_color: '#231c15',
        background_color: '#f3ead9',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/data\//, /^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/data\/atlases\/.*\.(json|geojson)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'atlas-data',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/data\/atlases\/.*\.(png|jpe?g|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'atlas-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/webapi\.amap\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'amap-js',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/(webrd|webst)0[1-4]\.is\.autonavi\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'amap-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/jsapi-data\d*\.amap\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'amap-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/o\d*\.amap\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'amap-tiles',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/jsapi-service\.amap\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'amap-js',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    port: 5173,
  },
});
