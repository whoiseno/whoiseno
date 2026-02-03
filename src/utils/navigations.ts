interface Navigation {
  label: string;
  href: `/${string}`;
}

export const HEADER_NAVIGATIONS: Array<Navigation> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Works",
    href: "/works",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/#contact-me",
  },
];
