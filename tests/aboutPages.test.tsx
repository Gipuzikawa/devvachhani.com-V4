// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import { About } from '../src/pages/About';
import { Home } from '../src/pages/Home';
import { ContentProvider } from '../src/sanity/ContentProvider';
import { readAbout } from '../src/sanity/aboutContent';
import { phase3Seeds } from '../scripts/sanity/aboutTransform';
import { homeQuery } from './fixtures/homeQuery';

const preview = vi.hoisted(() => ({ status: 'public', revision: 0, refresh: vi.fn(), expire: vi.fn() }));
vi.mock('../src/sanity/PreviewProvider', () => ({ usePreview: () => preview }));
vi.mock('@gsap/react', () => ({ useGSAP: () => {} }));
vi.mock('../src/motion/core', () => ({ ScrollTrigger: {}, REVEAL_RISE: 12, DUR: { reveal: 1, slow: 1 }, EASE: {}, DECODE_CHARS: '' }));
afterEach(() => { cleanup(); preview.status = 'public'; preview.revision = 0; });

const seed = phase3Seeds()[0].build(new Map());
const doc = { ...seed, _id: 'aboutPage', _rev: 'first' };
function tree(transport: Parameters<typeof ContentProvider>[0]['transport'], home = false) {
  return <MemoryRouter><ContentProvider transport={transport}>{home ? <Home /> : <About />}</ContentProvider></MemoryRouter>;
}

it('preserves source biography and each heading, fact, toolkit group and principle in order', () => {
  const source = readFileSync('docs/sanity/fixtures/phase1-pages/About.tsx.snapshot', 'utf8').replace(/\s+/g, ' ');
  const page = readAbout(doc);
  expect(page.gaps).toEqual([]);
  for (const copy of [page.lead, ...page.biography, page.heading.title, page.toolkitHeading.title, page.approachHeading.title]) {
    expect(source).toContain(copy);
  }
  expect(page.facts.map(f => f.label)).toEqual(['Focus', 'Currently', 'Based', 'Looking for']);
  expect(page.skillGroups.map(g => g.tags.length)).toEqual([5, 5, 4]);
  expect(page.principles.map(p => p.title)).toEqual(['Build it end to end', 'Keep it legible', 'Measure, then trust']);
});

it('preserves shared fact identity through reorder and label edits on Home', async () => {
  const facts = structuredClone(seed.facts) as Array<{label: string; value: string}>;
  facts.reverse();
  facts[0].label = 'Seeking';
  const revisedFacts = [{ ...facts[0], label: 'Seeking collaborators' }, ...facts.slice(1)].reverse();
  preview.status = 'active';
  const transport = vi.fn().mockImplementation(async (name: string, active: boolean) => {
    if (name === 'homePage') return homeQuery();
    if (!active) return [doc];
    return preview.revision ? [{ ...doc, _rev: 'edited', facts: revisedFacts }] : [{ ...doc, facts }];
  });
  const view = render(tree(transport, true));
  const seekingRow = (await screen.findByText('Seeking')).parentElement;
  const draftFacts = seekingRow?.parentElement;
  const hero = screen.getByRole('heading', { level: 1 });
  expect(Array.from(draftFacts?.children ?? [], row => row.firstElementChild?.textContent)).toEqual(['Seeking', 'Focus']);
  expect(screen.queryByText('Currently')).toBeNull();
  expect(screen.queryByText('Based')).toBeNull();
  expect(transport.mock.calls).toContainEqual(['aboutPage', true, expect.any(AbortSignal), {}]);
  preview.revision++;
  view.rerender(tree(transport, true));
  expect((await screen.findByText('Seeking collaborators')).parentElement).toBe(seekingRow);
  expect(Array.from(draftFacts?.children ?? [], row => row.firstElementChild?.textContent)).toEqual(['Focus', 'Seeking collaborators']);
  expect(screen.getByRole('heading', { level: 1 })).toBe(hero);

  preview.status = 'public';
  view.rerender(tree(transport, true));
  expect(screen.queryByText('Seeking collaborators')).toBeNull();
  await screen.findByText('Looking for');
  expect(transport.mock.calls).toContainEqual(['aboutPage', false, expect.any(AbortSignal), {}]);
});

it('shows labelled gaps in preview, remounts on revision and clears draft content on exit', async () => {
  preview.status = 'active';
  const transport = vi.fn().mockResolvedValueOnce([{ ...doc, lead: null }])
    .mockResolvedValueOnce([{ ...doc, _rev: 'second', lead: 'Private revised lead' }]).mockResolvedValueOnce([doc]);
  const view = render(tree(transport));
  await screen.findByText('[Missing lead]');
  const first = screen.getByRole('main');
  preview.revision++;
  view.rerender(tree(transport));
  await screen.findByText('Private revised lead');
  expect(screen.getByRole('main')).not.toBe(first);
  preview.status = 'public';
  view.rerender(tree(transport));
  expect(screen.queryByText('Private revised lead')).toBeNull();
  await screen.findByText(String(seed.lead));
  expect(transport.mock.calls.map(call => call[1])).toEqual([true, true, false]);
});

it('distinguishes a missing singleton from malformed published data', async () => {
  const transport = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([{ ...doc, lead: null }]);
  const view = render(tree(transport));
  await screen.findByText('No content is available yet.');
  preview.revision++;
  view.rerender(tree(transport));
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('About content is incomplete'));
});
