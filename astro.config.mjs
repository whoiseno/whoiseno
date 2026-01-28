// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from 'rehype-slug'
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "./src/config";
import { rehypeAutolinkHeadingsOptions } from "./src/plugins/options/rehype-autolink-headings.mjs";
import { rehypeExpressiveCodeOptions } from "./src/plugins/options/rehype-expressive-code.mjs";
import { rehypeExternalLinksOptions } from "./src/plugins/options/rehype-external-links.mjs";
import rehypeCleanup from "./src/plugins/rehype-cleanup.mjs";
import rehypeImageProcessor from "./src/plugins/rehype-image-processor.mjs";

export default defineConfig({
  site: config.site,
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
  },
  integrations: [
    react(),
    icon({
      include: {
        ph: ["info-fill", "lightbulb-fill", "warning-fill", "x-circle-fill", "trophy-fill", "caret-down-fill"],
      },
    }),
    mdx(),
    keystatic(),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
      rehypeCleanup,
      [rehypeExternalLinks, rehypeExternalLinksOptions],
      rehypeImageProcessor,
      [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
    ],
  },
  adapter: netlify(),
});
