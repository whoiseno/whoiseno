import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-xs whitespace-nowrap",
  variants: {
    variant: {
      outline: "rounded-md text-muted-foreground",
      success: "rounded-full border-success/30 bg-success/10 px-2 text-foreground",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});

export type TypeBadgeVariants = VariantProps<typeof badgeVariants>;
