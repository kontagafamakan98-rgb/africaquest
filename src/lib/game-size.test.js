import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { COUNT_LANGUAGES, advertisedCounts, numberInWords } from "./game-size.js";
import { LEVELS } from "../components/game/gameData.js";
import { LEVEL_CONTENT_IDS } from "../components/game/level-content.js";

// What the game tells a reader about its own size.
//
// The map draws one card per level, and how many of them there are - and how
// many questions stand behind them - is written out in the sentences a reader
// meets first: the subtitle under the title, the about page, the terms, the
// manifest, and the two descriptions a crawler reads. Those are sentences, so a
// level added to the game does not change them, and a subtitle that said
// "twenty levels" sat over a map of twenty-six for as long as nobody read the
// two together, as did an about page that promised "more than two hundred
// questions" for a game that holds five hundred and forty-six. This test is
// that reading, for both numbers a reader is told.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

/** How many levels the game really ships: one file each, whatever the text says. */
function realLevelCount() {
  return readdirSync(path.join(ROOT, "src", "components", "game", "levels"))
    .filter((file) => /^level-\d+\.js$/.test(file)).length;
}

/** How many questions it really asks: the level table is what holds them. */
function realQuestionCount() {
  return LEVELS.reduce((total, level) => total + (level.questions?.length ?? 0), 0);
}

/** The number of each thing the game holds, counted where it really lives. */
function theRealCounts() {
  return { levels: realLevelCount(), questions: realQuestionCount() };
}

// The passages a reader is told the size of the game in, the languages each is
// written in, and the counts each of them claims. The page and the manifest are
// English; the three screens carry both languages side by side.
const PASSAGES = [
  { file: "src/components/i18n.jsx", languages: COUNT_LANGUAGES, counts: ["levels"] },
  { file: "src/pages/About.jsx", languages: COUNT_LANGUAGES, counts: ["levels", "questions"] },
  { file: "src/pages/TermsOfService.jsx", languages: COUNT_LANGUAGES, counts: ["levels"] },
  { file: "index.html", languages: ["en"], counts: ["levels"] },
  { file: "public/manifest.json", languages: ["en"], counts: ["levels"] },
];

test("a count is spelled the way the sentences spell it", () => {
  assert.equal(numberInWords(1, "en"), "one");
  assert.equal(numberInWords(20, "en"), "twenty");
  assert.equal(numberInWords(26, "en"), "twenty-six");
  assert.equal(numberInWords(99, "en"), "ninety-nine");
  // The hundreds, where a question count lands: the "and" belongs to the last
  // part of the number and only when there is one.
  assert.equal(numberInWords(100, "en"), "one hundred");
  assert.equal(numberInWords(105, "en"), "one hundred and five");
  assert.equal(numberInWords(200, "en"), "two hundred");
  assert.equal(numberInWords(546, "en"), "five hundred and forty-six");
  assert.equal(numberInWords(999, "en"), "nine hundred and ninety-nine");

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
  // A hundred in French is "cent", never "un cent", and the "s" belongs to a
  // hundred that ends the number.
  assert.equal(numberInWords(100, "fr"), "cent");
  assert.equal(numberInWords(101, "fr"), "cent un");
  assert.equal(numberInWords(180, "fr"), "cent quatre-vingts");
  assert.equal(numberInWords(200, "fr"), "deux cents");
  assert.equal(numberInWords(201, "fr"), "deux cent un");
  assert.equal(numberInWords(546, "fr"), "cinq cent quarante-six");
  assert.equal(numberInWords(999, "fr"), "neuf cent quatre-vingt-dix-neuf");

  // And what it cannot spell, it says so rather than guessing at a word.
  assert.equal(numberInWords(0, "en"), null);
  assert.equal(numberInWords(1000, "en"), null);
  assert.equal(numberInWords(26, "de"), null);
  assert.equal(numberInWords("not a number", "en"), null);
});

test("a count is read out of the words that say it, and out of nothing else", () => {
  // The count is read where a number belongs, not wherever a number word
  // appears: the terms say "twenty-six thematic levels", and the quiz says
  // "twenty thousand women", and only the first is a claim about the game.
  assert.deepEqual(advertisedCounts("It offers twenty-six thematic levels, three modes.", "en", "levels"), [26]);
  assert.deepEqual(advertisedCounts("Twenty-six levels of African history.", "en", "levels"), [26]);
  assert.deepEqual(advertisedCounts("It offers twenty thematic levels.", "en", "levels"), [20]);
  assert.deepEqual(advertisedCounts("Il propose vingt-six niveaux thématiques.", "fr", "levels"), [26]);
  assert.deepEqual(advertisedCounts("Vingt niveaux d'histoire africaine.", "fr", "levels"), [20]);

  // A phrase that says five hundred and forty-six is read as that, and not as
  // the five or the forty-six it is built from.
  assert.deepEqual(advertisedCounts("five hundred and forty-six questions", "en", "questions"), [546]);
  assert.deepEqual(advertisedCounts("Five hundred and forty-six questions.", "en", "questions"), [546]);
  assert.deepEqual(advertisedCounts("cinq cent quarante-six questions", "fr", "questions"), [546]);
  assert.deepEqual(advertisedCounts("more than two hundred questions", "en", "questions"), [200]);

  // A count of one thing is not a count of another: a level count is not read
  // out of a sentence about the questions, or the other way round.
  assert.deepEqual(advertisedCounts("five hundred and forty-six questions", "en", "levels"), []);
  assert.deepEqual(advertisedCounts("twenty-six levels", "en", "questions"), []);

  // A word that is not about the size of this game is not a count of it, and a
  // shorter word built into a longer one is not read on its own.
  assert.deepEqual(advertisedCounts("A march of twenty thousand women.", "en", "levels"), []);
  assert.deepEqual(advertisedCounts("twenty-five levels and twenty levels", "en", "levels"), [25, 20]);

  // A passage says nothing, and this answers nothing, rather than throwing.
  assert.deepEqual(advertisedCounts("No number here at all.", "en", "levels"), []);
  assert.deepEqual(advertisedCounts("No number here at all.", "de", "levels"), []);
});

test("the two counts the game holds come from the things that hold them", () => {
  const { levels, questions } = theRealCounts();

  assert.ok(levels >= 20, `only ${levels} level files: this game is expected to be a full map`);
  assert.equal(levels, LEVELS.length, "the level files and the level table disagree about how many levels there are");
  assert.equal(levels, LEVEL_CONTENT_IDS.length, "a level can be opened that no file ships, or the other way round");
  assert.ok(questions >= 200, `only ${questions} questions: this game is expected to ask more than that`);
});

test("every sentence that names how big the game is names the real number", () => {
  const real = theRealCounts();

  for (const { file, languages, counts } of PASSAGES) {
    const text = read(file);
    for (const language of languages) {
      for (const what of counts) {
        const advertised = advertisedCounts(text, language, what);
        assert.ok(advertised.length > 0, `${file} (${language}): nothing says how many ${what} there are`);
        for (const number of advertised) {
          assert.equal(number, real[what], `${file} (${language}) says ${number} ${what}, and the game holds ${real[what]}`);
        }
      }
    }
  }
});
