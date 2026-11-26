// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { gsap } from 'gsap';
import { StrictMode } from 'react';
import { Home } from '../src/pages/Home';
import { ContentProvider } from '../src/sanity/ContentProvider';
import type { PreviewStatus } from '../src/sanity/PreviewProvider';
import { attachTextPressure } from '../src/motion/textPressure';
import { ScrollTrigger, SplitText } from '../src/motion/core';
import { homeQuery, project, slot, type HomeResult } from './fixtures/homeQuery';

const state = vi.hoisted(() => {
  const preview = { status: 'public' as PreviewStatus, revision: 0, refresh: vi.fn(), expire: vi.fn() };
  const media = { reduce: true };
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && media.reduce,
    addEventListener() {}, removeEventListener() {},
  }));
  vi.stubGlobal('scrollTo', () => {});
  return { preview, media };
});
vi.mock('../src/sanity/PreviewProvider', () => ({ usePreview: () => state.preview }));
// GSAP and SplitText run in jsdom. Stub the fine-pointer interaction and
// font readiness so disposal and stale callbacks can be checked deterministically.
vi.mock('../src/motion/textPressure', () => ({ attachTextPressure: vi.fn() }));

const disposePressure = vi.fn();
const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
function heroEntrance(label: Element) {
  return gsap.getTweensOf(label).find(tween => tween.vars.opacity === 1)?.parent;
}

function defer<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { resolve, promise };
}
function withDelayedFonts() {
  const fonts = defer<void>();
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: fonts.promise } });
  state.media.reduce = false;
  return fonts;
}
function tree(transport: Parameters<typeof ContentProvider>[0]['transport']) {
  return <MemoryRouter><ContentProvider transport={transport}><Home /></ContentProvider></MemoryRouter>;
}
function source(loadHome: (active: boolean) => HomeResult | Promise<HomeResult>) {
  return vi.fn().mockImplementation(async (name: string, active: boolean) => name === 'homePage' ? loadHome(active) : []);
}
beforeEach(() => {
  state.preview.status = 'public';
  state.preview.revision = 0;
  state.media.reduce = true;
  vi.clearAllMocks();
  vi.mocked(attachTextPressure).mockReturnValue(disposePressure);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
  else Reflect.deleteProperty(document, 'fonts');
});

