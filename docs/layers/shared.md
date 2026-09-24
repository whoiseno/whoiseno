# `src/shared`

The bottom layer: reusable, domain-agnostic building blocks with no dependency on any other layer.

```
src/shared/
├── config/            # currently empty — see note below
└── ui/
    ├── layouts/
    │   └── Root.astro          # HTML document shell
    └── page/
        ├── Page.astro
        ├── PageContainer.astro
        ├── PageContent.astro
        ├── PageDescription.astro
        ├── PageFooter.astro
        ├── PageHeader.astro
        └── PageTitle.astro
```

## `ui/layouts/Root.astro`

The outermost wrapper for every page: renders `<html>`/`<head>`/`<body>`, sets favicons, viewport meta, the Astro generator meta tag, and the page `<title>` ("EnoEno Computer"). Registers the three site fonts via Astro's `<Font />` component (must match the `cssVariable` names declared in [`astro.config.mjs`](../../astro.config.mjs)) and imports the global stylesheet (`app/styles/global.css`). The `<body>` carries the base Tailwind classes (flex column layout, `font-sans`, background/text colors) shared by every page.

## `ui/page/*`

A set of slot-based layout primitives, each a thin `<div>`/`<main>` wrapper with a `data-slot="..."` attribute (used for CSS targeting, e.g. `Page.astro`'s `has-data-[slot='page-footer']` selectors) and Tailwind utility classes:

| Component               | Renders                              | Notes                                                                                                        |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `Page.astro`            | `<main data-slot="page">`            | The page-level flex container; adjusts padding when a header/footer is present.                              |
| `PageContainer.astro`   | `<div data-slot="page-container">`   | Centers content, caps width at `max-w-5xl`.                                                                  |
| `PageHeader.astro`      | `<div data-slot="page-header">`      | Top section (title + description).                                                                           |
| `PageTitle.astro`       | `<h1 data-slot="page-title">`        | Large serif-font heading.                                                                                    |
| `PageDescription.astro` | `<div data-slot="page-description">` | Subheading/tagline area.                                                                                     |
| `PageContent.astro`     | `<div data-slot="page-content">`     | Generic body-content wrapper (not yet used by `index.astro`, available for pages with a body section).       |
| `PageFooter.astro`      | `<div data-slot="page-footer">`      | Bottom section (e.g. copyright); accepts an optional `class` prop for variants like a `border-t` top border. |

These compose via `<slot />` — see [`layers/pages.md`](./pages.md) for how `index.astro` assembles them.

## `config/`

Currently an empty directory. Per [`.pages.yml`](../../.pages.yml), the Pages CMS "Site settings" entry is expected to write to `src/shared/config/site.json` (title, description, url) — that file doesn't exist yet, so global site metadata isn't wired up. See [`content.md`](../content.md).

## Conventions

- Nothing in `shared` may import from `app`, `pages`, `features`, or `entities` — it's the foundation every other layer builds on.
- Components here should stay generic (layout primitives, design-system pieces) rather than encoding any domain concept (a "post" or "project" belongs in `entities`, not here).
