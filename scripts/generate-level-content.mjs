/**
 * Writes the content of a level into a module of its own: the questions, their
 * explanations, their references, the study pack and the gallery, in both
 * languages.
 *
 *   node scripts/generate-level-content.mjs          # write src/components/game/levels/
 *   node scripts/generate-level-content.mjs --check  # fail when a file is out of date
 *
 * A lesson is one level, and it does not need the other nineteen to be read. The
 * content of the whole game lives in gameData.js and content-fr.js, which is
 * what the screens that really need every level read - the review inbox, the
 * bibliography, the statistics. A lesson is not one of them, so rather than hand
 * it the whole game and let it throw away nineteen twentieths, the content of
 * each level is written down here, one module per level, and the lesson asks the
 * browser for the one it is opening.
 *
 * That is a second copy of a text that already exists, and it is written rather
 * than hand-kept for the same reason the brief of the game is: a question added,
 * a reference corrected or a level renamed must not leave this behind. The
 * levels, the French wording, the study pack and the photograph table own those
 * facts, and this script reads them out of all four. `npm run verify` runs it
 * with --check, so the files cannot drift away from what they are made of.
 *
 * The study pack of a level travels with it for the same reason the questions
 * do: a lesson draws its own history, timeline, people, places and words, and
 * has no use for the nineteen other lessons. It used to be read from one module
 * holding all twenty, which meant a player who opened one level downloaded the
 * study material of the whole game.
 *
 * One module and not twenty: the bundler is what turns twenty modules into
 * twenty requests, and the size of the whole game is exactly what a player who
 * opens one lesson must not have to download.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVELS, getLevelGallery } from "../src/components/game/gameData.js";
import { LEVELS_FR } from "../src/components/game/content-fr.js";
import { LEVEL_STUDY } from "../src/components/game/level-study.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIRECTORY = path.join(ROOT, "src", "components", "game", "levels");
const check = process.argv.includes("--check");

/** The file one level is written to, numbered the way the levels are. */
const fileOf = (level) => path.join(DIRECTORY, `level-${String(level.id).padStart(2, "0")}.js`);

/** A string, as it is written in the source: quoted, escaped, one line. */
const quote = (value) => JSON.stringify(value);

/**
 * A value of the content, written the way a person would write it.
 *
 * The output is source rather than JSON: an array of short strings - the four
 * answers of a question - stays on one line, a row of short fields stays on one
 * line, and everything longer is broken over several. The point is a file
 * somebody can read and diff, since a review of a level's content is a review of
 * this file.
 */
function pretty(value, indent) {
  const pad = " ".repeat(indent);

  if (typeof value === "string") return quote(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return `[${value.map((item) => pretty(item, indent)).join(", ")}]`;
    }
    const body = value.map((item) => `${pad}  ${pretty(item, indent + 2)},`).join("\n");
    return `[\n${body}\n${pad}]`;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) return "{}";
  const primitive = keys.every((key) => value[key] === null || typeof value[key] !== "object");
  if (primitive) {
    const inner = keys.map((key) => `${key}: ${pretty(value[key], indent)}`).join(", ");
    if (pad.length + inner.length <= 100) return `{ ${inner} }`;
  }
  const body = keys.map((key) => `${pad}  ${key}: ${pretty(value[key], indent + 2)},`).join("\n");
  return `{\n${body}\n${pad}}`;
}

/** The name of the icon a level is drawn with, as lucide exports it. */
function iconName(level) {
  const name = level?.icon?.displayName;
  if (typeof name !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`level ${level.id}: the icon has no name to write down`);
  }
  return name;
}

/** One level, as the lesson reads it. */
function moduleOf(level) {
  const french = LEVELS_FR[level.id];
  if (!french) throw new Error(`level ${level.id}: the French wording of this level is missing`);

  const gallery = { en: getLevelGallery(level.id, "en"), fr: getLevelGallery(level.id, "fr") };
  if (gallery.en.length === 0) throw new Error(`level ${level.id}: no photograph to show in its lesson`);

  const study = LEVEL_STUDY[level.id];
  if (!study?.en || !study?.fr) {
    throw new Error(`level ${level.id}: the study material of this level is missing`);
  }

  const title = level.title.replace(/\\/g, "").replace(/\*\//g, "");
  return `/**
 * ${title}: one level of the game, on its own.
 *
 * WRITTEN BY scripts/generate-level-content.mjs. Do not edit by hand. The
 * questions, their references, the study pack and the gallery are read out of
 * gameData.js, content-fr.js, level-study.js and level-images.js, and
 * \`npm run verify\` regenerates this file and fails when it no longer matches
 * them. Run \`npm run level:content\` after changing one of those.
 *
 * A lesson opens one level, so this is what it downloads: not the other
 * nineteen, and not the screens that need every level.
 */
import { ${iconName(level)} } from "lucide-react";

export default {
  id: ${level.id},
  order: ${level.order},
  era: ${quote(level.era)},
  from: ${level.from},
  title: ${quote(level.title)},
  subtitle: ${quote(level.subtitle)},
  region: ${quote(level.region)},
  color: ${quote(level.color)},
  icon: ${iconName(level)},
  gallery: ${pretty(gallery, 2)},
  study: ${pretty(study, 2)},
  questions: ${pretty(level.questions, 2)},
  fr: ${pretty(
    {
      title: french.title ?? level.title,
      subtitle: french.subtitle ?? level.subtitle,
      region: french.region ?? level.region,
      questions: french.questions,
    },
    2
  )},
};
`;
}

const written = new Map();
for (const level of LEVELS) written.set(fileOf(level), moduleOf(level));

if (check) {
  const stale = [];
  for (const [file, source] of written) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== source) {
      stale.push(path.relative(ROOT, file));
    }
  }
  const known = new Set([...written.keys()].map((file) => path.basename(file)));
  const extra = existsSync(DIRECTORY)
    ? readdirSync(DIRECTORY).filter((name) => name.endsWith(".js") && !known.has(name))
    : [];
  if (stale.length === 0 && extra.length === 0) {
    console.log(
      `level content: ${written.size} levels, one module each, all up to date`
    );
    process.exit(0);
  }
  stale.forEach((file) => console.error(`  ${file} is out of date`));
  extra.forEach((name) => console.error(`  src/components/game/levels/${name} belongs to no level`));
  console.error("\nRun npm run level:content to write these files.");
  process.exit(1);
}

// The directory holds the twenty levels and nothing else: a file left behind by
// a level that was renumbered is a chunk the build would still write.
mkdirSync(DIRECTORY, { recursive: true });
const known = new Set([...written.keys()].map((file) => path.basename(file)));
for (const name of readdirSync(DIRECTORY)) {
  if (name.endsWith(".js") && !known.has(name)) rmSync(path.join(DIRECTORY, name));
}
for (const [file, source] of written) writeFileSync(file, source, "utf8");

console.log(`level content: wrote ${written.size} levels to src/components/game/levels/`);
