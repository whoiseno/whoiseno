import type { ImageMetadata } from "astro";

export interface TypeNavItem {
  label: string;
  href: string;
}

export interface TypeSocialLink {
  label: string;
  href: string;
  icon: `ph:${string}`;
  handle: string;
  /** Set only for email links, so the address can be shown and copied. */
  email?: string;
  /** Hover card call to action, e.g. "Follow". */
  actionLabel?: string;
  displayName: string;
  bio?: string;
  avatar?: ImageMetadata | null;
  banner?: ImageMetadata | null;
  verified: boolean;
}

export const siteName = "Enoabasi Computer";

export const navItems: TypeNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Uses", href: "/uses" },
  { label: "Books", href: "/books" },
  { label: "Movies", href: "/movies" },
];
