export function studioEnvironment() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;
  const origin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
  if (!projectId || !dataset || !origin) {
    throw new Error('Configure Studio project ID, dataset and preview origin before running Studio.');
  }
  const url = new URL(origin);
  if (url.origin !== origin || url.protocol !== 'https:') {
    throw new Error('Studio preview origin must be an exact HTTPS origin.');
  }
  return { projectId, dataset, origin };
}
