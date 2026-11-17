/** Shared by Studio, the importer and the render boundary; API writes bypass Studio rules. */
export function safeArticleHref(value: unknown): value is string {
  const unsafeCharacter = (input: string) => [...input].some(char => char === '\\' || char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
  if (typeof value !== 'string' || !value || /\s/.test(value) || unsafeCharacter(value)) return false;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return false; }
  if (unsafeCharacter(decoded)) return false;
  if (/^#[a-zA-Z0-9_-]*$/.test(value)) return true;
  if (value.startsWith('/')) return !decoded.startsWith('//');
  if (/^mailto:[^@?]+@[^@?]+(?:\?[^\s]*)?$/.test(value)) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try { const url = new URL(value); return Boolean(url.hostname) && !url.username && !url.password; } catch { return false; }
}

const object = (value: unknown): Record<string, unknown> | undefined => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
const text = (value: unknown): value is string => typeof value === 'string' && Boolean(value.trim());
export function articleTextBlock(block: Record<string, unknown>): Record<string, unknown> {
  if (block._type !== 'articleHeading' && block._type !== 'articleParagraph') return block;
  const content = Array.isArray(block.content) && block.content.length === 1 ? object(block.content[0]) : undefined;
  if (!content || content._type !== 'block' || content.style !== 'normal' || content.listItem) return {};
  return { ...content, _key: block._key, style: block._type === 'articleHeading' ? block.level : 'normal',
    ...(block._type === 'articleHeading' ? { sectionId: block.sectionId } : { dropCap: block.dropCap }) };
}
export function validArticleDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
export function validateArticleBody(value: unknown): true | string {
  if (!Array.isArray(value) || !value.length) return 'Add article body content.';
  const keys = new Set<string>();
  const sections = new Set<string>();
  for (const raw of value) {
    let block = object(raw);
    if (!block || !text(block._key) || keys.has(block._key)) return 'Body blocks need unique keys.';
    keys.add(block._key);
    block = articleTextBlock(block);
    if (block._type === 'figure') {
      const image = object(block.image);
      if (!['placeholder', 'image'].includes(String(block.mode)) || !text(block.caption) ||
        typeof block.aspect !== 'number' || !Number.isFinite(block.aspect) || block.aspect <= 0 ||
        (block.mode === 'image' && (!text(object(image?.asset)?._ref) || !text(block.alt)))) return 'Complete the figure mode, caption, ratio and image/alt fields.';
      continue;
    }
    if (block._type === 'pullQuote') { if (!text(block.text)) return 'Add pull quote text.'; continue; }
    if (block._type !== 'block' || !['normal', 'h2', 'h3'].includes(String(block.style))) return 'Unsupported article block.';
    if (block.style !== 'normal') {
      if (!text(block.sectionId) || !/^[a-z][a-z0-9-]*$/.test(block.sectionId) || sections.has(block.sectionId)) return 'Headings need unique section IDs (lowercase letters, numbers and hyphens).';
      sections.add(block.sectionId);
      if (block.listItem || block.dropCap) return 'Heading blocks cannot be list items or drop caps.';
    }
    if (block.dropCap !== undefined && typeof block.dropCap !== 'boolean') return 'Invalid drop cap flag.';
    if (block.listItem !== undefined && (!['bullet', 'number'].includes(String(block.listItem)) || block.dropCap ||
      typeof block.level !== 'number' || !Number.isInteger(block.level) || block.level < 1 || block.level > 10)) return 'Invalid list style or nesting level.';
    if (!Array.isArray(block.markDefs) || !Array.isArray(block.children) || !block.children.length) return 'Complete the text block.';
    const marks = new Set<string>(['strong', 'em']);
    for (const rawMark of block.markDefs) {
      const mark = object(rawMark);
      if (!mark || !text(mark._key) || marks.has(mark._key) || mark._type !== 'link' || !safeArticleHref(mark.href)) return 'Use a safe relative, anchor, http, https or mailto link.';
      marks.add(mark._key);
    }
    const spanKeys = new Set<string>();
    let content = '';
    for (const rawSpan of block.children) {
      const span = object(rawSpan);
      if (!span || span._type !== 'span' || !text(span._key) || spanKeys.has(span._key) || typeof span.text !== 'string' ||
        !Array.isArray(span.marks) || !span.marks.every(mark => typeof mark === 'string' && marks.has(mark))) return 'Unsupported or incomplete inline content.';
      spanKeys.add(span._key); content += span.text;
    }
    if (!content.trim()) return 'Text blocks must contain text.';
  }
  return true;
}
export function validateArticle(value: unknown): true | string {
  const doc = object(value);
  if (!doc || !text(doc.title) || !text(doc.dek) || !text(doc.category) ||
    !text(object(doc.slug)?.current) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(object(doc.slug)?.current)) ||
    String(object(doc.slug)?.current).length > 160 || !validArticleDate(doc.publishedAt) ||
    !['placeholder', 'live'].includes(String(doc.contentStatus))) return 'Complete article title, slug, dek, date, category and content maturity.';
  if (doc.readingTimeOverride !== undefined && doc.readingTimeOverride !== null &&
    (typeof doc.readingTimeOverride !== 'number' || !Number.isInteger(doc.readingTimeOverride) || doc.readingTimeOverride < 1)) return 'Reading-time override must be a positive whole number.';
  if (doc.relatedProject !== undefined && doc.relatedProject !== null &&
    (object(doc.relatedProject)?._type !== 'reference' || !text(object(doc.relatedProject)?._ref))) return 'Invalid related project reference.';
  return validateArticleBody(doc.body);
}

export function validateWritingPage(value: unknown): true | string {
  const doc = object(value); const heading = object(doc?.heading);
  if (!doc || !text(heading?.eyebrow) || !text(heading?.title) || !text(doc.intro) || !text(doc.plannedHeading) ||
    !Array.isArray(doc.planned)) return 'Complete the Writing heading, introduction and planned-writing list.';
  const keys = new Set<string>();
  for (const raw of doc.planned) {
    const entry = object(raw);
    if (!entry || !text(entry._key) || keys.has(entry._key) || !text(entry.kind) || !text(entry.title)) return 'Complete planned entries with unique keys, kinds and titles.';
    keys.add(entry._key);
  }
  return true;
}
