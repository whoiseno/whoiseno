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

// https://astro.build/config
export default defineConfig({
  integrations: [
    alpinejs({ entrypoint: "/src/app/entrypoints/alpine" }),
    partytown(),
    react(),
    markdoc(),
    keystatic(),
    icon(),
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
