import { tv } from "@/shared/lib/tailwind";

/** A faint tint and border in the semantic color, with the icon in the full color. Good to know uses the neutral tokens. */
export const calloutVariants = tv({
  slots: {
    root: "rounded-lg border px-s py-xs",
    icon: "mt-[0.2em] size-[1.1em] shrink-0",
  },
  variants: {
    type: {
      "info": { root: "border-info/30 bg-info/10", icon: "text-info" },
      "warning": { root: "border-warning/35 bg-warning/10", icon: "text-warning" },
      "success": { root: "border-success/30 bg-success/10", icon: "text-success" },
      "danger": { root: "border-error/30 bg-error/10", icon: "text-error" },
      "good-to-know": { root: "border-neutral-foreground/15 bg-neutral/40", icon: "text-muted-foreground" },
    },
  },
  defaultVariants: { type: "info" },
});
