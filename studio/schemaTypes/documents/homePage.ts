import { defineArrayMember, defineField, defineType } from 'sanity';
import { HERO_LINES, HERO_RUNS_PER_LINE, HERO_RUN_LENGTH, safeHomeHref, validateHome } from '../../../src/sanity/homeValidation';

export const heroRun = defineType({
  name: 'heroRun', title: 'Text run', type: 'object',
  fields: [
    defineField({ name: 'text', type: 'string', description: 'Spaces between runs are kept.', validation: rule => rule.required().max(HERO_RUN_LENGTH) }),
    defineField({ name: 'emphasis', type: 'boolean', title: 'Emphasize', initialValue: false }),
  ],
  preview: { select: { title: 'text' } },
});

export const heroLine = defineType({
  name: 'heroLine', title: 'Hero line', type: 'object',
  fields: [
    defineField({ name: 'runs', type: 'array', of: [defineArrayMember({ type: 'heroRun' })],
      validation: rule => rule.required().min(1).max(HERO_RUNS_PER_LINE) }),
  ],
  preview: { select: { first: 'runs.0.text', second: 'runs.1.text' },
    prepare: ({ first, second }) => ({ title: first ? first + (second ?? '') : 'Hero line' }) },
});

export const homeLink = defineType({
  name: 'homeLink', title: 'Home link', type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'href', title: 'Destination', type: 'string', description: 'Use a site path such as /work or an anchor such as #contact.',
      validation: rule => rule.required().custom(value => safeHomeHref(value) || 'Enter a same-site path or anchor.') }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

const requiredText = (name: string, title: string, type: 'string' | 'text' = 'string') =>
  defineField({ name, title, type, validation: rule => rule.required() });

export const homePage = defineType({
  name: 'homePage', title: 'Home', type: 'document',
  fields: [
    defineField({ name: 'sourceKey', type: 'string', initialValue: 'home-page', readOnly: true }),
    requiredText('metaAccent', 'First metadata label'),
    requiredText('metaMuted', 'Second metadata label'),
    defineField({ name: 'heroLines', type: 'array', of: [defineArrayMember({ type: 'heroLine' })],
      validation: rule => rule.required().length(HERO_LINES) }),
    requiredText('heroLead', 'Hero introduction', 'text'),
    defineField({ name: 'primaryCta', title: 'Primary action', type: 'homeLink', validation: rule => rule.required() }),
    defineField({ name: 'contactCta', title: 'Contact action', type: 'homeLink', validation: rule => rule.required() }),
    defineField({ name: 'workHeading', title: 'Selected work heading', type: 'sectionHeading', validation: rule => rule.required() }),
    defineField({ name: 'featuredProjects', type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })], validation: rule => rule.unique() }),
    defineField({ name: 'archiveLink', title: 'Archive link', type: 'homeLink', validation: rule => rule.required() }),
    defineField({ name: 'aboutHeading', title: 'About heading', type: 'sectionHeading', validation: rule => rule.required() }),
    requiredText('aboutIntro', 'About introduction', 'text'),
    defineField({ name: 'aboutLink', title: 'About link', type: 'homeLink', validation: rule => rule.required() }),
  ],
  validation: rule => rule.custom(validateHome),
  preview: { prepare: () => ({ title: 'Home' }) },
});
