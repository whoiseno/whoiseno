export interface TypeNavItem {
  label: string;
  href: string;
}

export interface TypeSocialLink {
  label: string;
  href: string;
  icon: string;
}

export const siteName = "EnoEno Computer";

export const navItems: TypeNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Projects", href: "/projects" },
  { label: "Uses", href: "/uses" },
  { label: "Books", href: "/books" },
  { label: "Movies", href: "/movies" },
];
