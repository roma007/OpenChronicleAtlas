/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAP_KEY?: string;
  readonly VITE_AMAP_SECURITY_CODE?: string;
  readonly VITE_AMAP_DESKTOP_KEY?: string;
  readonly VITE_AMAP_DESKTOP_SECURITY_CODE?: string;
  readonly VITE_AMAP_STYLE_ID?: string;
  readonly VITE_DATA_BASE_URL?: string;
  readonly VITE_SHARE_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  _AMapSecurityConfig?: { securityJsCode: string };
  AMap?: any;
}

declare const __APP_VERSION__: string;
