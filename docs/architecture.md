# Architecture

## Overview

`whoiseno` is a content-driven portfolio site built with [Astro](https://astro.build). Astro compiles `.astro` components to static HTML at build time; [Alpine.js](https://alpinejs.dev) is loaded for the small amount of client-side interactivity needed, and [Partytown](https://partytown.builder.io) is configured to offload third-party scripts to a web worker when they're added.

Site pages use no client-side framework (React/Vue/Svelte): they are build-time rendered `.astro` templates. React is installed only because the Keystatic admin UI at `/keystatic` requires it.

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

`features` holds one slice per section of the portfolio (works, projects, uses, books, movies, writing) plus the theme toggle. Each slice is organized into segments (`ui`, `model`, `config`) with an `index.ts` public API, and slices that run code in the browser add a `client.ts` entry for their Alpine registrations; see [`layers/features.md`](./layers/features.md). `entities` holds the profile, the writing tags and the navigation links. New domain concepts should land in `entities`, and user-facing behavior in `features`, rather than accumulating inside `pages` or `shared`.

Books and movies are reached through a `/hobbies` hub (`/hobbies/books`, `/hobbies/movies`) rather than top-level routes.

`app/layouts/Site.astro` (the header/main/footer shell) lives in `app`, not `shared`, because it reads the profile entity for the footer and `shared` cannot import upward.

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

1. A request for a route (e.g. `/works`) matches a file under `src/pages` ([routing docs](https://docs.astro.build/en/guides/routing/)). All site routes are prerendered; only `/keystatic` and `/api/keystatic/*` are rendered on demand.
2. The page wraps its content in `app/layouts/Site.astro`, which composes `Root`, `SiteHeader`, `SiteFooter` and the `ThemeToggle` feature, then fills the main area with feature slices (`WorkList`, `ProjectList`, ...) and entities (`ProfileHero`). See [`layers/pages.md`](./layers/pages.md).
3. `Root.astro` sets up the HTML document shell: meta tags, favicon, `<title>`, a blocking inline script that applies the saved theme before first paint, and the three fonts declared in `astro.config.mjs` via Astro's `<Font />` component.
4. Global Tailwind styles (`src/app/styles/global.css`) are imported once, inside `Root.astro`.
5. The Alpine.js entrypoint (`src/app/entrypoints/alpine.ts`) is wired up via the `@astrojs/alpinejs` integration and registers the `@alpinejs/anchor` and `@alpinejs/intersect` plugins plus the shared components' `Alpine.data` behaviors, the theme toggle and the writing slice (reader with table of contents and wide and focus modes, carousel, kind filter store) before Alpine initializes client-side. Features register through their `client.ts`, not their `index.ts`.

## Integrations in use

Configured in [`astro.config.mjs`](../astro.config.mjs):

- **`@astrojs/alpinejs`** — loads Alpine.js with a custom entrypoint for plugin and component registration.
- **`@astrojs/partytown`** — ready to offload third-party scripts (analytics, etc.) to a worker thread; no scripts routed through it yet.
- **`@astrojs/markdoc`** — renders `.mdoc` content entries (see [`content.md`](./content.md)). [`markdoc.config.mjs`](../markdoc.config.mjs) at the project root adds Shiki highlighting and the `carousel`, `slide`, `columns`, `column`, `math` and `inlineMath` tags used by writing entries. The two math tags are rendered at build time by [KaTeX](https://katex.org) (`katex` dependency), so no math code ships to the browser.
- **`@keystatic/astro`** and **`@astrojs/react`** — the Keystatic CMS admin at `/keystatic`; React is a dependency of the admin only.
- **`keystaticBackLink`** — a small inline integration in `astro.config.mjs`, active only under `astro dev`, that adds a "Back to site" link to the admin page. See [`layers/app.md`](./layers/app.md).
- **`astro-icon`** with `@iconify-json/ph` — Phosphor icons, plus the local SVGL tech logos in `src/icons/logos/`. Together with `reicon-astro` (a component package, not an integration) it sits behind one `Icon` component in `shared/ui/icon`; see [`layers/shared.md`](./layers/shared.md).
- **`@astrojs/vercel`** (adapter) — required for the on-demand Keystatic routes; the rest of the site stays static.
- **`@tailwindcss/vite`** — Tailwind v4's Vite plugin (no `tailwind.config.js`; theme lives in CSS, see [`styling.md`](./styling.md)).
- **Fonts** — two local variable fonts (Supreme, General Sans) served via `fontProviders.local()`, plus Geist Mono via `fontProviders.fontsource()` (Astro's built-in Fontsource integration, fetched at build time).

Not an Astro integration, but part of the same client-side stack: **`tw-animate-css`** for simple enter and exit animations (a Tailwind v4 plugin imported in `global.css`), and **anime.js** (`animejs`), a general-purpose animation library used for anything beyond that (staggered/sequenced/scroll-driven animation). Imported directly in component `<script>` tags rather than through a config-level entrypoint like Alpine — see [`animations.md`](./animations.md).

**`sharp`** is a dependency because every `astro:assets` image (profile, uses, writing) is processed at build time, and `astro build` fails with `MissingSharp` without it.

## Content

Content lives in Astro content collections under `src/content` (navigation, profile, works, projects, writing, software, hardware, books, movies), authored through Keystatic. See [`content.md`](./content.md) for the schema, the admin, and how it maps to the codebase.
