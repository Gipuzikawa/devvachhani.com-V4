import { describe, expect, it, vi } from 'vitest';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createHmac } from 'node:crypto';
import { issueSession, verifySession, SESSION_SECONDS, sessionCookie, readCookie, COOKIE_NAME } from '../server/preview/session';
import { safeRedirect } from '../server/preview/redirect';
import { createHandler } from '../server/preview/handlers';
import { getConfig, type PreviewConfig } from '../server/config';
import { parseQueryRequest } from '../src/sanity/queryRegistry';

const config: PreviewConfig = { projectId: 'testproject', dataset: 'development', origin: 'https://portfolio.example',
  token: 'server-only-test-token', secret: 'a'.repeat(64) };
const cookie = () => `${COOKIE_NAME}=${issueSession(config)}`;

describe('signed preview sessions', () => {
  it('expires at one hour, rejects tampering, rotation and a different project/dataset', () => {
    const now = 1_800_000_000_000;
    const token = issueSession(config, now);
    expect(verifySession(token, config, now)).toBe(true);
    expect(verifySession(token, config, now + SESSION_SECONDS * 1000)).toBe(false);
    expect(verifySession(token, config, now - 1000)).toBe(false);
    expect(verifySession(`${token.slice(0, -2)}xx`, config, now)).toBe(false);
    expect(verifySession(token, { ...config, secret: 'b'.repeat(64) }, now)).toBe(false);
    expect(verifySession(token, { ...config, dataset: 'production' }, now)).toBe(false);
    expect(verifySession(token, { ...config, projectId: 'other' }, now)).toBe(false);
    expect(verifySession('drafts', config, now)).toBe(false);
  });
  it('rejects a correctly signed but unsupported perspective or payload shape', () => {
    const token = issueSession(config);
    const value = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    for (const changed of [{ ...value, perspective: 'raw' }, { ...value, extra: true }, { ...value, exp: value.exp + 1 }]) {
      const payload = Buffer.from(JSON.stringify(changed)).toString('base64url');
      const sig = createHmac('sha256', config.secret).update(payload).digest('base64url');
      expect(verifySession(`${payload}.${sig}`, config)).toBe(false);
    }
  });
  it('uses a host-only Secure HttpOnly cookie and rejects duplicate cookies', () => {
    expect(sessionCookie('test')).toContain('Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600');
    expect(sessionCookie('test')).not.toContain('Domain=');
    expect(sessionCookie('', true)).toContain('Max-Age=0');
    expect(readCookie(`${COOKIE_NAME}=one; ${COOKIE_NAME}=two`)).toBeUndefined();
  });
});

describe('redirect and query boundaries', () => {
  it.each(['//evil.example', 'https://evil.example', '/\\evil', '/work/%2fadmin', '/studio', '/api/preview/content', '/unknown', '/work/x/extra'])('rejects %s', value => {
    expect(() => safeRedirect(value, config.origin)).toThrow();
  });
  it('permits six route shapes and strips secret-bearing query parameters', () => {
    for (const path of ['/', '/about', '/work', '/work/f35', '/writing', '/writing/build-log']) {
      expect(safeRedirect(`${path}?sanity-preview-secret=sensitive#overview`, config.origin)).toBe(`${path}#overview`);
    }
  });
  it.each([{}, { name: '__proto__' }, { name: 'disciplines', query: '*[]' },
    { name: 'disciplines', params: { dataset: 'production' } }, { name: 'disciplines', perspective: 'raw' },
    { name: 'disciplines', params: [] }])('rejects query overrides %j', value => {
    expect(() => parseQueryRequest(value)).toThrow();
  });
  it('fails closed without real server configuration', () => {
    expect(() => getConfig({})).toThrow();
    expect(() => getConfig({ SANITY_PROJECT_ID: 'test', SANITY_DATASET: 'development', SITE_ORIGIN: 'http://unsafe',
      SANITY_API_READ_TOKEN: config.token, PREVIEW_SESSION_SECRET: config.secret })).toThrow();
  });
});

