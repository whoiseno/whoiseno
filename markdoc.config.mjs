import { component, defineMarkdocConfig } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

export default defineMarkdocConfig({
  extends: [
    shiki({
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }),
  ],
  tags: {
    carousel: { render: component("./src/features/writing/content/Carousel.astro") },
    slide: { render: component("./src/features/writing/content/Slide.astro") },
    columns: { render: component("./src/features/writing/content/Columns.astro") },
    column: { render: component("./src/features/writing/content/Column.astro") },
  },
});
