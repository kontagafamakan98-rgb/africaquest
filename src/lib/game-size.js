/**
 * The numbers the game states about itself, and the way a sentence says them.
 *
 * The map draws one card per level, and the sentences a reader meets before the
 * first card say how large the game is: twenty-six levels, five hundred and
 * forty-six questions, in the subtitle, the about page, the terms, the manifest
 * and the two descriptions a crawler reads. Those are sentences rather than
 * numbers, so a level added to the game cannot change them by itself - and for a
 * while twenty-six levels sat under a subtitle that said twenty, and the about
 * page promised "more than two hundred questions" for a game that held five
 * hundred and forty-six, which no test was reading.
 *
 * This module is the one place the two are held together. It spells a count the
 * way the sentences write it, and it reads the count a sentence already
 * advertises, so a test can compare what a reader is told with what the game
 * holds. The counts themselves are never written here: the levels are counted
 * from the level files and the questions from the level table, which are the
 * things that really decide them.
 *
 * Plain module: no files, no network, no knowledge of a language beyond the two
 * the game is written in. The counts it can spell run from one to nine hundred
 * and ninety-nine, which is further than a question count will ever reach and
 * short of the thousands, where a sentence stops writing a number as words.
 */

/** English below twenty, where every number is a word of its own. */
const ENGLISH_ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];

/** And the tens the rest are built from, joined to a unit with a hyphen. */
const ENGLISH_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** French counts to sixteen before it builds anything. */
const FRENCH_ONES = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit",
  "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
];

/** And its tens, up to sixty: French has no word of its own past that. */
const FRENCH_TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];

/** A count in English, from one to nine hundred and ninety-nine. */
function english(count) {
  if (count < 20) return ENGLISH_ONES[count];
  if (count < 100) {
    const tens = ENGLISH_TENS[Math.floor(count / 10)];
    const unit = count % 10;
    return unit === 0 ? tens : `${tens}-${ENGLISH_ONES[unit]}`;
  }
  const hundreds = Math.floor(count / 100);
  const rest = count % 100;
  // The "and" belongs to the last part of a number and only when there is one:
  // a hundred, a hundred and one, a hundred and ten, three hundred.
  const head = `${ENGLISH_ONES[hundreds]} hundred`;
  return rest === 0 ? head : `${head} and ${english(rest)}`;
}

/** A count in French, from one to nine hundred and ninety-nine. */
function french(count) {
  if (count <= 16) return FRENCH_ONES[count];
  // Seventeen to nineteen are a ten with a unit on it, joined like every other:
  // dix-sept, dix-huit, dix-neuf.
  if (count < 20) return `dix-${FRENCH_ONES[count - 10]}`;
  if (count < 70) {
    const tens = FRENCH_TENS[Math.floor(count / 10)];
    const unit = count % 10;
    if (unit === 0) return tens;
    if (unit === 1) return `${tens} et un`;
    return `${tens}-${FRENCH_ONES[unit]}`;
  }
  // French has no word for seventy: it counts on from sixty, and "et" comes back
  // in front of the one and nowhere else.
  // Past seventy it is sixty plus the count that follows it, which is how
  // seventy-seven comes out as sixty-seventeen, and past ninety it is eighty
  // plus the same: the units are the ones that carry the word.
  if (count === 70) return "soixante-dix";
  if (count === 71) return "soixante et onze";
  if (count < 80) return `soixante-${french(count - 60)}`;
  // Eighty is plural on its own and singular as soon as something follows it.
  if (count === 80) return "quatre-vingts";
  if (count < 100) return `quatre-vingt-${french(count - 80)}`;
  const hundreds = Math.floor(count / 100);
  const rest = count % 100;
  // A hundred in French is "cent", never "un cent", and the "s" belongs to a
  // hundred that ends the number: deux cents, deux cent un, trois cent mille.
  if (hundreds === 1) return rest === 0 ? "cent" : `cent ${french(rest)}`;
  const head = `${FRENCH_ONES[hundreds]} ${rest === 0 ? "cents" : "cent"}`;
  return rest === 0 ? head : `${head} ${french(rest)}`;
}

