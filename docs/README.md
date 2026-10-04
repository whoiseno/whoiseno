# Documentation

Reference docs for the `whoiseno` project — Enoabasi Essien's portfolio site.

Start here, then jump into the file that covers the part you're touching.

| Doc                                        | Covers                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [architecture.md](./architecture.md)       | Overall design: Astro + Feature-Sliced Design layering, path aliases, rendering model |
| [setup.md](./setup.md)                     | Local dev environment, scripts, tooling (lint/format/hooks)                           |
| [layers/app.md](./layers/app.md)           | `src/app` — entrypoints, fonts, global styles                                         |
| [layers/pages.md](./layers/pages.md)       | `src/pages` — file-based routing                                                      |
| [layers/features.md](./layers/features.md) | `src/features` — one slice per portfolio section, plus the theme toggle               |
| [layers/entities.md](./layers/entities.md) | `src/entities` — the profile entity                                                   |
| [layers/shared.md](./layers/shared.md)     | `src/shared` — reusable UI primitives and config                                      |
| [components/](./components/README.md)      | Detailed docs + usage examples for every `shared/ui/page` component                   |
| [content.md](./content.md)                 | Content collections and the Keystatic CMS integration                                 |
| [styling.md](./styling.md)                 | Tailwind v4 theme, fonts, design tokens                                               |
| [animations.md](./animations.md)           | anime.js setup and usage patterns                                                     |

## Quick facts

- **Framework:** [Astro](https://astro.build) 7, statically prerendered with the Vercel adapter for the CMS routes. Site components are `.astro` plus a light dusting of [Alpine.js](https://alpinejs.dev); React is present only for the Keystatic admin.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, configured through CSS `@theme` rather than a JS config file.
- **Architecture pattern:** [Feature-Sliced Design](https://feature-sliced.design/) (`app` → `pages` → `features` → `entities` → `shared`), enforced only by convention and TS path aliases.
- **Content:** Managed through [Keystatic](https://keystatic.com) (`keystatic.config.ts`), writing Markdoc and YAML files into Astro content collections under `src/content`.
- **Animation:** [anime.js](https://animejs.com) v4 for anything beyond CSS transitions, wired up via [`src/shared/lib/motion.ts`](../src/shared/lib/motion.ts) — see [`animations.md`](./animations.md).
- **Package manager:** pnpm (see `pnpm-workspace.yaml`).

## Repo-level files worth knowing about

- [`CLAUDE.md`](../CLAUDE.md) / [`AGENTS.md`](../AGENTS.md) — instructions for AI coding agents working in this repo (dev server usage, doc links).
- [`keystatic.config.ts`](../keystatic.config.ts) — Keystatic CMS schema and storage mode.
- [`src/content.config.ts`](../src/content.config.ts) — Astro content collection definitions (Zod schemas).
- [`astro.config.mjs`](../astro.config.mjs) — integrations (Alpine, Partytown, Markdoc, React, Keystatic, icons, Tailwind), the Vercel adapter, and font definitions.
- [`tsconfig.json`](../tsconfig.json) — strict TS config and the `@/*` path aliases that mirror the FSD layers.
