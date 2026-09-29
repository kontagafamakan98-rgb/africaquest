/**
 * Records the fingerprint of every photograph in the table that describes it.
 *
 *   node scripts/stamp-photos.mjs
 *
 * Run it whenever the pictures change: a fresh download, a re-encode, a picture
 * replaced by another one. The fingerprint is what ties a credit line to the
 * exact file the application serves, and `npm run verify` fails until the two
 * agree again.
 *
 * The pictures go through three steps, and this is the last one:
 *
 *   scripts/fetch-photos.mjs     downloads them from their free licence source
 *   scripts/optimize-photos.mjs  re-encodes them at the size the app draws them
 *   scripts/stamp-photos.mjs     records the bytes that came out of that
 *
 * Each photograph ships twice, and some of them three times: the AVIF a current
 * browser draws, the light WebP behind it, and the JPEG behind that. All of the
 * files that exist are fingerprinted, because the credit line has to belong to
 * the file a player is actually shown - which is the first of them there is.
 *
 * The thumbnail is pinned as well. It is not part of that chain - it is the same
 * picture again, smaller, for the one screen that draws it as a list - but it is
 * the copy of the picture that screen shows, so the credit line beside it has
 * the same claim on a fingerprint as the one under a lesson photograph.
 *
 * The AVIF fingerprint is also how the application knows a given picture has
 * one at all: a row without that line is a picture served as WebP, and asking a
 * browser for a missing AVIF would show no picture rather than the WebP behind
 * it. A row that describes an AVIF which is no longer on disk - the optimizer
 * takes one away when it stops being the lighter file - is reported and dropped
 * rather than left to claim a file nobody has.
 *
 * The fingerprints land in src/lib/level-images.js, beside the file each one
 * describes, so the table and the repository cannot drift apart unnoticed.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVEL_PHOTOS } from "../src/lib/level-images.js";
import { avifPath, thumbPath, webpPath } from "../src/lib/photo-formats.js";
import { fingerprint, stampFingerprints } from "../src/lib/photo-fingerprints.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TABLE = path.join(ROOT, "src", "lib", "level-images.js");

// Every file of a photograph is fingerprinted: the player is shown the lightest
// one that exists, and each of the others is what the one in front of it was
// made from.
const fingerprints = {};
const light = {};
const third = {};
const thumbs = {};
const dropped = [];
for (const photo of LEVEL_PHOTOS) {
  const file = path.join(ROOT, "public", photo.file.replace(/^\//, ""));
  const lightFile = path.join(ROOT, "public", webpPath(photo.file).replace(/^\//, ""));
  const avifFile = path.join(ROOT, "public", avifPath(photo.file).replace(/^\//, ""));
  const thumbFile = path.join(ROOT, "public", thumbPath(photo.file).replace(/^\//, ""));
  if (!existsSync(file)) {
    console.error(`stamp: ${photo.file} is missing. Run scripts/fetch-photos.mjs first.`);
    process.exit(1);
  }
  if (!existsSync(lightFile)) {
    console.error(
      `stamp: the light version of ${photo.file} is missing.\n` +
        "Run scripts/optimize-photos.mjs, which writes it beside the JPEG."
    );
    process.exit(1);
  }
  if (!existsSync(thumbFile)) {
    console.error(
      `stamp: the thumbnail of ${photo.file} is missing.\n` +
        "Run scripts/optimize-photos.mjs --light, which writes it beside the two others."
    );
    process.exit(1);
  }
  fingerprints[photo.file] = fingerprint(readFileSync(file));
  light[photo.file] = fingerprint(readFileSync(lightFile));
  thumbs[photo.file] = fingerprint(readFileSync(thumbFile));
  if (existsSync(avifFile)) {
    third[photo.file] = fingerprint(readFileSync(avifFile));
  } else if (photo.avifSha256) {
    dropped.push(photo.file);
  }
}

const source = readFileSync(TABLE, "utf8");
const stamped = stampFingerprints(source, fingerprints, light, third, thumbs);

if (stamped === source) {
  console.log(`stamp: ${LEVEL_PHOTOS.length} photographs already carry the fingerprints of the files served`);
  process.exit(0);
}

if (dropped.length > 0) {
  console.log(
    `stamp: ${dropped.length} photographs described an AVIF that is not on disk any more: ` +
      `${dropped.slice(0, 5).join(", ")}${dropped.length > 5 ? ` and ${dropped.length - 5} more` : ""}`
  );
}

const stale = LEVEL_PHOTOS.filter(
  (photo) =>
    photo.sha256 !== fingerprints[photo.file] ||
    photo.webpSha256 !== light[photo.file] ||
    photo.avifSha256 !== third[photo.file] ||
    photo.thumbSha256 !== thumbs[photo.file]
);
console.log(`stamp: ${stale.length} of ${LEVEL_PHOTOS.length} photographs in src/lib/level-images.js`);
for (const photo of stale.slice(0, 8)) {
  console.log(`  ${photo.file}: ${fingerprints[photo.file]}`);
}
if (stale.length > 8) console.log(`  and ${stale.length - 8} more`);

writeFileSync(TABLE, stamped);
