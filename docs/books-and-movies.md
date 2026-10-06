# Adding books and movies

How to add, update and finish an entry for `/hobbies/books` and `/hobbies/movies` from the Keystatic admin. The field reference is in [`content.md`](./content.md) and how covers are fetched is in [`layers/shared.md`](./layers/shared.md#apiposters).

## Where to edit

- **Locally:** run `pnpm dev`, open `/keystatic` (or press the "CMS" button in the sidebar), and pick **Hobbies**, then **Books** or **Movies**. Saving writes a YAML file into `src/content/books/` or `src/content/movies/`. Commit it like any other change.
- **On the deployed site:** open `/keystatic` there. Saving commits to the repository through the GitHub App and Vercel rebuilds the site. Covers are fetched during that build, so a new cover appears once the deployment finishes, not at save time. See [`content.md`](./content.md#admin-ui) for the GitHub setup.

The file name comes from the title (`The Pragmatic Programmer` becomes `the-pragmatic-programmer.yaml`), so pick the final title before the first save.

## Add a book

1. **Create entry**, then fill in **Title** and **Author**. Both are required.
2. Set **Status**: _Reading_, _Read_ or _Want to read_.
3. Add the dates that apply, **Started on** and **Finished on**.
4. Optionally set **My rating (1-5)** and **My description**. The rating shows as a pill such as "4/5" with a yellow star. The description is your own words, not the blurb, and shows faint and in quotes.
5. Under **Attribution links**, add a link (see [Getting a cover](#getting-a-cover)). One link both credits the catalogue and supplies the cover.
6. Save.

## Add a movie, series or anime

1. **Create entry**, then fill in **Title**. It is the only required field.
2. Set **Kind** (_Movie_, _Series_, _Show_ or _Anime_). It shows as a badge. Then set **Director or creator** and **Status** (_Watching_, _Watched_ or _Planned_).
3. Add **Released on** (when it came out), **Started on** and **Finished on** (your dates).
4. Optionally set the rating and description.
5. Add an attribution link. Use **TMDB** for films and series, and **AniList** or **MyAnimeList** for anime.
6. Save.

## Getting a cover

The cover comes from the first of these that applies:

1. The **Poster** you uploaded. It always wins, and the upload is stored in `src/assets/books/` or `src/assets/movies/`.
2. The first **Attribution link**, in the order listed, whose source can supply a cover. Put the link you want the cover from first.
3. A tile with the title's first letter.

Add an item to **Attribution links**, choose the **Source**, and paste the ID into **ID or URL**:

| Source                        | Paste this                       | Where to find it                                                                | Cover |
| ----------------------------- | -------------------------------- | ------------------------------------------------------------------------------- | ----- |
| Open Library (work ID)        | `OL45804W`                       | In the work's URL: `openlibrary.org/works/OL45804W/...`                         | Yes   |
| Open Library (ISBN)           | `9780140328721`, digits only     | The book's ISBN-10 or ISBN-13                                                   | Yes   |
| Google Books                  | The volume ID                    | The `id=` part of `books.google.com/books?id=...`                               | Yes   |
| TMDB (movie ID), TMDB (TV ID) | `27205`, the number only         | The number in `themoviedb.org/movie/27205-inception`                            | Yes   |
| AniList, MyAnimeList (anime)  | `16498`, the number only         | The number in `anilist.co/anime/16498/...` or `myanimelist.net/anime/16498/...` | Yes   |
| Hardcover, Wikidata           | The slug (`Q25188` for Wikidata) | The end of the page URL                                                         | No    |

- Pick the right TMDB source: a film uses _TMDB (movie ID)_, a series or show uses _TMDB (TV ID)_. The same number means a different title in each.
- Paste the bare ID, not the URL. A full URL still works as an attribution link, but no cover is fetched for it, and a TMDB slug such as `27205-inception` fails the lookup.
- Hardcover and Wikidata only link back. Add one of them as well if you like, after the link that supplies the cover.
- **Aspect ratio** crops the cover and defaults to `2/3`. For a cover fetched from a link, _Original_ falls back to `2/3`, because the site does not know the remote image's own shape.

## Moving an entry along

Edit the entry and change **Status**, then add the date that goes with it:

- _Want to read_ or _Planned_ to _Reading_ or _Watching_: set **Started on**. The entry moves to the section on top, with the poster beside the text.
- _Reading_ or _Watching_ to _Read_ or _Watched_: set **Finished on** and the rating. The entry moves into the **Library** grid.

The page shows "Started Jun 2025" for something in progress, "Finished Jun 2025" or "Watched Jun 2025" for something done, and "Want to read" or "Planned" for the rest. Within each section, entries are sorted by status, then most recently finished, then title.

## If the cover doesn't show

The entry falls back to the letter tile whenever a lookup fails, and the page still builds. A lookup that errors logs a `[posters] <source> <id>: ...` line in the `pnpm dev` output or the Vercel build log.

- **An error line naming the provider:** the ID is wrong, or it belongs to the other TMDB type (a TV ID pasted as a movie, or the reverse).
- **`TMDB_TOKEN is not set`:** add the token to `.env` locally, or to Vercel for Production and Preview. See [`setup.md`](./setup.md#environment-variables).
- **`timed out`:** the provider was slow. Reload in dev, or redeploy.
- **No line at all:** either no link can supply a cover (the entry has none, or only Hardcover, Wikidata or a pasted URL), or the catalogue simply has no cover for that title, which is not an error. Add a link with a bare ID, or upload a **Poster**.
