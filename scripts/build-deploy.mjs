import { execFileSync } from 'node:child_process';
import { cpSync } from 'node:fs';

// Invoke npm through Node so this works without shell quoting on Windows.
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run through npm run build:deploy.');
for (const args of [['run', 'server:check'], ['run', 'test'], ['run', 'build'],
  ['run', 'studio:check'], ['run', 'studio:build']]) {
  execFileSync(process.execPath, [npm, ...args], { stdio: 'inherit' });
}
cpSync('studio/dist', 'dist/studio', { recursive: true });
execFileSync(process.execPath, [npm, 'run', 'check:bundles'], { stdio: 'inherit' });
