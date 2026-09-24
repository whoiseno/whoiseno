# Styling & Theming

## Tailwind v4

The project uses [Tailwind CSS v4](https://tailwindcss.com), configured entirely in CSS — there is no `tailwind.config.js`. The Vite plugin (`@tailwindcss/vite`) is registered in [`astro.config.mjs`](../astro.config.mjs), and the theme is defined in [`src/app/styles/global.css`](../src/app/styles/global.css):

```css
@import "tailwindcss";

@theme inline {
  --font-serif: var(--font-heading);
  --font-sans: var(--font-content);
  --font-mono: var(--font-code);

  --breakpoint-*: initial;
  --breakpoint-xs: 0px;
  --breakpoint-sm: 600px;
  --breakpoint-md: 960px;
  --breakpoint-lg: 1280px;
  --breakpoint-xl: 1920px;
  --breakpoint-xxl: 2560px;
}

@layer base {
  :root {
    --radius: 0.625rem;
    --font-heading: var(--font-general-sans-variable);
    --font-content: var(--font-supreme-variable);
    --font-code: var(--font-geist-mono);
    --black: #000000;
    --white: #ffffff;
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

Only `--black` and `--white` are defined as custom tokens today; everything else (grays, etc., e.g. `text-gray-950`, `bg-gray-50` seen in `Root.astro`) uses Tailwind's default palette directly rather than a themed one.

## Conventions

- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`, pointed at `global.css` as the stylesheet (`tailwindStylesheet` in [`.prettierrc`](../.prettierrc)) so it understands the custom theme when sorting.
- UI primitives use a `data-slot="..."` attribute convention (see [`layers/shared.md`](./layers/shared.md)) for structural targeting in CSS (e.g. `Page.astro`'s `has-data-[slot='page-footer']` selector), separate from styling classes.
