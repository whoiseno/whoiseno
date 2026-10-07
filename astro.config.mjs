// @ts-check
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import node from "@astrojs/node";
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

  // `astro preview` cannot serve a Vercel build, so `pnpm build:node` and `pnpm preview` pass `--node` to use the Node
  // adapter. Every other command, including the `pnpm build` that Vercel runs, uses the Vercel adapter.
  adapter: process.argv.includes("--node") ? node({ mode: "standalone" }) : vercel(),

  // Movie posters (see src/shared/api/posters) and Hardcover book covers (see src/features/books).
  image: {
    domains: ["image.tmdb.org", "s4.anilist.co", "assets.hardcover.app"],
  },

  env: {
    schema: {
      TMDB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      HARDCOVER_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      CLOUDINARY_CLOUD_NAME: envField.string({ context: "server", access: "secret", optional: true }),
      CLOUDINARY_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      CLOUDINARY_API_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
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
  },
  {
    provider: fontProviders.fontsource(),
    name: "Caveat",
    cssVariable: "--font-caveat",
    weights: [500],
    styles: ["normal"],
  }
]
});
