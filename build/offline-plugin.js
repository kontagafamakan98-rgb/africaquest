import { createHash } from "node:crypto";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { underBase } from "../src/lib/base-path.js";

/**
 * Offline support, without adding a dependency.
 *
 * The application is a single page with no backend: progress lives in
 * localStorage, so the only things it needs to run with no network at all are
 * its own files and the eight level photographs. This plugin writes a service
 * worker into the built output that downloads exactly that list up front, then
 * serves it from the cache.
 *
 * The list is taken from the build itself (the hashed bundles Vite just wrote)
 * rather than written by hand, so a renamed chunk can never leave the offline
 * copy broken. The cache name is a hash of that list, which means a new build
 * gets a new cache and the previous one is dropped on activation.
 *
 * A photograph is downloaded in its lightest version only: see offlineShell.
 *
 * The same worker carries the review reminder, because it is the only part of
 * the application that exists while the application is closed: the page hands
 * it the moments the game is due, it keeps them in IndexedDB, and it looks at
 * them when the browser wakes it to raise a notification and put the count on
 * the icon of the installed app. See the reminder section it writes into the
 * worker, and src/lib/review-reminder.js for the page's half of it.
 */

/** Every cache this app creates starts with this name, so it can clean its own. */
export const CACHE_PREFIX = "africa-quest";

/** Hosts whose images the worker is allowed to serve from the cache. */
export const CACHED_IMAGE_HOSTS = ["upload.wikimedia.org", "images.unsplash.com"];

/**
 * The tag the review reminder is registered and raised under.
 *
 * The page registers its wake-up with this name and the worker answers to it,
 * so the two have to be the same string; a test holds the generated worker to
 * the tag src/lib/review-reminder.js registers, which is what keeps them from
 * drifting apart without either of them being wrong on its own.
 */
export const REVIEW_TAG = "review-due";

/** What a notification shows: the icon the application is installed under. */
export const REVIEW_ICON = "/icon-192.png";

/** Short, stable id for one build: changes as soon as a file is added or renamed. */
export function cacheVersion(entries) {
  return createHash("sha1").update([...entries].sort().join("\n")).digest("hex").slice(0, 10);
}

/**
 * Photographs that still live on someone else's server. Anything served from
 * this origin is already part of the built output and would otherwise be listed
 * twice. Kept as a function of the input so a build and the tests that check it
 * always agree on what went into the cache name.
 */
export function remoteImages(images = []) {
  return [...new Set(images.filter((url) => /^https?:/i.test(url)))];
}

/** Exactly what the cache name is computed from. */
export function offlineEntries({ shell = [], images = [] } = {}) {
  return [...shell, ...remoteImages(images)];
}

