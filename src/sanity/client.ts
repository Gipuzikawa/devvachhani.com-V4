import { createClient } from '@sanity/client';
import { publicConfig } from './environment';
export function publishedClient() {
  const config = publicConfig();
  if (!config) throw new Error('Content is not configured');
  return createClient({ ...config, apiVersion: '2026-10-01', useCdn: true, perspective: 'published', timeout: 10_000 });
}
