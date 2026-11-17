import type { IncomingMessage, ServerResponse } from 'node:http';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { getConfig, type PreviewConfig } from '../config';
import { draftClient } from '../sanityClient';
import { parseQueryRequest, queryRegistry } from '../../src/sanity/queryRegistry';
import { COOKIE_NAME, issueSession, readCookie, sessionCookie, sessionExpiresAt } from './session';
import { safeRedirect } from './redirect';
import { validationClient } from './validationClient';

type Request = IncomingMessage & { body?: unknown };
type Action = 'enable' | 'session' | 'content' | 'disable';
type Dependencies = {
  config: () => PreviewConfig;
  validate: (config: PreviewConfig, url: string) => Promise<{ isValid: boolean; redirectTo?: string; studioPreviewPerspective?: string | null }>;
  fetch: (config: PreviewConfig, query: string, params: Record<string, never>) => Promise<unknown>;
};
const defaults: Dependencies = {
  config: getConfig,
  validate: (config, url) => validatePreviewUrl(validationClient(draftClient(config), config.origin), url),
  fetch: (config, query, params) => draftClient(config).fetch(query, params),
};
function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
async function body(req: Request): Promise<unknown> {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new Error('Expected JSON');
  if (Number(req.headers['content-length'] ?? 0) > 2048) throw new Error('Request too large');
  if (req.body !== undefined) {
    const encoded = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(encoded) > 2048) throw new Error('Request too large');
    return JSON.parse(encoded);
  }
  let data = '';
  for await (const chunk of req) {
    data += String(chunk);
    if (Buffer.byteLength(data) > 2048) throw new Error('Request too large');
  }
  return JSON.parse(data);
}
export function createHandler(action: Action, dependencies: Partial<Dependencies> = {}) {
  const deps = { ...defaults, ...dependencies };
  return async (req: Request, res: ServerResponse) => {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const method = action === 'content' || action === 'disable' ? 'POST' : 'GET';
    if (req.method !== method) { res.setHeader('Allow', method); return send(res, 405, { error: 'Method not allowed' }); }
    let config: PreviewConfig;
    try { config = deps.config(); } catch { return send(res, 503, { error: 'Preview is unavailable' }); }
    if ((action === 'disable' || action === 'content') && req.headers.origin !== config.origin) {
      return send(res, 403, { error: 'Origin rejected' });
    }
    if (action === 'enable') {
      try {
        if (!req.url || req.url.length > 4096 || !req.url.startsWith('/api/preview/enable?')) {
          return send(res, 400, { error: 'Invalid preview link' });
        }
        const url = new URL(req.url, config.origin);
        const secret = url.searchParams.get('sanity-preview-secret');
        if (!secret || secret.length > 512 || !secret.trim()) return send(res, 400, { error: 'Invalid preview link' });
        if (url.searchParams.has('sanity-preview-variant')) return send(res, 400, { error: 'Unsupported preview variant' });
        const perspective = url.searchParams.get('sanity-preview-perspective');
        if (perspective && perspective !== 'drafts') return send(res, 400, { error: 'Unsupported perspective' });
        // Preflight the redirect before passing the secret URL to the official validator.
        const destination = safeRedirect(url.searchParams.get('sanity-preview-pathname') ?? '/', config.origin);
        const result = await deps.validate(config, url.href);
        if (!result.isValid) return send(res, 401, { error: 'Invalid preview link' });
        if (result.studioPreviewPerspective && result.studioPreviewPerspective !== 'drafts') {
          return send(res, 400, { error: 'Unsupported perspective' });
        }
        const redirect = result.redirectTo ? safeRedirect(result.redirectTo, config.origin) : destination;
        res.setHeader('Set-Cookie', sessionCookie(issueSession(config)));
        res.setHeader('Location', redirect);
        res.statusCode = 303;
        return res.end();
      } catch { return send(res, 400, { error: 'Invalid preview link' }); }
    }
    if (action === 'disable') {
      // Exiting needs no valid session, so expired sessions can always be cleared.
      res.setHeader('Set-Cookie', sessionCookie('', true));
      return send(res, 200, { active: false });
    }
    const cookie = readCookie(req.headers.cookie);
    const expiresAt = cookie ? sessionExpiresAt(cookie, config) : undefined;
    const active = expiresAt !== undefined;
    if (action === 'session' && !active) {
      const present = (req.headers.cookie ?? '').includes(`${COOKIE_NAME}=`);
      return send(res, present ? 401 : 200, { active: false });
    }
    if (!active) return send(res, 401, { error: 'Preview session expired. Re-enter from Studio.' });
    if (action === 'session') return send(res, 200, { active: true, projectId: config.projectId,
      dataset: config.dataset, expiresAt });
    let request: ReturnType<typeof parseQueryRequest>;
    try { request = parseQueryRequest(await body(req)); }
    catch { return send(res, 400, { error: 'Invalid content request' }); }
    try { return send(res, 200, { result: await deps.fetch(config, queryRegistry[request.name], request.params) }); }
    catch { return send(res, 502, { error: 'Content could not be loaded' }); }
  };
}
