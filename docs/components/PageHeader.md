# `PageHeader`

`src/shared/ui/page/PageHeader.astro`

The top section of a page — typically wraps a [`PageTitle`](./PageTitle.md) and [`PageDescription`](./PageDescription.md).

## Props

None. `PageHeader` takes no props — it's slot-only.

## Slots

| Slot    | Description                                                                     |
| ------- | ------------------------------------------------------------------------------- |
| default | Usually a `PageTitle` followed by a `PageDescription`, but any markup is valid. |

## Behavior

- Renders `<div data-slot="page-header">`.
- Flex column, left-aligned (`items-start`), with large top padding (`pt-2xl-3xl`) — this is what pushes the hero content down from the top of the viewport on the homepage.
- Includes conditional bottom-padding utilities (`[.border-b]:pb-m-l`) that add extra spacing when a `border-b` divider class is present, for headers that end in a visible rule rather than just whitespace.

## Usage

```astro
---
import { PageDescription, PageHeader, PageTitle } from "@/shared/ui/page";
---

<PageHeader>
  <PageTitle>Enoabasi Essien</PageTitle>
  <PageDescription>
    <h2 class="text-3xl font-medium text-gray-400">Frontend and Backend Developer.</h2>
  </PageDescription>
</PageHeader>
```

## Related

- [`PageTitle`](./PageTitle.md), [`PageDescription`](./PageDescription.md) — the typical children.
- [`PageContainer`](./PageContainer.md) — the typical parent.
- [`animations.md`](../animations.md) — `[data-slot="page-header"]` (and its children) is a stable target for entrance animations.
