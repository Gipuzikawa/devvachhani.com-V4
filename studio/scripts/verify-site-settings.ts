import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { getCliClient } from 'sanity/cli';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { SITE_SETTINGS_QUERY } from '../../src/sanity/queries';
import { adaptSiteSettings } from '../../src/sanity/siteSettings';
import type { SiteSettings, SITE_SETTINGS_QUERY_RESULT } from '../../src/sanity/sanity.types';
import { phase5Seeds } from '../../scripts/sanity/siteSettingsTransform';
import { canonical } from '../../scripts/sanity/transform';
import { localPreviewRequest } from './localPreviewRequest';

const id = 'siteSettings';
const draftId = 'drafts.siteSettings';
const routes = ['/', '/about#contact', '/work', '/work/rc-f35-vtol', '/writing', '/writing/f35-development-update'];
const query = { name: 'siteSettings', params: {} };
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
    const result = await cdn.fetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY);
    console.log(`Primed site settings CDN query (${result.length} published records).`);
    return;
  }

  stage = 'published origin and seed parity';
  const published = await client.getDocument<SiteSettings>(id);
  const expected = phase5Seeds()[0].build(new Map());
  const actual = published && Object.fromEntries(Object.keys(expected).map(key => [key, Reflect.get(published, key)]));
  const raw = await originClient.fetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY);
  const publicSettings = adaptSiteSettings(raw);
  if (!published || publicSettings?.revision !== published._rev || canonical(actual) !== canonical(expected)) {
    throw new Error('Seed parity failed.');
  }

  stage = 'published CDN';
  const started = Date.now();
  let matched = false;
  for (let attempt = 1; attempt <= 90; attempt++) {
    const result = await cdn.fetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY);
    if (canonical(result) === canonical(raw)) {
      console.log(`Site settings CDN matched origin after ${attempt} request(s), ${Math.round((Date.now() - started) / 1000)}s polling.`);
      matched = true;
      break;
    }
    if (attempt < 90) await setTimeout(1000);
  }
  if (!matched) {
    console.log('PENDING: exact site settings CDN query did not match origin within 90 attempts.');
    process.exitCode = 1;
  }
  if (process.argv.includes('--published-only')) return;

  stage = 'create owned disposable draft';
  const call = localPreviewRequest(origin);
  const marker = 'Development settings ' + randomUUID();
  const contactEmail = 'settings-preview@example.com';
  const { _createdAt, _updatedAt, _rev, ...fields } = published;
  const draft = await client.create({
    ...fields, _id: draftId, wordmark: marker, contactEmail,
    footerSignoff: marker + ' signoff', footerMeta: marker + ' metadata', footerColophon: marker + ' colophon',
    socialLinks: [{ _type: 'socialLink', _key: 'verificationsocial', label: marker + ' social', href: '#' }],
  });
  let cookie: string | undefined;
  try {
    stage = 'create signed preview secret';
    const { secret } = await createPreviewSecret(client, 'portfolio-settings-check', origin + '/studio');
    for (const route of routes) {
      stage = 'signed settings preview entry for ' + route;
      const search = new URLSearchParams({
        'sanity-preview-secret': secret, 'sanity-preview-pathname': route, 'sanity-preview-perspective': 'drafts',
      });
      const enabled = await call('/api/preview/enable?' + search);
      const cookieHeader = enabled.headers['set-cookie']?.[0];
      cookie = cookieHeader?.split(';')[0];
      if (enabled.status !== 303 || enabled.headers.location !== route || !cookie ||
        !cookieHeader?.includes('HttpOnly') || !cookieHeader.includes('Secure')) throw new Error('Entry failed.');
      const page = await call(route.split('#')[0], 'GET', cookie);
      const session = await call('/api/preview/session', 'GET', cookie);
      if (page.status !== 200 || !page.headers['content-type']?.includes('text/html') ||
        session.status !== 200 || JSON.parse(session.text).active !== true) throw new Error('Preview route unavailable.');

      stage = 'private draft settings after entry for ' + route;
      const result = await call('/api/preview/content', 'POST', cookie, query);
      if (result.status !== 200 || result.headers['cache-control'] !== 'private, no-store' ||
        result.headers['x-robots-tag'] !== 'noindex, nofollow') throw new Error('Draft request failed.');
      const view = adaptSiteSettings(JSON.parse(result.text).result);
      if (view?.revision !== draft._rev || view.wordmark !== marker || view.contactEmail !== contactEmail ||
        view.emailHref !== 'mailto:' + contactEmail || view.footerSignoff !== marker + ' signoff' ||
        view.footerMeta !== marker + ' metadata' || view.footerColophon !== marker + ' colophon' ||
        view.socialLinks.length !== 1 || view.socialLinks[0]?.label !== marker + ' social') throw new Error('Draft parity failed.');
    }

    stage = 'public isolation';
    for (const [api, expectCurrent] of [[originClient, true], [cdn, matched]] as const) {
      const result = await api.fetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY);
      if (JSON.stringify(result).includes(marker) || (expectCurrent && canonical(result) !== canonical(raw))) {
        throw new Error('Public query changed while draft was open.');
      }
    }

    stage = 'preview exit';
    const disabled = await call('/api/preview/disable', 'POST', cookie);
    const denied = await call('/api/preview/content', 'POST', undefined, query);
    const publicSession = await call('/api/preview/session');
    if (disabled.status !== 200 || !disabled.headers['set-cookie']?.[0]?.includes('Max-Age=0') || denied.status !== 401 ||
      publicSession.status !== 200 || JSON.parse(publicSession.text).active !== false) throw new Error('Preview exit failed.');
  } finally {
    const verificationStage = stage;
    stage = 'revision-guarded draft cleanup';
    await client.transaction()
      .patch(draftId, patch => patch.ifRevisionId(draft._rev).set({ verificationCleanup: true }))
      .delete(draftId)
      .commit();
    if (await client.getDocument(draftId)) throw new Error('Draft still present.');
    stage = verificationStage;
  }
  console.log('PASS: Site settings seed parity, six signed route entries, private draft reads, public isolation, exit and owned draft cleanup.');
}

verify().catch(() => {
  console.error('Site settings verification stopped at ' + stage + '.');
  process.exitCode = 1;
});
