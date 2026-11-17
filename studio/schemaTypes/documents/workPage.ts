import { defineField, defineType } from 'sanity';
export const workPage = defineType({ name: 'workPage', title: 'Work archive', type: 'document', fields: [
  defineField({ name: 'sourceKey', type: 'string', readOnly: true, initialValue: 'work-page', validation: rule => rule.required() }),
  defineField({ name: 'heading', type: 'sectionHeading', validation: rule => rule.required() }),
  defineField({ name: 'intro', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'allLabel', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'rowsLabel', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'gridLabel', type: 'string', validation: rule => rule.required() }),
], preview: { prepare: () => ({ title: 'Work archive' }) } });
