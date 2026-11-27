import { defineDocuments, defineLocations, type DocumentResolver, type PresentationPluginOptions } from 'sanity/presentation';

const home = { title: 'Home', href: '/' };
const about = { title: 'About', href: '/about' };
const work = { title: 'Work archive', href: '/work' };
const writing = { title: 'Writing index', href: '/writing' };

function validSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function fixedDocument(route: string, id: string): DocumentResolver {
  return { route, filter: '_type == $type && _id == $id', params: { type: id, id } };
}

export const resolve = {
  mainDocuments: defineDocuments([
    fixedDocument(home.href, 'homePage'),
    fixedDocument(about.href, 'aboutPage'),
    fixedDocument(work.href, 'workPage'),
    fixedDocument(writing.href, 'writingPage'),
    {
      route: '/work/:slug',
      resolve: ({ params: { slug } }) => validSlug(slug)
        ? { filter: '_type == "project" && detailEnabled == true && slug.current == $slug', params: { slug } }
        : undefined,
    },
    {
      route: '/writing/:slug',
      resolve: ({ params: { slug } }) => validSlug(slug)
        ? { filter: '_type == "article" && slug.current == $slug', params: { slug } }
        : undefined,
    },
  ]),
  locations: {
    homePage: defineLocations({ locations: [home] }),
    aboutPage: defineLocations({ locations: [about, { ...home, title: 'Home facts' }] }),
    workPage: defineLocations({ locations: [work] }),
    writingPage: defineLocations({ locations: [writing] }),
    siteSettings: defineLocations({ locations: [home, about, work, writing] }),
    article: defineLocations({ select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({ locations: [writing,
        ...(validSlug(doc?.slug) ?
          [{ title: doc.title || 'Article', href: `/writing/${doc.slug}` }] : [])] }),
    }),
    project: defineLocations({ select: { title: 'title', slug: 'slug.current', detailEnabled: 'detailEnabled' },
      resolve: doc => ({ locations: [work,
        ...(doc?.detailEnabled === true && validSlug(doc.slug) ?
          [{ title: doc.title || 'Project', href: `/work/${doc.slug}` }] : [])] }),
    }),
    discipline: defineLocations({
      select: { label: 'label' },
      resolve: doc => ({ locations: [{ title: `${doc?.label || 'Discipline'} — preview check`, href: '/work' }] }),
    }),
  },
} satisfies PresentationPluginOptions['resolve'];
