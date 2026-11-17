import { defineField, defineType } from 'sanity';

export const discipline = defineType({
  name: 'discipline', title: 'Discipline', type: 'document',
  fields: [
    defineField({ name: 'sourceKey', title: 'Source key', type: 'string',
      description: 'Stable migration key; leave unchanged after import.',
      validation: rule => rule.required().regex(/^[a-z][a-z0-9-]{0,63}$/) }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: rule => rule.required().max(80) }),
    defineField({ name: 'sortOrder', title: 'Sort order', type: 'number', validation: rule => rule.required().integer().min(0) }),
  ],
  orderings: [{ title: 'Archive order', name: 'archiveOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: { select: { title: 'label', subtitle: 'sourceKey' } },
});
