import { afterEach, describe, expect, it, vi } from 'vitest';
import { publishedClient } from '../src/sanity/client';
import { fetchContent } from '../src/sanity/transport';
import { PreviewExpiredError } from '../src/sanity/types';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('transport isolation', () => {
  it('uses published CDN reads without credentials', () => {
    vi.stubEnv('VITE_SANITY_PROJECT_ID', 'testproject'); vi.stubEnv('VITE_SANITY_DATASET', 'development');
    const config = publishedClient().config();
    expect(config.token).toBeUndefined(); expect(config.useCdn).toBe(true); expect(config.perspective).toBe('published');
    expect(config.apiVersion).toBe('2026-10-01');
  });
  it('sends only registered query names through a same-origin private request', async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: [] })));
    vi.stubGlobal('fetch', request);
    expect(await fetchContent('disciplines', true, new AbortController().signal)).toEqual([]);
    expect(request.mock.calls[0][0]).toBe('/api/preview/content');
    expect(request.mock.calls[0][1]).toMatchObject({ cache: 'no-store', credentials: 'same-origin', body: '{"name":"disciplines","params":{}}' });
  });
  it('distinguishes expiry, upstream failure, and malformed data from an empty result', async () => {
    const request = vi.fn().mockResolvedValueOnce(new Response('', { status: 401 }))
      .mockResolvedValueOnce(new Response('', { status: 502 })).mockResolvedValueOnce(new Response('{}'));
    vi.stubGlobal('fetch', request);
    await expect(fetchContent('disciplines', true, new AbortController().signal)).rejects.toBeInstanceOf(PreviewExpiredError);
    await expect(fetchContent('disciplines', true, new AbortController().signal)).rejects.toThrow('could not be loaded');
    await expect(fetchContent('disciplines', true, new AbortController().signal)).rejects.toThrow('Invalid content response');
  });
});
