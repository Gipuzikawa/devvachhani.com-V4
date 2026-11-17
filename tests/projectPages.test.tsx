// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useContent } from '../src/sanity/ContentProvider';
import { ProjectPage } from '../src/pages/ProjectPage';
import { Work } from '../src/pages/Work';
import { Figure } from '../src/components/ui/Figure';
import { projectQueries } from './fixtures/projectQueries';

const preview = vi.hoisted(() => ({ status: 'public', refresh: vi.fn() }));
vi.mock('../src/sanity/ContentProvider', () => ({ useContent: vi.fn() }));
vi.mock('../src/sanity/PreviewProvider', () => ({ usePreview: () => preview }));
// These are DOM/route tests; actual GSAP/browser behavior has separate acceptance.
vi.mock('@gsap/react', () => ({ useGSAP: () => {} }));
vi.mock('../src/motion/core', () => ({ DUR: {}, EASE: {}, DECODE_CHARS: '', ScrollTrigger: {}, Flip: {}, prefersReducedMotion: () => true }));
vi.mock('../src/hooks/useReveal', () => ({ useReveal: () => React.useRef(null) }));
vi.mock('../src/hooks/useStagger', () => ({ useStagger: () => React.useRef(null) }));
vi.mock('../src/hooks/useDecode', () => ({ useDecode: () => React.useRef(null) }));
vi.mock('../src/hooks/useSplitReveal', () => ({ useSplitReveal: () => React.useRef(null) }));
vi.mock('../src/hooks/useInkResolve', () => ({ useInkResolve: () => React.useRef(null) }));
vi.mock('../src/hooks/useFocusZoom', () => ({ useFocusZoom: () => React.useRef(null) }));
vi.mock('../src/hooks/useParallax', () => ({ useParallax: () => React.useRef(null) }));
vi.mock('../src/hooks/usePinned', () => ({ usePinned: () => React.useRef(null) }));
vi.mock('../src/hooks/useContentLayout', () => ({ useContentLayout: () => {} }));
afterEach(() => { cleanup(); preview.status = 'public'; vi.clearAllMocks(); });
function detailRoute() {
  return render(<MemoryRouter initialEntries={['/work/rc-f35-vtol']}><Routes>
    <Route path="/work/:slug" element={<ProjectPage />} />
    <Route path="/work" element={<p>Archive destination</p>} />
  </Routes></MemoryRouter>);
}
describe('project route resolution', () => {
  it('does not redirect while loading or after a failed request', () => {
    vi.mocked(useContent).mockReturnValue({ status: 'loading' }); detailRoute();
    expect(screen.getByText('Loading content…')).toBeTruthy(); expect(screen.queryByText('Archive destination')).toBeNull();
    cleanup(); vi.mocked(useContent).mockReturnValue({ status: 'error', message: 'Offline. Please retry.' }); detailRoute();
    expect(screen.getByRole('alert')).toBeTruthy(); expect(screen.queryByText('Archive destination')).toBeNull();
    fireEvent.click(screen.getByText('Retry')); expect(preview.refresh).toHaveBeenCalledOnce();
  });
  it('redirects only a successful empty detail result', () => {
    vi.mocked(useContent).mockReturnValue({ status: 'ready', data: { ...projectQueries().detail, projects: [] } });
    detailRoute(); expect(screen.getByText('Archive destination')).toBeTruthy();
  });
  it('labels incomplete previews without mounting a partial timeline or redirecting', () => {
    preview.status = 'active';
    const data = projectQueries().detail; data.projects[0].detail = null;
    vi.mocked(useContent).mockReturnValue({ status: 'ready', data }); detailRoute();
    expect(screen.getByText(/Incomplete draft/)).toBeTruthy();
    expect(screen.queryByText('Archive destination')).toBeNull(); expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
  it('renders the F-35 notice, headings, timeline and seven placeholder figures', () => {
    vi.mocked(useContent).mockReturnValue({ status: 'ready', data: projectQueries().detail }); detailRoute();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('RC F-35 — VTOL');
    expect(screen.getByText(/Placeholder content/)).toBeTruthy();
    expect(screen.getByText('How it came together')).toBeTruthy();
    expect(screen.getAllByText('Placeholder — image forthcoming')).toHaveLength(7);
  });
});
describe('archive and figure rendering', () => {
  it('preserves numbering and link destinations across discipline/layout changes', () => {
    vi.mocked(useContent).mockReturnValue({ status: 'ready', data: projectQueries().archive });
    render(<MemoryRouter><Work /></MemoryRouter>);
    const software = screen.getByRole('link', { name: /Corporate guest registration/ });
    expect(software.getAttribute('href')).toBe('/work'); expect(software.textContent).toContain('02');
    fireEvent.click(screen.getByRole('button', { name: 'Software' }));
    expect(software.parentElement?.style.display).not.toBe('none');
    expect(screen.getByRole('link', { name: /RC F-35/ , hidden: true }).parentElement?.style.display).toBe('none');
    fireEvent.click(screen.getByRole('button', { name: 'Grid' })); expect(software.textContent).toContain('02');
  });
  it('emits dimensions, lazy loading, responsive sources and separate alternative text', () => {
    render(<Figure index={1} title="Caption" src="https://cdn.sanity.io/test.jpg" alt="Descriptive alternative"
      srcSet="small.jpg 480w, large.jpg 1200w" sizes="620px" width={1200} height={800} />);
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe('Descriptive alternative'); expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('width')).toBe('1200'); expect(image.getAttribute('height')).toBe('800');
    expect(image.getAttribute('srcset')).toContain('480w'); expect(screen.getByText(/Caption/)).toBeTruthy();
  });
});
