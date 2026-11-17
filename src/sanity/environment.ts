export function publicConfig() {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
  const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;
  return projectId && dataset ? { projectId, dataset } : null;
}
