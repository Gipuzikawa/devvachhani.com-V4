import { defineCliConfig } from 'sanity/cli';
import { studioEnvironment } from './environment';

const { projectId, dataset } = studioEnvironment();
export default defineCliConfig({
  api: { projectId, dataset },
  project: { basePath: '/studio' },
  typegen: {
    path: '../src/sanity/queries.ts',
    schema: './schema.json',
    generates: '../src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
});
