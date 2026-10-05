# `src/shared`

The bottom layer: reusable, domain-agnostic building blocks with no dependency on any other layer.

```
src/shared/
├── config/
│   ├── aspect-ratio.ts    # catalogue of the shapes images can be cropped to
│   ├── media-sources.ts   # catalogue of free/open databases that books and movies link back to
│   └── site.ts            # siteName, TypeNavItem, TypeCrumb, TypeSocialLink
├── lib/
│   ├── date.ts            # formatDate, formatMonthYear, formatDateRange (UTC-based)
│   └── motion.ts          # anime.js scope helper
└── ui/
    ├── alpine.ts                   # registerUi(): registers every component's Alpine.data
    ├── accordion/                  # compound: Accordion, Item, Trigger, Content (+ alpine.ts)
    ├── avatar/Avatar.astro
    ├── badge/                      # Badge.astro, variants.ts, index.ts
    ├── breadcrumb/                 # compound: Breadcrumb, List, Item, Link, Page, Separator
    ├── button/                     # Button.astro, variants.ts, index.ts
    ├── card/                       # compound: Card, Header, Title, Description, Action, Content, Footer
    ├── copy-button/                # CopyButton.astro (+ alpine.ts)
    ├── dropdown-menu/              # compound: DropdownMenu, Trigger, Content, Item, Label, Separator
    ├── icon/                       # Icon.astro, reicons.ts, logos.ts
    ├── layouts/Root.astro          # HTML document shell
    ├── lightbox/                   # compound: Lightbox, Trigger, Content, Image, Caption, Close (+ alpine.ts)
    ├── media-item/MediaItem.astro  # poster, title, byline, rating and attribution links (books, movies)
    ├── page/                       # older slot-based layout primitives (currently unused by pages)
    ├── popover/                    # compound: Popover, Trigger, Content (+ alpine.ts)
    ├── prose/Prose.astro
    ├── rating/Rating.astro
    ├── section/Section.astro
    └── site/
        ├── SiteBreadcrumbs.astro
        ├── SiteFooter.astro
        └── SiteSidebar.astro
```

SVG sources for the tech-stack logos live outside `shared`, in `src/icons/logos/` (the directory `astro-icon` reads local icons from).

## `ui/layouts/Root.astro`

The outermost wrapper for every page: renders `<html>`/`<head>`/`<body>`, sets favicons, viewport meta, the Astro generator meta tag, and the `<title>` (`"<title> | Enoabasi Computer"`, or just the site name when no `title` prop is passed). A blocking inline script reads `localStorage.theme` (falling back to `prefers-color-scheme`) and sets the `dark` class on `<html>` before first paint. It also registers the three site fonts via Astro's `<Font />` component (names must match the `cssVariable` values in [`astro.config.mjs`](../../astro.config.mjs)) and imports the global stylesheet. The `<body>` carries the base Tailwind classes shared by every page.

## Compound components

