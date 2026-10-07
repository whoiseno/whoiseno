# Content Management

Content is authored through [Keystatic](https://keystatic.com/docs/installation-astro), a git-backed CMS that edits files directly in this repo. The schema lives in [`keystatic.config.ts`](../keystatic.config.ts) and the Astro-side collection definitions live in [`src/content.config.ts`](../src/content.config.ts). The two describe the same shape and must be kept in sync by hand: Keystatic writes the files, Astro validates and reads them. Images, video and audio that the editor uploads are the exception: they go to Cloudinary, and the entry keeps only their address (see [Media on Cloudinary](#media-on-cloudinary)).

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
- A project's body (the "Details" field) has the same components as a writing entry (see [Writing entry body](#writing-entry-body)), and its page has the same table of contents, wide and focus modes, footnotes in the margin and previous and next links. Images in a project body are uploaded to Cloudinary, like every other file the editor uploads. The previous and next links follow `startDate`, oldest first.
- `projects[].featured` controls which projects appear on the home page. `projects[].logo` (optional image, uploaded to Cloudinary) is shown in the project card's tile; without it the card shows the first letter of the title.
- `works[].technologies` is a list of logo slugs. The allowed values are `logoNames` from [`src/shared/config/logos.ts`](../src/shared/config/logos.ts), used by both the Zod `z.enum` and the Keystatic multiselect, so adding a logo there makes it selectable in both. `works[].workMode` is `on-site | remote | hybrid` (default `on-site`). A work with no `endDate` is current and shows the "Working" badge.
- `navigation.links[]` is the sidebar menu (the top-bar menu on phones), in the order listed: `label`, `href` (a site path such as `/writing`) and `visible` (default `true`). Unticking "Show in navigation" hides a link without deleting it. The singleton file must exist (`src/content/navigation/index.yaml`); `getNavItems` throws without it. Hobbies appears as one link (`/hobbies`); Books and Movies are reached from that page.
- `writing[].kind` is `blog | tutorial | journal | note` (default `blog`). The list at `/writing` shows the title, an outline badge with the kind and the date on one row, grouped by year, and a dropdown next to the tag links filters the list by kind. The list also shows the reading time ("3 min read"), worked out from the body at build time. The detail page shows the same badge. There is no draft flag, so every file in `src/content/writing/` is published.
- `writing[].cover` (optional image, uploaded to Cloudinary) and `writing[].coverAlt` are shown on the post right after the title and description, and the cover is the page's `og:image`. The list never shows it. Write `coverAlt` whenever there is a cover. The social preview of an uploaded cover is a 1200px-wide JPEG that Cloudinary makes, so any raster format works. A cover imported from `src/assets` needs `site` in `astro.config.mjs` (set from `VERCEL_PROJECT_PRODUCTION_URL`) and uses its own format, so use a PNG or JPEG about 1200x630. An SVG will not render on social networks.
- `writing[].tags` is a free-text list. The tag pages are derived from it: [`getWritingTags`](../src/entities/writing/api/getWritingTags.ts) groups the labels by `slugify(label)` (so `Astro` and `astro` are one tag) and `/writing/tags/[tag]` is generated for each. Tags are shown on `/writing` and the tag pages as links, never in the list rows.
- `software[]` and `hardware[]` share these fields: `name` (required), `logo` (image), `description` (what it is), `usage` (how you use it) and `link`. `hardware[]` adds `photos`, a list of `{ image, alt, ratio }` (`ratio` is an [aspect ratio](#aspect-ratios), default `1/1`). Images are uploaded to Cloudinary. Without a `logo`, the item shows the first letter of the name.
- Each `profile.socials[]` item feeds the footer and the hover cards on the home page. `platform` and `url` are required. The other fields are optional and have these fallbacks (see [`getSocialLinks`](../src/entities/profile/lib/socials.ts)):
  - `handle`: the email address, or `@` plus the last path segment of the URL.
  - `displayName`: the profile `name`.
  - `avatar`: the profile `avatar`, then initials.
  - `banner`: a plain muted block.
  - `bio` and `verified` (default `false`): shown only when set.
  - For `platform: email`, `url` is `mailto:<address>`. It renders as the address with a copy button instead of a hover card.
- Books are not a collection. `/hobbies/books` is rendered on demand from the [Hardcover](https://hardcover.app) API, so books are managed in the Hardcover app (see [`books-and-movies.md`](./books-and-movies.md#books)).
- `movies[]` is the movie library. For the step-by-step admin workflow see [`books-and-movies.md`](./books-and-movies.md). Fields: `title`, `kind`, `creator` (director or creator), `status`, `poster` (optional image, uploaded to Cloudinary; when empty the poster is fetched from the first `link` that has one, see [`shared.md`](./layers/shared.md#apiposters)), `posterRatio` (an [aspect ratio](#aspect-ratios), default `2/3`), `releaseDate`, `startedDate`, `watchedDate`, `rating` (integer 1 to 5, your own), `description` (your own words, not a synopsis) and `links`.
- `movies[].status` is `watching | watched | planned`; `movies[].kind` is `movie | series | show | anime` and shows as a badge. `/hobbies/movies` puts `watching` entries in a section on top and everything else in a "Library" grid.
- `movies[].links` are attribution links to free or open catalogues: each item is a `source` and an `id` (or the full page URL). The sources are listed in [`shared/config/media-sources.ts`](../src/shared/config/media-sources.ts): TMDB, AniList, MyAnimeList and Wikidata. To add one, add it to `mediaSourceCatalog`; the Zod schema and the Keystatic select both read from it. Dates and the rest of the details are typed in by hand. Only the poster is fetched at build time, from TMDB or AniList, and only when no `poster` is uploaded. Put the link you want the poster from first.
- Dates are coerced with `z.coerce.date()`. Display formatting is in [`src/shared/lib/date.ts`](../src/shared/lib/date.ts) and is UTC-based so a date never shifts by timezone.
- The profile avatar and the hover-card avatars and banners are uploaded to Cloudinary. A path into `src/assets/profile/` saved before uploads moved there is still accepted (see [Media on Cloudinary](#media-on-cloudinary)).

## Writing entry body

The body of a writing entry supports more than plain text. All of it is editable in the Keystatic editor and stored as Markdoc in the `.mdoc` file.

- **Images** are inserted with the **Image** component in the editor's insert menu. It uploads the file to Cloudinary and writes `{% figure src={url: "...", width: 800, height: 600} alt="..." title="Caption" /%}`. The editor's own image button is switched off, because it saves the file into the repository. The optional title is the visible figure caption under the image (not a hover tooltip), and `alt` stays the text alternative. The tag renders as a `<figure>` through `Figure.astro`, with a `srcset` so the browser picks a file by the width of the text column. Clicking it (or pressing Enter or Space with it focused) opens the full-size image in a dialog; Escape or a click outside the image closes it and returns focus. A `![alt](../../assets/writing/name.png "Caption")` line from before still renders the same way, through `astro:assets`, which needs `sharp` (a dependency); see [Media on Cloudinary](#media-on-cloudinary) for editing such a post.
- **Code blocks** are fenced blocks with a language, rendered by [Expressive Code](https://expressive-code.com) (see [`architecture.md`](./architecture.md)) with `github-light` and `github-dark` following the `.dark` class. Options go in a Markdoc annotation after the language: ` ```ts {% mark="2" ins="3" del="4" wrap=true %} `. `mark` highlights lines, `ins` and `del` colour added and removed lines (a line number or a range such as `"2-4"`; several are separated by commas), and `wrap=true` starts the block wrapped. A ` ```diff ` block colours its `+` and `-` lines without any annotation, and shell languages (`bash`, `sh`) get a terminal frame. Every block has a copy button and a wrap toggle in its corner.
- **Carousel** is `{% carousel caption="..." %}` with two or more `{% slide %}` children. Each slide holds an image and optional text, and takes an optional `ratio` (see [Aspect ratios](#aspect-ratios)). The optional `caption` is shown above the track, at the start of the row, with the previous and next buttons at its end; both line up with the text column, and the buttons move one slide at a time. The track spans the full width of the page, so it passes over the sidebar (and its table of contents) where they meet, and the first slide lines up with the text column.
- **Callout** is `{% callout type="info" title="..." %}` around any content, including other callouts. `type` is `info`, `warning`, `success`, `danger` or `good-to-know` (default `info`): each has its own icon and a faint tint of its semantic color, and good to know uses the neutral tokens. The `title` is optional. Add `collapsible=true` to let readers fold it: it starts folded, `open=true` starts it unfolded, and a collapsible callout with no title shows the name of its type. A collapsible callout is a native `<details>`, so it works without scripts.
- **Tables** are standard Markdoc tables (the editor's table button, or pipe syntax in the file). They render inside a bordered wrapper that scrolls sideways when the table is wider than the space available.
- **Width:** code blocks, images, tables and blockquotes stay on the text column, and an image fills it. The carousel does not follow the column: its track runs the full width of the page. See [`styling.md`](./styling.md).
- **Columns** is `{% columns %}` with exactly two `{% column %}` children, side by side while each column can be 16rem wide, and stacked when it cannot.
- **Math** is LaTeX, rendered with [KaTeX](https://katex.org) at build time. `{% math expression="..." /%}` is a block on its own line and `{% inlineMath expression="..." /%}` sits inside a sentence. In the editor they are the "Math block" and "Inline math" components; they show the raw LaTeX, not a rendered preview. A malformed expression renders as its source in red instead of failing the build.
- **Footnotes, video, audio and handwriting** are covered under [Footnotes](#footnotes).

The tags are declared in two places that must stay in sync: the `components` option of the `content` field in `keystatic.config.ts` (editor UI) and the `tags` map in `markdoc.config.mjs` (rendering, with `component("./src/features/writing/index.ts", "<ExportName>")`). After adding `markdoc.config.mjs` or changing it, restart `pnpm dev`; Astro does not pick up a new Markdoc config on the fly.

When writing a math tag by hand in the `.mdoc` file, double every backslash inside the attribute (`expression="\\frac{1}{3}"`): Markdoc treats a single backslash in a string as an escape and rejects it. The Keystatic editor writes the doubled form itself, so this matters only when editing the file directly.

`/writing/[slug]` renders headings with ids, and the table of contents in the sidebar (from `rail`) has one tick for each `h1`, `h2` and `h3` heading, so a post with more headings gets more ticks. A `#` heading in the body is a second `<h1>` on the page, because the title already is one; use `##` for sections unless you want that level in the contents.

## Footnotes

A footnote is two tags with the same id: a reference in the text and the footnote that holds its content.

```
It happened on a Tuesday.{% footnoteRef id="tuesday" /%}

{% footnote id="tuesday" %}
Or possibly a Wednesday. See [the diary](https://example.com).
{% /footnote %}
```

- **Numbering** follows the order of the references, not of the footnotes, and is worked out when the page is built, so the numbers are in the HTML without any script.
- **The id** is letters, digits, `-` and `_`. The build fails, naming the id, if a reference has no footnote, a footnote has no reference, or an id is used twice. Each reference needs its own footnote.
- **What a footnote can hold** is any blocks: paragraphs with bold text and links, lists, code, an image (`![alt](...)`, which opens the lightbox), and three more tags:
  - `{% video file={url: "..."} caption="..." /%}` and `{% audio file={url: "..."} caption="..." /%}` take an uploaded `file`, or a `url` that links straight to a media file when nothing is uploaded. The browser's own controls play them, and only the metadata loads until someone presses play. A tag with neither fails the build. Uploads from the editor go to Cloudinary and are served as they were uploaded, so a video is not converted: use MP4 or WebM, and mind the size limit under [Media on Cloudinary](#media-on-cloudinary). A path such as `file="/writing/clip.webm"` (a file in `public/writing/`, from before uploads moved) still works.
  - `{% handwriting %}text{% /handwriting %}` is ordinary text in a handwriting typeface (Caveat, the `hand` variant of [`Text`](./layers/shared.md#uitext)), so it stays searchable and readable by a screen reader.
  - `video`, `audio` and `handwriting` also work outside a footnote, at the width of the text.
- **Where a note shows** depends on the screen. From `rail` (1280px) it sits in the margin, level with its number (see [`styling.md`](./styling.md#writing-entry-styles)). Below that, and for anyone without scripts, it stays in the text where it was written, in a small box, so write each footnote right under the paragraph that refers to it.
- **In the margin**, hovering or focusing a number lights it and its note. Clicking a number or its note pins the note open, which moves the notes below it down; clicking again, or Escape, lets go. A note that would sit on top of the next one is clipped with a fade until it is opened, so leave a few lines of text between two notes that hold pictures or video.
- **In the editor** the pieces are the `Footnote reference` (inline) and `Footnote` components in the toolbar, plus `Video`, `Audio` and `Handwriting`. The `Footnote ID` field of both has to match.

## Aspect ratios

Some images can be cropped to a shape picked from a fixed list in [`shared/config/aspect-ratio.ts`](../src/shared/config/aspect-ratio.ts): `original` (the image's own shape), `1/1`, `4/3`, `3/2`, `16/9`, `21/9`, `3/4` and `2/3`. The keys use a slash so they stay plain strings in YAML and Markdoc attributes. The Zod `z.enum` and the Keystatic select both read the list, so adding a key to `aspectRatioCatalog` makes it available in both. The image fills the shape (`object-cover`), so it is cropped, never stretched.

- Writing carousel: `ratio` on each `{% slide %}`, default `original`.
- Hardware photos: `ratio` on each photo, default `1/1`. All photos share one height, and the width follows the ratio.
- Movie posters: `posterRatio`, default `2/3`.
- An image placed on its own in a post keeps its own shape: the **Image** component has no ratio field.
- Avatars, logos and banners are not on the list; their shape comes from the component that shows them.

## Media on Cloudinary

Every image, video and audio file the editor uploads goes to [Cloudinary](https://cloudinary.com), not into the repository, so the repository stays small and the build never downloads or resizes a picture. The entry keeps only the address:

```yaml
cover:
  url: https://res.cloudinary.com/<cloud>/image/upload/v1700000000/whoiseno/writing/photo.jpg
  width: 1600
  height: 900
```

- **Field:** `cloudAssetField` in [`src/shared/ui/cloud-asset-field/CloudAssetField.tsx`](../src/shared/ui/cloud-asset-field/CloudAssetField.tsx) replaces `fields.image` and `fields.file`. Its `kind` is `image`, `video` or `audio` (it sets the file picker and checks what Cloudinary received) and its `folder` is where the file goes, below `whoiseno/` in the Cloudinary library. An image is stored as `{ url, width, height }`, so a page can reserve its space; a video or audio file as `{ url }`.
- **Upload:** the field asks `POST /api/cloud-assets/sign` ([`src/pages/api/cloud-assets/sign.ts`](../src/pages/api/cloud-assets/sign.ts)) for a signed upload, and the browser then sends the file straight to Cloudinary. The file never passes through the site, which matters because Vercel limits a request body to 4.5 MB, and the API secret never leaves the server. The route follows the CMS's own sign-in: under `pnpm dev` (local storage) it signs for anyone who can reach the dev server, and in production only for a Keystatic Cloud account in this site's team. The admin keeps its Cloud token in the browser (`localStorage`, `keystatic-cloud-access-token`), so the field sends it in an `Authorization` header, and the route asks Keystatic Cloud whose it is (`GET https://api.keystatic.cloud/v1/info`, the call the admin makes itself) and checks that the team's slug is the first half of `cloud.project`. The token alone is not enough, because any Keystatic Cloud account can get one for a project of its own. Keystatic does not document that endpoint, so an update to Keystatic that changes it would make uploads fail with 403 until the route is adjusted.
- **Delivery:** nothing is downloaded or processed at build time. [`cloudImageUrl`](../src/shared/lib/cloud-asset.ts) adds `f_auto,q_auto,c_limit,w_<width>` to a Cloudinary URL, so Cloudinary resizes when a browser asks and caches the result in the best format the browser takes, and [`AssetImage`](./layers/shared.md#uiasset-image) turns that into `src` and `srcset`. A social preview asks for a JPEG, since networks cannot read WebP. SVG and files on any other host are served as they are. Video and audio are served as uploaded.
- **Environment:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` (see [`setup.md`](./setup.md#environment-variables)). Without them an upload fails with "Cloudinary is not set up".
- **Limits** on the free plan: 10 MB for an image (25 megapixels), 100 MB for a video, 10 MB for any other file, and 25 credits a month shared by storage, bandwidth and transformations (a credit is 1 GB of storage, 1 GB of bandwidth or 1,000 transformations). Cloudinary refuses a larger file and the field shows its message.
- **Files from before:** an entry saved before uploads moved to Cloudinary holds a path into `src/assets/` (an image) or `public/` (a video or audio file). The Zod schema accepts either form (`media()` in `content.config.ts`), `AssetImage`, `VideoClip` and `AudioClip` render either, and the field shows the path and keeps it on save until you upload a replacement. Replacing a file does not delete the old one from the repository: delete it by hand once nothing uses it.
- **Old images in a post body:** a `![]()` line still renders on the site, but the editor shows it as plain text, and saving such a post fails with "Bad data": Keystatic then tries to delete the image file as unused, and its own API refuses that path. Nothing is written. Remove the line and insert the picture again with **Image** before you save the post.

## Adding or changing a field

1. Add the field in `keystatic.config.ts`. An image, video or audio file uses `cloudAssetField`, never `fields.image` or `fields.file`.
2. Add it to the matching Zod schema in `src/content.config.ts`. An image uses `media(image)`.
3. Run `pnpm astro sync` to regenerate the collection types.
4. Use it in the entity or feature that renders the collection, then run `pnpm astro check`.

## Admin UI

Keystatic's integration injects `/keystatic` (the admin UI) and `/api/keystatic/*`. Those routes are server-rendered (`prerender: false`) while every other page stays static, apart from `/hobbies/books` (see [`books-and-movies.md`](./books-and-movies.md#books)), which is why the project uses a server adapter (Vercel in production, Node for a local preview) and why `@astrojs/react` is installed. React is used only by the Keystatic admin; site pages do not use it.

Storage is switched on `import.meta.env.PROD` in `keystatic.config.ts`:

- **Development:** `kind: "local"`. Run `pnpm dev`, open `/keystatic`, and edits are written straight to files in `src/content/`. Commit them like any other change. No environment variables are needed.
- **Production:** `kind: "cloud"`, with `cloud.project` set to `whoiseno-portfolio/whoiseno`, the team and project on [Keystatic Cloud](https://keystatic.com/docs/cloud). An editor signs in to Keystatic Cloud at `/keystatic` on the deployed site, and Keystatic Cloud saves each edit as a commit to the GitHub repository connected to that project. Vercel builds every commit, so a change is live once that build finishes.

### Keystatic Cloud

Cloud mode needs no environment variables and no GitHub App of your own: Keystatic Cloud handles the sign-in and the connection to GitHub, and the site's `/api/keystatic/*` answers 404 because nothing uses it. The free plan allows three users in a team. Images are not stored there: files go to Cloudinary (see [Media on Cloudinary](#media-on-cloudinary)), so Keystatic's own cloud image field is not used.

Setting it up, once:

1. In Keystatic Cloud, create the team and the project, and connect the project to the `whoiseno/whoiseno` repository. The project's settings page shows the `storage` and `cloud` snippet that `keystatic.config.ts` uses. If you rename the team or the project, change `cloud.project` to match.
2. Deploy the site to Vercel.
3. Open `https://<your site>/keystatic` and sign in with your Keystatic Cloud account. Make a change and save it, and check that the commit appears in the repository.

Editing needs a Keystatic Cloud account in the team, not a GitHub one.

If an upload fails with "Sign in to the CMS with a Keystatic Cloud account that is in this site's team" while you can edit and save, the route and Keystatic Cloud disagree about the team. Open the browser's network panel, find the request to `https://api.keystatic.cloud/v1/info`, and compare `team.slug` in its response with the first half of `cloud.project`. The two must be the same.

A production build (`pnpm build:node` and `pnpm preview`, see [`setup.md`](./setup.md#building-and-previewing)) uses Cloud storage too and asks you to sign in to Keystatic Cloud. Whether Keystatic Cloud accepts the `http://127.0.0.1:4321` address of a local preview as a place to sign in has not been tried.

## Dashboard grouping

`ui.navigation` in `keystatic.config.ts` groups the sidebar as Site (navigation, profile), Work (works, projects), Writing (writing), Uses (software, hardware) and Hobbies (movies).

In development, every site page has a "CMS" button in the sidebar actions that opens `/keystatic`, and the admin shows a "Back to site" link in its bottom-right corner. Both are dev-only; see [`layers/app.md`](./layers/app.md).
