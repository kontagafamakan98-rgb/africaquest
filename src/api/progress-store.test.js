import test from "node:test";
import assert from "node:assert/strict";
import { clearFailures, recentFailures } from "../lib/error-log.js";
import { isDue } from "../lib/spaced-repetition.js";
import { pickFlashQuizQuestions } from "../lib/quick-quiz.js";
import { questionKey } from "../lib/game-metrics.js";

// The store is written for the browser; these tests give it the one browser API
// it actually uses. Nothing else is mocked, so what is asserted below is the
// real code path the game runs on.
const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear(),
  key: (index) => [...memory.keys()][index] ?? null,
  get length() {
    return memory.size;
  },
};

const { progressStore, needsBackupOffer, dismissBackupOffer, isEmptyProgress } = await import(
  "./progress-store.js"
);

const REWARDS = {
  total_xp: 240,
  stars_earned: 3,
  completed_levels: [1, 2],
  current_level: 3,
  total_time_seconds: 615,
  badges: ["first_steps"],
  level_scores: { 1: { easy: 100 } },
  streak_days: 4,
  last_played: "2026-09-27",
};

async function freshProgress(extra = {}) {
  memory.clear();
  await progressStore.create({ ...REWARDS, ...extra });
  return progressStore.list();
}

test("answering only touches the review memory, never a reward", async () => {
  await freshProgress();

  await progressStore.recordAnswer("1:0", true);
  await progressStore.recordAnswer("1:2", false);

  const [progress] = await progressStore.list();

  // The whole point: no stars, no XP, no level finished, no badge, no time.
  assert.equal(progress.total_xp, REWARDS.total_xp);
  assert.equal(progress.stars_earned, REWARDS.stars_earned);
  assert.deepEqual(progress.completed_levels, REWARDS.completed_levels);
  assert.equal(progress.current_level, REWARDS.current_level);
  assert.equal(progress.total_time_seconds, REWARDS.total_time_seconds);
  assert.deepEqual(progress.badges, REWARDS.badges);
  assert.deepEqual(progress.level_scores, REWARDS.level_scores);
  assert.equal(progress.streak_days, REWARDS.streak_days);
  assert.deepEqual(progress.history, []);

  // Only the per question memory moved.
  assert.equal(progress.question_stats["1:0"].right, 1);
  assert.equal(progress.question_stats["1:0"].wrong, 0);
  assert.equal(progress.question_stats["1:2"].right, 0);
  assert.equal(progress.question_stats["1:2"].wrong, 1);
});

test("a question missed in the flash quiz comes back later, not straight away", async () => {
  await freshProgress();
  const key = questionKey(3, 4);

  await progressStore.recordAnswer(key, false);
  const [progress] = await progressStore.list();
  const stat = progress.question_stats[key];

  assert.equal(stat.stage, 0, "a mistake starts the ladder over");
  assert.equal(isDue(stat, Date.now()), false, "it is not asked again immediately");
  assert.equal(isDue(stat, Date.now() + 11 * 60 * 1000), true, "it is back ten minutes later");

  // Missing it again sends it back to the shortest delay.
  await progressStore.recordAnswer(key, false);
  const [later] = await progressStore.list();
  assert.equal(later.question_stats[key].wrong, 2);
  assert.equal(isDue(later.question_stats[key], Date.now() + 60 * 1000), false);
});

test("a question the flash quiz gets right is left out of the rotation", async () => {
  await freshProgress();
  const key = questionKey(1, 7);

  await progressStore.recordAnswer(key, true);
  const [progress] = await progressStore.list();
  const stat = progress.question_stats[key];

  assert.equal(stat.right, 1);
  assert.equal(stat.wrong, 0);
  assert.equal(stat.dueAt, undefined);
  assert.equal(isDue(stat, Date.now() + 365 * 24 * 60 * 60 * 1000), false);
});

test("a question already in the rotation keeps climbing when answered right", async () => {
  await freshProgress();
  const key = questionKey(2, 1);

  await progressStore.recordAnswer(key, false);
  await progressStore.recordAnswer(key, true);
  const [progress] = await progressStore.list();
  const stat = progress.question_stats[key];

  assert.equal(stat.wrong, 1, "the mistake is remembered");
  assert.equal(stat.right, 1);
  assert.equal(stat.stage, 1);
  assert.equal(isDue(stat, Date.now() + 60 * 60 * 1000), false, "a day away, not an hour");
});

test("the write survives a reload and keeps its dates", async () => {
  await freshProgress();
  await progressStore.recordAnswer("4:0", false);

  const raw = JSON.parse(memory.get("aq_progress_v1"));
  assert.equal(typeof raw.question_stats["4:0"].dueAt, "number");
  assert.equal(typeof raw.question_stats["4:0"].lastSeen, "number");
  assert.equal(raw.question_stats["4:0"].wrong, 1);
  // The rewards are still exactly what they were before.
  assert.equal(raw.total_xp, REWARDS.total_xp);
});

test("loading a backup replaces the record instead of merging into it", async () => {
  await freshProgress({ question_stats: { "1:0": { right: 1, wrong: 0 } } });

  // A file taken on another device: one level finished, and no memory of the
  // answers given on this one.
  await progressStore.replace({
    total_xp: 40,
    stars_earned: 0,
    completed_levels: [1],
    current_level: 2,
    question_stats: {},
  });

  const [progress] = await progressStore.list();
  assert.equal(progress.total_xp, 40);
  assert.deepEqual(progress.completed_levels, [1]);
  assert.equal(progress.current_level, 2);
  // What the file does not carry is not kept from the old record either.
  assert.deepEqual(progress.question_stats, {});
  assert.deepEqual(progress.badges, []);
  assert.equal(progress.total_time_seconds, 0);
  assert.deepEqual(progress.history, []);
  // The id list() adds for the query cache is not part of the stored record.
  assert.equal("id" in JSON.parse(memory.get("aq_progress_v1")), false);
});

