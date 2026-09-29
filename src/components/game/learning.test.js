import test from "node:test";
import assert from "node:assert/strict";
import {
  collectReviewQueue,
  collectDueReviews,
  countDueReviews,
  buildReviewLevel,
  sessionRecap,
  unlockedLevelIds,
  difficultyBreakdown,
} from "./learning.js";
// The real timeline, under another name: this file already holds a small
// synthetic LEVELS fixture for the review tests.
import { LEVELS as GAME_LEVELS } from "./gameData.js";

/**
 * The review queue is what the "to review" screen lists and what a session is
 * started from, so the two facts that matter are which questions it contains and
 * in what order. A question that leaves the rotation by accident would silently
 * disappear from every review the player ever does again.
 */

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const NOW = 1_700_000_000_000;

const LEVELS = [
  {
    id: 1,
    title: "Level one",
    region: "North",
    questions: [
      { question: "q1", fact: "f1" },
      { question: "q2", fact: "f2" },
      { question: "q3", fact: "f3" },
    ],
  },
  {
    id: 2,
    title: "Level two",
    region: "South",
    questions: [
      { question: "q4", fact: "f4" },
      { question: "q5", fact: "f5" },
    ],
  },
];

test("only the questions still in the rotation are listed", () => {
  const queue = collectReviewQueue(
    {
      "1:0": { right: 3, wrong: 0 },
      "1:1": { right: 0, wrong: 2, stage: 0, dueAt: NOW - 5000 },
      "2:0": { right: 1, wrong: 1, stage: 1, dueAt: NOW + DAY },
    },
    LEVELS,
    { now: NOW }
  );

  assert.deepEqual(
    queue.map((item) => [item.levelId, item.index]),
    [
      [1, 1],
      [2, 0],
    ],
    "a question never missed stays out"
  );
});

test("each entry carries its question, its lesson and its schedule", () => {
  const queue = collectReviewQueue(
    {
      "1:1": { right: 0, wrong: 2, stage: 0, dueAt: NOW - 5000 },
      "2:0": { right: 1, wrong: 1, stage: 1, dueAt: NOW + DAY },
    },
    LEVELS,
    { now: NOW }
  );

  const [overdue, later] = queue;
  assert.equal(overdue.question, LEVELS[0].questions[1], "the question itself, ready to display");
  assert.equal(overdue.levelTitle, "Level one", "the lesson is named on the row");
  assert.equal(overdue.region, "North");
  assert.equal(overdue.isDue, true);
  assert.equal(overdue.wrong, 2);

  assert.equal(later.isDue, false);
  assert.equal(later.due, NOW + DAY, "the screen needs the exact date to count down");
  assert.equal(later.levelTitle, "Level two");
});

test("overdue questions come first, then the most often missed", () => {
  const queue = collectReviewQueue(
    {
      "1:0": { right: 1, wrong: 1, dueAt: NOW + 2 * DAY },
      "1:1": { right: 0, wrong: 3, dueAt: NOW + 2 * DAY },
      "2:0": { right: 0, wrong: 1, dueAt: NOW - MINUTE },
      "2:1": { right: 4, wrong: 1, dueAt: NOW - MINUTE },
    },
    LEVELS,
    { now: NOW }
  );

  assert.deepEqual(
    queue.map((item) => `${item.levelId}:${item.index}`),
    ["2:0", "2:1", "1:1", "1:0"]
  );
});

test("a question saved before the schedule existed is placed sensibly", () => {
  const queue = collectReviewQueue(
    {
      // Missed as often as answered right: starts the ladder over, due right now.
      "1:0": { right: 1, wrong: 1 },
      // Answered right more often: resumes mid-ladder instead of being pushed back.
      "1:1": { right: 5, wrong: 1 },
    },
    LEVELS,
    { now: NOW }
  );

  const fresh = queue.find((item) => item.index === 0);
  const resumed = queue.find((item) => item.index === 1);
  assert.equal(fresh.isDue, true);
  assert.equal(fresh.due, NOW);
  assert.equal(resumed.isDue, false);
  assert.ok(resumed.due > NOW, "a solid question is not asked again today");
});

