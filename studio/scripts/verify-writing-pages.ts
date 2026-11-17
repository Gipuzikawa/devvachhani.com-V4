import { getCliClient } from 'sanity/cli';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { request } from 'node:https';
import { ARTICLE_PAGE_QUERY, WRITING_INDEX_QUERY } from '../../src/sanity/queries';
import { adaptArticle, adaptWriting } from '../../src/sanity/articleAdapters';
import { phase2Seeds } from '../../scripts/sanity/writingTransform';

let stage = 'configuration';
async function verify() {
  process.loadEnvFile('.env.local');
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  if (origin !== 'https://localhost:3000' || process.env.SANITY_STUDIO_PROJECT_ID !== 'oir24qey' || process.env.SANITY_STUDIO_DATASET !== 'development') throw new Error('Development target required.');
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ useCdn: false, perspective: 'raw', timeout: 10_000 });
  const publicClient = client.withConfig({ token: undefined, useCdn: true, perspective: 'published' });
  const publishedOrigin = publicClient.withConfig({ useCdn: false });
  const id = randomUUID(); const draftId = `drafts.${id}`; const sourceKey = `phase2-smoke-${id}`; const slug = sourceKey;
  let owned = false;
  const certificate = readFileSync('../node_modules/.vite/basic-ssl/_cert.pem', 'utf8')
    .match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)?.[0];
  if (!certificate) throw new Error('Start the local HTTPS server first.');
  async function call(path: string, method = 'GET', cookie?: string, value?: unknown) {
    const body = value === undefined ? undefined : JSON.stringify(value);
    return new Promise<{ status: number; headers: import('node:http').IncomingHttpHeaders; text: string }>((resolve, reject) => {
      const req = request(new URL(path, origin), { ca: certificate, method, headers: { Origin: origin!,
        ...(cookie ? { Cookie: cookie } : {}), ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) } }, res => {
        let text = ''; res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, text }));
      });
      req.on('error', () => reject(new Error('Local request failed.')));
      req.setTimeout(15_000, () => { req.destroy(); reject(new Error('Local request timed out.')); }); req.end(body);
    });
  }
  try {
    stage = 'published Writing and article parity';
    const index = adaptWriting(await publicClient.fetch(WRITING_INDEX_QUERY));
    const article = adaptArticle(await publicClient.fetch(ARTICLE_PAGE_QUERY, { slug: 'f35-development-update' }));
    if (index.planned.length !== 3 || article?.readTime !== '6 min' || article.status !== 'placeholder' ||
      article.toc.map(item => item.id).join(',') !== 'overview,development,testing,ahead') throw new Error('Seeded article parity failed.');
    stage = 'creating owned unpublished article';
    const source = phase2Seeds()[0].build(new Map());
    const body = { ...source, sourceKey, slug: { _type: 'slug', current: slug }, title: 'Verification only — first article draft' };
    await client.create({ ...body, _type: 'article', _id: draftId }); owned = true;
    // Prime the exact CDN query before publication; a new cache key would not prove invalidation.
    if (adaptArticle(await publicClient.fetch(ARTICLE_PAGE_QUERY, { slug })) !== null ||
      adaptWriting(await publicClient.fetch(WRITING_INDEX_QUERY)).articles.some(item => item.slug === slug)) throw new Error('Unpublished article leaked publicly.');
    stage = 'official preview entry';
    const { secret } = await createPreviewSecret(client, 'portfolio-phase-2-check', `${origin}/studio`);
    const enabled = await call(`/api/preview/enable?sanity-preview-secret=${encodeURIComponent(secret)}&sanity-preview-pathname=/writing&sanity-preview-perspective=drafts`);
    const cookie = enabled.headers['set-cookie']?.[0]?.split(';')[0];
    if (enabled.status !== 303 || !cookie) throw new Error('Preview entry failed.');
    async function preview(name: 'writingIndex' | 'articlePage', params: Record<string, string> = {}) {
      const response = await call('/api/preview/content', 'POST', cookie, { name, params });
      if (response.status !== 200 || response.headers['cache-control'] !== 'private, no-store') throw new Error('Draft query failed.');
      return JSON.parse(response.text).result;
    }
    stage = 'draft index and article adapters';
    if (!adaptWriting(await preview('writingIndex')).articles.some(item => item.title === body.title) ||
      adaptArticle(await preview('articlePage', { slug }))?.title !== body.title) throw new Error('Draft preview failed.');
    stage = 'publishing owned development article';
    await client.action({ actionType: 'sanity.action.document.publish', draftId, publishedId: id });
    if (adaptArticle(await publishedOrigin.fetch(ARTICLE_PAGE_QUERY, { slug }))?.title !== body.title) throw new Error('Origin publication failed.');
    stage = 'primed CDN publication';
    let published = false;
    const attempts = Number(process.env.PORTFOLIO_SMOKE_CDN_ATTEMPTS ?? 65);
    if (!Number.isInteger(attempts) || attempts < 1 || attempts > 180) throw new Error('Invalid CDN test window.');
    console.log('Origin publication passed; polling the primed article CDN query.');
    const started = Date.now(); let polls = 0;
    for (; polls < attempts; polls++) {
      if (adaptArticle(await publicClient.fetch(ARTICLE_PAGE_QUERY, { slug }))?.title === body.title) { published = true; polls++; break; }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(`${published ? 'PASS' : 'PENDING'}: primed CDN article publication; ${polls} attempts, ${Math.round((Date.now() - started) / 1000)} seconds.`);
    stage = 'subsequent private edit';
    await client.create({ ...body, _type: 'article', _id: draftId, title: 'Verification only — subsequent private article draft' });
    if (adaptArticle(await preview('articlePage', { slug }))?.title !== 'Verification only — subsequent private article draft' ||
      adaptArticle(await publishedOrigin.fetch(ARTICLE_PAGE_QUERY, { slug }))?.title !== body.title ||
      !adaptWriting(await publishedOrigin.fetch(WRITING_INDEX_QUERY)).articles.some(item => item.title === body.title)) throw new Error('Publish-then-edit separation failed.');
    stage = 'preview exit and unauthorized reads';
    const exit = await call('/api/preview/disable', 'POST', cookie);
    const denied = await call('/api/preview/content', 'POST', undefined, { name: 'articlePage', params: { slug } });
    if (exit.status !== 200 || !exit.headers['set-cookie']?.[0]?.includes('Max-Age=0') || denied.status !== 401) throw new Error('Exit protection failed.');
    console.log('PASS: Writing/article parity, unpublished exclusion, signed index/detail preview, origin publish, subsequent draft isolation, exit and unauthorized reads.');
    if (!published) process.exitCode = 1;
  } finally {
    if (owned) {
      try {
        const documents = await client.getDocuments([id, draftId]);
        if (documents.some(doc => doc && doc.sourceKey !== sourceKey)) {
          console.error(`Cleanup stopped: ownership changed for development verification record ${sourceKey}.`); process.exitCode = 1;
        } else {
          await client.transaction().delete(draftId).delete(id).commit();
          console.log('Removed only the owned disposable development article/draft. Seeded/editor records were untouched.');
        }
      } catch { console.error(`Cleanup failed for development verification record ${sourceKey}.`); process.exitCode = 1; }
    }
  }
}
verify().catch(() => { console.error(`Writing smoke check failed at: ${stage}. No credentials or secret URLs logged.`); process.exitCode = 1; });
