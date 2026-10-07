# `src/shared`

The bottom layer: reusable, domain-agnostic building blocks with no dependency on any other layer.

`shared` has no slices, only segments (`ui`, `lib`, `config`, `api`). Each component or helper group has its own `index.ts` (or is a single file module) instead of one index for the whole segment, so you import `@/shared/ui/icon`, never `@/shared/ui`.

```
src/shared/
├── api/
│   ├── hardcover/
│   │   ├── cache.ts       # cached(key, ttl, load): in-memory TTL cache with request sharing and stale-on-error
│   │   ├── client.ts      # hardcover(query, variables): the authenticated GraphQL call
│   │   └── index.ts
│   ├── placeholders/
│   │   └── index.ts       # getPlaceholder(url): a tiny inline preview of a remote image, to blur while it loads
│   └── posters/
│       ├── index.ts       # resolvePoster(links): the first poster a link's catalogue can supply
│       └── providers.ts   # one fetcher per source (TMDB, AniList)
├── config/
│   ├── aspect-ratio.ts    # catalogue of the shapes images can be cropped to
│   ├── logos.ts           # catalogue of the SVGL tech-stack logos (logoCatalog, logoNames)
│   └── media-sources.ts   # catalogue of free/open databases that movies link back to
├── lib/
│   ├── date.ts            # formatDate, formatMonthYear, formatDateRange (UTC-based)
│   ├── motion.ts          # anime.js scope helper
│   ├── slug.ts            # slugify
│   ├── sound.ts           # initSound, isSoundOn, setSoundOn: Cuelume's volume, listeners and the saved on/off choice
│   └── tailwind.ts        # cn and tv: tailwind-variants set up with the Utopia token names
└── ui/
    ├── alpine.ts                   # registerUi(): registers every component's Alpine.data
    ├── accordion/                  # compound: Accordion, Item, Trigger, Content (+ alpine.ts)
    ├── avatar/                     # Avatar.astro, index.ts
    ├── badge/                      # Badge.astro, variants.ts, index.ts
    ├── breadcrumb/                 # compound: Breadcrumb, List, Item, Link, Page, Separator
    ├── button/                     # Button.astro, variants.ts, index.ts
    ├── card/                       # compound: Card, Header, Title, Description, Action, Content, Footer
    ├── carousel/                   # compound: Carousel, Content, Item, Previous, Next (+ alpine.ts)
    ├── copy-button/                # CopyButton.astro (+ alpine.ts)
    ├── dropdown-menu/              # compound: DropdownMenu, Trigger, Content, Item, Label, Separator
    ├── icon/                       # Icon.astro, reicons.ts, index.ts
    ├── lightbox/                   # compound: Lightbox, Trigger, Content, Image, Caption, Close (+ alpine.ts)
    ├── media-item/                 # compound: MediaItem, Poster, Content, Header, Title, Byline, Meta, Timeline, Description, Links, Link
    ├── page/                       # older slot-based layout primitives (currently unused by pages)
    ├── pagination/                 # Pagination.astro, index.ts
    ├── popover/                    # compound: Popover, Trigger, Content (+ alpine.ts)
    ├── prose/                      # Prose.astro, index.ts
    ├── rating/                     # Rating.astro, index.ts
    ├── section/                    # Section.astro, index.ts
    ├── text/                       # Text.astro, variants.ts, index.ts
    └── tooltip/                    # compound: Tooltip, Trigger, Content (+ alpine.ts)
```

The document shell (`Root`) and the site chrome (`Site`, `SiteSidebar`, `SiteBreadcrumbs`, `SiteFooter`) are not here. They know about the navigation and the profile, so they live in [`app/ui`](./app.md). The SVG sources for the tech-stack logos are static assets and live in `src/assets/icons/logos/`.

## Compound components

