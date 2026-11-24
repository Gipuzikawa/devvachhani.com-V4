import { defineArrayMember, defineField, defineType } from 'sanity';
import { validateWritingPage } from '../../../src/sanity/articleValidation';
export const writingPage = defineType({ name: 'writingPage', title: 'Writing index', type: 'document', fields: [
  defineField({ name: 'sourceKey', type: 'string', readOnly: ({ value }) => Boolean(value), validation: rule => rule.required() }),
  defineField({ name: 'heading', type: 'sectionHeading', validation: rule => rule.required() }),
  defineField({ name: 'intro', type: 'text', validation: rule => rule.required() }),
  defineField({ name: 'plannedHeading', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'planned', type: 'array', of: [defineArrayMember({ type: 'plannedWriting' })], validation: rule => rule.required() }),
], validation: rule => rule.custom(validateWritingPage), preview: { prepare: () => ({ title: 'Writing index' }) } });
