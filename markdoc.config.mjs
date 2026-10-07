import { component, defineMarkdocConfig, Markdoc, nodes } from "@astrojs/markdoc/config";

import { numberFootnotes } from "./src/features/writing/config/footnotes.mjs";

export default defineMarkdocConfig({
  nodes: {
    // The document is the only place that sees every footnote, so it numbers them for the tags below.
    document: {
      ...nodes.document,
      transform(node, config) {
        config.ctx.footnotes = numberFootnotes(node);
        return new Markdoc.Tag(nodes.document.render, node.transformAttributes(config), node.transformChildren(config));
      },
    },
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
    // A footnote is a `footnoteRef` in the text and a `footnote` with the same id holding its content. Both get their
    // number from the `document` node above.
    footnoteRef: {
      inline: true,
      render: component("./src/features/writing/index.ts", "FootnoteRef"),
      attributes: { id: { type: String, required: true } },
      transform(node, config) {
        const { id } = node.transformAttributes(config);
        return new Markdoc.Tag(config.tags.footnoteRef.render, { id, number: config.ctx.footnotes.get(id) }, []);
      },
    },
    footnote: {
      render: component("./src/features/writing/index.ts", "Footnote"),
      attributes: { id: { type: String, required: true } },
      transform(node, config) {
        const { id } = node.transformAttributes(config);
        return new Markdoc.Tag(
          config.tags.footnote.render,
          { id, number: config.ctx.footnotes.get(id) },
          node.transformChildren(config),
        );
      },
    },
    video: {
      render: component("./src/features/writing/index.ts", "VideoClip"),
      attributes: { file: { type: String }, url: { type: String }, caption: { type: String } },
    },
    audio: {
      render: component("./src/features/writing/index.ts", "AudioClip"),
      attributes: { file: { type: String }, url: { type: String }, caption: { type: String } },
    },
    handwriting: { render: component("./src/features/writing/index.ts", "Handwriting") },
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
