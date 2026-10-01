import test from "node:test";
import assert from "node:assert/strict";
import { LEVELS } from "./gameData.js";
// Explicit extension: the file is also loaded directly by the test runner.
import { answerIsRight, answerText, emptyAnswers, gradeRun, rightText } from "./exam.js";
import { quizQuestions } from "./question-bank.js";
import { getLevelStudy } from "./level-study.js";
import { CHRONOLOGY_STEPS } from "./chronology.js";

/** A level of the whole game, with the study pack a run is assembled from. */
const withStudy = (level, lang = "en") => ({ ...level, study: getLevelStudy(level.id, lang) });

/**
 * Marking a run, and the two things a mark can be wrong about.
 *
 * A mark is the one number of this game that is repeated out loud, by a
 * teacher, to a class: it decides who passed and who did not. So what is read
 * here is not that the arithmetic adds up - that is one line - but the two
 * cases where a mark quietly lies: a question left blank counted as right or
 * as an error, and an answer of the wrong shape accepted because it happened to
 * hold the right number.
 */

test("an empty sheet is one blank per question, and nothing invented", () => {
  assert.deepEqual(emptyAnswers(0), []);
  assert.deepEqual(emptyAnswers(3), [null, null, null]);
  // A negative or absurd count is nothing rather than a throw or a negative
  // length: this is called with the length of a run, and a run of nothing is
  // a real thing in a game whose levels arrive over the network.
  assert.deepEqual(emptyAnswers(-2), []);
});

test("a question left blank is wrong, and is not the same as the right answer", () => {
  const question = { question: "Which river?", options: ["Nile", "Congo", "Niger", "Zambezi"], correct: 0 };

  assert.equal(answerIsRight(question, { choice: 0 }), true);
  assert.equal(answerIsRight(question, { choice: 1 }), false, "another option is not the answer");
  assert.equal(answerIsRight(question, null), false, "a blank is not right");
  assert.equal(answerIsRight(undefined, { choice: 0 }), false, "a question that is not there is not right");
  // An arrangement handed to a multiple choice is refused rather than read for
  // a number that happens to be the right index.
  assert.equal(answerIsRight(question, { order: [0, 1, 2, 3] }), false);
});

test("a chronology is right only in the order the lesson tells", () => {
  const question = { type: "order", steps: ["One", "Two", "Three", "Four"], order: [2, 0, 3, 1] };

  assert.equal(answerIsRight(question, { order: [0, 1, 2, 3] }), true);
  assert.equal(answerIsRight(question, { order: [1, 0, 2, 3] }), false, "one swap is a wrong answer");
  assert.equal(answerIsRight(question, { order: [0, 1, 2] }), false, "a short arrangement is not an answer");
  assert.equal(answerIsRight(question, null), false, "and leaving it alone is not one either");
  assert.equal(answerIsRight(question, { choice: 0 }), false, "a choice is not an arrangement");
});

test("a finished run is marked, and the ones it did not get come back in order", () => {
  const questions = [
    { question: "One?", options: ["a", "b"], correct: 1 },
    { type: "order", steps: ["One", "Two", "Three", "Four"] },
    { question: "Three?", options: ["a", "b"], correct: 0 },
    { question: "Four?", options: ["a", "b"], correct: 1 },
  ];
  const marked = gradeRun(questions, [
    { choice: 1 }, // right
    { order: [1, 0, 3, 2] }, // wrong
    null, // blank
    { choice: 1 }, // right
  ]);

  assert.deepEqual(marked, {
    score: 2,
    total: 4,
    missed: [
      { index: 1, answer: { order: [1, 0, 3, 2] } },
      { index: 2, answer: null },
    ],
  });

  // And nothing at all is a mark of nothing rather than a throw: a run that was
  // never built has to be reported as zero out of zero, not as a crash.
  assert.deepEqual(gradeRun([], []), { score: 0, total: 0, missed: [] });
  assert.deepEqual(gradeRun(undefined, undefined), { score: 0, total: 0, missed: [] });
});

test("an answer and the right answer are read back in words, for a corrigé", () => {
  const mcq = { question: "Which river?", options: ["Nile", "Congo", "Niger", "Zambezi"], correct: 0 };
  assert.equal(answerText(mcq, { choice: 1 }), "Congo", "what the player picked is named");
  assert.equal(rightText(mcq), "Nile", "and what was right is named");
  assert.equal(answerText(mcq, null), "", "a blank is an empty string, so the caller says it in its own words");
  assert.equal(answerText(mcq, { order: [0] }), "", "an answer of the wrong shape is not read as one");

  const order = { type: "order", steps: ["Oldest", "Middle", "Later", "Latest"] };
  assert.equal(rightText(order), "Oldest · Middle · Later · Latest", "a chronology is read in its real order");
  assert.equal(
    answerText(order, { order: [1, 0, 2, 3] }),
    "Middle · Oldest · Later · Latest",
    "and a player's arrangement is read the way they left it"
  );
});

test("an exam asks the whole level, and asks it in teaching order", () => {
  // What makes the exam a test rather than a fourth difficulty: it is not a
  // band of the level, it is the level. Every question the lesson teaches is
  // asked, in the order the lesson teaches it, with the chronology in front the
  // way every run opens.
  LEVELS.forEach((level) => {
    const run = quizQuestions(withStudy(level), "exam");
    // The two assembled questions of the run are its own chronology and its
    // matching; everything else is a question of the level's bank.
    const asked = run.filter((question) => !question.type);
    assert.equal(asked.length, level.questions.length, `level ${level.id}: the exam skips a question`);
    assert.deepEqual(
      asked.map((question) => question.__index),
      level.questions.map((_question, index) => index),
      `level ${level.id}: the exam reorders the level`
    );

    // And it is a superset of what the three difficulties ask: a harder setting
    // never leaves out a question an easier one asked.
    for (const difficulty of ["easy", "medium", "hard"]) {
      const played = quizQuestions(level, difficulty).filter((question) => !question.type);
      const askedIndexes = new Set(asked.map((question) => question.__index));
      played.forEach((question) =>
        assert.ok(askedIndexes.has(question.__index), `level ${level.id}: exam misses a ${difficulty} question`)
      );
    }
  });
});

test("the chronology is the first question of an exam, as of every other run", () => {
  const level = LEVELS.find((candidate) => getLevelStudy(candidate.id, "en")?.timeline?.length >= CHRONOLOGY_STEPS);
  assert.ok(level, "the game holds a level whose timeline can carry a chronology");

  const run = quizQuestions(withStudy(level), "exam");
  assert.equal(run[0].type, "order", "the exam opens on the shape of the period");
  assert.equal(run[0].__index, undefined, "and the assembled question holds no bank position");
  assert.equal(run[1].type, "match", "then on who the lesson names");
  assert.equal(run[1].__index, undefined, "which also holds no bank position");

  // A lesson whose timeline cannot carry one is asked exactly as it was
  // written, with no empty first question where the chronology would be.
  const short = { ...level, study: { ...getLevelStudy(level.id, "en"), timeline: [] } };
  assert.equal(
    quizQuestions(short, "exam").some((question) => question.type === "order"),
    false,
    "an empty timeline draws no chronology"
  );
});
