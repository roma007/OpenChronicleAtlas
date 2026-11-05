import { describe, expect, it } from 'vitest';
import { createErrorId, serializeError } from '../observability';

describe('observability', () => {
  it('生成稳定格式的错误编号', () => {
    const id = createErrorId(1_700_000_000_000, () => 0.5);
    expect(id).toMatch(/^ERR-[0-9A-Z]+-[0-9A-Z]{4}$/);
  });

  it('Error 保留 message 与 stack', () => {
    const error = new Error('boom');
    const result = serializeError(error);
    expect(result.message).toBe('boom');
    expect(result.stack).toContain('boom');
  });

  it('非 Error 值转为字符串', () => {
    expect(serializeError('oops')).toEqual({ message: 'oops' });
    expect(serializeError({ code: 1 }).message).toContain('code');
  });
});
