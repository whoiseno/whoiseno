interface TypeAspectRatio {
  label: string;
  /** Width divided by height, or `null` to keep the image's own ratio. */
  ratio: number | null;
}

/** Crop presets for images. The keys avoid a colon so they stay plain strings in YAML. */
export const aspectRatioCatalog = {
  "original": { label: "Original", ratio: null },
  "1/1": { label: "Square (1:1)", ratio: 1 },
  "4/3": { label: "Landscape (4:3)", ratio: 4 / 3 },
  "3/2": { label: "Landscape (3:2)", ratio: 3 / 2 },
  "16/9": { label: "Wide (16:9)", ratio: 16 / 9 },
  "21/9": { label: "Ultra-wide (21:9)", ratio: 21 / 9 },
  "3/4": { label: "Portrait (3:4)", ratio: 3 / 4 },
  "2/3": { label: "Portrait (2:3)", ratio: 2 / 3 },
} as const satisfies Record<string, TypeAspectRatio>;

export type TypeAspectRatioName = keyof typeof aspectRatioCatalog;

export const aspectRatioNames = Object.keys(aspectRatioCatalog) as [TypeAspectRatioName, ...TypeAspectRatioName[]];
