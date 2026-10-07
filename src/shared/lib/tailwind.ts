import { cnMerge, createTV, type TWMergeConfig } from "tailwind-variants";

// Names of the Utopia tokens in `src/app/styles/utopia.css`. tailwind-merge only knows Tailwind's stock scales, so
// without them `text-step-0` counts as a text color and `p-s` as an unknown class: `cn("text-step-0",
// "text-muted-foreground")` drops the size, and `cn("px-s", "px-0")` keeps both. Keep this list in step with the CSS.
const steps = ["step--1", "step-0", "step-1", "step-2", "step-3", "step-4", "step-5"];
const spaces = [
  "3xs",
  "2xs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "2xl",
  "3xl",
  "3xs-2xs",
  "2xs-xs",
  "xs-s",
  "s-m",
  "m-l",
  "l-xl",
  "xl-2xl",
  "2xl-3xl",
  "s-l",
];

const twMergeConfig: TWMergeConfig = { extend: { theme: { text: steps, spacing: spaces } } };

export const tv = createTV({ twMergeConfig });
export { type VariantProps } from "tailwind-variants";

/** `cn` from tailwind-variants, configured with the Utopia tokens. */
export const cn = (...classes: Parameters<typeof cnMerge>) => cnMerge(...classes)({ twMergeConfig });
