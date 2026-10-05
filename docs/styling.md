# Styling & Theming

## Tailwind v4

The project uses [Tailwind CSS v4](https://tailwindcss.com), configured entirely in CSS — there is no `tailwind.config.js`. The Vite plugin (`@tailwindcss/vite`) is registered in [`astro.config.mjs`](../astro.config.mjs), and the theme is defined in [`src/app/styles/global.css`](../src/app/styles/global.css):

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --font-serif: var(--font-heading);
  --font-sans: var(--font-content);
  --font-mono: var(--font-code);

  --breakpoint-*: initial;
  /* xs, sm, md, lg, xl, xxl */

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

### Breakpoints

Default Tailwind breakpoints are cleared (`--breakpoint-*: initial`) and replaced with a custom scale:

| Name  | Width    |
| ----- | -------- |
| `xs`  | `0px`    |
| `sm`  | `600px`  |
| `md`  | `960px`  |
| `lg`  | `1280px` |
| `xl`  | `1920px` |
| `xxl` | `2560px` |

Note this differs from Tailwind's stock breakpoints (e.g. stock `md` is `768px`, here it's `960px`) — don't assume defaults when reading class names like `md:py-12`.

### Font families

Tailwind's `font-serif` / `font-sans` / `font-mono` utilities are remapped to three CSS variables (`--font-heading`, `--font-content`, `--font-code`), which in turn point at the actual font-family variables Astro's `<Font />` component generates. This indirection means swapping a typeface later only requires changing the `--font-heading`/`--font-content`/`--font-code` assignments, not every usage site.

## Fonts

Three fonts are declared in `astro.config.mjs` and loaded via Astro's built-in [fonts API](https://docs.astro.build/en/guides/fonts/):

