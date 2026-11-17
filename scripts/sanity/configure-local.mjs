import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

// Deliberately captures CLI output: the returned token must never enter terminal logs.
const projectId = process.argv[2];
const origin = process.argv[3];
if (!projectId || !/^[a-z0-9]+$/.test(projectId) || !origin || new URL(origin).origin !== origin || !origin.startsWith('https://')) {
  throw new Error('Usage: node scripts/sanity/configure-local.mjs PROJECT_ID HTTPS_ORIGIN');
}
if (existsSync('.env.local') || existsSync('studio/.env.local')) throw new Error('Refusing to overwrite existing local configuration.');
try {
  const result = execFileSync(process.execPath, ['studio/node_modules/@sanity/cli/bin/run.js', 'tokens', 'create',
    'Portfolio development preview reader', '--project', projectId, '--role', 'viewer', '--yes', '--json'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const created = JSON.parse(result);
  if (!created.token || typeof created.token !== 'string') throw new Error('Unexpected token response');
  writeFileSync('.env.local', [
    `VITE_SANITY_PROJECT_ID=${projectId}`, 'VITE_SANITY_DATASET=development',
    `SANITY_PROJECT_ID=${projectId}`, 'SANITY_DATASET=development', `SITE_ORIGIN=${origin}`,
    `SANITY_API_READ_TOKEN=${created.token}`, `PREVIEW_SESSION_SECRET=${randomBytes(32).toString('hex')}`, '',
  ].join('\n'), { mode: 0o600, flag: 'wx' });
  writeFileSync('studio/.env.local', [
    `SANITY_STUDIO_PROJECT_ID=${projectId}`, 'SANITY_STUDIO_DATASET=development',
    `SANITY_STUDIO_PREVIEW_ORIGIN=${origin}`, '',
  ].join('\n'), { mode: 0o600, flag: 'wx' });
  console.log('Local development configuration written; Viewer token saved only in ignored .env.local.');
} catch {
  // Child process exceptions can embed stdout containing credentials.
  console.error('Local setup failed. Check Sanity access and existing token metadata before retrying.');
  process.exitCode = 1;
}
