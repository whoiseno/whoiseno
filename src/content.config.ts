import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional()
  })
});

export const collections = { posts };
