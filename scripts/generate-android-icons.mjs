/**
 * Writes the Android launcher icons and the launch background into android/,
 * from the favicon.
 *
 *   node scripts/generate-android-icons.mjs          # regenerate them
 *   node scripts/generate-android-icons.mjs --check  # fail if android/ is out of date
 *
 * The artwork is the favicon's, read through the same rasteriser the browser
 * icons use (src/lib/app-icons.js), so the mark on a home screen and the mark in
 * a tab are the same shapes and cannot drift apart. A launcher crops an icon to
 * a shape of its own, so the adaptive foreground is drawn full bleed and pulled
 * inside the circle a launcher keeps, which is exactly what the maskable icon
 * does for the browser.
 *
 * The launch background the template ships is white, a flash of the wrong colour
 * in front of a game whose first screen is dark, so each splash is written flat
 * in the application's own colour at the size the template gave it.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAVICON_FILE, encodePng, readFaviconScene, renderIcon } from "../src/lib/app-icons.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const RES = path.join(ROOT, "android", "app", "src", "main", "res");
const check = process.argv.includes("--check");

/** The dark surface the installed application opens on, as its manifest says. */
const BACKGROUND = "#14100A";

// A launcher icon is 48dp and an adaptive foreground is 108dp, so the part a
// launcher crops away is still drawn rather than left blank.
const LAUNCHER = [
  ["mdpi", 48],
  ["hdpi", 72],
  ["xhdpi", 96],
  ["xxhdpi", 144],
  ["xxxhdpi", 192],
];
const FOREGROUND = [
  ["mdpi", 108],
  ["hdpi", 162],
  ["xhdpi", 216],
  ["xxhdpi", 324],
  ["xxxhdpi", 432],
];

const scene = readFaviconScene(readFileSync(path.join(ROOT, FAVICON_FILE), "utf8"));

/** The whole artwork, keeping the favicon's own rounded corners. */
const square = (size) => renderIcon(scene, { size, bleed: false });
/** The artwork full bleed, pulled inside the circle a launcher keeps. */
const cropped = (size) => renderIcon(scene, { size, bleed: true, safe: true });

/** One flat colour, as PNG bytes, for the surface a splash is drawn on. */
function flat(width, height, hex) {
  const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = r;
    pixels[index + 1] = g;
    pixels[index + 2] = b;
    pixels[index + 3] = 255;
  }
  return encodePng(width, height, pixels);
}

/** The width and height a PNG declares, read from the header it always carries. */
function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const written = [];
for (const [density, size] of LAUNCHER) {
  written.push({ file: `mipmap-${density}/ic_launcher.png`, png: square(size) });
  written.push({ file: `mipmap-${density}/ic_launcher_round.png`, png: cropped(size) });
}
for (const [density, size] of FOREGROUND) {
  written.push({ file: `mipmap-${density}/ic_launcher_foreground.png`, png: cropped(size) });
}

// The splash files the template ships, at the sizes it gave them: the drawable
// at the root, then one per density and orientation. They only ever hold a
// colour, and the colour is the application's.
for (const directory of readdirSync(RES).filter((name) => name.startsWith("drawable"))) {
  const splash = path.join(RES, directory, "splash.png");
  if (!existsSync(splash)) continue;
  const { width, height } = pngSize(readFileSync(splash));
  written.push({ file: `${directory}/splash.png`, png: flat(width, height, BACKGROUND) });
}

// The colour an adaptive icon falls back to behind its foreground, written here
// so that the background of an icon is the background of the application.
written.push({
  file: "values/ic_launcher_background.xml",
  text: `<resources>\n    <color name="ic_launcher_background">${BACKGROUND}</color>\n</resources>\n`,
});

let stale = 0;
for (const { file, png, text } of written) {
  const target = path.join(RES, file);
  const body = png ?? Buffer.from(text, "utf8");
  const current = existsSync(target) ? readFileSync(target) : null;
  if (check) {
    if (!current || !current.equals(body)) {
      console.error(`android-icons: ${file} is out of date`);
      stale += 1;
    }
    continue;
  }
  writeFileSync(target, body);
}

if (check && stale > 0) {
  console.error(`android-icons: ${stale} file(s) no longer match the favicon. Run npm run android:icons.`);
  process.exit(1);
}
if (check) console.log(`android-icons: ${written.length} file(s) match the favicon`);
else console.log(`android-icons: wrote ${written.length} file(s) into android/ from the favicon`);
