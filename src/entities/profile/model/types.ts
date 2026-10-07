import type { TypeImageSource } from "@/shared/lib/cloud-asset";
import type { Icon } from "@/shared/ui/icon";
import type { ComponentProps } from "astro/types";

export interface TypeSocialLink {
  label: string;
  href: string;
  icon: ComponentProps<typeof Icon>["name"];
  handle: string;
  /** Set only for email links, so the address can be shown and copied. */
  email?: string;
  /** Hover card call to action, e.g. "Follow". */
  actionLabel?: string;
  displayName: string;
  bio?: string;
  avatar?: TypeImageSource | null;
  banner?: TypeImageSource | null;
  verified: boolean;
}