test("a device that never played is offered its backup, once", () => {
  memory.clear();

  // Nothing stored, no roster: this browser has never seen the game, and it may
  // well be holding the file of a player who used another one.
  assert.equal(needsBackupOffer(), true);

  // Choosing to start from the beginning answers the question for good, so it
  // does not come back on every reload. Settings stays the way to change one's
  // mind later.
  dismissBackupOffer();
  assert.equal(needsBackupOffer(), false);
});

test("a record the game created on opening is not progress", async () => {
  memory.clear();
  // This is exactly what a new device holds once the game has started: the
  // empty record the home screen seeds, and nothing else.
  await progressStore.create({});

  assert.equal(localStorage.getItem("aq_progress_v1") !== null, true, "the record exists");
  assert.equal(isEmptyProgress(JSON.parse(localStorage.getItem("aq_progress_v1"))), true);
  assert.equal(needsBackupOffer(), true, "so the player is still offered their file");

  // One answered question is enough to make it a progress of their own.
  await progressStore.recordAnswer("1:0", true);
  assert.equal(needsBackupOffer(), false);
});

test("progress, or a roster, closes the question", async () => {
  await freshProgress();
  assert.equal(needsBackupOffer(), false, "there is something to lose, so no offer");

  // A record the player deleted is not a record: the app only knows what
  // storage holds, and storage now holds nothing.
  await progressStore.remove();
  assert.equal(needsBackupOffer(), true);

  // A classroom tablet that created students is not a new device either, even
  // when the student playing now has never answered a question.
  memory.clear();
  localStorage.setItem(
    "aq_profiles_v1",
    JSON.stringify([
      { id: "local", name: "", created: null },
      { id: "p1", name: "Amina", created: null },
    ])
  );
  localStorage.setItem("aq_active_profile", "p1");
  assert.equal(needsBackupOffer(), false);
});

test("the flash quiz keys its answers to the right question", async () => {
  await freshProgress();

  // Three questions from a level of thirteen, exactly as the lesson picks them.
  const questions = Array.from({ length: 13 }, (_, index) => ({ question: `q${index}` }));
  const items = pickFlashQuizQuestions(questions);
  assert.deepEqual(items.map((item) => item.index), [0, 6, 12]);

  await progressStore.recordAnswer(questionKey(5, items[1].index), false);

  const [progress] = await progressStore.list();
  assert.deepEqual(Object.keys(progress.question_stats), ["5:6"], "the answer lands on the question that was asked");
  assert.equal(progress.question_stats["5:6"].wrong, 1);
});

test("a browser that refuses to save is seen, and a browser that saves again is too", async () => {
  const { watchSaveRefusal, saveIsRefused } = await import("./progress-store.js");
  await freshProgress();

  // A full quota, a device in private browsing, a school browser that blocks
  // storage: all of them throw here, and all of them have to be visible. The
  // write still fails for the caller - a change that was not saved must not
  // look saved - and the application is told so it can say it out loud.
  const seen = [];
  const stop = watchSaveRefusal((failed) => seen.push(failed));
  assert.equal(saveIsRefused(), false);
  clearFailures();

  const allowed = localStorage.setItem;
  localStorage.setItem = () => {
    const error = new Error("QuotaExceededError");
    error.name = "QuotaExceededError";
    throw error;
  };

  await assert.rejects(() => progressStore.recordAnswer("1:0", true), /QuotaExceededError/);
  assert.equal(saveIsRefused(), true);
  assert.equal(seen.at(-1)?.name, "QuotaExceededError");

  // And it is written into the log the report carries: a browser that will not
  // save is the failure nobody can reconstruct afterwards, because it says
  // nothing once the tab is closed.
  assert.deepEqual(
    recentFailures().map((entry) => [entry.name, entry.where]),
    [["QuotaExceededError", "failurePlaceSave"]]
  );

  // Reported once, not once per keystroke: a refusal that has already been said
  // is not news.
  const after = seen.length;
  await assert.rejects(() => progressStore.recordAnswer("1:1", false));
  assert.equal(seen.length, after, "the same refusal was announced twice");
  // The same wall, hit twice, is one line: what the report has to say is that the
  // browser refuses, not how many times the player pressed a button.
  assert.equal(recentFailures().length, 1);
  assert.equal(recentFailures()[0].count, 1);

  localStorage.setItem = allowed;
  await progressStore.recordAnswer("1:2", true);
  assert.equal(saveIsRefused(), false, "a store that saves again is no longer refused");
  assert.equal(seen.at(-1), null);

  // And stopping really stops: the wall is hit again, the store's own answer
  // changes back, and the listener that asked to stop hears nothing. What this
  // watches is the behaviour, not the value `Set.delete` happens to return.
  const heard = seen.length;
  stop();
  localStorage.setItem = () => {
    const error = new Error("QuotaExceededError");
    error.name = "QuotaExceededError";
    throw error;
  };
  await assert.rejects(() => progressStore.recordAnswer("1:3", true));
  assert.equal(saveIsRefused(), true);
  assert.equal(seen.length, heard, "a listener that stopped listening was called again");
  localStorage.setItem = allowed;
});
