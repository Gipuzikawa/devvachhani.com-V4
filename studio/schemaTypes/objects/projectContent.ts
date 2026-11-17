import { defineArrayMember, defineField, defineType } from 'sanity';

const disabledDetail = (document?: { _type?: string; detailEnabled?: unknown }) => document?._type === 'project' && document.detailEnabled !== true;
export const sectionHeading = defineType({ name: 'sectionHeading', title: 'Section heading', type: 'object', fields: [
  defineField({ name: 'eyebrow', type: 'string' }),
  defineField({ name: 'title', type: 'string' }),
], validation: rule => rule.custom((value, context) => disabledDetail(context.document) ||
  (typeof value?.title === 'string' && value.title.trim() && typeof value.eyebrow === 'string' && value.eyebrow.trim()) ? true : 'A section needs an eyebrow and title.') });
export const figure = defineType({ name: 'figure', title: 'Figure', type: 'object', fields: [
  defineField({ name: 'mode', type: 'string', initialValue: 'placeholder', options: { list: ['placeholder', 'image'] } }),
  defineField({ name: 'caption', type: 'string' }),
  defineField({ name: 'aspect', type: 'number', initialValue: 1.5 }),
  defineField({ name: 'image', type: 'image', options: { hotspot: true }, hidden: ({ parent }) => parent?.mode !== 'image' }),
  defineField({ name: 'alt', title: 'Alternative text', type: 'string', hidden: ({ parent }) => parent?.mode !== 'image' }),
], validation: rule => rule.custom((value, context) => {
  if (disabledDetail(context.document)) return true;
  if (!value || !['placeholder', 'image'].includes(String(value.mode)) || typeof value.caption !== 'string' || !value.caption.trim() ||
    typeof value.aspect !== 'number' || !Number.isFinite(value.aspect) || value.aspect <= 0) return 'A figure needs a mode, caption and positive aspect ratio.';
  if (value?.mode !== 'image') return true;
  const image = value.image as { asset?: { _ref?: string } } | undefined;
  return image?.asset?._ref && typeof value.alt === 'string' && value.alt.trim() ? true : 'Image figures require an asset and descriptive alternative text.';
}) });
export const toolGroup = defineType({ name: 'toolGroup', type: 'object', fields: [
  defineField({ name: 'label', type: 'string' }),
  defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
] });
export const projectMilestone = defineType({ name: 'projectMilestone', type: 'object', fields: [
  defineField({ name: 'date', type: 'string' }), defineField({ name: 'title', type: 'string' }),
  defineField({ name: 'body', type: 'text' }), defineField({ name: 'figure', type: 'figure' }),
], preview: { select: { title: 'title', subtitle: 'date' } } });
export const specification = defineType({ name: 'specification', type: 'object', fields: [
  defineField({ name: 'label', type: 'string' }), defineField({ name: 'value', type: 'string' }),
] });
export const reflections = defineType({ name: 'reflections', type: 'object', fields: [
  defineField({ name: 'wentWell', type: 'text' }), defineField({ name: 'challenges', type: 'text' }),
  defineField({ name: 'improvements', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
  defineField({ name: 'closing', type: 'text' }),
] });
export const projectDetail = defineType({ name: 'projectDetail', type: 'object',
  groups: [{ name: 'detail', title: 'Detail', default: true }, { name: 'timeline', title: 'Timeline' }, { name: 'results', title: 'Results' }], fields: [
  defineField({ name: 'intro', type: 'text', group: 'detail' }),
  defineField({ name: 'toolGroups', type: 'array', group: 'detail', of: [defineArrayMember({ type: 'toolGroup' })] }),
  defineField({ name: 'skills', type: 'array', group: 'detail', of: [defineArrayMember({ type: 'string' })] }),
  defineField({ name: 'milestones', type: 'array', group: 'timeline', of: [defineArrayMember({ type: 'projectMilestone' })] }),
  defineField({ name: 'finalFigure', type: 'figure', group: 'results' }),
  defineField({ name: 'specifications', type: 'array', group: 'results', of: [defineArrayMember({ type: 'specification' })] }),
  defineField({ name: 'reflections', type: 'reflections', group: 'results' }),
  defineField({ name: 'overviewHeading', type: 'sectionHeading', group: 'detail' }),
  defineField({ name: 'timelineHeading', type: 'sectionHeading', group: 'timeline' }),
  defineField({ name: 'resultsHeading', type: 'sectionHeading', group: 'results' }),
  defineField({ name: 'reflectionsHeading', type: 'sectionHeading', group: 'results' }),
] });
