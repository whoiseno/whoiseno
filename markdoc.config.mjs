import { component, defineMarkdocConfig, Markdoc, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  nodes: {
    // Expressive Code renders every fence; `mark`, `ins`, `del` and `wrap` come from `{% … %}` annotations.
    fence: {
      ...nodes.fence,
      render: component("./src/features/writing/index.ts", "CodeBlock"),
      attributes: {
        ...nodes.fence.attributes,
        content: { type: String, required: true },
        language: { type: String },
        mark: { type: String },
        ins: { type: String },
        del: { type: String },
        wrap: { type: Boolean },
      },
    },
    image: { ...nodes.image, render: component("./src/features/writing/index.ts", "Figure") },
    table: { ...nodes.table, render: component("./src/features/writing/index.ts", "Table") },
    // A figure cannot sit inside a paragraph, so a paragraph holding only an image renders as the image alone.
    paragraph: {
      ...nodes.paragraph,
      transform(node, config) {
        const [inline] = node.children;
        if (node.children.length === 1 && inline.children.length === 1 && inline.children[0].type === "image") {
          return inline.children[0].transform(config);
        }
        return new Markdoc.Tag("p", node.transformAttributes(config), node.transformChildren(config));
      },
    },
  },
  tags: {
    carousel: {
      render: component("./src/features/writing/index.ts", "Carousel"),
      attributes: { caption: { type: String } },
    },
    slide: {
      render: component("./src/features/writing/index.ts", "Slide"),
      attributes: { ratio: { type: String } },
    },
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
