# `PageContent`

`src/shared/ui/page/PageContent.astro`

A generic body-content wrapper for the section between a page's header and footer.

> **Not yet used anywhere in the codebase** — `src/pages/index.astro` currently goes straight from `PageHeader` to `PageFooter`. It's scaffolded and ready for pages with an actual body (e.g. a blog post list, a projects grid).

## Props

None. `PageContent` takes no props — it's slot-only.

## Slots

| Slot    | Description                |
| ------- | -------------------------- |
| default | The main body of the page. |

## Behavior

- Renders `<div data-slot="page-content">`.
- Flex column that grows to fill available space (`flex flex-col flex-1`), with a `gap-6` between its own children — i.e. it behaves like a generic vertical stack for whatever body content it wraps.

## Usage

```astro
---
import { PageContainer, PageContent, PageFooter, PageHeader } from "@/shared/ui/page";
---

<PageContainer>
  <PageHeader><!-- title / description --></PageHeader>

  <PageContent>
    <!-- e.g. a list of blog posts, one entry per child -->
    <article>...</article>
    <article>...</article>
  </PageContent>

  <PageFooter><!-- footer content --></PageFooter>
</PageContainer>
```

## Related

- [`PageContainer`](./PageContainer.md) — the typical parent.
- [`PageHeader`](./PageHeader.md), [`PageFooter`](./PageFooter.md) — the sections it typically sits between.
