import type { ImageMetadata } from "astro";

export interface TypeNavItem {
  label: string;
  href: string;
}

/** One step of a page's trail. The last step is the current page and has no `href`. */
export interface TypeCrumb {
  label: string;
  href?: string;
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
