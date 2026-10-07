/** Pure data, so `keystatic.config.ts` can import it. `markdoc.config.mjs` lists the same names in its `matches`. */
export const calloutTypes = ["info", "warning", "success", "danger", "good-to-know"] as const;

export type TypeCalloutType = (typeof calloutTypes)[number];

export const calloutMeta = {
  "info": { label: "Info", icon: "reicon:InfoCircle" },
  "warning": { label: "Warning", icon: "reicon:AlertTriangle" },
  "success": { label: "Success", icon: "reicon:CheckCircle" },
  "danger": { label: "Danger", icon: "reicon:CloseCircle" },
  "good-to-know": { label: "Good to know", icon: "reicon:Bulb" },
} as const satisfies Record<TypeCalloutType, { label: string; icon: `reicon:${string}` }>;
