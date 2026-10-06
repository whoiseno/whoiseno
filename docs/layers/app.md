# `src/app`

The wiring layer: global setup that every page depends on but that isn't itself a route, feature, or reusable UI primitive.

`app` has no slices, only segments:

```
src/app/
├── config/
│   ├── alpine.ts            # Alpine.js init hook (plugins and Alpine.data registrations)
│   └── site.ts              # siteName
├── model/
│   └── types.ts             # TypeCrumb
├── styles/
│   └── global.css           # Tailwind entry point + theme tokens
└── ui/
    ├── index.ts             # public API: Site
    ├── Root.astro           # HTML document shell
    ├── Site.astro           # site shell: sidebar, main container, footer
    ├── SiteBreadcrumbs.astro
    ├── SiteFooter.astro
    └── SiteSidebar.astro
```

The variable fonts and the SVGL logos are static assets, so they live in `src/assets/fonts/` and `src/assets/icons/logos/` instead of a layer (see [`styling.md`](../styling.md) and [`shared.md`](./shared.md)).

## `ui/Site.astro`

The shell every page uses: `Root` > a body row (`data-slot="site-body"`) with `SiteSidebar` and the content column, then `SiteFooter` as a separate full-width row. From `lg` the body row is a centered grid of three tracks (`14rem minmax(0,1fr) 14rem`, `max-w-7xl`, `max-w-384` while `<html>` has `data-wide`): the sidebar is the first track, the content the second, and the empty third track balances the first, so the content is centered on the screen. The sidebar sits beside the content, not on the screen edge, and its rail is sticky inside a cell that ends where the footer starts. It has the site name, the navigation, a `toc` slot in the middle and the actions at the bottom: a `tools` slot for page-specific buttons (the writing toolbar), then the `ScrollToTop` button (from `lg` only) and the `ThemeToggle`, laid out in a left-aligned column. Below `lg` the same component becomes a sticky top bar with a menu button that opens the links. The content column is an `@container` (`data-slot="site-content"`, so `cqw` inside it is the column width) holding `<main>` (`max-w-2xl`, `max-w-4xl` while `<html>` has `data-wide`). `<body>` is an `@container` as well, and the body row captures its width as `--page-width` (`[--page-width:100cqw]`) for the full-width carousel; see [`styling.md`](../styling.md).

When `title` is set, `Site` renders a `<header>` with the breadcrumbs (when `crumbs` is passed), the page `<h1>` and the muted description, then the `header` slot. The `toc` and `tools` slots are forwarded to the sidebar. It lives here rather than in `shared` because it fetches the navigation (`getNavItems`, passed to the sidebar) and the profile (the footer gets its `name` and `socials` via `getSocialLinks`), and `shared` cannot import from `entities`. Pages import it through the public API: `import { Site } from "@/app/ui"`.

Props: `title?`, `description?`, `crumbs?` (a `TypeCrumb[]` trail, shown above the title and nested under its nav link in the sidebar), `image?` and `imageAlt?` (the social preview image, an `ImageMetadata`) and `type?` (`website` or `article`, for `og:type`). `image` is resized to 1200px wide with `getImage` and turned into an absolute URL against `Astro.site`, so `og:image` is emitted only when `site` is set. [`astro.config.mjs`](../../astro.config.mjs) sets it from `VERCEL_PROJECT_PRODUCTION_URL`; locally and on a deployment without that variable the tag is omitted. The image keeps the format of the source file, so use a PNG or JPEG cover (social networks do not render SVG). See [`pages.md`](./pages.md).

In development only (`import.meta.env.DEV`), the actions also include a "CMS" button beside the theme toggle linking to `/keystatic`. The way back is added by the `keystaticBackLink` integration in [`astro.config.mjs`](../../astro.config.mjs): a dev-only `before-hydration` script that appends a fixed "Back to site" link to the Keystatic admin page. It uses `before-hydration` because the admin route renders a bare `client:only` island with no `<head>`, so a `page` script never reaches it. Neither control exists in production builds.

## `ui/Root.astro`

The outermost wrapper for every page, rendered by `Site`: renders `<html>`/`<head>`/`<body>`, sets favicons, viewport meta, the Astro generator meta tag, and the `<title>` (`"<title> | Enoabasi Computer"`, or just the site name when no `title` prop is passed). A blocking inline script reads `localStorage.theme` (falling back to `prefers-color-scheme`) and sets the `dark` class on `<html>` before first paint. It also registers the three site fonts via Astro's `<Font />` component (names must match the `cssVariable` values in [`astro.config.mjs`](../../astro.config.mjs)) and imports the global stylesheet. The `<body>` carries the base Tailwind classes shared by every page.

