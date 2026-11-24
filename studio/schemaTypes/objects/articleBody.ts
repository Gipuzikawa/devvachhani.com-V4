import { defineArrayMember, defineField, defineType } from 'sanity';
import { safeArticleHref, validateArticleBody } from '../../../src/sanity/articleValidation';

export const pullQuote = defineType({ name: 'pullQuote', title: 'Pull quote', type: 'object', fields: [
  defineField({ name: 'text', type: 'text', validation: rule => rule.required() }),
], preview: { select: { title: 'text' } } });
const marks = {
  decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }], annotations: [
    { name: 'link', type: 'object', title: 'Link', fields: [defineField({ name: 'href', type: 'string',
      validation: rule => rule.required().custom(value => safeArticleHref(value) || 'Use a safe relative, anchor, http, https or mailto link.') })] },
  ],
};
const inlineContent = () => defineField({ name: 'content', title: 'Text', type: 'array', of: [defineArrayMember({ type: 'block',
  styles: [{ title: 'Text', value: 'normal' }], lists: [], marks })], validation: rule => rule.required().length(1) });
// Sanity blocks cannot declare custom fields. Owned text objects expose anchor
// and drop-cap metadata; the adapter normalizes their rich text for the renderer.
export const articleHeading = defineType({ name: 'articleHeading', title: 'Heading', type: 'object', fields: [
  defineField({ name: 'level', type: 'string', initialValue: 'h2', options: { list: ['h2', 'h3'] }, validation: rule => rule.required() }),
  defineField({ name: 'sectionId', title: 'Section ID', type: 'string', description: 'Stable anchor, e.g. development. Keep existing IDs when editing headings.', validation: rule => rule.required() }),
  inlineContent(),
], preview: { select: { title: 'sectionId', subtitle: 'level' } } });
export const articleParagraph = defineType({ name: 'articleParagraph', title: 'Paragraph with drop cap', type: 'object', fields: [
  defineField({ name: 'dropCap', type: 'boolean', initialValue: true }), inlineContent(),
], preview: { prepare: () => ({ title: 'Paragraph with drop cap' }) } });
export const articleBody = defineType({ name: 'articleBody', title: 'Article body', type: 'array', of: [
  defineArrayMember({ type: 'block', styles: [{ title: 'Paragraph', value: 'normal' }],
    lists: [{ title: 'Bulleted list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }], marks,
  }),
  defineArrayMember({ type: 'articleHeading' }), defineArrayMember({ type: 'articleParagraph' }),
  defineArrayMember({ type: 'figure' }), defineArrayMember({ type: 'pullQuote' }),
], validation: rule => rule.required().custom(validateArticleBody) });
export const plannedWriting = defineType({ name: 'plannedWriting', title: 'Planned writing', type: 'object', fields: [
  defineField({ name: 'kind', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
] });
