import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  MAX_BACKUP_BYTES,
  MAX_HISTORY,
  MAX_LIST_ITEMS,
  MAX_QUESTIONS,
  cleanProgress,
  checkBackupFile,
  readBackup,
} from "./progress-file.js";
import {
  QUOTA_BYTES,
  STRESS_BUDGETS,
  backupDocument,
  finishedProgress,
  heaviestProgress,
  recordsPerQuota,
  sizeOf,
} from "./load-stress.js";
import { defaultProgress } from "../api/progress-store.js";
import { getLevels } from "../components/game/gameData.js";
import { collectReviewQueue } from "../components/game/learning.js";

// What the application does at the size of the record it allows.
//
// Every other measurement in this project is about fixed content: twenty-six levels,
// a gallery of photographs, a bundle. The record on a device is the one thing a
// reader can make as large as the reader allows, and the interesting question is
// not whether a normal player is fine - that is obvious - but what happens to
// somebody holding a file at the very ceiling. So the shapes are built and held
// to their claims here, and the timings are measured by scripts/stress-load.mjs
// against the same table this file reads (npm run stress).
//
// Levels are needed for the shape a player really finished, so they are read
// from the game itself rather than invented: a test of "twenty-six levels" that
// guesses how many questions a level holds is a test of nothing.

const LEVELS = getLevels("en");
const QUESTIONS = LEVELS.reduce((total, level) => total + level.questions.length, 0);

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

test("the ceiling really is the ceiling the reader allows", () => {
  const progress = heaviestProgress(Date.parse("2026-09-29T00:00:00.000Z"));

  assert.equal(Object.keys(progress.question_stats).length, MAX_QUESTIONS);
  assert.equal(progress.history.length, MAX_HISTORY);
  assert.equal(progress.badges.length, MAX_LIST_ITEMS);
  assert.equal(progress.studied_levels.length, MAX_LIST_ITEMS);
  assert.equal(progress.completed_levels.length, 26, "twenty-six levels, and every one finished");

  // Built through the reader, so it holds exactly the fields a stored record
  // holds: nothing invented, nothing missing, and every value the type the rest
  // of the application expects.
  assert.deepEqual(Object.keys(progress).sort(), Object.keys(defaultProgress()).sort());
  for (const [key, stat] of Object.entries(progress.question_stats)) {
    assert.match(key, /^\d+:\d+$/);
    assert.equal(typeof stat.right, "number", key);
    assert.equal(typeof stat.dueAt, "number", key);
  }
  for (const entry of progress.history) {
    assert.equal(typeof entry.date, "string");
    assert.equal(typeof entry.level, "number");
  }

  // And it is a record a file may carry: the ceilings cannot build something the
  // importer would refuse for its size, which would make the whole measurement
  // an argument about a file that never arrives.
  const document = backupDocument(progress);
  assert.ok(document.length < MAX_BACKUP_BYTES, `${document.length} bytes is a file that is refused`);
  assert.equal(checkBackupFile({ name: "africa-quest-kofi.json", type: "application/json", size: document.length }).ok, true);

  // Read back, it is still at the ceiling: what the reader keeps of a hostile
  // file is the file's own contents, not a fraction of them.
  const back = readBackup(document);
  assert.equal(back.ok, true);
  assert.equal(Object.keys(back.progress.question_stats).length, MAX_QUESTIONS);
  assert.equal(back.progress.history.length, MAX_HISTORY);
  assert.equal(back.progress.badges.length, MAX_LIST_ITEMS);
});

test("the record a player really finished is small next to it", () => {
  const progress = finishedProgress(LEVELS);

  assert.equal(Object.keys(progress.question_stats).length, QUESTIONS, "every question is answered once");
  assert.equal(progress.history.length, LEVELS.length * 3, "one entry per level per difficulty");
  assert.equal(progress.badges.length, 12);
  assert.equal(progress.studied_levels.length, LEVELS.length);

  // Every question of every level has its memory: a claim about the shape that a
  // key built from the wrong pair would break.
  LEVELS.forEach((level) => {
    level.questions.forEach((_question, index) => {
      assert.ok(`${level.id}:${index}` in progress.question_stats, `${level.id}:${index}`);
    });
  });

  // The distance between the two shapes is the point of measuring both: what a
  // device holds is a fortieth of what a file may bring, so a budget kept for
  // the ceiling is a budget with room to spare on the record people really have.
  const finished = sizeOf(progress);
  const ceiling = sizeOf(heaviestProgress());
  assert.ok(finished * 10 < ceiling, `${finished} bytes is not small next to ${ceiling}`);
});

