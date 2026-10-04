import { slugify } from "@/shared/lib/slug";
import { getCollection } from "astro:content";

export type TypeWritingTag = { slug: string; label: string; count: number };

export async function getWritingTags(): Promise<TypeWritingTag[]> {
  const tags = new Map<string, TypeWritingTag>();

  for (const { data } of await getCollection("writing")) {
    for (const label of new Set(data.tags.map((tag) => tag.trim()).filter(Boolean))) {
      const slug = slugify(label);
      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { slug, label, count: 1 });
    }
  }

  return [...tags.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
