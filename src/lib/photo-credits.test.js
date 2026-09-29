import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fingerprint } from "./photo-fingerprints.js";
import { avifPath, thumbPath, webpPath } from "./photo-formats.js";
import {
  LEVEL_GALLERIES,
  LEVEL_IMAGES,
  LEVEL_IMAGE_URLS,
  LEVEL_PHOTOS,
  photoCredit,
  photoLicence,
  photoSourcePage,
} from "./level-images.js";
import { LEVELS, getLevelGallery } from "../components/game/gameData.js";

// A photograph in an educational app is somebody else's work, and the credit
// line is the whole of the debt: who made it, under which licence, and where a
// reader can go and check. offline.test.js proves the pictures ship; this suite
// proves each one is accounted for, that the link in its credit leads to the
// very page it was taken from, and that nothing is shown without a credit or
// credited without being shown.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const TERMS = readFileSync(path.join(ROOT, "src", "pages", "TermsOfService.jsx"), "utf8");

// The licences a photograph may be shipped under. Each one is a name a reader
// can look up; anything else would leave them unable to tell what they may do
// with the picture.
const LICENCES = [/^CC0$/, /^CC BY \d\.\d$/, /^CC BY-SA \d\.\d$/, /^Public domain$/, /^Unsplash$/];

/** Who answers for a photograph: its author, or the collection that published it. */
const holderOf = (photo) => photo.author || photo.collection;

test("every level shows a photograph, under a named licence and with an attribution", () => {
  for (const level of LEVELS) {
    const photos = LEVEL_GALLERIES[level.id] || [];
    const where = `level ${level.id} (${level.title})`;

    assert.ok(photos.length > 0, `${where}: no photograph is credited for this level`);

    for (const photo of photos) {
      const label = `${where}, ${photo.file}`;

      assert.ok(
        LICENCES.some((pattern) => pattern.test(photo.licence)),
        `${label}: the licence "${photo.licence}" is not one a reader can look up`
      );

      // Somebody has to be answerable for the picture: a photographer, or the
      // collection that published it without one.
      const holder = holderOf(photo);
      assert.ok(typeof holder === "string" && holder.trim().length > 1, `${label}: nobody is credited`);

      // The credit line is what a reader actually sees, so it has to carry both.
      assert.ok(photoCredit(photo).includes(holder), `${label}: the credit line drops the attribution`);
      assert.ok(photoCredit(photo).includes(photo.collection), `${label}: the credit line drops the collection`);
      assert.ok(photoCredit(photo).includes(photo.licence), `${label}: the credit line drops the licence`);

      // A photograph published on Commons is credited to the person who made
      // it: the collection is not an attribution, so a row that lost its author
      // would leave a CC BY work credited to nobody.
      if (photo.collection === "Wikimedia Commons") {
        assert.ok(
          typeof photo.author === "string" && photoCredit(photo).startsWith(photo.author),
          `${label}: a Commons photograph has to open its credit with the name of its author`
        );
      }
      const french = photoCredit(photo, "fr");
      assert.ok(french.includes(holder), `${label}: the French credit line drops the attribution`);
      assert.ok(
        french.includes(photo.licenceFr || photo.licence),
        `${label}: the French credit line does not say "${photo.licenceFr || photo.licence}"`
      );
    }
  }

  // The picture on a level card is the one the level opens with.
  for (const level of LEVELS) {
    assert.equal(LEVEL_IMAGES[level.id], LEVEL_GALLERIES[level.id][0].file, `level ${level.id}: card picture`);
  }
});

test("the credit link leads to the page the photograph was taken from", () => {
  for (const photo of LEVEL_PHOTOS) {
    const page = photoSourcePage(photo);

    if (photo.commonsTitle) {
      const match = /^https:\/\/commons\.wikimedia\.org\/wiki\/File:(\S+)$/.exec(page);
      assert.ok(match, `${photo.file}: the credit does not link to a Commons file page`);

      // The link has to name the very file the picture was downloaded from: a
      // title that drifted, or one copied from the row above, would send a
      // reader to somebody else's photograph while the author beside it stays.
      const named = decodeURIComponent(match[1]).replace(/_/g, " ");
      assert.equal(named, photo.commonsTitle, `${photo.file}: the credit link names another file`);
    } else {
      // The picture that comes from a stock library rather than Commons is
      // credited to the address it was downloaded from.
      assert.equal(photo.collection, "Unsplash", `${photo.file}: no collection to link to`);
      assert.equal(page, photo.origin, `${photo.file}: the credit does not link to the file it came from`);
      assert.match(page, /^https:\/\/images\.unsplash\.com\/\S+$/, `${photo.file}: the origin is not a picture address`);
    }
  }
});

