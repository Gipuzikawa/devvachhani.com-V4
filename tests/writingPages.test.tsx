// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContentProvider } from '../src/sanity/ContentProvider';
import type { QueryResults } from '../src/sanity/queryRegistry';
import type { PreviewStatus } from '../src/sanity/PreviewProvider';
import { ArticlePage } from '../src/pages/ArticlePage';
import { Writing } from '../src/pages/Writing';
import { writingQueries } from './fixtures/writingQueries';

const state = vi.hoisted(() => ({ status: 'public' as PreviewStatus, revision: 0, refresh: vi.fn(), expire: vi.fn() }));
vi.mock('../src/sanity/PreviewProvider', () => ({ usePreview: () => ({ ...state }) }));
// These tests exercise actual content transport/route lifecycles, with motion stubbed.
vi.mock('@gsap/react', () => ({ useGSAP: () => {} }));
vi.mock('../src/motion/core', () => ({ ScrollTrigger: {} }));
vi.mock('../src/hooks/useReveal', () => ({ useReveal: () => React.useRef(null) }));
vi.mock('../src/hooks/useStagger', () => ({ useStagger: () => React.useRef(null) }));
vi.mock('../src/hooks/useDecode', () => ({ useDecode: () => React.useRef(null) }));
vi.mock('../src/hooks/useSplitReveal', () => ({ useSplitReveal: () => React.useRef(null) }));
vi.mock('../src/hooks/useParallax', () => ({ useParallax: () => React.useRef(null) }));
vi.mock('../src/hooks/useContentLayout', () => ({ useContentLayout: () => {} }));
beforeEach(() => {
  state.status = 'public'; state.revision = 0; vi.clearAllMocks();
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { resolve, promise }; }
function tree(transport: Parameters<typeof ContentProvider>[0]['transport'], path = '/writing/f35-development-update') {
  return <MemoryRouter initialEntries={[path]}><ContentProvider transport={transport}>
    <Link to="/writing/other">Other article</Link><Routes>
      <Route path="/writing/:slug" element={<ArticlePage />} />
      <Route path="/writing" element={<Writing />} />
    </Routes>
  </ContentProvider></MemoryRouter>;
}
describe('Writing and article route lifecycle', () => {
  it('renders the index copy, original short date and planned entries', async () => {
    const transport = vi.fn().mockResolvedValue(writingQueries().index); render(tree(transport, '/writing'));
    await screen.findByText('On the desk'); expect(screen.getByText('12 Jun 2026')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Breakthrough Achieved/ }).getAttribute('href')).toBe('/writing/f35-development-update');
    expect(screen.getByText('Good AI infrastructure is boring — and that is the point.')).toBeTruthy();
  });
  it('keeps loading/failure separate from missing slugs and retries errors', async () => {
    const pending = deferred<QueryResults['articlePage']>(); const transport = vi.fn().mockReturnValue(pending.promise);
    render(tree(transport)); expect(screen.getByText('Loading content…')).toBeTruthy(); expect(transport.mock.calls[0][0]).toBe('articlePage');
    cleanup(); transport.mockRejectedValue(new Error('Offline')); render(tree(transport));
    await screen.findByRole('alert'); fireEvent.click(screen.getByText('Retry')); expect(state.refresh).toHaveBeenCalledOnce();
    expect(screen.queryByText('On the desk')).toBeNull();
  });
  it('redirects a successful missing article to the Sanity index', async () => {
    const transport = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce(writingQueries().index);
    render(tree(transport)); await screen.findByText('On the desk');
  });
  it('labels incomplete drafts and does not mount a partial reading view', async () => {
    state.status = 'active'; const data = writingQueries().detail; data[0].body = null;
    render(tree(vi.fn().mockResolvedValue(data))); await screen.findByText(/Incomplete draft/);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
  it('ignores a stale article response after rapid slug navigation', async () => {
    const old = deferred<QueryResults['articlePage']>(); const next = deferred<QueryResults['articlePage']>();
    const transport = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(next.promise);
    render(tree(transport)); fireEvent.click(screen.getByText('Other article'));
    const current = writingQueries().detail; current[0].title = 'Current route'; current[0].slug = { _type: 'slug', current: 'other' };
    await act(async () => next.resolve(current)); await screen.findByRole('heading', { level: 1, name: 'Current route' });
    await act(async () => old.resolve(writingQueries().detail));
    expect(screen.queryByRole('heading', { level: 1, name: /Breakthrough/ })).toBeNull();
    expect(transport.mock.calls[0][2].aborted).toBe(true);
  });
  it('remounts revised content, preserves same-revision DOM and removes drafts on exit', async () => {
    state.status = 'active'; const first = writingQueries().detail; first[0].title = 'Private draft';
    const refreshed = deferred<QueryResults['articlePage']>();
    const published = writingQueries().detail;
    const transport = vi.fn().mockResolvedValueOnce(first).mockReturnValueOnce(refreshed.promise).mockResolvedValueOnce(published);
    const view = render(tree(transport)); const heading = await screen.findByRole('heading', { level: 1, name: 'Private draft' });
    state.revision++; view.rerender(tree(transport)); expect(screen.getByRole('heading', { level: 1 })).toBe(heading);
    const revised = writingQueries().detail; revised[0]._rev = 'revision-2'; revised[0].title = 'Revised draft';
    await act(async () => refreshed.resolve(revised)); expect(screen.getByRole('heading', { level: 1 })).not.toBe(heading);
    state.status = 'exiting'; view.rerender(tree(transport)); expect(screen.queryByText('Revised draft')).toBeNull();
    state.status = 'public'; state.revision++; view.rerender(tree(transport));
    await screen.findByRole('heading', { level: 1, name: /Breakthrough/ }); expect(transport.mock.calls[2][1]).toBe(false);
  });
  it('keeps TOC links instant, the placeholder notice and the long date', async () => {
    render(tree(vi.fn().mockResolvedValue(writingQueries().detail)));
    await screen.findByRole('heading', { level: 1 }); fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
    expect(screen.getByText('Placeholder content')).toBeTruthy(); expect(screen.getByText('12 June 2026')).toBeTruthy();
  });
});
