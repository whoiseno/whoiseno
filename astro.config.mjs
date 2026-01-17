// @ts-check

import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import tsconfigPaths from "vite-tsconfig-paths"
import { config } from "./src/config"

export default defineConfig({
	site: config.site,
	output: "static",
	vite: {
		plugins: [tsconfigPaths(), tailwindcss()],
	},
	integrations: [react(), markdoc()],
})
