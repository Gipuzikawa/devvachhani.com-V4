import { defineArrayMember, defineField, defineType } from 'sanity';
import { validateEnabledDetail } from '../projectValidation';
export const project = defineType({ name: 'project', title: 'Project', type: 'document',
  groups: [{ name: 'overview', title: 'Overview', default: true }, { name: 'detail', title: 'Detail, timeline & results' }],
  fields: [
    defineField({ name: 'sourceKey', type: 'string', group: 'overview', readOnly: ({ value }) => Boolean(value), validation: rule => rule.required() }),
    defineField({ name: 'title', type: 'string', group: 'overview', validation: rule => rule.required() }),
    defineField({ name: 'slug', type: 'slug', group: 'overview', options: { source: 'title' } }),
    defineField({ name: 'summary', type: 'text', group: 'overview', validation: rule => rule.required() }),
    defineField({ name: 'year', type: 'string', group: 'overview' }),
    defineField({ name: 'tags', type: 'array', group: 'overview', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'disciplines', type: 'array', group: 'overview', of: [defineArrayMember({ type: 'reference', to: [{ type: 'discipline' }] })], validation: rule => rule.required().min(1) }),
    defineField({ name: 'sortOrder', type: 'number', group: 'overview', validation: rule => rule.required().integer().min(0) }),
    defineField({ name: 'contentStatus', type: 'string', group: 'overview', options: { list: ['placeholder', 'live'] }, validation: rule => rule.required() }),
    defineField({ name: 'detailEnabled', type: 'boolean', group: 'overview', initialValue: false, validation: rule => rule.required() }),
    defineField({ name: 'detail', type: 'projectDetail', group: 'detail', hidden: ({ document }) => !document?.detailEnabled }),
  ], validation: rule => rule.custom(validateEnabledDetail),
  orderings: [{ title: 'Archive order', name: 'archive', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'sourceKey' } },
});
