import test from "node:test";
import assert from "node:assert/strict";
// Explicit extension: the file is also loaded directly by the test runner.
import { LEVEL_STUDY, getLevelStudy } from "./level-study.js";
import { LEVELS } from "./gameData.js";
import {
  MATCHING_PAIRS,
  emptyAssignment,
  isMatchingRight,
  matchingGivenText,
  matchingQuestion,
  matchingRightText,
} from "./matching.js";

/**
 * The matching question, read from the lessons it is assembled from.
 *
 * The question holds no wording of its own, so what can go wrong with it is
 * never a typo: it is the two halves arriving misaligned - a name shown beside
 * the description of another name - or a lesson holding too few names to ask at
 * all. Both are invisible on the screen where the question is drawn, and both
 * teach the wrong thing to whoever reads it. So every lesson is asked here, in
 * both languages, and the answer is compared with the lesson it came from.
 */

/** The ids of every lesson of the game, in order. */
const LEVEL_IDS = LEVELS.map((level) => level.id).sort((a, b) => a - b);

test("every lesson can be matched, in both languages", () => {
  for (const id of LEVEL_IDS) {
    for (const lang of ["en", "fr"]) {
      const study = getLevelStudy(id, lang);
      const question = matchingQuestion(study, id);

      assert.ok(question, `level ${id} (${lang}): the lesson cannot carry a matching question`);
      assert.equal(question.type, "match", `level ${id} (${lang})`);
      assert.equal(question.terms.length, MATCHING_PAIRS, `level ${id} (${lang}): the wrong number of names`);
      assert.equal(
        question.definitions.length,
        MATCHING_PAIRS,
        `level ${id} (${lang}): the wrong number of descriptions`
      );
      assert.equal(question.solution.length, MATCHING_PAIRS, `level ${id} (${lang}): the wrong number of answers`);

      // Every name and every description is the lesson's own, with nothing
      // invented and nothing left blank.
      const names = study.people.map((entry) => entry.name);
      const descriptions = study.people.map((entry) => entry.text);
      question.terms.forEach((term) => assert.ok(names.includes(term), `level ${id} (${lang}): ${term} is not a name of the lesson`));
      question.definitions.forEach((definition) =>
        assert.ok(descriptions.includes(definition), `level ${id} (${lang}): a description the lesson does not hold`)
      );

      // And the answer really is the lesson's: for every term, the description
      // its own entry carries sits where the solution says it does.
      question.terms.forEach((term, index) => {
        const entry = study.people.find((person) => person.name === term);
        assert.equal(
          question.definitions[question.solution[index]],
          entry.text,
          `level ${id} (${lang}): ${term} is not matched with its own description`
        );
      });
    }
  }
});

test("the descriptions are never left in the order they belong in", () => {
  // The one mistake that would make the question answerable without reading:
  // the descriptions shown in the order of the names above them, so that the
  // row of buttons reads 1, 2, 3. The shuffle rotates it when it comes out
  // sorted, and this is what holds that.
  for (const id of LEVEL_IDS) {
    for (const lang of ["en", "fr"]) {
      const question = matchingQuestion(getLevelStudy(id, lang), id);
      assert.notDeepEqual(
        question.solution,
        question.solution.map((_place, index) => index),
        `level ${id} (${lang}): the answers are already lined up`
      );
      // Every term still has exactly one description, so no description is
      // shown twice and none is missing.
      assert.deepEqual(
        [...question.solution].sort((a, b) => a - b),
        question.solution.map((_place, index) => index),
        `level ${id} (${lang}): the descriptions do not line up with the names`
      );
    }
  }
});

test("the same lesson asks the same matching question in both languages", () => {
  // Which name is matched with which position does not depend on the language,
  // so a player switching mid-run does not find the buttons rearranged under
  // their hands. The names themselves may be the same in both languages - a
  // person is named the same way in French - but the descriptions are sentences,
  // and a sentence the same in both is a sentence nobody translated.
  for (const id of LEVEL_IDS) {
    const english = matchingQuestion(getLevelStudy(id, "en"), id);
    const french = matchingQuestion(getLevelStudy(id, "fr"), id);
    assert.deepEqual(english.solution, french.solution, `level ${id}: the two languages disagree about the answers`);
    assert.notDeepEqual(
      english.definitions,
      french.definitions,
      `level ${id}: the French descriptions were never translated`
    );
  }
});

