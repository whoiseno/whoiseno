# Documentation

Reference docs for the `whoiseno` project — Enoabasi Essien's portfolio site.

Start here, then jump into the file that covers the part you're touching.

| Doc                                          | Covers                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------- |
| [architecture.md](./architecture.md)         | Overall design: Astro + Feature-Sliced Design layering, path aliases, rendering model |
| [setup.md](./setup.md)                       | Local dev environment, scripts, tooling (lint/format/hooks)                           |
| [layers/app.md](./layers/app.md)             | `src/app` — document and site shell, Alpine setup, global styles                      |
| [layers/pages.md](./layers/pages.md)         | `src/pages` — file-based routing                                                      |
| [layers/features.md](./layers/features.md)   | `src/features` — one slice per portfolio section, plus the theme and sound toggles    |
| [layers/entities.md](./layers/entities.md)   | `src/entities` — the profile, navigation and writing tag entities                     |
| [layers/shared.md](./layers/shared.md)       | `src/shared` — reusable UI primitives and config                                      |
| [components/](./components/README.md)        | Detailed docs + usage examples for every `shared/ui/page` component                   |
| [content.md](./content.md)                   | Content collections and the Keystatic CMS integration                                 |
| [books-and-movies.md](./books-and-movies.md) | Books from Hardcover (caching and quota), and adding movies in the CMS admin          |
| [styling.md](./styling.md)                   | Tailwind v4 theme, Utopia fluid type and space, fonts, design tokens                  |
| [animations.md](./animations.md)             | anime.js setup and usage patterns                                                     |

## Quick facts

- **Framework:** [Astro](https://astro.build) 7, statically prerendered, with a server adapter (Vercel in production, Node for a local `pnpm preview`) for the CMS routes and the on-demand books page. Site components are `.astro` plus a light dusting of [Alpine.js](https://alpinejs.dev); React is present only for the Keystatic admin.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, configured through CSS `@theme` rather than a JS config file.
- **Architecture pattern:** [Feature-Sliced Design](https://feature-sliced.design/) (`app` → `pages` → `features` → `entities` → `shared`), enforced only by convention and TS path aliases.
- **Content:** Managed through [Keystatic](https://keystatic.com) (`keystatic.config.ts`), writing Markdoc and YAML files into Astro content collections under `src/content`.
- **Animation:** [anime.js](https://animejs.com) v4 for anything beyond CSS transitions, wired up via [`src/shared/lib/motion.ts`](../src/shared/lib/motion.ts) — see [`animations.md`](./animations.md).
- **Package manager:** pnpm (see `pnpm-workspace.yaml`).

## Repo-level files worth knowing about

- [`CLAUDE.md`](../CLAUDE.md) / [`AGENTS.md`](../AGENTS.md) — instructions for AI coding agents working in this repo (dev server usage, doc links).
- [`keystatic.config.ts`](../keystatic.config.ts) — Keystatic CMS schema and storage mode.
- [`src/content.config.ts`](../src/content.config.ts) — Astro content collection definitions (Zod schemas).
- [`astro.config.mjs`](../astro.config.mjs) — integrations (Alpine, Partytown, Markdoc, React, Keystatic, icons, Tailwind), the Vercel and Node adapters, and font definitions.
- [`tsconfig.json`](../tsconfig.json) — strict TS config and the `@/*` path aliases that mirror the FSD layers.
