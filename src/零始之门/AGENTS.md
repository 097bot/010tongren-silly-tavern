# AGENTS.md

## Project Overview

This directory is the source of truth for the `零始之门` Tavern project.

Important: do not treat the older external copy at `D:\Silly010\zero_gate_ui\零始之门` as the canonical source for this project. That older folder has caused sync confusion before. The maintained project files for Tavern sync and front-end work live here under `src/零始之门/`.

The Tavern-facing character name is currently `零始之门010`.

## Key Files

- Character config: `零始之门.yaml`
- Tavern sync config: `tavern_sync.yaml`
- Regex entries: `正则/`
- Vue status bar source: `界面/状态栏/`
- World book content: `世界书/`
- Runtime scripts: `脚本/`

## Realtime Development Workflow

From the repository root:

- Start the front-end watcher: `pnpm watch`
- If you need to load local front-end pages through HTTP, start the local file server: `node local-cors-server.mjs`

From this directory:

- Manual push to Tavern: `node tavern_sync.mjs push -f 零始之门`

Current local endpoints used during development:

- Tavern UI: `http://127.0.0.1:8000/`
- Local static server: `http://127.0.0.1:5510/`
- Standalone status bar preview: `http://127.0.0.1:5510/src/零始之门/界面/状态栏/preview.html`

## Status Bar Notes

- The formal status bar source is under `界面/状态栏/`.
- During development, the status bar can load a local HTTP page from `127.0.0.1:5510`.
- For release, do not publish local dev URLs. Replace them with a CDN URL or inline built output, depending on the release strategy.
- Some status bar logic expects Tavern/MVU globals. Keep preview fallbacks for browser-only testing, but preserve Tavern runtime compatibility.

## Build and Release

- Use `pnpm build` before release.
- Do not treat `pnpm watch` output as release output.
- If publishing through GitHub + jsDelivr, commit the required `dist/零始之门/**` assets and switch release entries to the CDN URL.
- Confirm that all referenced CSS, JS, images, and fonts resolve correctly from the CDN path before publishing.

## Sync and Naming Notes

- In `tavern_sync.yaml`, the local config name remains `零始之门`.
- The Tavern-side display name is `零始之门010`.
- If a sync appears to "revert" unexpectedly, first check whether another folder or watcher is pushing a different copy of the project.

## Editing Guidelines

- Prefer editing source files in this directory tree instead of patching generated `dist/` files directly.
- When changing the status bar UI, update Vue source first, then rebuild.
- Keep regex loaders, Tavern sync settings, and the front-end entry path aligned so Tavern, local preview, and release mode all point at the intended target.
