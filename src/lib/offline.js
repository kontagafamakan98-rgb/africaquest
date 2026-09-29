/**
 * Turns the built application into something a phone can install and run with
 * no network at all.
 *
 * The worker itself is written by the build (build/offline-plugin.js), because
 * it has to list the exact files Vite produced. This module only registers it,
 * and only in a production build: in development the worker would serve cached
 * modules and hide the very errors a developer needs to see.
 */
import { basePath } from "./base-path.js";

// The worker sits beside the application, wherever the application is served
// from, and its scope is that same directory: a project site on GitHub Pages
// lives under its repository name, and a worker registered at the root of the
// domain there would belong to somebody else's site.
const WORKER_URL = `${basePath()}sw.js`;

/** True in a Vite production build, false in development and under Node. */
function isProductionBuild() {
  return Boolean(import.meta.env && import.meta.env.PROD);
}

/**
 * Registers the offline worker. Safe to call anywhere: browsers without service
 * workers, development builds and a failed registration all do nothing rather
 * than throw, because offline support must never be a reason the app breaks.
 * Returns the ServiceWorkerRegistration, or null.
 */
export function registerOffline() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!isProductionBuild()) return null;

  const register = () => {
    // updateViaCache: the browser must always revalidate sw.js itself, otherwise
    // a device could keep serving an old offline copy of the app forever.
    return navigator.serviceWorker
      .register(WORKER_URL, { scope: basePath(), updateViaCache: "none" })
      .then((registered) => {
        // A browser looks for a new version of the worker when a page is
        // loaded, and at no other time. An application left open on a phone
        // would therefore go on showing an old copy for days, so the same look
        // is asked for again whenever the page comes back to the front.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") registered.update().catch(() => {});
        });
        return registered;
      })
      .catch(() => null);
  };

  // Registration triggers the download of every asset, so it waits until the
  // first screen is drawn rather than competing with it for bandwidth.
  if (document.readyState === "complete") return register();
  window.addEventListener("load", register, { once: true });
  return null;
}

/**
 * Tells the caller when a new version of the application has taken over.
 *
 * The worker is written to skip waiting and to claim the open pages, so a new
 * version answers requests the moment it is installed; the page itself keeps
 * running the code it was loaded with until it is reloaded. That gap is the
 * thing worth a word to the reader, and a change of controller marks it.
 *
 * A first visit is not a change of version: the page starts with no controller
 * at all, and the one that arrives is the application installing itself rather
 * than replacing anything. Offering to reload then would be noise, so only a
 * change with a controller already in place is reported.
 *
 * `target` is the ServiceWorkerContainer to listen to, so the behaviour can be
 * driven from a test without a browser.
 */
export function watchForUpdates(
  onReady,
  target = typeof navigator === "undefined" ? null : navigator.serviceWorker
) {
  if (!target || typeof target.addEventListener !== "function") return () => {};

  const hadController = Boolean(target.controller);
  const onControllerChange = () => {
    if (hadController) onReady();
  };

  target.addEventListener("controllerchange", onControllerChange);
  return () => target.removeEventListener("controllerchange", onControllerChange);
}
