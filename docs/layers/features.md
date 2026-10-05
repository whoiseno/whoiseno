# `src/features`

User-facing slices, one per section of the portfolio. The `@/features/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

Slices follow [Feature-Sliced Design](https://feature-sliced.design/) v2.1: each slice is split into segments by purpose (`ui`, `model`, `config`) and exposes a public API that the rest of the app imports from. Nothing outside a slice imports from inside its segments.

```
src/features/
├── works/
│   ├── index.ts                # public API: WorkList
│   └── ui/WorkList.astro       # work experience accordion; props: limit?
├── projects/
│   ├── index.ts                # public API: ProjectList
│   └── ui/ProjectList.astro    # project cards linking to /projects/[slug]; props: featured=false, limit?
├── uses/
│   ├── index.ts                # public API: SoftwareList, HardwareList
│   └── ui/
│       ├── UsesItem.astro      # logo, name, description and usage; shared by both lists
│       ├── SoftwareList.astro  # daily apps and tools
│       └── HardwareList.astro  # daily gadgets, each with a photo strip
├── books/
│   ├── index.ts                # public API: BookList
│   └── ui/BookList.astro       # a Reading section, then a Library grid
├── movies/
│   ├── index.ts                # public API: MovieList
│   └── ui/MovieList.astro      # a Watching section, then a Library grid
├── writing/
│   ├── index.ts                # public API: .astro components and writingKindLabels
│   ├── client.ts               # browser entry: registerWriting
│   ├── config/kinds.ts         # writingKindLabels: blog, tutorial, journal, note
│   ├── model/
│   │   ├── register.ts         # registerWriting(): calls the three registrations below
│   │   ├── reader.ts           # Alpine.data("writingReader"): wide mode, focus mode, active heading
│   │   ├── carousel.ts         # Alpine.data("carousel"): previous and next buttons
│   │   └── filter.ts           # Alpine.store("writingFilter"): the selected kind
│   └── ui/
│       ├── WritingList.astro   # entries grouped by year; props: tag? (a tag slug)
│       ├── WritingFilters.astro # tag links and the kind dropdown; props: active tag?
│       ├── WritingTags.astro   # tag links; used only by WritingFilters (not in the public API)
│       ├── WritingToc.astro    # table of contents beside the post; props: headings
│       ├── WritingToolbar.astro # wide-width and focus-mode buttons
│       ├── WritingPager.astro  # previous and next post cards; props: previous?, next?
│       ├── WritingBackLink.astro # "All writing" link; props: class?
│       ├── Equation.astro      # KaTeX output for the Markdoc math tags
│       ├── Figure.astro        # Markdoc image node: figure with optional caption
│       ├── Table.astro         # Markdoc table node: bordered, horizontally scrollable wrapper
│       └── Carousel, Slide, Columns, Column .astro   # Markdoc tag renderers
└── theme-toggle/
    ├── index.ts                # public API: ThemeToggle
    ├── client.ts               # browser entry: registerThemeToggle
    ├── model/theme-toggle.ts   # Alpine.data("themeToggle")
    └── ui/ThemeToggle.astro    # light/dark switch button
