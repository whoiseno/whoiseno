# Animations

Simple animations (fades, slides, zooms on enter or exit) use [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css), imported once in [`global.css`](../src/app/styles/global.css) with `@import "tw-animate-css"`. It provides `animate-in` / `animate-out` plus modifiers such as `fade-in`, `fade-out`, `slide-in-from-top-2`, `zoom-in-95`, `duration-*` and `fill-mode-forwards`. Use them as utility classes, or with `@apply` inside `global.css`.

For anything beyond simple CSS transitions, this project uses [anime.js](https://animejs.com) v4 (`animejs` in [`package.json`](../package.json)) — a dependency-free animation engine with support for timelines, staggering, SVG/text effects, scroll-triggered animation, and spring physics.

[Alpine.js](https://alpinejs.dev) (see [`architecture.md`](./architecture.md)) stays responsible for state and DOM reactivity (`x-data`, `x-show`, `x-intersect`, etc.); anime.js is for the animation itself. They compose fine — e.g. trigger an anime.js timeline from an Alpine `x-intersect` handler — but don't reach for anime.js to do what a Tailwind `transition-*` utility already handles well (hover states, simple fades). Reach for it when you need sequencing, staggering across multiple elements, or scroll-driven/spring-based motion.

## Where it's wired up

- **Package:** `animejs` (installed via `pnpm add animejs`; ships its own TypeScript types, no `@types/` package needed).
- **Shared helper:** [`src/shared/lib/motion.ts`](../src/shared/lib/motion.ts) exports `createMotionScope`, a thin wrapper around anime.js's `createScope` that always registers a `reduceMotion` media query (`prefers-reduced-motion: reduce`). Use it instead of calling `createScope` directly so every animation in the app checks reduced-motion the same way.
- **Live example:** [`src/pages/index.astro`](../src/pages/index.astro) has a working entrance animation — see below.

## Basic pattern

Anime.js is a plain npm import, not an Astro integration — bring it in via a `<script>` tag in the component that needs it (Astro/Vite bundles and tree-shakes per-page automatically, so pages that don't animate anything don't ship anime.js):

```astro
<script>
  import { createMotionScope } from "@/shared/lib/motion";
  import { animate, stagger } from "animejs";

  createMotionScope().add((scope) => {
    if (scope.matches.reduceMotion) return;

    animate('[data-slot="page-title"], [data-slot="page-description"], [data-slot="page-footer"]', {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      delay: stagger(120),
      ease: "outQuad",
    });
  });
</script>
```

This is the exact animation running on the homepage: it fades and slides in the header title, description, and footer with a staggered delay, using the components' existing `data-slot` attributes as selectors (see [`docs/components/README.md`](./components/README.md#shared-conventions)) — no changes needed to the components themselves.

### Why `createMotionScope` / `Scope`

Anime.js v4's `Scope` (from `createScope`) groups animations so they can be:

- **Reduced-motion-aware** — `scope.matches.<name>` reflects whether a registered media query currently matches, re-evaluated automatically if it changes (e.g. the user toggles the OS setting mid-session).
- **Reverted cleanly** — `scope.revert()` undoes everything the scope created (useful if this project later adopts Astro's View Transitions / client-side routing, where animated elements can persist across navigations).

Always check `scope.matches.reduceMotion` (or pass an `ease`/duration of `0`) before running anything with meaningful motion — this project ships `eslint-plugin-jsx-a11y`, and respecting `prefers-reduced-motion` is the animation-specific extension of that same accessibility bar.

## Reference: common building blocks

```ts
import { animate, createScope, createTimeline, onScroll, stagger, utils } from "animejs";
```

| API                                                 | Use for                                                                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `animate(targets, params)`                          | A single animation — tween one or more CSS/SVG/DOM properties.                                                                            |
| `stagger(value, options?)`                          | Offsetting `delay` (or other params) across multiple targets, e.g. a staggered list entrance.                                             |
| `createTimeline()`                                  | Sequencing multiple `animate()` calls with precise relative timing (`.add(target, params, offset)`), for multi-step "complex" animations. |
| `createScope(params)` / `createMotionScope(params)` | Grouping animations for reduced-motion checks and bulk cleanup (see above).                                                               |
| `onScroll(params)`                                  | Scroll-linked/scroll-triggered animation (pass as an animation's `autoplay` value to drive it by scroll position instead of time).        |
| `utils`                                             | Helpers like `utils.random()`, `utils.clamp()`, unit conversion.                                                                          |

Full API reference: [animejs.com/documentation](https://animejs.com/documentation/).

## Conventions

- Target elements by their existing `data-slot` attribute (or add a dedicated `data-*` attribute for elements that don't have one) rather than plain class selectors — keeps animation targeting decoupled from Tailwind utility classes that may change for styling reasons.
- Keep animation setup in the `.astro` file (or feature) that owns the animated markup; only promote something to `src/shared/lib` if multiple, unrelated parts of the app need the same helper (as `createMotionScope` does).
- Prefer `transform`/`opacity` properties (as in the example above) over animating layout properties (`width`, `top`, etc.) for performance.

## Writing focus mode

The "no distraction" view on `/writing/[slug]` is the one place `tw-animate-css` is used today. The `setFocus()` method of the `writingReader` store in [`writing/model/reader.ts`](../src/features/writing/model/reader.ts) sets `data-focus="on"` or `"off"` on `<html>`, and `global.css` animates every `[data-focus-hide]` element (the sidebar with its table of contents and actions, the breadcrumbs, the footer, the row with the kind badge, date and toolbar, and the bottom block with the back link and previous and next posts):

- `on`: `animate-out fade-out fill-mode-forwards`, plus `pointer-events-none`. The component also sets `inert` on those elements so they leave the tab order.
- `off`: `animate-in fade-in`.
- Both are 300ms with `ease-out`, and `motion-reduce:duration-0` makes them instant for reduced motion.

The floating exit button is deliberately not inside a `data-focus-hide` element. With `fill-mode-forwards`, the element keeps the exit keyframe's `transform` and `filter`, which makes it the containing block for any `position: fixed` descendant and would move the button. The button fades with Alpine's `x-transition` using the same `animate-in` / `animate-out` classes.

## Page transitions

Navigating between pages cross-fades through native cross-document view transitions. `global.css` opts in with `@view-transition { navigation: auto; }` inside `@media (prefers-reduced-motion: no-preference)`, and the browser's default `root` cross-fade is used, so there is no script and no `ClientRouter`. Browsers without support (Firefox at the time of writing) load pages normally, and reduced motion turns it off.

Nothing animates in when a page loads; the earlier scroll-reveal on `Section` children (`data-reveal` with `x-intersect`) was removed in favor of the fade.

The theme toggle uses a separate same-document view transition (the top-to-bottom wipe). Its keyframes are scoped to `html[data-theme-transition]`, an attribute `theme-toggle.ts` sets while the transition runs, so the wipe never plays on a page navigation and the page fade never replaces the wipe. See [`styling.md`](./styling.md#dark-mode).
