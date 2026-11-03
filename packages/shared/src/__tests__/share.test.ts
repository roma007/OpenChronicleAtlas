import { describe, expect, it } from 'vitest';
import {
  buildShareUrl,
  decodeShareState,
  encodeShareState,
} from '../share/state';

describe('share state', () => {
  it('编码与解码往返', () => {
    const params = encodeShareState({
      time: '1935-01-15',
      eventId: 'zunyi-1935-01',
      view: { lng: 106.92, lat: 27.72, zoom: 7 },
    });

    expect(params.get('t')).toBe('1935-01-15');
    expect(params.get('event')).toBe('zunyi-1935-01');
    expect(params.get('view')).toBe('106.920000,27.720000,7.00');

    const decoded = decodeShareState(params);
    expect(decoded?.time).toBe('1935-01-15');
    expect(decoded?.eventId).toBe('zunyi-1935-01');
    expect(decoded?.view?.lng).toBeCloseTo(106.92, 5);
  });

  it('忽略非法日期/事件/视野', () => {
    const params = new URLSearchParams({
      t: '1935-02-30',
      event: 'Bad Event!',
      view: '999,999,99',
    });
    expect(decodeShareState(params)).toBeNull();
  });

  it('部分字段合法时保留合法字段', () => {
    const params = new URLSearchParams({ t: '1935-01-15', event: 'Bad Event!' });
    const decoded = decodeShareState(params);
    expect(decoded?.time).toBe('1935-01-15');
    expect(decoded?.eventId).toBeUndefined();
  });

  it('生成完整分享链接', () => {
    const url = buildShareUrl('https://atlas.example.com', 'long-march', {
      time: '1935-01-15',
      eventId: 'zunyi-1935-01',
      view: { lng: 106.92, lat: 27.72, zoom: 7 },
    });

    expect(url.startsWith('https://atlas.example.com/atlas/long-march?')).toBe(true);
    const parsed = new URL(url);
    expect(parsed.searchParams.get('t')).toBe('1935-01-15');
    expect(parsed.searchParams.get('event')).toBe('zunyi-1935-01');
  });

  it('空参数返回 null', () => {
    expect(decodeShareState(new URLSearchParams())).toBeNull();
  });
});
