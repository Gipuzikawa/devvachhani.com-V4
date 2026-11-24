import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { ABOUT_PAGE_QUERY } from '../../src/sanity/queries';
import { readAbout } from '../../src/sanity/aboutContent';
import { localPreviewRequest } from './localPreviewRequest';

let stage = 'configuration';
async function verify() {
  process.loadEnvFile('.env.local');
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ useCdn: false });
  if (origin !== 'https://localhost:3000' || client.config().projectId !== 'oir24qey' ||
    client.config().dataset !== 'development') throw new Error('Local development required.');
  const call = localPreviewRequest(origin);
  const publicClient = client.withConfig({ token: undefined, perspective: 'published', useCdn: true });
  const published = await client.getDocument('aboutPage');
  if (!published || published.sourceKey !== 'about-page') throw new Error('Missing seeded About page.');
  const { _createdAt, _updatedAt, _rev, ...fields } = published;
  const page = readAbout(published);
  const shared = page.facts.find(f => f.showOnHome);
  if (!shared || page.gaps.length) throw new Error('Review published About data.');
  stage = 'public CDN parity';
  const current = await publicClient.fetch(ABOUT_PAGE_QUERY);
  if (current.length !== 1 || current[0]._rev !== _rev) throw new Error('Public revision pending.');
  stage = 'signed About preview entry';
  const { secret } = await createPreviewSecret(client, 'portfolio-about-check', origin + '/studio');
  const enabled = await call('/api/preview/enable?sanity-preview-secret=' + encodeURIComponent(secret) +
    '&sanity-preview-pathname=/about&sanity-preview-perspective=drafts');
  const cookie = enabled.headers['set-cookie']?.[0]?.split(';')[0];
  if (enabled.status !== 303 || !cookie) throw new Error('Entry failed.');
  const marker = 'Development draft ' + randomUUID();
  stage = 'create disposable About draft (existing drafts are preserved)';
  // Create fails atomically if an editor already has a draft.
  const draft = await client.create({ ...fields, _type: 'aboutPage', _id: 'drafts.aboutPage', lead: marker,
    facts: published.facts.map((fact: { _key: string }) => fact._key === shared.key ? { ...fact, value: marker } : fact) });
  try {
    stage = 'signed About and shared Home fact read';
    const query = { name: 'aboutPage', params: {} };
    const preview = await call('/api/preview/content', 'POST', cookie, query);
    if (preview.status !== 200 || preview.headers['cache-control'] !== 'private, no-store') throw new Error('Preview unavailable.');
    const data = readAbout(JSON.parse(preview.text).result[0]);
    if (data.lead !== marker || !data.facts.some(f => f.key === shared.key && f.showOnHome && f.value === marker)) throw new Error('Draft missing.');
    for (const useCdn of [false, true]) {
      const result = await publicClient.withConfig({ useCdn }).fetch(ABOUT_PAGE_QUERY);
      if (result.length !== 1 || result[0]._rev !== _rev || JSON.stringify(result).includes(marker)) throw new Error('Public parity failed.');
    }
    stage = 'preview exit';
    const exit = await call('/api/preview/disable', 'POST', cookie);
    const denied = await call('/api/preview/content', 'POST', undefined, query);
    if (exit.status !== 200 || !exit.headers['set-cookie']?.[0]?.includes('Max-Age=0') || denied.status !== 401) throw new Error('Exit failed.');
  } finally {
    // A concurrent edit changes the revision and aborts the entire transaction.
    await client.transaction().patch(draft._id, p => p.ifRevisionId(draft._rev).set({ lead: marker }))
      .delete(draft._id).commit();
  }
  console.log('PASS: About public CDN revision, signed draft lead and shared fact, published origin/CDN isolation, exit and revision-guarded cleanup.');
}
verify().catch(() => { console.error('About verification stopped at ' + stage + '.'); process.exitCode = 1; });
