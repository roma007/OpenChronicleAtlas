import AMapLoader from '@amap/amap-jsapi-loader';

let loaderPromise: Promise<any> | null = null;

/** 加载高德 JS API 2.0（单例），并配置安全密钥。 */
export function loadAMap(): Promise<any> {
  if (loaderPromise) return loaderPromise;

  const isDesktop = import.meta.env.MODE === 'desktop';
  const key = isDesktop
    ? import.meta.env.VITE_AMAP_DESKTOP_KEY || import.meta.env.VITE_AMAP_KEY
    : import.meta.env.VITE_AMAP_KEY;
  const securityJsCode = isDesktop
    ? import.meta.env.VITE_AMAP_DESKTOP_SECURITY_CODE ||
      import.meta.env.VITE_AMAP_SECURITY_CODE
    : import.meta.env.VITE_AMAP_SECURITY_CODE;

  if (!key) {
    return Promise.reject(
      new Error(
        isDesktop
          ? '未配置 VITE_AMAP_DESKTOP_KEY 或 VITE_AMAP_KEY。请在 apps/web/.env.local 中填写桌面端 Key。'
          : '未配置 VITE_AMAP_KEY。请在 apps/web/.env.local 中填写高德 Web 端 Key。',
      ),
    );
  }

  if (securityJsCode) {
    window._AMapSecurityConfig = { securityJsCode };
  }

  loaderPromise = AMapLoader.load({
    key,
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar'],
  }).then((AMap) => {
    window.AMap = AMap;
    return AMap;
  });

  return loaderPromise;
}

/** 自定义地图样式：支持完整 amap://styles/xxx 或只填样式 ID */
export function amapStyleId(): string | undefined {
  const id = import.meta.env.VITE_AMAP_STYLE_ID?.trim();
  if (!id) return undefined;
  return id.startsWith('amap://styles/') ? id : `amap://styles/${id}`;
}
