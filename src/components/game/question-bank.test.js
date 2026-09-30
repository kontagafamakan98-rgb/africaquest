import test from "node:test";
import assert from "node:assert/strict";
// Explicit extension: the file is also loaded directly by the test runner.
import { LEVELS } from "./gameData.js";
import { DIFFICULTY_BANDS, questionBand, questionCount, selectQuestions } from "./question-bank.js";

const DIFFICULTIES = ["easy", "medium", "hard"];
const texts = (questions) => questions.map((question) => question.question);

test("a level is split into three bands, in order and covering every question", () => {
  for (const total of [8, 13]) {
    const bands = Array.from({ length: total }, (_unused, index) => questionBand(index, total));
    // The bands never go backwards, so a harder band always means a later, more
    // detailed question.
    assert.deepEqual([...bands].sort((a, b) => a - b), bands, `total ${total}`);
    assert.deepEqual([...new Set(bands)].sort(), [1, 2, 3], `total ${total}: all three bands are used`);
  }

  // A total of nothing is a band of one rather than a crash: an empty level is
  // caught by the content tests, not by a division here.
  assert.equal(questionBand(0, 0), 1);
});

test("the three difficulties ask different questions of every level", () => {
  LEVELS.forEach((level) => {
    const asked = DIFFICULTIES.map((difficulty) => selectQuestions(level.questions, difficulty));

    asked.forEach((questions, position) => {
      const difficulty = DIFFICULTIES[position];
      assert.ok(questions.length > 0, `level ${level.id}: ${difficulty} asks nothing`);
      assert.ok(
        questions.length <= level.questions.length,
        `level ${level.id}: ${difficulty} invents questions the level does not hold`
      );
      // The band floor is never crossed: a difficulty always asks a real quiz.
      assert.ok(
        questions.length >= DIFFICULTY_BANDS[difficulty].min,
        `level ${level.id}: ${difficulty} asks ${questions.length}, below its floor`
      );
      // The questions come from the level, in teaching order, and each one
      // remembers where it came from so the review memory stays aligned.
      questions.forEach((question, position) => {
        assert.equal(question.question, level.questions[question.__index].question);
        if (position > 0) assert.ok(question.__index > questions[position - 1].__index);
      });
    });

    // The whole point of the change: choosing a difficulty changes the questions,
    // not only the clock. Any two of the three settings would be a regression.
    assert.notDeepEqual(texts(asked[0]), texts(asked[1]), `level ${level.id}: easy and medium ask the same questions`);
    assert.notDeepEqual(texts(asked[1]), texts(asked[2]), `level ${level.id}: medium and hard ask the same questions`);
    assert.notDeepEqual(texts(asked[0]), texts(asked[2]), `level ${level.id}: easy and hard ask the same questions`);
  });
});

test("hard spends no question on what an easy player is asked first", () => {
  // On a full level, the opening band is the easiest material, and a hard run
  // should not be handed it. This is what makes hard read as a different quiz
  // rather than the same one with fewer seconds.
  const full = LEVELS.find((level) => level.questions.length >= 12);
  assert.ok(full, "the game holds a full length level");

  // The two numbers are read off the level rather than written here, so a longer
  // lesson does not have to be matched by an edit to this test.
  const bandOf = (index) => questionBand(index, full.questions.length);
  const hard = selectQuestions(full.questions, "hard");
  assert.equal(
    hard[0].__index,
    full.questions.findIndex((_question, index) => bandOf(index) === 2),
    "hard opens on the middle band, not on the easiest question"
  );
  assert.equal(
    questionCount(full.questions, "easy"),
    full.questions.filter((_question, index) => bandOf(index) === 1).length,
    "easy asks exactly the opening band"
  );
});

test("an unknown difficulty falls back to easy rather than to nothing", () => {
  const level = LEVELS[0];
  assert.deepEqual(
    texts(selectQuestions(level.questions, "impossible")),
    texts(selectQuestions(level.questions, "easy"))
  );
  assert.deepEqual(selectQuestions([], "hard"), []);
  assert.deepEqual(selectQuestions(undefined, "hard"), []);
});

test("the same level and difficulty always ask the same questions", () => {
  const level = LEVELS[3];
  assert.deepEqual(selectQuestions(level.questions, "medium"), selectQuestions(level.questions, "medium"));
});
