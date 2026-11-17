function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown) { return typeof value === 'string' && Boolean(value.trim()); }
function list(value: unknown, check: (item: unknown) => boolean) { return Array.isArray(value) && value.length > 0 && value.every(check); }
export function validateEnabledDetail(value: unknown): true | string {
  const project = object(value);
  if (!project.detailEnabled) return true;
  const detail = object(project.detail);
  const heading = (v: unknown) => text(object(v).title) && text(object(v).eyebrow);
  const figure = (v: unknown) => {
    const f = object(v);
    return text(f.caption) && typeof f.aspect === 'number' && f.aspect > 0 &&
      (f.mode === 'placeholder' || (f.mode === 'image' && text(object(object(f.image).asset)._ref) && text(f.alt)));
  };
  const r = object(detail.reflections);
  if (!text(object(project.slug).current) || !text(project.year) || !text(detail.intro) ||
    !list(detail.toolGroups, v => text(object(v).label) && list(object(v).items, text)) ||
    !list(detail.skills, text) || !list(detail.milestones, v => {
      const m = object(v); return text(m.date) && text(m.title) && text(m.body) && figure(m.figure);
    }) || !figure(detail.finalFigure) || !list(detail.specifications, v => text(object(v).label) && text(object(v).value)) ||
    !text(r.wentWell) || !text(r.challenges) || !text(r.closing) || !list(r.improvements, text) ||
    !['overviewHeading', 'timelineHeading', 'resultsHeading', 'reflectionsHeading'].every(key => heading(detail[key]))) {
    return 'Enabled project details need a slug, year, complete overview, timeline, results, reflections and section headings.';
  }
  return true;
}
