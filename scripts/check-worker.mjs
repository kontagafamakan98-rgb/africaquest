#!/usr/bin/env node
/**
 * What the built service worker says it will install.
 *
 * The worker is written by the build (build/offline-plugin.js), once the files it
 * lists are on disk. So this reads dist/sw.js rather than the plugin: the question
 * is what the build produced, not what the code that wrote it meant to. That is
 * why it is a step of its own, after the bundle, rather than a unit test - a test
 * that read an artifact of another step would fail on a fresh checkout, where the
 * unit tests run before there is anything in dist to read.
 *
 * Two things an install must not get wrong, and both are held here: the shell
 * carries the page a deep link is answered with and the thumbnails rather than the
 * full photographs, and the scripts it names are the entry chunk and the two ends
 * of the game, each marked as an asset written from the root of the host. The
 * chooser it reads those names with is the one the published site is checked with,
 * so what is asked for here is what the site check asks for there.
 *
 * Usage:
 *   node scripts/check-worker.mjs
 *   npm run verify        (the step that follows the build)
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { chosenScripts, precachedFrom } from "../src/lib/site-health.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKER = path.join(ROOT, "dist", "sw.js");

let source;
try {
  source = readFileSync(WORKER, "utf8");
} catch {
  console.error(
    "worker: there is no dist/sw.js to read. This step reads what the build wrote, so it runs\n" +
      "  after `vite build` (see scripts/verify.mjs). Build the site first:\n" +
      "    npm run build"
  );
  process.exit(1);
}

/** A fault, said and counted rather than thrown: all of them are worth reporting. */
const faults = [];
const check = (ok, why) => {
  if (!ok) faults.push(why);
};

const urls = precachedFrom(source);
console.log(`worker: ${urls.length} file(s) named by the installed worker`);

check(urls.length > 0, "the built worker names nothing it installs");
check(
  urls.includes("404.html") || urls.includes("/404.html"),
  "the page a deep link is answered with is not among the installed files"
);
check(
  urls.some((url) => /photos\/level-1-1-thumb\.webp$/.test(url)),
  "no thumbnail is installed, so the gallery is not carried offline"
);
check(
  !urls.some((url) => /photos\/level-1-1\.webp$/.test(url)),
  "the full photographs are installed on the first load after all"
);

const chosen = chosenScripts(urls);
const paths = chosen.map((entry) => entry.path);
check(chosen.length === 3, `the entry and the two ends of the game are ${chosen.length} script(s), not three`);
for (const entry of chosen) {
  check(entry.kind === "script", `an asset is asked for without saying what it is: ${entry.path}`);
  check(entry.absolute === true, `an asset is joined to the site's path a second time: ${entry.path}`);
  check(Boolean(entry.what), `an asset has nothing to say about itself: ${entry.path}`);
}
check(/\/assets\/index-[^/]+\.js$/.test(paths[0] ?? ""), "the entry chunk is not the first thing asked for");

// A thumbnail of the ninth level is also called `level-9-...`, which is why the
// chooser reads the scripts first and the photographs never: the two ends of the
// game are the first and the last script that carries a level.
const levels = paths.filter((entry) => /\/level-\d+/.test(entry));
check(levels.length === 2, `the two ends of the game are ${levels.length} script(s), not two`);
const ends = urls
  .filter((url) => /\.js$/.test(url) && /\/level-\d+/.test(url))
  .sort()
  .map((url) => url.split("/").pop());
check(
  JSON.stringify(levels.map((entry) => entry.split("/").pop())) ===
    JSON.stringify([ends[0], ends[ends.length - 1]]),
  "the scripts chosen are not the first and the last level of the game"
);

// The chooser itself, held here too: a worker that answered with something else,
// or with no list, chooses nothing, and that is the same fault as one that chose
// nothing at all.
check(chosenScripts([]).length === 0, "an empty list of files chooses something");
check(precachedFrom("<html>nothing here</html>").length === 0, "a page is read as a worker");
check(
  precachedFrom(source.replace("const SHELL = [", "const SHELL = [broken")).length === 0,
  "a worker with a broken list is read as a whole one"
);

if (faults.length > 0) {
  console.error(`\nworker: ${faults.length} fault(s) in what the build says it installs:`);
  for (const fault of faults) console.error(`  ${fault}`);
  process.exit(1);
}

console.log("\nworker: the install carries the deep link, the thumbnails and the two ends of the game");
