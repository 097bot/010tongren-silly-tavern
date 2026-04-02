# AGENTS.md

## Project Overview

This repository is a Tavern helper template for building front-end UIs and scripts with Vue, TypeScript, webpack, and Tavern sync tooling.

The main source tree is `src/`. Built assets are written to `dist/`.

If you are working inside a specific project under `src/<project-name>/`, prefer the nearest nested `AGENTS.md`. Those project-local instructions should take precedence over this root file.

## Setup Commands

- Install dependencies: `pnpm install`
- Start realtime development build: `pnpm watch`
- Create a production build: `pnpm build`
- Run Tavern sync commands: `pnpm sync`

## Development Notes

- `pnpm watch` rebuilds the front-end in development mode and also starts the template's Tavern sync watch flow.
- Some front-end pages are intended to run inside the Tavern helper runtime and may expect Tavern globals at runtime.
- If a page is loaded from a local HTTP URL during development, `local-cors-server.mjs` can be used to serve the repository root on port `5510`.
- `dist/` is generated output. During development, edit files in `src/`, not `dist/`.

## Release Notes

- Publish using `pnpm build`, not the `watch` output.
- If using GitHub + jsDelivr, commit the required `dist/` assets so the CDN can serve them.
- Keep local-dev URLs like `127.0.0.1:5510` out of release entries unless the feature is explicitly intended for local development only.

## Project-Specific Guidance

- The active Zero Gate project lives under `src/零始之门/`.
- See `src/零始之门/AGENTS.md` for the source-of-truth workflow, sync commands, and release notes for that project.
