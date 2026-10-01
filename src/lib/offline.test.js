import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { inflateSync } from "node:zlib";
import {
  CACHE_PREFIX,
  cacheVersion,
  createServiceWorkerSource,
  listBuiltFiles,
  offlineEntries,
  offlineShell,
  thumbnailOf,
} from "../../build/offline-plugin.js";
import { FALLBACK_FILE } from "../../build/pages-fallback.js";
import {
  LEVEL_GALLERIES,
  LEVEL_IMAGE_URLS,
  LEVEL_IMAGES,
  LEVEL_PHOTOS,
  REMOTE_IMAGE_URLS,
  photoCredit,
  photoSourcePage,
} from "./level-images.js";
import { registerOffline, watchForUpdates } from "./offline.js";
import { avifPath, thumbPath, webpPath } from "./photo-formats.js";
import { LEVELS } from "../components/game/gameData.js";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const manifest = JSON.parse(readFileSync(path.join(PUBLIC_DIR, "manifest.json"), "utf8"));
const indexHtml = readFileSync(path.join(ROOT, "index.html"), "utf8");

const paeth = (left, up, upLeft) => {
  const estimate = left + up - upLeft;
  const distances = [Math.abs(estimate - left), Math.abs(estimate - up), Math.abs(estimate - upLeft)];
  if (distances[0] <= distances[1] && distances[0] <= distances[2]) return left;
  return distances[1] <= distances[2] ? up : upLeft;
};

/**
 * A real PNG reader, filters included. The point is to check the icons the app
 * actually ships rather than trusting their file names: dimensions, the emblem
 * being drawn, and the transparent corners of the rounded tile.
 */
function decodePng(file) {
  const buffer = readFileSync(file);
  assert.equal(buffer.subarray(0, 8).toString("binary"), "\u0089PNG\r\n\u001a\n", `${file} is a PNG`);

  let offset = 8;
  let header = null;
  const parts = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], colorType: data[9] };
    }
    if (type === "IDAT") parts.push(data);
    offset += 12 + length;
  }

  assert.ok(header, `${file} carries an IHDR chunk`);
  assert.equal(header.depth, 8, `${file} is 8 bits per channel`);
  assert.equal(header.colorType, 6, `${file} is truecolour with alpha`);

  const bytesPerPixel = 4;
  const stride = header.width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(parts));
  const pixels = Buffer.alloc(stride * header.height);

  for (let y = 0; y < header.height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytesPerPixel ? pixels[y * stride + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[(y - 1) * stride + x - bytesPerPixel] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += Math.floor((left + up) / 2);
      else if (filter === 4) value += paeth(left, up, upLeft);
      pixels[y * stride + x] = value & 0xff;
    }
  }

  const at = (x, y) => {
    const index = y * stride + x * bytesPerPixel;
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
  };

  return { ...header, at, pixels };
}

