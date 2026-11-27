import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { getCliClient } from 'sanity/cli';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { ABOUT_PAGE_QUERY, HOME_PAGE_QUERY } from '../../src/sanity/queries';
import { adaptHome } from '../../src/sanity/homeContent';
import type { HomePage, HOME_PAGE_QUERY_RESULT } from '../../src/sanity/sanity.types';
import { localPreviewRequest } from './localPreviewRequest';

let stage = 'configuration';
async function verify() {
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ perspective: 'raw', useCdn: false });
  if (origin !== 'https://localhost:3000' || client.config().projectId !== 'oir24qey' ||
    client.config().dataset !== 'development') throw new Error('Local development required.');
  const originClient = client.withConfig({ token: undefined, perspective: 'published' });
  const cdn = originClient.withConfig({ useCdn: true });
  if (process.argv.includes('--prime')) {
    stage = 'prime exact public CDN query';
    const current = await cdn.fetch<HOME_PAGE_QUERY_RESULT>(HOME_PAGE_QUERY);
    console.log('Primed Home CDN query (' + current.settings.length + ' published records).');
    return;
  }

  stage = 'published Home origin';
  const raw = await originClient.fetch<HOME_PAGE_QUERY_RESULT>(HOME_PAGE_QUERY);
  const home = adaptHome(raw);
  const published = await client.getDocument<HomePage>('homePage');
  if (!published || !home || home.heroLines[1].runs[1]?.text !== 'one' ||
    !home.heroLines[1].runs[1].emphasis || home.featuredProjects.length !== 3) throw new Error('Seed parity failed.');
  const sourceRevision = published._rev;
  stage = 'published Home CDN';
  const started = Date.now();
  let matched = false;
  for (let attempt = 1; attempt <= 90; attempt++) {
    if ((await cdn.fetch<HOME_PAGE_QUERY_RESULT>(HOME_PAGE_QUERY)).settings[0]?._rev === sourceRevision) {
      console.log(`Home CDN matched origin after ${attempt} request(s), ${Math.round((Date.now() - started) / 1000)}s polling.`);
      matched = true;
      break;
    }
    await setTimeout(1000);
  }
  if (!matched) {
    console.log('PENDING: exact Home CDN query did not match the origin within 90 attempts.');
    process.exitCode = 1;
  }
  if (process.argv.includes('--published-only')) return;

  stage = 'signed Home preview entry';
  const call = localPreviewRequest(origin);
  const { secret } = await createPreviewSecret(client, 'portfolio-home-check', origin + '/studio');
  const enabled = await call('/api/preview/enable?sanity-preview-secret=' + encodeURIComponent(secret) +
    '&sanity-preview-pathname=/&sanity-preview-perspective=drafts');
  const cookie = enabled.headers['set-cookie']?.[0]?.split(';')[0];
  if (enabled.status !== 303 || enabled.headers.location !== '/' || !cookie) throw new Error('Entry failed.');

  stage = 'create owned disposable drafts';
  const marker = 'Development draft ' + randomUUID();
  const projectId = randomUUID();
  const draftProjectId = 'drafts.' + projectId;
  const draftHomeId = 'drafts.homePage';
  const { _createdAt, _updatedAt, _rev, ...fields } = published;
  const draftLines = published.heroLines;
  if (!draftLines?.length || !published.featuredProjects?.length) throw new Error('Missing seed fields.');
  const lines = draftLines.map((line, i) => ({ ...line, runs: line.runs?.map((run, j) =>
    j === 0 ? { ...run, text: marker + ' line ' + (i + 1) + ' ' } : run) }));
  // Atomic create protects existing editorial drafts and avoids partial fixtures.
  const [projectDraft, homeDraft] = await client.transaction().create({
    _type: 'project', _id: draftProjectId, title: marker, summary: 'Development verification',
    sourceKey: 'home-check-' + projectId, slug: { _type: 'slug', current: 'home-check-' + projectId },
    tags: ['Verification'], sortOrder: 1_000_000,
    detailEnabled: false, contentStatus: 'placeholder',
  }).create({
    ...fields, _type: 'homePage', _id: draftHomeId, heroLines: lines,
    featuredProjects: [...published.featuredProjects,
      { _key: 'verificationproject', _type: 'reference', _ref: projectId, _weak: true },
      { _key: 'verificationmissing', _type: 'reference', _ref: randomUUID(), _weak: true }],
  }).commit({ returnFirst: false, returnDocuments: true });
  try {
    stage = 'draft hero and project reference resolution';
    const query = { name: 'homePage', params: {} };
    const result = await call('/api/preview/content', 'POST', cookie, query);
    if (result.status !== 200 || result.headers['cache-control'] !== 'private, no-store') throw new Error('Draft request failed.');
    const draft = adaptHome(JSON.parse(result.text).result, true);
    if (!draft || draft.heroLines.some((line, i) => line.runs[0]?.text !== marker + ' line ' + (i + 1) + ' ') ||
      !draft.featuredProjects.some(item => item.key === 'verificationproject' && item.card?.title === marker) ||
      !draft.featuredProjects.some(item => item.key === 'verificationmissing' && !item.card)) throw new Error('Draft resolution failed.');
    const shared = await call('/api/preview/content', 'POST', cookie, { name: 'aboutPage', params: {} });
    if (shared.status !== 200 || !(await originClient.fetch(ABOUT_PAGE_QUERY)).length) throw new Error('Shared facts unavailable.');
    stage = 'public isolation';
    for (const api of [originClient, cdn]) {
      const result = await api.fetch<HOME_PAGE_QUERY_RESULT>(HOME_PAGE_QUERY);
      if (result.order.some(item => item._id === projectId) || JSON.stringify(result).includes(marker)) throw new Error('Draft publicly visible.');
    }
    stage = 'preview exit';
    const disabled = await call('/api/preview/disable', 'POST', cookie);
    const denied = await call('/api/preview/content', 'POST', undefined, query);
    if (disabled.status !== 200 || !disabled.headers['set-cookie']?.[0]?.includes('Max-Age=0') || denied.status !== 401) {
      throw new Error('Preview exit failed.');
    }
  } finally {
    const verificationStage = stage;
    stage = 'revision-guarded draft cleanup';
    await client.transaction()
      .patch(draftHomeId, p => p.ifRevisionId(homeDraft._rev).set({ verificationCleanup: true }))
      .delete(draftHomeId)
      .patch(draftProjectId, p => p.ifRevisionId(projectDraft._rev).set({ verificationCleanup: true }))
      .delete(draftProjectId).commit().catch(error => {
        console.error('Inspect development draft IDs before a retry: ' + draftHomeId + ', ' + draftProjectId);
        throw error;
      });
    stage = verificationStage;
  }
  console.log('PASS: Home seed parity, signed drafts, unresolved reference handling, public isolation, exit and draft cleanup.');
}
verify().catch(() => { console.error('Home verification stopped at ' + stage + '.'); process.exitCode = 1; });
