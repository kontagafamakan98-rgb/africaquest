/**
 * Writes the application icons into public/, from the favicon.
 *
 *   node scripts/generate-icons.mjs          # regenerate them
 *   node scripts/generate-icons.mjs --check  # fail if public/ is out of date
 *
 * The shapes come from public/favicon.svg, so the browser tab and the home
 * screen show the same mark: the favicon is read, not copied, and a change to
 * it makes this script fail the build until the icons are regenerated. The
 * rasteriser itself lives in src/lib/app-icons.js, where the tests can reach it.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FAVICON_FILE,
  ICON_TARGETS,
  SAFE_ZONE_REACH,
  readFaviconScene,
  renderIcon,
  safeZoneInset,
  safeZoneReach,
} from "../src/lib/app-icons.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const size = (target) => `${target.size}px${target.bleed ? " full bleed" : ""}`;

const scene = readFaviconScene(readFileSync(path.join(ROOT, FAVICON_FILE), "utf8"));
const encoded = ICON_TARGETS.map((target) => ({ target, png: renderIcon(scene, target) }));
const kilobytes = (encoded.reduce((total, { png }) => total + png.length, 0) / 1024).toFixed(1);

// The favicon is drawn for a tab, where nothing is cropped; a launcher crops
// its icon, so the maskable one pulls the mark back into the visible circle.
const reach = safeZoneReach(scene);
const inset = safeZoneInset(scene);
const scope =
  reach <= SAFE_ZONE_REACH
    ? `the mark reaches ${(reach * 100).toFixed(1)}% of the favicon, inside the ${(SAFE_ZONE_REACH * 100).toFixed(0)}% a launcher keeps`
    : `the mark reaches ${(reach * 100).toFixed(1)}% of the favicon, so the maskable icon draws it at ${(inset * 100).toFixed(0)}% to stay inside the ${(SAFE_ZONE_REACH * 100).toFixed(0)}% a launcher keeps`;

// Pulled any further back, the mark would read as a stamp in the middle of a
// large background rather than as an icon.
if (inset < 0.6) {
  console.error(`icons: ${scope}`);
  console.error("  the artwork is too large for a maskable icon: redraw the mark closer to the centre of favicon.svg");
  process.exit(1);
}

if (check) {
  const stale = encoded.filter(({ target, png }) => {
    const file = path.join(ROOT, "public", target.file);
    return !existsSync(file) || !readFileSync(file).equals(png);
  });

  if (stale.length > 0) {
    console.error(
      `icons (check): ${stale.length} of ${ICON_TARGETS.length} icons in public/ are not what ${FAVICON_FILE} draws: ${stale
        .map(({ target }) => target.file)
        .join(", ")}`
    );
    console.error("  run: npm run icons");
    process.exit(1);
  }

  console.log(
    `icons (check): ${ICON_TARGETS.length} icons drawn from ${FAVICON_FILE}, ${kilobytes} KB, all up to date`
  );
  console.log(`  ${scope}`);
  process.exit(0);
}

for (const { target, png } of encoded) {
  writeFileSync(path.join(ROOT, "public", target.file), png);
  console.log(`  ${target.file}: ${size(target)}, ${png.length} bytes`);
}
console.log(`icons: ${ICON_TARGETS.length} icons drawn from ${FAVICON_FILE}, ${kilobytes} KB`);
console.log(`  ${scope}`);
