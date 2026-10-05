# `src/app`

The wiring layer: global setup that every page depends on but that isn't itself a route, feature, or reusable UI primitive.

```
src/app/
├── entrypoints/
│   └── alpine.ts        # Alpine.js init hook (plugins and Alpine.data registrations)
├── fonts/
│   ├── GeneralSans-Variable.woff2
│   └── Supreme-Variable.woff2
├── layouts/
│   └── Site.astro       # site shell: header, main container, footer
└── styles/
    └── global.css        # Tailwind entry point + theme tokens
```

## `layouts/Site.astro`

The shell every page uses: `Root` > `SiteHeader` (with `ThemeToggle` in its `actions` slot) > `<main>` (`max-w-2xl`, `max-w-4xl` while `<html>` has `data-wide`) > `SiteFooter`. A `header` slot renders under the page description. It lives here rather than in `shared` because it fetches the navigation (`getNavItems`, passed to the header) and the profile (the footer gets its `name` and `socials` via `getSocialLinks`), and `shared` cannot import from `entities`. Props: `title?` and `description?` (see [`pages.md`](./pages.md)).

In development only (`import.meta.env.DEV`), the header's actions slot also shows a "CMS" button linking to `/keystatic`. The way back is added by the `keystaticBackLink` integration in [`astro.config.mjs`](../../astro.config.mjs): a dev-only `before-hydration` script that appends a fixed "Back to site" link to the Keystatic admin page. It uses `before-hydration` because the admin route renders a bare `client:only` island with no `<head>`, so a `page` script never reaches it. Neither control exists in production builds.

## `entrypoints/alpine.ts`

Passed to the `@astrojs/alpinejs` integration as its `entrypoint` option in [`astro.config.mjs`](../../astro.config.mjs). Exports a default function `(Alpine: Alpine) => void` that runs before Alpine starts, used to register plugins and `Alpine.data` components:

```ts
export default (Alpine: Alpine) => {
  Alpine.plugin(anchor);
  Alpine.plugin(intersect);
  registerUi(Alpine);
  registerThemeToggle(Alpine);
  registerWriting(Alpine);
};
```

It registers `@alpinejs/anchor` (popover and dropdown positioning), `@alpinejs/intersect` (registered, but no component uses `x-intersect` at the moment), every shared component's behavior through `registerUi` from `shared/ui/alpine.ts`, the theme toggle through `registerThemeToggle` from `@/features/theme-toggle/client`, and the writing reader, carousel and kind filter store through `registerWriting` from `@/features/writing/client`. Features expose their browser code from `client.ts`, separate from the `.astro` exports in `index.ts` (see [`features.md`](./features.md)). Add further `Alpine.plugin(...)` calls here for new Alpine plugins, and add the corresponding `window.Alpine` typing in [`src/env.d.ts`](../../src/env.d.ts) if needed.

## `fonts/`

Raw variable-font files (`.woff2`) referenced by `fontProviders.local()` entries in `astro.config.mjs`. See [`styling.md`](../styling.md) for how these map to CSS custom properties and Tailwind's font families.

## `styles/global.css`

The single global stylesheet, imported once from `Root.astro` ([`src/shared/ui/layouts/Root.astro`](../../src/shared/ui/layouts/Root.astro)). Pulls in Tailwind (`@import "tailwindcss"`) and defines the `@theme` block (breakpoints, fonts, color and radius mapping), the light tokens in `:root`, the dark tokens in `.dark`, `[data-slot="prose"]` styles (including the breakout), the page-fade `@view-transition`, the theme wipe, and `x-cloak`. Full breakdown in [`styling.md`](../styling.md).

## Conventions

- `app` must not import from `pages`. Pages import `app` for the layout shell, and `app` imports `features`, `entities` and `shared` to compose it (that is how `Site.astro` works). One import goes the other way: `shared/ui/layouts/Root.astro` imports `app/styles/global.css`.
- This is the layer for cross-cutting setup (fonts, global CSS, framework entrypoints) — not for reusable components (those belong in `shared`) or routes (those belong in `pages`).
