# Books and movies

Movies are added from the Keystatic admin. Books are not in the CMS: `/hobbies/books` reads the library straight from [Hardcover](https://hardcover.app). The movie field reference is in [`content.md`](./content.md) and how covers are fetched is in [`layers/shared.md`](./layers/shared.md#apiposters).

## Books

To add, rate or finish a book, do it in the Hardcover app. The page picks it up within about five minutes, because the page and the API responses are cached for that long. There is no file to edit and no deploy to wait for.

- **What shows:** only books with a _Public_ privacy setting, in the statuses _Want to read_, _Currently reading_ and _Read_. Set a book to private in Hardcover to hide it from the site.
- **Reading** shows up to 20 books you are currently reading, newest first. **Library** shows the rest, read books first by most recently finished, then the want-to-read list, 12 per page with Previous and Next links (`?page=2`).
- **Rating** shows as a pill such as "4/5" with a yellow star. **Review** shows the first 200 characters of your Hardcover review, faint and in quotes. A review marked as containing spoilers is left out.
- **Covers and authors** come from Hardcover. To fix a wrong cover or author, edit the book on Hardcover.

### Setup

The page needs `HARDCOVER_API_KEY`, an API token from your Hardcover account (see the [API docs](https://docs.hardcover.app/api/getting-started/)). Add it to `.env` locally and to Vercel for Production and Preview. See [`setup.md`](./setup.md#environment-variables). Without it the page shows "My books are unavailable right now" with a 503.

### API quota and caching

Hardcover's free plan allows 5,000 requests a day (resetting at midnight UTC), 60 a minute and 30 seconds per query. Each top-level GraphQL field counts as one request, regardless of how many rows it returns, so pagination does not lower the count by itself. Caching does, in three layers:

1. **Vercel's CDN** keeps a rendered page for five minutes (`s-maxage=300`) and serves it stale for up to an hour while it refreshes (`stale-while-revalidate=3600`). Each `?page=` is cached separately.
2. **An in-memory cache per server instance** (`src/shared/api/hardcover/cache.ts`) holds the book count, the Reading list and each Library page for five minutes, and your user ID indefinitely. Concurrent requests for the same data share one API call.
3. **Stale on error.** If Hardcover is down or rate limits the site (HTTP 429), the last good data is served and the API is not asked again for a minute. If there is no earlier data, the page returns a 503 and is not cached.

A visit to page 1 on a cold cache costs four requests (your ID, the count, Reading and Library). A page past the end costs two and redirects to the last page.

## Add a movie, series or anime

Open `/keystatic` locally (`pnpm dev`, or the "CMS" button in the sidebar) and pick **Hobbies**, then **Movies**. Saving writes a YAML file into `src/content/movies/`. Commit it like any other change.

On the deployed site, open `/keystatic` there. Saving commits to the repository through the GitHub App and Vercel rebuilds the site. Posters are fetched during that build, so a new poster appears once the deployment finishes, not at save time. See [`content.md`](./content.md#admin-ui) for the GitHub setup.

The file name comes from the title (`Inception` becomes `inception.yaml`), so pick the final title before the first save.

1. **Create entry**, then fill in **Title**. It is the only required field.
2. Set **Kind** (_Movie_, _Series_, _Show_ or _Anime_). It shows as a badge. Then set **Director or creator** and **Status** (_Watching_, _Watched_ or _Planned_).
3. Add **Released on** (when it came out), **Started on** and **Finished on** (your dates).
4. Optionally set **My rating (1-5)** and **My description**. The rating shows as a pill such as "4/5" with a yellow star. The description is your own words, not the blurb, and shows faint and in quotes.
5. Add an attribution link. Use **TMDB** for films and series, and **AniList** or **MyAnimeList** for anime.
6. Save.

## Getting a poster

The poster comes from the first of these that applies:

1. The **Poster** you uploaded. It always wins, and the upload is stored in `src/assets/movies/`.
2. The first **Attribution link**, in the order listed, whose source can supply a poster. Put the link you want the poster from first.
3. A tile with the title's first letter.

Add an item to **Attribution links**, choose the **Source**, and paste the ID into **ID or URL**:

| Source                        | Paste this                | Where to find it                                                                | Poster |
| ----------------------------- | ------------------------- | ------------------------------------------------------------------------------- | ------ |
| TMDB (movie ID), TMDB (TV ID) | `27205`, the number only  | The number in `themoviedb.org/movie/27205-inception`                            | Yes    |
| AniList, MyAnimeList (anime)  | `16498`, the number only  | The number in `anilist.co/anime/16498/...` or `myanimelist.net/anime/16498/...` | Yes    |
| Wikidata                      | `Q25188`, the item number | The end of the page URL                                                         | No     |

- Pick the right TMDB source: a film uses _TMDB (movie ID)_, a series or show uses _TMDB (TV ID)_. The same number means a different title in each.
- Paste the bare ID, not the URL. A full URL still works as an attribution link, but no poster is fetched for it, and a TMDB slug such as `27205-inception` fails the lookup.
- Wikidata only links back. Add it as well if you like, after the link that supplies the poster.
- **Aspect ratio** crops the poster and defaults to `2/3`. For a poster fetched from a link, _Original_ falls back to `2/3`, because the site does not know the remote image's own shape.

## Moving an entry along

Edit the entry and change **Status**, then add the date that goes with it:

- _Planned_ to _Watching_: set **Started on**. The entry moves to the section on top, with the poster beside the text.
- _Watching_ to _Watched_: set **Finished on** and the rating. The entry moves into the **Library** grid.

The page shows "Started Jun 2025" for something in progress, "Watched Jun 2025" for something done, and "Planned" for the rest. Within each section, entries are sorted by status, then most recently finished, then title.

## If the poster doesn't show

The entry falls back to the letter tile whenever a lookup fails, and the page still builds. A lookup that errors logs a `[posters] <source> <id>: ...` line in the `pnpm dev` output or the Vercel build log.

- **An error line naming the provider:** the ID is wrong, or it belongs to the other TMDB type (a TV ID pasted as a movie, or the reverse).
- **`TMDB_TOKEN is not set`:** add the token to `.env` locally, or to Vercel for Production and Preview. See [`setup.md`](./setup.md#environment-variables).
- **`timed out`:** the provider was slow. Reload in dev, or redeploy.
- **No line at all:** either no link can supply a poster (the entry has none, or only Wikidata or a pasted URL), or the catalogue simply has no poster for that title, which is not an error. Add a link with a bare ID, or upload a **Poster**.
