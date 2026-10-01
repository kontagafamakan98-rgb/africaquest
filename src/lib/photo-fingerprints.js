/**
 * The fingerprint of each photograph: the bytes the application serves.
 *
 * A credit line says who made a picture and under what licence it may be used,
 * and the file name says nothing at all: a picture can be replaced by another,
 * re-encoded, or cropped, and every check in the project would still pass while
 * an author is credited for work they did not make, or for a version they never
 * published.
 *
 * So every row of the photograph table carries the sha256 of the file that
 * ships. scripts/stamp-photos.mjs writes it there from the files on disk, and a
 * test reads it back, which is what makes the credit belong to one exact set of
 * bytes rather than to a path that anybody could have changed.
 *
 * Three or four fingerprints cover each photograph: the JPEG that ships, the
 * light WebP drawn beside it, the AVIF in front of that one where it earned its
 * place, and the thumbnail the list of credits draws. The AVIF is the file the
 * reader is actually shown in a lesson, so pinning only the JPEG would tie a
 * credit line to a file nobody receives; the thumbnail is the file that same
 * reader is shown on the credits screen, and it is pinned for the same reason.
 *
 * They cover the served files, not the download: the pictures are re-encoded by
 * scripts/optimize-photos.mjs, so what Commons hands over and what a player
 * receives are two different files. What has to be pinned is what the player
 * receives. The download side is pinned by `commonsTitle`, or by
 * `origin` for the stock photograph: the fetch script asks for that exact file
 * and refuses it when the licence no longer matches the row.
 *
 * Plain module: the stamping script and the tests both read it, and it never
 * writes anything itself.
 */
import { createHash } from "node:crypto";

/** The fingerprint of a file: what it is, byte for byte. */
export function fingerprint(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

/** A row of the table, as it is written. */
const FILE_LINE = /^ {4}file: "(\/photos\/[^"]+)",$/;
const FINGERPRINT_LINE = /^ {4}(?:sha256|webpSha256|avifSha256|thumbSha256|cardSha256): "[^"]*",$/;

/**
 * The table, with the fingerprint of each photograph written under its file.
 *
 * `fingerprints` maps a served path, as the table writes it, to the sha256 of
 * the JPEG that ships. `light` maps the same paths to the sha256 of the WebP
 * drawn beside it, `avif` to the sha256 of the AVIF in front of that one for
 * the photographs that have one, `thumb` to the sha256 of the small copy the
 * list of credits draws, and `card` to the sha256 of the copy the cards of the
 * map are drawn from. Each is written as the next line.
 *
 * They are pinned because the player is shown the lightest of them: pinning
 * only the file it was made from would tie a credit line to bytes nobody
 * receives, which is the very thing these fingerprints exist to prevent.
 *
 * A line with no hash is left out, which is what tells the application that this
 * particular picture has no AVIF: asking a browser for a file that is not there
 * does not fall back to the one behind it, it shows nothing at all.
 *
 * The result is deterministic: stamping a table that already carries the right
 * fingerprints hands it back unchanged, so a stale one shows up as a diff
 * instead of being rewritten in place on every run.
 */
export function stampFingerprints(source, fingerprints = {}, light = {}, avif = {}, thumb = {}, card = {}) {
  const lines = String(source).split("\n");
  const stamped = [];
  const written = new Set();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    stamped.push(line);

    const file = FILE_LINE.exec(line)?.[1];
    if (!file) continue;

    const hash = fingerprints[file];
    if (!hash) throw new Error(`no fingerprint for ${file}: is the photograph still in public/photos?`);
    if (written.has(file)) throw new Error(`${file} is described twice in the table`);
    written.add(file);

    // The fingerprints sit under the file they describe. Older ones are dropped
    // rather than left beside them, where a reader would have to guess which of
    // the two is the real one.
    while (FINGERPRINT_LINE.test(lines[index + 1] || "")) index += 1;
    stamped.push(`    sha256: "${hash}",`);

    const lightHash = light[file];
    if (lightHash) stamped.push(`    webpSha256: "${lightHash}",`);

    const thirdHash = avif[file];
    if (thirdHash) stamped.push(`    avifSha256: "${thirdHash}",`);

    // The thumbnail comes last because it is not part of the chain the other
    // three make: it is the same picture again at the size the list of credits
    // draws it, so it stands beside them rather than in front of one of them.
    const thumbHash = thumb[file];
    if (thumbHash) stamped.push(`    thumbSha256: "${thumbHash}",`);

    // And the card copy stands beside the thumbnail for the same reason: it is
    // the same picture again, at the size one screen draws it, so it is pinned
    // where a reader can see which file their credit belongs to.
    const cardHash = card[file];
    if (cardHash) stamped.push(`    cardSha256: "${cardHash}",`);
  }

  const unknown = Object.keys(fingerprints).filter((file) => !written.has(file));
  if (unknown.length > 0) {
    throw new Error(`these files have a fingerprint but no row in the table: ${unknown.join(", ")}`);
  }

  return stamped.join("\n");
}
