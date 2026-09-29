/**
 * Where the application's own files are served from.
 *
 * The app can live at the root of a domain, or under a path, the way a project
 * site on GitHub Pages does (https://name.github.io/repository/). Vite is told
 * which of the two it is when it builds, and hands the answer to the code as
 * BASE_URL, always with a trailing slash.
 *
 * Under Node, where the build plugin and the tests run, there is no application
 * root to speak of, so a file of ours is addressed from the root.
 *
 * This is for files of ours only. The page a photograph was taken from on
 * Wikimedia Commons, or any other outside address, belongs to somebody else and
 * must never be rewritten with our own path.
 */

/** A file of ours, addressed under `base`, which ends with a slash. */
export function underBase(file, base) {
  const prefix = typeof base === "string" && base.length > 0 ? (base.endsWith("/") ? base : `${base}/`) : "/";
  return `${prefix}${String(file).replace(/^\/+/, "")}`;
}

/** The path the application is served from, with its trailing slash. */
export function basePath() {
  const env = typeof import.meta === "undefined" ? undefined : import.meta.env;
  return underBase("", env && typeof env.BASE_URL === "string" ? env.BASE_URL : "/");
}

/** One of our files, as the browser has to ask for it. */
export function servedPath(file) {
  return underBase(file, basePath());
}
