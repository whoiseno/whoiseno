import { tv, type VariantProps } from "@/shared/lib/tailwind";

/**
 * Every typographic role on the site. Sizes are the fluid steps from `utopia.css`; `step-0` is the body size. Prose
 * headings (`h1` to `h3` in `global.css`) repeat `title`, `heading` and `subheading`, so change them together.
 */
export const textVariants = tv({
  variants: {
    variant: {
      /** Oversized glyphs and numerals, such as the initial on a missing cover. */
      display: "font-serif text-step-4 font-semibold",
      /** The page's `h1`. */
      title: "font-serif text-step-3 font-bold",
      /** A section's `h2`. */
      heading: "font-serif text-step-2 font-semibold",
      /** A block's `h3`. */
      subheading: "font-serif text-step-1 font-semibold",
      /** The sentence under a page title. */
      lead: "text-step-1",
      body: "text-step-0",
      /** The name of a thing: a company, a book, a nav link. */
      label: "text-step-0 font-medium",
      /** Dates, captions and other asides. */
      small: "text-step--1",
      /** A tiny heading above a block. */
      overline: "text-step--1 font-medium tracking-wider uppercase",
      /** Small figures and codes. */
      mono: "font-mono text-step--1",
    },
    tone: {
      default: "",
      muted: "text-muted-foreground",
      faint: "text-muted-foreground/70",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
  },
});

export type TypeTextVariants = VariantProps<typeof textVariants>;

export type TypeTextVariant = NonNullable<TypeTextVariants["variant"]>;

export type TypeTextTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "time" | "figcaption";

const textTags = {
  display: "p",
  title: "h1",
  heading: "h2",
  subheading: "h3",
  lead: "p",
  body: "p",
  label: "span",
  small: "p",
  overline: "p",
  mono: "span",
} as const satisfies Record<TypeTextVariant, TypeTextTag>;

/**
 * The element a variant renders unless `as` says otherwise. The lookup lives here, where `variant` is typed, because in
 * some editor setups `Text.astro` sees the props of the generic `Polymorphic` type as `any`, and an `any` key cannot
 * index `textTags` (TS7053).
 */
export function getTextTag(variant: TypeTextVariant): TypeTextTag {
  return textTags[variant];
}
