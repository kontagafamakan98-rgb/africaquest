/**
 * Writes the brief of the game: what the first screen draws, and nothing else.
 *
 *   node scripts/generate-level-facts.mjs          # regenerate level-facts.js
 *   node scripts/generate-level-facts.mjs --check  # fail when it is out of date
 *
 * The map is the first thing a player sees, and it must not wait for the quiz,
 * the lesson stories and the photography of the whole game to arrive before it
 * can be drawn. The entry file therefore carries only what a level card shows:
 * its title in the two languages, its era and place in the timeline, the picture
 * on the card, and the number of questions behind it - which the review
 * schedule needs to know what a level still holds even when the questions
 * themselves are not there yet.
 *
 * Those facts live in three tables that already own them: the levels in
 * gameData.js, the French wording in content-fr.js, and the photographs in
 * level-images.js. Rather than write them a second time by hand, where a level
 * renamed or a picture replaced would leave the map behind, they are read out of
 * those tables here and written down. A step of `npm run verify` runs this
 * script with --check, so the file cannot drift away from what it is made of.
 *
 * The third file of a photograph is decided by its fingerprint, exactly as it is
 * everywhere else: the AVIF list below is what `avifSha256` says, never a list
 * of names kept beside it.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVELS } from "../src/components/game/gameData.js";
import { LEVELS_FR } from "../src/components/game/content-fr.js";
import { LEVEL_GALLERIES, LEVEL_PHOTOS } from "../src/lib/level-images.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = path.join(ROOT, "src", "components", "game", "level-facts.js");
const check = process.argv.includes("--check");

const quoted = (value) => JSON.stringify(value);

/** The name of the icon a level is drawn with, as lucide exports it. */
function iconName(level) {
  const name = level?.icon?.displayName;
  if (typeof name !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`level ${level.id}: the icon has no name to write down`);
  }
  return name;
}

/**
 * One level, as the map reads it.
 *
 * A missing French wording falls back to the English one here rather than at
 * render time, so the file is complete on its own and a card can never show a
 * gap in the middle of a title.
 */
function factsOf(level) {
  const photo = (LEVEL_GALLERIES[level.id] || [])[0];
  if (!photo) throw new Error(`level ${level.id}: no photograph to show on its card`);

  const french = LEVELS_FR[level.id];
  if (!french) throw new Error(`level ${level.id}: the French wording of this level is missing`);

  return {
    id: level.id,
    order: level.order,
    era: level.era,
    from: level.from,
    title: level.title,
    subtitle: level.subtitle,
    region: level.region,
    color: level.color,
    icon: iconName(level),
    image: photo.file,
    questionCount: level.questions.length,
    fr: {
      title: french.title ?? level.title,
      subtitle: french.subtitle ?? level.subtitle,
      region: french.region ?? level.region,
    },
  };
}

const facts = LEVELS.map(factsOf);
const avif = LEVEL_PHOTOS.filter((photo) => photo.avifSha256).map((photo) => photo.file);
// The pictures a card copy was written for, read from the same fingerprints: the
// map offers two widths for those and one for the others.
const cards = LEVEL_PHOTOS.filter((photo) => photo.cardSha256).map((photo) => photo.file);

const row = (fact) =>
  [
    "  {",
    `    id: ${fact.id},`,
    `    order: ${fact.order},`,
    `    era: ${quoted(fact.era)},`,
    `    from: ${fact.from},`,
    `    title: ${quoted(fact.title)},`,
    `    subtitle: ${quoted(fact.subtitle)},`,
    `    region: ${quoted(fact.region)},`,
    `    color: ${quoted(fact.color)},`,
    `    icon: ${quoted(fact.icon)},`,
    `    image: ${quoted(fact.image)},`,
    `    questionCount: ${fact.questionCount},`,
    `    fr: { title: ${quoted(fact.fr.title)}, subtitle: ${quoted(fact.fr.subtitle)}, region: ${quoted(fact.fr.region)} },`,
    "  },",
  ].join("\n");

const text = `/**
 * The brief of the game: the twenty-six levels as the first screen needs them.
 *
 * WRITTEN BY scripts/generate-level-facts.mjs. Do not edit by hand: the facts
 * below are read out of the level table, the French wording and the photograph
 * table, and \`npm run verify\` regenerates them and fails when this file no
 * longer matches those three. Run \`npm run level:facts\` after changing one of
 * them.
 *
 * Everything a level card draws is here, and nothing else is: the title and its
 * place in the timeline in both languages, the icon and the colour, the picture
 * on the card, and how many questions the level holds. The questions themselves,
 * the lesson stories and the rest of the gallery stay out of the entry file, so
 * a player waiting for the map is not made to download the whole game for it.
 */

export const LEVEL_FACTS = [
${facts.map(row).join("\n")}
];

/**
 * The photographs that also ship an AVIF, in the order of the table.
 *
 * The third format is a fact about the files, recorded as a fingerprint by
 * scripts/stamp-photos.mjs, and a browser cannot ask for a picture and fall back
 * when it is not there: a picture without one is offered as WebP alone, which is
 * what this list says.
 */
export const AVIF_FILES = [
${avif.map((file) => `  ${quoted(file)},`).join("\n")}
];

/**
 * The photographs a copy was written for at the width of a card.
 *
 * The map draws twenty-six cards, one picture each, three hundred and fifty eight
 * pixels wide on a phone, and the light version of those pictures is six hundred
 * and forty across. These are the files written for that width, and a picture
 * that has one is offered to the browser in two widths rather than one, so the
 * sharper screen keeps the sharper file and the smaller screen stops paying for
 * pixels it never shows.
 *
 * Read from the fingerprints the same way the AVIF list is: a file that is not
 * there is a file nobody may ask for, since a source pointing at it would show
 * no picture at all rather than the one behind it.
 */
export const CARD_FILES = [
${cards.map((file) => `  ${quoted(file)},`).join("\n")}
];
`;

if (check) {
  const current = existsSync(TARGET) ? readFileSync(TARGET, "utf8") : "";
  if (current !== text) {
    console.error("facts (check): src/components/game/level-facts.js is not what the tables draw");
    console.error("  run: npm run level:facts");
    process.exit(1);
  }
  console.log(
    `facts (check): ${facts.length} levels, ${avif.length} AVIF and ${cards.length} card copies of ` +
      `${LEVEL_PHOTOS.length} photographs, all up to date`
  );
  process.exit(0);
}

writeFileSync(TARGET, text);
console.log(`facts: ${facts.length} levels written to src/components/game/level-facts.js`);
console.log(`  ${avif.length} of ${LEVEL_PHOTOS.length} photographs offered as AVIF beside the WebP, from their fingerprints`);
console.log(`  ${cards.length} offered at the width of a card as well, for the map`);
