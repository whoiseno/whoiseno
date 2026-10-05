import type { CollectionEntry } from "astro:content";

import type { TypeSocialLink } from "../model/types";

type TypeProfile = CollectionEntry<"profile">["data"];
type TypeSocial = TypeProfile["socials"][number];

const platforms: Record<TypeSocial["platform"], Pick<TypeSocialLink, "label" | "icon" | "actionLabel">> = {
  github: { label: "GitHub", icon: "ph:github-logo", actionLabel: "Follow" },
  linkedin: { label: "LinkedIn", icon: "ph:linkedin-logo", actionLabel: "Connect" },
  x: { label: "X", icon: "ph:x-logo", actionLabel: "Follow" },
  instagram: { label: "Instagram", icon: "ph:instagram-logo", actionLabel: "Follow" },
  youtube: { label: "YouTube", icon: "ph:youtube-logo", actionLabel: "Subscribe" },
  email: { label: "Email", icon: "ph:envelope-simple" },
};

function handleFromUrl(url: string): string {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  return `@${segments.at(-1) ?? new URL(url).hostname}`;
}

export function getSocialLinks({ name, avatar, socials }: TypeProfile): TypeSocialLink[] {
  return socials.map((social) => {
    const { platform, url } = social;
    const email = platform === "email" ? url.replace(/^mailto:/, "") : undefined;

    return {
      ...platforms[platform],
      href: platform === "email" ? `mailto:${email}` : url,
      email,
      handle: social.handle ?? email ?? handleFromUrl(url),
      displayName: social.displayName ?? name,
      bio: social.bio,
      avatar: social.avatar ?? avatar,
      banner: social.banner,
      verified: social.verified,
    };
  });
}
