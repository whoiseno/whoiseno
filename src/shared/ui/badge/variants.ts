import { tv, type VariantProps } from "@/shared/lib/tailwind";

export const badgeVariants = tv({
  base: "inline-flex items-center gap-2xs border px-2xs py-0.5 text-step--1 whitespace-nowrap",
  variants: {
    variant: {
      outline: "rounded-md text-muted-foreground",
      success: "rounded-full border-success/30 bg-success/10 px-xs text-foreground",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});

export type TypeBadgeVariants = VariantProps<typeof badgeVariants>;
