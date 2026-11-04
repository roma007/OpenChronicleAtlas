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
      locale: 'en',
      entities: ['central-red-army', 'red-4-army'],
      categories: ['重要会议', '会师'],
      from: '1935-01-01',
      to: '1935-12-31',
    });

    expect(params.get('t')).toBe('1935-01-15');
    expect(params.get('event')).toBe('zunyi-1935-01');
    expect(params.get('view')).toBe('106.920000,27.720000,7.00');
    expect(params.get('lang')).toBe('en');
    expect(params.get('entities')).toBe('central-red-army,red-4-army');
    expect(params.get('categories')).toBe('重要会议,会师');

    const decoded = decodeShareState(params);
    expect(decoded?.time).toBe('1935-01-15');
    expect(decoded?.eventId).toBe('zunyi-1935-01');
    expect(decoded?.view?.lng).toBeCloseTo(106.92, 5);
    expect(decoded?.locale).toBe('en');
    expect(decoded?.entities).toEqual(['central-red-army', 'red-4-army']);
    expect(decoded?.categories).toEqual(['重要会议', '会师']);
    expect(decoded?.from).toBe('1935-01-01');
    expect(decoded?.to).toBe('1935-12-31');
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

  it('忽略非法语言/实体/类型/日期', () => {
    const params = new URLSearchParams({
      lang: 'fr',
      entities: 'Bad ID!,central-red-army,Bad ID!',
      categories: '重要会议,,重要会议',
      from: '1935-02-30',
      to: '1935-01-01',
    });
    const decoded = decodeShareState(params);
    expect(decoded?.locale).toBeUndefined();
    expect(decoded?.entities).toEqual(['central-red-army']);
    expect(decoded?.categories).toEqual(['重要会议']);
    expect(decoded?.from).toBeUndefined();
    expect(decoded?.to).toBe('1935-01-01');
  });

  it('to 早于 from 时忽略 to', () => {
    const params = new URLSearchParams({ from: '1935-12-31', to: '1935-01-01' });
    expect(decodeShareState(params)?.to).toBeUndefined();
  });

  it('旧链接只有 t/event/view 仍可解析', () => {
    const params = new URLSearchParams({ t: '1935-01-15', event: 'zunyi-1935-01' });
    const decoded = decodeShareState(params);
    expect(decoded?.time).toBe('1935-01-15');
    expect(decoded?.eventId).toBe('zunyi-1935-01');
  });

  it('空参数返回 null', () => {
    expect(decodeShareState(new URLSearchParams())).toBeNull();
  });
});
