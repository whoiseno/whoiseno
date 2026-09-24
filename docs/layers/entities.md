# `src/entities`

**Status: scaffolded, currently empty.** The directory exists and has a `@/entities/*` path alias in [`tsconfig.json`](../../tsconfig.json), but no entities have been added yet.

## Intended purpose (Feature-Sliced Design)

In FSD, `entities` holds domain/business objects — the nouns of the app — along with the minimal UI needed to display them. For this project, the obvious candidate is a **post** (backed by the `posts` content collection defined in `.pages.yml`; see [`content.md`](../content.md)): things like a `PostCard` component, a `formatPostDate` helper, or a `Post` type would live under `src/entities/post/`.

Other candidates as the site grows: a `project` entity (for a portfolio/projects grid), a `social-link` entity, etc.

## Conventions to follow once this layer is used

- Each entity typically gets its own subfolder (e.g. `src/entities/post/`) with its own `ui/`, `model/` (types, helpers), etc.
- An entity may import from `shared` only — never from `features`, `pages`, or `app`, and never from another entity (if two entities need to relate, that composition happens in `features` or `pages`).
- Keep entities passive: rendering and shaping data, not handling user interaction (that's `features`) or routing (that's `pages`).

See [`architecture.md`](../architecture.md) for how this layer relates to the rest of the app.
