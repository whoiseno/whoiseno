import type { TypeNavItem } from "@/shared/config/site";
import { getEntry } from "astro:content";

export async function getNavItems(): Promise<TypeNavItem[]> {
  const navigation = await getEntry("navigation", "index");
  if (!navigation) {
    throw new Error(
      'Navigation not found. Create it in Keystatic ("Navigation") or add src/content/navigation/index.yaml.',
    );
  }
  return navigation.data.links.filter((link) => link.visible).map(({ label, href }) => ({ label, href }));
}
