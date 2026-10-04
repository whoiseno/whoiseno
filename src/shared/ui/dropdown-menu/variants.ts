import { tv, type VariantProps } from "tailwind-variants";

export const dropdownMenuItemVariants = tv({
  base: "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm outline-none select-none aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
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
