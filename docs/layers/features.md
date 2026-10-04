# `src/features`

User-facing slices, one per section of the portfolio. The `@/features/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

```
src/features/
├── works/
│   └── WorkList.astro          # work experience accordion; props: limit?
├── projects/
│   └── ProjectList.astro       # project cards linking to /projects/[slug]; props: featured=false, limit?
├── uses/
│   ├── UsesItem.astro          # logo, name, description and usage; shared by both lists
│   ├── software/SoftwareList.astro   # daily apps and tools
│   └── hardware/HardwareList.astro   # daily gadgets, each with a photo strip
├── books/
│   └── BookList.astro          # grouped Reading, Read, Want to read
├── movies/
│   └── MovieList.astro         # grouped Watching, Watched, Planned (movies, shows, anime)
├── writing/
│   ├── WritingList.astro       # entries grouped by year; props: tag? (a tag slug)
│   ├── WritingTags.astro       # tag links under the page title; props: active?
│   ├── WritingToc.astro        # table of contents for an entry; props: headings
│   ├── WritingToolbar.astro    # wide-width and focus-mode buttons
│   ├── alpine.ts               # registerWriting(): Alpine.data("writingReader") and ("carousel")
│   └── content/                # Markdoc tag renderers: Carousel, Slide, Columns, Column
└── theme-toggle/
    ├── ThemeToggle.astro       # light/dark switch button
    └── alpine.ts               # registerThemeToggle(): Alpine.data("themeToggle")
```

Each list reads its own content collection with `getCollection` and sorts it. Every list shows "Nothing here yet." when its collection is empty. Collection shapes are in [`content.md`](../content.md).

- `WorkList` sorts by `startDate` descending and renders an `Accordion` with one row per work. A row shows the company, a "Working" badge for current roles, the role, the date range, and the location with the work mode. Opening a row reveals the technology logos, the Markdoc body and a link to the company site. With `limit`, only the latest works render, followed by a "Show all work experiences" button linking to `/works`; the button is hidden when nothing was cut off. The chevron is hidden until hover or focus on devices with a fine pointer (`pointer-fine:`), and always visible on touch.
- `WritingList` sorts by `publishedDate` descending and groups entries by the UTC year. Each row is the title and the date; tags are not shown here. With `tag`, it keeps only entries carrying that tag. While a row is hovered, the other rows fade and blur slightly (`group-has-[a:hover]/writing:not-hover:`), only on devices that can hover.
- `WritingTags` renders every tag from `getWritingTags()` as a link to `/writing/tags/<slug>`, with the post count. The `active` tag is highlighted. Pages put it in `Site`'s `header` slot so it sits right after the title and description.
- Software and hardware items use `UsesItem`: a logo (or the first letter of the name), the name, the `description` and the `usage` text, and an arrow when there is a `link`. `HardwareList` adds a horizontally scrolling, snap-aligned strip of the item's photos above the item.
- `ProjectList` with `featured` filters to `featured: true` entries (used on the home page).
- Software and hardware are two separate collections shown together on `/uses`.

## `theme-toggle`

A ghost `Button` bound to the Alpine `themeToggle` component from `alpine.ts`. `toggle()` flips the `dark` class on `<html>` and stores `localStorage.theme` (the write is wrapped in `try/catch`). The flip runs inside `document.startViewTransition`, which produces the top-to-bottom wipe defined in `global.css` (see [`styling.md`](../styling.md)); without `startViewTransition`, or with reduced motion, it flips instantly. The first-paint theme is applied by the inline script in `Root.astro`, not by this component, so there is no flash. Sun and moon icons swap with `dark:` classes.

## Conventions

- Each feature gets its own subfolder. A feature may import from `entities` and `shared`, but never from `pages` or `app`, and never from another feature (compose features in `pages` or `app`).
- Interactivity belongs in the feature. Inline `x-data` is fine for trivial state. A feature that needs a reusable `Alpine.data` registers it from its own `alpine.ts` (as `theme-toggle` does), and `app/entrypoints/alpine.ts` only calls that register function.

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