test("the same question is only listed once", () => {
  const queue = collectReviewQueue(
    {
      "1:0": { right: 0, wrong: 1, dueAt: NOW - 1 },
      "1:1": { right: 0, wrong: 1, dueAt: NOW - 1 },
      "1:2": { right: 0, wrong: 1, dueAt: NOW - 1 },
      "2:0": { right: 0, wrong: 1, dueAt: NOW - 1 },
      "2:1": { right: 0, wrong: 1, dueAt: NOW - 1 },
    },
    LEVELS,
    { now: NOW }
  );

  const keys = queue.map((item) => `${item.levelId}:${item.index}`);
  assert.equal(queue.length, 5);
  assert.equal(new Set(keys).size, 5);
  // It also covers every question of both lessons, nothing dropped on the way.
  assert.deepEqual(keys, ["1:0", "1:1", "1:2", "2:0", "2:1"]);
});

test("nothing to review is an empty list, not a crash", () => {
  assert.deepEqual(collectReviewQueue(undefined, LEVELS, { now: NOW }), []);
  assert.deepEqual(collectReviewQueue({}, LEVELS, { now: NOW }), []);
  assert.deepEqual(collectReviewQueue({ "1:0": { right: 1, wrong: 0 } }, LEVELS, { now: NOW }), []);
  assert.deepEqual(
    collectReviewQueue({ "1:0": { right: 0, wrong: 1, dueAt: NOW - 1 } }, [], { now: NOW }),
    []
  );
});

test("a session started from the list records against the question that was asked", () => {
  const queue = collectReviewQueue({ "2:1": { right: 0, wrong: 1, dueAt: NOW - 1 } }, LEVELS, {
    now: NOW,
  });
  const level = buildReviewLevel([queue[0]], {
    title: "Mistake review",
    subtitle: "Due now",
    region: "Mistakes",
  });

  assert.equal(level.questions.length, 1);
  assert.equal(level.questions[0].__key, "2:1", "the key is the one the memory is written under");
  assert.equal(level.questions[0].question, "q5");
});

test("the recap compares a game with the previous ones of the same level", () => {
  const history = [
    { date: "2026-01-01", level: 3, difficulty: "easy", score: 7, total: 13, stars: 0, xp: 0 },
    { date: "2026-01-02", level: 3, difficulty: "hard", score: 13, total: 13, stars: 3, xp: 60 },
    { date: "2026-01-03", level: 3, difficulty: "easy", score: 11, total: 13, stars: 2, xp: 40 },
    { date: "2026-01-04", level: 1, difficulty: "easy", score: 1, total: 13, stars: 0, xp: 0 },
  ];

  const recap = sessionRecap(history, { levelId: 3, difficulty: "easy", score: 9 });
  assert.equal(recap.played, 2, "the hard run and the other level are not part of the comparison");
  assert.equal(recap.lastScore, 11);
  assert.equal(recap.lastTotal, 13);
  assert.equal(recap.scoreDelta, -2);
  assert.equal(recap.bestScore, 11);
  assert.equal(recap.bestStars, 2);
  assert.equal(recap.isNewBest, false, "9 does not beat the previous best of 11");

  const better = sessionRecap(history, { levelId: 3, difficulty: "easy", score: 12 });
  assert.equal(better.isNewBest, true);
  assert.equal(better.bestScore, 11, "the best it had to beat is reported, not the new one");
  assert.equal(better.scoreDelta, 1);

  // The same score as the best is not a new record.
  assert.equal(sessionRecap(history, { levelId: 3, difficulty: "easy", score: 11 }).isNewBest, false);
});

test("a first game on a level is not compared with anything", () => {
  const recap = sessionRecap([], { levelId: 2, difficulty: "easy", score: 5 });

  assert.equal(recap.played, 0);
  assert.equal(recap.lastScore, null);
  assert.equal(recap.bestScore, null);
  assert.equal(recap.bestStars, null);
  assert.equal(recap.scoreDelta, null);
  assert.equal(recap.isNewBest, false);

  // A profile that has never played has no history to read, not an error.
  assert.equal(sessionRecap(undefined, { levelId: 2 }).played, 0);
  assert.equal(sessionRecap([null, "junk"], { levelId: 2 }).played, 0);
});

