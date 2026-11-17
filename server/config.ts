export type PreviewConfig = { projectId: string; dataset: string; origin: string; token: string; secret: string };
export const SANITY_API_VERSION = '2026-10-01';

export function getConfig(env: NodeJS.ProcessEnv = process.env): PreviewConfig {
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_DATASET;
  const origin = env.SITE_ORIGIN;
  const token = env.SANITY_API_READ_TOKEN;
  const secret = env.PREVIEW_SESSION_SECRET;
  if (!projectId || !/^[a-z0-9]+$/.test(projectId) || !dataset || !/^[a-z0-9_-]+$/.test(dataset) ||
    !origin || !token || !secret || secret.length < 32) throw new Error('Preview is not configured');
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== origin) throw new Error('An exact HTTPS site origin is required');
  return { projectId, dataset, origin, token, secret };
}
