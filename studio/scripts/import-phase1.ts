import { getCliClient } from 'sanity/cli';
import { readFileSync } from 'node:fs';
import { runImport, type UpdateApproval } from '../../scripts/sanity/import';
import { phase1Seeds } from '../../scripts/sanity/transform';
import { sanityStore } from '../../scripts/sanity/store';
import { summarize } from '../../scripts/sanity/report';

async function main() {
  const args = process.argv.slice(2);
  function option(name: string) {
    const index = args.indexOf(name);
    if (index === -1 || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('Explicit import options are required.');
    return args[index + 1];
  }
  const flags = new Set(['--project', '--dataset', '--phase', '--mode', '--manifest']);
  for (let index = 0; index < args.length; index += 2) {
    if (!flags.has(args[index]) || !args[index + 1]) throw new Error('Unknown import argument.');
  }
  if (new Set(args.filter((_, index) => index % 2 === 0)).size !== args.length / 2) throw new Error('Duplicate import arguments.');
  const projectId = option('--project');
  const dataset = option('--dataset');
  const phase = option('--phase');
  const mode = option('--mode');
  if (projectId !== 'oir24qey' || dataset !== 'development' || phase !== '1' ||
    !['dry-run', 'create-missing', 'update-reviewed'].includes(mode)) throw new Error('Only Phase 1 of the owned development project is enabled.');
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ projectId, dataset, useCdn: false, perspective: 'raw', timeout: 10_000 });
  let approvals: UpdateApproval[] = [];
  if (args.includes('--manifest')) {
    const value: unknown = JSON.parse(readFileSync(option('--manifest'), 'utf8'));
    if (!Array.isArray(value) || !value.every(entry => entry && typeof entry === 'object' &&
      Object.keys(entry).sort().join(',') === 'expectedRevision,id,sourceHash,sourceKey' &&
      ['expectedRevision', 'id', 'sourceHash', 'sourceKey'].every(key => typeof entry[key] === 'string' && entry[key].length > 0))) {
      throw new Error('Invalid reviewed update manifest.');
    }
    approvals = value;
  }
  const report = await runImport(sanityStore(client), phase1Seeds(), {
    phase: 1, dataset, mode: mode as 'dry-run' | 'create-missing' | 'update-reviewed', approvals,
  });
  console.log(JSON.stringify(summarize(report), null, 2));
}
main().catch(() => { console.error('Phase 1 import stopped. Check target, manifest, source-key conflicts and migration lock; no credentials logged.'); process.exitCode = 1; });
