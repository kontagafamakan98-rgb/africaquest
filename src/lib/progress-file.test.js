import test from "node:test";
import assert from "node:assert/strict";
import { defaultProgress } from "../api/progress-store.js";
import {
  BACKUP_FORMAT,
  BACKUP_REASONS,
  BACKUP_VERSION,
  backupFileName,
  buildBackup,
  cleanProgress,
  readBackup,
} from "./progress-file.js";

/**
 * A backup is what a player relies on after losing a device, so the two things
 * that matter are that a saved file gives back the same progress, and that a
 * file the app did not write never gets stored. These tests hold both ends: a
 * real record read by a cleaned reader is a lossless round trip, and anything
 * else is refused or repaired instead of reaching the dashboard.
 */

const NOW = Date.UTC(2026, 8, 27, 18, 30, 0);

// The shape of a record that has actually been played: finished levels, a
// mistake history, one question with a schedule and one saved before the
// schedule existed.
const playedProgress = {
  current_level: 4,
  total_xp: 240,
  stars_earned: 1,
  completed_levels: [1, 2, 3],
  badges: ["first_step"],
  level_scores: {
    "1": { easy: { score: 1, stars: 0 } },
    "2": { easy: { score: 2, stars: 0 } },
    "3": { easy: { score: 9, stars: 1 } },
  },
  total_time_seconds: 7653,
  streak_days: 1,
  last_played: "2026-09-27",
  question_stats: {
    "1:0": { right: 4, wrong: 3, stage: 0, dueAt: 1790570951991, lastSeen: 1790570351991 },
    "1:1": { right: 2, wrong: 2 },
    "3:12": { right: 0, wrong: 1, stage: 0, dueAt: 1790571100006, lastSeen: 1790570500006 },
  },
  studied_levels: [1, 3],
  history: [
    { date: "2026-09-27", level: 3, difficulty: "easy", score: 9, total: 13, stars: 1, xp: 180 },
  ],
};

const readText = (progress, extra = {}) =>
  readBackup(
    JSON.stringify({ format: BACKUP_FORMAT, version: BACKUP_VERSION, progress, ...extra })
  );

test("a played record comes back from its file exactly as it was saved", () => {
  const text = JSON.stringify(buildBackup({ progress: playedProgress, profileName: "Kojo", now: NOW }));
  const read = readBackup(text);

  assert.equal(read.ok, true);
  assert.deepEqual(read.progress, playedProgress);
});

test("the file says what it is, whose it is and when it was taken", () => {
  const backup = buildBackup({ progress: playedProgress, profileName: "  Kojo  ", now: NOW });

  assert.equal(backup.format, BACKUP_FORMAT);
  assert.equal(backup.version, BACKUP_VERSION);
  assert.equal(backup.profileName, "Kojo");
  assert.equal(backup.exportedAt, new Date(NOW).toISOString());
  // The stored record never leaks its storage id into the file.
  assert.equal("id" in backup.progress, false);
});

test("an empty, unreadable or foreign file is refused, with a reason", () => {
  assert.equal(readBackup("").reason, BACKUP_REASONS.empty);
  assert.equal(readBackup("   ").reason, BACKUP_REASONS.empty);
  assert.equal(readBackup("{ not json").reason, BACKUP_REASONS.notJson);
  assert.equal(readBackup("[]").reason, BACKUP_REASONS.notJson);
  assert.equal(readBackup('"a string"').reason, BACKUP_REASONS.notJson);
  assert.equal(readBackup('{"hello":"world"}').reason, BACKUP_REASONS.notBackup);
  assert.equal(
    readBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1 })).reason,
    BACKUP_REASONS.notBackup
  );
  assert.equal(
    readBackup(JSON.stringify({ format: BACKUP_FORMAT, version: "x", progress: {} })).reason,
    BACKUP_REASONS.notBackup
  );
  // A refusal never throws and never hands back a record.
  assert.equal(readBackup("").ok, false);
  assert.equal(readBackup("").progress, undefined);
});

test("a file written by a newer version of the app is not guessed at", () => {
  const read = readBackup(
    JSON.stringify({ format: BACKUP_FORMAT, version: BACKUP_VERSION + 1, progress: playedProgress })
  );
  assert.equal(read.ok, false);
  assert.equal(read.reason, BACKUP_REASONS.newer);
});

