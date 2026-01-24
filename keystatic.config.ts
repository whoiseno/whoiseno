import { collection, config, fields } from "@keystatic/core";

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
				content: fields.markdoc({
					label: "Content",
					extension: "mdoc",
					options: {
						image: {
							directory: "public/content/posts",
							publicPath: "/content/posts",
						},
					},
				}),
			},
			slugField: "title",
		}),
	},
});
