import { defineEcConfig } from "astro-expressive-code";

import { pluginWrapToggle } from "./src/features/writing/config/code-wrap-toggle.mjs";

export default defineEcConfig({
  themes: ["github-light", "github-dark"],
  themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root:not(.dark)"),
  useDarkModeMediaQuery: false,
  plugins: [pluginWrapToggle()],
  styleOverrides: {
    borderRadius: "var(--radius)",
    borderColor: "var(--border)",
    codeBackground: "var(--muted)",
    codeFontFamily: "var(--font-code)",
    codeFontSize: "0.75rem",
    codePaddingInline: "1rem",
    uiFontFamily: "var(--font-content)",
    uiFontSize: "0.75rem",
    frames: {
      frameBoxShadowCssValue: "none",
    },
  },
});
