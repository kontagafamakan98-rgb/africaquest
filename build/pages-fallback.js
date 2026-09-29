import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * The built site answers an unknown path with the application itself.
 *
 * The application is a single page: there is one real file, and the paths in
 * front of the router (a level, the privacy notice) only exist once the code is
 * running. A static host has no rewrite rule for that. GitHub Pages, though,
 * answers a path it does not recognise with 404.html, so a copy of the page
 * under that name makes every deep link start the application, whose router then
 * decides what to show; the service worker does the same from the cache when
 * there is no network at all.
 *
 * The copy is made by the build rather than by the deployment, so a build
 * directory is a complete site for any static host, and the file is counted with
 * the rest of the offline copy instead of appearing after the worker was
 * written.
 *
 * Must be registered before the offline plugin, which lists what it finds.
 */

/** The name a static host looks for when a path is not a file. */
export const FALLBACK_FILE = "404.html";

/** Vite plugin: writes the single-page fallback beside index.html. */
export function pagesFallback() {
  let root = process.cwd();
  let outDir = "dist";
  let building = false;

  return {
    name: "africa-quest-pages-fallback",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
      building = config.command === "build";
    },
    closeBundle() {
      if (!building) return;
      const target = path.resolve(root, outDir);
      const index = path.join(target, "index.html");
      if (!existsSync(index)) return;
      copyFileSync(index, path.join(target, FALLBACK_FILE));
    },
  };
}
