import { defineConfig } from 'vite';

// For user pages (<user>.github.io) use './'; for project pages use the repo slug.
// GITHUB_REPOSITORY is set by GitHub Actions (e.g. 'HyperRamzey/cik').
const repo = process.env.GITHUB_REPOSITORY; // 'owner/repo' or undefined locally
const base = repo ? `/${repo.split('/')[1]}/` : './';

export default defineConfig({
  base,
  build: {
    target: 'es2019',
    cssTarget: 'chrome80',
    assetsInlineLimit: 2048,
  },
});
