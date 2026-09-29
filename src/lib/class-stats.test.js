import test from "node:test";
import assert from "node:assert/strict";
import { classSummary, studentSummary } from "./class-stats.js";
import { answerAccuracy, averageMastery, levelMastery, questionKey, meanOf } from "./game-metrics.js";

// Minimal level fixtures: the modules under test must not depend on the game data.
const levels = [
  { id: 1, title: "Level one", region: "North", questions: [{}, {}, {}] },
  { id: 2, title: "Level two", region: "South", questions: [{}, {}] },
];

test("a question key is stable per level and index", () => {
  assert.equal(questionKey(3, 7), "3:7");
});

test("mastery is the best score of the level, as a percentage", () => {
  assert.equal(levelMastery(levels[0], { 1: { easy: { score: 1 }, hard: { score: 3 } } }), 100);
  assert.equal(levelMastery(levels[0], { 1: { easy: { score: 1 } } }), 33);
  assert.equal(levelMastery(levels[0], {}), 0);
  assert.equal(levelMastery(levels[0], undefined), 0);
});

test("average mastery counts untouched levels as zero", () => {
  assert.equal(averageMastery({ 1: { easy: { score: 3 } } }, levels), 50);
  assert.equal(averageMastery({}, levels), 0);
  assert.equal(averageMastery({}, []), 0);
});

test("accuracy reports null instead of a fake zero when nothing was answered", () => {
  assert.deepEqual(answerAccuracy({}, levels), { right: 0, attempts: 0, accuracy: null });
  assert.deepEqual(answerAccuracy({ "1:0": { right: 3, wrong: 1 } }, levels), {
    right: 3,
    attempts: 4,
    accuracy: 75,
  });
  // Answers on a question of a level outside the selection are ignored.
  assert.equal(answerAccuracy({ "9:0": { right: 5, wrong: 0 } }, levels).attempts, 0);
});

test("meanOf averages what exists and gives up on nothing", () => {
  assert.equal(meanOf([10, 20, 30]), 20);
  assert.equal(meanOf([null, 10, undefined, 20]), 15);
  assert.equal(meanOf([]), null);
  assert.equal(meanOf([null, null]), null);
});

test("a student who never played reports zeros, not errors", () => {
  const student = studentSummary({ id: "p2", name: "Ada", progress: null }, levels);
  assert.equal(student.hasData, false);
  assert.equal(student.levelsCompleted, 0);
  assert.equal(student.mastery, 0);
  assert.equal(student.accuracy, null);
  assert.equal(student.answers, 0);
  assert.equal(student.dueNow, 0);
  assert.equal(student.lastPlayed, null);
});

test("a student's row adds up their own progress", () => {
  const student = studentSummary(
    {
      id: "p1",
      name: "Ada",
      progress: {
        total_xp: 480,
        stars_earned: 7,
        completed_levels: [1],
        studied_levels: [1, 2],
        badges: ["first_step"],
        last_played: "2026-09-27",
        level_scores: { 1: { easy: { score: 3 } } },
        question_stats: { "1:0": { right: 2, wrong: 2 }, "2:1": { right: 1, wrong: 0 } },
      },
    },
    levels
  );
  assert.equal(student.hasData, true);
  assert.equal(student.levelsCompleted, 1);
  assert.equal(student.totalLevels, 2);
  assert.equal(student.mastery, 50);
  assert.equal(student.accuracy, 60);
  assert.equal(student.answers, 5);
  assert.equal(student.studied, 2);
  assert.equal(student.badges, 1);
  assert.equal(student.lastPlayed, "2026-09-27");
});

test("questions waiting in the review rotation are counted per student", () => {
  const now = Date.parse("2026-09-27T12:00:00Z");
  const student = studentSummary(
    {
      id: "p1",
      name: "Ada",
      progress: {
        question_stats: {
          // Missed before the schedule existed: due right away.
          "1:0": { right: 0, wrong: 1 },
          // Missed a minute ago: comes back in ten minutes, so not due yet.
          "1:1": { right: 0, wrong: 1, stage: 0, dueAt: now + 9 * 60000, lastSeen: now },
          // Mastered: out of the rotation.
          "2:0": { right: 4, wrong: 0 },
        },
      },
    },
    levels,
    now
  );
  assert.equal(student.dueNow, 1);
});

test("the class summary averages the students who played, and totals everyone", () => {
  const stats = classSummary(
    [
      {
        id: "p1",
        name: "Ada",
        progress: {
          total_xp: 400,
          stars_earned: 5,
          completed_levels: [1, 2],
          level_scores: { 1: { easy: { score: 3 } }, 2: { easy: { score: 2 } } },
          question_stats: { "1:0": { right: 3, wrong: 1 } },
        },
      },
      {
        id: "p2",
        name: "Bilal",
        progress: {
          total_xp: 200,
          stars_earned: 2,
          completed_levels: [1],
          level_scores: { 1: { easy: { score: 1 } } },
          question_stats: { "1:1": { right: 1, wrong: 3 } },
        },
      },
      // Never played: must not drag the class averages down.
      { id: "p3", name: "Cleo", progress: null },
    ],
    levels
  );

  assert.equal(stats.summary.students, 3);
  assert.equal(stats.summary.withData, 2);
  assert.equal(stats.summary.averageMastery, 59); // Ada 100, Bilal 17
  assert.equal(stats.summary.averageAccuracy, 50);
  assert.equal(stats.summary.totalStars, 7);
  assert.equal(stats.summary.totalXp, 600);
  assert.equal(stats.summary.answers, 8);
  assert.equal(stats.students[2].hasData, false);

  assert.deepEqual(stats.levels[0], {
    id: 1,
    title: "Level one",
    region: "North",
    students: 3,
    completed: 2,
  });
  assert.equal(stats.levels[1].completed, 1);
});

test("the class accuracy stays null when nobody has answered", () => {
  const stats = classSummary([{ id: "p1", name: "Ada", progress: { total_xp: 10 } }], levels);
  assert.equal(stats.summary.averageAccuracy, null);
  assert.equal(stats.summary.averageMastery, 0);
  // A student with XP but no answers is still counted as having played.
  assert.equal(stats.summary.withData, 1);
});

test("an empty roster produces a usable, empty summary", () => {
  const stats = classSummary([], levels);
  assert.deepEqual(stats.students, []);
  assert.equal(stats.summary.students, 0);
  assert.equal(stats.summary.averageMastery, 0);
  assert.equal(stats.levels.length, 2);
  assert.equal(stats.levels[0].completed, 0);
});
