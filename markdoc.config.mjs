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
    carousel: { render: component("./src/features/writing/index.ts", "Carousel") },
    slide: { render: component("./src/features/writing/index.ts", "Slide") },
    columns: { render: component("./src/features/writing/index.ts", "Columns") },
    column: { render: component("./src/features/writing/index.ts", "Column") },
    math: {
      render: component("./src/features/writing/index.ts", "Equation"),
      attributes: { expression: { type: String, required: true } },
    },
    inlineMath: {
      inline: true,
      render: component("./src/features/writing/index.ts", "Equation"),
      attributes: { expression: { type: String, required: true }, inline: { type: Boolean, default: true } },
    },
  },
});
