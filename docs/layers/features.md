# `src/features`

User-facing slices, one per section of the portfolio. The `@/features/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

Slices follow [Feature-Sliced Design](https://feature-sliced.design/) v2.1: each slice is split into segments by purpose (`ui`, `model`, `config`) and exposes a public API that the rest of the app imports from. Nothing outside a slice imports from inside its segments.

```
src/features/
├── works/
│   ├── index.ts                # public API: WorkList
│   └── ui/
│       ├── WorkList.astro      # work experience accordion; props: limit?
│       ├── WorkItem.astro      # one work: an AccordionItem around WorkSummary and WorkDetails; props: work
│       ├── WorkSummary.astro   # the AccordionTrigger: company, role, dates and location
│       ├── WorkDetails.astro   # the AccordionContent: technologies, Markdoc body and company link
│       └── WorkTechnologies.astro # the technology logo tiles; props: names
├── projects/
│   ├── index.ts                # public API: ProjectList
│   └── ui/
│       ├── ProjectList.astro   # grid of project cards linking to /projects/[slug]; props: featured=false, limit?
│       └── ProjectCard.astro   # one card: logo tile, title, description; props: project
├── uses/
│   ├── index.ts                # public API: SoftwareList, HardwareList
│   └── ui/
│       ├── UsesItem.astro      # logo, name, description and usage; shared by both lists
│       ├── SoftwareList.astro  # daily apps and tools
│       ├── HardwareList.astro  # daily gadgets, each with a photo strip
│       └── HardwarePhotos.astro # the scrolling photo strip of one gadget; props: name, photos
├── books/
│   ├── index.ts                # public API: BookList, getBooks, TypeBookPage
│   ├── api/books.ts            # getBooks(page): reads the Hardcover library, cached
│   └── ui/
│       ├── BookList.astro      # a Reading section, then a Library grid with pagination; props: data
│       └── BookItem.astro      # one book, composed from the MediaItem parts; props: book, layout?
├── movies/
│   ├── index.ts                # public API: MovieList
│   └── ui/
│       ├── MovieList.astro     # a Watching section, then a Library grid
│       └── MovieItem.astro     # one entry, composed from the MediaItem parts; props: data, poster?, layout?
├── writing/
│   ├── index.ts                # public API: .astro components and writingKindLabels
│   ├── client.ts               # browser entry: registerWriting
│   ├── config/
│   │   ├── kinds.ts            # writingKindLabels: blog, tutorial, journal, note
│   │   ├── callouts.ts         # calloutTypes and calloutMeta (label and icon for each type); also read by keystatic.config.ts
│   │   ├── footnotes.mjs       # numberFootnotes(document): numbers footnotes by reference and fails the build on a broken pair
│   │   └── code-wrap-toggle.mjs # Expressive Code plugin: the line-wrap button on every code block
│   ├── model/
│   │   ├── register.ts         # registerWriting(): calls the four registrations below
│   │   ├── reader.ts           # Alpine.store("writingReader"): wide mode, focus mode
│   │   ├── toc.ts              # Alpine.data("writingToc"): the heading in view
│   │   ├── filter.ts           # Alpine.store("writingFilter"): the selected kind
│   │   ├── sidenotes.ts        # Alpine.data("sidenotes"): the margin rail that places footnotes beside their numbers
│   │   └── reading-time.ts     # getReadingMinutes(body): whole minutes, shown in WritingList
│   └── ui/
│       ├── WritingList.astro   # entries grouped by year; props: tag? (a tag slug)
│       ├── WritingListGroup.astro # one year: its heading and rows; props: label
│       ├── WritingListItem.astro # one row: title, kind badge, reading time and (with showDate) the date; props: entry, showDate?
│       ├── WritingLatest.astro # the newest entries as a flat list: title, kind badge and reading time; props: limit?
│       ├── WritingFilters.astro # tag links and the kind dropdown; props: active tag?
│       ├── WritingTags.astro   # tag links; used only by WritingFilters (not in the public API)
│       ├── toc/                # compound: Toc, TocTicks, TocTick, TocContent, TocItem
│       ├── WritingToc.astro    # tick-mark table of contents in the sidebar, assembled from toc/; props: headings
│       ├── WritingToolbar.astro # wide-width and focus-mode buttons; props: size?, class?
│       ├── WritingWideToggle.astro # the wide-width button in its Tooltip; props: size?
│       ├── WritingFocusToggle.astro # the focus-mode button in its Tooltip; props: size?
│       ├── WritingPager.astro  # previous and next cards; props: previous?, next? ({ href, title }), label?
│       ├── WritingPagerLink.astro # one card; props: direction, href, title
│       ├── WritingBackLink.astro # "All writing" link; props: class?, href?, label?
│       ├── WritingSidenotes.astro # the margin rail layer, in Site's `sidenotes` slot
│       ├── WritingReader.astro # wrapper of a post's body: the Escape handler and the exit button for focus mode
│       ├── Footnote.astro      # Markdoc footnote tag: a note and its marker; props: id, number
│       ├── FootnoteRef.astro   # Markdoc footnoteRef tag: the number in the text; props: id, number
│       ├── VideoClip.astro     # Markdoc video tag; props: file?, url?, caption?
│       ├── AudioClip.astro     # Markdoc audio tag; props: file?, url?, caption?
│       ├── Handwriting.astro   # Markdoc handwriting tag: text in a handwriting font
│       ├── CodeBlock.astro     # Markdoc fence node: Expressive Code block
│       ├── Equation.astro      # KaTeX output for the Markdoc math tags
│       ├── Figure.astro        # Markdoc image node: figure with caption and lightbox; props: priority?
│       ├── Table.astro         # Markdoc table node: bordered, horizontally scrollable wrapper
│       ├── Callout.astro       # Markdoc callout tag; props: type?, title?, collapsible?, open?
│       ├── callout-variants.ts # tv() colors for each callout type
│       └── Carousel, Slide, Columns, Column .astro   # Markdoc tag renderers (Carousel and Slide assemble shared/ui/carousel)
├── scroll-to-top/
│   ├── index.ts                # public API: ScrollToTop
│   ├── client.ts               # browser entry: registerScrollToTop
│   ├── model/scroll-to-top.ts  # Alpine.data("scrollToTop")
│   └── ui/ScrollToTop.astro    # scroll-to-top button
├── sound-toggle/
│   ├── index.ts                # public API: SoundToggle
│   ├── client.ts               # browser entry: registerSoundToggle
│   ├── model/sound-toggle.ts   # Alpine.data("soundToggle")
│   └── ui/SoundToggle.astro    # sound on/off button
└── theme-toggle/
    ├── index.ts                # public API: ThemeToggle
    ├── client.ts               # browser entry: registerThemeToggle
    ├── model/theme-toggle.ts   # Alpine.data("themeToggle")
    └── ui/ThemeToggle.astro    # light/dark switch button