/** Every file in a directory, as browser absolute paths such as "/assets/app-1a2b.js". */
export function listBuiltFiles(directory) {
  const files = [];
  const walk = (current, prefix) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}/${entry.name}`);
      else if (statSync(full).isFile()) files.push(`${prefix}/${entry.name}`);
    }
  };
  walk(directory, "");
  return files.sort();
}

/** The extension of a file, lower case and without its dot. */
const extensionOf = (file) => (/[./]([a-z0-9]+)$/i.exec(file)?.[1] || "").toLowerCase();

/** The formats one picture is served in, the lightest first. */
const PICTURE_FORMATS = ["avif", "webp", "jpg", "jpeg"];

/**
 * What a device really draws, so the files it never draws are left out.
 *
 * A photograph ships as a JPEG, as a WebP beside it, and - where that one is
 * lighter and no less faithful - as an AVIF in front of both. A browser draws
 * the first of those it can read and nothing else, so installing all three would
 * download two files nobody is shown; the gallery is the largest thing the
 * worker caches, and this is what keeps an install small.
 *
 * The rule reads the files themselves rather than a list of names, so a
 * photograph added to the game is covered the day it is added, and a picture
 * that gains or loses its AVIF changes the cache on its own. The lightest file
 * that exists keeps its place whatever it is: a JPEG with no lighter twin is
 * still a hole in the offline copy if it is left out.
 *
 * The thumbnail is not one of those three, and it is here for the opposite
 * reason: it is not the fallback of the picture but a second, much smaller copy
 * of it, drawn by the list of credits. It is named after the picture with a
 * suffix of its own, so it forms a group of its own and keeps its place as the
 * lightest file of that group - which is what an installed copy needs if that
 * screen is to show its pictures with no network at all.
 */
export function offlineShell(files) {
  const drawn = new Map();
  for (const file of files) {
    const format = extensionOf(file);
    const rank = PICTURE_FORMATS.indexOf(format);
    if (rank === -1) continue;

    const picture = file.slice(0, file.length - format.length - 1);
    const best = drawn.get(picture);
    if (best === undefined || rank < best.rank) drawn.set(picture, { rank, file });
  }

  const kept = new Set([...drawn.values()].map((entry) => entry.file));
  return files.filter((file) => !PICTURE_FORMATS.includes(extensionOf(file)) || kept.has(file));
}

/**
 * The service worker source. Kept as a plain function of its inputs so the
 * tests can read what it produces without running a build.
 */
export function createServiceWorkerSource({ shell, images, version, base = "/" }) {
  const cacheName = `${CACHE_PREFIX}-${version}`;
  const remote = remoteImages(images);
  // Where the application is served from. A worker is downloaded and run by the
  // browser at the address it was registered at, so every path it fetches has to
  // carry this prefix; the files Vite produced are named from the root of the
  // build, not from the root of the domain they end up under.
  const served = (file) => underBase(file, base);
  return `// Generated by build/offline-plugin.js. Do not edit by hand.
const CACHE = ${JSON.stringify(cacheName)};
const PREFIX = ${JSON.stringify(CACHE_PREFIX)};
const BASE = ${JSON.stringify(base)};
const SHELL = ${JSON.stringify(shell.map(served), null, 2)};
const IMAGE_HOSTS = ${JSON.stringify(CACHED_IMAGE_HOSTS)};
const OFFLINE_URL = ${JSON.stringify(served("/index.html"))};
const REVIEW_TAG = ${JSON.stringify(REVIEW_TAG)};
const REVIEW_STORE = "reminder";
const REVIEW_ICON = ${JSON.stringify(served(REVIEW_ICON))};

// Spaced repetition is worth nothing if the player never comes back, and a
// closed page cannot tell them anything. So the application hands this worker
// the moments its review questions are due; the worker keeps them, and when the
// browser wakes it - or when it starts, or when a page hands over a new
// schedule - it puts the count on the icon of the installed application and
// raises the reminder if anything has come due since the player left.

/** Reads or writes the one thing kept here: the moments the review is due. */
function stateRequest(mode, run) {
  return new Promise((resolve) => {
    let open;
    try {
      open = indexedDB.open("africa-quest-state", 1);
    } catch {
      resolve(null);
      return;
    }
    open.onupgradeneeded = () => open.result.createObjectStore(REVIEW_STORE);
    open.onerror = () => resolve(null);
    open.onsuccess = () => {
      let request;
      try {
        request = run(open.result.transaction(REVIEW_STORE, mode).objectStore(REVIEW_STORE));
      } catch {
        resolve(null);
        return;
      }
      request.onsuccess = () => resolve(request.result === undefined ? null : request.result);
      request.onerror = () => resolve(null);
    };
  });
}

const keepSchedule = (schedule) =>
  stateRequest("readwrite", (store) =>
    schedule ? store.put(schedule, "schedule") : store.delete("schedule")
  );

const readSchedule = () => stateRequest("readonly", (store) => store.get("schedule"));

/** How many of the moments the application sent are behind us by now. */
function dueNow(schedule, now) {
  const times = Array.isArray(schedule && schedule.times) ? schedule.times : [];
  return times.filter((time) => typeof time === "number" && time <= now).length;
}

