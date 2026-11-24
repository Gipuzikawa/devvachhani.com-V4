import { defineField, defineType } from 'sanity';
import { validateArticle } from '../../../src/sanity/articleValidation';

export const article = defineType({ name: 'article', title: 'Article', type: 'document', fields: [
  defineField({ name: 'sourceKey', type: 'string', readOnly: ({ value }) => Boolean(value), description: 'Migration identity; optional for new editorial articles.' }),
  defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 160 }, validation: rule => rule.required() }),
  defineField({ name: 'dek', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'publishedAt', title: 'Publication date', type: 'date', validation: rule => rule.required() }),
  defineField({ name: 'category', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'contentStatus', title: 'Content maturity', type: 'string', options: { list: ['placeholder', 'live'] }, initialValue: 'placeholder', validation: rule => rule.required() }),
  defineField({ name: 'relatedProject', type: 'reference', to: [{ type: 'project' }] }),
  defineField({ name: 'readingTimeOverride', title: 'Reading-time override (minutes)', type: 'number', validation: rule => rule.integer().min(1) }),
  defineField({ name: 'body', type: 'articleBody' }),
], validation: rule => rule.custom(validateArticle),
  orderings: [{ name: 'newest', title: 'Newest first', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'contentStatus' } },
});