The interactive components follow the [shadcn/ui](https://ui.shadcn.com) compound pattern, ported to Astro:

- **One `.astro` file per part** (`Card`, `CardHeader`, `CardTitle`, ...), re-exported from a barrel `index.ts`. Import from the folder: `import { Card, CardTitle } from "@/shared/ui/card"`.
- **Variants, sizes and colors** are declared with [`tailwind-variants`](https://www.tailwind-variants.org) (`tv()`) in a sibling `variants.ts`, together with a `Type*Variants` type from `VariantProps`. `tv` and `cn` are imported from `@/shared/lib/tailwind`, not from `tailwind-variants`: that wrapper knows the Utopia token names, which tailwind-merge needs to resolve conflicts (see [`styling.md`](../styling.md#fluid-type-and-space-utopia)).
- **Every part carries `data-slot="..."`** and spreads the remaining props onto its root element, so callers can add `class`, `aria-*` and `x-*` attributes.
- **Interactivity is Alpine.** The root part sets `x-data="name(options)"`; child parts read the inherited scope. Each component's behavior is a typed `Alpine.data(...)` registration in its own `alpine.ts`, aggregated by `ui/alpine.ts` and called once from `app/config/alpine.ts`. Options are passed as `JSON.stringify(...)`.
- Hidden content uses `style="display: none"` plus `x-show`, so it stays hidden before Alpine starts.

| Component                                                                                                   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                                    | Props `variant` (`solid`, `outline`, `ghost`, `link`), `color` (`brand`, `primary`, `secondary`, `neutral`), `size` (`xxs` to `xxl`), `loading` (disables the button) and `href` (renders an `<a>`; external `http` links open in a new tab). Defaults: `solid`, `primary`, `md`. An `svg`-only child makes it square. It carries `data-cuelume-tap` (an `<a>` carries `data-cuelume-navigate`) and `data-cuelume-hover="select"`, which [Cuelume](../architecture.md) turns into a click sound and a hover sound; see [Sound](#sound).                                                  |
| `Badge`                                                                                                     | Variants `outline` and `success` (green pulsing dot).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Card`, `CardHeader`, `CardTitle`, ...                                                                      | `Card` takes `href?` and renders an `<a>` when set (external links open in a new tab with `rel="noopener noreferrer"`), otherwise a `<div>`. `CardTitle` renders an `h3`. Built with a `tv()` `slots` definition.                                                                                                                                                                                                                                                                                                                                                                        |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`                                        | `Accordion` takes `type` (`single` or `multiple`) and `defaultValue`. `AccordionItem` takes `value`. `AccordionTrigger` takes `chevron` (default `true`; pass `false` to place your own). Open state is exposed as `data-state` for `group-data-[state=open]/accordion-item:` styling.                                                                                                                                                                                                                                                                                                   |
| `Popover`, `PopoverTrigger`, `PopoverContent`                                                               | `Popover` takes `hover`, `openDelay` and `closeDelay`. Positioned with the Alpine `anchor` plugin; `PopoverContent` takes `side`, `align` and `sideOffset`. `PopoverTrigger` renders a `<button>`, or an `<a>` when given `href`.                                                                                                                                                                                                                                                                                                                                                        |
| `DropdownMenu` and parts                                                                                    | Trigger, Content, Item (`href`, `variant`, `disabled`), Label and Separator. Supports Escape to close, arrow keys, Home and End. Items close the menu on click.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `CopyButton`                                                                                                | Props `value` and `label`. Copies `value` with `navigator.clipboard.writeText` and swaps the copy icon for a check for two seconds.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Avatar`                                                                                                    | Uses `Image` from `astro:assets`; falls back to initials.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `Prose`                                                                                                     | Wrapper that applies the `[data-slot="prose"]` typography styles to rendered Markdoc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Rating`                                                                                                    | A pill on a muted background reading "4/5" followed by one filled star in the `rating` color, with an `aria-label`; props `value`.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `MediaItem`, `MediaItemPoster`, `MediaItemContent`, ...                                                     | One book, movie, series or anime: a poster beside or above a text column. See [`ui/media-item`](#uimedia-item).                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `Pagination`                                                                                                | Previous and Next buttons around "Page 2 of 5". Props `page`, `pageCount` and `href(page)`, which builds the URL of a page. Renders nothing when there is only one page, and disables the button at either end. The pages are plain links, so it works without JavaScript.                                                                                                                                                                                                                                                                                                               |
| `Section`                                                                                                   | Props `title`, `href?`, `hrefLabel="View all"`. A titled block with an optional "View all" link.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Text`, `textVariants`                                                                                      | Every typographic role on the site. Props `variant` (default `body`), `tone` (`default`, `muted`, `faint`) and `as` (`h1` to `h4`, `p`, `span`, `div`, `time`, `figcaption`; each variant has a default element). Sizes are the fluid Utopia steps. `textVariants({ variant, tone })` gives the same classes as a string. See [`ui/text`](#uitext).                                                                                                                                                                                                                                      |
| `Tooltip`, `TooltipTrigger`, `TooltipContent`                                                               | `Tooltip` takes `delayDuration`; `TooltipContent` takes `side`, `align` and `sideOffset`. A small label on hover or keyboard focus; see [`ui/tooltip`](#uitooltip).                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`                           | A scroll-snap strip with previous and next buttons. See [`ui/carousel`](#uicarousel).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` | A `<nav aria-label="Breadcrumb">` with an `<ol>`. `BreadcrumbPage` is the current page (`aria-current="page"`, no link); `BreadcrumbSeparator` is a hidden `<li>` with a chevron, or whatever its slot holds. Purely static markup, no Alpine.                                                                                                                                                                                                                                                                                                                                           |
| `Lightbox`, `LightboxTrigger`, `LightboxContent`, `LightboxImage`, `LightboxCaption`, `LightboxClose`       | Opens an image in a native `<dialog>`, so the focus trap, Escape to close and focus return to the trigger come from the browser. `LightboxTrigger` is a `<button>` (Enter and Space work), `LightboxContent` takes `label` for the dialog's accessible name, and clicking the backdrop closes it. For performance, `LightboxImage` takes the full-size `src` as `data-src` and sets the real `src` only on the first focus, hover or open, so a page never downloads images nobody opens. `html` scroll is locked with `html:has([data-slot="lightbox-content"][open])` in `global.css`. |

## Building a compound component

Follow these steps for every new component with more than one moving part, and when you rework one that is a single big file.

1. **Look it up in [shadcn/ui](https://ui.shadcn.com/docs/components) first.** Take its part names, nesting and prop names (Tooltip is `Tooltip`, `TooltipTrigger` and `TooltipContent`, with `side`, `sideOffset`, `align` and `delayDuration`). Where shadcn leans on React (`asChild`, providers, portals), port the idea to Astro and Alpine, and write the difference down in the component's section, as [`ui/tooltip`](#uitooltip) does.
2. **Split by responsibility, one part per file.** The root holds the scope (`x-data`, `x-id`) and the layout wrapper. The trigger is what the visitor interacts with: it owns the events and the ARIA wiring for the control. The content is what appears: its role, placement and transition. A component that both reacts to the visitor and renders what appears is a god component, so split it.
3. **Break out the items.** A component that holds a list of things (accordion items, menu items, breadcrumb items, a toolbar's actions) gets an item part, instead of taking an array prop or writing each item inline. Callers compose the items in markup. This applies to `features`, `entities` and `app` components too: `SiteSidebar` maps the navigation onto `SidebarMenuItem`s, `WritingList` maps entries onto `WritingListItem`s and `MovieList` renders a `MovieItem` per entry.
4. **Keep state in the root.** Behavior is one typed `Alpine.data(...)` in the component's `alpine.ts`, set on the root part, and it holds state and the methods that change it only. Parts read the inherited scope and refs (`x-ref="trigger"`, `$refs.trigger`), and each event handler lives on the part that receives the event.
5. **Follow the conventions above:** `data-slot` on every part, `class` and the remaining props spread onto the part's element, variants in `variants.ts` when there are any, and `cn` and `tv` from `@/shared/lib/tailwind`. A part built on another component cannot rename it by spreading `data-slot` onto it when that component renders a literal element (`Button`, `Card`): the HTML gets two `data-slot` attributes and the browser keeps the first. `Button` therefore takes `data-slot` as a prop (`CarouselNext` and `SidebarTrigger` use it), `Text` is polymorphic and merges, and a part built on `Card` keeps `card`.
6. **Compose it where it is used.** Keep the parts generic and let the caller assemble them. When a Markdoc tag or a page needs the whole thing at once, add one composed component for it, as `Figure` does with the lightbox parts: the `Carousel` tag renderer in `features/writing` assembles `shared/ui/carousel`, `WritingToc` assembles its `toc/` parts and `SiteSidebar` assembles `app/ui/sidebar`.
7. **Wire it in:** export the parts from the folder's `index.ts`, call the registration from `ui/alpine.ts`, and add a row for the parts to the table above. Give the component its own section only when it has behavior that needs explaining, and keep table rows short: Prettier pads every row of a table to its longest cell, so one long cell turns the whole table into a diff.

## `ui/icon`

`Icon.astro` is the single entry point for icons (`import { Icon } from "@/shared/ui/icon"`). It wraps `astro-icon` and [Reicon](https://reicon.dev/docs/astro) behind one prefixed `name`:

| Name                  | Source                                                                  | Use for                                         |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `reicon:ArrowUpRight` | `reicons.ts`, a curated set imported by path                            | UI glyphs (arrows, chevrons, copy, check, menu) |
| `logo:astro`          | SVG files in `src/assets/icons/logos/`, catalogued in `config/logos.ts` | Tech-stack and social logos                     |
| `ph:github-logo`      | Phosphor through `astro-icon` (`@iconify-json/ph`)                      | Glyphs Reicon does not have (none used today)   |

- An unknown name throws at build time, so a typo cannot silently render nothing.
- `size` defaults to `"1em"`, so an icon scales with the surrounding text. Reicon accepts `weight` (`Filled` or `Outline`).
- Logos with `themed: true` ship separate `-light` and `-dark` SVGs. `Icon` renders both and switches with `dark:hidden` and `hidden dark:block`.
- The tech-stack logos come from SVGL. The social logos `instagram`, `linkedin`, `x` (themed) and `youtube` are hand-drawn approximations; replace them with the official files under the same names in `src/assets/icons/logos/`. Every entry in `logoCatalog` is also selectable as a technology on a work in Keystatic, social logos included.
- **Add a Reicon:** import it by path in `reicons.ts` (`reicon-astro/icons/<Name>.astro`) and add it to the `reicons` object. Do not import from the package barrel: it pulls in about 2,700 components and slows the dev server.
- **Add a logo:** drop the SVG from [svgl.app](https://svgl.app) into `src/assets/icons/logos/` (as `<slug>.svg`, or `<slug>-light.svg` and `<slug>-dark.svg` for themed logos) and add an entry to `logoCatalog` in `src/shared/config/logos.ts`. `astro.config.mjs` passes `iconDir: "src/assets/icons"` to `astro-icon`, which is why the files sit under `assets/icons/` and are named `logos/<slug>` internally. `logos.ts` imports no `.astro` files, so `content.config.ts` and `keystatic.config.ts` can import `logoNames` from it for the works `technologies` field.
- Logos are trademarks of their owners. Alpine.js has no SVGL logo, so none is included. The Keystatic logo is the brand mark from the Keystatic admin (`@keystatic/core`), saved as `keystatic.svg` and drawn in `currentColor` so it follows the text color; it is the icon of the dev-only CMS button.

## Sound

Button sounds come from [Cuelume](https://github.com/danielwh2/cuelume) (`cuelume` in `package.json`), which synthesizes them with the Web Audio API, so there are no audio files. `Root.astro` calls `initSound()` from [`lib/sound.ts`](#lib) once in a `<script>`; from then on one delegated listener per event reads the `data-cuelume-*` attributes, so elements added later work without rescanning. `Button`, `AccordionTrigger`, `CopyButton`, `DropdownMenuTrigger` and `LightboxClose` set `data-cuelume-tap` (a `Button` rendered as a link sets `data-cuelume-navigate`) for the click and `data-cuelume-hover="select"` for the hover. Only buttons make sounds: a plain link is silent, on hover and on click.

The master volume is `VOLUME` in `lib/sound.ts` (0.4, so a cue is 40% as loud as Cuelume plays it by default; raise or lower that one number). Visitors can turn sound off with the `SoundToggle` at the bottom of the sidebar actions (see [`features.md`](./features.md)), and `initSound()` applies their saved choice before the first cue. The hover cue on a fine mouse only is Cuelume's own rule: touch pointers get click sounds but no hover. Cuelume does not follow `prefers-reduced-motion` (it treats that setting as being about motion), so the toggle is how a visitor opts out.

`data-cuelume-hover` is marked deprecated in Cuelume 0.2 and is to be removed in 1.0. It plays the `select` cue, which the attribute names explicitly here, at most every 150ms, and not again when the pointer moves between children. `package.json` allows `^0.2.4`, which stays within 0.2.x. If a later version drops the attribute, replace it with a delegated `pointerover` listener that calls `play("select")`.

## `ui/text`

`Text` is the one place type is defined (`import { Text } from "@/shared/ui/text"`). It renders an element with the classes of a `variant` and a `tone`, and spreads the remaining props onto it, so `<Text as="time" datetime={...}>` is typed for a `time`. Sizes are the fluid Utopia steps (see [`styling.md`](../styling.md#fluid-type-and-space-utopia)).

| Variant      | Step | Look                             | Default element |
| ------------ | ---- | -------------------------------- | --------------- |
| `display`    | 4    | serif, semibold                  | `p`             |
| `title`      | 3    | serif, bold                      | `h1`            |
| `heading`    | 2    | serif, semibold                  | `h2`            |
| `subheading` | 1    | serif, semibold                  | `h3`            |
| `lead`       | 1    | regular                          | `p`             |
| `body`       | 0    | regular                          | `p`             |
| `label`      | 0    | medium                           | `span`          |
| `small`      | -1   | regular                          | `p`             |
| `overline`   | -1   | medium, uppercase, wide tracking | `p`             |
| `mono`       | -1   | monospace                        | `span`          |
| `hand`       | 1    | handwriting font (Caveat)        | `p`             |

- `tone` sets the colour: `default` inherits, `muted` is `text-muted-foreground`, `faint` is the same colour at 70%.
- Pass `as` when the element matters more than the look (a card's `h3`, a `time`, a `figcaption`, an `h4`). Pass `class` for layout (`flex gap-2xs`, `truncate`) or a one-off change: a clash resolves in favour of the caller, so `class="font-normal"` beats the weight of a variant.
- `textVariants({ variant, tone })` returns the same classes as a string, for an element that holds more than text (the initials tile of an `Avatar`, the empty cover of a `MediaItemPoster`).
- Use a bare `text-step-*` class only on a container that hands its size to its children, such as a `ul`.
- `title`, `heading` and `subheading` are repeated as the `h1` to `h3` of `Prose` in `global.css`, because Markdoc renders those headings. Change them together.

## `ui/tooltip`

Modeled on [shadcn/ui's Tooltip](https://ui.shadcn.com/docs/components/tooltip) (`Tooltip`, `TooltipTrigger`, `TooltipContent`), with the same prop names. Each part has one job:

- `Tooltip` is the root. It owns the state (`Alpine.data("tooltip")` in `alpine.ts`: `shown`, `enter()` and `leave()`) and the ids (`x-id`), and renders an inline-flex `span`. Its `delayDuration` (milliseconds, default 350) is how long the pointer or focus has to stay before the content shows. `class` goes here, because this `span` is the layout item when a tooltip sits in a grid, so a class that hides the control has to be passed to `Tooltip` and not to the control.
- `TooltipTrigger` wraps the one control the tooltip is about and decides when to show it. A mouse pointer entering calls `enter()`; leaving, blur and a click call `leave()`. A touch pointer never opens it, and keyboard focus counts only when it is `:focus-visible`, so a click that leaves focus on a button does not pin the tooltip open. It also sets `aria-describedby` on the control, pointing at the content, so a screen reader reads the tooltip after the control's name (the control keeps its own `aria-label`). It is the `x-ref="trigger"` the content is placed against.
- `TooltipContent` is the label (the slot). It renders `role="tooltip"` in `bg-foreground text-background`, is `pointer-events-none`, wraps at 14rem, fades in with `x-show="shown"` and closes on Escape. `side` (`top`, `right`, `bottom` or `left`, default `top`), `align` and `sideOffset` (default 6) work as in shadcn and in `PopoverContent`.

```astro
<Tooltip>
  <TooltipTrigger>
    <Button
      aria-label="Toggle theme"
      ...
    />
  </TooltipTrigger>
  <TooltipContent>Switch between the light and dark theme</TooltipContent>
</Tooltip>
```

The Alpine `anchor` plugin places the content, flipping it to the opposite side when there is no room (a tooltip above a button at the top of the screen opens below it) and shifting it along the edge to stay inside the viewport.

Where it differs from shadcn: there is no `TooltipProvider`, so the delay is set on each `Tooltip` and moving between two tooltips does not skip it; and there is no `asChild`, so `TooltipTrigger` wraps its child in a `span` instead of merging its props into it.

## `ui/carousel`

Modeled on [shadcn/ui's Carousel](https://ui.shadcn.com/docs/components/carousel) (`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`), without Embla: the strip is a native scroll-snap container. Each part has one job:

- `Carousel` is the root `<figure>` (`aria-roledescription="carousel"`). It owns the state (`Alpine.data("carousel")` in `alpine.ts`: `canPrev`, `canNext`, `update()` and `go(direction)`), and refreshes it on window resize. It has no styles of its own, so the caller adds the ones it needs through `class`.
- `CarouselContent` is the track: a focusable `region` (`x-ref="track"`) that scrolls horizontally, snaps and hides its scrollbar, and calls `update()` on scroll. Anything that ties it to a page layout (the writing carousel breaks out to the full page width with `class`) comes from the caller, so the part knows nothing about `Site`.
- `CarouselItem` is one slide (`role="group"`, `aria-roledescription="slide"`, `snap-start shrink-0`). Its width comes from the caller.
- `CarouselPrevious` and `CarouselNext` are round outline `Button`s. They are disabled while `canPrev` or `canNext` is false, and `go()` scrolls to the previous or next slide, measuring slide offsets against the root's left edge. They sit anywhere inside the `Carousel`, so the caller decides where the controls go.

There is no `orientation`, no `opts` and no API object. The writing `Carousel` and `Slide` tag renderers assemble these parts (see [`features.md`](./features.md)).

## `ui/media-item`

One book, movie, series or anime. shadcn/ui has no media object of its own; its closest is [`Item`](https://ui.shadcn.com/docs/components/item) (`Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`), so the parts follow it, with a poster as the media. Callers compose them (`MovieItem` in `features/movies` and `BookItem` in `features/books`) and decide which to leave out.

- `MediaItem` is the root `<article>`. Its `layout` is `card` (poster on top, the default) or `row` (poster beside the text) and is exposed as `data-layout`; `MediaItemPoster` reads it with `group-data-[layout=row]/media-item:`.
- `MediaItemPoster` takes `title` (the letter on the tile and the link's accessible name), `src` (an imported image, or the URL of a remote cover; a tile with the first letter without one), `ratio` (an `aspectRatioCatalog` key, default `2/3`; a remote cover has no size of its own, so `original` falls back to `2/3` for it), `width` (the size in CSS pixels the image is requested at, default 200; `densities` adds the 2x and 3x files, and the callers pass 112 in a `row`) and `href` (makes the poster a link that opens in a new tab). A remote cover fades in over a blurred inline preview (see [`api/placeholders`](#apiplaceholders)). Posters do not scale on hover.
- `MediaItemContent` is the text column. `MediaItemHeader` holds `MediaItemTitle` (an `h3`) and `MediaItemByline` (author, director or creator). `MediaItemMeta` is the row for a `Badge` and the release date as a `<time>`; the `Rating` goes in the column as it is. `MediaItemTimeline` is where the owner is with it ("Finished Jun 2025"), `MediaItemDescription` is the owner's own words, faint and in quotation marks (the part adds the marks), and `MediaItemLinks` holds a `MediaItemLink` per attribution link (external, with an arrow).

## `ui/page/*`

The earlier slot-based layout primitives (`Page`, `PageContainer`, `PageHeader`, `PageTitle`, `PageDescription`, `PageContent`, `PageFooter`). No page uses them since the site shell moved to `app/ui/Site.astro`; they are kept because they were not part of this change. `page/index.ts` exports all seven. Per-component docs and examples are in [`docs/components/`](../components/README.md).

## `lib/`

- `date.ts`: `formatDate(date)` (`"3 Apr 2026"`), `formatMonthYear(date, style?)` and `formatDateRange(start, end?, style?)` (`"Jan 2024 - Present"`), formatted with `Intl.DateTimeFormat` in UTC so a date never shifts by timezone.
- `slug.ts`: `slugify(text)` turns a tag label into its URL slug (used by `getWritingTags` and `WritingList`).
- `tailwind.ts`: `cn` and `tv`, `tailwind-variants` set up with the names of the Utopia tokens (`text-step-*` and the space steps) so that tailwind-merge resolves them. Import them from here, never from `tailwind-variants`. Its name lists have to match `src/app/styles/utopia.css`.
- `sound.ts`: the one place that configures [Cuelume](#sound): `initSound()` (called once from `Root.astro`) sets the master volume and the saved on/off choice and starts the listeners, `isSoundOn()` reads the choice and `setSoundOn(on)` applies and saves it.
- `motion.ts`: wraps anime.js's `createScope` so every animation checks `prefers-reduced-motion` consistently. See [`docs/animations.md`](../animations.md).

## `config/logos.ts`

`logoCatalog` maps each logo slug (`astro`, `typescript`, ...) to its `label` and whether it ships separate light and dark SVGs (`themed`). `logoNames` (the keys) feeds the Zod `z.enum` in `content.config.ts` and the Keystatic multiselect in `keystatic.config.ts`; `TypeLogoName` is the key type. `Icon` reads the catalogue to resolve `logo:<slug>`. See [`ui/icon`](#uiicon) for adding a logo.

## `config/aspect-ratio.ts`

`aspectRatioCatalog` maps each key (`original`, `1/1`, `4/3`, `3/2`, `16/9`, `21/9`, `3/4`, `2/3`) to a `label` for the CMS and a numeric `ratio` (width divided by height, or `null` for `original`). `aspectRatioNames` (the keys) feeds the Zod `z.enum` in `content.config.ts` and the Keystatic select in `keystatic.config.ts` (through its `aspectRatioField` helper); `TypeAspectRatioName` is the key type. The Markdoc `slide` attribute is declared as a plain string in `markdoc.config.mjs`, so a key typed by hand in a `.mdoc` file that is not on the list fails when `Slide` renders. Components turn the number into a CSS `aspect-ratio` plus `object-cover` and, for processed images, into pixel `width` and `height` for `Image`. Where each field lives is in [`content.md`](../content.md#aspect-ratios).

## `config/media-sources.ts`

`mediaSourceCatalog` lists the free or open databases a movie entry can credit: TMDB (movie or TV), AniList, MyAnimeList and Wikidata. IMDb is not on the list: it is no longer free to use, so TMDB is the source for films and series. Books are not here, since they come from Hardcover (see [`api/hardcover`](#apihardcover)). Each source has a public `name` (the link text), a CMS `label` that says which ID to paste, the media kinds it applies to (only `movie` today, which is what `mediaSourceNames(kind)` filters on) and a `url(id)` builder.

- `mediaSourceNames(kind)` returns the source keys valid for a kind. `content.config.ts` uses it for the Zod `z.enum` and `keystatic.config.ts` for the select options, so adding a source to the catalogue makes it available in both.
- `resolveMediaLink(source, id)` builds the `{ name, href }` attribution link. A full `http(s)` URL pasted as the `id` is used unchanged, and any other value is URL-encoded into the source's template.
- The catalogue only builds links. Posters are fetched separately, by [`api/posters`](#apiposters).

## `api/posters`

`resolvePoster(links)` takes an entry's `links` and returns the URL of the first poster it can find, or `null`. `MovieList` calls it only when the entry has no uploaded `poster`, so the order is: uploaded image, then the first link that yields a poster (in the order the links are listed), then the initial-letter tile. It runs at build time, so a visitor's browser never calls these services, and `MediaItem` passes the URL to `Image`, which downloads, optimizes and self-hosts the poster.

| Source                   | Where the poster comes from                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `tmdb-movie`, `tmdb-tv`  | `poster_path` from TMDB through the [`@lorenzopant/tmdb`](https://tmdb.lorenzopant.dev) wrapper, served from `image.tmdb.org` |
| `anilist`, `myanimelist` | AniList's GraphQL `coverImage` (MyAnimeList IDs are looked up through AniList's `idMal`)                                      |

`wikidata` has no provider (no key-free poster source), so it stays link-only.

- A lookup that fails never fails the build. It logs `[posters] <source> <id>: <reason>` and falls through to the next link. Each request has a 10 second limit, and the URL is checked with a `HEAD` request before it is used, because a dead remote image would otherwise fail `astro build`.
- A link whose `id` is a pasted URL is skipped, since there is no ID to look up.
- Hits are cached per source and ID for the life of the process. Misses are not, so in dev a provider that was down is asked again on the next request.
- TMDB needs the `TMDB_TOKEN` secret (see [`setup.md`](../setup.md#environment-variables)). Without it TMDB entries fall back to the tile and the build still passes.
- The hosts are allowed in `image.domains` in `astro.config.mjs` (`image.tmdb.org`, `s4.anilist.co` and `assets.hardcover.app`). A new provider needs its image host added there, and so does every host its image redirects through, because Astro checks each hop. A host in `remotePatterns` such as `**.example.com` does not match the bare `example.com`.
- To add a provider, add a function to `posterProviders` in `providers.ts` that takes the `id` and returns an image URL, `null` or `undefined`.
- TMDB's terms require the attribution notice in the footer (`SiteFooter`) and the TMDB logo in an About or Credits section.

## `api/hardcover`

The client for the [Hardcover GraphQL API](https://docs.hardcover.app/api/getting-started/), used by the books feature at request time (see [`features.md`](./features.md#books)). It is server-only: the token never reaches the browser.

- `hardcover<T>(query, variables?)` POSTs to `https://api.hardcover.app/v1/graphql` with the `HARDCOVER_API_KEY` secret as a bearer token (a `Bearer ` prefix already in the secret is kept as is). It has a 10 second limit and throws on a missing key, a non-2xx response (including 429, with the `Retry-After` value in the message) or a GraphQL `errors` array.
- `cached(key, ttlMs, load)` memoizes `load` per key. Concurrent calls for a key share one request, and when a refresh fails the last good value is served for another minute instead of an error. With no earlier value the error is thrown.
- The free plan allows 5,000 requests a day (reset at midnight UTC), 60 a minute and 30 seconds per query, and counts each top-level GraphQL field as one request however many rows it returns. A query can be nested three levels deep at most, which is why `features/books` reads `cached_image` and `cached_contributors` (JSON fields) instead of joining authors and editions.

## `api/placeholders`

`getPlaceholder(url)` fetches a remote image and returns a 16px-wide WebP of it (quality 30) as a `data:` URI, around 100 to 300 bytes, so it can sit inline in the HTML. `MediaItemPoster` shows it blurred behind a remote poster until the real image has loaded. It works for books and movies alike: the books page renders on demand and the movie page at build time.

- The preview has to be inline to paint with the HTML. A tiny file served through `/_image` would make the server download the whole original first and arrive about when the full image does.
- Results are kept in memory for the life of the server, keyed by URL. Concurrent calls share one request, and only successes are kept, so a failed image is tried again on the next render.
- It never rejects and never delays a page for long. A fetch has a 3 second limit, and any failure (including `sharp` not loading, which is why it is imported inside the function) logs `[placeholders] <url>: <reason>` and resolves to `null`, which renders the poster without a preview.
- The first render after a cold start waits for the covers in parallel, roughly the slowest single image (measured at about a second on a development laptop). Later renders cost nothing, and on the books page the CDN caches the HTML for five minutes anyway.
- Uploaded posters (imported images) get no preview. They are optimized at build time and ship with the site.

## Conventions

- Nothing in `shared` may import from `app`, `pages`, `features`, or `entities`.
- Components here stay generic. Anything that knows about a profile, work or book belongs in `entities` or `features`.
- Name types and interfaces with a `Type` prefix, and import types with the `type` keyword.
