import { useContent } from './ContentProvider';
import { usePreview } from './PreviewProvider';
import { readAbout } from './aboutContent';
import type { ContentResult } from './types';

type AboutResult = ContentResult<{ page: ReturnType<typeof readAbout>; revision: string }>;

export function useAboutContent(): { result: AboutResult; refresh: () => void } {
  const result = useContent('aboutPage');
  const { refresh, status } = usePreview();
  if (result.status === 'incomplete') return { result: { status: 'error', message: 'About content is incomplete.' }, refresh };
  if (result.status !== 'ready') return { result, refresh };
  const document = result.data[0];
  const page = readAbout(document);
  if (result.data.length !== 1 || !document?._rev || (page.gaps.length && status !== 'active')) {
    return { result: { status: 'error', message: 'About content is incomplete.' }, refresh };
  }
  return { result: { status: 'ready', data: { page, revision: document._rev } }, refresh };
}
