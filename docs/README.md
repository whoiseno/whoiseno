# Documentation

Reference docs for the `whoiseno` project — Enoabasi Essien's portfolio site.

Start here, then jump into the file that covers the part you're touching.

| Doc                                        | Covers                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [architecture.md](./architecture.md)       | Overall design: Astro + Feature-Sliced Design layering, path aliases, rendering model |
| [setup.md](./setup.md)                     | Local dev environment, scripts, tooling (lint/format/hooks)                           |
| [layers/app.md](./layers/app.md)           | `src/app` — entrypoints, fonts, global styles                                         |
| [layers/pages.md](./layers/pages.md)       | `src/pages` — file-based routing                                                      |
| [layers/features.md](./layers/features.md) | `src/features` — user-facing feature slices (currently empty)                         |
| [layers/entities.md](./layers/entities.md) | `src/entities` — domain/business objects (currently empty)                            |
| [layers/shared.md](./layers/shared.md)     | `src/shared` — reusable UI primitives and config                                      |
| [components/](./components/README.md)      | Detailed docs + usage examples for every `shared/ui/page` component                   |
| [content.md](./content.md)                 | Content collections and the Pages CMS integration                                     |
| [styling.md](./styling.md)                 | Tailwind v4 theme, fonts, design tokens                                               |
| [animations.md](./animations.md)           | anime.js setup and usage patterns                                                     |

## Quick facts

- **Framework:** [Astro](https://astro.build) 7 (static/SSR site builder), no UI framework — components are `.astro` plus a light dusting of [Alpine.js](https://alpinejs.dev) for interactivity.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, configured through CSS `@theme` rather than a JS config file.
- **Architecture pattern:** [Feature-Sliced Design](https://feature-sliced.design/) (`app` → `pages` → `features` → `entities` → `shared`), enforced only by convention and TS path aliases — the project is early-stage, so `features` and `entities` are scaffolded but empty.
- **Content:** Managed through [Pages CMS](https://pagescms.org/) (`.pages.yml`), writing into Astro content collections under `src/content`.
- **Animation:** [anime.js](https://animejs.com) v4 for anything beyond CSS transitions, wired up via [`src/shared/lib/motion.ts`](../src/shared/lib/motion.ts) — see [`animations.md`](./animations.md).
- **Package manager:** pnpm (see `pnpm-workspace.yaml`).

## Repo-level files worth knowing about

- [`CLAUDE.md`](../CLAUDE.md) / [`AGENTS.md`](../AGENTS.md) — instructions for AI coding agents working in this repo (dev server usage, doc links).
- [`.pages.yml`](../.pages.yml) — Pages CMS schema, defines the `posts` collection and `site` settings file.
- [`astro.config.mjs`](../astro.config.mjs) — integrations (Alpine, Partytown, Tailwind) and font definitions.
- [`tsconfig.json`](../tsconfig.json) — strict TS config and the `@/*` path aliases that mirror the FSD layers.
