import { describe, expect, it, vi } from 'vitest';
import { HttpDataSource } from '../data/source';

describe('HttpDataSource', () => {
  it('requests data with cache: no-cache so releases are visible immediately', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      text: async () => '{}',
    })) as unknown as typeof fetch;
    const source = new HttpDataSource(fetchImpl);

    await source.readText('https://example.com/data.json');

    expect(fetchImpl).toHaveBeenCalledWith('https://example.com/data.json', {
      cache: 'no-cache',
    });
  });
});
