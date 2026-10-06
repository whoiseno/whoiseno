# Content Management

Content is authored through [Keystatic](https://keystatic.com/docs/installation-astro), a git-backed CMS that edits files directly in this repo. The schema lives in [`keystatic.config.ts`](../keystatic.config.ts) and the Astro-side collection definitions live in [`src/content.config.ts`](../src/content.config.ts). The two describe the same shape and must be kept in sync by hand: Keystatic writes the files, Astro validates and reads them.

All content lives under `src/content/`. The seed entries are placeholders (`Example ...`) to replace with real content.

## Collections

| Keystatic key | Path                      | Format              | Shown on                                             |
| ------------- | ------------------------- | ------------------- | ---------------------------------------------------- |
| `navigation`  | `src/content/navigation/` | `.yaml` (singleton) | Sidebar links                                        |
| `profile`     | `src/content/profile/`    | `.mdoc` (singleton) | Home hero, footer                                    |
| `works`       | `src/content/works/*`     | `.mdoc`             | `/`, `/works`                                        |
| `projects`    | `src/content/projects/*`  | `.mdoc`             | `/`, `/projects`, `/projects/[slug]`                 |
| `writing`     | `src/content/writing/*`   | `.mdoc`             | `/writing`, `/writing/[slug]`, `/writing/tags/[tag]` |
| `software`    | `src/content/software/*`  | `.yaml`             | `/uses`                                              |
| `hardware`    | `src/content/hardware/*`  | `.yaml`             | `/uses`                                              |
| `movies`      | `src/content/movies/*`    | `.yaml`             | `/hobbies/movies`                                    |

- `.mdoc` entries are frontmatter plus a [Markdoc](https://markdoc.dev) body, rendered with `render()` from `astro:content` inside `Prose`. A work's body is shown inside its expanded accordion row.
- `.yaml` entries are data only.
- `projects[].featured` controls which projects appear on the home page. `projects[].logo` (optional image, stored in `src/assets/projects/`) is shown in the project card's tile; without it the card shows the first letter of the title.
- `works[].technologies` is a list of logo slugs. The allowed values are `logoNames` from [`src/shared/config/logos.ts`](../src/shared/config/logos.ts), used by both the Zod `z.enum` and the Keystatic multiselect, so adding a logo there makes it selectable in both. `works[].workMode` is `on-site | remote | hybrid` (default `on-site`). A work with no `endDate` is current and shows the "Working" badge.
- `navigation.links[]` is the sidebar menu (the top-bar menu on phones), in the order listed: `label`, `href` (a site path such as `/writing`) and `visible` (default `true`). Unticking "Show in navigation" hides a link without deleting it. The singleton file must exist (`src/content/navigation/index.yaml`); `getNavItems` throws without it. Hobbies appears as one link (`/hobbies`); Books and Movies are reached from that page.
- `writing[].kind` is `blog | tutorial | journal | note` (default `blog`). The list at `/writing` shows the title, an outline badge with the kind and the date on one row, grouped by year, and a dropdown next to the tag links filters the list by kind. The list also shows the reading time ("3 min read"), worked out from the body at build time. The detail page shows the same badge. There is no draft flag, so every file in `src/content/writing/` is published.
- `writing[].cover` (optional image, stored in `src/assets/writing/`) and `writing[].coverAlt` are shown on the post right after the title and description, and the cover is the page's `og:image`. The list never shows it. Write `coverAlt` whenever there is a cover. The social preview needs `site` in `astro.config.mjs` (set from `VERCEL_PROJECT_PRODUCTION_URL`) and uses the cover's own format, so use a PNG or JPEG about 1200x630; an SVG will not render on social networks.
- `writing[].tags` is a free-text list. The tag pages are derived from it: [`getWritingTags`](../src/entities/writing/api/getWritingTags.ts) groups the labels by `slugify(label)` (so `Astro` and `astro` are one tag) and `/writing/tags/[tag]` is generated for each. Tags are shown on `/writing` and the tag pages as links, never in the list rows.
- `software[]` and `hardware[]` share these fields: `name` (required), `logo` (image), `description` (what it is), `usage` (how you use it) and `link`. `hardware[]` adds `photos`, a list of `{ image, alt, ratio }` (`ratio` is an [aspect ratio](#aspect-ratios), default `1/1`). Images are stored in `src/assets/uses/software/` and `src/assets/uses/hardware/`. Without a `logo`, the item shows the first letter of the name.
- Each `profile.socials[]` item feeds the footer and the hover cards on the home page. `platform` and `url` are required. The other fields are optional and have these fallbacks (see [`getSocialLinks`](../src/entities/profile/lib/socials.ts)):
  - `handle`: the email address, or `@` plus the last path segment of the URL.
  - `displayName`: the profile `name`.
  - `avatar`: the profile `avatar`, then initials.
  - `banner`: a plain muted block.
  - `bio` and `verified` (default `false`): shown only when set.
  - For `platform: email`, `url` is `mailto:<address>`. It renders as the address with a copy button instead of a hover card.
- Books are not a collection. `/hobbies/books` is rendered on demand from the [Hardcover](https://hardcover.app) API, so books are managed in the Hardcover app (see [`books-and-movies.md`](./books-and-movies.md#books)).
- `movies[]` is the movie library. For the step-by-step admin workflow see [`books-and-movies.md`](./books-and-movies.md). Fields: `title`, `kind`, `creator` (director or creator), `status`, `poster` (optional image, stored in `src/assets/movies/`; when empty the poster is fetched from the first `link` that has one, see [`shared.md`](./layers/shared.md#apiposters)), `posterRatio` (an [aspect ratio](#aspect-ratios), default `2/3`), `releaseDate`, `startedDate`, `watchedDate`, `rating` (integer 1 to 5, your own), `description` (your own words, not a synopsis) and `links`.
- `movies[].status` is `watching | watched | planned`; `movies[].kind` is `movie | series | show | anime` and shows as a badge. `/hobbies/movies` puts `watching` entries in a section on top and everything else in a "Library" grid.
- `movies[].links` are attribution links to free or open catalogues: each item is a `source` and an `id` (or the full page URL). The sources are listed in [`shared/config/media-sources.ts`](../src/shared/config/media-sources.ts): TMDB, AniList, MyAnimeList and Wikidata. To add one, add it to `mediaSourceCatalog`; the Zod schema and the Keystatic select both read from it. Dates and the rest of the details are typed in by hand. Only the poster is fetched at build time, from TMDB or AniList, and only when no `poster` is uploaded. Put the link you want the poster from first.
- Dates are coerced with `z.coerce.date()`. Display formatting is in [`src/shared/lib/date.ts`](../src/shared/lib/date.ts) and is UTC-based so a date never shifts by timezone.
- The profile avatar is stored in `src/assets/profile/` and validated with Astro's `image()` helper, so it goes through `astro:assets`. Hover-card avatars and banners are stored in `src/assets/profile/socials/` the same way.

## Writing entry body

The body of a writing entry supports more than plain text. All of it is editable in the Keystatic editor and stored as Markdoc in the `.mdoc` file.

- **Images** are inserted from the editor and stored in `src/assets/writing/`. The file references them as `![alt](../../assets/writing/name.png "Caption")` and Astro processes them through `astro:assets`, which needs `sharp` (a dependency). The optional title is the visible figure caption under the image (not a hover tooltip), and `alt` stays the text alternative. An image alone on its line renders as a `<figure>` through `Figure.astro`. Clicking it (or pressing Enter or Space with it focused) opens the full-size image in a dialog; Escape or a click outside the image closes it and returns focus.
- **Code blocks** are fenced blocks with a language, rendered by [Expressive Code](https://expressive-code.com) (see [`architecture.md`](./architecture.md)) with `github-light` and `github-dark` following the `.dark` class. Options go in a Markdoc annotation after the language: ` ```ts {% mark="2" ins="3" del="4" wrap=true %} `. `mark` highlights lines, `ins` and `del` colour added and removed lines (a line number or a range such as `"2-4"`; several are separated by commas), and `wrap=true` starts the block wrapped. A ` ```diff ` block colours its `+` and `-` lines without any annotation, and shell languages (`bash`, `sh`) get a terminal frame. Every block has a copy button and a wrap toggle in its corner.
- **Carousel** is `{% carousel caption="..." %}` with two or more `{% slide %}` children. Each slide holds an image and optional text, and takes an optional `ratio` (see [Aspect ratios](#aspect-ratios)). The optional `caption` is shown above the track, at the start of the row, with the previous and next buttons at its end; both line up with the text column, and the buttons move one slide at a time. The track spans the full width of the page, so it passes over the sidebar (and its table of contents) where they meet, and the first slide lines up with the text column.
- **Tables** are standard Markdoc tables (the editor's table button, or pipe syntax in the file). They render inside a bordered wrapper that scrolls sideways when the table is wider than the space available.
- **Breakout:** the text keeps the column width, while code blocks, images, tables and blockquotes extend 10% of the column past it on each side, as far as the viewport allows (not at all on phones). Captions and blockquote text stay on the column. The carousel does not use the breakout; its track runs the full width of the page. See [`styling.md`](./styling.md).
- **Columns** is `{% columns %}` with exactly two `{% column %}` children, side by side from `sm` and stacked below it.
- **Math** is LaTeX, rendered with [KaTeX](https://katex.org) at build time. `{% math expression="..." /%}` is a block on its own line and `{% inlineMath expression="..." /%}` sits inside a sentence. In the editor they are the "Math block" and "Inline math" components; they show the raw LaTeX, not a rendered preview. A malformed expression renders as its source in red instead of failing the build.

The tags are declared in two places that must stay in sync: the `components` option of the `content` field in `keystatic.config.ts` (editor UI) and the `tags` map in `markdoc.config.mjs` (rendering, with `component("./src/features/writing/index.ts", "<ExportName>")`). After adding `markdoc.config.mjs` or changing it, restart `pnpm dev`; Astro does not pick up a new Markdoc config on the fly.

When writing a math tag by hand in the `.mdoc` file, double every backslash inside the attribute (`expression="\\frac{1}{3}"`): Markdoc treats a single backslash in a string as an escape and rejects it. The Keystatic editor writes the doubled form itself, so this matters only when editing the file directly.

`/writing/[slug]` renders headings with ids, and the table of contents in the sidebar (from `lg`) has one tick for each `h1`, `h2` and `h3` heading, so a post with more headings gets more ticks. A `#` heading in the body is a second `<h1>` on the page, because the title already is one; use `##` for sections unless you want that level in the contents.

## Aspect ratios

Some images can be cropped to a shape picked from a fixed list in [`shared/config/aspect-ratio.ts`](../src/shared/config/aspect-ratio.ts): `original` (the image's own shape), `1/1`, `4/3`, `3/2`, `16/9`, `21/9`, `3/4` and `2/3`. The keys use a slash so they stay plain strings in YAML and Markdoc attributes. The Zod `z.enum` and the Keystatic select both read the list, so adding a key to `aspectRatioCatalog` makes it available in both. The image fills the shape (`object-cover`), so it is cropped, never stretched.

- Writing carousel: `ratio` on each `{% slide %}`, default `original`.
- Hardware photos: `ratio` on each photo, default `1/1`. All photos share one height, and the width follows the ratio.
- Movie posters: `posterRatio`, default `2/3`.
- An image placed on its own in a post keeps its own shape. Keystatic's standard image node only stores `alt` and `title`, so there is nowhere to keep a ratio for it.
- Avatars, logos and banners are not on the list; their shape comes from the component that shows them.

## Adding or changing a field

1. Add the field in `keystatic.config.ts`.
2. Add it to the matching Zod schema in `src/content.config.ts`.
3. Run `pnpm astro sync` to regenerate the collection types.
4. Use it in the entity or feature that renders the collection, then run `pnpm astro check`.

## Admin UI

Keystatic's integration injects `/keystatic` (the admin UI) and `/api/keystatic/*`. Those routes are server-rendered (`prerender: false`) while every other page stays static, apart from `/hobbies/books` (see [`books-and-movies.md`](./books-and-movies.md#books)), which is why the project uses the Vercel adapter and why `@astrojs/react` is installed. React is used only by the Keystatic admin; site pages do not use it.

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

`ui.navigation` in `keystatic.config.ts` groups the sidebar as Site (navigation, profile), Work (works, projects), Writing (writing), Uses (software, hardware) and Hobbies (movies).

In development, every site page has a "CMS" button in the sidebar actions that opens `/keystatic`, and the admin shows a "Back to site" link in its bottom-right corner. Both are dev-only; see [`layers/app.md`](./layers/app.md).
