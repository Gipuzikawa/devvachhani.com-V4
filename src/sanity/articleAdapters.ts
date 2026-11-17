import type { ArticleData, ArticleTextBlock, RichArticleBlock } from '../types';
import type { QueryResults } from './queryRegistry';
import { figure, IncompleteContentError, type Heading } from './projectAdapters';
import { articleTextBlock, validArticleDate, validateArticle } from './articleValidation';

const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new IncompleteContentError('Missing article fields.');
  return value as Record<string, unknown>;
};
const text = (value: unknown): string => {
  if (typeof value !== 'string' || !value.trim()) throw new IncompleteContentError('Missing article text.'); return value;
};
const list = (value: unknown): unknown[] => {
  if (!Array.isArray(value)) throw new IncompleteContentError('Missing article list.'); return value;
};
const revision = (value: Record<string, unknown>) => `${text(value._id)}:${text(value._rev)}`;
function date(value: unknown, short: boolean) {
  if (!validArticleDate(value)) throw new IncompleteContentError('Missing article publication date.');
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}
export function articlePlainText(body: unknown): string {
  return list(body).map(value => {
    const block = articleTextBlock(record(value));
    if (block._type === 'pullQuote') return text(block.text);
    return block._type === 'block' ? list(block.children).map(span => String(record(span).text ?? '')).join('') : '';
  }).join(' ');
}
export function readingTime(body: unknown, override: unknown): string {
  if (typeof override === 'number' && Number.isInteger(override) && override > 0) return `${override} min`;
  if (override !== null && override !== undefined) throw new IncompleteContentError('Invalid reading-time override.');
  const words = articlePlainText(body).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}
function metadata(item: Record<string, unknown>, short: boolean): ArticleData & { slug: string } {
  if (validateArticle(item) !== true) throw new IncompleteContentError('Complete the article fields in Studio.');
  return { title: text(item.title), slug: text(record(item.slug).current), dek: text(item.dek), category: text(item.category),
    date: date(item.publishedAt, short), readTime: readingTime(item.body, item.readingTimeOverride) };
}
export type WritingView = { key: string; heading: Heading; intro: string; plannedHeading: string;
  articles: (ArticleData & { id: string })[]; planned: { id: string; no: string; kind: string; title: string }[] };
export function adaptWriting(value: QueryResults['writingIndex']): WritingView {
  const raw = record(value); const settings = list(raw.settings);
  if (settings.length !== 1) throw new IncompleteContentError('Writing settings are missing.');
  const page = record(settings[0]); const heading = record(page.heading);
  const articles = list(raw.articles).map(value => { const item = record(value); return { id: text(item._id), ...metadata(item, true) }; });
  if (new Set(articles.map(item => item.id)).size !== articles.length || new Set(articles.map(item => item.slug)).size !== articles.length) throw new IncompleteContentError('Duplicate articles.');
  const planned = list(page.planned).map((value, index) => { const item = record(value); return { id: text(item._key), no: String(index + 1).padStart(2, '0'), kind: text(item.kind), title: text(item.title) }; });
  if (new Set(planned.map(item => item.id)).size !== planned.length) throw new IncompleteContentError('Duplicate planned entries.');
  return { key: [revision(page), ...list(raw.articles).map(item => revision(record(item)))].join('|'),
    heading: { eyebrow: text(heading.eyebrow), title: text(heading.title) }, intro: text(page.intro), plannedHeading: text(page.plannedHeading), articles, planned };
}
export type ArticleView = ArticleData & { slug: string; contentKey: string; status: 'placeholder' | 'live';
  body: RichArticleBlock[]; toc: { id: string; text: string; level: 'h2' | 'h3' }[] };
export function adaptArticle(value: QueryResults['articlePage'], imageConfig?: { projectId: string; dataset: string }): ArticleView | null {
  const articles = list(value);
  if (!articles.length) return null;
  if (articles.length !== 1) throw new IncompleteContentError('Duplicate article slug.');
  const item = record(articles[0]);
  // The optional dereferenced project is separate from the article's stored fields.
  const { relatedProject: _relatedProject, ...fields } = item;
  const meta = metadata(fields, false);
  let figureIndex = 0;
  const body = list(item.body).map((value): RichArticleBlock => {
    const block = articleTextBlock(record(value)); const _key = text(block._key);
    if (block._type === 'figure') return { _type: 'figure', _key, figure: figure(block, ++figureIndex, imageConfig) };
    if (block._type === 'pullQuote') return { _type: 'pullQuote', _key, text: text(block.text) };
    // validateArticle has checked every span, mark, style and metadata field.
    return block as unknown as ArticleTextBlock;
  });
  const toc = body.filter((block): block is ArticleTextBlock => block._type === 'block' && block.style !== 'normal')
    .map(block => ({ id: text(block.sectionId), text: block.children.map(span => span.text).join(''), level: block.style as 'h2' | 'h3' }));
  return { ...meta, contentKey: revision(item), status: item.contentStatus as 'placeholder' | 'live', body, toc };
}
