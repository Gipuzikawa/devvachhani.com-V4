# Phase 1 source inventory and mapping

## Phase 4 Home

The [Phase 4 log](phase-4-migration.md) identifies the source snapshots and field
mapping. Run the development import with `--phase 4`. It writes one managed
`homePage` singleton and resolves its three featured project IDs by source key.
The run requires an unambiguous published project for each source key. It
preserves existing project data and reports differences in the Home singleton.

## Phase 3 About

The [Phase 3 migration log](phase-3-migration.md) identifies the source snapshots,
singleton fields and verification steps. Pass `--phase 3` to the same development
import command below. The only document is `aboutPage`; its nested objects keep
stable array keys. The fact's visibility flag determines inclusion on Home.


## Phase 2 extension — 2026-11-17

Source: `fixtures/phase-1-source.ts` article/card/planned exports and
`fixtures/phase1-pages/Writing.tsx.snapshot`. No additional source discovery or
article prose was invented. `scripts/sanity/writingSource.ts` captures the page
copy/date mapping; `writingTransform.ts` performs deterministic conversion.

| Source | Count | Destination / handling |
| --- | --- | --- |
| Article card/detail | 1 pair | One ordinary `article`, source key `article-f35-development-update`; generated ID |
| Article blocks | 19 | Portable Text paragraphs, owned headings/drop-cap paragraph, figures and pull quote |
| Section anchors | 4 | `overview`, `development`, `testing`, `ahead`, stored as explicit IDs |
| Figure plates / pull quotes | 3 / 1 | Ordered placeholder figures at existing default 3:2; quote copy preserved |
| Publication date | 1 | ISO `2026-06-12`; index `12 Jun 2026`, detail `12 June 2026` |
| Reading-time override | 1 | Six minutes; content maturity remains `placeholder` |
| Writing heading/introduction | 1 set | Managed `writingPage` singleton |
| Planned-writing entries | 3 | Keyed owned objects; numbering derived from order |
| Related-project source relationship | 0 | Optional schema reference; no relationship invented |

No real article assets, locales, schedules or source editorial drafts exist.
Marks/links/lists remain rich on new content; no HTML injection/embeds are enabled.
Native blocks cannot declare additional fields, so editable heading/drop-cap
metadata lives on owned objects containing a single rich block. Conversion keeps
all 19 source blocks and stable body/span keys. Routes stay unchanged.

The existing CLI explicitly supports `--phase 2` with the same safeguards:

```sh
cd studio
node node_modules/@sanity/cli/bin/run.js exec scripts/import-phase1.ts --with-user-token -- --project oir24qey --dataset development --phase 2 --mode dry-run
```

The filename is retained for compatibility with Phase 1. Use `create-missing`
only after reviewing the dry run. `update-reviewed` still requires an exact
source-hash/revision manifest and rejects drafts. Both phases share the existing
`migrationLock.phase1` lock to serialize runs. Singleton collisions are checked
for both `workPage` and `writingPage`. No production mode or replacement import
was added. The live rerun created 0, skipped 2, updated 0, with no differences;
`fixtures/phase-2-rerun-report.json` records returned IDs/revisions/hashes.

The original Phase 1 inventory follows.

Captured 2026-11-17 before changes to portfolio page readers. English-only static
source; no archived/scheduled variants or historical editor drafts exist in that
source. Target: project `oir24qey`, **development** only.

| Source | Count | Destination / handling |
| --- | --- | --- |
| `content.ts` project cards | 3 | `project` documents; stable source key per original card index |
| F-35 detail | 1 | Joined into its project; `contentStatus: placeholder`, enabled detail |
| Other project details | 0 | Two archive-only cards; detail disabled and slug absent |
| Discipline choices excluding All | 3 | `discipline`; project references use returned document IDs |
| Work page heading, intro, controls | 1 set | `workPage` singleton at `workPage` |
| Project section headings | 4 | Named `sectionHeading` objects on enabled detail |
| Timeline milestones | 6 | Keyed `projectMilestone` objects preserving date/title/body/order |
| Timeline/final figure plates | 7 | Placeholder figures, captions preserved; timeline 3:2, final 16:9 |
| Tool groups / specifications | 3 / 6 | Keyed owned objects, same labels and values |
| Reflections / skills | 1 set | Owned reflection object and original string lists |

No real image assets are present. No legacy image URLs are retained or invented;
an unexpected source image causes the transform to fail until an upload mapping
is supplied. Figure numbers and archive indices are display ordering, not stored
editorial data. Keep placeholder maturity separate from Sanity publish state.

## Snapshots and deferred copy

`fixtures/phase-1-source.ts` captures all exports of `src/data/content.ts`, with
only its type-import path adjusted. `fixtures/phase1-pages/` captures raw Home,
About, Work, ProjectPage, Writing, ArticlePage, SiteNav and SiteFooter source.
The earlier `content.ts.snapshot` remains the Phase 0 rollback source.

`scripts/sanity/source.ts` records the Work introduction/control labels and the
four project section headings from these snapshots. Home hero/introduction/CTAs,
About biography and headings, Writing introduction/planned entries and article
body, and shell wordmark/contact/social copy remain deferred to Phases 2–5.
Project metadata, overview, tools, milestones, specifications and reflections come
from the typed snapshot. UI-only numbers, motion, route names and informational
placeholder notices stay in code. Nothing reads the frozen design export.

## Import behavior

Run through the Studio CLI, using the existing authenticated user session rather
than a stored write token. Explicit project, dataset, phase and mode are mandatory:

```sh
cd studio
node node_modules/@sanity/cli/bin/run.js exec scripts/import-phase1.ts --with-user-token -- --project oir24qey --dataset development --phase 1 --mode dry-run
```

Dry-run performs no writes, including no lock creation. Missing references have
report-only pending identifiers. Create mode (`--mode create-missing`) holds a
shared `migrationLock.phase1` document across lookup/create/release; referenced
disciplines are created first. A failed run may leave a partial additive import;
rerunning skips existing records. The lock never expires automatically. If a
process crashes, confirm no import process is running before manually recovering
the lock in Sanity. Concurrent runs fail closed; no lock is stolen or overwritten.

Ordinary IDs are generated by Sanity. Lookup is by source key, accounting for
published/draft pairs. Multiple base IDs or conflicting singleton records abort
before writes. Existing content, including editor changes and drafts, is skipped;
differences and draft presence are reported. Draft-only referenced disciplines
require review before importing dependent projects.

An `update-reviewed` run additionally needs `--manifest PATH`. The JSON array
contains `sourceKey`, `id`, `expectedRevision` and `sourceHash` for each approved
update, taken from a reviewed dry-run report. All documents must already exist.
Unmatched revisions, source hashes, ambiguous records or drafts abort approval
preflight. Updates patch only source-managed top-level fields and use Sanity's
revision guard. An editor change during the run therefore rejects that update;
earlier successful updates remain recorded in Sanity and a fresh dry-run is needed.
There is no replace/import-all operation and no production write mode.

Schema extraction/TypeGen and development schema deployment precede live writes.
Task 1.1 did not switch frontend readers. Task 1.2 now connects Work/project pages
to these records, with rendering parity and domain previews; route shapes are
unchanged. No production cutover is included. See the current verification record.
