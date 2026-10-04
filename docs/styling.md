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
    --background: #f9f9f9;
    /* ...light tokens */
  }

  .dark {
    --background: #100f0f;
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

## Dark mode

Dark mode is class-based: `@custom-variant dark` makes the `dark:` variant match under `.dark` on `<html>`. Because the tokens already switch with the class, most components need no `dark:` classes; use `dark:` only for things that are not token-driven (for example swapping the sun and moon icons).

The class is set before first paint by the inline script in [`Root.astro`](../src/shared/ui/layouts/Root.astro) (saved `localStorage.theme`, else `prefers-color-scheme`) and toggled by the [`theme-toggle`](./layers/features.md) feature.

## Radius

One radius scale, derived from `--radius` (`rounded-sm` to `rounded-xl`). Cards use `rounded-xl`; pills and avatars use `rounded-full`.

## Motion

Scroll-reveal is CSS in `global.css`: elements with `data-reveal` start faded and offset, and gain `.in-view` (added by Alpine `x-intersect.once` in `Section`). It only applies under `(scripting: enabled)` and `(prefers-reduced-motion: no-preference)`, so with JS off or reduced motion the content is simply visible.

## Conventions

- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`, pointed at `global.css` as the stylesheet (`tailwindStylesheet` in [`.prettierrc`](../.prettierrc)) so it understands the custom theme when sorting.
- UI primitives use a `data-slot="..."` attribute convention (see [`layers/shared.md`](./layers/shared.md)) for structural targeting in CSS (e.g. `Page.astro`'s `has-data-[slot='page-footer']` selector), separate from styling classes.
