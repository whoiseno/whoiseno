# Styling & Theming

## Tailwind v4

The project uses [Tailwind CSS v4](https://tailwindcss.com), configured entirely in CSS — there is no `tailwind.config.js`. The Vite plugin (`@tailwindcss/vite`) is registered in [`astro.config.mjs`](../astro.config.mjs), and the theme is defined in [`src/app/styles/global.css`](../src/app/styles/global.css):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./utopia.css"; /* fluid type and space, see below */

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --font-serif: var(--font-heading);
  --font-sans: var(--font-content);
  --font-mono: var(--font-code);
  --font-hand: var(--font-handwriting);

  --breakpoint-*: initial;
  --breakpoint-rail: 80rem; /* the only breakpoint */

  --radius-sm: calc(var(--radius) - 4px);
  /* md, lg, xl */

  --color-*: initial;
  --color-background: var(--background);
  /* one --color-<name> per token below */
}

@layer base {
  :root {
    --radius: 0.45rem;
    --background: oklch(0.9848 0.0013 106.42);
    /* ...light tokens */
  }

  .dark {
    --background: oklch(0.1696 0.0017 17.32);
    /* ...dark tokens */
  }
}
```

### Fluid type and space (Utopia)

Type and space come from the [Utopia](https://utopia.fyi) fluid system, in [`src/app/styles/utopia.css`](../src/app/styles/utopia.css). Instead of a size per breakpoint, every step is a `clamp()` that glides between a value at a 360px viewport and a value at 1240px, so type and spacing need no breakpoints at all. Both scales hang off one body size:

| Parameter  | At 360px                                    | At 1240px          |
| ---------- | ------------------------------------------- | ------------------ |
| Body size  | 14px                                        | 16px               |
| Type scale | 1.2 (minor third)                           | 1.25 (major third) |
| Space      | multiples of the body, 3xs 0.25 up to 3xl 6 | the same multiples |

The 14px body is the old `text-sm`, so a phone keeps the density it had and a desktop gains room. The CSS file is the calculator's own output, so it can be regenerated: the links in its header comment ([type](https://utopia.fyi/type/calculator?c=360,14,1.2,1240,16,1.25,5,1,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12) and [space](https://utopia.fyi/space/calculator?c=360,14,1.2,1240,16,1.25,5,1,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12)) open the calculators with these exact numbers. To change the system, edit the numbers there, paste the CSS back with two renames (`--step-n` to `--text-step-n`, `--space-x` to `--spacing-x`) and update the name lists in [`src/shared/lib/tailwind.ts`](../src/shared/lib/tailwind.ts).

**Type.** Seven steps replace Tailwind's `text-*` scale. `--text-*: initial` clears the stock sizes, so `text-sm`, `text-xl` and the rest no longer exist: an old class does nothing in markup, and fails the build in `@apply`. Each step carries its own line height.

| Class          | 360px  | 1240px | Used for                              |
| -------------- | ------ | ------ | ------------------------------------- |
| `text-step--1` | 11.7px | 12.8px | Dates, captions, badges, code         |
| `text-step-0`  | 14px   | 16px   | Body                                  |
| `text-step-1`  | 16.8px | 20px   | The lead under a title, `h3` in prose |
| `text-step-2`  | 20.2px | 25px   | Section headings, `h2` in prose       |
| `text-step-3`  | 24.2px | 31.3px | The page title, `h1` in prose         |
| `text-step-4`  | 29px   | 39.1px | Display glyphs                        |
| `text-step-5`  | 34.8px | 48.8px | Only the unused `PageTitle`           |

Write type through the [`Text` component](./layers/shared.md#uitext), not by hand. Use a `text-step-*` class only on a container that passes its size to its children (a `ul`, say).

**Space.** Nine steps and eight one-up pairs (a pair glides from one step's small value to the next step's large value, so it grows faster than a single step), plus one custom pair, `s-l`. They are Tailwind's `--spacing-*` theme variables, so every spacing utility takes them: `p-s`, `gap-xs-s`, `space-y-xl`, `-mx-s-l`, `scroll-pl-s-l`.

| Token                                                                  | 360px to 1240px                  |
| ---------------------------------------------------------------------- | -------------------------------- |
| `3xs` / `2xs` / `xs`                                                   | 4px / 7 to 8px / 11 to 12px      |
| `s` / `m` / `l`                                                        | 14 to 16 / 21 to 24 / 28 to 32px |
| `xl` / `2xl` / `3xl`                                                   | 42 to 48 / 56 to 64 / 84 to 96px |
| `3xs-2xs`, `2xs-xs`, `xs-s`, `s-m`, `m-l`, `l-xl`, `xl-2xl`, `2xl-3xl` | one-up pairs                     |
| `s-l`                                                                  | 14 to 32px                       |

At 1240px the tokens equal Tailwind's old numbers (`3xs` is `1`, `2xs` is `2`, `xs` is `3`, `s` is `4`, `m` is `6`, `l` is `8`, `xl` is `12`, `2xl` is `16`, `3xl` is `24`), so a desktop layout only changes where a token was bumped up on purpose. The roles the site uses:

| Role                                                          | Token                   |
| ------------------------------------------------------------- | ----------------------- |
| Page gutter (side padding of `main`, the top bar, the footer) | `s-l`                   |
| Between the blocks of a page, and the footer's padding        | `xl`, `xl-2xl`          |
| Top and bottom padding of `main`                              | `xl`, `2xl-3xl`         |
| A section's title to its content, grid gaps                   | `s-m`                   |
| Between paragraphs in prose                                   | `s`                     |
| Between list rows, and between an item's own parts            | `s`, `xs`, `2xs`, `3xs` |
| An icon or badge beside its label                             | `2xs`, `3xs`            |

The numeric scale stays for fixed dimensions (`size-4`, `h-9`, `w-24`, the avatar overlap `-mt-8`) and for hairlines under 4px (`py-0.5` on a badge, `mt-0.5` to align an icon). Use tokens for gaps, padding and margins.

Two traps come from the token names:

- **`max-w-2xl` and friends.** Tailwind looks for `max-w-*` in `--spacing` before `--container`, and the Utopia names `3xs` to `3xl` overlap the container names, so `max-w-2xl` would be 4rem. `global.css` aliases the colliding `--max-width-*` names back to the container sizes, which restores `max-w-2xl`. `w-*` and `min-w-*` have no alias; for a container width there, write the variable, as in `w-(--container-xl)`.
- **Class merging.** `cn` and `tv` come from [`src/shared/lib/tailwind.ts`](../src/shared/lib/tailwind.ts), never straight from `tailwind-variants`. Stock tailwind-merge does not know the token names, so it would treat `text-step-0` as a text colour (and drop it next to `text-muted-foreground`) and keep both of `px-s` and `px-0`. The wrapper adds the names to its config.

### The one breakpoint

Tailwind's stock breakpoints are cleared (`--breakpoint-*: initial`) and only one is defined, `rail` at `80rem` (1280px), which gives the `rail:` and `max-rail:` variants. It marks a change of structure rather than of size: from `rail` the navigation is a sidebar rail beside the content, below it a top bar with a menu above it. A menu cannot glide between those shapes, so this is the one place a media query stays. Nothing else uses one:

- Type and spacing are the fluid tokens above.
- Card, poster and social grids use the `grid-fluid` utility in `global.css`: `repeat(auto-fill, minmax(min(100%, var(--grid-min)), 1fr))`, so the column count follows the room that is there. Set the smallest column with `[--grid-min:9.5rem]`, and `[--grid-fill:auto-fit]` to let a lone item span the row (as the previous and next cards do).
- Rows that used to hide a piece below a width (the writing list, the work dates) wrap onto a second line instead.
- Wide mode only makes sense beside the rail, so its button is `hidden rail:inline-flex`.

Besides `rail`, only capability queries remain (`motion-reduce:`, `motion-safe:`, `pointer-fine:`, `(hover: hover)` and `(scripting: none)`). The `@container` elements exist for their `cqw` units; nothing queries their width.

### Font families

Tailwind's `font-serif` / `font-sans` / `font-mono` / `font-hand` utilities are remapped to four CSS variables (`--font-heading`, `--font-content`, `--font-code`, `--font-handwriting`), which in turn point at the actual font-family variables Astro's `<Font />` component generates. This indirection means swapping a typeface later only requires changing the `--font-heading`/`--font-content`/`--font-code` assignments, not every usage site.

## Fonts

Four fonts are declared in `astro.config.mjs` and loaded via Astro's built-in [fonts API](https://docs.astro.build/en/guides/fonts/):

| Font         | Source                                                                               | Used for                                                |
| ------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Supreme      | Local variable font (`src/assets/fonts/Supreme-Variable.woff2`), weights 100–900     | Body copy (`font-sans` → `--font-content`)              |
| General Sans | Local variable font (`src/assets/fonts/GeneralSans-Variable.woff2`), weights 100–900 | Headings (`font-serif` → `--font-heading`)              |
| Geist Mono   | [Fontsource](https://fontsource.org/) provider (fetched, not bundled locally)        | Code/monospace (`font-mono` → `--font-code`)            |
| Caveat       | [Fontsource](https://fontsource.org/) provider, weight 500 only                      | Handwritten asides (`font-hand` → `--font-handwriting`) |

Each is registered with a `cssVariable` (e.g. `--font-general-sans-variable`) in `astro.config.mjs`, and rendered into the page via `<Font cssVariable="..." />` calls in [`Root.astro`](../src/app/ui/Root.astro) — a font must be both declared in the config _and_ rendered in `Root.astro` to actually load.

## Color tokens

Tailwind's default palette is removed (`--color-*: initial`), so classes like `text-gray-950` do not exist. Colors come only from semantic tokens: `background`, `foreground`, `dimmed`, `surface`, `card`, `popover`, `input`, `accent`, `muted`, `brand`, `primary`, `secondary`, `neutral`, `info`, `warning`, `success`, `error`, `rating` (the yellow of the star rating), `code` (the muted purple of inline code), `ring` and `border` (plus `-foreground` pairs, and `border-soft`/`border-hard`), along with `black`, `white` and `scrim`. Use them as `bg-card`, `text-muted-foreground`, `border`, and so on.

Each token is a CSS variable set in `:root` (light) and redefined in `.dark`. `--toned` is declared in both blocks but has no `--color-toned` mapping, so there is no `text-toned` utility yet.

Every token value is written in `oklch()`, including the translucent ones (`oklch(0.2154 0.009 75.14 / 13%)`). Tailwind's opacity utilities such as `bg-muted/40` still work because the `--color-*` theme entries point at the variables and Tailwind mixes the alpha in itself.

The light theme uses warm stone neutrals (Tailwind's stone scale for the background, foreground and muted text, with white cards and popovers) modeled on Mayven's light mode. Borders in light mode are translucent stone instead of opaque grey, so they stay readable on both the background and white cards. `brand`, `primary` and every dark-mode token keep the colors of the original design system.

## Dark mode

Dark mode is class-based: `@custom-variant dark` makes the `dark:` variant match under `.dark` on `<html>`. Because the tokens already switch with the class, most components need no `dark:` classes; use `dark:` only for things that are not token-driven (for example swapping the sun and moon icons).

The class is set before first paint by the inline script in [`Root.astro`](../src/app/ui/Root.astro) (saved `localStorage.theme`, else `prefers-color-scheme`) and toggled by the [`theme-toggle`](./layers/features.md) feature.

The toggle runs inside `document.startViewTransition`, and the keyframes in `global.css` (`theme-wipe-out` and `theme-wipe-in`, 0.7s) animate a `clip-path` so the new theme wipes in from the top to the bottom of the page. The wipe rules only apply while `<html>` has `data-theme-transition`, which the toggle sets for the duration of the transition, so the page-to-page fade (see Motion below) is not affected. When the browser has no `startViewTransition`, or the user prefers reduced motion, the class flips immediately with no animation.

## Radius

One radius scale, derived from `--radius` (`rounded-sm` to `rounded-xl`). Cards use `rounded-xl`; pills and avatars use `rounded-full`.

## Motion

Pages fade between each other with native cross-document view transitions: `@view-transition { navigation: auto; }` in `global.css`, inside `(prefers-reduced-motion: no-preference)`. There is no script, and the browser's default cross-fade of the `root` snapshot is used. Browsers without cross-document view transitions (Firefox at the time of writing) navigate normally. Content does not animate in when a page loads; the old per-section scroll-reveal has been removed.

## Scrollbar gutter

`<html>` in [`Root.astro`](../src/app/ui/Root.astro) has `[scrollbar-gutter:stable]`. Without it, navigating between a short page and a page tall enough to scroll adds or removes the scrollbar, which changes the viewport width by the scrollbar's width and shifts the centered content sideways. The reserved gutter keeps the width constant, so the content no longer jumps on navigation.

## Scrollbars

Every scroll container is thin: `scrollbar-width: thin` and a `--border-hard` thumb on a transparent track, set on `*` in `@layer base` of `global.css`. Expressive Code resets inherited styles on its blocks with an unlayered `all: revert`, which a layered rule cannot beat, so `global.css` also has an unlayered `.expressive-code .frame pre { scrollbar-width: thin; }`.

## Site layout

`Site.astro` renders a body row and, below it, the footer as its own full-width row. From `rail` (80rem, 1280px) the body row is a grid of three tracks, `14rem minmax(0,1fr) 14rem`, inside a centered container (`max-w-7xl`, `max-w-384` in wide mode). The sidebar takes the first track, the content column the second, and the third stays empty, so the side tracks are equal and `<main>` is centered on the screen rather than in the space beside the sidebar. The sidebar is not pinned to the screen edge: it sits inside the container beside the content, its grid cell stretches to the height of the row, and the rail inside it is `sticky top-0`, so it follows the page and stops where the footer row starts. The middle of the rail holds the table of contents on writing posts (nudged up with `pb-3xl` so it looks centred between the nav and the actions) and the bottom holds the actions: the page `tools` slot (the writing toolbar), then the scroll-to-top and theme buttons in a left-aligned column, with the dev-only CMS button beside the theme toggle. Below `rail` the sidebar is a sticky top bar with a menu, and the sidebar header's `z-40` keeps it above the page; from `rail` the header is a grid item with `rail:z-auto`, because a grid item's `z-index` applies even without `position` and would otherwise put the whole sidebar above the full-width carousel. The rail's sticky box is a stacking context, so the table of contents popover cannot out-rank content that comes later in the page (code frames are `position: relative`) on its own z-index. Instead the header takes `rail:z-50` while the `toc` slot's child is hovered or focused (`rail:has-[[data-slot=site-toc]>*:is(:hover,:focus-within)]:z-50`), which lifts the popover over code blocks and the carousel only while it is open. The content column is a size container (`@container`), which is why content measures its width with `cqw` (container query width) instead of `vw`: `100vw` would include the sidebar. `<body>` is a size container too, so `cqw` on the body row is the page width without the scrollbar. `<main>` is `max-w-2xl` and centered in the content column, with the `s-l` gutter at its sides, `xl` above, `2xl-3xl` below and `xl` between its blocks. The body row is `relative` because the footnote rail is positioned against it, and `site-content` takes `--sidenotes-overflow` as bottom padding (see Footnotes below).

## Writing entry styles

- **Code blocks:** rendered by [Expressive Code](https://expressive-code.com), not styled by `global.css`. [`ec.config.mjs`](../ec.config.mjs) points its colours at the site tokens (`--border`, `--muted`, `--radius`, `--font-code`) and its themes at the `.dark` class (`themeCssSelector`, with `useDarkModeMediaQuery: false`), so a block follows the theme toggle. `global.css` does not touch it, so a block is as wide as the text column.
- **Column width:** code blocks, tables, blockquotes and images all stay on the text column; none extends past it. An image and its lightbox trigger are `width: 100%`, and a table sits in a bordered wrapper (`Table.astro`) that scrolls sideways when its content cannot fit the column. The prose rules, including the `space-y-s` spacing between blocks, target `article` children because Markdoc wraps the document in an `<article>`.
- **Carousel span:** the carousel does not follow the text column. `@property --page-width` (a registered, inherited `<length>`) is set to `100cqw` on `Site`'s body row, whose nearest container is `<body>`. Registration makes the value compute to a length there, the width of the page, instead of staying a `100cqw` that re-resolves against the nearer container below. The carousel `<figure>` is an `@container` the width of the text column, and its track is `--page-width` wide, pulled left and padded (`padding-inline` and `scroll-padding-left`) by `(--page-width - 100cqw) / 2`, so it reaches both screen edges while the first slide lines up with the text. The offset is symmetric because the text column is centred in the body. The track does not use `w-screen`, because `100vw` includes the scrollbar width. The figure is `relative z-10`, so it passes over the sidebar and the table of contents ticks where they meet.
- **Lightbox scroll lock:** `html:has([data-slot="lightbox-content"][open])` sets `overflow: hidden` with a stable scrollbar gutter, so the page does not scroll or shift behind the dialog.
- **Footnotes:** written in place, a footnote is a muted box (`[data-slot="footnote"]`: marker, body) under its paragraph. It is styled in `global.css` and not with utility classes, because utilities sit in a later layer than components and would out-rank the rail overrides. From `rail`, `sidenotes.ts` moves each note into `[data-slot="sidenotes"]` (`WritingSidenotes`, through `Site`'s `sidenotes` slot), an absolutely positioned layer that is the last child of the body row. On every layout the script sets the layer's `left` to the right edge of the text column and the layer runs to the container's right edge, so the rail follows wide mode. A moved note carries `data-placed` and loses its box: it is `position: absolute`, takes the page background (`--fill`) so it hides what it overlaps, and stays `visibility: hidden` until the script adds `visible`. The script also toggles `lit` (hover or focus), `expanded` (pinned) and `clipped`, which comes with a `--clip` length that `clip-path` uses to cut the note where the next one starts; `::before` and `::after` are one-line fades in the fill colour that hide the seam, and with one note open the others dim. `[animating]` on the layer turns on the glide transitions, and only when the visitor has not asked for reduced motion. When notes stack past the end of the text the script sets `--sidenotes-overflow` on the body row, which becomes bottom padding on `site-content`, so the page grows instead of cutting a note off; it measures against the height minus the overflow it already added, so it settles. For a visitor with scripts on and room for the rail, notes that are not placed yet are visually hidden from the first paint (`@media (scripting: enabled)`), so they never flash in the text before moving. The carousel is `z-10` and sits over the layer, so a note stacked behind a carousel is hidden by it.
- **Wide mode:** the `data-wide` attribute on `<html>`, toggled by the width button, widens `<main>` in `Site.astro` to `max-w-4xl` and the body container to `max-w-384` with the `in-data-wide:` variant and a `transition-[max-width]`. The side tracks stay 14rem, so the content stays centered; the footer keeps its width. The button lives in `WritingToolbar`, shown from `rail` only (in the sidebar there), and drives the `writingReader` store. Below `rail` the toolbar in the post's header row holds the focus button alone.
- **Focus mode:** `html[data-focus]` rules in `global.css`; see [`animations.md`](./animations.md).
- **Anchored headings:** `h1` to `h3` inside `Prose` have `scroll-mt-20` below `rail`, so a jump does not hide the heading under the sticky top bar, and `scroll-mt-8` from `rail`, where the navigation is a side rail and nothing covers the top.
- **Inline code:** `:not(pre) > code` in `[data-slot="prose"]`, and `code` in a footnote body, get `text-code` on the muted background. `--code` is `oklch(0.5 0.12 300)` in light and `oklch(0.8 0.1 300)` in dark. Code blocks are Expressive Code's and do not use it.
- **Callout colors:** `callout-variants.ts` ([`features/writing/ui`](../src/features/writing/ui/callout-variants.ts)) gives each type a border at 30% and a background at 10% of its semantic token (`info`, `warning`, `success`, and `error` for `danger`), and colors the icon with the full token. The text stays `foreground`, because amber and yellow on a light background are too pale to read as text. Good to know uses `neutral` (background at 40%, border from `neutral-foreground` at 15%) with a `muted-foreground` icon. All of it follows the dark tokens, so no `dark:` variants are needed.
- **Signature color:** `global.css` forces `fill: none` and `stroke: currentColor` (both `!important`, so an inline `style` in the uploaded file cannot win) on the shapes inside `[data-slot="signature"]`, so the signature takes the text color in both themes.

## Component variants

Components with variants (`Button`, `Badge`, `Card`, `DropdownMenu`) declare them with [`tailwind-variants`](https://www.tailwind-variants.org) in a `variants.ts` next to the component, and merge caller classes with `cn`, both imported from [`@/shared/lib/tailwind`](../src/shared/lib/tailwind.ts), which wraps `tailwind-variants` with the Utopia token names (see above). Use `slots` when a component has several parts (as `Card` does) and `compoundVariants` for combinations such as `variant` plus `color`. See [`layers/shared.md`](./layers/shared.md).

## Conventions

- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`, pointed at `global.css` as the stylesheet (`tailwindStylesheet` in [`.prettierrc`](../.prettierrc)) so it understands the custom theme when sorting.
- UI primitives use a `data-slot="..."` attribute convention (see [`layers/shared.md`](./layers/shared.md)) for structural targeting in CSS (e.g. `Page.astro`'s `has-data-[slot='page-footer']` selector), separate from styling classes.
