# Content Management

Content is authored through [Keystatic](https://keystatic.com/docs/installation-astro), a git-backed CMS that edits files directly in this repo. The schema lives in [`keystatic.config.ts`](../keystatic.config.ts) and the Astro-side collection definitions live in [`src/content.config.ts`](../src/content.config.ts). The two describe the same shape and must be kept in sync by hand: Keystatic writes the files, Astro validates and reads them.

All content lives under `src/content/`. The seed entries are placeholders (`Example ...`) to replace with real content.

## Collections

| Keystatic key | Path                      | Format              | Shown on                                             |
| ------------- | ------------------------- | ------------------- | ---------------------------------------------------- |
| `navigation`  | `src/content/navigation/` | `.yaml` (singleton) | Header links                                         |
| `profile`     | `src/content/profile/`    | `.mdoc` (singleton) | Home hero, footer                                    |
| `works`       | `src/content/works/*`     | `.mdoc`             | `/`, `/works`                                        |
| `projects`    | `src/content/projects/*`  | `.mdoc`             | `/`, `/projects`, `/projects/[slug]`                 |
| `writing`     | `src/content/writing/*`   | `.mdoc`             | `/writing`, `/writing/[slug]`, `/writing/tags/[tag]` |
| `software`    | `src/content/software/*`  | `.yaml`             | `/uses`                                              |
| `hardware`    | `src/content/hardware/*`  | `.yaml`             | `/uses`                                              |
| `books`       | `src/content/books/*`     | `.yaml`             | `/hobbies/books`                                     |
| `movies`      | `src/content/movies/*`    | `.yaml`             | `/hobbies/movies`                                    |

- `.mdoc` entries are frontmatter plus a [Markdoc](https://markdoc.dev) body, rendered with `render()` from `astro:content` inside `Prose`. A work's body is shown inside its expanded accordion row.
- `.yaml` entries are data only.
- `projects[].featured` controls which projects appear on the home page.
- `works[].technologies` is a list of SVGL logo slugs. The allowed values are `logoNames` from [`src/shared/ui/icon/logos.ts`](../src/shared/ui/icon/logos.ts), used by both the Zod `z.enum` and the Keystatic multiselect, so adding a logo there makes it selectable in both. `works[].workMode` is `on-site | remote | hybrid` (default `on-site`). A work with no `endDate` is current and shows the "Working" badge.
- `navigation.links[]` is the header menu, in the order listed: `label`, `href` (a site path such as `/writing`) and `visible` (default `true`). Unticking "Show in navigation" hides a link without deleting it. The singleton file must exist (`src/content/navigation/index.yaml`); `getNavItems` throws without it. Hobbies appears as one link (`/hobbies`); Books and Movies are reached from that page.
- `writing[].kind` is `blog | tutorial | journal | note` (default `blog`). The list at `/writing` shows the title, an outline badge with the kind and the date on one row, grouped by year, and a dropdown next to the tag links filters the list by kind. The detail page shows the same badge. There is no draft flag, so every file in `src/content/writing/` is published.
- `writing[].tags` is a free-text list. The tag pages are derived from it: [`getWritingTags`](../src/entities/writing/getWritingTags.ts) groups the labels by `slugify(label)` (so `Astro` and `astro` are one tag) and `/writing/tags/[tag]` is generated for each. Tags are shown on `/writing` and the tag pages as links, never in the list rows.
- `software[]` and `hardware[]` share these fields: `name` (required), `logo` (image), `description` (what it is), `usage` (how you use it) and `link`. `hardware[]` adds `photos`, a list of `{ image, alt }`. Images are stored in `src/assets/uses/software/` and `src/assets/uses/hardware/`. Without a `logo`, the item shows the first letter of the name.
- Each `profile.socials[]` item feeds the footer and the hover cards on the home page. `platform` and `url` are required. The other fields are optional and have these fallbacks (see [`getSocialLinks`](../src/entities/profile/socials.ts)):
  - `handle`: the email address, or `@` plus the last path segment of the URL.
  - `displayName`: the profile `name`.
  - `avatar`: the profile `avatar`, then initials.
  - `banner`: a plain muted block.
  - `bio` and `verified` (default `false`): shown only when set.
  - For `platform: email`, `url` is `mailto:<address>`. It renders as the address with a copy button instead of a hover card.
- `books[]` and `movies[]` are the personal library. Shared fields: `title`, `status`, `poster` (image, stored in `src/assets/books/` or `src/assets/movies/`), `rating` (integer 1 to 5, your own), `description` (your own words, not a synopsis) and `links`. Books add `author`, `publishedDate`, `startedDate` and `finishedDate`; movies add `kind`, `creator` (director or creator), `releaseDate`, `startedDate` and `watchedDate`.
- `books[].status` is `reading | read | want`; `movies[].status` is `watching | watched | planned`; `movies[].kind` is `movie | series | show | anime` and shows as a badge. `/hobbies/books` and `/hobbies/movies` put `reading` and `watching` entries in a section on top and everything else in a "Library" grid.
- `books[].links` and `movies[].links` are attribution links to free or open catalogues: each item is a `source` and an `id` (or the full page URL). The sources are listed in [`shared/config/media-sources.ts`](../src/shared/config/media-sources.ts): Open Library, Google Books, Hardcover and Wikidata for books; TMDB, IMDb, AniList, MyAnimeList and Wikidata for movies. To add one, add it to `mediaSourceCatalog`; the Zod schema and the Keystatic select both read from it. The details themselves (cover, dates) are typed in by hand, nothing is fetched at build time.
- Dates are coerced with `z.coerce.date()`. Display formatting is in [`src/shared/lib/date.ts`](../src/shared/lib/date.ts) and is UTC-based so a date never shifts by timezone.
- The profile avatar is stored in `src/assets/profile/` and validated with Astro's `image()` helper, so it goes through `astro:assets`. Hover-card avatars and banners are stored in `src/assets/profile/socials/` the same way.

## Writing entry body

The body of a writing entry supports more than plain text. All of it is editable in the Keystatic editor and stored as Markdoc in the `.mdoc` file.

- **Images** are inserted from the editor and stored in `src/assets/writing/`. The file references them as `![alt](../../assets/writing/name.png)` and Astro processes them through `astro:assets`, which needs `sharp` (a dependency).
- **Code blocks** are fenced blocks with a language. [`markdoc.config.mjs`](../markdoc.config.mjs) highlights them with Shiki using `github-light` and `github-dark`. Rules in `global.css` switch between the two with the `.dark` class (see [`styling.md`](./styling.md)).
- **Carousel** is `{% carousel %}` with two or more `{% slide %}` children. Each slide holds an image and optional text. It is full-bleed: it runs past the text column to the edges of the screen, the first slide lines up with the column, and the buttons move one slide at a time.
- **Columns** is `{% columns %}` with exactly two `{% column %}` children, side by side from `sm` and stacked below it.
- **Math** is LaTeX, rendered with [KaTeX](https://katex.org) at build time. `{% math expression="..." /%}` is a block on its own line and `{% inlineMath expression="..." /%}` sits inside a sentence. In the editor they are the "Math block" and "Inline math" components; they show the raw LaTeX, not a rendered preview. A malformed expression renders as its source in red instead of failing the build.

The tags are declared in two places that must stay in sync: the `components` option of the `content` field in `keystatic.config.ts` (editor UI) and the `tags` map in `markdoc.config.mjs` (rendering, with `component("./src/features/writing/index.ts", "<ExportName>")`). After adding `markdoc.config.mjs` or changing it, restart `pnpm dev`; Astro does not pick up a new Markdoc config on the fly.

When writing a math tag by hand in the `.mdoc` file, double every backslash inside the attribute (`expression="\\frac{1}{3}"`): Markdoc treats a single backslash in a string as an escape and rejects it. The Keystatic editor writes the doubled form itself, so this matters only when editing the file directly.

`/writing/[slug]` renders headings with ids, and the table of contents beside the text (from `lg`) lists the `h2` and `h3` headings only.

## Adding or changing a field

1. Add the field in `keystatic.config.ts`.
2. Add it to the matching Zod schema in `src/content.config.ts`.
3. Run `pnpm astro sync` to regenerate the collection types.
4. Use it in the entity or feature that renders the collection, then run `pnpm astro check`.

## Admin UI

Keystatic's integration injects `/keystatic` (the admin UI) and `/api/keystatic/*`. Those routes are server-rendered (`prerender: false`) while every other page stays static, which is why the project uses the Vercel adapter and why `@astrojs/react` is installed. React is used only by the Keystatic admin; site pages do not use it.

Storage is switched on `import.meta.env.PROD` in `keystatic.config.ts`:

- **Development:** `kind: "local"`. Run `pnpm dev`, open `/keystatic`, and edits are written straight to files in `src/content/`. Commit them like any other change. No environment variables are needed.
- **Production:** `kind: "github"` against `whoiseno/whoiseno`. Edits made at `/keystatic` on the deployed site are committed to the repository through a GitHub App.

### GitHub mode environment variables

Set these in the Vercel project:

| Variable                           | Purpose                                        |
| ---------------------------------- | ---------------------------------------------- |
| `KEYSTATIC_GITHUB_CLIENT_ID`       | GitHub App client ID                           |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`   | GitHub App client secret                       |
| `KEYSTATIC_SECRET`                 | Random string used to sign sessions            |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | GitHub App slug (public, read by the admin UI) |

Per the Keystatic [GitHub mode guide](https://keystatic.com/docs/github-mode), the GitHub App is created from the `/keystatic` route locally, and the first three variables plus the app slug are then written to a `.env` file in the project. Copy those values into Vercel. Because this repo uses `local` storage in development, running that flow means temporarily pointing `storage` at `{ kind: "github", repo: "whoiseno/whoiseno" }` while developing; this repo has not run that flow yet, so treat the step as untested.

## Dashboard grouping

`ui.navigation` in `keystatic.config.ts` groups the sidebar as Site (navigation, profile), Work (works, projects), Writing (writing), Uses (software, hardware) and Hobbies (books, movies).

In development, every site page has a "CMS" button in the header that opens `/keystatic`, and the admin shows a "Back to site" link in its bottom-right corner. Both are dev-only; see [`layers/app.md`](./layers/app.md).
