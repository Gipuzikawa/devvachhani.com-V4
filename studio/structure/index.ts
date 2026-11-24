import type { StructureResolver } from 'sanity/structure';
export const structure: StructureResolver = S => S.list().title('Portfolio').items([
  S.listItem().title('About').child(S.document().schemaType('aboutPage').documentId('aboutPage')),
  S.listItem().title('Work archive').child(S.document().schemaType('workPage').documentId('workPage')),
  S.listItem().title('Writing index').child(S.document().schemaType('writingPage').documentId('writingPage')),
  S.divider(),
  S.documentTypeListItem('project').title('Projects'),
  S.documentTypeListItem('article').title('Articles'),
  S.documentTypeListItem('discipline').title('Disciplines'),
]);
