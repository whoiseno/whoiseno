# `src/app`

The wiring layer: global setup that every page depends on but that isn't itself a route, feature, or reusable UI primitive.

```
src/app/
├── entrypoints/
│   └── alpine.ts        # Alpine.js init hook (plugin registration)
├── fonts/
│   ├── GeneralSans-Variable.woff2
│   └── Supreme-Variable.woff2
└── styles/
    └── global.css        # Tailwind entry point + theme tokens
```

## `entrypoints/alpine.ts`

Passed to the `@astrojs/alpinejs` integration as its `entrypoint` option in [`astro.config.mjs`](../../astro.config.mjs). Exports a default function `(Alpine: Alpine) => void` that runs before Alpine starts, used to register plugins:

```ts
export default (Alpine: Alpine) => {
  Alpine.plugin(intersect);
};
```

Currently registers `@alpinejs/intersect`. Add further `Alpine.plugin(...)` calls here for new Alpine plugins, and add the corresponding `window.Alpine` typing in [`src/env.d.ts`](../../src/env.d.ts) if needed.

## `fonts/`

Raw variable-font files (`.woff2`) referenced by `fontProviders.local()` entries in `astro.config.mjs`. See [`styling.md`](../styling.md) for how these map to CSS custom properties and Tailwind's font families.

## `styles/global.css`

The single global stylesheet, imported once from `Root.astro` ([`src/shared/ui/layouts/Root.astro`](../../src/shared/ui/layouts/Root.astro)). Pulls in Tailwind (`@import "tailwindcss"`) and defines the `@theme` block (breakpoints, font variables) plus base-layer CSS custom properties (colors, radius). Full breakdown in [`styling.md`](../styling.md).

## Conventions

- Nothing in `app` should depend on `pages`, `features`, `entities`, or `shared` — it sits above all of them and is imported _by_ them (e.g. `shared/ui/layouts/Root.astro` imports `app/styles/global.css`).
- This is the layer for cross-cutting setup (fonts, global CSS, framework entrypoints) — not for reusable components (those belong in `shared`) or routes (those belong in `pages`).
