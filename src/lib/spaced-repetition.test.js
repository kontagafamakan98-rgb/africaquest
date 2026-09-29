import test from "node:test";
import assert from "node:assert/strict";
import {
  intervalForStage,
  reviewStage,
  dueAt,
  isDue,
  scheduleAfterAnswer,
  MAX_REVIEW_STAGE,
  REVIEW_INTERVALS_MS,
} from "./spaced-repetition.js";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// A fixed clock so the expectations never depend on when the suite runs.
const T0 = Date.parse("2026-09-27T12:00:00Z");

test("a question missed for the first time does not come back immediately", () => {
  // The whole point of the feature: a miss leaves the screen and returns later.
  const after = scheduleAfterAnswer({ right: 0, wrong: 0 }, false, T0);
  assert.equal(after.stage, 0);
  assert.equal(after.dueAt, T0 + intervalForStage(0));
  assert.equal(after.lastSeen, T0);

  const stat = { right: 0, wrong: 1, ...after };
  assert.equal(isDue(stat, T0), false, "not due a second after answering");
  assert.equal(isDue(stat, T0 + MINUTE), false, "not due a minute later");
  assert.equal(isDue(stat, T0 + 11 * MINUTE), true, "back once the delay has passed");
});

test("every correct answer pushes the question one step further away", () => {
  const delays = [];
  let stat = { right: 0, wrong: 1, ...scheduleAfterAnswer({ right: 0, wrong: 0 }, false, T0) };

  for (let step = 0; step < MAX_REVIEW_STAGE + 2; step += 1) {
    const at = T0 + step * DAY;
    stat = { ...stat, ...scheduleAfterAnswer(stat, true, at) };
    delays.push(stat.dueAt - at);
  }

  // The first correct answer after the miss waits the second rung of the ladder,
  // then each delay is longer than the previous one until the ceiling is reached.
  assert.deepEqual(delays.slice(0, MAX_REVIEW_STAGE), REVIEW_INTERVALS_MS.slice(1));
  for (let i = 1; i < delays.length; i += 1) {
    assert.ok(delays[i] >= delays[i - 1], `delay ${i} should not shrink`);
  }
  assert.equal(delays.at(-1), intervalForStage(MAX_REVIEW_STAGE), "stays on the longest delay");
  assert.equal(stat.stage, MAX_REVIEW_STAGE);
});

test("a new mistake sends the question back to the shortest delay", () => {
  // Even a question the player had almost mastered comes back quickly once missed.
  const solid = { right: 6, wrong: 1, stage: MAX_REVIEW_STAGE, dueAt: T0 + 60 * DAY };
  const after = scheduleAfterAnswer(solid, false, T0);

  assert.equal(after.stage, 0);
  assert.equal(after.dueAt, T0 + intervalForStage(0));
  assert.equal(isDue({ ...solid, ...after }, T0 + 2 * MINUTE), false);
  assert.equal(isDue({ ...solid, ...after }, T0 + 10 * MINUTE + 1), true);
});

test("a question never missed stays out of the review rotation", () => {
  const after = scheduleAfterAnswer({ right: 0, wrong: 0 }, true, T0);
  assert.equal(after.dueAt, undefined);
  assert.equal(dueAt({ right: 1, wrong: 0, ...after }, T0), Infinity);
  assert.equal(isDue({ right: 3, wrong: 0, ...after }, T0 + 365 * DAY), false);

  const again = scheduleAfterAnswer({ right: 2, wrong: 0, ...after }, true, T0 + DAY);
  assert.equal(again.dueAt, undefined, "still not part of the rotation");
});

test("a question with no record at all is never due", () => {
  assert.equal(dueAt(undefined, T0), Infinity);
  assert.equal(isDue(null, T0), false);
  assert.equal(reviewStage(undefined), 0);
});

test("answers saved before this feature are migrated instead of punished", () => {
  // Missed at least as often as answered right: start the ladder over.
  assert.equal(reviewStage({ right: 1, wrong: 3 }), 0);
  assert.equal(reviewStage({ right: 0, wrong: 1 }), 0);
  assert.equal(dueAt({ right: 1, wrong: 3 }, T0), T0);

  // Answered right more often than wrong: resume mid-ladder, not at the bottom.
  assert.equal(reviewStage({ right: 3, wrong: 1 }), 2);
  assert.equal(dueAt({ right: 3, wrong: 1 }, T0), T0 + intervalForStage(2));
  assert.equal(isDue({ right: 3, wrong: 1 }, T0 + DAY), false);
});

test("the stored stage is clamped into the ladder", () => {
  assert.equal(reviewStage({ stage: 99, right: 1, wrong: 1 }), MAX_REVIEW_STAGE);
  assert.equal(reviewStage({ stage: -4, right: 1, wrong: 1 }), 0);
  assert.equal(reviewStage({ stage: 2.7, right: 1, wrong: 1 }), 2, "fractional stages are floored");
  assert.equal(intervalForStage(99), intervalForStage(MAX_REVIEW_STAGE));
  assert.equal(intervalForStage(-1), intervalForStage(0));
});

test("a stored due date wins over anything recomputed", () => {
  const stat = { right: 5, wrong: 0, stage: 4, dueAt: T0 + 3 * DAY };
  assert.equal(dueAt(stat, T0), T0 + 3 * DAY);
  assert.equal(isDue(stat, T0), false);
  assert.equal(isDue(stat, T0 + 3 * DAY + 1), true);
});

test("the full round trip: miss, review later, then wait a day", () => {
  let stat = { right: 0, wrong: 0 };

  // Session one, the player misses the question.
  stat = { ...stat, ...scheduleAfterAnswer(stat, false, T0) };
  stat.wrong += 1;

  // Ten minutes later the review session can ask it again.
  const reviewAt = T0 + 10 * MINUTE + 1;
  assert.equal(isDue(stat, reviewAt), true);

  const next = scheduleAfterAnswer(stat, true, reviewAt);
  assert.equal(next.dueAt, reviewAt + DAY, "answered right, so it waits a full day");
  assert.equal(isDue({ ...stat, ...next }, reviewAt + 6 * 60 * MINUTE), false);
  assert.equal(isDue({ ...stat, ...next }, reviewAt + DAY + 1), true);
});
