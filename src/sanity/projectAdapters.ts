import type { FigureData, ProjectData, ProjectDetail } from '../types';
import type { QueryResults } from './queryRegistry';
import { responsiveImage } from './images';

export class IncompleteContentError extends Error {}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new IncompleteContentError('Missing content fields.');
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new IncompleteContentError('Missing text.');
  return value;
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new IncompleteContentError('Missing list.');
  return value;
}
function nonempty(value: unknown) {
  const result = list(value); if (!result.length) throw new IncompleteContentError('An enabled detail has an empty section.'); return result;
}
function strings(value: unknown) { return list(value).map(text); }
export type Heading = { eyebrow: string; title: string };
function heading(value: unknown): Heading { const item = record(value); return { eyebrow: text(item.eyebrow), title: text(item.title) }; }
export type ArchiveProject = ProjectData & { id: string; disciplineIds: string[] };
export type ArchiveView = { key: string; heading: Heading; intro: string; allLabel: string; rowsLabel: string; gridLabel: string;
  projects: ArchiveProject[]; disciplines: { id: string; label: string }[] };
export type ProjectView = ProjectDetail & { contentKey: string; headings: { overview: Heading; timeline: Heading; results: Heading; reflections: Heading } };
function revisions(documents: unknown[]) { return documents.map(value => { const item = record(value); return `${text(item._id)}:${text(item._rev)}`; }).join('|'); }
function slug(value: unknown) {
  const current = text(record(value).current);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current) || current.length > 160) throw new IncompleteContentError('Invalid project slug.');
  return current;
}
export function projectCard(value: unknown, position: number): ProjectData {
  const item = record(value);
  if (typeof item.detailEnabled !== 'boolean') throw new IncompleteContentError('Project detail availability is missing.');
  // The cards originally omitted the year, which remains detail metadata.
  return { index: String(position + 1).padStart(2, '0'), title: text(item.title),
    summary: text(item.summary), tags: strings(item.tags), ...(item.detailEnabled ? { slug: slug(item.slug) } : {}) };
}
export function adaptArchive(value: QueryResults['workArchive']): ArchiveView {
  const raw = record(value);
  const settings = list(raw.settings);
  if (settings.length !== 1) throw new IncompleteContentError('The Work archive settings are missing.');
  const page = record(settings[0]);
  const rawProjects = list(raw.projects);
  const projects = rawProjects.map((value, position): ArchiveProject => {
    const item = record(value);
    return { ...projectCard(item, position), id: text(item._id), disciplineIds: strings(item.disciplineIds) };
  });
  const requiredIds = new Set(projects.flatMap(project => project.disciplineIds));
  const usedDisciplines = list(raw.disciplines).filter(value => requiredIds.has(String(record(value)._id)));
  const disciplines = usedDisciplines.map(value => { const item = record(value); return { id: text(item._id), label: text(item.label) }; });
  if (new Set(projects.map(item => item.id)).size !== projects.length || new Set(disciplines.map(item => item.id)).size !== requiredIds.size || projects.some(item => !item.disciplineIds.length)) {
    throw new IncompleteContentError('A project has missing discipline references.');
  }
  return { key: revisions([...settings, ...rawProjects, ...usedDisciplines]), heading: heading(page.heading), intro: text(page.intro),
    allLabel: text(page.allLabel), rowsLabel: text(page.rowsLabel), gridLabel: text(page.gridLabel), projects, disciplines };
}
export function figure(value: unknown, index: number, imageConfig?: { projectId: string; dataset: string }): FigureData {
  const item = record(value);
  const title = text(item.caption);
  if (typeof item.aspect !== 'number' || !Number.isFinite(item.aspect) || item.aspect <= 0) throw new IncompleteContentError('A figure needs an aspect ratio.');
  if (item.mode === 'placeholder') return { index, title, aspect: item.aspect };
  if (item.mode !== 'image') throw new IncompleteContentError('A figure needs a mode.');
  const image = record(item.image);
  const asset = image.assetId;
  if (typeof asset !== 'string' || !/^image-[a-zA-Z0-9]+-[1-9][0-9]*x[1-9][0-9]*-[a-z0-9]+$/.test(asset)) throw new IncompleteContentError('A figure image asset is missing.');
  try {
    return { index, title, aspect: item.aspect, alt: text(item.alt), ...responsiveImage({
      asset: { _ref: asset }, ...(image.crop ? { crop: record(image.crop) } : {}), ...(image.hotspot ? { hotspot: record(image.hotspot) } : {}),
    }, item.aspect, imageConfig) };
  } catch { throw new IncompleteContentError('A figure image is incomplete.'); }
}
export function adaptProject(value: QueryResults['projectPage'], imageConfig?: { projectId: string; dataset: string }): ProjectView | null {
  const raw = record(value);
  const projects = list(raw.projects);
  if (!projects.length) return null;
  if (projects.length !== 1) throw new IncompleteContentError('More than one project has this slug.');
  const project = record(projects[0]);
  const ids = list(raw.order).map(value => text(record(value)._id));
  const position = ids.indexOf(text(project._id));
  if (position < 0 || new Set(ids).size !== ids.length || project.detailEnabled !== true) throw new IncompleteContentError('Project ordering or detail availability is incomplete.');
  if (project.contentStatus !== 'placeholder' && project.contentStatus !== 'live') throw new IncompleteContentError('Project content status is missing.');
  const detail = record(project.detail);
  const milestones = nonempty(detail.milestones).map((value, position) => {
    const item = record(value); return { date: text(item.date), title: text(item.title), body: text(item.body), figure: figure(item.figure, position + 1, imageConfig) };
  });
  const reflections = record(detail.reflections);
  return { contentKey: `${revisions(projects)}:${position}`, slug: slug(project.slug), index: String(position + 1).padStart(2, '0'),
    title: text(project.title), year: text(project.year), status: project.contentStatus, intro: text(detail.intro),
    toolGroups: nonempty(detail.toolGroups).map(value => { const item = record(value); return { label: text(item.label), items: nonempty(item.items).map(text) }; }),
    skills: nonempty(detail.skills).map(text), milestones, finalFigure: figure(detail.finalFigure, milestones.length + 1, imageConfig),
    specs: nonempty(detail.specifications).map(value => { const item = record(value); return { k: text(item.label), v: text(item.value) }; }),
    reflections: { wentWell: text(reflections.wentWell), challenges: text(reflections.challenges), closing: text(reflections.closing), improvements: nonempty(reflections.improvements).map(text) },
    headings: { overview: heading(detail.overviewHeading), timeline: heading(detail.timelineHeading), results: heading(detail.resultsHeading), reflections: heading(detail.reflectionsHeading) },
  };
}