test("the success rate of a difficulty weighs its questions, not its games", () => {
  // Two easy games at 75 % and 50 % do not make a 63 % player: the questions
  // they actually answered count, so a short game cannot weigh as much as a
  // long one. This is what makes the three rates comparable.
  const history = [
    { difficulty: "easy", score: 3, total: 4, xp: 30 },
    { difficulty: "easy", score: 1, total: 2, xp: 10 },
    { difficulty: "medium", score: 9, total: 10, xp: 20 },
    { difficulty: "medium", score: 5, total: 10, xp: 10 },
    { difficulty: "hard", score: 2, total: 10, xp: 5 },
    // A result that answered nothing, and a difficulty that does not exist, are
    // both left out rather than counted as a zero.
    { difficulty: "hard", score: 0, total: 0, xp: 0 },
    { difficulty: "impossible", score: 10, total: 10, xp: 99 },
  ];

  const { rows, leader } = difficultyBreakdown(history);
  assert.deepEqual(
    rows.map((row) => row.id),
    ["easy", "medium", "hard"],
    "the three difficulties are always listed, in their own order"
  );

  const [easy, medium, hard] = rows;
  // 4 right out of 6 questions, not the mean of 75 % and 50 %, and nothing the
  // screen does not draw.
  assert.deepEqual(easy, { id: "easy", games: 2, accuracy: 67, bestAccuracy: 75 });

  assert.equal(medium.accuracy, 70);
  assert.equal(medium.bestAccuracy, 90);
  assert.equal(hard.accuracy, 20);
  assert.equal(hard.games, 1, "the game that answered nothing is not one");

  assert.equal(leader.id, "medium", "the highest rate out of the three is the one worth naming");
});

test("nothing played is null rather than a made up zero", () => {
  const rows = difficultyBreakdown([{ difficulty: "easy", score: 5, total: 10, xp: 1 }]).rows;
  assert.equal(rows[0].accuracy, 50);

  const [medium, hard] = [rows[1], rows[2]];
  assert.deepEqual(medium, { id: "medium", games: 0, accuracy: null, bestAccuracy: null });
  assert.deepEqual(hard, { id: "hard", games: 0, accuracy: null, bestAccuracy: null });

  // A single difficulty played has nothing to be compared with.
  assert.equal(difficultyBreakdown([{ difficulty: "easy", score: 5, total: 10 }]).leader, null);
});

test("a profile without history compares nothing instead of crashing", () => {
  for (const input of [undefined, [], [null, "junk", { difficulty: "easy", score: 1, total: 0 }]]) {
    const { rows, leader } = difficultyBreakdown(input);
    assert.equal(rows.length, 3);
    assert.deepEqual(
      rows.map((row) => row.games),
      [0, 0, 0]
    );
    assert.equal(leader, null);
  }
});

test("a new player only has the first chapter of the timeline open", () => {
  // The levels are stored under the ids they were written with, but the game is
  // played in the order of history: the opening level is the one whose order is
  // one, whatever number it carries.
  const first = [...GAME_LEVELS].sort((a, b) => a.order - b.order)[0];
  assert.deepEqual([...unlockedLevelIds(GAME_LEVELS, [])], [first.id]);
  assert.equal(first.order, 1);
});

test("finishing a level opens the next one of the timeline, not the next id", () => {
  const timeline = [...GAME_LEVELS].sort((a, b) => a.order - b.order).map((level) => level.id);

  const afterFirst = unlockedLevelIds(GAME_LEVELS, [timeline[0]]);
  assert.deepEqual([...afterFirst].sort((a, b) => a - b), [timeline[0], timeline[1]].sort((a, b) => a - b));

  const afterSecond = unlockedLevelIds(GAME_LEVELS, timeline.slice(0, 2));
  assert.equal(afterSecond.size, 3);
  [timeline[0], timeline[1], timeline[2]].forEach((id) =>
    assert.ok(afterSecond.has(id), `level ${id} is open`)
  );
});

