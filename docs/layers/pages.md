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

Every page wraps its content in `Site` from [`app/layouts/Site.astro`](./app.md), which provides the header, `<main>` container and footer. `Site` takes `title` and `description`; when `title` is set it renders the page `<h1>` and the muted description, and `index.astro` omits it because `ProfileHero` provides the `<h1>`. A page can put content directly under the description with `<X slot="header" />` (the writing pages use it for `WritingFilters`, the tag links and kind dropdown).

Sections are built with `Section` (`shared/ui/section`), which adds the title, an optional "View all" link and a scroll-reveal.

- `index.astro`: `ProfileHero`, then a Works `Section` (`WorkList limit={3}`) and a Projects `Section` (`ProjectList featured limit={3}`).
- `projects/[slug].astro`: date range, Live demo and Source links, skill badges, the Markdoc body inside `Prose`, and an "All projects" back link.
- `writing/[slug].astro`: a badge with the entry kind (Blog, Tutorial, Journal or Note), the published date, the width and focus buttons (`WritingToolbar`), the Markdoc body inside `Prose`, the table of contents (`WritingToc`, beside the text from `lg`), an "All writing" back link and the previous and next posts (`WritingPager`) right below it. `getStaticPaths` sorts entries by `publishedDate` ascending and passes each page its neighbours as `previous` and `next`. `Site` supplies the title and description. A wrapper with `x-data="writingReader"` owns the wide and focus state and the active heading; see [`animations.md`](../animations.md) for focus mode and [`content.md`](../content.md) for what the body supports.
- `writing/tags/[tag].astro`: `WritingFilters` with the current tag highlighted, then `WritingList` filtered to that tag, and an "All writing" back link.
- `hobbies/index.astro`: one `Card` per hobby (Books, Movies). To add another hobby, add an entry to the `hobbies` array there and create `hobbies/<name>.astro`. The header link is the single "Hobbies" entry in the Navigation singleton (see [`content.md`](../content.md)).
- `hobbies/books.astro` and `hobbies/movies.astro`: `Site` around `BookList` and `MovieList`.

The older `Page*` primitives in `shared/ui/page` are no longer used by any page.

## Conventions

- Keep pages thin: copy and composition order only. Data access and rendering belong in `entities` and `features`.
- Pages may import from `app`, `features`, `entities` and `shared`, but nothing outside `pages` should import from `pages`.
