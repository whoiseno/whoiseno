# `src/features`

**Status: scaffolded, currently empty.** The directory exists and has a `@/features/*` path alias in [`tsconfig.json`](../../tsconfig.json), but no feature slices have been added yet.

## Intended purpose (Feature-Sliced Design)

In FSD, `features` holds user-facing functionality that delivers business value on its own — things a user _does_, as opposed to routes (`pages`) or passive domain data (`entities`). Typical examples for a portfolio site:

- A contact form
- A theme/dark-mode toggle
- A "copy email to clipboard" button
- A blog post filter/search

## Conventions to follow once this layer is used

- Each feature typically gets its own subfolder (e.g. `src/features/contact-form/`), exporting its public API from an index rather than reaching into internal files from `pages`.
- A feature may import from `entities` and `shared`, but never from `pages` or `app`, and never from another feature directly (compose features together at the `pages` level, not by cross-importing).
- If interactivity is needed, features are the natural place to add Alpine.js `x-data` components colocated with their markup, rather than growing `app/entrypoints/alpine.ts` into a catch-all.

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
