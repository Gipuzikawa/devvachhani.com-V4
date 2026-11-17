import type { StructureResolver } from 'sanity/structure';
export const structure: StructureResolver = S => S.list().title('Portfolio').items([
  S.listItem().title('Work archive').child(S.document().schemaType('workPage').documentId('workPage')),
  S.divider(),
  S.documentTypeListItem('project').title('Projects'),
  S.documentTypeListItem('discipline').title('Disciplines'),
]);
