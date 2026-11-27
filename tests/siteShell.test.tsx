// @vitest-environment jsdom
import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { BrowserRouter, Link, MemoryRouter } from 'react-router-dom';
import { gsap } from 'gsap';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { ScrollTrigger } from '../src/motion/core';
import { ContentProvider } from '../src/sanity/ContentProvider';
import { PreviewProvider, usePreview } from '../src/sanity/PreviewProvider';
import { queryRegistry, type QueryName, type QueryResults } from '../src/sanity/queryRegistry';
import { phase3Seeds } from '../scripts/sanity/aboutTransform';
import { homeQuery } from './fixtures/homeQuery';
import { projectQueries } from './fixtures/projectQueries';
import { writingQueries } from './fixtures/writingQueries';

const browser = vi.hoisted(() => {
  const media = { reduced: true };
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && media.reduced,
    addEventListener() {}, removeEventListener() {},
  }));
  vi.stubGlobal('scrollTo', () => {});
  return media;
});

type Settings = QueryResults['siteSettings'];
const settings = (wordmark: string, fields: Partial<Settings[number]> = {}): Settings => [{
  _id: 'siteSettings', _rev: 'first', wordmark, contactEmail: 'studio+portfolio@example.com',
  footerSignoff: 'Talk about the lab', footerMeta: 'Cambridge, 2026', footerColophon: 'Typeset at the lab',
  socialLinks: [
    { _key: 'network', label: 'Network', href: 'https://example.com/network' },
    { _key: 'code', label: 'Code', href: '#' },
  ],
  ...fields,
}];

function defer<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

const destinations = [
  ['/', 'homePage', {}, /^Measuring the/],
  ['/about', 'aboutPage', {}, "Who's behind the index"],
  ['/work', 'workArchive', {}, 'Projects & experiments'],
  ['/work/rc-f35-vtol', 'projectPage', { slug: 'rc-f35-vtol' }, 'RC F-35 — VTOL'],
  ['/writing', 'writingIndex', {}, 'Essays, notebooks & field notes'],
  ['/writing/f35-development-update', 'articlePage', { slug: 'f35-development-update' }, 'Breakthrough Achieved in F-35 RC Aircraft Development'],
] as const;

function emptyPage(name: QueryName) {
  if (name === 'homePage') return { settings: [], order: [] };
  if (name === 'workArchive') return { settings: [], disciplines: [], projects: [] };
  if (name === 'writingIndex') return { settings: [], articles: [] };
  if (name === 'projectPage') return { order: [], projects: [] };
  return [];
}

function Controls() {
  const { refresh, exit } = usePreview();
  return <div>
    <button type="button" onClick={refresh}>Refresh preview</button>
    <button type="button" onClick={() => { void exit(); }}>Exit preview</button>
    {destinations.slice(1).map(([path]) => <Link key={path} to={path}>Visit {path}</Link>)}
  </div>;
}

function shell(transport?: Parameters<typeof ContentProvider>[0]['transport']) {
  return <PreviewProvider><ContentProvider transport={transport}><Controls /><App /></ContentProvider></PreviewProvider>;
}

function source(load: (active: boolean) => Settings | Promise<Settings>, page: Partial<QueryResults> = {}) {
  return vi.fn().mockImplementation(async (name: QueryName, active: boolean) => name === 'siteSettings' ? load(active) : page[name] ?? emptyPage(name));
}

function previewResponse(active: boolean) {
  return Response.json(active ? { active, expiresAt: Date.now() + 3_600_000, projectId: 'shelltest', dataset: 'development' } : { active });
}

const scrollIntoView = vi.fn();
const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

beforeEach(() => {
  browser.reduced = true;
  scrollIntoView.mockClear();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView });
  vi.stubEnv('VITE_SANITY_PROJECT_ID', 'shelltest');
  vi.stubEnv('VITE_SANITY_DATASET', 'development');
  vi.stubGlobal('fetch', vi.fn(async () => previewResponse(false)));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (originalScrollIntoView) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  window.history.replaceState(null, '', '/');
  vi.unstubAllEnvs();
});

