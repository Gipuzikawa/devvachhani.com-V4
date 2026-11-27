import type { StructureResolver } from 'sanity/structure';

export const singletonDocuments = [
  { id: 'home', documentId: 'homePage', schemaType: 'homePage', title: 'Home' },
  { id: 'about', documentId: 'aboutPage', schemaType: 'aboutPage', title: 'About' },
  { id: 'workArchive', documentId: 'workPage', schemaType: 'workPage', title: 'Work archive' },
  { id: 'writingIndex', documentId: 'writingPage', schemaType: 'writingPage', title: 'Writing index' },
  { id: 'siteSettings', documentId: 'siteSettings', schemaType: 'siteSettings', title: 'Site settings' },
];

export const structure: StructureResolver = S => S.list().title('Portfolio').items([
  ...singletonDocuments.map(({ id }) => S.listItem().singleton(id)),
  S.divider(),
  S.documentTypeListItem('project').title('Projects'),
  S.documentTypeListItem('article').title('Articles'),
  S.documentTypeListItem('discipline').title('Disciplines'),
]);
