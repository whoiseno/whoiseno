# `src/shared`

The bottom layer: reusable, domain-agnostic building blocks with no dependency on any other layer.

```
src/shared/
├── config/
│   └── site.ts            # siteName, navItems, TypeNavItem, TypeSocialLink
├── lib/
│   ├── date.ts            # formatMonthYear, formatDateRange (UTC-based)
│   └── motion.ts          # anime.js scope helper
└── ui/
    ├── avatar/Avatar.astro
    ├── badge/Badge.astro
    ├── button/Button.astro
    ├── card/Card.astro
    ├── layouts/Root.astro          # HTML document shell
    ├── page/                       # older slot-based layout primitives (currently unused by pages)
    ├── prose/Prose.astro
    ├── rating/Rating.astro
    ├── section/Section.astro
    └── site/
        ├── SiteFooter.astro
        └── SiteHeader.astro
```

All components carry a `data-slot="..."` attribute for structural CSS targeting and follow the project's `class:list` pattern.

## `ui/layouts/Root.astro`

The outermost wrapper for every page: renders `<html>`/`<head>`/`<body>`, sets favicons, viewport meta, the Astro generator meta tag, and the `<title>` (`"<title> | EnoEno Computer"`, or just the site name when no `title` prop is passed). A blocking inline script reads `localStorage.theme` (falling back to `prefers-color-scheme`) and sets the `dark` class on `<html>` before first paint. It also registers the three site fonts via Astro's `<Font />` component (names must match the `cssVariable` values in [`astro.config.mjs`](../../astro.config.mjs)) and imports the global stylesheet. The `<body>` carries the base Tailwind classes shared by every page.

## Components

| Component    | Notes                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`     | Props `variant` (`solid`, `outline`, `ghost`, `link`), `color` (`brand`, `primary`, `secondary`, `neutral`), `size` (`xxs` to `xxl`) and `loading`. An `svg`-only child makes it square (`has-[>svg:only-child]`). |
| `Card`       | Props `href?` and `class?`. Renders an `<a>` when `href` is set (external links open in a new tab with `rel="noopener noreferrer"`), otherwise a `<div>`.                                                          |
| `Badge`      | Variants `outline` and `success` (green dot).                                                                                                                                                                      |
| `Avatar`     | Uses `Image` from `astro:assets`; falls back to initials.                                                                                                                                                          |
| `Prose`      | Wrapper that applies the `[data-slot="prose"]` typography styles to rendered Markdoc.                                                                                                                              |
| `Rating`     | Five Phosphor stars with an `aria-label`; props `value`.                                                                                                                                                           |
| `Section`    | Props `title`, `href?`, `hrefLabel="View all"`. Adds the fade-up reveal via Alpine `x-intersect.once`.                                                                                                             |
| `SiteHeader` | Sticky blurred bar with the site name, inline nav from `md`, a mobile menu (`x-show` with `x-cloak`) and an `actions` slot. The active link gets `aria-current="page"`.                                            |
| `SiteFooter` | Navigate and Connect columns plus a copyright line; props `name`, `items`, `socials`.                                                                                                                              |

Icons come from `astro-icon` with the Phosphor set (`<Icon name="ph:..." />`).

## `ui/page/*`

The earlier slot-based layout primitives (`Page`, `PageContainer`, `PageHeader`, `PageTitle`, `PageDescription`, `PageContent`, `PageFooter`). No page uses them since the site shell moved to `app/layouts/Site.astro`; they are kept because they were not part of this change. Per-component docs and examples are in [`docs/components/`](../components/README.md).

## `lib/`

- `date.ts`: `formatMonthYear(date)` and `formatDateRange(start, end?)`, formatted with `Intl.DateTimeFormat` in UTC (`"Jan 2024 - Present"`).
- `motion.ts`: wraps anime.js's `createScope` so every animation checks `prefers-reduced-motion` consistently. See [`docs/animations.md`](../animations.md).

## `config/site.ts`

Holds the site name and the primary navigation (`navItems`: Home, Works, Projects, Uses, Books, Movies), plus the `TypeNavItem` and `TypeSocialLink` types. Add a route to `navItems` to put it in both the header and the footer.

## Conventions

- Nothing in `shared` may import from `app`, `pages`, `features`, or `entities`.
- Components here stay generic. Anything that knows about a profile, work or book belongs in `entities` or `features`.
