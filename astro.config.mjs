// @ts-check

import markdoc from '@astrojs/markdoc'
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import keystatic from '@keystatic/astro'
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "./src/config";

export default defineConfig({
	site: config.site,
	vite: {
		plugins: [tsconfigPaths(), tailwindcss()],
	},
	integrations: [react(), markdoc(), keystatic()],
	adapter: netlify(),
});
