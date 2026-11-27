import { validateHome } from '../../src/sanity/homeValidation';
import { readAbout } from '../../src/sanity/aboutContent';
import { randomUUID } from 'node:crypto';
import { fingerprint, canonical, type Body, type Seed } from './transform';
import { validateEnabledDetail } from '../../studio/schemaTypes/projectValidation';
import { validateArticle, validateWritingPage } from '../../src/sanity/articleValidation';

export type Existing = Body & { _id: string; _rev: string };
export type UpdateApproval = { sourceKey: string; id: string; expectedRevision: string; sourceHash: string };
export interface Store {
  read: (keys: string[]) => Promise<Existing[]>;
  create: (body: Body, singletonId?: string) => Promise<Existing>;
  update: (id: string, revision: string, body: Body) => Promise<void>;
  lock: (owner: string) => Promise<() => Promise<void>>;
}
export type ImportRow = { sourceKey: string; action: 'create' | 'skip' | 'update'; id?: string; revision?: string; sourceHash: string; differs: boolean; draft: boolean };
export type ImportPhase = 1 | 2 | 3 | 4;
export type ImportReport = { phase: ImportPhase; dataset: 'development'; mode: 'dry-run' | 'create-missing' | 'update-reviewed'; rows: ImportRow[] };

function readPublishedProjectId(existing: Existing[], sourceKey: string): string {
  const found = existing.filter(item => item.sourceKey === sourceKey && !item._id.startsWith('versions.'));
  if (found.some(item => item._type !== 'project') ||
    new Set(found.map(item => item._id.replace(/^drafts\./, ''))).size > 1) {
    throw new Error(`Ambiguous or conflicting featured project source key: ${sourceKey}`);
  }
  if (!found.length) throw new Error(`Featured project is absent: ${sourceKey}`);
  // An authenticated raw read can see private subpaths in a public dataset.
  const published = found.find(item => !item._id.includes('.'));
  if (published) return published._id;
  if (found.every(item => /^drafts\.[^.]+$/.test(item._id))) {
    throw new Error(`Featured project exists only as a draft: ${sourceKey}`);
  }
  throw new Error(`Featured project uses a private document ID: ${sourceKey}`);
}

