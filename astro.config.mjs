// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import keystatic from "@keystatic/astro";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeExpressiveCode from "rehype-expressive-code";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "./src/config";

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
const rehypeExpressiveCodeOptions = {
	themes: ["catppuccin-mocha"],
	plugins: [pluginLineNumbers()],
	defaultProps: {
		wrap: true,
		overridesByLang: {
			"ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh": {
				showLineNumbers: false,
			},
		},
	},
	styleOverrides: {
		codeFontSize: "0.75rem",
		codeFontFamily: "var(--font-mono)",
		uiFontFamily: "var(--font-sans)",
	},
};

/** @type {import('@shikijs/rehype').RehypeShikiOptions} */
const rehypeShikiOptions = {
	theme: "material-theme-darker",
	inline: "tailing-curly-colon",
};

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
			[rehypeExpressiveCode, rehypeExpressiveCodeOptions],
			[rehypeShiki, rehypeShikiOptions],
		],
	},
	adapter: netlify(),
});
