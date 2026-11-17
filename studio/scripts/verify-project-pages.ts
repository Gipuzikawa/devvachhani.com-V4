import { getCliClient } from 'sanity/cli';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { request } from 'node:https';
import { WORK_ARCHIVE_QUERY, PROJECT_PAGE_QUERY } from '../../src/sanity/queries';
import { adaptArchive, adaptProject as projectAdapter } from '../../src/sanity/projectAdapters';

let stage = 'configuration';
async function verify() {
  process.loadEnvFile('.env.local');
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  if (origin !== 'https://localhost:3000' || process.env.SANITY_STUDIO_PROJECT_ID !== 'oir24qey' || process.env.SANITY_STUDIO_DATASET !== 'development') throw new Error('Development target required.');
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ useCdn: false, perspective: 'raw', timeout: 10_000 });
  const publicClient = client.withConfig({ token: undefined, useCdn: true, perspective: 'published' });
  const adaptProject = (value: Parameters<typeof projectAdapter>[0]) => projectAdapter(value, { projectId: 'oir24qey', dataset: 'development' });
  const id = randomUUID();
  const draftId = `drafts.${id}`;
  const sourceKey = `phase12-smoke-${id}`;
  const slug = sourceKey;
  let owned = false;
  const certificate = readFileSync('../node_modules/.vite/basic-ssl/_cert.pem', 'utf8')
    .match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)?.[0];
  if (!certificate) throw new Error('Start the local HTTPS preview server first.');
  async function call(path: string, method = 'GET', cookie?: string, value?: unknown) {
    const body = value === undefined ? undefined : JSON.stringify(value);
    return new Promise<{ status: number; headers: import('node:http').IncomingHttpHeaders; text: string }>((resolve, reject) => {
      const req = request(new URL(path, origin), { ca: certificate, method, headers: { Origin: origin!,
        ...(cookie ? { Cookie: cookie } : {}), ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) } }, res => {
        let text = ''; res.on('data', chunk => { text += chunk; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, text }));
      });
      req.on('error', () => reject(new Error('Local request failed.')));
      req.setTimeout(15_000, () => { req.destroy(); reject(new Error('Local request timed out.')); });
      req.end(body);
    });
  }
  try {
    stage = 'local API availability';
    const session = await call('/api/preview/session'); if (session.status !== 200) throw new Error('Preview API unavailable.');
    stage = 'published archive and existing F-35 parity';
    const archive = adaptArchive(await publicClient.fetch(WORK_ARCHIVE_QUERY));
    const f35 = adaptProject(await publicClient.fetch(PROJECT_PAGE_QUERY, { slug: 'rc-f35-vtol' }));
    if (!archive.projects.some(item => item.slug === 'rc-f35-vtol') || !f35 || f35.milestones.length !== 6) throw new Error('Published seeded content did not resolve.');
    stage = 'disposable development draft';
    const sources = await client.fetch<Record<string, unknown>[]>('*[_type == "project" && sourceKey == "project-rc-f35-vtol" && !(_id in path("drafts.**"))]');
    if (sources.length !== 1) throw new Error('Ambiguous source project.');
    const fields = Object.fromEntries(Object.entries(sources[0]).filter(([key]) => !['_id', '_rev', '_createdAt', '_updatedAt', '_originalId'].includes(key)));
    const body = { ...fields, _type: 'project', sourceKey, slug: { _type: 'slug', current: slug }, sortOrder: 1_000_000, title: 'Verification only — first draft' };
    await client.create({ ...body, _id: draftId }); owned = true;
    if (adaptProject(await publicClient.fetch(PROJECT_PAGE_QUERY, { slug })) !== null) throw new Error('Unpublished draft was exposed publicly.');
    stage = 'official preview entry';
    const { secret } = await createPreviewSecret(client, 'portfolio-phase-1.2-check', `${origin}/studio`);
    const enabled = await call(`/api/preview/enable?sanity-preview-secret=${encodeURIComponent(secret)}&sanity-preview-pathname=/work&sanity-preview-perspective=drafts`);
    const cookie = enabled.headers['set-cookie']?.[0]?.split(';')[0];
    if (enabled.status !== 303 || !cookie) throw new Error('Preview entry failed.');
    async function preview(name: 'workArchive' | 'projectPage', params: Record<string, string> = {}) {
      const response = await call('/api/preview/content', 'POST', cookie, { name, params });
      if (response.status !== 200 || response.headers['cache-control'] !== 'private, no-store') throw new Error('Draft query failed.');
      return JSON.parse(response.text).result;
    }
    stage = 'draft archive and detail adapters';
    const draftArchive = adaptArchive(await preview('workArchive'));
    const draftDetail = adaptProject(await preview('projectPage', { slug }));
    if (!draftArchive.projects.some(item => item.title === body.title) || draftDetail?.title !== body.title) throw new Error('Draft overrides were not rendered by adapters.');
    stage = 'publishing the disposable development document';
    await client.action({ actionType: 'sanity.action.document.publish', draftId, publishedId: id });
    stage = 'checking publication at the uncached origin';
    const originResult = adaptProject(await publicClient.withConfig({ useCdn: false }).fetch(PROJECT_PAGE_QUERY, { slug }));
    if (originResult?.title !== body.title) throw new Error('Published origin did not return the expected document.');
    stage = 'waiting for public CDN publication';
    let published = false;
    const attempts = Number(process.env.PORTFOLIO_SMOKE_CDN_ATTEMPTS ?? 65);
    if (!Number.isInteger(attempts) || attempts < 1 || attempts > 180) throw new Error('Invalid CDN test window.');
    console.log('Published the disposable development document; checking public CDN propagation.');
    for (let attempt = 0; attempt < attempts; attempt++) {
      const result = adaptProject(await publicClient.fetch(PROJECT_PAGE_QUERY, { slug }));
      if (result?.title === body.title) { published = true; break; }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (!published) console.log('PENDING: primed CDN query remained stale during the test window; uncached published origin matched.');
    stage = 'new draft preserves the published version';
    await client.create({ ...body, _id: draftId, title: 'Verification only — second private draft' });
    const changed = adaptProject(await preview('projectPage', { slug }));
    const unchanged = adaptProject(await publicClient.withConfig({ useCdn: false }).fetch(PROJECT_PAGE_QUERY, { slug }));
    if (changed?.title !== 'Verification only — second private draft' || unchanged?.title !== body.title) throw new Error('Post-publication draft isolation failed.');
    stage = 'exit and unauthorized detail reads';
    const exit = await call('/api/preview/disable', 'POST', cookie);
    const denied = await call('/api/preview/content', 'POST', undefined, { name: 'projectPage', params: { slug } });
    if (exit.status !== 200 || !exit.headers['set-cookie']?.[0]?.includes('Max-Age=0') || denied.status !== 401) throw new Error('Exit protection failed.');
    console.log('PASS: published archive/F-35 adapters, unpublished exclusion, draft archive/detail preview, origin publish, subsequent draft isolation, exit and unauthorized reads.');
    if (published) console.log('PASS: primed public CDN query observed publication.');
    else process.exitCode = 1;
  } finally {
    if (owned) {
      try {
        const documents = await client.getDocuments([id, draftId]);
        if (documents.some(document => document && document.sourceKey !== sourceKey)) {
          console.error(`Cleanup stopped: ownership of verification record ${sourceKey} changed.`); process.exitCode = 1;
        } else {
          await client.transaction().delete(draftId).delete(id).commit();
          console.log('Removed only the disposable development verification document and its draft. Seeded project documents were untouched.');
        }
      } catch { console.error(`Cleanup failed for development verification record ${sourceKey}.`); process.exitCode = 1; }
    }
  }
}
verify().catch(() => { console.error(`Project smoke check failed at: ${stage}. No credentials or secret URLs logged.`); process.exitCode = 1; });
