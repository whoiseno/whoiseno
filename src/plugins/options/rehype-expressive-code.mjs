import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
export const rehypeExpressiveCodeOptions = {
  themes: ["catppuccin-latte"],
  plugins: [pluginLineNumbers()],
  defaultProps: {
    wrap: false,
    overridesByLang: {
      "ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh": {
        showLineNumbers: false,
      },
    },
  },
  styleOverrides: {
    borderColor: "var(--border)",
    codeFontFamily: "var(--font-mono)",
    frames: {
      editorActiveTabForeground: "var(--muted-foreground)",
      editorActiveTabBackground: "color-mix(in oklab, var(--muted) 25%, transparent)",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
    },
    uiFontFamily: "var(--font-sans)",
  },
};
