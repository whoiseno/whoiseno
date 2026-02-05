import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    draft: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    draft: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
})

export const collections = { posts, works };