```

## Two entry points per slice

`index.ts` exports the `.astro` components. `client.ts` exports the Alpine registration and nothing else. They are separate because `app/entrypoints/alpine.ts` runs in the browser and must not pull `.astro` files into the client bundle. Pages import `@/features/writing`; the Alpine entrypoint imports `@/features/writing/client`.

[`markdoc.config.mjs`](../../markdoc.config.mjs) points its tags at `src/features/writing/index.ts` with `component(path, exportName)`, so the Markdoc renderers must stay exported from there.

## Behavior

Each list reads its own content collection with `getCollection` and sorts it. Every list shows "Nothing here yet." when its collection is empty. Collection shapes are in [`content.md`](../content.md).

- `WorkList` sorts by `startDate` descending and renders an `Accordion` with one row per work. A row shows the company, a "Working" badge for current roles, the role, the date range, and the location with the work mode. Opening a row reveals the technology logos, the Markdoc body and a link to the company site. With `limit`, only the latest works render, followed by a "Show all work experiences" button linking to `/works`; the button is hidden when nothing was cut off. The chevron is hidden until hover or focus on devices with a fine pointer (`pointer-fine:`), and always visible on touch.
- `WritingList` sorts by `publishedDate` descending and groups entries by the UTC year. Each row is one line: the title (truncated with an ellipsis), an outline badge with the entry kind, and the date. With `tag`, it keeps only entries carrying that tag. While a row is hovered, the other rows fade and blur slightly (`group-has-[a:hover]/writing:not-hover:`), only on devices that can hover. Rows read the `writingFilter` store and set `hidden` when their kind is filtered out; a year with no visible rows hides itself, and a "Nothing of this kind yet." line shows when the selected kind has no entries in the list.
- `WritingFilters` sits in `Site`'s `header` slot. It puts the tag links (`WritingTags`, one link per tag from `getWritingTags()` with the post count, the `active` one highlighted) and a `DropdownMenu` of kinds on the same row. Choosing a kind calls `$store.writingFilter.set(kind)`. The selection is not persisted, so it resets on navigation.
- `WritingToc` is a sticky column to the left of the post from `lg` upward, positioned `absolute` against the post wrapper at `right-[calc(100%+var(--breakout))]`, so it clears the extended code blocks and images, and its width shrinks to the space left in the viewport. It starts with the "All writing" link (`WritingBackLink`), then lists the `h2` and `h3` headings and highlights the one `reader.ts` marks active. It is not rendered below `lg`; there is no mobile table of contents, so the post page repeats the back link under the post with `lg:hidden`.
- `WritingPager` renders a Previous and a Next card below the post, under the mobile-only "All writing" link. "Previous" is the entry published just before the current one and "Next" the one published just after it; the order is computed in `pages/writing/[slug].astro`'s `getStaticPaths`.
- `Figure` and `Table` render the Markdoc `image` and `table` nodes (wired in `markdoc.config.mjs`). `Figure` takes the Markdoc image `title` as its visible caption and uses `Image` from `astro:assets` for processed images. A custom `paragraph` node in the config unwraps a paragraph that holds only an image, because a `<figure>` cannot sit inside a `<p>`; an image mixed into a sentence still renders inside its paragraph.
- `Carousel` is a `<figure>` the width of the text column, and an `@container`, so `cqw` inside it is the column's width. Its track is full-bleed: `w-screen`, pulled left by `calc(50vw - 50cqw)` and padded (`padding-inline` and `scroll-padding-left`) by the same amount, so it spans the entire screen while the first slide starts at the column's left edge. Slides are 4/5 of the column width and snap to that edge, so moving forward slides the previous card out past it. The previous and next buttons sit below the track at the column start, with the optional `caption` (a `figcaption`) beside them. `carousel.ts` has `update()`, which refreshes `canPrev` and `canNext` on init, on scroll and on window resize, plus `go()`, which measures slide offsets against the root's left edge and calls `scrollBy`. `w-screen` includes the scrollbar gutter, so `Root.astro` keeps `overflow-x-clip` on `body`. `Slide` takes an optional `ratio` (an `aspectRatioCatalog` key, default `original`): it sets `--ratio` on the slide and crops its images to that shape with `object-cover`. With `original` it adds neither, so the image keeps the shape given by its own width and height.
- `Equation` renders LaTeX with `katex.renderToString` at build time (`throwOnError: false`, so a bad expression shows as red source text instead of breaking the build; `trust` stays off). It imports `katex/dist/katex.min.css`. The `set:html` directive is allowed there with an inline `eslint-disable`, because the HTML is KaTeX's own output.
- `BookList` and `MovieList` render `MediaItem` (from `shared/ui/media-item`) once per entry. Each entry's `posterRatio` (default `2/3`) is passed to `MediaItem`. Entries with status `reading` (books) or `watching` (movies) go in the top section in a `row` layout (poster beside the text); everything else goes in "Library" as a two-column grid (three from `sm`) of stacked cards. Sort order is status, then most recently finished or watched, then title. Each entry's `links` are turned into attribution links by `resolveMediaLink` from [`shared/config/media-sources.ts`](../../src/shared/config/media-sources.ts). Movies show a badge for their kind (Movie, Series, Show, Anime).
- Software and hardware items use `UsesItem`: a logo (or the first letter of the name), the name, the `description` and the `usage` text, and an arrow when there is a `link`. `HardwareList` adds a horizontally scrolling, snap-aligned strip of the item's photos above the item. The strip is `h-40` and each photo's `ratio` (default `1/1`) sets its width; the image is requested at the matching pixel size, so the processed crop and the displayed box agree.
- `ProjectList` with `featured` filters to `featured: true` entries (used on the home page).
- Software and hardware are two separate collections shown together on `/uses`.

## `theme-toggle`

A ghost `Button` bound to the Alpine `themeToggle` component from `model/theme-toggle.ts`. `toggle()` flips the `dark` class on `<html>` and stores `localStorage.theme` (the write is wrapped in `try/catch`). The flip runs inside `document.startViewTransition`, which produces the top-to-bottom wipe defined in `global.css` (see [`styling.md`](../styling.md)). The toggle sets `data-theme-transition` on `<html>` while the transition runs, and only then do the wipe keyframes apply, so page navigations keep the plain fade; without `startViewTransition`, or with reduced motion, it flips instantly. The first-paint theme is applied by the inline script in `Root.astro`, not by this component, so there is no flash. Sun and moon icons swap with `dark:` classes.

## Conventions

- Each feature gets its own subfolder with an `index.ts` public API. A feature may import from `entities` and `shared`, but never from `pages` or `app`, and never from another feature (compose features in `pages` or `app`).
- Interactivity belongs in the feature. Inline `x-data` is fine for trivial state. A feature that needs a reusable `Alpine.data` or `Alpine.store` puts it in `model/`, registers it from `client.ts`, and `app/entrypoints/alpine.ts` only calls that register function.
- In `Alpine.store` and `Alpine.data` methods, mutate through `this` (typed with a `this:` parameter), not through the object literal: Alpine wraps the object in a reactive proxy, and writes to the raw object do not trigger updates.
- A page that only one feature serves (`/hobbies/books`, `/works`) still lives in `pages`, because Astro routes come from the file system. FSD's Pages-First guidance would keep such code inside the page; this project keeps the list in a feature so the home page can reuse it (`WorkList`, `ProjectList`).

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
