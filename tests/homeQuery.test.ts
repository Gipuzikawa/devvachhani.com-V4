import { describe, expect, it } from 'vitest';
import { parseQueryRequest, validResult } from '../src/sanity/queryRegistry';

describe('Home query transport', () => {
  it('allowlists one query without parameters or client-selected perspectives', () => {
    expect(parseQueryRequest({ name: 'homePage' })).toEqual({ name: 'homePage', params: {} });
    expect(() => parseQueryRequest({ name: 'homePage', params: { slug: 'anything' } })).toThrow('accepts no parameters');
    expect(() => parseQueryRequest({ name: 'homePage', perspective: 'raw' })).toThrow('Unknown query');
  });

  it('accepts an absent singleton and rejects malformed response envelopes', () => {
    expect(validResult('homePage', { settings: [], order: [] })).toBe(true);
    expect(validResult('homePage', { settings: [{}], order: [] })).toBe(true);
    expect(validResult('homePage', { settings: [] })).toBe(false);
    expect(validResult('homePage', null)).toBe(false);
  });
});
