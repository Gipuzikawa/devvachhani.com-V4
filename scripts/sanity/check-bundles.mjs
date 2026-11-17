import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const secrets = ['SANITY_API_READ_TOKEN', 'PREVIEW_SESSION_SECRET', 'SANITY_IMPORT_TOKEN']
  .map(name => process.env[name]).filter(Boolean);
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inspect(path);
    else if (/\.(js|html|json|map)$/.test(path)) {
      const content = readFileSync(path, 'utf8');
      if (secrets.some(secret => content.includes(secret))) throw new Error('A server credential was found in browser output.');
    }
  }
}
if (!existsSync('dist/index.html')) throw new Error('Build the frontend before checking bundles.');
inspect('dist');
if (existsSync('studio/dist')) inspect('studio/dist');
console.log(`PASS: browser output contains none of the ${secrets.length} configured server credentials.`);
