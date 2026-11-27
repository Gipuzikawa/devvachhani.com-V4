import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { studioEnvironment } from './environment';
import { schemaTypes } from './schemaTypes';
import { singletonDocuments, structure } from './structure';
import { resolve } from './presentation/resolve';

const singletonTypes = new Set(singletonDocuments.map(singleton => singleton.schemaType));
const { projectId, dataset, origin } = studioEnvironment();
export default defineConfig({
  name: 'portfolio', title: 'Dev Vachhani — Portfolio', projectId, dataset,
  basePath: '/',
  plugins: [structureTool({ structure }), presentationTool({
    resolve, allowOrigins: [origin],
    previewUrl: { origin, previewMode: { enable: '/api/preview/enable' } },
  })],
  schema: { types: schemaTypes },
  document: {
    singletons: singletonDocuments,
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter(action => action.action !== 'duplicate' && action.action !== 'delete')
      : actions,
  },
});
