import type { ProjectData } from '../types';
import { readHomeEditorial } from './homeValidation';
import { IncompleteContentError, projectCard } from './projectAdapters';
import type { QueryResults } from './queryRegistry';

type FeaturedProject =
  | { key: string; card: ProjectData; href: string }
  | { key: string; card: null; notice: string };

export type HomeView = ReturnType<typeof readHomeEditorial> & {
  homeRevision: string;
  revision: string;
  featuredProjects: FeaturedProject[];
};

export function adaptHome(value: QueryResults['homePage'], preview = false): HomeView | null {
  if (!Array.isArray(value?.settings) || !Array.isArray(value.order)) throw new IncompleteContentError('Invalid Home response.');
  if (!value.settings.length) return null;
  const [page] = value.settings;
  if (value.settings.length !== 1 || page?._id !== 'homePage' || typeof page._rev !== 'string' || !page._rev.trim()) {
    throw new IncompleteContentError('Home settings are incomplete.');
  }
  const content = readHomeEditorial(page);
  const order = new Map<string, number>();
  for (const [index, item] of value.order.entries()) {
    if (typeof item?._id !== 'string' || !item._id.trim() || order.has(item._id)) {
      throw new IncompleteContentError('Home project ordering is incomplete.');
    }
    order.set(item._id, index);
  }
  const slots = page.featuredProjects ?? [];
  if (!Array.isArray(slots)) throw new IncompleteContentError('Home needs a valid featured project list.');
  const keys = new Set<string>();
  const featuredProjects: FeaturedProject[] = [];
  const revisions: Array<[string, string, string]> = [];
  for (const [index, slot] of slots.entries()) {
    const key = slot?._key;
    if (typeof key !== 'string' || !key.trim() || keys.has(key)) {
      throw new IncompleteContentError('Home needs unique featured project keys.');
    }
    keys.add(key);
    const project = slot.project;
    const position = project ? order.get(project._id) : undefined;
    let problem = 'unavailable';
    if (project) {
      problem = 'incomplete';
      try {
        if (position === undefined || project._id !== slot._ref || typeof project._rev !== 'string' || !project._rev.trim()) {
          throw new IncompleteContentError('Missing project identity or archive position.');
        }
        const card = projectCard(project, position);
        featuredProjects.push({ key, card, href: card.slug ? `/work/${card.slug}` : '/work' });
        revisions.push([key, project._rev, card.index]);
        continue;
      } catch (error) {
        if (!(error instanceof IncompleteContentError)) throw error;
      }
    }
    if (preview) {
      const notice = `Featured project ${index + 1} is ${problem}.`;
      featuredProjects.push({ key, card: null, notice });
      revisions.push([key, project?._rev ?? '', notice]);
    }
  }
  const homeRevision = page._rev;
  return { ...content, homeRevision, revision: JSON.stringify([homeRevision, revisions]), featuredProjects };
}
