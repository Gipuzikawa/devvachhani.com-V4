import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { studioEnvironment } from './environment';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';
import { resolve } from './presentation/resolve';

const singletonTypes = ['homePage', 'workPage', 'writingPage', 'aboutPage'];
const { projectId, dataset, origin } = studioEnvironment();
export default defineConfig({
  name: 'portfolio', title: 'Dev Vachhani — Portfolio', projectId, dataset,
  basePath: '/',
  plugins: [structureTool({ structure }), presentationTool({
    resolve, allowOrigins: [origin],
    previewUrl: { origin, previewMode: { enable: '/api/preview/enable' } },
  })],
  schema: { types: schemaTypes, templates: templates => templates.filter(template => !singletonTypes.includes(template.schemaType)) },
  document: { actions: (actions, context) => singletonTypes.includes(context.schemaType) ?
    actions.filter(action => action.action !== 'duplicate' && action.action !== 'delete') : actions },
});
