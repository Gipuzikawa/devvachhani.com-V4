import { safeArticleHref } from './articleValidation';

export const HERO_LINES = 3;
export const HERO_RUNS_PER_LINE = 8;
export const HERO_RUN_LENGTH = 120;

type HomeFields = Record<string, unknown>;
type HomeLink = { label: string; href: string };
type HeroRun = { key: string; text: string; emphasis: boolean };
type HeroLine = { key: string; runs: HeroRun[] };

export class HomeValidationError extends Error {}

function fields(value: unknown): HomeFields {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as HomeFields : {};
}

function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new HomeValidationError(`Home needs ${label}.`);
  return value;
}

function key(value: unknown, seen: Set<string>, label: string): string {
  const result = text(value, label + ' key');
  if (seen.has(result)) throw new HomeValidationError(`Home needs unique ${label} keys.`);
  seen.add(result);
  return result;
}

export function safeHomeHref(value: unknown): value is string {
  return safeArticleHref(value) && (value.startsWith('/') || (value.startsWith('#') && value.length > 1));
}

function link(value: unknown, name: string): HomeLink {
  const item = fields(value);
  if (!safeHomeHref(item.href)) throw new HomeValidationError(`Home needs a same-site destination for ${name}.`);
  return { label: text(item.label, `${name} label`), href: item.href };
}

function heading(value: unknown, name: string) {
  const item = fields(value);
  return { eyebrow: text(item.eyebrow, `${name} eyebrow`), title: text(item.title, `${name} title`) };
}

function readHeroLines(value: unknown): HeroLine[] {
  if (!Array.isArray(value) || value.length !== HERO_LINES) {
    throw new HomeValidationError('Home needs exactly three nonempty hero lines.');
  }
  const lineKeys = new Set<string>();
  return value.map(raw => {
    const { _key, runs } = fields(raw);
    if (!Array.isArray(runs) || !runs.length || runs.length > HERO_RUNS_PER_LINE) {
      throw new HomeValidationError(`Each Home hero line needs one to ${HERO_RUNS_PER_LINE} text runs.`);
    }
    const runKeys = new Set<string>();
    const inline = runs.map(rawRun => {
      const run = fields(rawRun);
      if (typeof run.text !== 'string' || !run.text.length || run.text.length > HERO_RUN_LENGTH ||
        /[\r\n\u2028\u2029]/u.test(run.text) || (run.emphasis != null && typeof run.emphasis !== 'boolean')) {
        throw new HomeValidationError(`Home hero runs need inline text of up to ${HERO_RUN_LENGTH} characters and optional emphasis.`);
      }
      return { key: key(run._key, runKeys, 'hero run'), text: run.text, emphasis: run.emphasis === true };
    });
    if (!inline.some(run => run.text.trim())) throw new HomeValidationError('Home hero lines must contain text.');
    return { key: key(_key, lineKeys, 'hero line'), runs: inline };
  });
}

export function readHomeEditorial(value: unknown) {
  const item = fields(value);
  return {
    metaAccent: text(item.metaAccent, 'the first metadata label'),
    metaMuted: text(item.metaMuted, 'the second metadata label'),
    heroLines: readHeroLines(item.heroLines),
    heroLead: text(item.heroLead, 'a hero introduction'),
    primaryCta: link(item.primaryCta, 'the primary action'),
    contactCta: link(item.contactCta, 'the contact action'),
    workHeading: heading(item.workHeading, 'the selected work heading'),
    archiveLink: link(item.archiveLink, 'the archive link'),
    aboutHeading: heading(item.aboutHeading, 'the About heading'),
    aboutIntro: text(item.aboutIntro, 'an About introduction'),
    aboutLink: link(item.aboutLink, 'the About link'),
  };
}

export function validateHome(value: unknown): true | string {
  try {
    readHomeEditorial(value);
    const { featuredProjects } = fields(value);
    if (featuredProjects == null) return true;
    if (!Array.isArray(featuredProjects)) return 'Choose projects for the featured list.';
    const keys = new Set<string>();
    for (const value of featuredProjects) {
      const item = fields(value);
      key(item._key, keys, 'featured project');
      if (item._type !== 'reference') return 'Featured projects must reference project documents.';
      text(item._ref, 'a featured project reference');
    }
    return true;
  } catch (error) {
    if (!(error instanceof HomeValidationError)) throw error;
    return error.message;
  }
}
