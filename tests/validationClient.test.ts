import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClient } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { validationClient } from '../server/preview/validationClient';

afterEach(() => vi.restoreAllMocks());
describe('preview helper diagnostics boundary', () => {
  it.each([null, 'malformed', 'https://other.example/studio'])('rejects invalid Studio URL %s before the helper can log secret URLs', async studioUrl => {
    const client = createClient({ projectId: 'testproject', dataset: 'development', token: 'test-reader', apiVersion: '2026-10-01', useCdn: false });
    vi.spyOn(client, 'withConfig').mockReturnValue(client);
    vi.spyOn(client, 'fetch').mockResolvedValue({ private: {
      _id: 'drafts.secret', _updatedAt: new Date().toISOString(), secret: 'test-secret', studioUrl,
    }, public: null });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(validatePreviewUrl(validationClient(client, 'https://portfolio.example'),
      'https://portfolio.example/api/preview/enable?sanity-preview-secret=test-secret')).rejects.toThrow();
    expect(log).not.toHaveBeenCalled();
  });
});
