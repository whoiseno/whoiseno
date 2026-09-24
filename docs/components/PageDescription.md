# `PageDescription`

`src/shared/ui/page/PageDescription.astro`

A supporting line beneath the page title — a tagline, role, or short summary.

## Props

None. `PageDescription` takes no props — it's slot-only.

## Slots

| Slot    | Description                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | The description content. Note it renders inside a `<div>`, not a heading element — pass your own heading tag (e.g. `<h2>`) inside if the content is semantically a subheading, as the homepage does. |

## Behavior

- Renders `<div data-slot="page-description">`.
- Base text size, medium weight (`text-base font-medium`) — deliberately understated relative to `PageTitle`, since it's meant to carry secondary styling from its own content (as in the usage example below, where the inner `<h2>` supplies the larger, muted styling).

## Usage

```astro
---
import PageDescription from "@/shared/ui/page/PageDescription.astro";
---

<PageDescription>
  <h2 class="text-3xl font-medium text-gray-400">Frontend and Backend Developer.</h2>
</PageDescription>
```

For a simpler one-liner, plain text works too:

```astro
<PageDescription>Available for freelance work.</PageDescription>
```

## Related

- [`PageHeader`](./PageHeader.md) — the typical parent.
- [`PageTitle`](./PageTitle.md) — usually precedes it.
