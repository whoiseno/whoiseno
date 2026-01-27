// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeExpressiveCode from "rehype-expressive-code";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "./src/config";
import rehypeCleanup from "./src/plugins/rehype-cleanup.mjs";
import rehypeImageProcessor from "./src/plugins/rehype-image-processor.mjs";

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
const rehypeExpressiveCodeOptions = {
  themes: ["catppuccin-latte"],
  plugins: [pluginLineNumbers()],
  defaultProps: {
    wrap: false,
    overridesByLang: {
      "ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh": {
        showLineNumbers: false,
      },
    },
  },
  styleOverrides: {
    borderColor: "var(--border)",
    codeFontFamily: "var(--font-mono)",
    frames: {
      editorActiveTabForeground: "var(--muted-foreground)",
      editorActiveTabBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
    },
    uiFontFamily: "var(--font-sans)",
  },
};

export default defineConfig({
  site: config.site,
  redirects: {
    "/admin": "/keystatic"
  },
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
    rehypePlugins: [rehypeCleanup, rehypeImageProcessor, [rehypeExpressiveCode, rehypeExpressiveCodeOptions]],
  },
  adapter: netlify(),
});
