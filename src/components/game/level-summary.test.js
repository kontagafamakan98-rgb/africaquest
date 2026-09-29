import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LEVELS } from "./gameData.js";
import { LEVELS_FR } from "./content-fr.js";
import { AVIF_FILES, LEVEL_FACTS } from "./level-facts.js";
import {
  AVIF_PHOTOS,
  LEVEL_IMAGES,
  LEVEL_SUMMARIES,
  TOTAL_QUESTIONS,
  getLevelSummaries,
} from "./level-summary.js";
import { LEVEL_GALLERIES, LEVEL_PHOTOS } from "../../lib/level-images.js";

// The map is drawn from a brief of the game rather than from the game itself, so
// that a player waiting for it does not download two hundred questions, twenty
// lesson stories and sixty photographs first. The brief is written out of the
// three tables that own those facts, and this suite is the seam where the two
// could drift apart: a level renamed, a picture replaced or a question added
// leaves the map showing something the game no longer holds, and nothing about
// the file itself would say so.
//
// It reads the generated facts the way the application does, and compares them
// with the tables they came from.

const ROOT = path.resolve(import.meta.dirname, "..", "..", "..");
const factOf = (id) => LEVEL_FACTS.find((fact) => fact.id === id);

test("the brief carries every level the game holds, fact for fact", () => {
  assert.equal(LEVEL_FACTS.length, LEVELS.length, "one brief per level, and no extra");
  assert.equal(LEVEL_SUMMARIES.length, LEVELS.length);

  for (const level of LEVELS) {
    const fact = factOf(level.id);
    const where = `level ${level.id} (${level.title})`;
    assert.ok(fact, `${where}: the map has no brief for it`);

    // What a card draws, and what the review schedule counts against.
    assert.equal(fact.order, level.order, `${where}: its place in the timeline`);
    assert.equal(fact.era, level.era, `${where}: its era`);
    assert.equal(fact.from, level.from, `${where}: the year it opens`);
    assert.equal(fact.title, level.title);
    assert.equal(fact.subtitle, level.subtitle);
    assert.equal(fact.region, level.region);
    assert.equal(fact.color, level.color, `${where}: the colour behind its picture`);
    assert.equal(
      fact.questionCount,
      level.questions.length,
      `${where}: the review schedule reads this number, so it is the questions the level really holds`
    );

    // The icon is written as a name, because a component cannot be written down
    // in a generated file; it has to be the one the level itself is drawn with.
    assert.equal(
      fact.icon,
      level.icon.displayName,
      `${where}: the icon of the card is not the icon of the level`
    );

    // The French wording, and the fallback the application promises when a
    // translation is missing.
    const french = LEVELS_FR[level.id];
    assert.deepEqual(
      fact.fr,
      {
        title: french.title ?? level.title,
        subtitle: french.subtitle ?? level.subtitle,
        region: french.region ?? level.region,
      },
      `${where}: the French wording of the card`
    );
  }
});

test("the summary is drawable: every icon resolves and every picture is there", () => {
  const cardPhoto = (id) => LEVEL_GALLERIES[id][0].file;

  for (const level of LEVEL_SUMMARIES) {
    // A card with no icon is a blank square in the middle of the map, and the
    // name in the facts is only resolved if the module knows it.
    assert.ok(level.icon, `level ${level.id}: the icon "${factOf(level.id).icon}" is not resolved by the map`);
    assert.equal(LEVEL_IMAGES[level.id], cardPhoto(level.id), `level ${level.id}: the picture on its card`);
  }

  // The picture on a card is the first of the level's gallery: the map and the
  // lesson have to show the same photograph, or the level opens on another one.
  assert.deepEqual(
    Object.keys(LEVEL_IMAGES).map(Number).sort((a, b) => a - b),
    LEVELS.map((level) => level.id).sort((a, b) => a - b)
  );
});

test("the brief offers the third format exactly where the fingerprints say", () => {
  // A browser cannot ask for a picture and fall back when it is not there, so
  // this list decides whether an AVIF is offered at all. It is read from the
  // fingerprints - never a second list of names kept beside them - and a picture
  // missing from it would quietly be served as the heavier WebP.
  const fromFingerprints = LEVEL_PHOTOS.filter((photo) => photo.avifSha256).map((photo) => photo.file);

  assert.deepEqual([...AVIF_PHOTOS].sort(), [...fromFingerprints].sort());
  assert.deepEqual(
    [...AVIF_FILES].sort(),
    [...fromFingerprints].sort(),
    "the generated list is the fingerprints, and nothing else"
  );
  assert.ok(AVIF_PHOTOS.size > 0 && AVIF_PHOTOS.size < LEVEL_PHOTOS.length, "some pictures have one, not all");
});

test("switching language redraws the map, and never leaves a gap on a card", () => {
  const english = getLevelSummaries("en");
  const french = getLevelSummaries("fr");

  assert.equal(english.length, LEVELS.length);
  assert.equal(french.length, LEVELS.length);

  // The timeline runs in the same order in both languages: the era headings and
  // the unlocked ladder are read from this list.
  assert.deepEqual(english.map((level) => level.id), french.map((level) => level.id));
  assert.deepEqual(
    english.map((level) => level.id),
    [...LEVEL_SUMMARIES].sort((a, b) => a.order - b.order).map((level) => level.id),
    "and it is the order of the timeline, not the order of the table"
  );

  french.forEach((level) => {
    assert.equal(level.title, LEVELS_FR[level.id].title);
    assert.equal(level.region, LEVELS_FR[level.id].region);
    assert.ok(level.title && level.subtitle && level.region, `level ${level.id}: a card is missing a line`);
    // Presentation stays with the level, in both languages.
    assert.equal(level.image, LEVEL_IMAGES[level.id]);
    assert.equal(level.questionCount, LEVELS.find((entry) => entry.id === level.id).questions.length);
  });

  // An unknown language is English, exactly as the full levels behave.
  assert.deepEqual(
    getLevelSummaries("de").map((level) => level.title),
    english.map((level) => level.title)
  );
});

test("the brief is written by the script the verification runs", () => {
  // The facts are generated, so the file itself is not the source of truth: the
  // step that regenerates it is what keeps them in step, and the test above
  // would fail first if it were ever left behind.
  const generator = readFileSync(path.join(ROOT, "scripts", "generate-level-facts.mjs"), "utf8");
  assert.match(generator, /export const LEVEL_FACTS/, "the script writes the brief");
  assert.match(generator, /--check/, "and knows how to say it is out of date");

  const summary = readFileSync(path.join(ROOT, "src", "components", "game", "level-summary.js"), "utf8");
  assert.match(summary, /from "\.\/level-facts\.js"/, "the map reads the generated file");
  assert.doesNotMatch(
    summary,
    /from\s+["'][^"']*(gameData|level-images)["']/,
    "and the module the first screen reads never imports the content of the game"
  );

  // What the whole game asks, from the brief: the statistics tab counts against
  // it without holding a single question.
  assert.equal(
    TOTAL_QUESTIONS,
    LEVELS.reduce((sum, level) => sum + level.questions.length, 0)
  );
});