/**
 * The count on the icon. Needed no permission, so it is done every time this
 * worker looks at the schedule, including on the day nothing is due yet.
 */
async function refreshBadge() {
  const schedule = await readSchedule();
  const count = dueNow(schedule, Date.now());
  try {
    if (count > 0) await navigator.setAppBadge(count);
    else if (navigator.clearAppBadge) await navigator.clearAppBadge();
  } catch {
    // A browser without the badge, or an application that is not installed:
    // the same count is on the review card inside the game.
  }
  return { schedule, count };
}

/**
 * The reminder itself, and the three reasons it says nothing: nothing is due, no
 * schedule was ever handed over, or the player is looking at the game already,
 * where the same count is in front of them.
 */
async function remindIfDue() {
  const { schedule, count } = await refreshBadge();
  if (!schedule || count === 0) return;

  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  if (windows.some((client) => client.visibilityState === "visible" && client.focused)) return;

  // The wording comes from the page, in the language on screen, and carries one
  // %d where the count of the day goes: more is due now than when it was sent.
  const many = String(schedule.many || "").replace("%d", String(count));
  await self.registration.showNotification(schedule.title || "Africa History Quest", {
    body: count === 1 ? schedule.one : many,
    icon: REVIEW_ICON,
    tag: REVIEW_TAG,
    data: { url: OFFLINE_URL },
  });
}

// Download the application itself plus the level photographs, once, at install.
// Each file is fetched on its own: one unreachable photo must not stop the app
// from becoming installable.
//
// The photographs are fetched with CORS first, so a failed one can be told
// apart from a good one and never enters the cache. The opaque fallback is only
// there for a host that would stop sending the CORS headers.
async function precache(url, crossOrigin) {
  const attempts = crossOrigin
    ? [{ mode: "cors", cache: "reload" }, { mode: "no-cors", cache: "reload" }]
    : [{ cache: "reload" }];

  for (const init of attempts) {
    try {
      const response = await fetch(new Request(url, init));
      if (!response || !(response.ok || response.type === "opaque")) continue;
      const cache = await caches.open(CACHE);
      await cache.put(url, response);
      return;
    } catch {
      // Offline on first run, or the host refused: try the next mode, then give up.
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await Promise.all([
        ...SHELL.map((url) => precache(url, false)),
        ...${JSON.stringify(remote)}.map((url) => precache(url, true)),
      ]);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(PREFIX) && name !== CACHE)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
      // A new version starts by putting the count back on the icon: the
      // schedule is still the one the last session left here.
      await refreshBadge();
    })()
  );
});

// Answers the request from the cache, by URL.
//
// The entries are written from plain URLs at install time, while a real request
// for a script, a stylesheet or a photograph arrives carrying the headers the
// browser itself adds, such as Accept-Encoding. When a server marks its
// responses with Vary, those extra headers make a byte-for-byte comparison miss
// and the offline copy is never found. Comparing on the URL removes the
// ambiguity: there is exactly one response per URL in this cache.
async function fromCache(request) {
  const cache = await caches.open(CACHE);
  const direct = await cache.match(request, { ignoreVary: true });
  if (direct) return direct;

  // Belt and braces, for an engine that would ignore the option above.
  const target = new URL(request.url).href;
  const keys = await cache.keys();
  const stored = keys.find((key) => key.url === target);
  return stored ? (await cache.match(stored)) || null : null;
}

// Files carry a content hash in their name, and the photographs never change,
// so the cached copy is always the right one.
// Only successful answers are kept: a photograph that is not in the catalogue
// and comes back as an error must not be remembered as a broken image.
async function cacheFirst(request) {
  const hit = await fromCache(request);
  if (hit) return hit;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE);
      // Keyed by URL, so a later match cannot be tripped up by request headers.
      await cache.put(request.url, response.clone());
    }
    return response;
  } catch {
    // Unreachable and not in the cache: report it the same way as a bad status.
    return Response.error();
  }
}

