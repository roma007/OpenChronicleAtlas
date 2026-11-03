declare module '@amap/amap-jsapi-loader' {
  export interface AMapLoaderOptions {
    key: string;
    version: string;
    plugins?: string[];
  }

  const AMapLoader: {
    load(options: AMapLoaderOptions): Promise<any>;
  };

  export default AMapLoader;
}
