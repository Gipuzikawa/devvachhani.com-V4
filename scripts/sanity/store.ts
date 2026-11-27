import type { SanityClient } from '@sanity/client';
import type { Existing, Store } from './import';
export function sanityStore(client: SanityClient): Store {
  return {
    read: keys => client.fetch<Existing[]>(`*[sourceKey in $keys || _id in ["workPage", "drafts.workPage", "writingPage", "drafts.writingPage", "aboutPage", "drafts.aboutPage", "homePage", "drafts.homePage", "siteSettings", "drafts.siteSettings"]]`, { keys }, { perspective: 'raw' }),
    create: (body, singletonId) => client.create({ ...body, ...(singletonId ? { _id: singletonId } : {}) }) as Promise<Existing>,
    async update(id, revision, body) {
      const { _type, ...fields } = body;
      if (!_type) throw new Error('Missing document type.');
      await client.patch(id).ifRevisionId(revision).set(fields).commit();
    },
    async lock(owner) {
      const id = 'migrationLock.phase1';
      const lock = await client.create({ _id: id, _type: 'migrationLock', owner, startedAt: new Date().toISOString() });
      return async () => {
        // Revision-guard the release and deletion in one transaction; another
        // process must never be able to delete a lock it did not acquire.
        await client.transaction().patch(id, patch => patch.ifRevisionId(lock._rev).set({ releasedBy: owner })).delete(id).commit();
      };
    },
  };
}
