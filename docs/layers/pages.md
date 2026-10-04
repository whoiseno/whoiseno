# `src/pages`

Astro's file-based router: every `.astro`/`.md`/`.ts` file here becomes a route. See [Astro's routing guide](https://docs.astro.build/en/guides/routing/) for the full model.

```
src/pages/
├── index.astro             # /           profile hero, latest works, featured projects
├── works.astro             # /works      full work experience with details
├── projects/
│   ├── index.astro         # /projects
│   └── [slug].astro        # /projects/<id>   getStaticPaths from the projects collection
├── uses.astro              # /uses       Software and Hardware sections
├── books.astro             # /books
└── movies.astro            # /movies
```

All of these are prerendered. The only on-demand routes are `/keystatic` and `/api/keystatic/*`, injected by the Keystatic integration (there is no file for them here).

## Composition

Every page wraps its content in `Site` from [`app/layouts/Site.astro`](./app.md), which provides the header, `<main>` container and footer. `Site` takes `title` and `description`; when `title` is set it renders the page `<h1>` and the muted description, and `index.astro` omits it because `ProfileHero` provides the `<h1>`.

Sections are built with `Section` (`shared/ui/section`), which adds the title, an optional "View all" link and a scroll-reveal.

- `index.astro`: `ProfileHero`, then a Works `Section` (`WorkList limit={3}`) and a Projects `Section` (`ProjectList featured limit={3}`).
- `projects/[slug].astro`: date range, Live demo and Source links, skill badges, the Markdoc body inside `Prose`, and an "All projects" back link.

The older `Page*` primitives in `shared/ui/page` are no longer used by any page.

## Conventions

- Keep pages thin: copy and composition order only. Data access and rendering belong in `entities` and `features`.
- Pages may import from `app`, `features`, `entities` and `shared`, but nothing outside `pages` should import from `pages`.
