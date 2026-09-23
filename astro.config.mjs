// @ts-check
import alpinejs from "@astrojs/alpinejs";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs({ entrypoint: "/src/app/entrypoints/alpine" }), partytown()],

  vite: {
    plugins: [tailwindcss()],
  },
});
