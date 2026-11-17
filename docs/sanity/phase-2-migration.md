# Phase 2 migration

Implement the approved Articles/Writing phase against `oir24qey/development`.
The source is the versioned static-content snapshot and Writing page snapshot
recorded in the inventory. Import one article and one Writing singleton with
three owned planned entries. There are no real article image assets to upload.

Map typed source blocks to restricted Portable Text with stable keys, explicit
heading IDs, paragraph drop-cap flags, placeholder figures and pull quotes.
Sanity 6 rejects custom fields on native blocks. Owned `articleHeading` and
`articleParagraph` objects hold a single rich-text block plus that metadata;
the adapter normalizes them without flattening spans or marks. Ordinary
paragraphs and nested list items remain native Portable Text blocks.
Store `2026-06-12` as the publication date; format the index and reading-page
dates as before. Preserve the six-minute override and placeholder maturity.
Related-project references are optional, since the static article has none.

Extend the existing runner explicitly to Phase 2, retaining the shared lock,
source-key matching, skip/report reruns and reviewed revision/hash update guards.
Deploy the development schema, inspect a no-write report, create only missing
records, and verify a rerun creates nothing. Existing editor content is preserved.

Connect registered typed queries and adapters to resolved, revision-keyed views.
Use `@portabletext/react` for marks, links, nested lists and custom figures/quotes.
Keep existing routes, TOC anchors, progress behavior, body typography and motion.
There are no URL changes or redirects. Static snapshots remain rollback evidence;
Home/About/shell remain on their existing readers.

Validate source parity, invalid/incomplete content, guarded imports, rich rendering
and async route boundaries. Run development-only draft/publish/edit/exit checks
with owned disposable IDs. Record origin and primed-CDN results separately.
Browser access and deployed staging checks are independent acceptance items;
neither is implied by DOM/HTTP tests. No production cutover is authorized.
