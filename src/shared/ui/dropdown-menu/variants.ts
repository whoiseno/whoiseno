import { tv, type VariantProps } from "@/shared/lib/tailwind";

export const dropdownMenuItemVariants = tv({
  base: "flex w-full items-center gap-2xs rounded-lg px-2xs py-3xs text-left text-step-0 outline-none select-none aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      destructive: "text-error hover:bg-error/10 focus:bg-error/10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type TypeDropdownMenuItemVariants = VariantProps<typeof dropdownMenuItemVariants>;
