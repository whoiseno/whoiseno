import { tv } from "tailwind-variants";

export const cardVariants = tv({
  slots: {
    root: "block rounded-xl border bg-card px-3 py-2.5 text-card-foreground",
    header: "flex items-start justify-between gap-3",
    title: "font-medium",
    description: "text-muted-foreground",
    action: "shrink-0",
    content: "",
    footer: "flex items-center gap-2",
  },
  variants: {
    interactive: {
      true: { root: "transition-colors hover:bg-muted/60" },
    },
  },
});
