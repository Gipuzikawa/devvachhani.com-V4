import { getCliClient } from 'sanity/cli';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { readFileSync } from 'node:fs';
import { request } from 'node:https';
import { randomUUID } from 'node:crypto';

// Run only with `sanity exec scripts/verify-preview.ts --with-user-token`.
// The CLI lends its existing user session in memory; no write token is saved.
let stage = 'local environment';
async function verify() {
  process.loadEnvFile('.env.local');
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  if (origin !== 'https://localhost:3000' || process.env.SANITY_STUDIO_DATASET !== 'development') {
    throw new Error('Smoke check requires the local development origin and dataset.');
  }
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ useCdn: false });
  stage = 'locating the development smoke draft';
  const sourceKey = 'phase-0-smoke-check';
  const existing = await client.fetch<{ _id: string }[]>('*[_type == "discipline" && sourceKey == $sourceKey]', { sourceKey }, { perspective: 'raw' });
  if (existing.length > 1) throw new Error('Ambiguous smoke-check documents; inspect Studio before retrying.');
  if (!existing.length) {
    stage = 'creating the unpublished smoke draft';
    // A new random ID is needed to address a draft without creating a published document.
    await client.create({ _id: `drafts.${randomUUID()}`, _type: 'discipline', sourceKey,
      label: 'Phase 0 — unpublished draft check', sortOrder: 0 });
  } else if (!existing[0]._id.startsWith('drafts.')) throw new Error('Smoke document was published; inspect it before retrying.');
  stage = 'creating the official preview secret';
  const { secret } = await createPreviewSecret(client, 'portfolio-phase-0-check', `${origin}/studio`);
  stage = 'loading the localhost certificate';
  const pem = readFileSync('../node_modules/.vite/basic-ssl/_cert.pem', 'utf8');
  const ca = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)?.[0];
  if (!ca) throw new Error('Start npm run dev:preview first to generate its localhost certificate.');
  async function call(path: string, method = 'GET', cookie?: string, body?: string) {
    return new Promise<{ status: number; headers: import('node:http').IncomingHttpHeaders; text: string }>((resolve, reject) => {
      const req = request(new URL(path, origin), { method, ca, headers: { Origin: origin!,
        ...(cookie ? { Cookie: cookie } : {}), ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) } }, res => {
        let text = ''; res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, text }));
      });
      req.on('error', () => reject(new Error('Local HTTPS request failed.')));
      req.end(body);
    });
  }
  const query = JSON.stringify({ name: 'disciplines', params: {} });
  stage = 'rejecting unauthenticated drafts';
  const denied = await call('/api/preview/content', 'POST', undefined, query);
  if (denied.status !== 401) throw new Error('Unauthenticated drafts were not rejected.');
  stage = 'enabling preview with the official secret';
  const enabled = await call(`/api/preview/enable?sanity-preview-secret=${encodeURIComponent(secret)}&sanity-preview-pathname=/work&sanity-preview-perspective=drafts`);
  if (enabled.status !== 303 || enabled.headers.location !== '/work') throw new Error('Official secret validation failed.');
  const cookie = enabled.headers['set-cookie']?.[0]?.split(';')[0];
  if (!cookie) throw new Error('Preview cookie was not issued.');
  stage = 'verifying the signed session';
  const session = await call('/api/preview/session', 'GET', cookie);
  if (session.status !== 200 || !JSON.parse(session.text).active) throw new Error('Signed session verification failed.');
  stage = 'reading the authenticated draft';
  const preview = await call('/api/preview/content', 'POST', cookie, query);
  if (preview.status !== 200 || !JSON.parse(preview.text).result.some((item: { sourceKey?: string }) => item.sourceKey === sourceKey)) {
    throw new Error('Development draft was not returned through the preview API.');
  }
  stage = 'checking token-free public exclusion';
  const publicResult = await client.withConfig({ token: undefined, perspective: 'published', useCdn: true })
    .fetch<{ sourceKey?: string }[]>('*[_type == "discipline"]{sourceKey}');
  if (publicResult.some(item => item.sourceKey === sourceKey)) throw new Error('Unpublished smoke document leaked into public results.');
  if (preview.headers['cache-control'] !== 'private, no-store') throw new Error('Draft response can be cached.');
  stage = 'exiting preview';
  const exited = await call('/api/preview/disable', 'POST', cookie);
  if (exited.status !== 200 || !exited.headers['set-cookie']?.[0]?.includes('Max-Age=0')) throw new Error('Exit did not clear the cookie.');
  for (const path of ['/', '/about', '/work', '/work/rc-f35-vtol', '/writing', '/writing/f35-development-update', '/studio', '/studio/structure/discipline']) {
    stage = `checking the static route ${path}`;
    const response = await call(path);
    if (response.status !== 200 || !response.text.includes('<html')) throw new Error('A frontend/Studio deep link failed.');
  }
  const unknownApi = await call('/api/unknown');
  if (unknownApi.status !== 404) throw new Error('SPA fallback swallowed an unknown API route.');
  console.log('PASS: real unpublished development draft, official preview secret, signed session, token-free public exclusion, no-store, exit cookie, six portfolio routes, Studio deep link, API precedence.');
  console.log('Browser authentication, iframe cookie handling, reduced motion and Safari still require browser verification.');
}
verify().catch(() => { console.error(`Live smoke check failed at: ${stage}. No secret URL or credentials logged.`); process.exitCode = 1; });
