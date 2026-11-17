import { describe, expect, it } from 'vitest';
import { adaptArticle, adaptWriting, articlePlainText, readingTime } from '../src/sanity/articleAdapters';
import { articleTextBlock, safeArticleHref, validateArticleBody } from '../src/sanity/articleValidation';
import { parseQueryRequest, validResult } from '../src/sanity/queryRegistry';
import { phase2Source } from '../scripts/sanity/writingSource';
import { phase2Seeds } from '../scripts/sanity/writingTransform';
import { writingQueries } from './fixtures/writingQueries';

describe('article source parity', () => {
  it('preserves all copy, anchors, maturity, drop cap, figure order and reading time', () => {
    const article = adaptArticle(writingQueries().detail)!;
    const original = phase2Source.articleDetails[0];
    expect(article.title).toBe(original.title); expect(article.date).toBe(original.date);
    expect(article.status).toBe('placeholder'); expect(article.readTime).toBe('6 min'); expect(article.dek).toBe(original.dek);
    expect(article.toc.map(item => item.id)).toEqual(['overview', 'development', 'testing', 'ahead']);
    expect(article.body.map(block => block._type === 'block' ? block.children.map(span => span.text).join('') : block._type === 'pullQuote' ? block.text : block.figure.title))
      .toEqual(original.blocks.map(block => block.type === 'figure' ? block.figure.title : block.text));
    expect(article.body.filter(block => block._type === 'block' && block.dropCap)).toHaveLength(1);
    expect(article.body.filter(block => block._type === 'figure').map(block => block.figure.index)).toEqual([1, 2, 3]);
    expect(phase2Seeds().map(seed => seed.build(new Map()))).toEqual(phase2Seeds().map(seed => seed.build(new Map())));
  });
  it('preserves the index date, heading, intro and three planned entries', () => {
    const index = adaptWriting(writingQueries().index);
    expect(index.articles.map(({ id: _id, ...rest }) => rest)).toEqual(phase2Source.articles);
    expect(index.planned.map(({ id: _id, ...rest }) => rest)).toEqual(phase2Source.planned);
    expect(index.heading).toEqual({ eyebrow: 'Writing — index', title: 'Essays, notebooks & field notes' });
    expect(index.intro).toBe(phase2Source.writingPage.intro);
  });
  it('derives reading time from rich text unless explicitly overridden', () => {
    const body = [{ _type: 'block', children: [{ text: 'word '.repeat(401) }] }];
    expect(readingTime(body, null)).toBe('3 min'); expect(readingTime(body, 6)).toBe('6 min');
    expect(() => readingTime(body, 0)).toThrow();
    expect(articlePlainText(writingQueries().detail[0].body)).toContain('Overview');
  });
  it('distinguishes absent content from incomplete and duplicate documents', () => {
    expect(adaptArticle([])).toBeNull();
    const detail = writingQueries().detail;
    expect(() => adaptArticle([...detail, ...detail])).toThrow('Duplicate');
    detail[0].body = null; expect(() => adaptArticle(detail)).toThrow();
    const index = writingQueries().index; index.settings = []; expect(() => adaptWriting(index)).toThrow();
    const empty = writingQueries().index; empty.articles = []; expect(adaptWriting(empty).articles).toEqual([]);
  });
});

describe('rich text validation and route contracts', () => {
  it.each(['javascript:alert(1)', 'data:text/html,x', '//evil.test', '/\\evil.test', '/%2fevil.test', '/%5cevil.test', 'https://user:pass@example.com', 'https://example.com/%0aX', '/bad\npath', 'not/a/path'])('rejects unsafe href %s', href => {
    expect(safeArticleHref(href)).toBe(false);
  });
  it.each(['/work/rc-f35-vtol', '#overview', 'https://example.com/a?q=x#b', 'http://example.com', 'mailto:hello@example.com'])('accepts safe href %s', href => {
    expect(safeArticleHref(href)).toBe(true);
  });
  it('rejects duplicate section IDs, broken marks, invalid lists and partial text objects', () => {
    const doc = phase2Seeds()[0].build(new Map()); const body = doc.body as Record<string, unknown>[];
    const heading = body[0];
    expect(validateArticleBody([heading, { ...heading, _key: 'other' }])).not.toBe(true);
    const block = articleTextBlock(body[1]);
    expect(validateArticleBody([{ ...block, markDefs: [{ _type: 'link', _key: 'bad', href: 'javascript:x' }] }])).not.toBe(true);
    expect(validateArticleBody([{ ...block, listItem: 'bullet', level: -1 }])).not.toBe(true);
    expect(validateArticleBody([{ ...body[1], content: [] }])).not.toBe(true);
    expect(validateArticleBody([{ ...block, children: [{ _type: 'span', _key: 'span', text: 'x', marks: ['missing'] }] }])).not.toBe(true);
  });
  it('bounds article slugs and prevents index parameters and arbitrary query overrides', () => {
    expect(parseQueryRequest({ name: 'articlePage', params: { slug: 'f35-development-update' } })).toEqual({ name: 'articlePage', params: { slug: 'f35-development-update' } });
    for (const slug of ['', '../x', 'a'.repeat(161), 'x/y']) expect(() => parseQueryRequest({ name: 'articlePage', params: { slug } })).toThrow();
    expect(() => parseQueryRequest({ name: 'writingIndex', params: { dataset: 'production' } })).toThrow();
    expect(() => parseQueryRequest({ name: 'articlePage', params: { slug: 'x', query: '*[]' } })).toThrow();
    expect(validResult('articlePage', [])).toBe(true); expect(validResult('articlePage', {})).toBe(false);
    expect(validResult('writingIndex', { settings: [], articles: [] })).toBe(true);
  });
});
