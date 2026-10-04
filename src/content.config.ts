import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const date = z.coerce.date();
const url = z.url().nullish();
const skills = z.array(z.string()).default([]);

const profile = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/profile" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      location: z.string().optional(),
      status: z.string().optional(),
      avatar: image().nullish(),
      socials: z
        .array(
          z.object({
            platform: z.enum(["github", "linkedin", "x", "instagram", "youtube", "email"]),
            url: z.string(),
          }),
        )
        .default([]),
    }),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/works" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: date,
    endDate: date.nullish(),
    link: url,
    skills,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    featured: z.boolean().default(false),
    description: z.string(),
    startDate: date,
    endDate: date.nullish(),
    skills,
    demoLink: url,
    sourceLink: url,
  }),
});

const uses = z.object({
  name: z.string(),
  description: z.string().optional(),
  link: url,
});

const software = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/software" }),
  schema: uses,
});

const hardware = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/hardware" }),
  schema: uses,
});

const books = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/books" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(["reading", "read", "want"]),
    rating: z.number().min(1).max(5).nullish(),
    finishedDate: date.nullish(),
    link: url,
    note: z.string().optional(),
  }),
});

const movies = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/movies" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["movie", "show", "anime"]),
    year: z.number().nullish(),
    status: z.enum(["watching", "watched", "planned"]),
    rating: z.number().min(1).max(5).nullish(),
    link: url,
    note: z.string().optional(),
  }),
});

export const collections = { profile, works, projects, software, hardware, books, movies };
