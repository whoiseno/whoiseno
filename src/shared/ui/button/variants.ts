import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 has-[>svg:only-child]:aspect-square has-[>svg:only-child]:px-0",
  variants: {
    variant: {
      solid: "",
      outline: "border",
      ghost: "",
      link: "underline-offset-4 hover:underline",
    },
    color: {
      brand: "",
      primary: "",
      secondary: "",
      neutral: "",
    },
    size: {
      "xxs": "h-6 px-2 text-xs",
      "xs": "h-7 px-2.5 text-xs",
      "sm": "h-8 px-3 text-sm",
      "md": "h-9 px-4 text-sm",
      "lg": "h-10 px-5 text-sm",
      "xl": "h-11 px-6 text-base",
      "xxl": "h-12 px-8 text-base",
      "icon-xxs": "h-6 w-6",
      "icon-xs": "h-7 w-7",
      "icon-sm": "h-8 w-8",
      "icon-md": "h-9 w-9",
      "icon-lg": "h-10 w-10",
      "icon-xl": "h-11 w-11",
      "icon-xxl": "h-12 w-12",
    },
  },
  compoundVariants: [
    { variant: "solid", color: "brand", class: "bg-brand text-brand-foreground hover:bg-brand/90" },
    { variant: "solid", color: "primary", class: "bg-primary text-primary-foreground hover:bg-primary/90" },
    { variant: "solid", color: "secondary", class: "bg-secondary text-secondary-foreground hover:bg-secondary/80" },
    { variant: "solid", color: "neutral", class: "bg-neutral text-neutral-foreground hover:bg-neutral/80" },

    { variant: "outline", color: "brand", class: "border-brand text-brand hover:bg-brand/10" },
    { variant: "outline", color: "primary", class: "border-primary text-primary hover:bg-primary/10" },
    { variant: "outline", color: "secondary", class: "text-secondary-foreground hover:bg-secondary" },
    { variant: "outline", color: "neutral", class: "text-foreground hover:bg-accent hover:text-accent-foreground" },

    { variant: "ghost", color: "brand", class: "text-brand hover:bg-brand/10" },
    { variant: "ghost", color: "primary", class: "text-primary hover:bg-primary/10" },
    { variant: "ghost", color: "secondary", class: "text-secondary-foreground hover:bg-secondary" },
    { variant: "ghost", color: "neutral", class: "text-foreground hover:bg-accent hover:text-accent-foreground" },

    { variant: "link", color: "brand", class: "text-brand" },
    { variant: "link", color: "primary", class: "text-primary" },
    { variant: "link", color: "secondary", class: "text-secondary-foreground" },
    { variant: "link", color: "neutral", class: "text-foreground" },
  ],
  defaultVariants: {
    variant: "solid",
    color: "primary",
    size: "md",
  },
});

export type TypeButtonVariants = VariantProps<typeof buttonVariants>;
