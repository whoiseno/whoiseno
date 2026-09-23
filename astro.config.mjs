// @ts-check
import alpinejs from "@astrojs/alpinejs";
import partytown from "@astrojs/partytown";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs({ entrypoint: "/src/entrypoint" }), partytown()],
});
