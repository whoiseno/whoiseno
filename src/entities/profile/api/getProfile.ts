import { getEntry } from "astro:content";

export async function getProfile() {
  const profile = await getEntry("profile", "index");
  if (!profile) {
    throw new Error('Profile not found. Create it in Keystatic ("Profile") or add src/content/profile/index.mdoc.');
  }
  return profile;
}