describe('Home content route', () => {
  it('renders authored inline hero runs, headings and CTA destinations in reduced motion', async () => {
    const data = homeQuery({
      heroLead: 'New introduction.',
      primaryCta: { label: 'Explore the archive', href: '/work?view=all' },
      aboutIntro: 'New About introduction.',
    });
    const heroLines = data.settings[0].heroLines!;
    heroLines[0].runs![0].text = 'Testing the';
    render(tree(source(() => data)));
    const heading = await screen.findByRole('heading', { level: 1 });
    const lines = Array.from(heading.children);
    expect(lines.map(line => [line.tagName, line.textContent])).toEqual([
      ['SPAN', 'Testing the'], ['SPAN', 'invisible, one'], ['SPAN', 'experiment at a time.'],
    ]);
    expect(heading.querySelector('p')).toBeNull();
    expect(lines[1].querySelector('em')?.textContent).toBe('one');
    expect(heading.getAttribute('aria-label')).toBeNull();
    expect(screen.getByText('New introduction.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Explore the archive' }).getAttribute('href')).toBe('/work?view=all');
    expect(screen.getByRole('link', { name: 'Get in touch' }).getAttribute('href')).toBe('#contact');
    expect(screen.getByRole('heading', { name: 'Who is behind the index' })).toBeTruthy();
    expect(screen.getByText('New About introduction.')).toBeTruthy();
  });

  it('shows links in featured order with archive-wide numbering and safe detail fallbacks', async () => {
    render(tree(source(() => homeQuery())));
    await screen.findByRole('heading', { name: 'Project second' });
    const links = screen.getAllByRole('link', { name: /Project (first|second)/ });
    expect(links.map(link => [link.querySelector('h3')?.textContent, link.querySelector('[data-decode]')?.textContent, link.getAttribute('href')])).toEqual([
      ['Project second', '02', '/work'], ['Project first', '01', '/work/first'],
    ]);
  });

  it('keeps loading, absent and failed Home content distinct and exposes retry', async () => {
    const pending = defer<HomeResult>();
    const transport = source(() => pending.promise);
    const view = render(tree(transport));
    expect(screen.getByText('Loading content…')).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    await act(async () => pending.resolve({ settings: [], order: [] }));
    expect(screen.getByText('No content is available yet.')).toBeTruthy();
    view.rerender(tree(source(() => Promise.reject(new Error('offline')))));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(state.preview.refresh).toHaveBeenCalledOnce();
  });

  it('never renders an invalid CTA and labels incomplete Home drafts', async () => {
    const invalid = homeQuery({ primaryCta: { label: 'Invalid CTA', href: '//unsafe.example' } });
    const transport = source(() => invalid);
    const view = render(tree(transport));
    await screen.findByRole('alert');
    expect(screen.queryByRole('link', { name: 'Invalid CTA' })).toBeNull();
    state.preview.status = 'active';
    view.rerender(tree(transport));
    await screen.findByText(/Incomplete draft/);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('shows project gaps only in draft preview and removes draft data during exit', async () => {
    state.preview.status = 'active';
    const cards = [
      slot('missing', 'missing', null), slot('incomplete', 'first', { ...project('first'), title: null }),
      slot('usable', 'second', project('second', false)),
    ];
    const transport = source(active => homeQuery({ heroLead: active ? 'Private draft lead.' : 'Public lead.', featuredProjects: cards }));
    const view = render(tree(transport));
    await screen.findByText('Private draft lead.');
    expect(screen.getByText('Featured project 1 is unavailable.').closest('a')).toBeNull();
    expect(screen.getByText('Featured project 2 is incomplete.').closest('a')).toBeNull();
    state.preview.status = 'exiting';
    view.rerender(tree(transport));
    expect(screen.queryByText('Private draft lead.')).toBeNull();
    state.preview.status = 'public';
    view.rerender(tree(transport));
    await screen.findByText('Public lead.');
    expect(screen.queryByText(/Featured project [12]/)).toBeNull();
    expect(screen.getByRole('link', { name: /Project second/ }).getAttribute('href')).toBe('/work');
  });

  it('keeps hero and cards through same-revision refreshes, independently replacing changed cards and heroes', async () => {
    const pending = defer<HomeResult>();
    const original = homeQuery();
    const edited = homeQuery({ featuredProjects: [
      slot('second-card', 'second', { ...project('second', false), _rev: 'edited', title: 'Edited card' }),
      slot('first-card', 'first'),
    ] });
    const requests = [original, pending.promise, edited, homeQuery({ _rev: 'edited-home', heroLead: 'Edited lead' })];
    const transport = source(() => requests.shift()!);
    const view = render(tree(transport));
    const heading = await screen.findByRole('heading', { level: 1 });
    const card = screen.getByRole('link', { name: /Project second/ });
    const refresh = () => { state.preview.revision++; view.rerender(tree(transport)); };

    refresh();
    expect(screen.getByRole('heading', { level: 1 })).toBe(heading);
    await act(async () => pending.resolve(structuredClone(original)));
    expect(screen.getByRole('heading', { level: 1 })).toBe(heading);
    expect(screen.getByRole('link', { name: /Project second/ })).toBe(card);
    refresh();
    expect(await screen.findByRole('link', { name: /Edited card/ })).not.toBe(card);
    expect(screen.getByRole('heading', { level: 1 })).toBe(heading);
    refresh();
    await screen.findByText('Edited lead');
    expect(screen.getByRole('heading', { level: 1 })).not.toBe(heading);
  });

  it('ignores delayed fonts for a hero removed before its entrance', async () => {
    const fonts = withDelayedFonts();
    const split = vi.spyOn(SplitText, 'create');
    const view = render(tree(source(() => homeQuery())));
    await screen.findByText('An introduction.');
    const heading = view.container.querySelector('h1')!;
    view.unmount();
    await act(async () => fonts.resolve());
    expect(heading.children[0].innerHTML).toBe('Measuring the');
    expect(split.mock.calls.filter(([targets]) => Array.isArray(targets))).toHaveLength(0);
    expect(attachTextPressure).not.toHaveBeenCalled();
  });

  it('splits the hero only once when Strict Mode restarts its effect before fonts are ready', async () => {
    const fonts = withDelayedFonts();
    const split = vi.spyOn(SplitText, 'create');
    render(<StrictMode>{tree(source(() => homeQuery()))}</StrictMode>);
    await screen.findByText('An introduction.');
    await act(async () => fonts.resolve());
    expect(split.mock.calls.filter(([targets]) => Array.isArray(targets))).toHaveLength(1);
  });

  it('reverts split DOM and disposes pressure when the hero revision changes', async () => {
    const fonts = withDelayedFonts();
    const transport = source(() => state.preview.revision ? homeQuery({ _rev: 'new-hero', heroLead: 'New lead' }) : homeQuery());
    const view = render(tree(transport));
    await screen.findByText('An introduction.');
    const hero = view.container.querySelector('h1')!;
    const meta = view.container.querySelector('[data-hero-decode]')!;
    await act(async () => fonts.resolve());
    expect(hero.querySelector('[data-hero-line] span')).toBeTruthy();
    const entrance = heroEntrance(meta);
    const complete = entrance?.eventCallback('onComplete');
    expect(complete).toBeTypeOf('function');
    act(() => { entrance?.progress(1); });
    expect(attachTextPressure).toHaveBeenCalledOnce();
    state.preview.revision++; view.rerender(tree(transport));
    await screen.findByText('New lead');
    expect(hero.children[1].querySelector('em')?.innerHTML).toBe('one');
    expect(hero.getAttribute('aria-label')).toBeNull();
    expect(meta.getAttribute('aria-label')).toBeNull();
    expect(disposePressure).toHaveBeenCalledOnce();
  });

  it('clears temporary labels and rejects completion after an unfinished hero unmounts', async () => {
    const fonts = withDelayedFonts();
    const view = render(tree(source(() => homeQuery())));
    await screen.findByText('An introduction.');
    const meta = view.container.querySelector('[data-hero-decode]')!;
    await act(async () => fonts.resolve());
    const complete = heroEntrance(meta)?.eventCallback('onComplete');
    expect(complete).toBeTypeOf('function');
    expect(meta.getAttribute('aria-label')).toBe('Portfolio');
    view.unmount();
    complete?.();
    expect(meta.getAttribute('aria-label')).toBeNull();
    expect(attachTextPressure).not.toHaveBeenCalled();
  });

  it('keeps authored label text literal when the hero and section scramble effects settle', async () => {
    const fonts = withDelayedFonts();
    const labelText = '<b>Lab</b> &amp; optics';
    const view = render(tree(source(() => homeQuery({
      metaAccent: labelText, workHeading: { eyebrow: labelText, title: 'Selected experiments' },
    }))));
    await screen.findByText('An introduction.');
    const meta = view.container.querySelector('[data-hero-decode]')!;
    const eyebrow = screen.getByRole('heading', { name: 'Selected experiments' }).closest('header')!
      .querySelector<HTMLElement>('[data-decode]:nth-child(2)')!;
    await act(async () => fonts.resolve());
    const entrance = heroEntrance(meta);
    expect(entrance).toBeTruthy();
    act(() => { entrance?.progress(1); });
    expect(meta.textContent).toBe(labelText);
    expect(meta.children).toHaveLength(0);

    act(() => {
      const trigger = ScrollTrigger.getAll().find(item => item.trigger === eyebrow && item.vars.onEnter);
      if (trigger) trigger.vars.onEnter?.(trigger);
      gsap.getTweensOf([eyebrow, eyebrow.firstChild]).forEach(tween => tween.progress(1));
    });
    expect(eyebrow.style.opacity).toBe('1');
    expect(eyebrow.textContent).toBe(labelText);
    expect(eyebrow.children).toHaveLength(0);
  });
});