test("a lesson that cannot carry the question says so rather than drawing it empty", () => {
  assert.equal(matchingQuestion(undefined), null);
  assert.equal(matchingQuestion({}), null);
  assert.equal(matchingQuestion({ people: [] }), null);
  assert.equal(
    matchingQuestion({ people: [{ name: "One", text: "First" }, { name: "Two", text: "Second" }] }),
    null,
    "two pairs is a coin toss, not a question"
  );

  // A name with no description, or a description with no name, is not counted:
  // it would draw as an empty half of a pair.
  const partial = {
    people: [
      { name: "One", text: "First" },
      { name: "Two", text: "" },
      { name: "Three" },
      { name: "Four", text: "Fourth" },
      { name: "Five", text: "Fifth" },
    ],
  };
  const question = matchingQuestion(partial, 1);
  assert.ok(question, "the three usable pairs are enough");
  assert.deepEqual(question.terms, ["One", "Four", "Five"], "and the two unusable ones are left out");
  assert.equal(question.definitions.length, 3, "no half pair reaches the screen");
});

test("a lesson with no people falls back to its places, then to its words", () => {
  // The three sections ask the same thing, so a lesson that names nobody is
  // still asked about the places it visits, and failing that about its words.
  const places = matchingQuestion(
    {
      places: [
        { name: "A", text: "First" },
        { name: "B", text: "Second" },
        { name: "C", text: "Third" },
      ],
    },
    1
  );
  assert.deepEqual(places.terms, ["A", "B", "C"]);
  assert.equal(places.definitions[places.solution[1]], "Second");

  const words = matchingQuestion(
    {
      places: [{ name: "Only", text: "One place" }],
      glossary: [
        { term: "X", text: "First" },
        { term: "Y", text: "Second" },
        { term: "Z", text: "Third" },
      ],
    },
    1
  );
  assert.deepEqual(words.terms, ["X", "Y", "Z"], "a short section is skipped, not padded from another one");
});

test("matches are right only when every term sits beside its own description", () => {
  const question = matchingQuestion(getLevelStudy(3, "en"), 3);
  const right = [...question.solution];

  assert.equal(isMatchingRight(question, right), true, "the lesson's own matches are right");
  assert.equal(isMatchingRight(question, emptyAssignment(question)), false, "a blank sheet is not");
  assert.equal(isMatchingRight(question, []), false, "nor is an answer of the wrong length");
  assert.equal(isMatchingRight(question, null), false);
  assert.equal(isMatchingRight(null, right), false, "and a question that is not there is not right");

  // One row wrong is a wrong answer to the question, and every row is held, so
  // no position can be swapped for another without being noticed.
  right.forEach((_place, index) => {
    const swapped = right.map((place, at) => (at === index ? (place + 1) % right.length : place));
    assert.equal(isMatchingRight(question, swapped), false, `row ${index + 1} moved and the answer stayed right`);
  });
});

test("the matches and the lesson are read back in words, for a corrigé", () => {
  const question = matchingQuestion(getLevelStudy(3, "en"), 3);
  const right = matchingRightText(question);
  const given = matchingGivenText(question, question.solution);

  assert.equal(given, right, "what a player matched reads the same as what the lesson tells");
  for (const term of question.terms) {
    assert.ok(right.includes(term), `the corrigé names ${term}`);
  }
  assert.ok(right.includes(" · "), "and the pairs are separated rather than run together");

  // A term left blank is dropped rather than written as "undefined": the caller
  // says it in its own words.
  const blank = matchingGivenText(question, emptyAssignment(question));
  assert.equal(blank, "", "a blank sheet reads as nothing");
  assert.equal(matchingGivenText(question, null), "", "and so does no sheet at all");
});

test("every lesson of the study pack is reachable through the loader", () => {
  // The question is assembled from the pack the lesson screen reads, so a
  // lesson that exists in the table but not through the loader would be asked
  // nothing at all. The two lists are held together here rather than assumed.
  const packIds = Object.keys(LEVEL_STUDY).map(Number).sort((a, b) => a - b);
  assert.deepEqual(packIds, LEVEL_IDS, "the study pack and the levels are not the same list");
});
