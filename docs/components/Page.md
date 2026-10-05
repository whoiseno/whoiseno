# `Page`

`src/shared/ui/page/Page.astro`

The outermost content wrapper for a route — a full-height flex column that owns the page's outer padding. Meant to sit directly inside [`Root`](../layers/app.md#uirootastro) and wrap everything else.

## Props

None. `Page` takes no props — it's slot-only.

## Slots

| Slot    | Description                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| default | The entire page body — typically a single [`PageContainer`](./PageContainer.md). |

## Behavior

- Renders `<main data-slot="page">`.
- Fills the viewport height (`min-h-svh h-svh max-h-svh`) and lays out children in a column with responsive gap/padding (`py-6 md:py-12 px-4 md:px-8`, `gap-6 md:gap-10`).
- **Adapts its own padding based on its children**, via Tailwind's `has-*` variant: if a descendant carries `data-slot="page-footer"`, bottom padding collapses to `0` (the footer manages its own bottom spacing instead); if a descendant carries `data-slot="page-header"`, top padding collapses to `0` (the header manages its own top spacing). This means you don't need to manually remove padding when a page has a `PageHeader`/`PageFooter` — it happens automatically.

## Usage

```astro
---
import Root from "@/app/ui/Root.astro";
import { Page, PageContainer } from "@/shared/ui/page";
---

<Root>
  <Page>
    <PageContainer><!-- page content --></PageContainer>
  </Page>
</Root>
```

## Related

- [`PageContainer`](./PageContainer.md) — typically the sole child of `Page`, adds the max-width/centering.
- [`layers/shared.md`](../layers/shared.md) — the `shared` layer and its `ui/page` group.
