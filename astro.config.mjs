// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['localhost'],
    },
  },

  integrations: [svelte(), mdx(), sitemap()],
  redirects: {
    '/posts': '/', // redirect from /posts because that page doesn't exist.
  },
});
