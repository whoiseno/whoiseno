# `PageTitle`

`src/shared/ui/page/PageTitle.astro`

The page's main heading (`<h1>`). One per page.

## Props

None. `PageTitle` takes no props — it's slot-only.

## Slots

| Slot    | Description                                     |
| ------- | ----------------------------------------------- |
| default | The heading text (plain text or inline markup). |

## Behavior

- Renders `<h1 data-slot="page-title">`.
- Uses the serif font family (`font-serif`, mapped to the General Sans variable font — see [`styling.md`](../styling.md)), semibold weight, fluid size (`text-step-5`).

## Usage

```astro
---
import { PageTitle } from "@/shared/ui/page";
---

<PageTitle>Enoabasi Essien</PageTitle>
```

Since it's just an `<h1>` with a slot, inline markup works too:

```astro
<PageTitle>
  Hi, I'm <span class="text-blue-600">Enoabasi</span>
</PageTitle>
```

## Related

- [`PageHeader`](./PageHeader.md) — the typical parent.
- [`PageDescription`](./PageDescription.md) — usually follows immediately after, as the subheading.