## Shell parts

`Site` composes three parts that are used nowhere else, so they stay private to `ui` and are not exported from `index.ts`:

| Component         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SiteSidebar`     | Navigation. From `lg` a 14rem rail beside the content (sticky, the height of the screen, no border) with the site name, the links, a `toc` slot and the actions (`tools` and `actions` slots) at the bottom; below `lg` a sticky top bar with a menu button (`x-show` with `x-cloak`). The active link gets `aria-current="page"`; with `crumbs`, the steps after the first nest under the link the trail starts from. Props `items`, `owner`, `avatar?`, `crumbs?`.                  |
| `SiteBreadcrumbs` | Renders a `TypeCrumb[]` with the breadcrumb parts from `shared/ui/breadcrumb`. A crumb with an `href` is a link, the one without is the current page. Prop `crumbs`.                                                                                                                                                                                                                                                                                                                  |
| `SiteFooter`      | "Let's be friends" heading and a two-column (three from `sm`) grid of socials, each with the platform, an arrow and the handle. The email cell shows the address with a `CopyButton`. Below it, the copyright and "Made with a heart by" the owner's first name on one row, a faint colophon paragraph on the tech stack and the choices behind it (edit the text in the component), and TMDB's required attribution notice for the film and series posters. Props `name`, `socials`. |

## `config/site.ts`

Holds the site name (`"Enoabasi Computer"`, also the `<title>` suffix). The navigation links are not here: they are content, edited in the Navigation singleton and read by `entities/navigation` (see [`content.md`](../content.md)).

## `model/types.ts`

`TypeCrumb`: one step of a page's trail (`label`, and an `href` on every step except the current page). It is the type of the `crumbs` prop on `Site`, `SiteSidebar` and `SiteBreadcrumbs`, and of the arrays pages build. `TypeNavItem` belongs to `entities/navigation` and `TypeSocialLink` to `entities/profile`.

## `config/alpine.ts`

Passed to the `@astrojs/alpinejs` integration as its `entrypoint` option in [`astro.config.mjs`](../../astro.config.mjs). Exports a default function `(Alpine: Alpine) => void` that runs before Alpine starts, used to register plugins and `Alpine.data` components:

```ts
export default (Alpine: Alpine) => {
  Alpine.plugin(anchor);
  Alpine.plugin(intersect);
  registerUi(Alpine);
  registerScrollToTop(Alpine);
  registerThemeToggle(Alpine);
  registerWriting(Alpine);
};
```

It registers `@alpinejs/anchor` (popover and dropdown positioning), `@alpinejs/intersect` (registered, but no component uses `x-intersect` at the moment), every shared component's behavior through `registerUi` from `shared/ui/alpine.ts`, the scroll-to-top button through `registerScrollToTop` from `@/features/scroll-to-top/client`, the theme toggle through `registerThemeToggle` from `@/features/theme-toggle/client`, and the writing reader store, carousel and kind filter store through `registerWriting` from `@/features/writing/client`. Features expose their browser code from `client.ts`, separate from the `.astro` exports in `index.ts` (see [`features.md`](./features.md)). Add further `Alpine.plugin(...)` calls here for new Alpine plugins, and add the corresponding `window.Alpine` typing in [`src/env.d.ts`](../../src/env.d.ts) if needed.

## `styles/global.css`

The single global stylesheet, imported once from `Root.astro` ([`src/app/ui/Root.astro`](../../src/app/ui/Root.astro)). Pulls in Tailwind (`@import "tailwindcss"`) and defines the `@theme` block (breakpoints, fonts, color and radius mapping), the light tokens in `:root`, the dark tokens in `.dark`, `[data-slot="prose"]` styles (including the breakout), the registered `--page-width` property, the thin scrollbars, the lightbox scroll lock, the page-fade `@view-transition`, the theme wipe, and `x-cloak`. Full breakdown in [`styling.md`](../styling.md).

## Conventions

- `app` must not import from `pages`. `app` imports `features`, `entities` and `shared` to compose the shell (that is how `Site.astro` works), and its own segments through relative paths.
- `pages` import `app` for the layout shell (`import { Site } from "@/app/ui"`). Strict FSD allows only downward imports and puts `app` on top, so this is an upward import. It is kept on purpose: the project has no `widgets` layer, and the shell has to import `app/styles/global.css`, which a lower layer could not do. It is the one exception, and only through `@/app/ui`.
- This is the layer for cross-cutting setup (the document shell, global CSS, framework entrypoints) — not for reusable components (those belong in `shared`) or routes (those belong in `pages`).
- The segments are `ui`, `model`, `config` and `styles`; `app` has no slices.
