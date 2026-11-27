import { SITE_SETTINGS_ID, SITE_SETTINGS_SOURCE_KEY } from '../../src/sanity/siteSettingsValidation';
import { stableKey, type Seed } from './transform';

export function phase5Seeds(): Seed[] {
  // See content.ts.snapshot and phase1-pages/SiteFooter.tsx.snapshot in docs/sanity/fixtures.
  const socials = [
    { id: 'github', label: 'GitHub', href: '#' },
    { id: 'linkedin', label: 'LinkedIn', href: '#' },
  ];
  return [{
    type: 'siteSettings', sourceKey: SITE_SETTINGS_SOURCE_KEY, singletonId: SITE_SETTINGS_ID, dependencies: [],
    build: () => ({
      _type: 'siteSettings', sourceKey: SITE_SETTINGS_SOURCE_KEY,
      wordmark: 'Dev Vachhani',
      contactEmail: 'hello@devvachhani.com',
      footerSignoff: 'Let’s build something.',
      footerMeta: '© 2026 Dev Vachhani',
      footerColophon: 'Set in Newsreader & IBM Plex Mono',
      socialLinks: socials.map(({ id, label, href }) => ({
        _type: 'socialLink', _key: stableKey(`site-settings:social:${id}`), label, href,
      })),
    }),
  }];
}