test("the fingerprint in the table is the file the app serves", () => {
  // A licence says what may be done with a picture, and a credit line says who
  // made it; the fingerprint says which picture it is. Without it a file could
  // be replaced and the credit would go on naming an author whose work is no
  // longer there, with nothing to notice it but a reader who recognised it.
  // Every file of a photograph is pinned, because every one of them is the
  // picture: the AVIF a current browser draws, the light WebP behind it, the
  // JPEG behind that for a browser which reads neither, and the thumbnail the
  // list of credits draws. Pinning only the last would tie a credit to bytes
  // nobody receives.
  for (const photo of LEVEL_PHOTOS) {
    const files = [
      { format: "sha256", file: photo.file, value: photo.sha256 },
      { format: "webpSha256", file: webpPath(photo.file), value: photo.webpSha256 },
      { format: "thumbSha256", file: thumbPath(photo.file), value: photo.thumbSha256 },
      // Not every picture has a third format, and the row is what says which do:
      // the line is written only when the file is, and it is also what tells the
      // application to offer it. Where there is none, there is nothing to pin.
      ...(photo.avifSha256
        ? [{ format: "avifSha256", file: avifPath(photo.file), value: photo.avifSha256 }]
        : []),
    ];

    for (const { format, file, value } of files) {
      assert.match(
        value || "",
        /^[0-9a-f]{64}$/,
        `${file}: the row describes no ${format}: run npm run photos:stamp`
      );

      const served = readFileSync(path.join(ROOT, "public", file.replace(/^\//, "")));
      assert.equal(
        fingerprint(served),
        value,
        `${file} is not the file its credit describes: run npm run photos:stamp`
      );
    }
  }
});

test("no two photographs are credited to the same page, and none is credited twice", () => {
  const pages = new Map();
  const files = new Set();

  for (const photo of LEVEL_PHOTOS) {
    assert.ok(!files.has(photo.file), `${photo.file} is listed twice`);
    files.add(photo.file);

    // Two rows pointing at one page would mean one of the two pictures is
    // credited to work its author did not make.
    const page = photoSourcePage(photo);
    assert.ok(!pages.has(page), `${photo.file} and ${pages.get(page)} are both credited to ${page}`);
    pages.set(page, photo.file);
  }

  assert.equal(pages.size, LEVEL_PHOTOS.length, "every photograph has its own source page");
});

test("the credits printed in the terms name the photographs the game ships", () => {
  // The credit section of the terms is written out by hand, one line per level,
  // while the table above is what the app reads. This is the seam where the two
  // drift: a picture replaced in the table and left in the page credits an
  // author whose work is no longer in the game.
  const rows = {
    en: LEVEL_PHOTOS.map((photo) => ({ holder: holderOf(photo), licence: photo.licence })),
    fr: LEVEL_PHOTOS.map((photo) => ({ holder: holderOf(photo), licence: photo.licenceFr || photo.licence })),
  };

  for (const [lang, heading] of [["en", "13. Photo credits"], ["fr", "13. Crédits photographiques"]]) {
    const start = TERMS.indexOf(heading);
    assert.ok(start > 0, `the terms hold a ${lang} credit section`);
    const section = TERMS.slice(start, TERMS.indexOf("14. Contact", start));

    // A credit line is the one that credits three photographs; the two
    // paragraphs above it are written in the same shape.
    const lines = [...section.matchAll(/^\s{10}"(.*)",$/gm)]
      .map((match) => match[1])
      .filter((line) => line.split(lang === "fr" ? " ; " : "; ").length === 3);

    assert.equal(lines.length, LEVELS.length, `${lang}: one credit line per level`);

    for (const line of lines) {
      const parts = line.split(lang === "fr" ? " ; " : "; ");
      for (const part of parts) {
        assert.ok(
          rows[lang].some((row) => part.includes(row.holder) && part.includes(row.licence)),
          `${lang}: "${part}" credits no photograph the game ships`
        );
      }
    }
  }
});

test("every picture the app serves is one of the credited photographs", () => {
  const credited = new Set(LEVEL_PHOTOS.map((photo) => photo.file));

  // What the game precaches has to be exactly what the table accounts for:
  // a picture reaching a player without a credit line would be a licence breach
  // nobody would notice, since the app never shows the two side by side.
  assert.deepEqual([...LEVEL_IMAGE_URLS].sort(), [...credited].sort(), "the served pictures are the credited ones");

  for (const file of credited) {
    assert.ok(existsSync(path.join(ROOT, "public", file.replace(/^\//, ""))), `${file} is not in the repository`);
  }

  // And the other way round: a photograph left in the repository that no level
  // shows is a file somebody still holds copyright over, shipped for nothing.
  const onDisk = readdirSync(path.join(ROOT, "public", "photos")).filter((name) => name.endsWith(".jpg"));
  const orphaned = onDisk.filter((name) => !credited.has(`/photos/${name}`));
  assert.deepEqual(orphaned, [], "these pictures ship without a level to show them or a credit to name them");
});

test("the gallery carries the author, the licence and the source page of every photograph", () => {
  // The credits screen draws a thumbnail beside three facts: who made the
  // picture, under which licence, and where it came from. They travel with the
  // row the lesson gallery already reads, so the screen has no table of its own
  // to keep in step with this one.
  for (const level of LEVELS) {
    const photos = LEVEL_GALLERIES[level.id];
    const gallery = getLevelGallery(level.id);

    assert.equal(gallery.length, photos.length, `level ${level.id}: the gallery is the whole set`);

    gallery.forEach((entry, index) => {
      const photo = photos[index];
      const where = `level ${level.id}, ${photo.file}`;

      assert.equal(entry.author, photo.author || photo.collection, `${where}: the author`);
      assert.equal(entry.licence, photoLicence(photo), `${where}: the licence`);
      assert.equal(entry.source, photoSourcePage(photo), `${where}: the page it was taken from`);
      assert.equal(entry.credit, photoCredit(photo), `${where}: the credit line`);
    });
  }

  // One licence is translated, because its name is not already international.
  // A French credits screen saying "Public domain" is the half translated app
  // this project spends its other tests refusing.
  const french = getLevelGallery(7, "fr");
  assert.equal(french[1].licence, "domaine public", "the French wording of the licence");
  assert.equal(french[1].author, "Carl Rudolph Sohn", "the author of a public domain photograph");
  assert.equal(french[1].source, photoSourcePage(LEVEL_GALLERIES[7][1]), "the page it was taken from");
  assert.equal(french[1].credit, photoCredit(LEVEL_GALLERIES[7][1], "fr"), "the French credit line");
});

test("a thumbnail opens the photograph it stands for, at the size it was made", () => {
  const page = readFileSync(path.join(ROOT, "src", "pages", "PhotoCredits.jsx"), "utf8");
  const viewer = readFileSync(
    path.join(ROOT, "src", "components", "game", "PhotoViewer.jsx"),
    "utf8"
  );

  // The way in is the picture itself. Sixty rows of captions are not something a
  // reader can tap, and a control that only says which photograph it opens is no
  // use read aloud: each one names the photograph it is about to show.
  assert.match(page, /<button[\s\S]{0,300}setOpen\(photo\)/, "the thumbnail is the control");
  assert.match(page, /aria-label=\{`[^`]*photo\.caption/, "and it names the photograph it opens");
  assert.match(page, /<PhotoViewer photo=\{open\}/, "the viewer is handed the row that was tapped");

  // What opens is the lesson version, the largest file of that photograph the
  // game ships. Asking for the thumbnail again would show the reader the very
  // picture they just tapped, larger and no clearer.
  assert.match(viewer, /<LevelPicture/, "the picture is drawn by the same component as everywhere else");
  assert.doesNotMatch(viewer, /\bthumb\b|\bavifPath|\bwebpPath/, "and asked for at its full size");
  assert.doesNotMatch(viewer, /photos?\//, "no file is named by hand in the viewer either");

  // A dialog, with the keyboard behaviour of every other sheet of the game: the
  // focus moves into it, Tab stays inside, Escape closes it, and the focus comes
  // back to the thumbnail that opened it.
  assert.match(viewer, /useModalA11y\(/, "the viewer answers Escape and keeps the focus inside");
  assert.match(viewer, /role="dialog"/);
  assert.match(viewer, /aria-modal="true"/);
  assert.match(viewer, /aria-labelledby="photo-viewer-caption"/, "it is announced as the photograph it shows");
  assert.match(viewer, /id="photo-viewer-caption"/);
  assert.match(viewer, /aria-label=\{t\.close\}/, "and there is a way out that says what it does");
  assert.match(viewer, /useReducedMotion\(\)/, "nothing animates for a reader who asked for less motion");

  // The credit travels with the picture. A photograph shown larger than on the
  // row is still shown with the name of the person who made it, under the same
  // licence, with the same page to go and check.
  for (const wording of ["photoCreditsAuthor", "photoCreditsLicence", "photoCreditsSource"]) {
    assert.match(viewer, new RegExp(`t\\.${wording}\\b`), `the viewer drops ${wording}`);
  }
  assert.match(viewer, /href=\{photo\.source\}/, "the link is the one the photograph came with");

  // And every wording it shows has to exist in both dictionaries.
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  const wordings = new Set([...viewer.matchAll(/\bt\.([A-Za-z0-9_]+)/g)].map((match) => match[1]));
  assert.ok(wordings.size >= 4, `only ${wordings.size} wordings were read from the viewer`);
  for (const wording of wordings) {
    assert.equal(
      [...dictionary.matchAll(new RegExp(`^ {4}${wording}:`, "gm"))].length,
      2,
      `${wording} is not written in both languages`
    );
  }

  // It is reached from the credits screen and from nowhere else, which is what
  // keeps it in the file that screen arrives in rather than in front of the map.
  const importers = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (
        /\.jsx?$/.test(entry.name) &&
        !entry.name.endsWith(".test.js") &&
        readFileSync(full, "utf8").includes("PhotoViewer")
      ) {
        importers.push(path.relative(ROOT, full).split(path.sep).join("/"));
      }
    }
  };
  walk(path.join(ROOT, "src"));
  assert.deepEqual(
    importers.sort(),
    ["src/components/game/PhotoViewer.jsx", "src/pages/PhotoCredits.jsx"],
    "the viewer is drawn by the credits screen alone"
  );
});

test("the credits screen lists every photograph of the table, in both languages", () => {
  const page = readFileSync(path.join(ROOT, "src", "pages", "PhotoCredits.jsx"), "utf8");

  // A screen of its own, reached from the settings screen beside the legal
  // pages, so a reader can find it without being told a route.
  assert.match(
    readFileSync(path.join(ROOT, "src", "pages.config.js"), "utf8"),
    /PhotoCredits/,
    "the credits screen is routed"
  );
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "game", "SettingsModal.jsx"), "utf8"),
    /to="\/PhotoCredits"/,
    "the settings screen opens the credits"
  );

  // The list is derived, never copied. A picture named by hand here, or a row
  // written out by hand, would go on crediting a photograph the game no longer
  // serves, which is the drift this whole suite exists to catch.
  assert.match(page, /getLevels\(lang\)/, "the levels come from the game data");
  assert.doesNotMatch(page, /photos?\//, "a picture is named by hand on the credits screen");
  assert.match(page, /<LevelPicture/, "the thumbnails are drawn by the picture component");

  // And it asks for the thumbnail, not for the lesson version of each picture:
  // the row draws eighty pixels of it, and sixty full width photographs would
  // be the download the thumbnail was written to avoid.
  assert.match(
    page,
    /<LevelPicture[^>]*\bthumb\b/,
    "the credits screen draws the small copy rather than the lesson version"
  );

  // And every wording it shows has to exist in both dictionaries: a missing key
  // is an empty line on a screen nobody opens before shipping it.
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  const wordings = new Set([...page.matchAll(/\bt\.([A-Za-z0-9_]+)/g)].map((match) => match[1]));
  assert.ok(wordings.size >= 5, `only ${wordings.size} wordings were read from the credits screen`);

  for (const wording of wordings) {
    assert.equal(
      [...dictionary.matchAll(new RegExp(`^ {4}${wording}:`, "gm"))].length,
      2,
      `${wording} is not written in both languages`
    );
  }
});
