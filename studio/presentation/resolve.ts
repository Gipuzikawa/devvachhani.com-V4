import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    aboutPage: defineLocations({ locations: [{ title: 'About', href: '/about' }, { title: 'Home facts', href: '/' }] }),
    writingPage: defineLocations({ locations: [{ title: 'Writing index', href: '/writing' }] }),
    article: defineLocations({ select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({ locations: [{ title: 'Writing index', href: '/writing' },
        ...(typeof doc?.slug === 'string' && doc.slug.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug) ?
          [{ title: doc.title || 'Article', href: `/writing/${doc.slug}` }] : [])] }),
    }),
    workPage: defineLocations({ locations: [{ title: 'Work archive', href: '/work' }] }),
    project: defineLocations({ select: { title: 'title', slug: 'slug.current', detailEnabled: 'detailEnabled' },
      resolve: doc => ({ locations: [{ title: 'Work archive', href: '/work' },
        ...(doc?.detailEnabled && typeof doc.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug) ?
          [{ title: doc.title || 'Project', href: `/work/${doc.slug}` }] : [])] }),
    }),
    discipline: defineLocations({
      select: { label: 'label' },
      resolve: doc => ({ locations: [{ title: `${doc?.label || 'Discipline'} — preview check`, href: '/work' }] }),
    }),
  },
};