test("anything the app cannot use is repaired instead of stored", () => {
  const read = readText({
    current_level: "3",
    total_xp: "beaucoup",
    stars_earned: -4,
    completed_levels: "1,2",
    badges: [123, "first_step", "first_step"],
    level_scores: { "1": { impossible: { score: 5 } }, nope: { easy: { score: 1 } } },
    total_time_seconds: 12.7,
    streak_days: null,
    last_played: "hier",
    question_stats: { nope: { right: 1, wrong: 0 }, "2:1": "junk", "2:2": { right: 1, wrong: 0 } },
    studied_levels: [3, 3, 0],
    history: [{ date: "pas une date" }, { date: "2026-01-02", level: 1, score: 4 }],
    whatever: { injected: true },
  });

  assert.equal(read.ok, true);
  assert.deepEqual(read.progress, {
    ...defaultProgress(),
    current_level: 3,
    total_xp: 0,
    stars_earned: 0,
    completed_levels: [],
    badges: ["first_step"],
    level_scores: {},
    total_time_seconds: 12,
    streak_days: 0,
    last_played: null,
    question_stats: { "2:2": { right: 1, wrong: 0 } },
    studied_levels: [3],
    history: [
      { date: "2026-01-02", level: 1, difficulty: "", score: 4, total: 0, stars: 0, xp: 0 },
    ],
  });
  // No field outside the known shape can be carried in by a file.
  assert.deepEqual(Object.keys(read.progress), Object.keys(defaultProgress()));
});

test("an answer saved before the schedule existed keeps no stage", () => {
  // Absence is the information: a stage the file never had would send the
  // question back to the shortest interval instead of letting the ladder infer
  // where it stands.
  const read = readText({ question_stats: { "1:1": { right: 2, wrong: 2 } } });
  assert.deepEqual(read.progress.question_stats["1:1"], { right: 2, wrong: 2 });
  assert.equal("stage" in read.progress.question_stats["1:1"], false);

  const staged = readText({
    question_stats: { "1:1": { right: 2, wrong: 2, stage: 99, dueAt: 5.9, lastSeen: -3 } },
  });
  assert.deepEqual(staged.progress.question_stats["1:1"], {
    right: 2,
    wrong: 2,
    stage: 5,
    dueAt: 5,
    lastSeen: 0,
  });
});

test("a missing or broken record still gives a usable one", () => {
  assert.deepEqual(cleanProgress(undefined), defaultProgress());
  assert.deepEqual(cleanProgress(null), defaultProgress());
  assert.deepEqual(cleanProgress("junk"), defaultProgress());
  assert.deepEqual(cleanProgress([1, 2, 3]), defaultProgress());
  assert.equal(cleanProgress({ total_xp: 500 }).total_xp, 500);
  assert.equal(cleanProgress({ total_xp: 500 }).current_level, 1);
});

test("the file name names the student and the day", () => {
  assert.equal(backupFileName("Kojo", NOW), "africa-quest-kojo-2026-09-27.json");
  assert.equal(backupFileName("Amina Traoré", NOW), "africa-quest-amina-traore-2026-09-27.json");
  assert.equal(backupFileName("", NOW), "africa-quest-2026-09-27.json");
  assert.equal(backupFileName("   ", NOW), "africa-quest-2026-09-27.json");
  assert.equal(backupFileName("***", NOW), "africa-quest-2026-09-27.json");
  assert.equal(backupFileName("Kojo", "invalid"), `africa-quest-kojo-${new Date().toISOString().slice(0, 10)}.json`);
});

test("importStudentProfile registers a new student with progress in the roster", async () => {
  const { importStudentProfile, listStudentsWithProgress, listProfiles } = await import("../api/profiles-store.js");

  const memory = new Map();
  globalThis.localStorage = {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
    clear: () => memory.clear(),
  };

  const res1 = importStudentProfile("Amina", playedProgress);
  assert.equal(res1.profile.name, "Amina");
  assert.equal(res1.updated, false);

  const students = listStudentsWithProgress();
  assert.equal(students.length, 1);
  assert.equal(students[0].name, "Amina");
  assert.equal(students[0].progress.total_xp, 240);

  const updatedProgress = { ...playedProgress, total_xp: 300 };
  const res2 = importStudentProfile("amina", updatedProgress);
  assert.equal(res2.updated, true);
  assert.equal(res2.profile.id, res1.profile.id);

  const studentsAfter = listStudentsWithProgress();
  assert.equal(studentsAfter.length, 1);
  assert.equal(studentsAfter[0].progress.total_xp, 300);

  const res3 = importStudentProfile("Kwame", playedProgress);
  assert.equal(res3.updated, false);
  assert.equal(listProfiles().length, 2);
});

test("a file whose student has no name still lands in the roster", async () => {
  // A backup exported from a device whose profile was never named carries no
  // name at all, and the teacher space falls back to the file name: a file
  // called africa-quest-2026-09-27.json has nothing left to make a name from.
  // The roster still needs an entry to hold the progress, so it gets a
  // placeholder the teacher can rename - and this path used to throw instead,
  // on a name that was never defined.
  const { importStudentProfile, listStudentsWithProgress } = await import("../api/profiles-store.js");

  const memory = new Map();
  globalThis.localStorage = {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
    clear: () => memory.clear(),
  };

  const imported = importStudentProfile("", playedProgress);
  assert.equal(imported.profile.name, "Student");
  assert.equal(imported.updated, false);
  assert.equal(listStudentsWithProgress()[0].progress.total_xp, playedProgress.total_xp);
});
