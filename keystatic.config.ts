import { collection, config, fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";

export default config({
	storage: {
		kind: "local",
	},
	collections: {
		posts: collection({
			label: "Posts",
			path: "src/content/posts/*/",
			entryLayout: "content",
			format: {
				contentField: "content",
			},
			schema: {
				title: fields.slug({ name: { label: "Title", description: "The title of the post." } }),
				summary: fields.text({ label: "Summary", description: "The summary of the post.", multiline: true }),
				draft: fields.checkbox({
					label: "Draft",
					description: "Prevent this post from being published.",
					defaultValue: false,
				}),
				createdAt: fields.datetime({
					label: "Created At",
					description: "The date the post was created.",
					defaultValue: {
						kind: "now",
					},
				}),
				updatedAt: fields.datetime({
					label: "Updated At",
					description: "The date the post was updated.",
					defaultValue: {
						kind: "now",
					},
				}),
				content: fields.mdx({
					label: "Content",
					extension: "mdx",
					options: {
						image: {
							directory: "public/content/posts",
							publicPath: "/content/posts",
						},
					},
					components: {
						// ----------------------------------------
						// Callout
						// ----------------------------------------
						callout: wrapper({
							label: "Callout",
							schema: {
								title: fields.text({ label: "Title" }),
								variant: fields.select({
									label: "Variant",
									options: [
										{ label: "Note", value: "note" },
										{ label: "Tip", value: "tip" },
										{ label: "Warning", value: "warning" },
										{ label: "Danger", value: "danger" },
										{ label: "Important", value: "important" },
									],
									defaultValue: "note",
								}),
								defaultOpen: fields.checkbox({
									label: "Default open",
									description: "Should the callout be open by default",
									defaultValue: true,
								}),
							},
							description: "A callout is a highlighted box that draws attention to important information.",
						}),
						// ----------------------------------------
						// Code block
						// ----------------------------------------
						fence: block({
							label: "Code Block",
							schema: {
								content: fields.text({ label: "Content", multiline: true }),
								language: fields.text({ label: "Language" }),
								title: fields.text({ label: "Title" }),
								frame: fields.select({
									label: "Frame Type",
									options: [
										{ label: "Auto", value: "auto" },
										{ label: "None", value: "none" },
										{ label: "Code", value: "code" },
										{ label: "Terminal", value: "terminal" },
									],
									defaultValue: "auto",
								}),
							},
							description: "A code block is a section that displays programming code in a monospaced font.",
						}),
						/* TODO: Add custom components */
					},
				}),
			},
			slugField: "title",
		}),
	},
});