async function request(action: Parameters<typeof createHandler>[0], options: RequestInit = {}, path = '/', dependencies = {}) {
  const fetchDraft = vi.fn().mockResolvedValue([{ _id: 'draft-test', label: 'Unpublished test' }]);
  const server = createServer(createHandler(action, { config: () => config,
    validate: async () => ({ isValid: true, redirectTo: '/work?sanity-preview-secret=removed' }),
    fetch: fetchDraft, ...dependencies }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing address');
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, { redirect: 'manual', ...options });
    const text = await response.text();
    return { response, text, fetchDraft };
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
const post = (body: unknown, valid = true): RequestInit => ({ method: 'POST',
  headers: { Origin: config.origin, 'Content-Type': 'application/json', ...(valid ? { Cookie: cookie() } : {}) }, body: JSON.stringify(body) });

describe('preview API', () => {
  it('requires a valid session for drafts, rather than a perspective flag', async () => {
    const result = await request('content', post({ name: 'disciplines' }, false));
    expect(result.response.status).toBe(401); expect(result.fetchDraft).not.toHaveBeenCalled();
    const forged = await request('session', { headers: { Cookie: `${COOKIE_NAME}=forged` } });
    expect(forged.response.status).toBe(401);
    const publicSession = await request('session');
    expect(JSON.parse(publicSession.text)).toEqual({ active: false });
  });
  it('returns allowlisted data with private/no-store and no credentials', async () => {
    const { response, text, fetchDraft } = await request('content', post({ name: 'disciplines', params: {} }));
    expect(response.status).toBe(200); expect(fetchDraft).toHaveBeenCalledOnce();
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(text).not.toContain(config.token); expect(text).not.toContain(config.secret);
  });
  it('rejects arbitrary queries and oversized bodies before upstream fetch', async () => {
    for (const body of [{ name: 'disciplines', params: { slug: 'x' } }, { name: 'disciplines', query: '*[]' },
      { name: 'x'.repeat(3000) }]) {
      const result = await request('content', post(body));
      expect(result.response.status).toBe(400); expect(result.fetchDraft).not.toHaveBeenCalled();
    }
  });
  it('redacts upstream errors', async () => {
    const result = await request('content', post({ name: 'disciplines' }), '/', { fetch: async () => { throw new Error(config.token); } });
    expect(result.response.status).toBe(502); expect(result.text).not.toContain(config.token);
  });
  it('validates the official secret result, strips secrets and issues a session', async () => {
    const result = await request('enable', {}, '/api/preview/enable?sanity-preview-secret=test&sanity-preview-pathname=/work');
    expect(result.response.status).toBe(303);
    expect(result.response.headers.get('location')).toBe('/work');
    expect(result.response.headers.get('set-cookie')).toContain('HttpOnly; Secure; SameSite=Lax');
    const invalid = await request('enable', {}, '/api/preview/enable?sanity-preview-secret=invalid', { validate: async () => ({ isValid: false }) });
    expect(invalid.response.status).toBe(401);
  });
  it('preflights malicious redirect and release perspective before secret validation', async () => {
    const validate = vi.fn();
    for (const query of ['sanity-preview-pathname=https://evil.example', 'sanity-preview-perspective=release-id']) {
      const result = await request('enable', {}, `/api/preview/enable?sanity-preview-secret=test&${query}`, { validate });
      expect(result.response.status).toBe(400);
    }
    expect(validate).not.toHaveBeenCalled();
  });
  it('allows same-origin exit with an expired cookie and blocks cross-origin exit', async () => {
    const exited = await request('disable', { method: 'POST', headers: { Origin: config.origin } });
    expect(exited.response.status).toBe(200); expect(exited.response.headers.get('set-cookie')).toContain('Max-Age=0');
    const blocked = await request('disable', { method: 'POST', headers: { Origin: 'https://evil.example' } });
    expect(blocked.response.status).toBe(403);
    const get = await request('disable'); expect(get.response.status).toBe(405);
  });
});
