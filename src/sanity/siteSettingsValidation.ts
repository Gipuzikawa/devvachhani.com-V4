import { safeArticleHref } from './articleValidation';

export const SITE_SETTINGS_ID = 'siteSettings';
export const SITE_SETTINGS_SOURCE_KEY = 'site-settings';

export class SiteSettingsValidationError extends Error {}

function fields(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new SiteSettingsValidationError(`Site settings need ${label}.`);
  return value;
}

function safeContactEmail(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 254 || /\s/u.test(value)) return false;
  const [local, domain, extra] = value.split('@');
  if (!domain || extra !== undefined || local.length > 64) return false;
  // Keep only mailbox characters that can appear directly in a mailto recipient.
  const dotAtom = /^[a-z0-9!$'*+_~-]+(?:\.[a-z0-9!$'*+_~-]+)*$/i;
  const host = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  return dotAtom.test(local) && host.test(domain);
}

function safeSocialHref(value: unknown): value is string {
  // A literal authority is required so URL normalization cannot repair an empty
  // host or discard an empty user-information segment.
  return value === '#' || (safeArticleHref(value) && /^https:\/\/[^/?#@]+(?:[/?#]|$)/i.test(value));
}

function readSocialLinks(value: unknown) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new SiteSettingsValidationError('Site settings need a valid social links list.');

  const keys = new Set<string>();
  return value.map(item => {
    const { _key, label, href } = fields(item);
    const key = text(_key, 'a key for each social link');
    if (keys.has(key)) throw new SiteSettingsValidationError('Site settings need unique social link keys.');
    keys.add(key);
    if (!safeSocialHref(href)) throw new SiteSettingsValidationError('Use an HTTPS social destination or #.');
    return { key, label: text(label, 'a label for each social link'), href };
  });
}

export function readSiteSettings(value: unknown) {
  const item = fields(value);
  const { contactEmail } = item;
  if (!safeContactEmail(contactEmail)) throw new SiteSettingsValidationError('Enter a bare contact email address.');
  return {
    wordmark: text(item.wordmark, 'a wordmark'),
    contactEmail,
    footerSignoff: text(item.footerSignoff, 'a footer sign-off'),
    footerMeta: text(item.footerMeta, 'footer metadata'),
    footerColophon: text(item.footerColophon, 'a footer colophon'),
    socialLinks: readSocialLinks(item.socialLinks),
  };
}

export function validateSiteSettings(value: unknown): true | string {
  try {
    readSiteSettings(value);
    return true;
  } catch (error) {
    if (!(error instanceof SiteSettingsValidationError)) throw error;
    return error.message;
  }
}
