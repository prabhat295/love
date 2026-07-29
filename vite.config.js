import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* Serves /api/song in local dev the same way Vercel does in production, so the
   Drive-hosted songs play with `npm run dev` too. See api/song.js for why the
   proxy is needed at all (short version: Drive 403s browser audio requests). */
function songProxy() {
  return {
    name: 'song-proxy',
    configureServer(server) {
      server.middlewares.use('/api/song', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/song.js');
        /* The handler builds a URL from req.url, which Vite has already
           stripped the '/api/song' prefix from — put it back. */
        req.url = `/api/song${req.url === '/' ? '' : req.url}`;
        return handler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), songProxy()],
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
