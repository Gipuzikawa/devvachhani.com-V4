import type { SanityClient, QueryParams } from '@sanity/client';
import type { SanityClientLike } from '@sanity/preview-url-secret';

// In development the official helper logs malformed Studio URLs together with
// the secret URL. Reject malformed records before that diagnostic path runs.
export function validationClient(client: SanityClient, origin: string): SanityClientLike {
  return {
    config: () => client.config(),
    withConfig: options => validationClient(client.withConfig(options), origin),
    async fetch<R, Q>(query: string, params: Q, options: { tag?: string }): Promise<R> {
      const result: unknown = await client.fetch(query, params as QueryParams, options);
      if (result && typeof result === 'object') {
        for (const record of Object.values(result)) {
          if (!record || typeof record !== 'object' || !('secret' in record) || !record.secret) continue;
          if (!('studioUrl' in record) || typeof record.studioUrl !== 'string' || new URL(record.studioUrl).origin !== origin) {
            throw new Error('Invalid Studio origin');
          }
        }
      }
      return result as R;
    },
  };
}
