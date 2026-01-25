import { component, defineMarkdocConfig } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
	tags: {
		// ----------------------------------------
		// Callout
		// ----------------------------------------
		callout: {
			render: component("./src/components/content/Callout.astro"),
			description: "A callout is a highlighted box or section that draws attention to important information or tips.",
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
		// ----------------------------------------
		// Code Block
		// ----------------------------------------
		fence: {
			render: component("./src/components/content/Fence.astro"),
			attributes: {
				content: { type: String, required: true },
				language: { type: String },
				title: { type: String },
				frame: { type: String, matches: ["auto", "none", "code", "terminal"] },
			},
			description:
				"A code block is a formatted section that displays programming code or technical text in a monospaced font, usually with a distinct background.",
		},
	},
});
