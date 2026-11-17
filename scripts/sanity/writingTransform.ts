import { figure, stableKey, type Seed } from './transform';
import { phase2Source } from './writingSource';
import { validateArticle } from '../../src/sanity/articleValidation';

export function phase2Seeds(source = phase2Source): Seed[] {
  if (source.articleDetails.length !== 1 || source.articles.length !== 1 || source.planned.length !== 3 ||
    source.articleDetails[0].slug !== 'f35-development-update' || source.articles[0].slug !== source.articleDetails[0].slug) {
    throw new Error('Review article source-key mapping before importing changed inventory.');
  }
  const articles: Seed[] = source.articleDetails.map(article => ({
    sourceKey: 'article-f35-development-update', type: 'article', dependencies: [], build: () => {
      const minutes = /^(\d+) min$/.exec(article.readTime);
      if (!minutes) throw new Error('Review source reading time.');
      const body = article.blocks.map((block, position) => {
        const _key = stableKey(`article:${position}:${block.type}`);
        if (block.type === 'figure') return { ...figure(block.figure), _key };
        if (block.type === 'pullquote') return { _type: 'pullQuote', _key, text: block.text };
        const content = { _type: 'block', _key, style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: stableKey(`${_key}:text`), text: block.text, marks: [] }] };
        if (block.type === 'heading') return { _type: 'articleHeading', _key, level: 'h2', sectionId: block.id, content: [content] };
        if (block.dropCap) return { _type: 'articleParagraph', _key, dropCap: true, content: [content] };
        return content;
      });
      const document = { _type: 'article', sourceKey: 'article-f35-development-update', title: article.title,
        slug: { _type: 'slug', current: article.slug }, dek: article.dek, publishedAt: source.publishedDates[article.slug],
        category: article.category, contentStatus: article.status, readingTimeOverride: Number(minutes[1]), body };
      if (validateArticle(document) !== true) throw new Error('Invalid transformed article.');
      return document;
    },
  }));
  return [...articles, { sourceKey: 'writing-page', type: 'writingPage', singletonId: 'writingPage', dependencies: [],
    build: () => ({ _type: 'writingPage', sourceKey: 'writing-page', ...source.writingPage,
      planned: source.planned.map(item => ({ _type: 'plannedWriting', _key: stableKey(`planned:${item.no}`), kind: item.kind, title: item.title })) }),
  }];
}
