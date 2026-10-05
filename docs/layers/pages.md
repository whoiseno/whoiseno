# `src/pages`

Astro's file-based router: every `.astro`/`.md`/`.ts` file here becomes a route. See [Astro's routing guide](https://docs.astro.build/en/guides/routing/) for the full model.

```
src/pages/
├── index.astro             # /           profile hero, latest works, featured projects
├── works.astro             # /works      every work experience (WorkList without limit)
├── projects/
│   ├── index.astro         # /projects
│   └── [slug].astro        # /projects/<id>   getStaticPaths from the projects collection
├── writing/
│   ├── index.astro         # /writing    WritingFilters and WritingList, grouped by year
│   ├── [slug].astro        # /writing/<id>    getStaticPaths from the writing collection
│   └── tags/[tag].astro    # /writing/tags/<slug>    getStaticPaths from getWritingTags()
├── uses.astro              # /uses       Software and Hardware sections
└── hobbies/
    ├── index.astro         # /hobbies         cards linking to each hobby
    ├── books.astro         # /hobbies/books
    └── movies.astro        # /hobbies/movies
```

`/books` and `/movies` no longer exist (they moved under `/hobbies`), and there are no redirects.

All of these are prerendered. The only on-demand routes are `/keystatic` and `/api/keystatic/*`, injected by the Keystatic integration (there is no file for them here).

## Composition

Every page wraps its content in `Site` (`import { Site } from "@/app/ui"`, see [`app.md`](./app.md)), which provides the sidebar, `<main>` container and footer. `Site` takes `title` and `description`; when `title` is set it renders the page `<h1>` and the muted description, and `index.astro` omits it because `ProfileHero` provides the `<h1>`. A page can put content directly under the description with `<X slot="header" />` (the writing pages use it for `WritingFilters`, the tag links and kind dropdown), and into the sidebar with `<X slot="toc" />` (the post page puts `WritingToc` there).

Pages with a dynamic or nested route pass `crumbs` (a `TypeCrumb[]`; the last step has no `href`). `Site` shows them above the title and nests the steps after the first under the matching sidebar link. The pages that do:

- `writing/[slug].astro`: Writing, then the post title.
- `writing/tags/[tag].astro`: Writing, then the tag label.
- `projects/[slug].astro`: Projects, then the project title.
- `hobbies/books.astro` and `hobbies/movies.astro`: Hobbies, then Books or Movies.

Software and hardware are not separate routes (both are sections of `/uses`), so they have no crumbs.

Sections are built with `Section` (`shared/ui/section`), which adds the title and an optional "View all" link.

- `index.astro`: `ProfileHero`, then a Works `Section` (`WorkList limit={3}`, current role open) and a Projects `Section` (`ProjectList featured limit={4}`, a grid of cards). The Projects link is hidden from the navigation in the CMS; the "View all" link and `/projects` still exist.
- `projects/[slug].astro`: breadcrumbs, date range, Live demo and Source links, skill badges, the Markdoc body inside `Prose`, and an "All projects" back link.
- `writing/[slug].astro`: the optional cover image (after the title and description, through the `header` slot; it is also the `og:image`, and is not shown in the writing list), a badge with the entry kind (Blog, Tutorial, Journal or Note), the published date, the width and focus buttons (`WritingToolbar`), the Markdoc body inside `Prose`, the table of contents (`WritingToc`, in the sidebar from `md`), the "All writing" back link below the text on screens under `md`, and the previous and next posts (`WritingPager`) right below it. The cover is loaded eagerly with high fetch priority because it is above the fold. `getStaticPaths` sorts entries by `publishedDate` ascending and passes each page its neighbours as `previous` and `next`. `Site` supplies the title and description. A wrapper with `x-data="writingReader"` owns the wide and focus state and the active heading; see [`animations.md`](../animations.md) for focus mode and [`content.md`](../content.md) for what the body supports.
- `writing/tags/[tag].astro`: `WritingFilters` with the current tag highlighted, then `WritingList` filtered to that tag, and an "All writing" back link.
- `hobbies/index.astro`: one `Card` per hobby (Books, Movies). To add another hobby, add an entry to the `hobbies` array there and create `hobbies/<name>.astro`. The header link is the single "Hobbies" entry in the Navigation singleton (see [`content.md`](../content.md)).
- `hobbies/books.astro` and `hobbies/movies.astro`: `Site` around `BookList` and `MovieList`.

The older `Page*` primitives in `shared/ui/page` are no longer used by any page.

## Conventions

- Keep pages thin: copy and composition order only. Data access and rendering belong in `entities` and `features`.
- Pages may import from `features`, `entities` and `shared`, but nothing outside `pages` should import from `pages`. Import them through each slice's public API (`@/entities/profile`, `@/features/works`) and each shared group's `index.ts` (`@/shared/ui/icon`); single-file shared modules such as `@/shared/lib/date` are imported directly.
- The one upward import is `Site` from `@/app/ui` (see [`app.md`](./app.md#conventions)). There is no `widgets` layer to hold the shell.
- `pages/` is Astro's file router, so it keeps the flat route layout above instead of FSD slices and segments.