export async function runImport(store: Store, seeds: Seed[], options: {
  phase: ImportPhase; dataset: 'development'; mode: ImportReport['mode']; approvals?: UpdateApproval[];
}): Promise<ImportReport> {
  if (![1, 2, 3, 4].includes(options.phase) || options.dataset !== 'development' || !['dry-run', 'create-missing', 'update-reviewed'].includes(options.mode)) throw new Error('Only explicit Phase 1–4 development imports are supported.');
  const allowedTypes = { 1: ['discipline', 'project', 'workPage'], 2: ['article', 'writingPage'], 3: ['aboutPage'], 4: ['homePage'] }[options.phase];
  if (seeds.some(seed => !allowedTypes.includes(seed.type))) throw new Error('Source types do not match the selected phase.');
  if (new Set(seeds.map(seed => seed.sourceKey)).size !== seeds.length) throw new Error('Duplicate source keys in import input.');
  const approvals = options.approvals ?? [];
  if (options.mode === 'update-reviewed' && !approvals.length) throw new Error('Reviewed update manifest is required.');
  if (options.mode !== 'update-reviewed' && approvals.length) throw new Error('Approval manifest requires update-reviewed mode.');
  if (new Set(approvals.map(entry => entry.sourceKey)).size !== approvals.length) throw new Error('Duplicate approvals.');
  const release = options.mode === 'dry-run' ? undefined : await store.lock(randomUUID());
  try {
    const projectKeys = options.phase === 4 ? [...new Set(seeds.flatMap(seed => seed.dependencies))] : [];
    const existing = await store.read([...seeds.map(seed => seed.sourceKey), ...projectKeys]);
    const ids = new Map(projectKeys.map(key => [key, readPublishedProjectId(existing, key)]));
    // Validate all source bodies before the first content mutation. Only
    // dependencies created by this same run can use report-only IDs.
    const provisional = new Map(ids);
    for (const seed of seeds) provisional.set(seed.sourceKey, seed.singletonId ?? `pending:${seed.sourceKey}`);
    for (const seed of seeds) {
      const body = seed.build(provisional);
      if (body._type !== seed.type || body.sourceKey !== seed.sourceKey ||
        (body._type === 'project' && validateEnabledDetail(body) !== true) ||
        (body._type === 'homePage' && validateHome(body) !== true) ||
        (body._type === 'aboutPage' && readAbout(body).gaps.length > 0) ||
        (body._type === 'article' && validateArticle(body) !== true) ||
        (body._type === 'writingPage' && validateWritingPage(body) !== true)) throw new Error('Invalid transformed source document.');
    }
    const matches = new Map<string, Existing[]>();
    // Preflight all ambiguous matches and singleton collisions before writing anything.
    for (const seed of seeds) {
      const found = existing.filter(item => item.sourceKey === seed.sourceKey ||
        (seed.singletonId && item._id.replace(/^drafts\./, '') === seed.singletonId));
      if (new Set(found.map(item => item._id.replace(/^drafts\./, ''))).size > 1 ||
        found.some(item => item._type !== seed.type || item.sourceKey !== seed.sourceKey ||
          (seed.singletonId && item._id.replace(/^drafts\./, '') !== seed.singletonId))) throw new Error(`Ambiguous or conflicting source key: ${seed.sourceKey}`);
      matches.set(seed.sourceKey, found);
      const chosen = found.find(item => !item._id.startsWith('drafts.')) ?? found[0];
      if (chosen) {
        if (seed.type === 'discipline' && chosen._id.startsWith('drafts.') && seeds.some(other => other.dependencies.includes(seed.sourceKey))) {
          throw new Error('A referenced discipline exists only as a draft; review it before importing projects.');
        }
        ids.set(seed.sourceKey, chosen._id);
      }
    }
    for (const approval of approvals) {
      const seed = seeds.find(item => item.sourceKey === approval.sourceKey);
      const found = matches.get(approval.sourceKey) ?? [];
      if (!seed || found.length !== 1 || found[0]._id.startsWith('drafts.') || found[0]._id !== approval.id ||
        found[0]._rev !== approval.expectedRevision) throw new Error('Update manifest no longer matches the target; no updates authorized.');
      const expected = seed.build(ids);
      if (fingerprint(expected) !== approval.sourceHash) throw new Error('Update manifest source hash has changed.');
    }
    if (options.mode === 'update-reviewed' && seeds.some(seed => !matches.get(seed.sourceKey)?.length)) {
      throw new Error('Reviewed updates require all source documents to exist.');
    }
    const rows: ImportRow[] = [];
    for (const seed of seeds) {
      // Dry-run placeholders are report-only and never sent to Sanity.
      for (const dependency of seed.dependencies) if (!ids.has(dependency)) throw new Error('Seeds are not in dependency order.');
      const body = seed.build(ids);
      const found = matches.get(seed.sourceKey) ?? [];
      const item = found.find(value => !value._id.startsWith('drafts.')) ?? found[0];
      const draft = found.some(value => value._id.startsWith('drafts.'));
      const differs = item ? canonical(Object.fromEntries(Object.keys(body).map(key => [key, item[key]]))) !== canonical(body) : false;
      const sourceHash = fingerprint(body);
      let action: ImportRow['action'] = item ? 'skip' : 'create';
      if (item && approvals.some(entry => entry.sourceKey === seed.sourceKey)) {
        await store.update(item._id, item._rev, body); action = 'update';
      } else if (!item && options.mode !== 'dry-run') {
        if (options.mode === 'update-reviewed') throw new Error('Reviewed updates cannot create missing documents.');
        const created = await store.create(body, seed.singletonId);
        ids.set(seed.sourceKey, created._id);
      } else if (!item) ids.set(seed.sourceKey, seed.singletonId ?? `pending:${seed.sourceKey}`);
      rows.push({ sourceKey: seed.sourceKey, action, id: item?._id ?? (options.mode !== 'dry-run' ? ids.get(seed.sourceKey) : undefined),
        revision: item?._rev, sourceHash, differs, draft });
    }
    return { phase: options.phase, dataset: 'development', mode: options.mode, rows };
  } finally { await release?.(); }
}
