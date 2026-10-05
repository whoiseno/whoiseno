# UI Components

Reference docs for the `Page*` primitives in [`src/shared/ui/page`](../../src/shared/ui/page). `Root.astro`, the one-off document shell, is not a composable primitive and lives in the `app` layer instead (see [`layers/app.md`](../layers/app.md)).

All of these live under `src/shared/ui/page/` and are imported by name from the group's public API: `import { Page, PageContainer } from "@/shared/ui/page"`.

| Component         | Renders                              | Doc                                        |
| ----------------- | ------------------------------------ | ------------------------------------------ |
| `Page`            | `<main data-slot="page">`            | [Page.md](./Page.md)                       |
| `PageContainer`   | `<div data-slot="page-container">`   | [PageContainer.md](./PageContainer.md)     |
| `PageHeader`      | `<div data-slot="page-header">`      | [PageHeader.md](./PageHeader.md)           |
| `PageTitle`       | `<h1 data-slot="page-title">`        | [PageTitle.md](./PageTitle.md)             |
| `PageDescription` | `<div data-slot="page-description">` | [PageDescription.md](./PageDescription.md) |
| `PageContent`     | `<div data-slot="page-content">`     | [PageContent.md](./PageContent.md)         |
| `PageFooter`      | `<div data-slot="page-footer">`      | [PageFooter.md](./PageFooter.md)           |

## Shared conventions

- **Slot-based composition.** Every component is a thin wrapper around a single `<slot />` — none of them accept children via a prop, only via markup nesting (standard Astro slot composition).
- **`data-slot` attribute.** Each root element carries a `data-slot="..."` attribute matching its own name (kebab-case). This is used for structural CSS targeting between components (e.g. `Page` changes its padding based on whether a `[data-slot="page-footer"]` or `[data-slot="page-header"]` descendant is present) and is a stable hook for animation/JS targeting — see [`animations.md`](../animations.md) for an example that selects elements by `data-slot`.
- **No default export / no framework runtime.** These are plain `.astro` components — zero client-side JS unless the consuming page adds its own `<script>`.
- **Composition order.** The components are designed to nest in this order (skipping any that aren't needed for a given page):

  ```
  Page
  └── PageContainer
      ├── PageHeader
      │   ├── PageTitle
      │   └── PageDescription
      ├── PageContent
      └── PageFooter
  ```