describe('persistent site settings', () => {
  it('requests settings once across six real routes and applies the ordered links and contact mailbox', async () => {
    const initial = defer<Settings>();
    const projects = projectQueries();
    const writing = writingQueries();
    const aboutPage = { ...phase3Seeds()[0].build(new Map()), _id: 'aboutPage', _rev: 'about-rev' };
    const transport = source(() => initial.promise, {
      homePage: homeQuery(), aboutPage: [aboutPage] as QueryResults['aboutPage'],
      workArchive: projects.archive, projectPage: projects.detail,
      writingIndex: writing.index, articlePage: writing.detail,
    });
    render(<MemoryRouter>{shell(transport)}</MemoryRouter>);
    const nav = screen.getByRole('navigation');
    const footer = screen.getByRole('contentinfo');
    expect(footer.id).toBe('contact');
    expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(within(footer).getByRole('status').textContent).toContain('Loading site settings');
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', '/about', '/work', '/writing', '#contact']);
    await waitFor(() => expect(transport).toHaveBeenCalledWith('siteSettings', false, expect.any(AbortSignal), {}));
    const request = transport.mock.calls.find(([name]) => name === 'siteSettings')!;
    for (const [path, query, params, heading] of destinations) {
      if (path !== '/') await act(async () => fireEvent.click(screen.getByRole('link', { name: `Visit ${path}` })));
      expect(await screen.findByRole('heading', { name: heading })).toBeTruthy();
      expect(transport).toHaveBeenCalledWith(query, false, expect.any(AbortSignal), params);
      expect(screen.getByRole('navigation')).toBe(nav);
      expect(screen.getByRole('contentinfo')).toBe(footer);
    }
    expect(request[2].aborted).toBe(false);
    await act(async () => initial.resolve(settings('Laboratory index')));
    expect(within(nav).getByRole('link', { name: 'Laboratory index' }).getAttribute('href')).toBe('/');
    expect(within(footer).getByRole('heading', { name: 'Talk about the lab' })).toBeTruthy();
    expect(within(footer).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['studio+portfolio@example.com', 'mailto:studio+portfolio@example.com'],
      ['Network ↗', 'https://example.com/network'], ['Code ↗', '#'],
      ['Email ↗', 'mailto:studio+portfolio@example.com'],
    ]);
    expect(within(footer).getByText('Cambridge, 2026')).toBeTruthy();
    expect(within(footer).getByText('Typeset at the lab')).toBeTruthy();
    expect(transport.mock.calls.filter(([name]) => name === 'siteSettings')).toHaveLength(1);
  });

  it('offers a footer retry through failure, missing data and incomplete data while the shell stays usable', async () => {
    const results = [
      () => Promise.reject(new Error('Offline')),
      () => [],
      () => settings('Incomplete index', { contactEmail: 'invalid' }),
      () => settings('Recovered index', { socialLinks: null }),
    ];
    const transport = source(() => results.shift()!());
    render(<MemoryRouter initialEntries={['/about']}>{shell(transport)}</MemoryRouter>);
    const footer = screen.getByRole('contentinfo');
    for (const message of ['could not be loaded', 'are unavailable', 'are incomplete']) {
      await waitFor(() => expect(within(footer).getByRole('alert').textContent).toContain(message));
      expect(footer.querySelector('a[href^="mailto:"]')).toBeNull();
      expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
      expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('#contact');
      fireEvent.click(within(footer).getByRole('button', { name: 'Retry' }));
    }
    expect(await screen.findByRole('link', { name: 'Recovered index' })).toBeTruthy();
    expect(within(footer).getAllByRole('link')).toHaveLength(2);
    expect(transport).toHaveBeenCalledWith('aboutPage', false, expect.any(AbortSignal), {});
  });

  it('keeps draft and public settings separate and discards late results after exit', async () => {
    let active = false;
    const disable = defer<Response>();
    const draftRefresh = defer<Response>();
    const latePublic = defer<Settings>();
    const latestPublic = defer<Settings>();
    const draftResult = Response.json({ result: settings('Draft index') });
    const request = vi.fn(async (path: string, options?: RequestInit) => {
      if (path === '/api/preview/session') return previewResponse(active);
      if (path === '/api/preview/disable') return disable.promise;
      const { name } = JSON.parse(String(options?.body)) as { name: QueryName };
      if (name !== 'siteSettings') return Response.json({ result: emptyPage(name) });
      return draftResult.bodyUsed ? draftRefresh.promise : draftResult;
    });
    vi.stubGlobal('fetch', request);
    const clientModule = await import('../src/sanity/client');
    const publicFetch = vi.fn().mockImplementation(async (query: string) => {
      const name = (Object.keys(queryRegistry) as QueryName[]).find(key => queryRegistry[key] === query)!;
      return name === 'siteSettings' ? (active ? latePublic.promise : latestPublic.promise) : emptyPage(name);
    });
    const client = clientModule.publishedClient();
    vi.spyOn(client, 'fetch').mockImplementation(publicFetch);
    vi.spyOn(clientModule, 'publishedClient').mockReturnValue(client);

    render(<MemoryRouter>{shell()}</MemoryRouter>);
    await waitFor(() => expect(publicFetch).toHaveBeenCalledWith(queryRegistry.siteSettings, {}, { signal: expect.any(AbortSignal) }));
    // Refresh starts a second public request while preview verifies the new session.
    active = true;
    fireEvent.click(screen.getByRole('button', { name: 'Refresh preview' }));
    const footer = screen.getByRole('contentinfo');
    expect(await screen.findByRole('link', { name: 'Draft index' })).toBeTruthy();
    const draftRequests = () => request.mock.calls.filter(([path, options]) =>
      path === '/api/preview/content' && JSON.parse(String(options?.body)).name === 'siteSettings');
    expect(draftRequests()).toHaveLength(1);
    expect(draftRequests()[0][1]).toMatchObject({ credentials: 'same-origin', cache: 'no-store' });
    await act(async () => { latePublic.resolve(settings('Stale public index')); latestPublic.resolve(settings('Published index')); });
    expect(screen.queryByRole('link', { name: 'Stale public index' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Published index' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Refresh preview' }));
    await waitFor(() => expect(draftRequests()).toHaveLength(2));
    expect(screen.getByRole('link', { name: 'Draft index' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Exit preview' }));
    expect(screen.queryByRole('link', { name: 'Draft index' })).toBeNull();
    expect(screen.getByRole('contentinfo')).toBe(footer);
    expect(draftRequests()[1][1]?.signal?.aborted).toBe(true);
    await act(async () => draftRefresh.resolve(Response.json({ result: settings('Late draft index') })));
    expect(screen.queryByRole('link', { name: 'Late draft index' })).toBeNull();
    await act(async () => disable.resolve(new Response('', { status: 503 })));
    expect((await within(footer).findByRole('alert')).textContent).toContain('Preview could not be verified');

    active = false;
    fireEvent.click(within(footer).getByRole('button', { name: 'Retry' }));
    expect(await screen.findByRole('link', { name: 'Published index' })).toBeTruthy();
  });

  it('keeps the native Contact link pointed at the same footer during loading and after settings arrive', async () => {
    const pending = defer<Settings>();
    render(<BrowserRouter>{shell(source(() => pending.promise))}</BrowserRouter>);
    const footer = screen.getByRole('contentinfo');
    const contact = screen.getByRole('link', { name: 'Contact' });
    expect(contact.getAttribute('href')).toBe('#contact');
    expect(document.getElementById('contact')).toBe(footer);
    fireEvent.click(contact);
    await waitFor(() => expect(window.location.hash).toBe('#contact'));
    await act(async () => pending.resolve(settings('Native contact')));
    expect(screen.getByRole('contentinfo')).toBe(footer);
    expect(screen.getByRole('link', { name: 'Native contact' })).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('resolves a direct Contact fragment on mount and leaves later refreshes and other fragments alone', async () => {
    const pending = defer<Settings>();
    const transport = source(() => pending.promise);
    const view = render(<MemoryRouter initialEntries={['/work#contact']}>{shell(transport)}</MemoryRouter>);
    const footer = screen.getByRole('contentinfo');
    await waitFor(() => expect(scrollIntoView.mock.contexts).toEqual([footer]));
    await act(async () => pending.resolve(settings('Direct contact')));
    fireEvent.click(screen.getByRole('button', { name: 'Refresh preview' }));
    await waitFor(() => expect(transport.mock.calls.filter(([name]) => name === 'siteSettings')).toHaveLength(2));
    expect(scrollIntoView.mock.contexts).toEqual([footer]);
    view.unmount();
    render(<MemoryRouter initialEntries={['/writing/optics#overview']}>{shell(transport)}</MemoryRouter>);
    expect(scrollIntoView.mock.contexts).toEqual([footer]);
  });

  it('keeps Contact in view when the routed page expands and stops following on user scroll', async () => {
    let resizePage = () => {};
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ResizeObserver');
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: class {
      constructor(callback: () => void) { resizePage = callback; }
      observe() {}
      disconnect() { resizePage = () => {}; }
    } });
    try {
      let top = 240;
      const getRect = HTMLElement.prototype.getBoundingClientRect;
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        return this.id === 'contact' ? new DOMRect(0, top, 450, 120) : getRect.call(this);
      });
      const view = render(<MemoryRouter initialEntries={['/#contact']}>{shell(source(() => settings('Delayed route')))}</MemoryRouter>);
      await waitFor(() => expect(scrollIntoView).toHaveBeenCalledOnce());
      top = 1600;
      resizePage();
      expect(scrollIntoView).toHaveBeenCalledTimes(2);
      top = 260;
      resizePage();
      fireEvent.wheel(window, { deltaY: -100 });
      top = 1600;
      resizePage();
      expect(scrollIntoView).toHaveBeenCalledTimes(2);
      view.unmount();
    } finally {
      if (descriptor) Object.defineProperty(window, 'ResizeObserver', descriptor);
      else Reflect.deleteProperty(window, 'ResizeObserver');
    }
  });

  it('keeps the nav entrance and equivalent footer motion mounted and reverts replaced footer animations', async () => {
    browser.reduced = false;
    const getRect = HTMLElement.prototype.getBoundingClientRect;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.closest('#contact') ? new DOMRect(0, 2000, 300, 40) : getRect.call(this);
    });
    const identical = defer<Settings>();
    const changed = defer<Settings>();
    const loads = [Promise.resolve(settings('Motion index')), identical.promise, changed.promise];
    const transport = source(() => loads.shift()!);
    const view = render(<StrictMode><MemoryRouter>{shell(transport)}</MemoryRouter></StrictMode>);
    const nav = screen.getByRole('navigation');
    const footer = screen.getByRole('contentinfo');
    const brand = nav.querySelector('[data-nav-brand]')!;
    const tick = nav.querySelector('[data-nav-tick]')!;
    const entrance = gsap.getTweensOf(brand);
    expect(entrance).toHaveLength(1);
    entrance[0].parent?.pause();
    expect(gsap.getTweensOf(tick).filter(tween => tween.vars.scale === 1)).toHaveLength(0);
    const refresh = vi.spyOn(ScrollTrigger, 'refresh');
    const heading = await within(footer).findByRole('heading', { name: 'Talk about the lab' });
    const label = within(footer).getByText('Typeset at the lab');
    expect(heading.children.length).toBeGreaterThan(0);
    const trigger = ScrollTrigger.getAll().find(item => item.trigger === label)!;
    expect(trigger).toBeDefined();
    act(() => { trigger.vars.onEnter?.(trigger); });
    const labelText = label.firstChild!;
    expect(label.getAttribute('aria-label')).toBe('Typeset at the lab');
    const decodeTweens = gsap.getTweensOf([label, labelText]);
    expect(decodeTweens.length).toBeGreaterThan(0);
    decodeTweens.forEach(tween => tween.pause());
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(gsap.getTweensOf(brand)).toEqual(entrance);

    fireEvent.click(screen.getByRole('link', { name: 'Visit /about' }));
    const tickPulse = () => gsap.getTweensOf(tick).filter(tween => tween.vars.ease === 'ds-spring');
    const firstPulse = tickPulse()[0];
    expect(firstPulse).toBeTruthy();
    firstPulse.pause();
    fireEvent.click(screen.getByRole('link', { name: 'Visit /work' }));
    expect(tickPulse()).toHaveLength(1);
    expect(tickPulse()[0]).not.toBe(firstPulse);
    expect(gsap.getTweensOf(brand)).toEqual(entrance);
    expect(within(footer).getByRole('heading')).toBe(heading);

    fireEvent.click(screen.getByRole('button', { name: 'Refresh preview' }));
    await act(async () => identical.resolve(settings('Motion index', { _rev: 'equivalent' })));
    expect(within(footer).getByRole('heading')).toBe(heading);
    expect(footer.querySelector('[data-decode]:last-child')).toBe(label);

    fireEvent.click(screen.getByRole('button', { name: 'Refresh preview' }));
    refresh.mockClear();
    await act(async () => changed.resolve(settings('Updated wordmark', { _rev: 'updated', footerSignoff: 'New closing line' })));
    expect(within(footer).getByRole('heading', { name: 'New closing line' })).not.toBe(heading);
    expect(screen.getByRole('navigation')).toBe(nav);
    expect(screen.getByRole('contentinfo')).toBe(footer);
    expect(gsap.getTweensOf(brand)).toEqual(entrance);
    expect(heading.children).toHaveLength(0);
    expect(heading.getAttribute('aria-label')).toBeNull();
    expect(label.getAttribute('aria-label')).toBeNull();
    expect(gsap.getTweensOf([label, labelText])).toHaveLength(0);
    expect(ScrollTrigger.getAll().some(item => item === trigger)).toBe(false);
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    view.unmount();
    expect(gsap.getTweensOf([brand, tick])).toHaveLength(0);
  });
});
