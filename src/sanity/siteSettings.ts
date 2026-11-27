import { IncompleteContentError } from './projectAdapters';
import type { QueryResults } from './queryRegistry';
import { readSiteSettings, SITE_SETTINGS_ID, SiteSettingsValidationError } from './siteSettingsValidation';

export type SiteSettingsView = ReturnType<typeof readSiteSettings> & {
  emailHref: string;
  revision: string;
};

export function adaptSiteSettings(value: QueryResults['siteSettings']): SiteSettingsView | null {
  if (!Array.isArray(value)) throw new IncompleteContentError('Invalid site settings response.');
  if (!value.length) return null;
  const [settings] = value;
  if (value.length !== 1 || settings?._id !== SITE_SETTINGS_ID || typeof settings._rev !== 'string' || !settings._rev.trim()) {
    throw new IncompleteContentError('Site settings identity is incomplete.');
  }
  try {
    const editorial = readSiteSettings(settings);
    return { ...editorial, emailHref: `mailto:${editorial.contactEmail}`, revision: settings._rev };
  } catch (error) {
    if (!(error instanceof SiteSettingsValidationError)) throw error;
    throw new IncompleteContentError(error.message);
  }
}
