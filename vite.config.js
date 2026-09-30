import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { offlineApp } from './build/offline-plugin.js'
import { pagesFallback } from './build/pages-fallback.js'
import { siteFiles } from './build/site-files.js'
import { REMOTE_IMAGE_URLS } from './src/lib/level-images.js'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/**
 * The package a module comes from, or null for the application's own code.
 *
 * The identifier is normalised first: the build runs on Windows as well, where
 * the separators arrive as backslashes.
 */
function packageOf(id) {
  const match = id.replace(/\\/g, "/").match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//);
  return match ? match[1] : null;
}

/**
 * The libraries the first screen cannot do without, each in a chunk of its own.
 *
 * Keeping them apart from the game has two effects. A player who comes back
 * after a release downloads the game and nothing else, since React, the
 * animation library and the icons only change when their version does; and the
 * entry chunk, which has to arrive before anything is painted, stays well below
 * the 500 kB at which the build starts warning.
 *
 * Only packages that the first screen really needs are named here. Everything
 * else is left to Rollup, which keeps a library reached through a lazy route
 * travelling with that route instead of being dragged onto the critical path,
 * and that would be undone by grouping all of node_modules together.
 */
const VENDOR_CHUNKS = [
  ["react", /^(react|react-dom|scheduler)$/],
  ["router", /^(react-router|react-router-dom)$/],
  ["query", /^@tanstack\//],
  ["motion", /^(framer-motion|motion-dom|motion-utils)$/],
  ["icons", /^lucide-react$/],
];

function manualChunks(id) {
  const name = packageOf(id);
  if (!name) return undefined;
  for (const [chunk, pattern] of VENDOR_CHUNKS) {
    if (pattern.test(name)) return chunk;
  }
  return undefined;
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
  },
  plugins: [
    react(),
    // Answer a crawler before the application runs: robots.txt, sitemap.xml,
    // and the two link-preview tags that need the address the site is served
    // from. Before the 404 copy, which has to be written with those tags in it.
    siteFiles(),
    // Copies index.html to 404.html: a single page site has no other file to
    // answer a deep link with. Before the offline plugin, which lists what the
    // build produced and so has to see the copy.
    pagesFallback(),
    // Writes dist/sw.js, which makes the game installable and playable with no
    // network. The level photographs are served from public/photos, so they
    // travel with the build and are precached like any other file.
    offlineApp({ images: REMOTE_IMAGE_URLS }),
  ],
});
