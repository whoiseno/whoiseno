// @ts-check
import { defineConfig } from 'astro/config';

import alpinejs from '@astrojs/alpinejs';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs({ entrypoint: "/src/entrypoint" }), partytown()]
});