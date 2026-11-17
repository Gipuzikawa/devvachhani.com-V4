import { createClient } from '@sanity/client';
import { SANITY_API_VERSION, type PreviewConfig } from './config';

export function draftClient(config: PreviewConfig) {
  return createClient({ projectId: config.projectId, dataset: config.dataset,
    apiVersion: SANITY_API_VERSION, token: config.token, useCdn: false, perspective: 'drafts', timeout: 10_000 });
}
