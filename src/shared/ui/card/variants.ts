import { tv } from "@/shared/lib/tailwind";

export const cardVariants = tv({
  slots: {
    root: "block rounded-xl border bg-card px-s py-xs text-card-foreground",
    header: "flex items-start justify-between gap-xs",
    title: "font-medium",
    description: "text-muted-foreground",
    action: "shrink-0",
    content: "",
    footer: "flex items-center gap-2xs",
  },
  variants: {
    interactive: {
      true: { root: "transition-colors hover:bg-muted/60" },
    },
  },
});
