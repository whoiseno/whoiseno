# Architecture

## Overview

`whoiseno` is a content-driven portfolio site built with [Astro](https://astro.build). Astro compiles `.astro` components to static HTML at build time; [Alpine.js](https://alpinejs.dev) is loaded for the small amount of client-side interactivity needed, and [Partytown](https://partytown.builder.io) is configured to offload third-party scripts to a web worker when they're added.

There is no client-side framework (React/Vue/Svelte) in use — pages are server/build-time rendered `.astro` templates.

## Layering: Feature-Sliced Design

The `src/` directory follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD), a layered architecture where each layer may only import from layers below it:

```
app        →  wiring: entrypoints, global styles, fonts
pages      →  routes (file-based, one file = one URL)
features   →  user-facing functionality (e.g. a contact form, a like button)
entities   →  domain/business objects (e.g. a "post" or "project")
shared     →  reusable, domain-agnostic UI primitives and config
```

Import direction is enforced by convention and by the TS path aliases in [`tsconfig.json`](../tsconfig.json) — nothing currently lints against violating it (no `eslint-plugin-boundaries` or similar), so treat the layering as a team convention rather than a build-time guarantee.

See the per-layer reference docs in [`layers/`](./layers/) for what lives in each one today.

### Why this matters for this project

The project is early-stage: `entities` and `features` are currently empty scaffolding. As the site grows (e.g. a blog listing, a projects grid), new domain concepts should land in `entities`, and interactive/user-facing behavior in `features`, rather than accumulating inside `pages` or `shared`.

## Path aliases

Defined in [`tsconfig.json`](../tsconfig.json), one alias per layer:

| Alias          | Resolves to      |
| -------------- | ---------------- |
| `@/app/*`      | `src/app/*`      |
| `@/pages/*`    | `src/pages/*`    |
| `@/features/*` | `src/features/*` |
| `@/entities/*` | `src/entities/*` |
| `@/shared/*`   | `src/shared/*`   |
| `@/content/*`  | `src/content/*`  |

Prettier's import-sort plugin ([`.prettierrc`](../.prettierrc)) is configured to group and order imports in exactly this layer sequence (`@app` → `@pages` → `@features` → `@entities` → `@shared` → third-party → relative → CSS), so import order in a file is a visual cue for layering violations.

## Rendering & routing flow

1. A request for a route (e.g. `/`) matches a file under `src/pages` ([routing docs](https://docs.astro.build/en/guides/routing/)) — currently just `index.astro`.
2. The page composes layout/UI primitives from `src/shared/ui` (`Root` → `Page` → `PageContainer` → `PageHeader`/`PageFooter`/etc.), following a slot-based composition pattern (see [`layers/shared.md`](./layers/shared.md)).
3. `Root.astro` sets up the HTML document shell: meta tags, favicon, `<title>`, and registers the three fonts declared in `astro.config.mjs` via Astro's `<Font />` component.
4. Global Tailwind styles (`src/app/styles/global.css`) are imported once, inside `Root.astro`.
5. The Alpine.js entrypoint (`src/app/entrypoints/alpine.ts`) is wired up via the `@astrojs/alpinejs` integration and registers plugins (currently `@alpinejs/intersect`) before Alpine initializes client-side.

## Integrations in use

Configured in [`astro.config.mjs`](../astro.config.mjs):

- **`@astrojs/alpinejs`** — loads Alpine.js with a custom entrypoint for plugin registration.
- **`@astrojs/partytown`** — ready to offload third-party scripts (analytics, etc.) to a worker thread; no scripts routed through it yet.
- **`@tailwindcss/vite`** — Tailwind v4's Vite plugin (no `tailwind.config.js`; theme lives in CSS, see [`styling.md`](./styling.md)).
- **Fonts** — two local variable fonts (Supreme, General Sans) served via `fontProviders.local()`, plus Geist Mono via `fontProviders.fontsource()` (Astro's built-in Fontsource integration, fetched at build time).

## Content

Content (blog posts, site settings) is intended to live in Astro content collections under `src/content`, authored through Pages CMS. See [`content.md`](./content.md) for the schema and how it maps to the codebase.
