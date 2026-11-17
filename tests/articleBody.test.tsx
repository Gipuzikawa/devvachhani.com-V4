// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ArticleBody } from '../src/components/content/ArticleBody';
import { adaptArticle } from '../src/sanity/articleAdapters';
import { writingQueries } from './fixtures/writingQueries';
import type { ArticleTextBlock } from '../src/types';

vi.mock('../src/hooks/useParallax', () => ({ useParallax: () => React.useRef(null) }));
vi.mock('../src/hooks/useSplitReveal', () => ({ useSplitReveal: () => React.useRef(null) }));
afterEach(cleanup);

describe('rich article rendering', () => {
  it('retains emphasis, strong and a link around the drop-cap letter', () => {
    const block: ArticleTextBlock = { _type: 'block', _key: 'lead', style: 'normal', dropCap: true,
      markDefs: [{ _type: 'link', _key: 'link', href: '/work/rc-f35-vtol' }], children: [
        { _type: 'span', _key: 'a', text: 'Linked', marks: ['link', 'strong', 'em'] },
        { _type: 'span', _key: 'b', text: ' paragraph', marks: [] },
      ] };
    const { container } = render(<ArticleBody body={[block]} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/work/rc-f35-vtol');
    expect(link.textContent).toBe('Linked'); expect(container.querySelector('strong em, em strong')).toBeTruthy();
    expect(container.querySelector('p.article-drop-cap')?.textContent).toBe('Linked paragraph');
  });
  it('renders ordered, unordered and nested lists with semantic structure', () => {
    const item = (key: string, listItem: 'bullet' | 'number', level: number): ArticleTextBlock => ({
      _type: 'block', _key: key, style: 'normal', listItem, level, markDefs: [],
      children: [{ _type: 'span', _key: key, text: key, marks: [] }],
    });
    const { container } = render(<ArticleBody body={[item('one', 'number', 1), item('nested', 'bullet', 2), item('two', 'number', 1), item('bullet', 'bullet', 1)]} />);
    expect(container.querySelector('ol > li')?.textContent).toContain('one');
    expect(container.querySelector('ol li ul li')?.textContent).toBe('nested');
    expect(container.querySelectorAll('li')).toHaveLength(4);
  });
  it('renders anchors, three numbered placeholder figures and the pull quote', () => {
    const article = adaptArticle(writingQueries().detail)!;
    const { container } = render(<ArticleBody body={article.body} />);
    expect([...container.querySelectorAll('h2')].map(h => h.id)).toEqual(['overview', 'development', 'testing', 'ahead']);
    expect(screen.getAllByText('Placeholder — image forthcoming')).toHaveLength(3);
    expect(container.querySelector('blockquote')?.textContent).toContain('Suspendisse potenti');
    expect(container.querySelector('p')?.hasAttribute('data-reveal')).toBe(false);
  });
  it('defends the href at rendering even if a caller bypasses validation', () => {
    const article = adaptArticle(writingQueries().detail)!;
    const block = article.body.find((block): block is ArticleTextBlock => block._type === 'block')!;
    block.markDefs = [{ _type: 'link', _key: 'bad', href: 'javascript:alert(1)' }];
    block.children[0].marks = ['bad'];
    const { container } = render(<ArticleBody body={[block]} />);
    expect(container.querySelector('a')).toBeNull(); expect(container.textContent).toBe('Overview');
  });
});