test("a small device holds a classroom, and the ceiling holds a few", () => {
  const finished = sizeOf(finishedProgress(LEVELS));
  const ceiling = sizeOf(heaviestProgress());

  // The quota is per origin, not per student, so the number that matters on a
  // shared tablet is how many records fit in it before the browser refuses to
  // save at all - which the application then says out loud.
  // The floor is a classroom with room to spare rather than a count: the game
  // grew from twenty levels to twenty-six, and the record a finished player
  // really holds grew with it, so the same five megabytes now carry about
  // ninety of them. Seventy-five is still two and a half classrooms on one
  // origin, which is the claim the floor is here to keep.
  assert.ok(recordsPerQuota(finished) >= 75, `${recordsPerQuota(finished)} students in ${QUOTA_BYTES} bytes`);
  assert.ok(recordsPerQuota(ceiling) >= 1, "the heaviest record a file may bring still fits once");
  assert.equal(recordsPerQuota(0), Number.POSITIVE_INFINITY, "a record of no size is not a division by zero");
  assert.equal(recordsPerQuota(3, 10), 3, "and it is a whole number of records");
});

test("no list a screen draws grows with the ceiling", () => {
  // The inbox walks the questions of the game, not the answers in the record, so
  // a record four thousand answers long cannot make a screen draw four thousand
  // rows. This is the shape the map and the review screen depend on.
  const heaviest = collectReviewQueue(heaviestProgress().question_stats, LEVELS);
  assert.ok(heaviest.length <= QUESTIONS, `${heaviest.length} rows from ${QUESTIONS} questions`);

  const finished = collectReviewQueue(finishedProgress(LEVELS).question_stats, LEVELS);
  assert.ok(finished.length <= QUESTIONS);
});

test("repairing the heaviest record stays inside the budget the table allows", () => {
  // The one place a timing belongs in a test rather than in the script: this is
  // the regression that was found by running the stress script for the first
  // time, and what it looked like was eight hundred milliseconds where three
  // would do. The margin is deliberate - the work is a couple of milliseconds
  // against a quarter of a second - so a loaded runner cannot fail this, while
  // the square of the number of answers cannot pass it.
  const ceiling = heaviestProgress();
  const started = performance.now();
  cleanProgress(ceiling);
  const elapsed = performance.now() - started;

  assert.ok(
    elapsed < STRESS_BUDGETS.repair.budget,
    `rebuilding the ceiling took ${elapsed.toFixed(1)} ms, over the ${STRESS_BUDGETS.repair.budget} ms allowed`
  );
});

test("the budgets name the paths the script walks, and stay out of the verification", () => {
  const keys = Object.keys(STRESS_BUDGETS);
  assert.ok(keys.length >= 6, "the table is smaller than the paths this application has");

  // Every line is a decision somebody can read: a number, and what a reader
  // feels when that number is passed.
  for (const [key, entry] of Object.entries(STRESS_BUDGETS)) {
    assert.ok(Number.isInteger(entry.budget) && entry.budget > 0, `${key} has no budget`);
    assert.ok(typeof entry.what === "string" && entry.what.length > 10, `${key} does not say what it measures`);
  }

  const script = read("scripts/stress-load.mjs");
  for (const key of keys) {
    assert.ok(script.includes(`"${key}"`), `npm run stress no longer walks ${key}`);
  }
  // And the script refuses to report a path the table has never heard of, which
  // is how the two stay in step rather than drifting apart quietly.
  assert.match(script, /has no budget in src\/lib\/load-stress\.js/);

  const { scripts } = JSON.parse(read("package.json"));
  assert.match(scripts.stress, /stress-load\.mjs/, "package.json registers the stress run");
  // A timing on a shared runner is a coin toss, and a check that fails at random
  // is one people learn to ignore: the verification stays without it.
  assert.ok(!scripts.verify.includes("stress"), "the verification measures timings");
  assert.match(script, /not part of `npm run verify`/);
});
