import { defineCollection, reference } from "astro:content";

import { glob } from "astro/loaders";

import { z } from "astro/zod";

const ZMIN_MAX_FORMAT = z.string().min(3, "Must be min. 3 characters").max(15, "Must be max. 15 characters");
const ZCONNECT_SOCIALS_FORMAT = z.string().url().startsWith("https://", "Must start with 'https://'");
const ZCOERCED_DATE_FORMAT = z.coerce.date();

const categories = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/categories" }),
	schema: z.object({
		name: ZMIN_MAX_FORMAT,
	}),
});
const authors = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/authors" }),
	schema: z.object({
		name: ZMIN_MAX_FORMAT,
		connect: z.object({
			twitter: ZCONNECT_SOCIALS_FORMAT,
			github: z.optional(ZCONNECT_SOCIALS_FORMAT),
			linkedIn: z.optional(ZCONNECT_SOCIALS_FORMAT),
			website: z.optional(ZCONNECT_SOCIALS_FORMAT),
		}),
	}),
});
const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string().min(3, "Must be min. 3 characters"),
		summary: z.string().min(3, "Must be min. 3 characters").max(100, "Must be max. 100 characters"),
		category: reference("categories"),
		isPublished: z.boolean().default(true),
		author: z.array(reference("authors")),
		createdAt: ZCOERCED_DATE_FORMAT,
		updatedAt: z.optional(ZCOERCED_DATE_FORMAT),
	}),
});

export const collections = { categories, authors, blog };