/** The two languages the game is written in, and the only ones this can spell. */
export const COUNT_LANGUAGES = ["en", "fr"];

/**
 * What a sentence counts, and the word it counts it with in each language.
 *
 * Two things are counted in the prose a reader meets before the first level: the
 * levels of the map, and the questions behind them. The word for a question is
 * the same in both languages, which is why it is written twice rather than
 * looked up.
 */
export const COUNTED = {
  levels: { en: "levels", fr: "niveaux" },
  questions: { en: "questions", fr: "questions" },
};

/**
 * A count as the sentences write it: "twenty-six", "cinq cent quarante-six".
 *
 * @param {number|string} count how many of something, or anything a caller passed
 * @param {string} language "en" or "fr"
 * @returns {string|null} the words, or null for a count this cannot spell
 */
export function numberInWords(count, language) {
  const value = Math.trunc(Number(count));
  if (!Number.isFinite(value) || value < 1 || value > 999) return null;
  if (language === "fr") return french(value);
  if (language === "en") return english(value);
  return null;
}

/**
 * Every count this can spell, as a lookup from the words back to the number.
 *
 * @param {string} language "en" or "fr"
 * @returns {Map<string, number>} the words of each count, one to nine hundred and ninety-nine
 */
function wordsOfEveryCount(language) {
  const words = new Map();
  for (let count = 1; count <= 999; count += 1) {
    const spelled = numberInWords(count, language);
    if (spelled) words.set(spelled, count);
  }
  return words;
}

/** The words of every count, per language, built once for the whole process. */
/** @type {Map<string, Map<string, number>>} */
const WORDS_BY_LANGUAGE = new Map();
for (const language of COUNT_LANGUAGES) {
  WORDS_BY_LANGUAGE.set(language, wordsOfEveryCount(language));
}

/** A word as a pattern that matches it and nothing else. */
function escapeForPattern(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The numbers a passage puts before one of the things the game counts.
 *
 * It reads the word that stands where a number stands, not any number in the
 * passage: what it looks for is a spelled count immediately before the noun -
 * "levels", "niveaux", "questions" - with at most one word between them, which
 * is how the terms say "twenty-six thematic levels". A sentence that says
 * "twenty thousand women" is about neither levels nor this module, and is not
 * read as an advertisement of anything.
 *
 * @param {string} text a passage a reader is meant to read
 * @param {string} language "en" or "fr"
 * @param {"levels"|"questions"} what the count the sentence claims to name
 * @returns {number[]} one number per sentence that names a count of that thing
 */
export function advertisedCounts(text, language, what) {
  const words = WORDS_BY_LANGUAGE.get(language);
  const noun = COUNTED[what]?.[language];
  if (!words || !noun || typeof text !== "string") return [];
  // Longest first, so "five hundred and forty-six" is tried before "five": a
  // shorter word that is built into a longer one would otherwise swallow it and
  // read the wrong count, and it would do so silently.
  const alternatives = [...words.keys()]
    .sort((left, right) => right.length - left.length)
    .map(escapeForPattern)
    .join("|");
  // A count word is never read from the middle of another one. A word boundary
  // alone is not enough: there is one between the hyphen and the "six" of
  // "twenty-six", and the shorter word was read out of the longer one because
  // of it, so the count of a map of twenty-six came back as six. What may not
  // stand in front of a count is a letter or a hyphen, which is exactly what a
  // built number is made of.
  const pattern = new RegExp(`(?<![\\p{L}-])\\b(${alternatives})\\s+(?:\\p{L}+\\s+)?${noun}\\b`, "giu");

  const found = [];
  for (const match of text.matchAll(pattern)) {
    const count = words.get(match[1].toLowerCase());
    if (count !== undefined) found.push(count);
  }
  return found;
}
