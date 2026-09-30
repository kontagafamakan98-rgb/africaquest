/**
 * How the application behaves at the size of the record it allows.
 *
 * This is about the one thing that grows without anybody deciding it: a player's
 * own progress. Everything else here is fixed - twenty levels, a file of
 * questions, a gallery of photographs - but the record on the device grows with
 * every answer, and the application allows a hand-made file to be far larger
 * than anything a player reaches. Two shapes are therefore built here, and the
 * difference between them is the whole point:
 *
 * - the heaviest record the reader accepts, which is what an imported file may
 *   be: four thousand answers and five thousand finished levels, the ceilings in
 *   src/lib/progress-file.js. Nothing real comes close, and a file that does has
 *   to be survived rather than argued with;
 * - a player who finished the game, which is what one device really holds: ten
 *   questions a level, twenty levels, and one history entry per level per
 *   difficulty.
 *
 * The budgets below are decisions, not measurements. They are written in the
 * unit the reader feels: a tap that blocks the screen, a page that takes a
 * moment to appear, a file that loads while somebody waits. They live here
 * rather than in the script so the script cannot quietly raise one, and a test
 * holds the table to the paths the script measures.
 *
 * They were not written for nothing. The first run of the script below found the
 * cliff they now guard: rebuilding the ceiling record cost eight hundred
 * milliseconds, because the reader asked the growing record for its key list
 * once per answer and so paid the square of the number of answers. A budget of
 * a quarter of a second would not have caught it by itself either - what caught
 * it was walking the ceiling at all, which is the whole argument for keeping a
 * record of this size in the tests instead of only a small one. It now costs a
 * few milliseconds, and the line below is what keeps it there.
 *
 * Plain module: no timing, no disk, no browser. The script measures, this
 * decides what a measurement is allowed to be.
 */

import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  MAX_HISTORY,
  MAX_LIST_ITEMS,
  MAX_QUESTIONS,
  cleanProgress,
} from "./progress-file.js";

/** A day, in milliseconds: the schedule only needs the past. */
const DAY = 86_400_000;

/**
 * The heaviest record the reader accepts, in the shape a hostile file could
 * have: answers on questions that do not exist, a level id at the ceiling, a
 * history as long as the ceiling allows, and every list filled.
 *
 * It is built through the same reader an imported file goes through, so what is
 * measured is what the application would really hold rather than a mock of it.
 */
export function heaviestProgress(now = Date.now()) {
  const question_stats = {};
  for (let index = 0; index < MAX_QUESTIONS; index += 1) {
    const level = 1 + Math.floor(index / 200);
    question_stats[`${level}:${index % 200}`] = {
      right: 3,
      wrong: 2,
      stage: 5,
      dueAt: now - DAY,
      lastSeen: now - DAY,
    };
  }

  const history = Array.from({ length: MAX_HISTORY }, (_unused, index) => ({
    date: "2026-09-27",
    level: 1 + (index % 20),
    difficulty: "hard",
    score: 20,
    total: 20,
    stars: 3,
    xp: 240,
  }));

  const badges = Array.from({ length: MAX_LIST_ITEMS }, (_unused, index) => `badge-${index}`);
  const studied_levels = Array.from({ length: MAX_LIST_ITEMS }, (_unused, index) => 1 + (index % 200));

  return cleanProgress({
    current_level: 20,
    total_xp: 120_000,
    stars_earned: 60,
    completed_levels: Array.from({ length: 20 }, (_unused, index) => index + 1),
    level_scores: Object.fromEntries(
      Array.from({ length: 20 }, (_unused, index) => [
        String(index + 1),
        { easy: { score: 7, stars: 3 }, medium: { score: 7, stars: 2 }, hard: { score: 6, stars: 1 } },
      ])
    ),
    total_time_seconds: 7200,
    streak_days: 30,
    last_played: "2026-09-27",
    question_stats,
    studied_levels,
    history,
    badges,
  });
}

/**
 * A player who finished the game, which is the record that really exists on a
 * device: every question of every level answered once, one history entry per
 * level per difficulty, a dozen badges, the levels all marked studied.
 */
export function finishedProgress(levels = [], now = Date.now()) {
  const question_stats = {};
  for (const level of levels) {
    level.questions.forEach((_question, index) => {
      question_stats[`${level.id}:${index}`] = {
        right: 2,
        wrong: index % 3 === 0 ? 1 : 0,
        stage: 3,
        dueAt: now + DAY,
        lastSeen: now - DAY,
      };
    });
  }

  return cleanProgress({
    current_level: levels.length || 20,
    total_xp: 14_400,
    stars_earned: 60,
    completed_levels: levels.map((level) => level.id),
    level_scores: Object.fromEntries(
      levels.map((level) => [String(level.id), { easy: { score: 7, stars: 3 }, hard: { score: 6, stars: 2 } }])
    ),
    total_time_seconds: 40_000,
    streak_days: 12,
    last_played: "2026-09-27",
    question_stats,
    studied_levels: levels.map((level) => level.id),
    history: levels.flatMap((level) =>
      ["easy", "medium", "hard"].map((difficulty) => ({
        date: "2026-09-26",
        level: level.id,
        difficulty,
        score: 6,
        total: 7,
        stars: 2,
        xp: 180,
      }))
    ),
    badges: Array.from({ length: 12 }, (_unused, index) => `badge-${index}`),
  });
}

/** The document a backup file really is, marker and version included. */
export function backupDocument(progress) {
  return JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date("2026-09-29T00:00:00.000Z").toISOString(),
    profileName: "Kofi",
    progress,
  });
}

/** What a record weighs as a file, which is what a device has to store. */
export function sizeOf(progress) {
  return JSON.stringify(progress).length;
}

/**
 * How long each path may take, in milliseconds, and why that number.
 *
 * The tightest is the one a reader pays on every tap; the loosest is a file
 * being loaded, where half a second is still a load rather than a hang.
 */
export const STRESS_BUDGETS = {
  answer: { budget: 50, what: "one answer written to the device (every tap)" },
  answerAtCeiling: { budget: 50, what: "one answer when a file filled the record" },
  repair: { budget: 250, what: "a record repaired against the known shape" },
  export: { budget: 250, what: "a backup document built to be saved" },
  import: { budget: 500, what: "a two megabyte file read and repaired" },
  reviewQueue: { budget: 100, what: "the review inbox rebuilt (every render)" },
  classPage: { budget: 1000, what: "forty students read and aggregated (teacher page)" },
};

/** The storage a browser gives one origin before it starts refusing, in bytes. */
export const QUOTA_BYTES = 5 * 1024 * 1024;

/**
 * How many records of this size fit in that quota, and what that means in a
 * classroom: the number is the honest one, because the tenth student on a
 * tablet is the failure that matters rather than the hundred thousandth reader
 * of a static site.
 */
export function recordsPerQuota(bytes, quota = QUOTA_BYTES) {
  if (!(bytes > 0)) return Number.POSITIVE_INFINITY;
  return Math.floor(quota / bytes);
}
