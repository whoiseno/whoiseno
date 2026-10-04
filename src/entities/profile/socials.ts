import type { TypeSocialLink } from "@/shared/config/site";
import type { CollectionEntry } from "astro:content";

type TypeSocial = CollectionEntry<"profile">["data"]["socials"][number];

const platforms: Record<TypeSocial["platform"], Pick<TypeSocialLink, "label" | "icon">> = {
  github: { label: "GitHub", icon: "ph:github-logo" },
  linkedin: { label: "LinkedIn", icon: "ph:linkedin-logo" },
  x: { label: "X", icon: "ph:x-logo" },
  instagram: { label: "Instagram", icon: "ph:instagram-logo" },
  youtube: { label: "YouTube", icon: "ph:youtube-logo" },
  email: { label: "Email", icon: "ph:envelope-simple" },
};

export function getSocialLinks(socials: TypeSocial[]): TypeSocialLink[] {
  return socials.map(({ platform, url }) => ({ ...platforms[platform], href: url }));
}
