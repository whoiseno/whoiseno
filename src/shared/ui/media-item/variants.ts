import { tv, type VariantProps } from "@/shared/lib/tailwind";

/** `MediaItemPoster` reads the layout through `group-data-[layout=row]/media-item:`. */
export const mediaItemVariants = tv({
  base: "group/media-item flex",
  variants: {
    layout: {
      row: "items-start gap-s",
      card: "flex-col gap-xs",
    },
  },
  defaultVariants: {
    layout: "card",
  },
});

export type TypeMediaItemVariants = VariantProps<typeof mediaItemVariants>;
