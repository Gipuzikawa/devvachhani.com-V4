import { DISCIPLINES_QUERY } from './queries';
import type { DISCIPLINES_QUERY_RESULT } from './sanity.types';

export type QueryName = 'disciplines';
export type QueryResults = { disciplines: DISCIPLINES_QUERY_RESULT };
export const queryRegistry = { disciplines: DISCIPLINES_QUERY } as const;

export function parseQueryRequest(value: unknown): { name: QueryName; params: Record<string, never> } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid query request');
  const object = value as Record<string, unknown>;
  if (Object.keys(object).some(key => key !== 'name' && key !== 'params') || object.name !== 'disciplines') {
    throw new Error('Unknown query');
  }
  const params = object.params ?? {};
  if (!params || typeof params !== 'object' || Array.isArray(params) || Object.keys(params).length) {
    throw new Error('This query accepts no parameters');
  }
  return { name: 'disciplines', params: {} };
}
