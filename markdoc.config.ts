import { component, defineMarkdocConfig } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
	tags: {
		callout: {
			render: component("./src/components/content/Callout.astro"),
			description:
				"A short string of text connected by a line, arrow, or similar graphic to a feature of an illustration or technical drawing and giving information about that feature.",
			attributes: {
				title: {
					type: String,
				},
				variant: {
					type: String,
				},
				defaultOpen: {
					type: Boolean,
				},
			},
		},
	},
});
