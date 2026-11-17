export type ContentResult<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'incomplete'; data: T }
  | { status: 'ready'; data: T };

export class PreviewExpiredError extends Error {}