// Pages are read from the network first, so a new version shows up as soon as
// the player is online, and from the cache when there is no network at all.
async function navigation(request) {
  try {
    const response = await fetch(request);
    if (!response || !response.ok) throw new Error("unreachable");
    const cache = await caches.open(CACHE);
    await cache.put(OFFLINE_URL, response.clone());
    return response;
  } catch {
    const hit = await fromCache(new Request(OFFLINE_URL));
    return hit || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // The worker is updated by the browser itself and must never be served stale.
  if (url.origin === self.location.origin && url.pathname.endsWith("/sw.js")) return;

  if (request.mode === "navigate") {
    event.respondWith(navigation(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (IMAGE_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
});

// The schedule arrives from the page, which is the only thing that knows the
// answers and when they are due. The worker keeps it and counts it; it never
// works anything out on its own, so it cannot get the game wrong.
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "review-schedule") {
    event.waitUntil(keepSchedule(data).then(() => refreshBadge()));
  }
  if (data.type === "review-forget") {
    event.waitUntil(keepSchedule(null).then(() => refreshBadge()));
  }
});

// The wake-up the browser decides the rhythm of. This is the only moment the
// worker exists with no page open, so it is the only moment a reminder can
// reach a player who has closed the game.
self.addEventListener("periodicsync", (event) => {
  if (event.tag === REVIEW_TAG) event.waitUntil(remindIfDue());
});

// A tap on the notification brings the game forward, or opens it.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((client) => client.url.startsWith(self.registration.scope));
      if (open) return open.focus();
      const target = (event.notification.data && event.notification.data.url) || OFFLINE_URL;
      return self.clients.openWindow(target);
    })()
  );
});
`;
}

/** Vite plugin: writes dist/sw.js once the build output is on disk. */
export function offlineApp({ images = [] } = {}) {
  let root = process.cwd();
  let outDir = "dist";
  let base = "/";
  let building = false;

  return {
    name: "africa-quest-offline",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
      base = config.base;
      building = config.command === "build";
    },
    closeBundle() {
      if (!building) return;
      const target = path.resolve(root, outDir);
      // Read what the build actually produced, plus the files copied from
      // public/. sw.js is written last so it never lists itself, and the JPEG
      // fallbacks beside each light photograph are left to the network.
      const built = listBuiltFiles(target).filter((file) => !file.endsWith("/sw.js"));
      const shell = offlineShell(built);
      const fallbacks = built.length - shell.length;
      const remote = remoteImages(images);
      const source = createServiceWorkerSource({
        shell,
        images,
        base,
        // The cache name follows the files, not the path they are served under:
        // moving the site to another address downloads the worker from another
        // address, which is a fresh install whatever the cache is called.
        version: cacheVersion(offlineEntries({ shell, images })),
      });
      writeFileSync(path.join(target, "sw.js"), source, "utf8");
      // The photographs served from public/ are counted in the file list; only
      // the ones still held by a third party come from `images`. Each photograph
      // is counted once, under the format that was kept for it.
      const localPhotos = shell.filter((file) => file.startsWith("/photos/"));
      const inAvif = localPhotos.filter((file) => extensionOf(file) === "avif").length;
      const left = built.filter((file) => !shell.includes(file));
      const leftJpegs = left.filter((file) => /jpe?g$/.test(extensionOf(file))).length;
      const leftWebp = left.filter((file) => extensionOf(file) === "webp").length;
      const where = base === "/" ? "" : ` under ${base}`;
      const skipped =
        fallbacks > 0
          ? `; ${leftJpegs} JPEG and ${leftWebp} WebP fallbacks left to the network`
          : "";
      this.info?.(
        `offline: cached ${shell.length} files${where} (${localPhotos.length} photographs served locally, ` +
          `${inAvif} of them in AVIF${skipped}) and ${remote.length} remote`
      );
    },
  };
}
