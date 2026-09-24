# `PageContainer`

`src/shared/ui/page/PageContainer.astro`

Centers and width-constrains a page's content. Sits directly inside [`Page`](./Page.md).

## Props

None. `PageContainer` takes no props — it's slot-only.

## Slots

| Slot    | Description                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| default | Any combination of [`PageHeader`](./PageHeader.md), [`PageContent`](./PageContent.md), [`PageFooter`](./PageFooter.md), or arbitrary markup. |

## Behavior

- Renders `<div data-slot="page-container">`.
- Flex column (`flex flex-col flex-1`), full-width children (`*:w-full`), capped at `max-w-5xl` and horizontally centered on medium screens and up (`md:mx-auto`).
- Provides the vertical rhythm (`gap-6`) between its direct children (e.g. the gap between a header and a footer).

## Usage

```astro
---
import Page from "@/shared/ui/page/Page.astro";
import PageContainer from "@/shared/ui/page/PageContainer.astro";
import PageFooter from "@/shared/ui/page/PageFooter.astro";
import PageHeader from "@/shared/ui/page/PageHeader.astro";
---

<Page>
  <PageContainer>
    <PageHeader><!-- title / description --></PageHeader>

    <PageFooter>
      <p>&copy; 2026</p>
    </PageFooter>
  </PageContainer>
</Page>
```

## Related

- [`Page`](./Page.md) — the parent that owns outer padding; `PageContainer` owns width/centering.
- [`PageHeader`](./PageHeader.md), [`PageContent`](./PageContent.md), [`PageFooter`](./PageFooter.md) — the typical direct children.
