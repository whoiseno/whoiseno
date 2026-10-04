// @ts-check
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

/** @type {import("astro").AstroIntegration} */
const keystaticBackLink = {
  name: "keystatic-back-link",
  hooks: {
    "astro:config:setup": ({ command, injectScript }) => {
      if (command !== "dev") return;
      injectScript(
        "before-hydration",
        `if (location.pathname.startsWith("/keystatic")) {
          const link = document.createElement("a");
          link.href = "/";
          link.textContent = "Back to site";
          link.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:6px 12px;border:1px solid GrayText;border-radius:8px;background:Canvas;color:CanvasText;color-scheme:light dark;font:500 13px system-ui,sans-serif;text-decoration:none";
          document.body.append(link);
        }`,
      );
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    alpinejs({ entrypoint: "/src/app/entrypoints/alpine" }),
    partytown(),
    react(),
    markdoc(),
    keystatic(),
    icon(),
    keystaticBackLink,
  ],

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
    provider: fontProviders.local(),
    name: "Supreme",
    cssVariable: "--font-supreme-variable",
    options: {
      variants: [
        {
          weight: "100 900",
          style: "normal",
          src: ["./src/app/fonts/Supreme-Variable.woff2"]
        }
      ]
    }
  },
  {
    provider: fontProviders.local(),
    name: "General Sans",
    cssVariable: "--font-general-sans-variable",
    options: {
      variants: [
        {
          weight: "100 900",
          style: "normal",
          src: ["./src/app/fonts/GeneralSans-Variable.woff2"]
        }
      ]
    }
  },
  {
    provider: fontProviders.fontsource(),
    name: "Geist Mono",
    cssVariable: "--font-geist-mono",
  }
]
});
