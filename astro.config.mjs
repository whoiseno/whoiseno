// @ts-check
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
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
  // Absolute URLs (social preview images) need the site origin. Vercel provides it at build time.
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,

  integrations: [
    alpinejs({ entrypoint: "/src/app/config/alpine" }),
    partytown(),
    react(),
    expressiveCode(),
    markdoc(),
    keystatic(),
    icon({ iconDir: "src/assets/icons" }),
    keystaticBackLink,
  ],

  adapter: vercel(),

  // Poster providers, see src/shared/api/posters. Open Library redirects a cover to archive.org, which redirects again
  // to an iaNNNNNN.us.archive.org host. Astro checks every hop, and "**." does not match the bare archive.org.
  image: {
    domains: ["image.tmdb.org", "books.google.com", "s4.anilist.co"],
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "**.archive.org" },
    ],
  },

  env: {
    schema: {
      TMDB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

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
          src: ["./src/assets/fonts/Supreme-Variable.woff2"]
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
          src: ["./src/assets/fonts/GeneralSans-Variable.woff2"]
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
