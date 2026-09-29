import test from "node:test";
import assert from "node:assert/strict";
import {
  pickFlashQuizQuestions,
  quickQuizVerdict,
  flashQuizMissedFacts,
  FLASH_QUIZ_SIZE,
  FLASH_QUIZ_VERDICT_KEYS,
} from "./quick-quiz.js";

const level = Array.from({ length: 13 }, (_, index) => ({
  question: `Question ${index + 1}`,
  fact: `Fact ${index + 1}`,
  options: ["a", "b", "c", "d"],
  correct: index % 4,
}));

test("a flash quiz asks three questions", () => {
  assert.equal(FLASH_QUIZ_SIZE, 3);
  assert.equal(pickFlashQuizQuestions(level).length, 3);
});

test("the questions are spread over the whole lesson", () => {
  // Not the first three: the check has to reach the end of the level as well.
  const picked = pickFlashQuizQuestions(level);
  assert.deepEqual(
    picked.map((item) => item.index),
    [0, 6, 12]
  );
  assert.deepEqual(
    picked.map((item) => item.question),
    [level[0], level[6], level[12]]
  );
  assert.equal(new Set(picked.map((item) => item.question)).size, picked.length, "no question asked twice");
});

test("picking is stable, so two attempts are comparable", () => {
  assert.deepEqual(pickFlashQuizQuestions(level), pickFlashQuizQuestions(level));
});

test("the positions stay distinct whatever the level length", () => {
  for (let length = FLASH_QUIZ_SIZE; length <= 30; length += 1) {
    const questions = Array.from({ length }, (_, index) => ({ question: `q${index}` }));
    const picked = pickFlashQuizQuestions(questions);
    const positions = picked.map((item) => item.index);
    assert.equal(picked.length, FLASH_QUIZ_SIZE, `length ${length}`);
    assert.equal(new Set(positions).size, FLASH_QUIZ_SIZE, `length ${length} repeats a question`);
    assert.ok(positions.includes(0), `length ${length} skips the first question`);
    assert.ok(positions.includes(length - 1), `length ${length} skips the last question`);
    // Every position must point at the question it was picked from: the review
    // memory is keyed by that position, so a mismatch records the wrong answer.
    for (const item of picked) {
      assert.equal(item.question, questions[item.index], `length ${length} position ${item.index} points elsewhere`);
    }
  }
});

test("every question keeps its position in the original level", () => {
  const picked = pickFlashQuizQuestions(level);
  for (const item of picked) {
    assert.equal(item.question, level[item.index]);
  }
  // The position is what keys the review memory: it must survive picking.
  const tail = level.slice(3);
  for (const item of pickFlashQuizQuestions(tail)) {
    assert.equal(item.question, tail[item.index]);
  }
});

test("a short or empty lesson is handled instead of crashing", () => {
  assert.deepEqual(pickFlashQuizQuestions([]), []);
  assert.deepEqual(pickFlashQuizQuestions(undefined), []);
  const two = level.slice(0, 2);
  assert.deepEqual(pickFlashQuizQuestions(two), [
    { index: 0, question: two[0] },
    { index: 1, question: two[1] },
  ], "smaller lesson: ask everything it has");
  assert.deepEqual(pickFlashQuizQuestions(level, 1), [{ index: 0, question: level[0] }]);
  assert.deepEqual(pickFlashQuizQuestions(level, 0), []);
});

test("only a clean sheet reads as ready", () => {
  assert.equal(quickQuizVerdict(3, 3), "ready");
  assert.equal(quickQuizVerdict(2, 3), "close");
  assert.equal(quickQuizVerdict(1, 3), "review");
  assert.equal(quickQuizVerdict(0, 3), "review");
  assert.equal(quickQuizVerdict(0, 0), "review");
});

test("each verdict has its own sentence to show", () => {
  for (const verdict of ["ready", "close", "review"]) {
    assert.equal(typeof FLASH_QUIZ_VERDICT_KEYS[verdict], "string");
  }
  assert.equal(new Set(Object.values(FLASH_QUIZ_VERDICT_KEYS)).size, 3);
});

test("only the missed questions produce points to reread", () => {
  const questions = level.slice(0, 3);
  assert.deepEqual(flashQuizMissedFacts(questions, [true, true, true]), []);
  assert.deepEqual(flashQuizMissedFacts(questions, [true, false, true]), [questions[1].fact]);
  assert.deepEqual(flashQuizMissedFacts(questions, [false, false, false]), [
    questions[0].fact,
    questions[1].fact,
    questions[2].fact,
  ]);
});

test("a point shared by two questions is only shown once", () => {
  const shared = [
    { question: "a", fact: "Same point" },
    { question: "b", fact: "Same point" },
    { question: "c", fact: "Another point" },
  ];
  assert.deepEqual(flashQuizMissedFacts(shared, [false, false, false]), ["Same point", "Another point"]);
});

test("an unanswered question is not counted as a mistake", () => {
  const questions = level.slice(0, 3);
  // A hole in the answers array means the question was never reached.
  assert.deepEqual(flashQuizMissedFacts(questions, [true, undefined, undefined]), []);
  assert.deepEqual(flashQuizMissedFacts(questions, []), []);
});

test("a missing or empty fact never turns into an empty bullet", () => {
  const broken = [
    { question: "a", fact: "" },
    { question: "b" },
    { question: "c", fact: "   " },
    { question: "d", fact: "Keep me" },
  ];
  assert.deepEqual(flashQuizMissedFacts(broken, [false, false, false, false]), ["Keep me"]);
});
