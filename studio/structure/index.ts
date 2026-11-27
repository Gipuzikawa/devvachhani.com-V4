import type { StructureResolver } from 'sanity/structure';

export const singletonDocuments = [
  { documentId: 'homePage', schemaType: 'homePage', title: 'Home' },
  { documentId: 'aboutPage', schemaType: 'aboutPage', title: 'About' },
  { documentId: 'workPage', schemaType: 'workPage', title: 'Work archive' },
  { documentId: 'writingPage', schemaType: 'writingPage', title: 'Writing index' },
  { documentId: 'siteSettings', schemaType: 'siteSettings', title: 'Site settings' },
];

export const structure: StructureResolver = S => S.list().title('Portfolio').items([
  // Studio edit intents address singleton panes by document ID.
  ...singletonDocuments.map(({ documentId }) => S.listItem().singleton(documentId)),
  S.divider(),
  S.documentTypeListItem('project').title('Projects'),
  S.documentTypeListItem('article').title('Articles'),
  S.documentTypeListItem('discipline').title('Disciplines'),
]);
