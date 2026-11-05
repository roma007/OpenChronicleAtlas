import { describe, expect, it } from 'vitest';
import { isDataVersionNewer } from '../data/version';

describe('isDataVersionNewer', () => {
  it('任一版本为空时不提示', () => {
    expect(isDataVersionNewer(null, '2026-11-05-abc')).toBe(false);
    expect(isDataVersionNewer('2026-11-05-abc', null)).toBe(false);
    expect(isDataVersionNewer(undefined, undefined)).toBe(false);
  });

  it('版本相同不提示', () => {
    expect(isDataVersionNewer('2026-11-05-abc', '2026-11-05-abc')).toBe(false);
  });

  it('版本不同时提示', () => {
    expect(isDataVersionNewer('2026-11-05-abc', '2026-11-05-def')).toBe(true);
  });
});
