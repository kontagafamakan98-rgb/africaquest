/**
 * Fails as long as a piece of English content has no French wording.
 *
 *   node scripts/check-translations.mjs
 *
 * The build runs this before vite build, because a missing translation is
 * invisible to every other check: the bundler is happy, the tests that read one
 * language are happy, and the player simply reads English under a French
 * interface. What is checked here is the content itself, through the same audit
 * the tests use, so the app cannot be built with a question, an anecdote or a
 * lesson story written in one language only.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVELS } from "../src/components/game/gameData.js";
import { LEVELS_FR } from "../src/components/game/content-fr.js";
import { auditTranslations, extractLevelStories } from "../src/lib/translation-audit.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const shown = 40;

const stories = extractLevelStories(readFileSync(path.join(ROOT, "src/components/game/AudioNarrator.jsx"), "utf8"));
const gaps = auditTranslations({ levels: LEVELS, french: LEVELS_FR, stories });
const questions = LEVELS.reduce((total, level) => total + level.questions.length, 0);

if (gaps.length === 0) {
  console.log(
    `translations: ${LEVELS.length} levels, ${questions} questions and ${Object.keys(stories).length} lesson stories, all written in French`
  );
  process.exit(0);
}

console.error(`translations: ${gaps.length} piece(s) of English content without a French wording\n`);
gaps.slice(0, shown).forEach((gap) => {
  console.error(`  level ${gap.level} (${gap.field})${gap.where ? `, ${gap.where}` : ""}: ${gap.reason}`);
  if (gap.english) console.error(`    ${gap.english}`);
});
if (gaps.length > shown) console.error(`  and ${gaps.length - shown} more`);

console.error("\nThe French wording lives in src/components/game/content-fr.js, the lesson stories in AudioNarrator.jsx.");
process.exit(1);