test("a player who finished levels of an older, shorter game keeps them", () => {
  // The first game held eight levels. Somebody who finished the first three
  // must not lose them, and the story sends them back to its beginning, which
  // is where the levels written since then start.
  const firstOfTimeline = [...GAME_LEVELS].sort((a, b) => a.order - b.order)[0].id;
  const open = unlockedLevelIds(GAME_LEVELS, [1, 2, 3]);

  assert.equal(open.size, 4);
  [1, 2, 3, firstOfTimeline].forEach((id) => assert.ok(open.has(id), `level ${id} stays open`));
  assert.ok(!open.has(11), "the level after the first gap is still waiting");
  assert.ok(!open.has(20), "and so is the end of the timeline");
});

test("a finished game opens everything, a broken record blocks nobody", () => {
  assert.equal(
    unlockedLevelIds(GAME_LEVELS, GAME_LEVELS.map((level) => level.id)).size,
    GAME_LEVELS.length
  );
  // A stored list holding nothing, or ids that no longer exist, must not crash
  // the map and must not lock the player out of the beginning.
  const firstOfTimeline = [...GAME_LEVELS].sort((a, b) => a.order - b.order)[0].id;
  assert.deepEqual([...unlockedLevelIds(GAME_LEVELS, null)], [firstOfTimeline]);
  assert.deepEqual([...unlockedLevelIds(GAME_LEVELS, [777])], [firstOfTimeline]);
});

test("the count on the navigation is the real number of due questions", () => {
  // The card opens a batch of twelve at most, but the badge is read on its own:
  // showing 12 to a player who is thirty questions behind would be a lie.
  const questions = Array.from({ length: 20 }, (_, index) => ({ question: `q${index}` }));
  const wide = [{ id: 9, title: "Wide", region: "Everywhere", questions }];
  const stats = {};
  for (let index = 0; index < 20; index += 1) {
    stats[`9:${index}`] = { right: 1, wrong: 1, stage: 0, dueAt: NOW - MINUTE };
  }

  assert.equal(countDueReviews(stats, wide, NOW), 20);
  assert.equal(collectDueReviews(stats, wide, { max: 12, now: NOW }).length, 12);

  // Questions outside the rotation never inflate it: one answered right and
  // never missed, and one scheduled for later.
  stats["9:0"] = { right: 3, wrong: 0 };
  stats["9:1"] = { right: 1, wrong: 1, stage: 1, dueAt: NOW + DAY };
  assert.equal(countDueReviews(stats, wide, NOW), 18);

  assert.equal(countDueReviews(undefined, wide, NOW), 0);
  // Counting never edits the lessons it reads.
  assert.equal(wide[0].questions.length, 20);
});

test("a question that comes due while the app is open is counted from then on", () => {
  // This is what makes a series noticeable on the navigation without opening a
  // screen: the same stored answers, read a minute later, give a count of one.
  const level = { id: 4, title: "Later", region: "West", questions: [{ question: "q" }] };
  const stats = { "4:0": { right: 0, wrong: 1, stage: 0, dueAt: NOW + MINUTE } };

  assert.equal(countDueReviews(stats, [level], NOW), 0);
  assert.equal(countDueReviews(stats, [level], NOW + MINUTE), 1);
});

test("the card and the screen agree on what is due", () => {
  const stats = {
    "1:0": { right: 0, wrong: 2, stage: 0, dueAt: NOW - MINUTE },
    "2:0": { right: 1, wrong: 1, stage: 3, dueAt: NOW + 5 * DAY },
  };
  const due = collectDueReviews(stats, LEVELS, { max: 12, now: NOW });
  const queue = collectReviewQueue(stats, LEVELS, { now: NOW });

  assert.equal(due.length, 1);
  assert.deepEqual(
    queue.filter((item) => item.isDue).map((item) => [item.levelId, item.index]),
    due.map((item) => [item.levelId, item.index])
  );
});
