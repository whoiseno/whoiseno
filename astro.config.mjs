// @ts-check

import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	vite: {
		plugins: [tsconfigPaths(), tailwindcss()],
	},
	integrations: [react(), markdoc()],
})
