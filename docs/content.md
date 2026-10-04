# Content Management

Content is authored through [Keystatic](https://keystatic.com/docs/installation-astro), a git-backed CMS that edits files directly in this repo. The schema lives in [`keystatic.config.ts`](../keystatic.config.ts) and the Astro-side collection definitions live in [`src/content.config.ts`](../src/content.config.ts). The two describe the same shape and must be kept in sync by hand: Keystatic writes the files, Astro validates and reads them.

All content lives under `src/content/`. The seed entries are placeholders (`Example ...`) to replace with real content.

## Collections

| Keystatic key | Path                     | Format              | Shown on                             |
| ------------- | ------------------------ | ------------------- | ------------------------------------ |
| `profile`     | `src/content/profile/`   | `.mdoc` (singleton) | Home hero, footer                    |
| `works`       | `src/content/works/*`    | `.mdoc`             | `/`, `/works`                        |
| `projects`    | `src/content/projects/*` | `.mdoc`             | `/`, `/projects`, `/projects/[slug]` |
| `software`    | `src/content/software/*` | `.yaml`             | `/uses`                              |
| `hardware`    | `src/content/hardware/*` | `.yaml`             | `/uses`                              |
| `books`       | `src/content/books/*`    | `.yaml`             | `/books`                             |
| `movies`      | `src/content/movies/*`   | `.yaml`             | `/movies`                            |

- `.mdoc` entries are frontmatter plus a [Markdoc](https://markdoc.dev) body, rendered with `render()` from `astro:content` inside `Prose`. Works only render the body on `/works` (`WorkList detailed`), so the home page stays compact.
- `.yaml` entries are data only.
- `projects[].featured` controls which projects appear on the home page.
- `books[].status` is `reading | read | want`; `movies[].status` is `watching | watched | planned`; `movies[].kind` is `movie | show | anime`. The list components group entries by these values.
- Dates are coerced with `z.coerce.date()`. Display formatting is in [`src/shared/lib/date.ts`](../src/shared/lib/date.ts) and is UTC-based so a date never shifts by timezone.
- The profile avatar is stored in `src/assets/profile/` and validated with Astro's `image()` helper, so it goes through `astro:assets`.

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

`ui.navigation` in `keystatic.config.ts` groups the sidebar as Profile, Work (works, projects), Uses (software, hardware) and Library (books, movies).
