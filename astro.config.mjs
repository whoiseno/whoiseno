// @ts-check
import alpinejs from "@astrojs/alpinejs";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs({ entrypoint: "/src/app/entrypoints/alpine" }), partytown()],

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
    name: "Chubbo",
    cssVariable: "--font-chubbo-variable",
    options: {
      variants: [
        {
          weight: "100 900",
          style: "normal",
          src: ["./src/app/fonts/Chubbo-Variable.woff2"]
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
