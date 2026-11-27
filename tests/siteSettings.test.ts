import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { phase5Seeds } from '../scripts/sanity/siteSettingsTransform';
import { IncompleteContentError } from '../src/sanity/projectAdapters';
import { parseQueryRequest, validResult, type QueryResults } from '../src/sanity/queryRegistry';
import { adaptSiteSettings } from '../src/sanity/siteSettings';

const record = {
  _id: 'siteSettings', _rev: 'revision-1',
  wordmark: 'Dev Vachhani', contactEmail: 'hello@devvachhani.com',
  footerSignoff: 'Let’s build something.', footerMeta: '© 2026 Dev Vachhani',
  footerColophon: 'Set in Newsreader & IBM Plex Mono',
  socialLinks: [
    { _key: 'git', label: 'GitHub', href: '#' },
    { _key: 'in', label: 'LinkedIn', href: '#' },
  ],
};
const settings = (fields: Record<string, unknown>) => [fields] as QueryResults['siteSettings'];

describe('Site settings query transport', () => {
  it('allowlists a fixed singleton query with no parameters or client-selected perspective', () => {
    expect(parseQueryRequest({ name: 'siteSettings' })).toEqual({ name: 'siteSettings', params: {} });
    expect(() => parseQueryRequest({ name: 'siteSettings', params: { id: 'other' } })).toThrow('accepts no parameters');
    expect(() => parseQueryRequest({ name: 'siteSettings', perspective: 'raw' })).toThrow('Unknown query');
  });

  it('accepts projected arrays and rejects malformed response envelopes', () => {
    expect(validResult('siteSettings', [record])).toBe(true);
    expect(validResult('siteSettings', [])).toBe(true);
    expect(validResult('siteSettings', record)).toBe(false);
    expect(validResult('siteSettings', null)).toBe(false);
  });
});

describe('Site settings seed', () => {
  it('matches the frozen shell copy with only the two authored social links', () => {
    const source = readFileSync('docs/sanity/fixtures/content.ts.snapshot', 'utf8');
    const footer = readFileSync('docs/sanity/fixtures/phase1-pages/SiteFooter.tsx.snapshot', 'utf8');
    const field = (name: string) => source.match(new RegExp(name + ": '([^']+)'"))?.[1];
    const colophon = footer.match(/<span data-decode>([^<{]+)<\/span>/)?.[1];
    const socials = [...source.matchAll(/\{ label: '(GitHub|LinkedIn)', href: '(#)' \}/g)];
    const seeds = phase5Seeds();
    expect(seeds).toHaveLength(1);
    const [seed] = seeds;
    expect(seed).toMatchObject({ singletonId: 'siteSettings', sourceKey: 'site-settings', type: 'siteSettings', dependencies: [] });
    const body = seed.build(new Map());
    expect(seed.build(new Map())).toEqual(body);
    const view = adaptSiteSettings(settings({ ...body, _id: seed.singletonId, _rev: 'rev' }));
    expect(view).toEqual({
      wordmark: field('brand'), contactEmail: field('email'),
      footerSignoff: field('signoff'), footerMeta: field('meta'), footerColophon: colophon,
      emailHref: source.match(/\{ label: 'Email', href: '(mailto:[^']+)' \}/)?.[1],
      socialLinks: socials.map(([, label, href]) => ({ key: expect.any(String), label, href })),
      revision: 'rev',
    });
    expect(new Set(view?.socialLinks.map(link => link.key)).size).toBe(2);
  });
});

describe('Site settings adapter', () => {
  it('retains authored strings and uses authored social keys when order changes', () => {
    const [github, linkedIn] = record.socialLinks;
    const view = adaptSiteSettings(settings({
      ...record, footerSignoff: '  A signoff.  ', contactEmail: 'Foundry+notes@Sub.Example.org',
      socialLinks: [{ ...linkedIn, href: 'https://www.linkedin.com/in/dev?view=profile#about' }, github],
    }));
    expect(view).toMatchObject({
      footerSignoff: '  A signoff.  ', emailHref: 'mailto:Foundry+notes@Sub.Example.org',
      socialLinks: [
        { key: 'in', label: 'LinkedIn', href: 'https://www.linkedin.com/in/dev?view=profile#about' },
        { key: 'git', label: 'GitHub', href: '#' },
      ],
    });
  });

  it('returns null for an absent singleton and treats missing social links as empty', () => {
    expect(adaptSiteSettings([])).toBeNull();
    expect(adaptSiteSettings(settings({ ...record, socialLinks: null }))?.socialLinks).toEqual([]);
    expect(adaptSiteSettings(settings({ ...record, socialLinks: undefined }))?.socialLinks).toEqual([]);
  });

  it.each([
    { _rev: '' }, { _id: 'wrong-id' }, { wordmark: null }, { footerSignoff: 1 },
    { footerMeta: ' ' }, { footerColophon: '' }, { socialLinks: false },
    { socialLinks: [null] },
    { socialLinks: [{ label: 'GitHub', href: '#' }] },
    { socialLinks: [{ _key: 'git', label: ' ', href: '#' }] },
    { socialLinks: [...record.socialLinks, { ...record.socialLinks[0] }] },
  ])('rejects malformed required fields and social items (%o)', fields => {
    expect(() => adaptSiteSettings(settings({ ...record, ...fields }))).toThrow(IncompleteContentError);
  });

  it('rejects multiple records', () => {
    expect(() => adaptSiteSettings([record, record])).toThrow(IncompleteContentError);
  });

  it.each([
    'Name <hello@example.com>', 'mailto:hello@example.com', 'hello@example.com?subject=Hi',
    'hello@example.com,other@example.com', 'hello%0A@example.com', 'hello@example.com\n',
    'hello..team@example.com', 'hello@example..com', 'hello@-example.com', 'hello@',
  ])('rejects a malformed or unsafe contact mailbox (%j)', contactEmail => {
    expect(() => adaptSiteSettings(settings({ ...record, contactEmail }))).toThrow(IncompleteContentError);
  });

  it.each([
    'javascript:alert(1)', 'mailto:hello@example.com', '//example.com', 'http://example.com',
    '/work', '#contact', 'https:///example.com', 'https://', 'https://example.com/%ZZ',
    'https://example.com/%00', 'https://example.com/%5C', 'https://admin:pass@example.com',
    'https://@example.com', ' https://example.com', 'https://example.com/#\n',
  ])('rejects a malformed or unsafe social destination (%j)', href => {
    expect(() => adaptSiteSettings(settings({ ...record, socialLinks: [{ _key: 'link', label: 'Link', href }] })))
      .toThrow(IncompleteContentError);
  });
});
