import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* Relative base, so the built dist/ works from any path — Vercel and Netlify
     serve from the root, GitHub Pages serves from /<repo-name>/, and this
     handles all three without needing to be changed per host. It also means
     you can just double-click dist/index.html to check it locally. */
  base: './',
  build: {
    /* Phone photos are large; don't warn about the chunk size. */
    chunkSizeWarningLimit: 2000,
    /* Never inline images as base64 — keeps them as real files. */
    assetsInlineLimit: 0,
  },
})
