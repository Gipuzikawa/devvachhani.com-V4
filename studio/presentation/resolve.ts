import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    discipline: defineLocations({
      select: { label: 'label' },
      resolve: doc => ({ locations: [{ title: `${doc?.label || 'Discipline'} — preview check`, href: '/work' }] }),
    }),
  },
};
