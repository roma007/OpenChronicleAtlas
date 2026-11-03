import { describe, expect, it } from 'vitest';
import { gcj02ToWgs84, outOfChina, wgs84ToGcj02 } from '../geo/coordinate';

describe('坐标转换', () => {
  it('境外坐标不偏移', () => {
    expect(outOfChina(2.3522, 48.8566)).toBe(true);
    expect(wgs84ToGcj02(2.3522, 48.8566)).toEqual({ lng: 2.3522, lat: 48.8566 });
  });

  it('北京坐标产生数百米级偏移', () => {
    const wgs = { lng: 116.397428, lat: 39.90923 };
    const gcj = wgs84ToGcj02(wgs.lng, wgs.lat);
    expect(gcj.lng).toBeGreaterThan(wgs.lng);
    expect(gcj.lat).toBeGreaterThan(wgs.lat);
    expect(gcj.lng - wgs.lng).toBeGreaterThan(0.001);
    expect(gcj.lng - wgs.lng).toBeLessThan(0.01);
  });

  it('WGS84 → GCJ-02 → WGS84 往返误差小于 1e-6 度', () => {
    const points = [
      [116.397428, 39.90923],
      [121.473701, 31.230416],
      [87.616848, 43.825592],
      [106.92, 27.72],
    ];

    for (const [lng, lat] of points) {
      const gcj = wgs84ToGcj02(lng!, lat!);
      const back = gcj02ToWgs84(gcj.lng, gcj.lat);
      expect(Math.abs(back.lng - lng!)).toBeLessThan(1e-6);
      expect(Math.abs(back.lat - lat!)).toBeLessThan(1e-6);
    }
  });
});
