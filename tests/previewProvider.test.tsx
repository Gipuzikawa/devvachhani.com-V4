// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PreviewProvider, usePreview } from '../src/sanity/PreviewProvider';

function Consumer() {
  const preview = usePreview();
  return <><output>{preview.status}:{preview.revision}</output><button onClick={preview.refresh}>Refresh</button>
    <button onClick={() => { void preview.exit(); }}>Exit</button></>;
}
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function configure() {
  vi.stubEnv('VITE_SANITY_PROJECT_ID', 'testproject'); vi.stubEnv('VITE_SANITY_DATASET', 'development');
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-17T12:00:00Z'));
}
function session(expiresAt = Date.now() + 3_600_000) {
  return new Response(JSON.stringify({ active: true, projectId: 'testproject', dataset: 'development', expiresAt }));
}
describe('preview session lifecycle', () => {
  it('polls the session without invalidating content; explicit refresh changes the content revision', async () => {
    configure(); const request = vi.fn().mockImplementation(async () => session()); vi.stubGlobal('fetch', request);
    await act(async () => { render(<PreviewProvider><Consumer /></PreviewProvider>); });
    expect(screen.getByText('active:0')).toBeTruthy();
    await act(async () => { vi.advanceTimersByTime(60_000); });
    expect(request).toHaveBeenCalledTimes(2); expect(screen.getByText('active:0')).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByText('Refresh')));
    expect(screen.getByText('active:1')).toBeTruthy();
  });
  it('clears preview mode exactly at expiry and requires re-entry', async () => {
    configure(); vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => session(Date.now() + 1000)));
    await act(async () => { render(<PreviewProvider><Consumer /></PreviewProvider>); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('expired:1')).toBeTruthy();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
  });
  it('clears draft mode before an exit request resolves and ignores stale session results', async () => {
    configure(); let resolve!: (response: Response) => void;
    const pending = new Promise<Response>(done => { resolve = done; });
    const request = vi.fn().mockResolvedValueOnce(session()).mockReturnValueOnce(pending).mockResolvedValueOnce(new Response('', { status: 503 }));
    vi.stubGlobal('fetch', request);
    await act(async () => { render(<PreviewProvider><Consumer /></PreviewProvider>); });
    await act(async () => { vi.advanceTimersByTime(60_000); });
    await act(async () => fireEvent.click(screen.getByText('Exit')));
    await act(async () => resolve(session()));
    expect(screen.getByText('error:1')).toBeTruthy();
  });
});
