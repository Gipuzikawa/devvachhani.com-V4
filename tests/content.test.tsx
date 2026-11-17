// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ContentProvider, useContent } from '../src/sanity/ContentProvider';
import type { QueryResults } from '../src/sanity/queryRegistry';
import type { PreviewStatus } from '../src/sanity/PreviewProvider';
import { PreviewExpiredError } from '../src/sanity/types';

const state = vi.hoisted(() => ({ status: 'active' as PreviewStatus, revision: 0, expire: vi.fn() }));
vi.mock('../src/sanity/PreviewProvider', () => ({ usePreview: () => ({ ...state }) }));
const document = (label: string): QueryResults['disciplines'] => [{ _id: label, _rev: '1', label, sourceKey: 'embedded', sortOrder: 0 }];
function Consumer() {
  const result = useContent('disciplines');
  const navigate = useNavigate();
  return <><button onClick={() => navigate('/work/other')}>Navigate</button><output>{result.status}</output>
    {(result.status === 'ready' || result.status === 'incomplete') && <span>{result.data[0]?.label}</span>}</>;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
beforeEach(() => { state.status = 'active'; state.revision = 0; state.expire.mockReset(); });
afterEach(cleanup);

describe('content lifecycle', () => {
  it('distinguishes loading, empty, incomplete and failure', async () => {
    const pending = deferred<QueryResults['disciplines']>();
    const transport = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ _id: 'missing', _rev: '1', label: null, sourceKey: null, sortOrder: null }])
      .mockRejectedValueOnce(new Error('Offline'));
    const tree = () => <MemoryRouter><ContentProvider transport={transport}><Consumer /></ContentProvider></MemoryRouter>;
    const view = render(tree());
    expect(screen.getByText('loading')).toBeTruthy();
    await act(async () => pending.resolve(document('First draft')));
    expect(screen.getByText('First draft')).toBeTruthy();
    state.revision++; view.rerender(tree()); await waitFor(() => expect(screen.getByText('empty')).toBeTruthy());
    state.revision++; view.rerender(tree()); await waitFor(() => expect(screen.getByText('incomplete')).toBeTruthy());
    state.revision++; view.rerender(tree()); await waitFor(() => expect(screen.getByText('error')).toBeTruthy());
  });
  it('aborts route requests and ignores late results even if a transport ignores abort', async () => {
    const old = deferred<QueryResults['disciplines']>();
    const next = deferred<QueryResults['disciplines']>();
    const transport = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(next.promise);
    render(<MemoryRouter><ContentProvider transport={transport}><Consumer /></ContentProvider></MemoryRouter>);
    await act(async () => screen.getByRole('button').click());
    expect(transport.mock.calls[0][2].aborted).toBe(true);
    await act(async () => next.resolve(document('Current route')));
    await act(async () => old.resolve(document('Stale route')));
    expect(screen.getByText('Current route')).toBeTruthy();
    expect(screen.queryByText('Stale route')).toBeNull();
  });
  it('removes drafts immediately when exiting/expiring and refetches published content', async () => {
    const transport = vi.fn().mockResolvedValueOnce(document('Draft only')).mockResolvedValueOnce(document('Published only'));
    const tree = () => <MemoryRouter><ContentProvider transport={transport}><Consumer /></ContentProvider></MemoryRouter>;
    const view = render(tree());
    await waitFor(() => expect(screen.getByText('Draft only')).toBeTruthy());
    state.status = 'exiting'; view.rerender(tree());
    expect(screen.queryByText('Draft only')).toBeNull();
    state.status = 'public'; state.revision++; view.rerender(tree());
    await waitFor(() => expect(screen.getByText('Published only')).toBeTruthy());
    expect(transport.mock.calls[1][1]).toBe(false);
  });
  it('surfaces server expiry without silently falling back to published content', async () => {
    const transport = vi.fn().mockRejectedValue(new PreviewExpiredError());
    render(<MemoryRouter><ContentProvider transport={transport}><Consumer /></ContentProvider></MemoryRouter>);
    await waitFor(() => expect(state.expire).toHaveBeenCalledOnce());
    expect(transport).toHaveBeenCalledOnce();
  });
});
