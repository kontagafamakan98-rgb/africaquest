import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { LEVEL_PHOTOS } from "./level-images.js";
import { avifPath, thumbPath, webpPath } from "./photo-formats.js";

// What each photograph of the game is allowed to weigh, and what the app draws.
//
// The gallery is a single download before the game can be played with no
// network, on a school connection and on a phone, so its weight is a decision
// rather than an outcome: the budgets below are checked, not hoped for, and a
// picture added at four hundred kilobytes fails here rather than on somebody's
// data plan.
//
// Each photograph ships twice, and some of them three times. The JPEG is what
// scripts/fetch-photos.mjs downloaded and scripts/optimize-photos.mjs re-encoded;
// the WebP beside it is what a browser draws next; the AVIF in front of that one
// is drawn first where it was measured to be both as faithful and lighter. Every
// one of them is held to a budget, each light version has to be lighter than the
// file behind it, and the AVIF is only allowed to exist where the table records
// its fingerprint: the line is also how the application knows which pictures to
// offer it for, and a browser asked for a file that is not there shows nothing
// rather than falling back.
//
// A fourth file follows none of that chain: the thumbnail is the same picture
// again at the size the list of credits draws it, and it is required rather than
// optional, because the screen that would otherwise draw the lesson versions is
// sixty of them at once.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const PHOTO_DIR = path.join(ROOT, "public", "photos");
const SIZE = 1024;
const onDisk = (file) => path.join(ROOT, "public", String(file).replace(/^\//, ""));
const kilobytes = (bytes) => Math.round(bytes / SIZE);
const sum = (list, pick) => list.reduce((total, entry) => total + pick(entry), 0);
/** The size of a file, or zero when it is not there at all. */
const weigh = (file) => (existsSync(file) ? statSync(file).size : 0);

const BUDGET = {
  /** One JPEG: the heaviest is 140 KB, so this leaves room without being a wall. */
  jpeg: 160 * SIZE,
  /** One light version: the heaviest is 125 KB. */
  webp: 140 * SIZE,
  /** One AVIF: the heaviest is 111 KB. */
  avif: 140 * SIZE,
  /**
   * How much lighter an AVIF has to be than the WebP it stands in front of.
   *
   * A third copy of every picture in the repository, and a second one a browser
   * may have to keep, has to buy something: a file that saves a few hundred
   * bytes is a cost with no benefit. The script applies this same rule when it
   * decides whether to write one, so a file that breaks it is a file left over
   * from an earlier run.
   */
  avifAdvantage: 0.95,
  /** One thumbnail: the heaviest is 7 KB, and it is drawn 80 pixels across. */
  thumb: 12 * SIZE,
  /** The whole list of credits, which is what that screen downloads. */
  thumbGallery: 256 * SIZE,
  /** The whole light gallery, which is what a device downloads to install. */
  lightGallery: 3 * 1024 * 1024,
  /** How much lighter the light gallery has to be than the JPEGs it replaces. */
  lightening: 30,
};

/** Every photograph, with each of its files weighed once. */
const weighed = LEVEL_PHOTOS.map((photo) => {
  const jpeg = weigh(onDisk(photo.file));
  const webp = weigh(onDisk(webpPath(photo.file)));
  const avif = weigh(onDisk(avifPath(photo.file)));
  return {
    photo,
    file: webpPath(photo.file),
    avifFile: avifPath(photo.file),
    thumbFile: thumbPath(photo.file),
    jpeg,
    webp,
    avif,
    thumb: weigh(onDisk(thumbPath(photo.file))),
    // What a browser draws: the AVIF where one was written, the WebP otherwise.
    drawn: avif > 0 ? avif : webp,
  };
});

test("the light version of a photograph is the file beside it, in the other format", () => {
  // The name is derived rather than written a second time in the table, so the
  // two files of a picture cannot drift apart into a drawing with no light
  // version, or the other way round.
  assert.equal(webpPath("/photos/level-1-1.jpg"), "/photos/level-1-1.webp");
  assert.equal(webpPath("/photos/level-20-3.jpeg"), "/photos/level-20-3.webp", "either spelling of the extension");

  // A path the application already prepared for the address it is served from
  // is prepared in the same way: under a project site on GitHub Pages the file
  // is not at the root of the domain.
  assert.equal(webpPath("/repository/photos/level-4-2.jpg"), "/repository/photos/level-4-2.webp");

  // An address that names a scheme belongs to somebody else, and asking a
  // stranger's server for a renamed copy would simply return nothing.
  assert.equal(
    webpPath("https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80"),
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80"
  );

  // Anything that is not a JPEG is handed back as it came.
  assert.equal(webpPath("/favicon.svg"), "/favicon.svg");
  assert.equal(webpPath("/photos/level-1-1.webp"), "/photos/level-1-1.webp", "twice is not twice");

  // The third name is derived the same way, and handed back the same way when
  // the address belongs to somebody else.
  assert.equal(avifPath("/photos/level-1-1.jpg"), "/photos/level-1-1.avif");
  assert.equal(avifPath("/repository/photos/level-4-2.jpeg"), "/repository/photos/level-4-2.avif");
  assert.equal(avifPath("/photos/level-1-1.webp"), "/photos/level-1-1.webp", "a light version is not renamed again");
  assert.equal(
    avifPath("https://commons.wikimedia.org/wiki/File:Abuja_Stadium.jpg"),
    "https://commons.wikimedia.org/wiki/File:Abuja_Stadium.jpg",
    "the page a picture was found on is not a picture of ours"
  );
});

test("the thumbnail of a photograph is a small copy of it, named after the picture", () => {
  // The name is derived from the file, like the other two, so a photograph
  // cannot end up with a thumbnail belonging to another one, and a stale file
  // left behind under a name nothing asks for is caught by the orphan check at
  // the end of this file.
  assert.equal(thumbPath("/photos/level-1-1.jpg"), "/photos/level-1-1-thumb.webp");
  assert.equal(thumbPath("/photos/level-20-3.jpeg"), "/photos/level-20-3-thumb.webp", "either spelling of the extension");
  assert.equal(
    thumbPath("/repository/photos/level-4-2.jpg"),
    "/repository/photos/level-4-2-thumb.webp",
    "a picture already prepared for the address it is served from"
  );

  // Somebody else's address is handed back untouched, and a file that is not a
  // JPEG is not renamed into one.
  assert.equal(
    thumbPath("https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80"),
    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80"
  );
  assert.equal(thumbPath("/photos/level-1-1.webp"), "/photos/level-1-1.webp");
  assert.equal(thumbPath("/photos/level-1-1-thumb.webp"), "/photos/level-1-1-thumb.webp", "twice is not twice");
});

test("every photograph ships a thumbnail, and it really is the small copy", () => {
  // The list of credits draws one of these per row, so a hole here is a hole on
  // a screen: nothing falls back to the lesson version, which is the download
  // these files exist to avoid.
  for (const { photo, thumbFile, jpeg, webp, thumb } of weighed) {
    assert.ok(thumb > 0, `${photo.file} has no thumbnail: run scripts/optimize-photos.mjs --light`);
    assert.ok(
      thumb <= BUDGET.thumb,
      `the thumbnail of ${photo.file} weighs ${kilobytes(thumb)} KB, over the ${kilobytes(BUDGET.thumb)} KB budget`
    );

    // A file that is not a WebP would be sent to the browser as one and never
    // fall back: the row would show nothing at all.
    const bytes = readFileSync(onDisk(thumbFile)).subarray(0, 12);
    assert.equal(bytes.subarray(0, 4).toString("latin1"), "RIFF", `${thumbFile} is not a WebP container`);
    assert.equal(bytes.subarray(8, 12).toString("latin1"), "WEBP", `${thumbFile} carries something else`);

    assert.ok(
      thumb < Math.min(webp, jpeg),
      `the thumbnail of ${photo.file} weighs ${kilobytes(thumb)} KB against ${kilobytes(webp)} KB of light version: ` +
        "a second download that saves nothing"
    );
  }

  // The whole list is one screen, so its weight is a budget of its own: it is
  // what a reader on a slow connection waits for to see who made the pictures.
  const total = sum(weighed, (entry) => entry.thumb);
  assert.ok(
    total < BUDGET.thumbGallery,
    `the list of credits weighs ${kilobytes(total)} KB, over the ${kilobytes(BUDGET.thumbGallery)} KB budget`
  );
});

test("no single photograph is heavier than the budget a phone can afford", () => {
  for (const { photo, jpeg, webp, avif } of weighed) {
    assert.ok(
      jpeg > 0,
      `${photo.file} is not in the repository: run scripts/fetch-photos.mjs`
    );
    assert.ok(
      jpeg <= BUDGET.jpeg,
      `${photo.file} alone weighs ${kilobytes(jpeg)} KB, over the ${kilobytes(BUDGET.jpeg)} KB a level may cost`
    );
    assert.ok(
      webp > 0,
      `${photo.file} has no light version: run scripts/optimize-photos.mjs --light`
    );
    assert.ok(
      webp <= BUDGET.webp,
      `the light version of ${photo.file} weighs ${kilobytes(webp)} KB, over the ${kilobytes(BUDGET.webp)} KB budget`
    );
    assert.ok(
      avif <= BUDGET.avif,
      `the AVIF of ${photo.file} weighs ${kilobytes(avif)} KB, over the ${kilobytes(BUDGET.avif)} KB budget`
    );
  }
});

test("every photograph ships a light version, and it really is the light one", () => {
  for (const { photo, file, jpeg, webp } of weighed) {
    // A file that is present but is not a WebP would be sent to the browser as
    // one, fail to decode, and never fall back to the JPEG: a picture that
    // simply does not appear. The container says what it is.
    const bytes = readFileSync(onDisk(file)).subarray(0, 12);
    assert.equal(bytes.subarray(0, 4).toString("latin1"), "RIFF", `${file} is not a WebP container`);
    assert.equal(bytes.subarray(8, 12).toString("latin1"), "WEBP", `${file} carries something else`);

    assert.ok(
      webp < jpeg,
      `the light version of ${photo.file} weighs ${kilobytes(webp)} KB against ${kilobytes(jpeg)} KB: a second download that saves nothing`
    );
  }
});

test("a third format ships only where it is the lighter one, and the table says where", () => {
  // Two things have to agree here, and both of them matter. The file has to be
  // a real AVIF - a JPEG named .avif would be sent to the browser as one, fail
  // to decode, and never fall back to the WebP behind it - and it has to be the
  // smaller file, since it is drawn in front of it.
  //
  // Then the table: its third fingerprint is what tells the application that
  // this picture has an AVIF at all, because a `<source>` pointing at a file
  // that is not there shows no picture rather than the one behind. A row that
  // claims one and has no file on disk, or a file with no row to claim it, is
  // therefore a picture that either disappears or is never offered.
  for (const { photo, avifFile, webp, avif } of weighed) {
    if (avif === 0) {
      assert.equal(
        photo.avifSha256,
        undefined,
        `${photo.file} is described as having an AVIF, which is not in the repository: run npm run photos:stamp`
      );
      continue;
    }

    const header = readFileSync(onDisk(avifFile)).subarray(0, 12);
    assert.equal(header.subarray(4, 8).toString("latin1"), "ftyp", `${avifFile} is not a container of any kind`);
    assert.equal(header.subarray(8, 12).toString("latin1"), "avif", `${avifFile} carries another format`);

    assert.ok(
      avif < webp * BUDGET.avifAdvantage,
      `${avifFile} weighs ${kilobytes(avif)} KB against ${kilobytes(webp)} KB of WebP: drawn in front of a smaller file`
    );
    assert.match(
      photo.avifSha256 || "",
      /^[0-9a-f]{64}$/,
      `${avifFile} ships without the fingerprint that tells the app to offer it: run npm run photos:stamp`
    );
  }
});

test("the gallery a device installs is far lighter than the pictures it stands in for", () => {
  const jpegTotal = sum(weighed, (entry) => entry.jpeg);
  // What is installed is the lightest file of each picture, which is the AVIF
  // for the ones that have one and the WebP for the rest.
  const lightTotal = sum(weighed, (entry) => entry.drawn);
  const lightened = 100 - Math.round((lightTotal / jpegTotal) * 100);
  const inAvif = weighed.filter((entry) => entry.avif > 0).length;

  // What is precached for offline play is the light gallery, so this is the
  // download a new player waits for.
  assert.ok(
    lightTotal < BUDGET.lightGallery,
    `the gallery a device installs weighs ${(lightTotal / 1024 / 1024).toFixed(2)} MB, over the ` +
      `${(BUDGET.lightGallery / 1024 / 1024).toFixed(0)} MB budget`
  );
  assert.ok(
    lightened >= BUDGET.lightening,
    `the light gallery is only ${lightened}% lighter than the JPEGs, under the ${BUDGET.lightening}% the format is kept for`
  );
  assert.ok(inAvif > 0, "no picture ships the third format at all: was it ever generated?");
});

test("the app draws the light version, and keeps the JPEG for a browser that cannot", () => {
  // Offering both is the whole point of writing two files: a browser chooses by
  // the type it is told, and one that cannot read WebP falls back to the JPEG
  // instead of showing nothing.
  const picture = readFileSync(path.join(ROOT, "src", "components", "game", "LevelPicture.jsx"), "utf8");
  assert.match(picture, /<source srcSet=\{webpPath\(src\)\} type="image\/webp" \/>/, "the light version is offered before the JPEG");
  assert.match(picture, /<img src=\{src\}/, "the JPEG is the fallback the picture element keeps");
  assert.match(picture, /from "@\/lib\/photo-formats\.js"/, "named by the same module the tests read");

  // The small copy is a mode of its own, and the screen that lists sixty of
  // them asks for that mode rather than a band that happens to be narrow: what
  // is drawn is the thumbnail, and the JPEG behind it is only for a browser
  // that reads no WebP at all.
  assert.match(
    picture,
    /<source srcSet=\{thumbPath\(src\)\} type="image\/webp" \/>/,
    "the thumbnail is offered as a source of its own"
  );
  assert.match(picture, /thumb = false/, "and only where the caller asks for it");
  assert.match(
    picture,
    /AVIF_PHOTOS\.has\(src\) && <source srcSet=\{avifPath\(src\)\} type="image\/avif" \/>/,
    "the smallest format is offered only for the pictures that have one"
  );

  // And it is offered first. A browser draws the first source it can read and
  // never looks at the rest, so an AVIF written after the WebP would be dead
  // weight: every browser would keep taking the bigger file. The two are found by
  // the file they name rather than by their type, since a thumbnail is a WebP as
  // well and would otherwise be mistaken for the one the AVIF stands in front of.
  const smallest = picture.indexOf("avifPath(src)");
  const light = picture.indexOf("webpPath(src)");
  assert.ok(smallest > 0 && light > 0, "both light formats are offered");
  assert.ok(smallest < light, "the smallest file is offered before the WebP behind it");

  // Which pictures those are is read from the fingerprints rather than kept as a
  // second list of names that could drift away from the files. The list the first
  // screen reads is written by scripts/generate-level-facts.mjs out of those
  // fingerprints, and a step of the verification fails when it no longer matches
  // the table, so the third format is still decided and never assumed.
  const generator = readFileSync(path.join(ROOT, "scripts", "generate-level-facts.mjs"), "utf8");
  assert.match(
    generator,
    /LEVEL_PHOTOS\.filter\(\(photo\) => photo\.avifSha256\)/,
    "the third fingerprint is what says a picture has an AVIF"
  );

  const brief = readFileSync(path.join(ROOT, "src", "components", "game", "level-summary.js"), "utf8");
  assert.match(brief, /AVIF_PHOTOS = new Set\(AVIF_FILES\.map/, "and it is what the first screen reads");

  // And it is the only place a photograph is written as an image, so the pair
  // cannot be bypassed by a component that draws the JPEG on its own.
  const drawers = readdirSync(path.join(ROOT, "src", "components", "game"))
    .filter((name) => name.endsWith(".jsx"))
    .filter((name) => readFileSync(path.join(ROOT, "src", "components", "game", name), "utf8").includes("<img"));
  assert.deepEqual(drawers, ["LevelPicture.jsx"], "these draw a photograph without offering the light version");

  // Every level view goes through it, including the two that only show a band.
  for (const name of ["LevelCard.jsx", "LevelGallery.jsx", "LessonScreen.jsx", "QuizScreen.jsx", "DifficultyPicker.jsx"]) {
    const source = readFileSync(path.join(ROOT, "src", "components", "game", name), "utf8");
    assert.match(source, /from "\.\/LevelPicture"/, `${name} draws its photograph through the light version`);
  }
});

test("the light version is written by the script that prepares the photographs", () => {
  const script = readFileSync(path.join(ROOT, "scripts", "optimize-photos.mjs"), "utf8");
  assert.match(script, /WEBP/, "the script encodes the light format");
  assert.match(script, /light_cap/, "at the size it is drawn on a phone");
  assert.match(script, /--light/, "and can write them without re-encoding the JPEGs again");

  // The third format is decided rather than assumed: both are measured against
  // the same pixels, the AVIF is kept where it needs fewer bytes for the same
  // fidelity, and where it does not it is not written at all.
  //
  // The rule itself is not written here: it lives in build/photo-fidelity.js,
  // which this script and the tests both run, and
  // src/lib/photo-fidelity.test.js measures it on a witness picture of its own.
  // What is held here is that the script runs that rule rather than a copy of
  // it, and that the weight it can check on disk stops the run when it fails.
  const fidelity = readFileSync(path.join(ROOT, "build", "photo-fidelity.js"), "utf8");
  assert.match(script, /AVIF/, "the script encodes the third format");
  assert.match(script, /from "\.\.\/build\/photo-fidelity\.js"/, "through the rule both it and the tests run");
  assert.match(fidelity, /def psnr/, "measuring in decibels");
  assert.match(fidelity, /def choose_avif/, "and choosing a quality from that measurement");
  assert.match(fidelity, /if gain >= 0/, "only a quality that reaches the WebP's fidelity is accepted");
  assert.match(script, /--avif/, "which can be written on its own, leaving the other two files alone");
  assert.match(script, /AVIF_WORTH_IT/, "with a rule for when a third file is worth carrying");
  assert.match(script, /not lighter than the WebP/, "an AVIF that stops being the smaller file stops the run");

  // A missing light version, or one no lighter than its JPEG, is a failure in
  // the measurements rather than a line of output nobody reads.
  assert.match(script, /have no light version/, "a missing one is reported");
  assert.match(script, /not lighter than the JPEG/, "and so is one that saves nothing");
  assert.match(script, /process\.exit\(1\)/, "both stop the run");

  // The script writes the file the application asks for, named by the one
  // module that decides that name.
  assert.match(script, /\.webp/, "the light file is written as a WebP");
  assert.match(script, /photo-formats\.js|\.webp/, "under the name the app derives");

  // The thumbnail is the same picture at another size, written by the same
  // encoder in the same run rather than by a script of its own or by hand, and
  // it is required: one that is missing, or one no lighter than the picture it
  // stands for, stops the run.
  assert.match(script, /THUMB_LONG_EDGE/, "the thumbnail is written at the size the list draws it");
  assert.match(script, /thumb_edge/, "which the Node side passes to the encoder");
  assert.match(script, /-thumb\.webp/, "under the name the app derives");
  assert.match(script, /have no thumbnail/, "a missing one is reported");
  assert.match(script, /not lighter than the picture they stand for/, "and so is one that saves nothing");
});

test("no light version is left in the repository that no level is credited for", () => {
  // A WebP, an AVIF or a thumbnail nobody credited is the same licence breach
  // as an uncredited JPEG, and easier to miss: these are the files a player is
  // shown.
  const credited = new Set(
    LEVEL_PHOTOS.flatMap((photo) => [
      path.basename(photo.file),
      path.basename(webpPath(photo.file)),
      path.basename(avifPath(photo.file)),
      path.basename(thumbPath(photo.file)),
    ])
  );
  const orphans = readdirSync(PHOTO_DIR)
    .filter((name) => /\.(webp|avif)$/.test(name))
    .filter((name) => !credited.has(name));
  assert.deepEqual(orphans, [], "these light versions ship without a level to show them or a credit to name them");
});
