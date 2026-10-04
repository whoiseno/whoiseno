import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { logoNames } from "./shared/ui/icon/logos";

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
            handle: z.string().optional(),
            displayName: z.string().optional(),
            bio: z.string().optional(),
            avatar: image().nullish(),
            banner: image().nullish(),
            verified: z.boolean().default(false),
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
    workMode: z.enum(["on-site", "remote", "hybrid"]).default("on-site"),
    startDate: date,
    endDate: date.nullish(),
    link: url,
    technologies: z.array(z.enum(logoNames)).default([]),
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

const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["blog", "tutorial", "journal", "note"]).default("blog"),
    description: z.string().optional(),
    publishedDate: date,
    tags: z.array(z.string()).default([]),
  }),
});

const uses = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    logo: image().nullish(),
    description: z.string().optional(),
    usage: z.string().optional(),
    link: url,
  });

const software = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/software" }),
  schema: uses,
});

const hardware = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/hardware" }),
  schema: (context) =>
    uses(context).extend({
      photos: z.array(z.object({ image: context.image(), alt: z.string().optional() })).default([]),
    }),
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

export const collections = { profile, works, projects, writing, software, hardware, books, movies };
