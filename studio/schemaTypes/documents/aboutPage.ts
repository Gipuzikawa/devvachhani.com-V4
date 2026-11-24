import { defineArrayMember, defineField, defineType } from 'sanity';
import { readAbout } from '../../../src/sanity/aboutContent';

const requiredText = (name: string, type: 'string' | 'text' = 'string') =>
  defineField({ name, type, validation: rule => rule.required() });
const list = (name: string, type: string) => defineField({
  name, type: 'array', of: [defineArrayMember({ type })], validation: rule => rule.required().min(1),
});

export const aboutFact = defineType({ name: 'aboutFact', type: 'object', fields: [
  requiredText('label'), requiredText('value'),
  defineField({ name: 'showOnHome', type: 'boolean', initialValue: false }),
  defineField({ name: 'emphasized', type: 'boolean', initialValue: false }),
], preview: { select: { title: 'label', subtitle: 'value' } } });

export const principle = defineType({ name: 'principle', type: 'object', fields: [
  requiredText('title'), requiredText('body', 'text'),
] });

export const aboutPage = defineType({ name: 'aboutPage', title: 'About', type: 'document', fields: [
  defineField({ name: 'sourceKey', type: 'string', initialValue: 'about-page', readOnly: true }),
  ...['heading', 'toolkitHeading', 'approachHeading'].map(name =>
    defineField({ name, type: 'sectionHeading', validation: rule => rule.required() })),
  requiredText('lead', 'text'), list('biography', 'text'), list('facts', 'aboutFact'),
  list('skillGroups', 'toolGroup'), list('principles', 'principle'),
], validation: rule => rule.custom(value => readAbout(value).gaps.join(', ') || true),
preview: { prepare: () => ({ title: 'About' }) } });
