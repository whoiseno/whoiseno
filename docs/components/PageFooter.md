# `PageFooter`

`src/shared/ui/page/PageFooter.astro`

The bottom section of a page (e.g. copyright, links). The only component in `shared/ui/page` that accepts a prop.

## Props

| Prop    | Type                             | Required | Description                                                                                         |
| ------- | -------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `class` | `HTMLAttributes<"div">["class"]` | No       | Extra classes merged onto the root `<div>` via `class:list`. Used to opt into variants — see below. |

## Slots

| Slot    | Description                             |
| ------- | --------------------------------------- |
| default | The footer content (text, links, etc.). |

## Behavior

- Renders `<div data-slot="page-footer">`.
- `items-start`, pushed to the bottom via `mt-auto` (so it sticks to the bottom of a flex-column `Page` even with little content above it), with a small bottom padding (`pb-2`).
- Includes conditional top-padding utilities (`[.border-t]:pt-6 md:[.border-t]:pt-10`) that activate when you pass `class="border-t"` — giving the footer extra breathing room above a visible divider line, instead of having to remember the right padding value every time.

## Usage

Plain footer, no divider:

```astro
---
import PageFooter from "@/shared/ui/page/PageFooter.astro";
---

<PageFooter>
  <p class="text-gray-500">&copy; Enoabasi 2026</p>
</PageFooter>
```

With a top border divider (`class="border-t"` triggers the extra `pt-*` spacing automatically):

```astro
<PageFooter class="border-t">
  <p class="text-gray-500">&copy; Enoabasi 2026</p>
</PageFooter>
```

## Related

- [`PageContainer`](./PageContainer.md) — the typical parent.
- [`Page`](./Page.md) — automatically zeroes out its own bottom padding when a `PageFooter` is present, since the footer (`pb-2`) manages that spacing itself.