test("the manifest carries everything a browser needs to install the app", () => {
  assert.equal(manifest.name, "Africa History Quest");
  assert.ok(manifest.short_name && manifest.short_name.length <= 12, "a launcher needs a short name");

  // Addressed relative to the manifest itself, so an install under a path (a
  // project site on GitHub Pages lives under its repository name) points at the
  // application rather than at the root of the domain, and one served from a
  // domain root points at exactly the same place.
  const manifestUrl = "https://example.test/repository/manifest.json";
  for (const field of ["id", "start_url", "scope"]) {
    assert.ok(!manifest[field].startsWith("/"), `${field} is not tied to the root of a domain`);
    assert.equal(new URL(manifest[field], manifestUrl).pathname, "/repository/", `${field} is the app itself`);
  }
  assert.ok(["standalone", "fullscreen", "minimal-ui"].includes(manifest.display));
  assert.match(manifest.theme_color, /^#[0-9a-f]{6}$/i);
  assert.match(manifest.background_color, /^#[0-9a-f]{6}$/i);
  assert.ok(manifest.description && manifest.description.length > 20);
});

test("the browser chrome matches the app background", () => {
  // A different colour here makes the browser band and the splash screen flash
  // while the game starts, which is the first thing an installed user sees.
  const themeColor = indexHtml.match(/name="theme-color"\s+content="(#[0-9a-f]{6})"/i);
  assert.ok(themeColor, "index.html declares a theme colour");
  assert.equal(themeColor[1].toLowerCase(), manifest.theme_color.toLowerCase());
  assert.equal(manifest.background_color.toLowerCase(), manifest.theme_color.toLowerCase());
});

test("the manifest lists the icon sizes an installer insists on", () => {
  const declared = manifest.icons.map((icon) => icon.sizes);
  assert.ok(declared.includes("192x192"), "a 192px icon is required");
  assert.ok(declared.includes("512x512"), "a 512px icon is required");
  assert.ok(
    manifest.icons.some((icon) => icon.purpose === "maskable" && icon.sizes === "512x512"),
    "a maskable 512px icon keeps the mark inside Android's safe zone"
  );
  for (const icon of manifest.icons) {
    assert.ok(!icon.src.startsWith("/"), `${icon.src} is not tied to the root of a domain`);
    assert.ok(existsSync(path.join(PUBLIC_DIR, path.basename(icon.src))), `${icon.src} exists`);
    assert.equal(
      new URL(icon.src, "https://example.test/repository/manifest.json").pathname,
      `/repository/${icon.src}`,
      `${icon.src} travels with the manifest`
    );
  }
});

test("the shipped icons are real images of the declared size", () => {
  const pngs = manifest.icons.filter((icon) => icon.type === "image/png");
  assert.ok(pngs.length >= 3);

  for (const icon of pngs) {
    const [width, height] = icon.sizes.split("x").map(Number);
    const image = decodePng(path.join(PUBLIC_DIR, path.basename(icon.src)));
    assert.equal(image.width, width, `${icon.src} width`);
    assert.equal(image.height, height, `${icon.src} height`);

    // A flat colour would mean the generator silently produced a blank tile.
    // Every pixel is read: the favicon is drawn in flat colours, so the shades
    // that prove something was drawn are the antialiased edges alone.
    const colors = new Set();
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width; x += 1) {
        colors.add(image.at(x, y).join(","));
      }
    }
    assert.ok(colors.size > 40, `${icon.src} is a drawn image, not a flat square`);

    // The favicon's scene has to be there, where the favicon draws it: the
    // ground band, and the trunk of the acacia across the middle. A blank tile,
    // or a drawing that drifted, would pass a size check on its own.
    const at = (x, y) => image.at(Math.round(x * (image.width - 1)), Math.round(y * (image.height - 1)));
    const tinted = (pixel, [r, g, b], label) => {
      const off = Math.max(Math.abs(pixel[0] - r), Math.abs(pixel[1] - g), Math.abs(pixel[2] - b));
      assert.ok(off <= 12, `${icon.src}: ${label} is not where the favicon draws it (${pixel.slice(0, 3).join(",")})`);
    };

    tinted(at(0.25, 0.8), [47, 125, 79], "the ground");
    tinted(at(0.5, 0.52), [28, 17, 9], "the trunk");

    if (icon.purpose !== "maskable") {
      // The sun belongs to the mark, which a maskable icon draws smaller so a
      // launcher cannot crop it; everywhere else it sits where the favicon puts it.
      tinted(at(0.5, 0.22), [227, 167, 46], "the sun");
    }
  }
});

test("the rounded icon is transparent at its corners and the maskable one is not", () => {
  const rounded = decodePng(path.join(PUBLIC_DIR, "icon-512.png"));
  assert.equal(rounded.at(0, 0)[3], 0, "rounded corners are transparent");
  assert.equal(rounded.at(256, 256)[3], 255, "the middle is opaque");

  // Android crops a maskable icon to whatever shape the launcher uses, so it
  // must reach every edge: transparent corners would show through as black.
  const maskable = decodePng(path.join(PUBLIC_DIR, "icon-maskable-512.png"));
  for (const [x, y] of [[0, 0], [511, 0], [0, 511], [511, 511]]) {
    assert.equal(maskable.at(x, y)[3], 255, `maskable icon is opaque at ${x},${y}`);
  }
});

