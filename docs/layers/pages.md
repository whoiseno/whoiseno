# `src/pages`

Astro's file-based router — every `.astro`/`.md`/`.ts` file here becomes a route. See [Astro's routing guide](https://docs.astro.build/en/guides/routing/) for the full model (dynamic routes, endpoints, etc.).

```
src/pages/
└── index.astro   # "/" — the homepage
```

## `index.astro`

The homepage. Composes the site shell and content purely from `shared/ui` primitives — no page-specific components exist yet:

```
Root
└── Page
    └── PageContainer
        ├── PageHeader
        │   ├── PageTitle           ("Enoabasi Essien")
        │   └── PageDescription     (role/tagline)
        └── PageFooter               (copyright line)
```

See [`layers/shared.md`](./shared.md) for what each of these primitives renders.

## Conventions

- A page file should stay thin: compose layout (`shared/ui`), feature slices (`features`), and domain data (`entities`/`content`) — avoid putting business logic or one-off markup directly in a page beyond what's page-specific (copy, composition order).
- As the site grows (e.g. a blog index, individual post pages, a projects page), new routes get added here. A post-detail route would likely be a dynamic route reading from the `posts` content collection — see [`content.md`](../content.md).
- Pages may import from `app`, `features`, `entities`, and `shared`, but nothing outside `pages` should import _from_ `pages`.
