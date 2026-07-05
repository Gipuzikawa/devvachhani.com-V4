---
name: verify
description: How to launch and drive devvachhani.com to verify changes at runtime — dev server, browser automation, motion/animation checks, reduced-motion emulation.
---

# Verifying devvachhani.com changes

Vite SPA — no login, no backend. Verification = drive routes in a real browser and watch the motion.

## Launch

```bash
npm run dev   # http://localhost:5173/ — run in background, ready in <1s
```

## Drive (agent-browser via npx)

`agent-browser` is not on PATH; use `npx agent-browser` from PowerShell. Each PowerShell call is a fresh shell — re-set any env vars every call.

```powershell
npx agent-browser open http://localhost:5173/
npx agent-browser find text "Work" click        # SPA nav (text is "Work", CSS uppercases it)
npx agent-browser scroll down 900               # trigger scroll reveals
npx agent-browser screenshot "$env:S\shot.png"
npx agent-browser close                         # always close when done
```

Gotchas learned the hard way:

- `eval --stdin` must have the script **piped** (`@'…'@ | npx agent-browser eval --stdin`); passing the here-string as an argument hangs forever on empty stdin.
- Clicking the "Dev Vachhani" wordmark via `find text` fails ("covered by nav") — navigate with `open <url>` instead.
- npx startup latency (~1–2s per call) outruns sub-second animations. To observe a tween mid-flight, do it inside **one** `eval`: programmatically click, `await setTimeout ~100ms`, read `getComputedStyle(el).opacity` (expect 0<x<1).

## Console errors

No console capture command; install a hook once after load (survives SPA navigation, not reloads):

```js
window.__errs = []; console.error = (...a) => { window.__errs.push(String(a)); };
window.addEventListener('error', e => window.__errs.push(e.message));
```

Read back `window.__errs` at the end — project convention is zero console errors on all routes.

## Reduced motion (required check for any motion change)

```powershell
npx agent-browser set media reduced-motion
npx agent-browser open http://localhost:5173/
# assert: content immediately at final state — opacity 1, transform none, nothing gated
npx agent-browser set media light               # restore
```

## Flows worth driving after motion changes

1. Home: hero line-mask timeline plays, project grid staggers in on scroll.
2. Nav to each route: enter transition, page renders, active nav underline.
3. Work: filter chips re-stagger the grid (rapid-click a few chips — must settle at opacity 1, correct card set); Rows/Grid toggle.
4. Scroll About + Writing through all reveals.
5. Reduced-motion pass (above) + `window.__errs` empty.