```

## Two entry points per slice

`index.ts` exports the `.astro` components. `client.ts` exports the Alpine registration and nothing else. They are separate because `app/config/alpine.ts` runs in the browser and must not pull `.astro` files into the client bundle. Pages import `@/features/writing`; the Alpine entrypoint imports `@/features/writing/client`.

[`markdoc.config.mjs`](../../markdoc.config.mjs) points its tags at `src/features/writing/index.ts` with `component(path, exportName)`, so the Markdoc renderers must stay exported from there.

## Behavior

Each list except `BookList` reads its own content collection with `getCollection` and sorts it. Every list shows "Nothing here yet." when it has nothing to show. Collection shapes are in [`content.md`](../content.md).

- `WorkList` sorts by `startDate` descending and renders an `Accordion` with one `WorkItem` per work: `WorkSummary` is its trigger, `WorkDetails` its content and `WorkTechnologies` the logo tiles inside it. A row shows the company, a "Working" badge for current roles, the role, the date range, and the location with the work mode. The dates and the location are always in the long form, and wrap under the role when the row is too narrow. The current role (the first work with no `endDate` in the list being shown) is open on load; the others start closed, and since the accordion is `single`, opening another closes it. Opening a row reveals the technology logos, the Markdoc body and a link to the company site. With `limit`, only the latest works render, followed by a "Show all work experiences" button linking to `/works`; the button is hidden when nothing was cut off. The chevron is hidden until hover or focus on devices with a fine pointer (`pointer-fine:`), and always visible on touch.
- `WritingList` sorts by `publishedDate` descending and groups entries by the UTC year. Each year is a `WritingListGroup` and each row a `WritingListItem` (with `showDate`). A row is one line when there is room, and the badge, reading time and date drop to a second line under the title when there is not: the title (truncated with an ellipsis), an outline badge with the entry kind, the reading time (`getReadingMinutes`, "3 min read") and the date. The reading time is calculated from the raw Markdoc body with the `reading-time` package; `{% … %}` tags and image syntax are stripped first, and it is never less than 1 minute. With `tag`, it keeps only entries carrying that tag. While a row is hovered, the other rows fade and blur slightly (`group-has-[a:hover]/writing:not-hover:`), only on devices that can hover. Rows read the `writingFilter` store and set `hidden` when their kind is filtered out; a year with no visible rows hides itself, and a "Nothing of this kind yet." line shows when the selected kind has no entries in the list.
- `WritingLatest` is the home page's list: the newest entries across every kind, newest first and capped by `limit`, in one flat list with no year headings. Each row is a link with the title (truncated with an ellipsis), then an outline `Badge` with the entry kind and the reading time (`getReadingMinutes`) side by side; the two drop under the title together when there is not room. Its rows are the same `WritingListItem` as `WritingList`'s, so they have the same spacing, rule between them and hover fade, but without `showDate` and without the kind filter wiring, so the `writingFilter` store cannot hide its rows. It shows "Nothing here yet." when there are no entries.
- `WritingFilters` sits in `Site`'s `header` slot. It puts the tag links (`WritingTags`, one link per tag from `getWritingTags()` with the post count, the `active` one highlighted) and a `DropdownMenu` of kinds on the same row. Choosing a kind calls `$store.writingFilter.set(kind)`. The selection is not persisted, so it resets on navigation.
- `WritingToc` renders into `Site`'s `toc` slot, the middle of the sidebar rail. It assembles the `toc/` parts: `Toc` is the `nav` that owns the `writingToc` state, `TocTicks` holds a `TocTick` per heading and `TocContent` holds a `TocItem` link per heading. It shows one short tick per `h1` to `h3` heading (longer for higher levels), so the number of ticks follows the post's headings, and the tick of the heading in view is highlighted. Hovering or focusing the ticks opens a popover with the heading titles as links, indented by level. The active heading comes from `toc.ts`, which marks the last heading whose top has crossed 100px from the viewport top (and the last one at the bottom of the page). The ticks are `aria-hidden`; the links in the popover are the accessible list. The sidebar hides the slot below `rail`, so there is no table of contents on phones or tablets; the post page shows the "All writing" back link under the post with `rail:hidden` instead.
- `WritingToolbar` holds the wide-width button (`WritingWideToggle`, shown from `rail` only) and the focus-mode button (`WritingFocusToggle`). Both read and write the `writingReader` store, so the toolbar works anywhere on the page. Each button sits in a `Tooltip` (the wide-width one carries `hidden rail:inline-flex` on the `Tooltip` root, so no empty cell is left behind below `rail`). The post page renders the toolbar twice: in `Site`'s `tools` slot in the sidebar from `rail` (`size="md"`, hidden below `rail`), and in the row with the kind badge and date below `rail` (`size="sm"`, hidden from `rail`). In the sidebar it is given `class="contents max-rail:hidden"`: `contents` makes the toolbar's own wrapper disappear from layout, so its two buttons are cells of the actions grid like every other action.
- `WritingPager` renders a Previous and a Next card (`WritingPagerLink`, with a `direction`) below the post, under the mobile-only "All writing" link. "Previous" is the entry published just before the current one and "Next" the one published just after it; the order is computed in `pages/writing/[slug].astro`'s `getStaticPaths`. Each entry is `{ href, title }` and `label` names the navigation for screen readers, so `pages/projects/[slug].astro` uses it too, ordered by `startDate`; `WritingBackLink` takes `href` and `label` for the same reason.
- `WritingReader` wraps the body of a post. It holds the bare `x-data` that lets the Escape handler and the floating "Exit focus mode" button read the `writingReader` store, and renders its children after the button. `pages/writing/[slug].astro` and `pages/projects/[slug].astro` both use it, together with `WritingToc`, `WritingSidenotes`, `WritingToolbar`, `WritingBackLink` and `WritingPager`. The project page composes these in `pages`, as the conventions below ask, so there is no import between features.
- `Callout` renders the Markdoc `callout` tag (authoring is in [`content.md`](../content.md)). A plain callout is a `<div role="note">`: the icon, an optional title and the children, with a visually hidden type name when there is no title. A `collapsible` one is a `<details>` whose `<summary>` holds the icon, the title (or the type name) and a chevron that turns when it opens, so folding works without scripts and nests naturally. The children are a slot, so a callout inside a callout needs nothing more, and each level indents by the icon. `markdoc.config.mjs` validates `type` with `matches`, so an unknown type stops the build; keep its list in step with `calloutTypes`. The colors are in [`styling.md`](../styling.md).
- `CodeBlock` renders the Markdoc `fence` node with Expressive Code's `Code` component (setup in [`ec.config.mjs`](../../ec.config.mjs)). The fence's `{% … %}` annotation supplies `mark` (highlighted lines, e.g. `"2-3"`), `ins`, `del` and `wrap` (start wrapped); `CodeBlock` turns `mark`, `ins` and `del` into Expressive Code's meta string. There is no `title` option. `diff` fences colour `+` and `-` lines, shell languages get a terminal frame, and every block has a copy button and a wrap toggle from `config/code-wrap-toggle.mjs`. The toggle is one delegated click listener for the whole page, not one per block. The plugin renders every block wrapped so the core writes the hanging-indent variables, then removes the `wrap` class again for blocks that start unwrapped.
- `Figure` and `Table` render the Markdoc `image` and `table` nodes (wired in `markdoc.config.mjs`). `Figure` takes the Markdoc image `title` as its visible caption, uses `Image` from `astro:assets` for processed images, and wraps the image in a [`Lightbox`](./shared.md): a click, Enter or Space opens the full-size image (capped at 2000px) in a dialog. Images are `loading="lazy"`; `priority` makes one eager with `fetchpriority="high"`, which the post page sets for the cover. A custom `paragraph` node in the config unwraps a paragraph that holds only an image, because a `<figure>` cannot sit inside a `<p>`; an image mixed into a sentence still renders inside its paragraph.
- `Carousel` is a `<figure>` the width of the text column, and an `@container`. A row above the track holds the optional `caption` (a `figcaption`) at the start and the previous and next buttons at the end, both aligned to the text column. The track is the full width of the page: it is `--page-width` wide (`w-(--page-width)`), pulled left and padded (`padding-inline` and `scroll-padding-left`) by `(--page-width - 100cqw) / 2`, so it reaches both screen edges while the first slide starts at the text column's left edge. `--page-width` is `100cqw` captured on `Site`'s body row (`[--page-width:100cqw]`), whose nearest container is `<body>`. The property has to be registered (`@property` in `global.css`, inherited, `<length>`) so the captured value resolves to a length there rather than staying a `100cqw` that re-resolves against the nearer container. The text column is centred in the body (the side tracks of the grid are equal), so the offset is the same on both sides. Scroll-padding is not used with a percentage because it resolves against the scrollport, not the column. Slides are 4/5 of the column width and snap to the text column's left edge, so moving forward slides the previous card out past it. The figure is `relative z-10`, so where the track meets the sidebar it passes over it and covers the table of contents ticks. That needs the sidebar header to drop its `z-40` from `rail` (`rail:z-auto`): a grid item's `z-index` applies even without `position`, which would otherwise lift the whole sidebar above the carousel. While the table of contents is hovered or focused, the header gets `z-50` instead (see the sidebar notes in [`styling.md`](../styling.md)), so its popover opens above the carousel and the code blocks. Below `rail` the sticky top bar keeps `z-40` and stays above the carousel. The renderer assembles the shared carousel parts (see [`shared.md`](./shared.md#uicarousel)): `Carousel` for the figure, `CarouselPrevious` and `CarouselNext` in the header row, and `CarouselContent` for the track, to which it passes the full-width classes. The state is `Alpine.data("carousel")` in `shared/ui/carousel/alpine.ts`: `update()` refreshes `canPrev` and `canNext` on init, on scroll and on window resize, and `go()` measures slide offsets against the root's left edge and calls `scrollBy`. `Slide` takes an optional `ratio` (an `aspectRatioCatalog` key, default `original`): it sets `--ratio` on the slide and crops its images to that shape with `object-cover`. With `original` it adds neither, so the image keeps the shape given by its own width and height.
- `Footnote` and `FootnoteRef` render the `footnote` and `footnoteRef` Markdoc tags (authoring is in [`content.md`](../content.md#footnotes)). They are plain markup with `id`s, `data-footnote` and `data-footnote-ref`, and a number that `markdoc.config.mjs` supplies: its `document` node calls `numberFootnotes` (`config/footnotes.mjs`), which counts references in order, stores the result in `config.ctx.footnotes` for the two tags to read, and throws on an unmatched, repeated or malformed id, so a mistake stops the build with the id named. `VideoClip`, `AudioClip` and `Handwriting` render the `video`, `audio` and `handwriting` tags; `VideoClip` and `AudioClip` take `file` or else `url` and throw if given neither.
- `WritingSidenotes` is the empty, `rail`-only layer that `sidenotes.ts` fills. From `rail` the script moves each footnote itself into the layer (leaving a comment where it was, so the note goes back when the window narrows), rather than copying it: there is one video, one audio element and one lightbox per note, and a screen reader still finds the real note, which keeps its `id` for the number's `aria-describedby`. It places the notes by measuring each number: a note's top is its number's top minus the note's padding; a note closer than one line to the previous one is pushed down; a note that would run into the next one is clipped (`clipped`, `--clip`) rather than moved; a pinned note (`expanded`) pushes the ones below it down by the room it needs. It listens, on `document`, for `pointerover` and `focusin` (`lit` on the note and its number), `click` (a number or the note toggles `expanded`; clicks on links, buttons, media and an open dialog do their own job) and `Escape`. Three observers re-run the layout when the layer, the text column or a note changes size, because wide mode, a loading image or a font swap all move the numbers. It also grows the page when notes run past the end (`--sidenotes-overflow`). How it is styled is in [`styling.md`](../styling.md#writing-entry-styles).
- `Equation` renders LaTeX with `katex.renderToString` at build time (`throwOnError: false`, so a bad expression shows as red source text instead of breaking the build; `trust` stays off). It imports `katex/dist/katex.min.css`. The `set:html` directive is allowed there with an inline `eslint-disable`, because the HTML is KaTeX's own output.
- `MovieList` renders a `MovieItem` once per entry, which composes the `MediaItem` parts from `shared/ui/media-item`. Each entry's poster is its uploaded `poster`, or else the poster `resolvePoster` (from `shared/api/posters`) finds through its `links`, and its `posterRatio` (default `2/3`) is passed to `MediaItemPoster` with it. Entries with status `watching` go in the top section in a `row` layout (poster beside the text); everything else goes in "Library" as a two-column grid (three from `sm`) of stacked cards. Sort order is status, then most recently finished or watched, then title. Each entry's `links` are turned into attribution links by `resolveMediaLink` from [`shared/config/media-sources.ts`](../../src/shared/config/media-sources.ts). Movies show a badge for their kind (Movie, Series, Show, Anime).
- `BookList` takes the `data` prop that `getBooks(page)` returns (`{ page, pageCount, reading, library }`) and renders a `BookItem` (the `MediaItem` parts again) in the same layouts as `MovieList`: a "Reading" section in `row` layout (shown on page 1 only), then a "Library" grid followed by `Pagination` (from `shared/ui/pagination`). The grid is a `grid-fluid` with columns of at least 9.5rem: two on a phone, three in the text column and five beside the rail. Beside the rail (`rail:`) it and the pagination are `calc(100% + 14rem)` wide, which spills into the empty right-hand column of `Site`'s body grid, so the library breaks out of the text column to the right without overflowing the viewport. Each book's cover links to its Hardcover page (a new tab, via `MediaItemPoster`'s `href`), and the book shows the rating, and shows the start of its review as the description. Covers are Hardcover's own `assets.hardcover.app` images, served through `astro:assets`, which needs that host in `image.domains`. The `pages/hobbies/books.astro` route renders on demand and owns the `?page=` parsing, the redirect for a page past the end and the `Cache-Control` header; see [`books-and-movies.md`](../books-and-movies.md#books) for the caching and quota behavior.
- `getBooks(page)` asks Hardcover for your user ID (cached forever), the number of books (to get the page count), the books you are reading (page 1 only) and one 12-book page of the library. Only public books with the status _Want to read_, _Currently reading_ or _Read_ are returned, and a review marked as having spoilers is dropped. The author is the book's contributors credited as "Author" (all contributors when none is). Each of those queries goes through `cached` from [`shared/api/hardcover`](./shared.md#apihardcover) with a five minute TTL. A page past the end returns empty lists after only the count query, so a bad `?page=` costs almost nothing.
- Software and hardware items use `UsesItem`: a logo (or the first letter of the name), the name, the `description` and the `usage` text, and an arrow when there is a `link`. `HardwareList` adds a horizontally scrolling, snap-aligned strip of the item's photos (`HardwarePhotos`) above the item. The strip is `h-40` and each photo's `ratio` (default `1/1`) sets its width; the image is requested at the matching pixel size, so the processed crop and the displayed box agree. The strip extends into the page gutter on both sides (`-mx-s-l px-s-l`), so on a phone the photos scroll off the edge of the screen.
- `ProjectList` renders a `grid-fluid` of `ProjectCard`s (columns of at least 16rem: two in the text column, one on a phone): a 16/9 tile with the project's `logo` (the first letter of the title without one), then the title and a two-line description. A card links to `/projects/[slug]`. With `featured` it filters to `featured: true` entries (used on the home page); `limit` caps the count.
- Software and hardware are two separate collections shown together on `/uses`.

## `scroll-to-top`

A ghost icon `Button` in a `Tooltip`, bound to the Alpine `scrollToTop` component from `model/scroll-to-top.ts`. `scrolled` turns true once `window.scrollY` passes 200px (checked on init and on window scroll), and the button is `disabled` (dimmed) until then. `top()` calls `window.scrollTo({ top: 0 })`, which animates because `<html>` has `scroll-smooth`. `Site` places it in the sidebar's actions from `rail` only, on every page, with `class="max-rail:hidden"`. The component takes `class` and passes it to the `Tooltip`, because the `Tooltip` root is the grid cell, and a class on the button alone would leave an empty cell below `rail`.

## `sound-toggle`

A ghost icon `Button` in a `Tooltip`, bound to the Alpine `soundToggle` component from `model/sound-toggle.ts`, the last cell of the sidebar actions grid. `on` starts from `isSoundOn()` (the saved choice in `localStorage.sound`) in `init()`, and `toggle()` flips it and calls `setSoundOn()`, both from [`shared/lib/sound.ts`](./shared.md#sound), which also saves the choice (the write is wrapped in `try/catch`). The button is a toggle: `aria-label="Toggle sound"` with `aria-pressed` following `on`, and the speaker icon swaps for a slashed one (both icons are `x-cloak`, so neither flashes before Alpine starts). Muting plays the usual click cue, because the click lands before sound is switched off; switching sound back on plays a short `toggle` cue so the visitor hears that it worked, since the click that did it was silent. The choice is per browser and applies to every page.

## `theme-toggle`

A ghost `Button` in a `Tooltip`, bound to the Alpine `themeToggle` component from `model/theme-toggle.ts`. `toggle()` flips the `dark` class on `<html>` and stores `localStorage.theme` (the write is wrapped in `try/catch`). The flip runs inside `document.startViewTransition`, which produces the top-to-bottom wipe defined in `global.css` (see [`styling.md`](../styling.md)). The toggle sets `data-theme-transition` on `<html>` while the transition runs, and only then do the wipe keyframes apply, so page navigations keep the plain fade; without `startViewTransition`, or with reduced motion, it flips instantly. The first-paint theme is applied by the inline script in `Root.astro`, not by this component, so there is no flash. Sun and moon icons swap with `dark:` classes.

## Conventions

- Each feature gets its own subfolder with an `index.ts` public API. A feature may import from `entities` and `shared`, but never from `pages` or `app`, and never from another feature (compose features in `pages` or `app`).
- Interactivity belongs in the feature. Inline `x-data` is fine for trivial state. A feature that needs a reusable `Alpine.data` or `Alpine.store` puts it in `model/`, registers it from `client.ts`, and `app/config/alpine.ts` only calls that register function.
- In `Alpine.store` and `Alpine.data` methods, mutate through `this` (typed with a `this:` parameter), not through the object literal: Alpine wraps the object in a reactive proxy, and writes to the raw object do not trigger updates.
- A page that only one feature serves (`/hobbies/books`, `/works`) still lives in `pages`, because Astro routes come from the file system. FSD's Pages-First guidance would keep such code inside the page; this project keeps the list in a feature so the home page can reuse it (`WorkList`, `ProjectList`).
- A component that holds items (a toolbar's buttons, a list's rows, a menu's links) is built as a compound component with an item part, following [`shared.md`](./shared.md#building-a-compound-component). Where a Markdoc tag or a page needs the whole component at once, keep one composed component that assembles the parts (`WritingToc` assembles `toc/`, `Carousel` assembles `shared/ui/carousel`).

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
