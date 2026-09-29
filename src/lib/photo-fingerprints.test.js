import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fingerprint, stampFingerprints } from "./photo-fingerprints.js";

// The fingerprints are written into a source file by a script, which is the
// kind of edit that goes wrong quietly: a value in the wrong row, a line added
// twice, a table rewritten on every run so no diff ever shows a change. The
// module is read back here on a small table of its own, and the last test keeps
// the command that writes the real one in place.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const NAMES = ["/photos/level-1-1.jpg", "/photos/level-1-2.jpg"];

const TABLE = [
  "export const LEVEL_PHOTOS = [",
  "  // 1. Ancient Egypt",
  "  {",
  "    level: 1,",
  `    file: "${NAMES[0]}",`,
  "    width: 960,",
  '    author: "Someone",',
  "  },",
  "  {",
  "    level: 1,",
  `    file: "${NAMES[1]}",`,
  "    width: 480,",
  "  },",
  "];",
  "",
].join("\n");

const HASHES = { [NAMES[0]]: "a".repeat(64), [NAMES[1]]: "b".repeat(64) };
// The light version drawn beside each JPEG, which is the file a player is
// shown, and so the one a credit line has to belong to.
const LIGHT = { [NAMES[0]]: "c".repeat(64), [NAMES[1]]: "d".repeat(64) };
const LINE_OF = (name) => `    file: "${name}",`;
const FINGERPRINT_OF = (hash) => `    sha256: "${hash}",`;
const LIGHT_OF = (hash) => `    webpSha256: "${hash}",`;
const THIRD_OF = (hash) => `    avifSha256: "${hash}",`;
const THUMB_OF = (hash) => `    thumbSha256: "${hash}",`;
/** How many fingerprints a table carries, so a duplicate shows up as one. */
const fingerprintsIn = (text) => (text.match(/^ {4}sha256: "/gm) || []).length;
const lightIn = (text) => (text.match(/^ {4}webpSha256: "/gm) || []).length;
const thirdIn = (text) => (text.match(/^ {4}avifSha256: "/gm) || []).length;
const thumbsIn = (text) => (text.match(/^ {4}thumbSha256: "/gm) || []).length;

test("the fingerprint is the sha256 of the bytes, and nothing else", () => {
  // A known digest, so this stays sha256 whatever the runtime calls it today.
  assert.equal(
    fingerprint(Buffer.from("abc")),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  );
  assert.equal(fingerprint(Buffer.from("abc")), fingerprint(Buffer.from("abc")), "the same bytes, the same value");
  assert.notEqual(fingerprint(Buffer.from("abc")), fingerprint(Buffer.from("abd")), "one byte is enough to change it");
  assert.match(fingerprint(Buffer.from("")), /^[0-9a-f]{64}$/);
});

test("stamping writes the fingerprint under the file it describes", () => {
  const stamped = stampFingerprints(TABLE, HASHES);
  const lines = stamped.split("\n");

  assert.equal(lines[4], LINE_OF(NAMES[0]), "the file line is untouched");
  assert.equal(lines[5], FINGERPRINT_OF(HASHES[NAMES[0]]), "and the fingerprint follows it");
  assert.equal(
    lines[lines.indexOf(LINE_OF(NAMES[1])) + 1],
    FINGERPRINT_OF(HASHES[NAMES[1]]),
    "the second photograph gets its own, not the first one's"
  );

  // Only the fingerprints were added: everything the table said is still said.
  assert.equal(stamped.split("\n").length, TABLE.split("\n").length + 2, "one line per photograph");
  assert.equal(fingerprintsIn(stamped), 2, "one fingerprint per photograph");
  assert.ok(stamped.includes('    author: "Someone",'), "the author is still there");
  assert.ok(stamped.includes("    width: 480,"));
  assert.ok(stamped.startsWith("export const LEVEL_PHOTOS = [\n  // 1. Ancient Egypt\n"), "the head of the file too");
});

test("stamping twice changes nothing, and a stale value is replaced where it stands", () => {
  const once = stampFingerprints(TABLE, HASHES);
  assert.equal(stampFingerprints(once, HASHES), once, "a second run leaves the table exactly as it was");

  const restamped = stampFingerprints(once, { ...HASHES, [NAMES[0]]: "c".repeat(64) });
  assert.equal(fingerprintsIn(restamped), 2, "still one fingerprint per photograph");
  assert.equal(restamped.split("\n").length, once.split("\n").length, "and the file does not grow a line");
  assert.ok(restamped.includes(FINGERPRINT_OF("c".repeat(64))), "the new value is written");
  assert.ok(!restamped.includes(HASHES[NAMES[0]]), "the old one is gone");
  assert.ok(
    restamped.includes(`${LINE_OF(NAMES[1])}\n${FINGERPRINT_OF(HASHES[NAMES[1]])}`),
    "and the neighbour keeps its own"
  );
});

test("a photograph without a fingerprint, or a fingerprint without a photograph, is refused", () => {
  // A row left without a fingerprint would ship a credit that describes no
  // file, and a fingerprint with no row would describe a file nobody shows.
  assert.throws(() => stampFingerprints(TABLE, { [NAMES[0]]: HASHES[NAMES[0]] }), /no fingerprint for .*level-1-2/);
  assert.throws(() => stampFingerprints(TABLE, { ...HASHES, "/photos/level-9-9.jpg": "d".repeat(64) }), /no row in the table/);

  // Two rows for one file would leave a reader guessing which fingerprint wins.
  const twice = TABLE.replace(LINE_OF(NAMES[1]), LINE_OF(NAMES[0]));
  assert.throws(() => stampFingerprints(twice, HASHES), /described twice/);
});

test("the light version is pinned under the fingerprint of the file it was made from", () => {
  // The reader is shown the light version, so pinning only the JPEG would tie
  // the credit line to bytes nobody receives.
  const stamped = stampFingerprints(TABLE, HASHES, LIGHT);
  const lines = stamped.split("\n");
  const first = lines.indexOf(LINE_OF(NAMES[0]));

  assert.equal(lines[first + 1], FINGERPRINT_OF(HASHES[NAMES[0]]), "the JPEG comes first");
  assert.equal(lines[first + 2], LIGHT_OF(LIGHT[NAMES[0]]), "then the light version drawn from it");
  assert.equal(fingerprintsIn(stamped), 2, "one JPEG fingerprint per photograph");
  assert.equal(lightIn(stamped), 2, "and one light fingerprint per photograph");
  assert.equal(stamped.split("\n").length, TABLE.split("\n").length + 4, "two lines per photograph");
  assert.equal(
    lines[lines.indexOf(LINE_OF(NAMES[1])) + 2],
    LIGHT_OF(LIGHT[NAMES[1]]),
    "the second photograph gets its own, not the first one's"
  );

  assert.equal(stampFingerprints(stamped, HASHES, LIGHT), stamped, "stamping it again changes nothing");
});

test("the third format is pinned under the light one, and only where it exists", () => {
  // The AVIF is the file a current browser is actually shown, so it is pinned
  // too; and the line is written only for the pictures that have one, because it
  // is also what tells the application which of them to offer it for.
  const onePicture = { [NAMES[0]]: "e".repeat(64) };
  const stamped = stampFingerprints(TABLE, HASHES, LIGHT, onePicture);
  const lines = stamped.split("\n");
  const first = lines.indexOf(LINE_OF(NAMES[0]));

  assert.equal(lines[first + 1], FINGERPRINT_OF(HASHES[NAMES[0]]), "the JPEG first");
  assert.equal(lines[first + 2], LIGHT_OF(LIGHT[NAMES[0]]), "then the light version");
  assert.equal(lines[first + 3], THIRD_OF(onePicture[NAMES[0]]), "then the lighter one in front of it");
  assert.equal(thirdIn(stamped), 1, "and only where there is a file to pin");
  assert.equal(
    lines[lines.indexOf(LINE_OF(NAMES[1])) + 2],
    LIGHT_OF(LIGHT[NAMES[1]]),
    "a photograph without one keeps its two lines, in the same order"
  );
  assert.equal(stampFingerprints(stamped, HASHES, LIGHT, onePicture), stamped, "stamping it again changes nothing");

  // A picture whose AVIF was taken away - the optimizer does that when it stops
  // being the smaller file - keeps no line claiming one.
  const without = stampFingerprints(stamped, HASHES, LIGHT);
  assert.equal(thirdIn(without), 0, "the line goes with the file");
  assert.equal(without.split("\n").length, TABLE.split("\n").length + 4, "and the table shrinks by exactly that line");
});

test("the thumbnail the credits screen draws is pinned too, beside the chain it is not part of", () => {
  // The thumbnail is not what a browser falls back to: it is the copy of the
  // picture another screen draws, so it stands beside the three that make up the
  // chain rather than in front of one of them. It is pinned all the same, for
  // the reason the others are: the credit line on that screen has to belong to
  // the bytes a reader is really shown there.
  const thumbs = { [NAMES[0]]: "1".repeat(64), [NAMES[1]]: "2".repeat(64) };
  const stamped = stampFingerprints(TABLE, HASHES, LIGHT, {}, thumbs);
  const lines = stamped.split("\n");
  const first = lines.indexOf(LINE_OF(NAMES[0]));

  assert.equal(lines[first + 1], FINGERPRINT_OF(HASHES[NAMES[0]]), "the JPEG first");
  assert.equal(lines[first + 2], LIGHT_OF(LIGHT[NAMES[0]]), "then the light version");
  assert.equal(lines[first + 3], THUMB_OF(thumbs[NAMES[0]]), "then the small copy beside them");
  assert.equal(thumbsIn(stamped), 2, "one per photograph");
  assert.equal(stamped.split("\n").length, TABLE.split("\n").length + 6, "three lines per photograph");
  assert.equal(stampFingerprints(stamped, HASHES, LIGHT, {}, thumbs), stamped, "stamping it again changes nothing");

  // A picture with an AVIF carries all four, in the order the table reads.
  const withAvif = stampFingerprints(stamped, HASHES, LIGHT, { [NAMES[1]]: "3".repeat(64) }, thumbs);
  const second = withAvif.split("\n").indexOf(LINE_OF(NAMES[1]));
  const order = withAvif.split("\n").slice(second + 1, second + 5).map((line) => line.trim().split(":")[0]);
  assert.deepEqual(order, ["sha256", "webpSha256", "avifSha256", "thumbSha256"]);

  // And a table stamped without them keeps none: the line goes with the file,
  // the way the AVIF's does, so a thumbnail that was taken away cannot go on
  // claiming a file nobody has.
  assert.equal(thumbsIn(stampFingerprints(stamped, HASHES, LIGHT)), 0);
});

test("a fingerprint that is no longer written is not left behind", () => {
  // The lines sit under the file they describe, and there is room for exactly
  // as many as there are files: a stale line beside a fresh one would leave a
  // reader guessing which of the two is the real one.
  const both = stampFingerprints(TABLE, HASHES, LIGHT);
  const jpegOnly = stampFingerprints(both, HASHES);

  assert.equal(lightIn(jpegOnly), 0, "a table stamped without the light versions carries none");
  assert.equal(fingerprintsIn(jpegOnly), 2, "and keeps the ones it was given");
  assert.equal(jpegOnly.split("\n").length, TABLE.split("\n").length + 2, "without growing");

  const revised = stampFingerprints(both, HASHES, { ...LIGHT, [NAMES[0]]: "e".repeat(64) });
  assert.equal(lightIn(revised), 2, "still one light fingerprint per photograph");
  assert.ok(revised.includes(LIGHT_OF("e".repeat(64))), "the new value is written");
  assert.ok(!revised.includes(LIGHT[NAMES[0]]), "the old one is gone");
  assert.ok(revised.includes(LIGHT_OF(LIGHT[NAMES[1]])), "and the neighbour keeps its own");
});

test("the fingerprints in the repository are written by this command", () => {
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts["photos:stamp"], /stamp-photos\.mjs/, "package.json registers the stamping command");

  const script = readFileSync(path.join(ROOT, "scripts", "stamp-photos.mjs"), "utf8");
  assert.match(script, /LEVEL_PHOTOS/, "it reads the photograph table");
  assert.match(script, /level-images\.js/, "and writes the fingerprints back into it");
  assert.match(script, /photo-fingerprints\.js/, "through the same module these tests read");
  assert.match(script, /webpPath/, "the light version drawn beside each JPEG is fingerprinted too");
  assert.match(script, /avifPath/, "and the third format, where the picture has one");
  assert.match(script, /thumbPath/, "and the small copy the list of credits draws");
  assert.match(script, /existsSync/, "refusing to stamp a photograph that is not on disk");
  assert.match(script, /avifSha256/, "a row that claimed an AVIF no longer on disk is reported");
});