test("the touch icon is full bleed, the way iOS expects", () => {
  const touch = decodePng(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  assert.equal(touch.width, touch.height);
  assert.equal(touch.at(0, 0)[3], 255);
  assert.match(indexHtml, /rel="apple-touch-icon"[^>]+href="\/apple-touch-icon\.png"/);
});

test("the page declares the manifest and the installable app flags", () => {
  assert.match(indexHtml, /rel="manifest"[^>]+href="\/manifest\.json"/);
  assert.match(indexHtml, /name="mobile-web-app-capable"\s+content="yes"/);
  assert.match(indexHtml, /name="apple-mobile-web-app-capable"\s+content="yes"/);
});

test("no level photograph is fetched from a third party any more", () => {
  // The game must not depend on a CDN: every photograph is a file of ours.
  assert.deepEqual(REMOTE_IMAGE_URLS, [], "nothing is left to fetch from outside");
  // Every level of the timeline carries its own photographs now, so what is
  // checked here is that each picture belongs to a real level, that the whole
  // twenty of them are illustrated, and that none was lost on the way.
  assert.equal(LEVEL_PHOTOS.length, 78, "no photograph leaves the list");
  const photographed = [...new Set(LEVEL_PHOTOS.map((photo) => photo.level))];
  assert.deepEqual(
    photographed,
    Array.from({ length: 26 }, (_, index) => index + 1),
    "the illustrated levels, in id order"
  );
  const shippedLevels = new Set(LEVELS.map((level) => level.id));
  photographed.forEach((id) => assert.ok(shippedLevels.has(id), `level ${id} exists in the game`));

  for (const photo of LEVEL_PHOTOS) {
    const where = `${photo.file} (${photo.caption.en})`;
    assert.ok(photo.file.startsWith("/photos/"), `${where} is served from /photos`);
    assert.ok(photo.licence.length > 2, `${where} names its licence`);
    assert.ok(photo.collection.length > 2, `${where} names where it came from`);

    if (photo.commonsTitle) {
      // A Commons file is fetched by name, so the script can ask the API for it
      // and refuse to save anything whose licence no longer matches.
      assert.equal(photo.collection, "Wikimedia Commons", `${where} comes from Commons`);
      assert.ok(photo.author, `${where} names its author`);
      assert.ok(Number.isInteger(photo.width) && photo.width > 0, `${where} asks for a width`);
    } else {
      assert.match(photo.origin, /^https:\/\//, `${where} has an origin to download from`);
    }
  }
  assert.equal(new Set(LEVEL_IMAGE_URLS).size, LEVEL_IMAGE_URLS.length, "no duplicates");
});

test("the photographs are really on disk, as usable images", () => {
  for (const photo of LEVEL_PHOTOS) {
    const file = path.join(ROOT, "public", photo.file.replace(/^\//, ""));
    assert.ok(existsSync(file), `${photo.file} is part of the repository`);
    const buffer = readFileSync(file);
    // A saved error page or an empty file would still be "present".
    assert.deepEqual([...buffer.subarray(0, 3)], [0xff, 0xd8, 0xff], `${photo.file} is a JPEG`);
    assert.ok(buffer.length > 20 * 1024, `${photo.file} is a real photograph, not a thumbnail placeholder`);
  }
});

test("the install carries the thumbnails, and leaves the photographs to the levels", () => {
  // What is installed offline is one thumbnail per photograph, which is what the
  // list of credits draws: about a sixth of a megabyte, against two and a half
  // for the whole gallery. A full photograph is fetched the first time its level
  // is opened and cached from then on, so the offline copy is complete for the
  // levels a player has really opened rather than for the ones they never did.
  const onDisk = (file) => path.join(ROOT, "public", file.replace(/^\//, ""));
  const size = (file) => statSync(onDisk(file)).size;
  const photos = readdirSync(path.join(ROOT, "public", "photos")).map((name) => `/photos/${name}`);
  const shell = offlineShell(photos);
  const installed = new Set(shell);

  for (const photo of LEVEL_PHOTOS) {
    assert.ok(installed.has(thumbPath(photo.file)), `${photo.file}: the thumbnail of the list of credits`);
    for (const full of [avifPath(photo.file), webpPath(photo.file), photo.file]) {
      assert.ok(!installed.has(full), `${photo.file}: a full photograph is not installed up front`);
    }
  }
  assert.equal(shell.length, LEVEL_PHOTOS.length, "one thumbnail per photograph, and nothing else");
  assert.ok(shell.every((file) => /-thumb\.webp$/.test(file)), "and what is installed is a thumbnail");

  const bytes = shell.reduce((total, file) => total + size(file), 0);
  const megabytes = bytes / 1024 / 1024;
  assert.ok(
    megabytes < 0.5,
    `the thumbnails weigh ${megabytes.toFixed(2)} MB, which is more than the install should carry`
  );
});

test("every author and licence is credited in the terms, in both languages", () => {
  const terms = readFileSync(path.join(ROOT, "src", "pages", "TermsOfService.jsx"), "utf8");
  const split = terms.indexOf("\n  fr: {");
  assert.ok(split > 0, "the terms hold an english section then a french one");
  const english = terms.slice(0, split);
  const french = terms.slice(split);

  for (const photo of LEVEL_PHOTOS) {
    const holder = photo.author || photo.collection;
    assert.ok(english.includes(holder), `${photo.file}: the english credits name ${holder}`);
    assert.ok(french.includes(holder), `${photo.file}: the french credits name ${holder}`);
    assert.ok(english.includes(photo.licence), `${photo.file}: the english credits name ${photo.licence}`);
    // "Public domain" is the only licence whose name is written in french.
    const licenceFr = photo.licenceFr || photo.licence;
    assert.ok(french.includes(licenceFr), `${photo.file}: the french credits name ${licenceFr}`);
  }
});

test("each illustrated level shows captioned photographs of its own", () => {
  const levels = Object.keys(LEVEL_GALLERIES).map(Number).sort((a, b) => a - b);
  const shippedLevels = LEVELS.map((level) => level.id);
  levels.forEach((id) => assert.ok(shippedLevels.includes(id), `level ${id} exists in the game`));
  assert.deepEqual(levels, [...shippedLevels].sort((a, b) => a - b), "every level of the game has a gallery");

  for (const [level, photos] of Object.entries(LEVEL_GALLERIES)) {
    assert.ok(photos.length >= 2 && photos.length <= 3, `level ${level} shows two or three pictures`);
    const files = photos.map((photo) => photo.file);
    assert.equal(new Set(files).size, files.length, `level ${level} shows no picture twice`);

    for (const photo of photos) {
      assert.ok(photo.caption.en.trim().split(/\s+/).length >= 5, `${photo.file} has a real english caption`);
      assert.ok(photo.caption.fr.trim().split(/\s+/).length >= 5, `${photo.file} has a real french caption`);
      // A caption copied from one language into the other would be no caption.
      assert.notEqual(photo.caption.en, photo.caption.fr, `${photo.file} is captioned in both languages`);
      assert.ok(photoCredit(photo).length > 3, `${photo.file} carries a credit line`);
    }
  }

  // The main picture of a level is the first of its gallery: one photograph per
  // level on the cards, three in the lesson.
  for (const [level, photos] of Object.entries(LEVEL_GALLERIES)) {
    assert.equal(LEVEL_IMAGES[level], photos[0].file);
  }
});

test("a credit line names the author and the licence, and translates the licence", () => {
  const [plain] = LEVEL_PHOTOS.filter((photo) => photo.licence === "Public domain");
  assert.equal(photoCredit(plain, "en"), `${plain.author} · Public domain · Wikimedia Commons`);
  assert.equal(photoCredit(plain, "fr"), `${plain.author} · domaine public · Wikimedia Commons`);

  const withoutAuthor = LEVEL_PHOTOS.find((photo) => !photo.author);
  assert.equal(photoCredit(withoutAuthor, "en"), "Unsplash", "a source without a name is not repeated");
});

test("a photograph points back to the page it came from", () => {
  for (const photo of LEVEL_PHOTOS) {
    const page = photoSourcePage(photo);
    assert.match(page, /^https:\/\/(commons\.wikimedia\.org\/wiki\/File:|images\.unsplash\.com)/, `${photo.file} has a source page`);
  }
  const onCommons = LEVEL_PHOTOS[1];
  assert.match(photoSourcePage(onCommons), /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
});

test("the locally served photographs are precached with the rest of the app", () => {
  const shell = ["/index.html", "/photos/level-1.jpg", "/photos/level-2.jpg"];
  const source = createServiceWorkerSource({ shell, images: [], version: "test" });
  for (const file of shell) {
    assert.ok(source.includes(JSON.stringify(file)), `the worker downloads ${file}`);
  }
});

test("a local file is never listed twice, and a remote one is not listed as a file", () => {
  const entries = offlineEntries({ shell: ["/index.html"], images: ["/photos/level-1.jpg", "https://example.test/a.jpg"] });
  assert.deepEqual(entries, ["/index.html", "https://example.test/a.jpg"]);
  const source = createServiceWorkerSource({ shell: ["/index.html"], images: ["/photos/level-1.jpg"], version: "v" });
  assert.ok(!source.includes("precache(\"/photos/level-1.jpg\", true)"), "a local file is not fetched as a remote photo");
});

test("the worker fetches the whole application up front", () => {
  const shell = ["/index.html", "/assets/index-abc123.js", "/assets/index-def456.css", "/manifest.json"];
  const source = createServiceWorkerSource({ shell, images: [], version: "abc1234567" });

  for (const file of shell) {
    assert.ok(source.includes(JSON.stringify(file)), `${file} is precached`);
  }
  assert.ok(source.includes(`${CACHE_PREFIX}-abc1234567`), "the cache name carries the build version");
  assert.ok(source.includes("skipWaiting"), "a new build takes over instead of waiting");
  assert.ok(source.includes("clients.claim"), "the worker controls the open page");
  assert.ok(source.includes("caches.delete"), "the previous cache is dropped on activation");
  assert.ok(source.includes('addEventListener("fetch"'), "requests are answered from the cache");
  assert.ok(source.includes('addEventListener("install"'));
  assert.ok(source.includes('addEventListener("activate"'));
  assert.ok(source.includes("request.mode === \"navigate\""), "pages get their own strategy");
});

test("the worker asks for the application under the path the site is served from", () => {
  // A project site on GitHub Pages lives under /repository, and a worker that
  // asked for /index.html there would fetch the wrong page or nothing at all.
  // The same build served from a domain root must be left alone.
  const shell = ["/index.html", "/photos/level-1-1.jpg", "/assets/index-abc123.js"];
  const under = createServiceWorkerSource({ shell, images: [], version: "v", base: "/repository/" });

  assert.ok(under.includes('const BASE = "/repository/"'), "the worker says where it was built for");
  for (const file of shell) {
    assert.ok(under.includes(`"/repository${file}"`), `${file} is asked for under the base`);
  }
  assert.ok(under.includes('const OFFLINE_URL = "/repository/index.html"'), "and so is the offline page");
  assert.ok(!under.includes('"/index.html"'), "nothing is fetched from the root of the domain");

  const atRoot = createServiceWorkerSource({ shell, images: [], version: "v" });
  assert.ok(atRoot.includes('const BASE = "/"'), "a build with no base says so");
  assert.ok(atRoot.includes('const OFFLINE_URL = "/index.html"'), "and keeps the paths it always had");
});

test("a cached file is found whatever headers the request carries", () => {
  // The trap that broke the first working version: a module script or a
  // stylesheet arrives with headers the browser added, such as Origin, and the
  // server answers with "Vary: Origin". A plain cache.match then compares those
  // headers against the entry written at install time and misses, so the app
  // came up blank offline while the cache was in fact full.
  const source = createServiceWorkerSource({ shell: ["/index.html"], images: [], version: "v" });
  assert.ok(source.includes("ignoreVary: true"), "the cache is searched ignoring Vary");
  assert.ok(source.includes("keys.find((key) => key.url === target)"), "with a fallback on the URL alone");
  assert.ok(source.includes("cache.put(request.url"), "new entries are keyed by URL, not by request");
});

test("a page opened offline falls back to the cached application", () => {
  const source = createServiceWorkerSource({ shell: ["/index.html"], images: [], version: "v" });
  assert.ok(source.includes('const OFFLINE_URL = "/index.html"'));
  assert.ok(source.includes("await fromCache(new Request(OFFLINE_URL))"));
  // The worker must never hand out an old copy of itself.
  assert.ok(source.includes('pathname.endsWith("/sw.js")'));
  // One unreachable photo must not cancel the installation.
  assert.ok(source.includes("catch {"));
});

test("the cache version follows the content of the build", () => {
  const first = cacheVersion(["/index.html", "/assets/a.js"]);
  assert.equal(first, cacheVersion(["/assets/a.js", "/index.html"]), "order does not matter");
  assert.notEqual(first, cacheVersion(["/index.html", "/assets/b.js"]), "a changed file changes the version");
  assert.notEqual(first, cacheVersion(["/index.html", "/assets/a.js", "/assets/extra.css"]));
  assert.match(first, /^[0-9a-f]{10}$/);
});

test("the file list used for precaching is read from the real directory", () => {
  const files = listBuiltFiles(PUBLIC_DIR);
  for (const name of ["/manifest.json", "/favicon.svg", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"]) {
    assert.ok(files.includes(name), `${name} would be precached`);
  }
  assert.ok(files.every((file) => file.startsWith("/")), "paths are absolute, as the cache expects");
});

test("only the thumbnail of a photograph is installed, the picture itself waits", () => {
  // The rule reads the files themselves rather than a list of names, so a
  // photograph added to the game is covered the day it is added, and nothing
  // that is not a photograph is ever dropped: the install must not lose a file
  // it needs to start at all.
  const files = [
    "/index.html",
    "/assets/index-abc123.js",
    "/manifest.json",
    "/photos/level-1-1.jpg",
    "/photos/level-1-1.webp",
    "/photos/level-1-1.avif",
    "/photos/level-1-1-thumb.webp",
    "/photos/level-1-1-card.webp",
    "/photos/level-2-1.jpg",
  ];
  assert.deepEqual(offlineShell(files), [
    "/index.html",
    "/assets/index-abc123.js",
    "/manifest.json",
    "/photos/level-1-1-thumb.webp",
  ]);

  // The card-sized copy is the same photograph again, drawn smaller by the map:
  // it is fetched when a card is drawn, like the rest of the picture, and the
  // thumbnail that stands for it is already installed.
  assert.deepEqual(offlineShell(["/photos/level-1-1-card.webp"]), []);
  assert.equal(thumbnailOf("/photos/level-1-1-card.webp"), "/photos/level-1-1-thumb.webp");
  assert.equal(thumbnailOf("/photos/level-1-1.avif"), "/photos/level-1-1-thumb.webp");

  // A picture with no thumbnail is left to the network whole: installing a full
  // photograph nobody asked for is the cost this rule exists to avoid.
  assert.deepEqual(offlineShell(["/photos/level-9-1.jpg"]), []);

  // The rule is about photographs and their thumbnails, not about every
  // extension: a file that is not a photograph keeps its place.
  assert.deepEqual(offlineShell(["/photos/plan.png", "/photos/plan.webp"]), ["/photos/plan.png"]);
});

test("a built application ships the worker the configuration asks for", (t) => {
  const dist = path.join(ROOT, "dist");
  if (!existsSync(path.join(dist, "index.html"))) {
    t.skip("run npm run build first");
    return;
  }

  const worker = readFileSync(path.join(dist, "sw.js"), "utf8");
  // The build may have been told to serve the site under a path, the way a
  // project site on GitHub Pages is; the worker then asks for the same files
  // with that prefix. It says which path it was built for, and that is what is
  // read back here rather than guessed.
  const base = /^const BASE = "([^"]*)";$/m.exec(worker)?.[1];
  assert.ok(
    base !== undefined,
    "the worker on disk was written by an older build: run npm run build, then this again"
  );

  // A deep link such as /privacy is not a file, and a static host answers it
  // with 404.html. The build writes that copy, and it is listed with the rest,
  // so an installed copy reaches the application from a deep link with no
  // network as well.
  const fallback = path.join(dist, FALLBACK_FILE);
  assert.ok(existsSync(fallback), "the build writes the page an unknown path is answered with");
  assert.ok(
    readFileSync(fallback).equals(readFileSync(path.join(dist, "index.html"))),
    "and it is the application itself"
  );

  // Everything the build produced has to be listed, otherwise the installed app
  // would come up incomplete the first time it runs without a network. The one
  // exception is the files a device never draws: each photograph is installed in
  // the lightest format that exists for it, and the others stay on the network.
  const built = listBuiltFiles(dist).filter((file) => !file.endsWith("/sw.js"));
  const shell = offlineShell(built);
  for (const file of shell) {
    const served = `${base}${file.replace(/^\//, "")}`;
    assert.ok(worker.includes(JSON.stringify(served)), `${served} is missing from the precache list`);
  }

  const leftOut = built.filter((file) => !shell.includes(file));
  assert.ok(leftOut.length > 0, "this build leaves the full photographs to the levels");
  for (const file of leftOut) {
    assert.ok(
      /\.(avif|jpe?g|webp)$/i.test(file),
      `${file} is not a photograph format that could be left to the network`
    );
    assert.ok(
      shell.includes(thumbnailOf(file)),
      `${file} is left out and its thumbnail is not installed`
    );
    assert.ok(
      !worker.includes(JSON.stringify(`${base}${file.replace(/^\//, "")}`)),
      `${file} is a full photograph and is not downloaded in advance`
    );
  }
  assert.ok(worker.includes(JSON.stringify(`${base}index.html`)), "the offline page is the app itself");

  const version = cacheVersion(offlineEntries({ shell, images: LEVEL_IMAGE_URLS }));
  assert.ok(worker.includes(`${CACHE_PREFIX}-${version}`), "the cache name matches this build");
});

/** A browser that can be told a worker has taken over. */
function serviceWorkerContainer(controller) {
  const listeners = new Set();
  return {
    controller,
    addEventListener(type, listener) {
      if (type === "controllerchange") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "controllerchange") listeners.delete(listener);
    },
    /** Whatever the browser does when a new worker claims the open pages. */
    takeover() {
      listeners.forEach((listener) => listener());
    },
    listening() {
      return listeners.size;
    },
  };
}

test("a new version taking over is announced, and a first install is not", () => {
  // A first visit starts with no controller at all, and the worker that arrives
  // is the application installing itself rather than replacing anything.
  // Calling that an update would greet every new reader with a reload prompt.
  const first = serviceWorkerContainer(null);
  const greetings = [];
  watchForUpdates(() => greetings.push("ready"), first);
  first.takeover();
  assert.deepEqual(greetings, [], "nothing is announced to somebody who just arrived");

  // A page that is already served by a worker, and a new one takes over: that
  // is the version gap the reader has to hear about, because the page keeps
  // running the code it was loaded with until it is reloaded.
  const installed = serviceWorkerContainer({ scriptURL: "/sw.js" });
  const alerts = [];
  watchForUpdates(() => alerts.push("ready"), installed);
  installed.takeover();
  assert.deepEqual(alerts, ["ready"], "the takeover is announced once");
});

test("the announcement can be stopped, and a browser without workers is left alone", () => {
  const container = serviceWorkerContainer({ scriptURL: "/sw.js" });
  const alerts = [];
  const stop = watchForUpdates(() => alerts.push("ready"), container);

  assert.equal(container.listening(), 1, "the watcher is attached");
  stop();
  assert.equal(container.listening(), 0, "and detached");
  container.takeover();
  assert.deepEqual(alerts, [], "with nothing left behind to fire");

  // Development builds and old browsers have no service worker at all, and the
  // page must still be able to ask to watch without anything throwing.
  for (const target of [null, undefined, {}]) {
    const nothing = watchForUpdates(() => {}, target);
    assert.equal(typeof nothing, "function", "a stop function is always returned");
    assert.doesNotThrow(() => nothing());
  }
});

test("the browser is asked for a new version when the app comes back to the front", () => {
  // A browser looks for a new version of the worker when a page is loaded and at
  // no other time, so an installed application left open on a phone would go on
  // showing an old copy for days.
  const source = readFileSync(path.join(ROOT, "src", "lib", "offline.js"), "utf8");
  assert.match(source, /document\.addEventListener\("visibilitychange"/, "the page watches for coming back");
  assert.match(source, /document\.visibilityState === "visible"/, "and asks only when it is really in front");
  assert.match(source, /registered\.update\(\)\.catch\(\(\) => \{\}\)/, "a failed check is not a broken app");
  assert.match(source, /controllerchange/, "a takeover is what the offer to reload follows");
});

test("offline support stays out of the way outside a production build", () => {
  // Under Node there is no window and no service worker API: the app must not
  // crash, and the registration must simply do nothing.
  assert.equal(registerOffline(), null);

  const source = readFileSync(path.join(ROOT, "src", "lib", "offline.js"), "utf8");
  // Beside the application, wherever the application is served from: a worker
  // registered at the root of the domain would, under a path, belong to another
  // site entirely.
  assert.match(source, /WORKER_URL = `\$\{basePath\(\)\}sw\.js`/, "the worker lives beside the app");
  assert.match(source, /scope: basePath\(\)/, "and claims only the directory it was installed from");
  assert.match(source, /from "\.\/base-path\.js"/, "following the path the build was given");
  assert.ok(source.includes("import.meta.env"), "development builds skip the worker");
  const main = readFileSync(path.join(ROOT, "src", "main.jsx"), "utf8");
  assert.ok(main.includes("registerOffline()"), "the app registers it on start");

  const config = readFileSync(path.join(ROOT, "vite.config.js"), "utf8");
  assert.ok(config.includes("offlineApp"), "the worker is generated by the build");
  assert.ok(config.includes("level-images.js"), "the photograph list is read from one place");
  assert.ok(config.includes("REMOTE_IMAGE_URLS"), "only what is still remote is precached over the network");
});
