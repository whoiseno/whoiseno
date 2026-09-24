# Content Management

Content is authored through [Pages CMS](https://pagescms.org/), a git-backed CMS that edits files directly in this repo (similar to Netlify/Decap CMS). Its schema lives in [`.pages.yml`](../.pages.yml) at the repo root.

## Current schema

```yaml
media:
  input: src/app/media
  output: /app/media
content:
  - name: posts
    label: Posts
    type: collection
    path: src/content/posts
    fields:
      - name: title
        type: string
      - name: body
        type: rich-text
  - name: site
    label: Site settings
    type: file
    path: src/shared/config/site.json
    fields:
      - name: title
        type: string
      - name: description
        type: text
      - name: url
        type: string
```

### `posts` (collection)

- Written to `src/content/posts/` — one file per post, each with `title` and `body`.
- **Not yet wired into Astro.** There's no `src/content/config.ts` defining an Astro content collection, and no `src/content/posts/` directory exists yet — the CMS schema is ahead of the codebase. Before authoring posts, add a content collection config (see [Astro's content collections guide](https://docs.astro.build/en/guides/content-collections/)) with a schema matching (or superseding) these fields, and a route under `src/pages` to render them (see [`layers/pages.md`](./layers/pages.md)).
- The natural home for post-related types/components once collections exist is `src/entities/post/` (see [`layers/entities.md`](./layers/entities.md)).

### `site` (single file)

- Written to `src/shared/config/site.json` (title, description, url) — global site metadata.
- **Also not yet created.** `src/shared/config/` is currently empty. Once this file exists, it's a plain JSON import — no Astro content-collection machinery needed for a single file.

### Media

- Uploads go to `src/app/media` on disk, served from `/app/media`. Neither the source folder nor any uploaded assets exist yet.

## Summary of what's pending

The CMS schema (`.pages.yml`) currently describes content structure that hasn't been scaffolded in code yet:

1. No `src/content/config.ts` (Astro content collection definitions)
2. No `src/content/posts/` directory or entries
3. No `src/shared/config/site.json`
4. No `src/app/media/` directory

Treat `.pages.yml` as the source of truth for the _intended_ content shape when building these pieces out.
