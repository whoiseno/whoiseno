# `src/features`

User-facing slices, one per section of the portfolio. The `@/features/*` alias is defined in [`tsconfig.json`](../../tsconfig.json).

```
src/features/
├── works/
│   └── WorkList.astro          # work experience cards; props: limit?, detailed=false
├── projects/
│   └── ProjectList.astro       # project cards linking to /projects/[slug]; props: featured=false, limit?
├── uses/
│   ├── software/SoftwareList.astro   # daily apps and tools
│   └── hardware/HardwareList.astro   # daily gadgets
├── books/
│   └── BookList.astro          # grouped Reading, Read, Want to read
├── movies/
│   └── MovieList.astro         # grouped Watching, Watched, Planned (movies, shows, anime)
└── theme-toggle/
    └── ThemeToggle.astro       # light/dark switch
```

Each list reads its own content collection with `getCollection`, sorts it, and renders `Card`s. Every list shows "Nothing here yet." when its collection is empty. Collection shapes are in [`content.md`](../content.md).

- `WorkList` sorts by `startDate` descending. The Markdoc body is only rendered with `detailed`, so the home page stays compact.
- `ProjectList` with `featured` filters to `featured: true` entries (used on the home page).
- Software and hardware are two separate collections shown together on `/uses`.

## `theme-toggle`

An Alpine `x-data` component. It toggles the `dark` class on `<html>` and stores `localStorage.theme`, with the write wrapped in `try/catch`. The first-paint theme is applied by the inline script in `Root.astro`, not by this component, so there is no flash. Sun and moon icons swap with `dark:` classes.

## Conventions

- Each feature gets its own subfolder. A feature may import from `entities` and `shared`, but never from `pages` or `app`, and never from another feature (compose features in `pages` or `app`).
- Interactivity belongs in the feature as colocated Alpine `x-data`, rather than growing `app/entrypoints/alpine.ts` into a catch-all.

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