The interactive components follow the [shadcn/ui](https://ui.shadcn.com) compound pattern, ported to Astro:

- **One `.astro` file per part** (`Card`, `CardHeader`, `CardTitle`, ...), re-exported from a barrel `index.ts`. Import from the folder: `import { Card, CardTitle } from "@/shared/ui/card"`.
- **Variants, sizes and colors** are declared with [`tailwind-variants`](https://www.tailwind-variants.org) (`tv()`) in a sibling `variants.ts`, together with a `Type*Variants` type from `VariantProps`. Class merging uses `cn` imported from `tailwind-variants`.
- **Every part carries `data-slot="..."`** and spreads the remaining props onto its root element, so callers can add `class`, `aria-*` and `x-*` attributes.
- **Interactivity is Alpine.** The root part sets `x-data="name(options)"`; child parts read the inherited scope. Each component's behavior is a typed `Alpine.data(...)` registration in its own `alpine.ts`, aggregated by `ui/alpine.ts` and called once from `app/entrypoints/alpine.ts`. Options are passed as `JSON.stringify(...)`.
- Hidden content uses `style="display: none"` plus `x-show`, so it stays hidden before Alpine starts.

| Component                                                                                                   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                                    | Props `variant` (`solid`, `outline`, `ghost`, `link`), `color` (`brand`, `primary`, `secondary`, `neutral`), `size` (`xxs` to `xxl`), `loading` (disables the button) and `href` (renders an `<a>`; external `http` links open in a new tab). Defaults: `solid`, `primary`, `md`. An `svg`-only child makes it square.                                                                                                                                                                                                                                                                   |
| `Badge`                                                                                                     | Variants `outline` and `success` (green pulsing dot).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Card`, `CardHeader`, `CardTitle`, ...                                                                      | `Card` takes `href?` and renders an `<a>` when set (external links open in a new tab with `rel="noopener noreferrer"`), otherwise a `<div>`. `CardTitle` renders an `h3`. Built with a `tv()` `slots` definition.                                                                                                                                                                                                                                                                                                                                                                        |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`                                        | `Accordion` takes `type` (`single` or `multiple`) and `defaultValue`. `AccordionItem` takes `value`. `AccordionTrigger` takes `chevron` (default `true`; pass `false` to place your own). Open state is exposed as `data-state` for `group-data-[state=open]/accordion-item:` styling.                                                                                                                                                                                                                                                                                                   |
| `Popover`, `PopoverTrigger`, `PopoverContent`                                                               | `Popover` takes `hover`, `openDelay` and `closeDelay`. Positioned with the Alpine `anchor` plugin; `PopoverContent` takes `side`, `align` and `sideOffset`. `PopoverTrigger` renders a `<button>`, or an `<a>` when given `href`.                                                                                                                                                                                                                                                                                                                                                        |
| `DropdownMenu` and parts                                                                                    | Trigger, Content, Item (`href`, `variant`, `disabled`), Label and Separator. Supports Escape to close, arrow keys, Home and End. Items close the menu on click.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `CopyButton`                                                                                                | Props `value` and `label`. Copies `value` with `navigator.clipboard.writeText` and swaps the copy icon for a check for two seconds.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Avatar`                                                                                                    | Uses `Image` from `astro:assets`; falls back to initials.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `Prose`                                                                                                     | Wrapper that applies the `[data-slot="prose"]` typography styles to rendered Markdoc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Rating`                                                                                                    | Five Reicon stars with an `aria-label`; props `value`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `MediaItem`                                                                                                 | One book, movie, series or anime. Props `title`, `byline?`, `poster?` (a placeholder with the title's first letter without one), `posterRatio?` (an `aspectRatioCatalog` key, default `2/3`), `published?`, `timeline?` (e.g. "Finished Jun 2025"), `rating?`, `description?`, `badge?`, `links?` (`{ name, href }[]`, shown as external attribution links) and `layout` (`card` stacks the poster on top, `row` puts it beside the text).                                                                                                                                               |
| `Section`                                                                                                   | Props `title`, `href?`, `hrefLabel="View all"`. A titled block with an optional "View all" link.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` | A `<nav aria-label="Breadcrumb">` with an `<ol>`. `BreadcrumbPage` is the current page (`aria-current="page"`, no link); `BreadcrumbSeparator` is a hidden `<li>` with a chevron, or whatever its slot holds. Purely static markup, no Alpine.                                                                                                                                                                                                                                                                                                                                           |
| `Lightbox`, `LightboxTrigger`, `LightboxContent`, `LightboxImage`, `LightboxCaption`, `LightboxClose`       | Opens an image in a native `<dialog>`, so the focus trap, Escape to close and focus return to the trigger come from the browser. `LightboxTrigger` is a `<button>` (Enter and Space work), `LightboxContent` takes `label` for the dialog's accessible name, and clicking the backdrop closes it. For performance, `LightboxImage` takes the full-size `src` as `data-src` and sets the real `src` only on the first focus, hover or open, so a page never downloads images nobody opens. `html` scroll is locked with `html:has([data-slot="lightbox-content"][open])` in `global.css`. |
| `SiteSidebar`                                                                                               | Sticky navigation. From `md` a 14rem full-height rail with the site name, the links, a `toc` slot and an `actions` slot at the bottom; below `md` a top bar with a menu button (`x-show` with `x-cloak`). The active link gets `aria-current="page"`; with `crumbs`, the steps after the first nest under the link the trail starts from. Props `items`, `owner`, `avatar?`, `crumbs?`.                                                                                                                                                                                                  |
| `SiteBreadcrumbs`                                                                                           | Renders a `TypeCrumb[]` with the breadcrumb parts above. A crumb with an `href` is a link, the one without is the current page. Prop `crumbs`.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `SiteFooter`                                                                                                | "Let's be friends" heading and a two-column (three from `sm`) grid of socials, each with the platform, an arrow and the handle. The email cell shows the address with a `CopyButton`. Props `name`, `socials`.                                                                                                                                                                                                                                                                                                                                                                           |

## `ui/icon`

`Icon.astro` is the single entry point for icons. It wraps `astro-icon` and [Reicon](https://reicon.dev/docs/astro) behind one prefixed `name`:

| Name                  | Source                                                     | Use for                                         |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `reicon:ArrowUpRight` | `reicons.ts`, a curated set imported by path               | UI glyphs (arrows, chevrons, copy, check, menu) |
| `logo:astro`          | SVGL files in `src/icons/logos/`, catalogued in `logos.ts` | Tech-stack logos                                |
| `ph:github-logo`      | Phosphor through `astro-icon` (`@iconify-json/ph`)         | Brand marks Reicon does not have                |

- An unknown name throws at build time, so a typo cannot silently render nothing.
- `size` defaults to `"1em"`, so an icon scales with the surrounding text. Reicon accepts `weight` (`Filled` or `Outline`).
- Logos with `themed: true` ship separate `-light` and `-dark` SVGs. `Icon` renders both and switches with `dark:hidden` and `hidden dark:block`.
- **Add a Reicon:** import it by path in `reicons.ts` (`reicon-astro/icons/<Name>.astro`) and add it to the `reicons` object. Do not import from the package barrel: it pulls in about 2,700 components and slows the dev server.
- **Add a logo:** drop the SVG from [svgl.app](https://svgl.app) into `src/icons/logos/` (as `<slug>.svg`, or `<slug>-light.svg` and `<slug>-dark.svg` for themed logos) and add an entry to `logoCatalog` in `logos.ts`. `logos.ts` imports no `.astro` files, so `content.config.ts` and `keystatic.config.ts` can import `logoNames` from it for the works `technologies` field.
- Logos are trademarks of their owners. Alpine.js and Keystatic have no SVGL logo, so none is included.

## `ui/page/*`

The earlier slot-based layout primitives (`Page`, `PageContainer`, `PageHeader`, `PageTitle`, `PageDescription`, `PageContent`, `PageFooter`). No page uses them since the site shell moved to `app/layouts/Site.astro`; they are kept because they were not part of this change. Per-component docs and examples are in [`docs/components/`](../components/README.md).

## `lib/`

- `date.ts`: `formatDate(date)` (`"3 Apr 2026"`), `formatMonthYear(date, style?)` and `formatDateRange(start, end?, style?)` (`"Jan 2024 - Present"`), formatted with `Intl.DateTimeFormat` in UTC so a date never shifts by timezone.
- `slug.ts`: `slugify(text)` turns a tag label into its URL slug (used by `getWritingTags` and `WritingList`).
- `motion.ts`: wraps anime.js's `createScope` so every animation checks `prefers-reduced-motion` consistently. See [`docs/animations.md`](../animations.md).

## `config/site.ts`

Holds the site name (`"Enoabasi Computer"`, also the `<title>` suffix) and the `TypeNavItem`, `TypeCrumb` and `TypeSocialLink` types. The navigation links are not here: they are content, edited in the Navigation singleton and read by `entities/navigation` (see [`content.md`](../content.md)). `TypeSocialLink` carries everything the footer and the hover cards need (`handle`, `email?`, `actionLabel?`, `displayName`, `bio?`, `avatar?`, `banner?`, `verified`).

## `config/aspect-ratio.ts`

`aspectRatioCatalog` maps each key (`original`, `1/1`, `4/3`, `3/2`, `16/9`, `21/9`, `3/4`, `2/3`) to a `label` for the CMS and a numeric `ratio` (width divided by height, or `null` for `original`). `aspectRatioNames` (the keys) feeds the Zod `z.enum` in `content.config.ts` and the Keystatic select in `keystatic.config.ts` (through its `aspectRatioField` helper); `TypeAspectRatioName` is the key type. The Markdoc `slide` attribute is declared as a plain string in `markdoc.config.mjs`, so a key typed by hand in a `.mdoc` file that is not on the list fails when `Slide` renders. Components turn the number into a CSS `aspect-ratio` plus `object-cover` and, for processed images, into pixel `width` and `height` for `Image`. Where each field lives is in [`content.md`](../content.md#aspect-ratios).

## `config/media-sources.ts`

`mediaSourceCatalog` lists the free or open databases an entry can credit: Open Library (work ID or ISBN), Google Books, Hardcover, TMDB (movie or TV), IMDb, AniList, MyAnimeList and Wikidata. Each source has a public `name` (the link text), a CMS `label` that says which ID to paste, the media kinds it applies to (`book`, `movie`) and a `url(id)` builder.

- `mediaSourceNames(kind)` returns the source keys valid for a kind. `content.config.ts` uses it for the Zod `z.enum` and `keystatic.config.ts` for the select options, so adding a source to the catalogue makes it available in both.
- `resolveMediaLink(source, id)` builds the `{ name, href }` attribution link. A full `http(s)` URL pasted as the `id` is used unchanged, and any other value is URL-encoded into the source's template.
- The catalogue only builds links; nothing is fetched from these services, so no API keys are involved. Poster images are uploaded by hand, which also avoids hotlinking.

## Conventions

- Nothing in `shared` may import from `app`, `pages`, `features`, or `entities`.
- Components here stay generic. Anything that knows about a profile, work or book belongs in `entities` or `features`.
- Name types and interfaces with a `Type` prefix, and import types with the `type` keyword.
