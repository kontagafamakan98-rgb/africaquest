import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_SCOPE,
  MISTAKES_SCOPE,
  MISTAKE_THRESHOLD,
  questionsInScope,
  reviewScopeSummary,
  scopeKey,
  scopeOfLevel,
  scopeOfRegion,
} from "./review-scope.js";

/**
 * A queue shaped exactly like `collectReviewQueue` produces one, already sorted
 * the way the schedule ranks it: the most overdue first.
 */
const queue = [
  { levelId: 1, index: 0, levelTitle: "Nile", region: "North Africa", due: 100, wrong: 1 },
  { levelId: 1, index: 3, levelTitle: "Nile", region: "North Africa", due: 200, wrong: 4 },
  { levelId: 2, index: 1, levelTitle: "Mali", region: "West Africa", due: 300, wrong: 2 },
  { levelId: 3, index: 0, levelTitle: "Great Zimbabwe", region: "Southern Africa", due: 400, wrong: 5 },
];

test("a scope has a stable identity", () => {
  assert.equal(scopeKey(ALL_SCOPE), "all");
  assert.equal(scopeKey(scopeOfLevel(2)), "level:2");
  assert.equal(scopeKey(scopeOfRegion("West Africa")), "region:West Africa");
  assert.equal(scopeKey(MISTAKES_SCOPE), "mistakes");
  // An absent scope is the whole queue, never a crash.
  assert.equal(scopeKey(undefined), "all");
  assert.equal(scopeKey({}), "all");
});

test("the summary counts what each scope would hold", () => {
  const summary = reviewScopeSummary(queue);

  assert.equal(summary.total, 4);
  assert.deepEqual(summary.levels, [
    { id: 1, title: "Nile", count: 2 },
    { id: 2, title: "Mali", count: 1 },
    { id: 3, title: "Great Zimbabwe", count: 1 },
  ]);
  assert.deepEqual(summary.regions, [
    { region: "North Africa", count: 2 },
    { region: "West Africa", count: 1 },
    { region: "Southern Africa", count: 1 },
  ]);
  // One question was missed once only: not a frequent mistake.
  assert.equal(summary.mistakes, 3);
});

test("an empty queue summarises as nothing rather than as an error", () => {
  assert.deepEqual(reviewScopeSummary(), {
    total: 0,
    levels: [],
    regions: [],
    mistakes: 0,
  });
  assert.deepEqual(reviewScopeSummary([]), reviewScopeSummary());
});

test("a level scope keeps only that level, in the queue's order", () => {
  const items = questionsInScope(queue, scopeOfLevel(1));
  assert.deepEqual(items.map((item) => item.index), [0, 3]);
  assert.deepEqual(questionsInScope(queue, scopeOfLevel(9)), []);
});

test("a region scope keeps only that region", () => {
  const items = questionsInScope(queue, scopeOfRegion("North Africa"));
  assert.deepEqual(items.map((item) => item.levelId), [1, 1]);
  assert.deepEqual(questionsInScope(queue, scopeOfRegion("Antarctica")), []);
});

test("the frequent mistakes scope drops what was missed only once, worst first", () => {
  const items = questionsInScope(queue, MISTAKES_SCOPE);
  assert.deepEqual(items.map((item) => item.wrong), [5, 4, 2]);
  assert.equal(items.length, reviewScopeSummary(queue).mistakes);
  // A single miss is not a recurring mistake.
  assert.equal(items.some((item) => item.wrong < MISTAKE_THRESHOLD), false);
});

test("the threshold of a frequent mistake can be raised", () => {
  assert.deepEqual(
    questionsInScope(queue, MISTAKES_SCOPE, { mistakeThreshold: 4 }).map((item) => item.wrong),
    [5, 4]
  );
  assert.deepEqual(questionsInScope(queue, MISTAKES_SCOPE, { mistakeThreshold: 6 }), []);
  assert.equal(reviewScopeSummary(queue, { mistakeThreshold: 4 }).mistakes, 2);
});

test("an unknown or absent scope is the whole queue, and the queue is left alone", () => {
  assert.equal(questionsInScope(queue).length, 4);
  assert.equal(questionsInScope(queue, ALL_SCOPE).length, 4);
  assert.equal(questionsInScope(queue, { kind: "somewhere else" }).length, 4);
  assert.equal(questionsInScope(undefined, ALL_SCOPE).length, 0);

  // Copying before sorting is what keeps the caller's list untouched.
  const original = [...queue];
  questionsInScope(queue, MISTAKES_SCOPE);
  assert.deepEqual(queue, original);

  // And the order of the returned list never depends on the order it sorts.
  const shuffled = [queue[1], queue[3], queue[0], queue[2]];
  assert.deepEqual(
    questionsInScope(shuffled, MISTAKES_SCOPE).map((item) => item.wrong),
    [5, 4, 2]
  );
});
