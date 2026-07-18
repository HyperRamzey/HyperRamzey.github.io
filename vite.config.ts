import { defineConfig } from 'vite';

// base './' makes the bundle work on both <user>.github.io and project pages
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    cssTarget: 'chrome80',
    assetsInlineLimit: 2048,
  },
});