| Font         | Source                                                                            | Used for                                     |
| ------------ | --------------------------------------------------------------------------------- | -------------------------------------------- |
| Supreme      | Local variable font (`src/app/fonts/Supreme-Variable.woff2`), weights 100–900     | Body copy (`font-sans` → `--font-content`)   |
| General Sans | Local variable font (`src/app/fonts/GeneralSans-Variable.woff2`), weights 100–900 | Headings (`font-serif` → `--font-heading`)   |
| Geist Mono   | [Fontsource](https://fontsource.org/) provider (fetched, not bundled locally)     | Code/monospace (`font-mono` → `--font-code`) |

Each is registered with a `cssVariable` (e.g. `--font-general-sans-variable`) in `astro.config.mjs`, and rendered into the page via `<Font cssVariable="..." />` calls in [`Root.astro`](../src/shared/ui/layouts/Root.astro) — a font must be both declared in the config _and_ rendered in `Root.astro` to actually load.

## Color tokens

Tailwind's default palette is removed (`--color-*: initial`), so classes like `text-gray-950` do not exist. Colors come only from semantic tokens: `background`, `foreground`, `dimmed`, `surface`, `card`, `popover`, `input`, `accent`, `muted`, `brand`, `primary`, `secondary`, `neutral`, `info`, `warning`, `success`, `error`, `ring` and `border` (plus `-foreground` pairs, and `border-soft`/`border-hard`), along with `black`, `white` and `scrim`. Use them as `bg-card`, `text-muted-foreground`, `border`, and so on.

Each token is a CSS variable set in `:root` (light) and redefined in `.dark`. `--toned` is declared in both blocks but has no `--color-toned` mapping, so there is no `text-toned` utility yet.

Every token value is written in `oklch()`, including the translucent ones (`oklch(0.2154 0.009 75.14 / 13%)`). Tailwind's opacity utilities such as `bg-muted/40` still work because the `--color-*` theme entries point at the variables and Tailwind mixes the alpha in itself.

The light theme uses warm stone neutrals (Tailwind's stone scale for the background, foreground and muted text, with white cards and popovers) modeled on Mayven's light mode. Borders in light mode are translucent stone instead of opaque grey, so they stay readable on both the background and white cards. `brand`, `primary` and every dark-mode token keep the colors of the original design system.

## Dark mode

Dark mode is class-based: `@custom-variant dark` makes the `dark:` variant match under `.dark` on `<html>`. Because the tokens already switch with the class, most components need no `dark:` classes; use `dark:` only for things that are not token-driven (for example swapping the sun and moon icons).

The class is set before first paint by the inline script in [`Root.astro`](../src/shared/ui/layouts/Root.astro) (saved `localStorage.theme`, else `prefers-color-scheme`) and toggled by the [`theme-toggle`](./layers/features.md) feature.

The toggle runs inside `document.startViewTransition`, and the keyframes in `global.css` (`theme-wipe-out` and `theme-wipe-in`, 0.7s) animate a `clip-path` so the new theme wipes in from the top to the bottom of the page. The wipe rules only apply while `<html>` has `data-theme-transition`, which the toggle sets for the duration of the transition, so the page-to-page fade (see Motion below) is not affected. When the browser has no `startViewTransition`, or the user prefers reduced motion, the class flips immediately with no animation.

## Radius

One radius scale, derived from `--radius` (`rounded-sm` to `rounded-xl`). Cards use `rounded-xl`; pills and avatars use `rounded-full`.

## Motion

Pages fade between each other with native cross-document view transitions: `@view-transition { navigation: auto; }` in `global.css`, inside `(prefers-reduced-motion: no-preference)`. There is no script, and the browser's default cross-fade of the `root` snapshot is used. Browsers without cross-document view transitions (Firefox at the time of writing) navigate normally. Content does not animate in when a page loads; the old per-section scroll-reveal has been removed.

## Scrollbar gutter

`<html>` in [`Root.astro`](../src/shared/ui/layouts/Root.astro) has `[scrollbar-gutter:stable]`. Without it, navigating between a short page and a page tall enough to scroll adds or removes the scrollbar, which changes the viewport width by the scrollbar's width and shifts the centered header sideways. The reserved gutter keeps the width constant, so the header no longer jumps on navigation.

## Writing entry styles

- **Code blocks:** Shiki is configured with `defaultColor: false`, so each token only carries `--shiki-light` and `--shiki-dark` variables. `global.css` applies `--shiki-light` to `pre.astro-code` and its spans, and `--shiki-dark` under `.dark`, scoped to `[data-slot="prose"]`.
- **Breakout:** `--breakout` (declared on `:root`, `min(10%, max(0px, calc((100vw - 100%) / 2 - 1rem)))`) is 10% of the text column, clamped to the space left in the viewport minus a 1rem gutter, so it is 0 on phones. Text keeps the column width, while code blocks, tables, blockquotes and images extend by `--breakout` on each side, and the table of contents uses it to clear them. The prose rules, including the `space-y-3` spacing between blocks, target `article` children because Markdoc wraps the document in an `<article>`. `--breakout` is a token stream, so the `%` resolves where it is used (against the column).
- **Full-bleed carousel:** the carousel does not use `--breakout`. Its root is an `@container`, so `cqw` is the width of the text column. The track is `w-screen`, pulled left by `calc(50vw - 50cqw)` and padded (`padding-inline` and `scroll-padding-left`) by the same amount, so it spans the whole viewport while the first slide lines up with the column. `w-screen` includes the scrollbar gutter, so `body` in `Root.astro` keeps `overflow-x-clip` to prevent a horizontal page scroll.
- **Wide mode:** the `data-wide` attribute on `<html>`, toggled by the width button, widens `<main>` in `Site.astro` with the `in-data-[wide]:max-w-4xl` variant and a `transition-[max-width]`. The header and footer keep their width.
- **Focus mode:** `html[data-focus]` rules in `global.css`; see [`animations.md`](./animations.md).
- **Anchored headings:** `h2` and `h3` inside `Prose` have `scroll-mt-20` so a table-of-contents jump does not hide the heading under the sticky header.

## Component variants

Components with variants (`Button`, `Badge`, `Card`, `DropdownMenu`) declare them with [`tailwind-variants`](https://www.tailwind-variants.org) in a `variants.ts` next to the component, and merge caller classes with `cn` imported from the same package. Use `slots` when a component has several parts (as `Card` does) and `compoundVariants` for combinations such as `variant` plus `color`. See [`layers/shared.md`](./layers/shared.md).

## Conventions

- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`, pointed at `global.css` as the stylesheet (`tailwindStylesheet` in [`.prettierrc`](../.prettierrc)) so it understands the custom theme when sorting.
- UI primitives use a `data-slot="..."` attribute convention (see [`layers/shared.md`](./layers/shared.md)) for structural targeting in CSS (e.g. `Page.astro`'s `has-data-[slot='page-footer']` selector), separate from styling classes.
