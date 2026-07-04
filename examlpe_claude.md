# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DCS Companion** is a local-first Windows desktop app for DCS World pilots — a second-monitor tool for post-flight stat tracking, live checklists, and tactical map planning. MVP focuses exclusively on `.acmi` file parsing and career stat storage.

## Tech Stack Overview

- **Frontend:** React 19 + TypeScript + Vite + Shadcn UI + Tailwind CSS
- **Desktop shell:** Tauri v2
- **State management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Local database:** SQLite (via Tauri plugin)
- **DCS integration:** DCS-gRPC (primary), Export.lua UDP (fallback) — V2+

## Design Style Guide

**Visual Sytle**
- Interactive Dashboard
- Use Shaden Components For conisstency
- No Drak Mode for MVP

**Component Patterns**
- Shaden UI for all interactive Ellements
- Tailwind for Layout and Spacing
- Keep Components Focused and Small

## Product and UX Guidlines

**Core UX Principles**
- Clean Data Representation

## Project Architecture

Four layers with strict separation:

1. **UI Layer** — React frontend: career dashboard, per-aircraft views, session history, import workflow
2. **App Shell** — Tauri: native packaging, window management, file access, IPC bridge
3. **Backend Layer** — Rust (Tauri core): `.acmi` parsing, stat calculation, SQLite writes
4. **Data Layer** — SQLite: local persistence of sessions, flights, aircraft, kills, deaths

**Tauri Bridge rule:** All `invoke()` calls from the frontend go through `src/ui/lib/tauri.ts` only. No component or hook calls Tauri directly.

**SQLite API rule:** `tauri-plugin-sql` v2 exposes a JavaScript/TypeScript API — SQL queries are written in TypeScript and executed via the plugin's JS bindings, not via `sqlx` in Rust. All database queries live in `src/ui/lib/tauri.ts`. Do not use `sqlx` or raw SQL in Rust command handlers — the Rust side only registers the plugin and defines migrations.

**Integration rule:** DCS data sources (gRPC, Export.lua) are isolated from app logic. All sources normalise into a shared internal event model so the rest of the app is source-agnostic.

## Key Commands

```bash
# Start the full app (Vite frontend + Tauri native window, hot reload)
export PATH="$PATH:/c/Users/devvv/.cargo/bin"
npm run tauri dev

# Frontend only (Vite dev server, no Tauri shell — for UI work)
npm run dev

# Type check
npx tsc --noEmit

# Rust compile check (fast, no binary produced)
export PATH="$PATH:/c/Users/devvv/.cargo/bin"
cargo check --manifest-path src-tauri/Cargo.toml

# Production build
npm run tauri build
```

### Windows / Bash PATH note

On this machine, `cargo` and `rustc` are not on the default bash PATH. Run this once per shell session before any Rust or Tauri commands:

```bash
export PATH="$PATH:/c/Users/devvv/.cargo/bin"
```

### Re-scaffolding warning

`create-tauri-app` cannot target a non-empty directory. If re-scaffolding is ever needed:

1. Scaffold to a temp path first: `npx create-tauri-app /tmp/dcs-temp --template react-ts`
2. **Before copying any files**, fix the package name in `/tmp/dcs-temp/package.json` and crate name in `/tmp/dcs-temp/src-tauri/Cargo.toml` — the temp path leaks into these fields
3. Copy files from the temp directory into the repo root
4. Delete the temp directory

## Repository Ettiquette

**Branching**

- Always Create Feature Branch Bfore starting major changes
- NEVER commint directly to `main`
- Branch Naming: `feaure/description` or `fix/description`
- Use the `/update-docs-and-commit` slash command when committing

**Session Start Check**

Before writing any code, verify the current branch state:

```bash
git branch --show-current   # confirm you are NOT on main
git status                  # confirm working tree is clean
git log --oneline -3        # confirm last commit is expected
```

If the current branch is `main`, or if the branch was already merged, stop and create a new feature branch before proceeding. When continuing work in the same feature area after a merge, name the new branch `fix/<area>` or `feature/<area>-cont` as appropriate (e.g. `fix/acmi-parser`, not a repeat of the merged branch name).

**Git Workflow for major changes**

1. Create a new branch `git checout -b feature/your-feautre-name`
2. Develop And commit pn feautre Branch
3. Test Locally Before Pushing
4. Push the Branch: `git push - u origin feature/your-feautre-name`

**Commits**

- Write Clear commit messages describing the changes
- Keep Commits focused on single Changes

**Pull Requests**
 - Create PRs for all changes to `main`
 - NEVER force push to `main`
 - Include description of what changed and why



## Rust / Tauri Backend Patterns

**Managed state:** To call `app.manage()` in the `setup` hook, you must explicitly import `tauri::Manager` at the top of `lib.rs`. The trait is not in scope by default even though `AppHandle` is.

```rust
use tauri::Manager; // required for app.manage()
```

**notify-debouncer-mini error shape:** `DebounceEventResult` is `Result<Vec<DebouncedEvent>, Error>` — the `Err` arm is a **single error**, not an iterator. Match it as `Err(e)`, not `Err(errors)`.

**ACMI file format — magic-byte detection only:** Tacview saves replay files with a plain `.acmi` extension regardless of whether the content is ZIP-compressed or plain text. Never use the file extension to decide how to decompress. Always read the first four bytes and check for the ZIP magic number `PK\x03\x04` (`0x50 0x4B 0x03 0x04`). Older Tacview versions also write UTF-16 LE files with a `0xFF 0xFE` BOM — handle that second. Everything else is plain UTF-8. See `src-tauri/src/acmi/parser.rs` for the canonical implementation.

## Coding Style & Standards

- **TypeScript everywhere** on the frontend — no `any` without an explanatory comment
- **One feature, one folder** — all code for a feature lives in `src/ui/features/<feature-name>/`
- **One Redux slice per feature** — stats, checklists, live-session, map. Shared app state goes in `appSlice`
- **Slice shape changes require consumer audit** — when rewriting a Redux slice's state shape, grep all files that import from that slice before committing. Components referencing removed or renamed fields cause runtime errors that TypeScript won't catch if the field was loosely typed.
- **Local state for UI-only concerns** — open/closed modals, hover states stay in `useState`, not Redux
- **Comments explain why, not what** — code should be self-explanatory; comments are for intent
- **No premature abstraction** — build for the current milestone only, don't scaffold future versions

- Prefer Shaden Components over adding new UI libraries
- Minimalise External Dependencies for MVP

## MVP Constraints

- No user accounts, no cloud, no network dependency
- No live telemetry or write-back to DCS
- Read-only architecture — app never modifies DCS files

## Roadmap Context

- **V1:** Interactive checklists — sim-aware, auto-ticking, JSON import/export
- **V2:** Live session stats + F10 map (player position, K/D, server name)
- **V3+:** Waypoint planning and export, multi-user party features

## Documentation

**Core Documentation**

- [Product Spec](product_spec.md) — Full feature definitions, user flows, decisions log
- [Architecture](docs/architecture.md) — System design and data flow
- [Changelog](docs/changelog.md) — Version history
- [Project Status](docs/project_status.md) — Current progress, features to implement
- [ACMI Pipeline](feature-docs/acmi-pipeline.md) — In-depth walkthrough of the import pipeline with debug checklist
- [Reference ACMI parser (Electron PoC)](C:\Users\devvv\Documents\Coding\Logbook-DCS\server\acmiParser.js) — Working JavaScript implementation; use to verify parsing behaviour when the Rust parser produces unexpected results