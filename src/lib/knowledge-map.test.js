import test from "node:test";
import assert from "node:assert/strict";
import { classifyQuestion, fragileQuestionsOf, knowledgeMap, SOLID_STAGE } from "./knowledge-map.js";

const now = Date.parse("2026-09-27T12:00:00Z");
const day = 24 * 3600 * 1000;

const levels = [
  { id: 1, title: "North", region: "R1", questions: [{}, {}, {}] },
  { id: 2, title: "South", region: "R2", questions: [{}, {}] },
];

const lesson = {
  id: 7,
  title: "Lesson",
  region: "R7",
  questions: [{ question: "q0" }, { question: "q1" }, { question: "q2" }, { question: "q3" }],
};

test("a question never answered is undiscovered", () => {
  assert.equal(classifyQuestion(undefined, now), "undiscovered");
  assert.equal(classifyQuestion({ right: 0, wrong: 0 }, now), "undiscovered");
});

test("a question the schedule brings back is fragile", () => {
  // Missed before the schedule existed: due immediately.
  assert.equal(classifyQuestion({ right: 1, wrong: 3 }, now), "fragile");
  // Missed a minute ago, coming back in ten minutes.
  assert.equal(
    classifyQuestion({ right: 0, wrong: 1, stage: 0, dueAt: now + 9 * 60000 }, now),
    "fragile"
  );
  // Answered right once, never missed: seen, not confirmed.
  assert.equal(classifyQuestion({ right: 1, wrong: 0 }, now), "fragile");
});

test("a question answered correctly at growing intervals is known", () => {
  const solid = { right: 4, wrong: 1, stage: SOLID_STAGE, dueAt: now + 20 * day, lastSeen: now };
  assert.equal(classifyQuestion(solid, now), "known");
  // Never missed and answered right twice: no schedule needed to trust it.
  assert.equal(classifyQuestion({ right: 2, wrong: 0 }, now), "known");
  // One step below the solid stage stays fragile.
  assert.equal(
    classifyQuestion({ right: 3, wrong: 1, stage: SOLID_STAGE - 1, dueAt: now + 2 * day }, now),
    "fragile"
  );
});

test("the map splits every question of every level into the three buckets", () => {
  const stats = {
    "1:0": { right: 4, wrong: 1, stage: 3, dueAt: now + 20 * day, lastSeen: now }, // known
    "1:1": { right: 1, wrong: 2 }, // fragile
    // 1:2 never answered -> undiscovered
    "2:0": { right: 2, wrong: 0 }, // known
    "2:1": { right: 0, wrong: 1 }, // fragile
  };
  const map = knowledgeMap(stats, levels, now);

  assert.deepEqual(
    { known: map.known, fragile: map.fragile, undiscovered: map.undiscovered, total: map.total },
    { known: 2, fragile: 2, undiscovered: 1, total: 5 }
  );
  assert.equal(map.knownPercent, 40);

  assert.deepEqual(map.byLevel[0], {
    id: 1,
    title: "North",
    region: "R1",
    total: 3,
    known: 1,
    fragile: 1,
    undiscovered: 1,
    knownPercent: 33,
  });
  assert.equal(map.byLevel[1].known, 1);
  assert.equal(map.byLevel[1].fragile, 1);
});

test("the map points at the level and region to work on first", () => {
  const map = knowledgeMap({ "1:0": { right: 0, wrong: 2 }, "1:1": { right: 0, wrong: 1 } }, levels, now);
  assert.equal(map.fragileLevel.id, 1);
  assert.equal(map.priorityRegion.region, "R1");
  assert.equal(map.priorityRegion.fragile, 2);
  assert.equal(map.knownPercent, 0);
});

test("a level hands over only its fragile questions", () => {
  const stats = {
    "7:0": { right: 4, wrong: 1, stage: SOLID_STAGE, dueAt: now + 20 * day, lastSeen: now }, // known
    "7:1": { right: 0, wrong: 2, stage: 0, dueAt: now - day, lastSeen: now - day }, // overdue
    "7:2": { right: 2, wrong: 0 }, // solid without a schedule
    // 7:3 never answered -> undiscovered
  };

  assert.deepEqual(
    fragileQuestionsOf(lesson, stats, now).map((item) => [item.levelId, item.index]),
    [[7, 1]],
    "a solid or unseen question never reaches the session"
  );
});

test("the session keeps the lesson's questions and their positions", () => {
  const stats = {
    "7:0": { right: 1, wrong: 0 }, // seen once, not confirmed
    "7:2": { right: 0, wrong: 1 }, // missed
  };
  const items = fragileQuestionsOf(lesson, stats, now);

  assert.deepEqual(
    items.map((item) => [item.levelId, item.index]),
    [[7, 2], [7, 0]],
    "the missed question comes first, the unconfirmed one after"
  );
  // The question objects travel with their position, so the quiz can ask them.
  assert.equal(items[0].question, lesson.questions[2]);
  assert.equal(items[1].question, lesson.questions[0]);
});

test("the most overdue question opens the session", () => {
  const stats = {
    "7:0": { right: 0, wrong: 1, stage: 0, dueAt: now - 2 * day, lastSeen: now },
    "7:1": { right: 0, wrong: 1, stage: 0, dueAt: now - 10 * day, lastSeen: now },
    "7:2": { right: 0, wrong: 1, stage: 0, dueAt: now - 5 * day, lastSeen: now },
  };

  assert.deepEqual(
    fragileQuestionsOf(lesson, stats, now).map((item) => item.index),
    [1, 2, 0]
  );
});

test("a level with nothing fragile gives an empty session, not a crash", () => {
  assert.deepEqual(fragileQuestionsOf(lesson, {}, now), []);
  assert.deepEqual(fragileQuestionsOf(undefined, {}, now), []);
  assert.deepEqual(fragileQuestionsOf({ id: 7 }, {}, now), []);
  assert.deepEqual(
    fragileQuestionsOf(lesson, { "7:0": { right: 5, wrong: 0 } }, now),
    []
  );
});

test("an untouched game is entirely undiscovered", () => {
  const map = knowledgeMap({}, levels, now);
  assert.equal(map.undiscovered, 5);
  assert.equal(map.known, 0);
  assert.equal(map.fragile, 0);
  assert.equal(map.priorityRegion, null);
  assert.equal(map.byLevel.every((row) => row.knownPercent === 0), true);
});

test("an empty game does not divide by zero", () => {
  const map = knowledgeMap({}, [], now);
  assert.equal(map.total, 0);
  assert.equal(map.knownPercent, 0);
  assert.deepEqual(map.byLevel, []);
});
