import { DISCIPLINES_QUERY, WORK_ARCHIVE_QUERY, PROJECT_PAGE_QUERY } from './queries';
import type { DISCIPLINES_QUERY_RESULT, WORK_ARCHIVE_QUERY_RESULT, PROJECT_PAGE_QUERY_RESULT } from './sanity.types';

export type QueryName = 'disciplines' | 'workArchive' | 'projectPage';
export type QueryResults = { disciplines: DISCIPLINES_QUERY_RESULT; workArchive: WORK_ARCHIVE_QUERY_RESULT; projectPage: PROJECT_PAGE_QUERY_RESULT };
export const queryRegistry = { disciplines: DISCIPLINES_QUERY, workArchive: WORK_ARCHIVE_QUERY, projectPage: PROJECT_PAGE_QUERY } as const;

export function parseQueryRequest(value: unknown): { name: QueryName; params: Record<string, string> } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid query request');
  const object = value as Record<string, unknown>;
  if (Object.keys(object).some(key => key !== 'name' && key !== 'params') ||
    typeof object.name !== 'string' || !Object.hasOwn(queryRegistry, object.name)) {
    throw new Error('Unknown query');
  }
  const params = object.params ?? {};
  if (!params || typeof params !== 'object' || Array.isArray(params)) throw new Error('Invalid parameters');
  if (object.name === 'projectPage') {
    const slug = (params as Record<string, unknown>).slug;
    if (Object.keys(params).join(',') !== 'slug' || typeof slug !== 'string' || slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid project slug');
    return { name: 'projectPage', params: { slug } };
  }
  if (Object.keys(params).length) throw new Error('This query accepts no parameters');
  return { name: object.name as QueryName, params: {} };
}

export function validResult(name: QueryName, value: unknown) {
  if (name === 'disciplines') return Array.isArray(value);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const result = value as Record<string, unknown>;
  return Array.isArray(result.projects) && (name === 'workArchive' ? Array.isArray(result.settings) && Array.isArray(result.disciplines) : Array.isArray(result.order));
}
