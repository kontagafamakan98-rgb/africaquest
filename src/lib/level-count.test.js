import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { COUNT_LANGUAGES, advertisedLevelCounts, numberInWords } from "./level-count.js";

// What the game tells a reader about its own size.
//
// The map draws one card per level, and the number of them is written out in the
// sentences a reader meets first: the subtitle under the title, the about page,
// the terms, the manifest, and the two descriptions a crawler reads. Those are
// sentences, so a level added to the game does not change them, and a subtitle
// that said "twenty levels" sat over a map of twenty-six for as long as nobody
// read the two together. This test is that reading.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

/** How many levels the game really ships: one file each, whatever the text says. */
function realLevelCount() {
  return readdirSync(path.join(ROOT, "src", "components", "game", "levels"))
    .filter((file) => /^level-\d+\.js$/.test(file)).length;
}

test("a count is spelled the way the sentences spell it", () => {
  assert.equal(numberInWords(1, "en"), "one");
  assert.equal(numberInWords(20, "en"), "twenty");
  assert.equal(numberInWords(26, "en"), "twenty-six");
  assert.equal(numberInWords(99, "en"), "ninety-nine");

  assert.equal(numberInWords(16, "fr"), "seize");
  assert.equal(numberInWords(20, "fr"), "vingt");
  assert.equal(numberInWords(26, "fr"), "vingt-six");
  // The decades French has no word for, which is where a table written by hand
  // is wrong first: sixty counts on, eighty is plural on its own.
  assert.equal(numberInWords(70, "fr"), "soixante-dix");
  assert.equal(numberInWords(71, "fr"), "soixante et onze");
  assert.equal(numberInWords(80, "fr"), "quatre-vingts");
  assert.equal(numberInWords(81, "fr"), "quatre-vingt-un");
  assert.equal(numberInWords(91, "fr"), "quatre-vingt-onze");

  // And what it cannot spell, it says so rather than guessing at a word.
  assert.equal(numberInWords(0, "en"), null);
  assert.equal(numberInWords(100, "en"), null);
  assert.equal(numberInWords(26, "de"), null);
  assert.equal(numberInWords("not a number", "en"), null);
});

test("a number of levels is read out of the words that say it", () => {
  // The count is read where a number belongs, not wherever a number word
  // appears: the terms say "twenty-six thematic levels", and the quiz says
  // "twenty thousand women", and only the first is a claim about the game.
  assert.deepEqual(advertisedLevelCounts("It offers twenty-six thematic levels, three modes.", "en"), [26]);
  assert.deepEqual(advertisedLevelCounts("Twenty-six levels of African history.", "en"), [26]);
  assert.deepEqual(advertisedLevelCounts("It offers twenty thematic levels.", "en"), [20]);
  assert.deepEqual(advertisedLevelCounts("Il propose vingt-six niveaux thématiques.", "fr"), [26]);
  assert.deepEqual(advertisedLevelCounts("Vingt niveaux d'histoire africaine.", "fr"), [20]);

  // A word that is not about the levels of this game is not a count of them,
  // and a shorter word built into a longer one is not read on its own.
  assert.deepEqual(advertisedLevelCounts("A march of twenty thousand women.", "en"), []);
  assert.deepEqual(advertisedLevelCounts("twenty-five levels and twenty levels", "en"), [25, 20]);

  // A passage says nothing, and this answers nothing, rather than throwing.
  assert.deepEqual(advertisedLevelCounts("No number here at all.", "en"), []);
  assert.deepEqual(advertisedLevelCounts("No number here at all.", "de"), []);
});

test("every sentence that names a number of levels names the real one", () => {
  const count = realLevelCount();
  assert.ok(count >= 20, `only ${count} level files: this game is expected to be a full map`);

  // Every passage a reader is told the size of the game in, and the languages it
  // is written in. The page and the manifest are English; the three screens
  // carry both languages side by side.
  const passages = [
    { file: "src/components/i18n.jsx", languages: COUNT_LANGUAGES },
    { file: "src/pages/About.jsx", languages: COUNT_LANGUAGES },
    { file: "src/pages/TermsOfService.jsx", languages: COUNT_LANGUAGES },
    { file: "index.html", languages: ["en"] },
    { file: "public/manifest.json", languages: ["en"] },
  ];

  for (const { file, languages } of passages) {
    const text = read(file);
    for (const language of languages) {
      const advertised = advertisedLevelCounts(text, language);
      assert.ok(advertised.length > 0, `${file} (${language}): nothing says how many levels there are`);
      for (const number of advertised) {
        assert.equal(number, count, `${file} (${language}) says ${number} levels, and the game ships ${count}`);
      }
    }
  }
});
