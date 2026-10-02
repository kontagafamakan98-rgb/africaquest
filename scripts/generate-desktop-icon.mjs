/**
 * Writes the Windows icon into build/desktop/icon.ico, from the favicon.
 *
 *   node scripts/generate-desktop-icon.mjs          # regenerate it
 *   node scripts/generate-desktop-icon.mjs --check  # fail if it is out of date
 *
 * The installer takes its icon from this file, and the mark in it comes from the
 * same favicon the browser tab, the home screen and the link preview are drawn
 * from. So a change to favicon.svg makes this check fail until the file is
 * regenerated, and the icon on a desktop is never a version of the mark that the
 * other platforms have already moved past.
 *
 * The PNGs are rendered here, at each size Windows asks for, and packed by
 * `electron/icon.js`: the rasteriser is the application's own, reached from
 * src/lib/app-icons.js like the icon script's, so nothing about the mark is
 * described twice.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAVICON_FILE, readFaviconScene, renderIcon } from "../src/lib/app-icons.js";
import { ICO_SIZES, encodeIco } from "../electron/icon.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = path.join("build", "desktop", "icon.ico");
const check = process.argv.includes("--check");

const scene = readFaviconScene(readFileSync(path.join(ROOT, FAVICON_FILE), "utf8"));
const ico = encodeIco(ICO_SIZES.map((size) => ({ size, png: renderIcon(scene, { size }) })));
const kilobytes = (ico.length / 1024).toFixed(1);

if (check) {
  const written = path.join(ROOT, TARGET);
  if (!existsSync(written) || !readFileSync(written).equals(ico)) {
    console.error(`desktop icon (check): ${TARGET} is not what ${FAVICON_FILE} draws`);
    console.error("  run: npm run desktop:icon");
    process.exit(1);
  }

  console.log(`desktop icon (check): ${ICO_SIZES.length} sizes drawn from ${FAVICON_FILE}, ${kilobytes} KB, up to date`);
  process.exit(0);
}

mkdirSync(path.dirname(path.join(ROOT, TARGET)), { recursive: true });
writeFileSync(path.join(ROOT, TARGET), ico);
console.log(`desktop icon: ${ICO_SIZES.join(", ")} px drawn from ${FAVICON_FILE}, ${kilobytes} KB, written to ${TARGET}`);
