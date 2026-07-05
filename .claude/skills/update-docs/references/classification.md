# Change Classification Rules

Use these rules in Step 2 to classify git changes before touching any docs.

---

## Change types

### Feature

A new capability or piece of content has been added that wasn't there before.

Signals:
- New page added to `src/pages/` and wired into `src/App.tsx`
- New project or article added to `src/data/content.ts`
- New reusable component added under `src/components/{ui,cards,layout,motion}/`
- New scroll-motion behavior added via `src/hooks/`

### Fix

An existing capability has been corrected, not extended.

Signals:
- Change to an existing component/page/hook that corrects a bug or visual defect
- Logic correction without adding new files
- A previously-broken route, filter, or interaction now working

### Structural change

The architecture, layout, or dependencies changed in a way that affects how someone
understands or extends the codebase. ANY of these = structural:

- New top-level folder under `src/` (e.g. a new category under `src/components/`)
- New route added in `src/App.tsx`
- New file added to `src/hooks/`
- `package.json` — dependency added or removed
- New file added under `src/styles/` (design-token or global-style changes)
- Anything touching `design-export/` (should almost never happen — flag it, don't just log it)

NOT structural:
- Content-only edits to `src/data/content.ts` (that's a feature or fix, not structural)
- Styling tweaks within an existing component's inline `style` object
- Doc-only edits

---

## Classification output

After classifying, hold:

```
change_types: [feature, fix, structural]   ← list, can be multiple
summary: "Added the Work page's discipline filter and wired the AI category"
```

Use this to decide which of Steps 3–5 to execute.
