import { RotateCcw } from "lucide-react";
// Explicit extensions: the file is also loaded directly by the test runner.
import { DIFFICULTIES } from "./difficulties.js";
// The brief of the game, not the game: scheduling a review needs to know how
// many questions a level holds, never what they ask, so this module never
// imports gameData.js - which is what lets the map screen compute the review
// count without downloading the two hundred questions behind it.
import { LEVEL_SUMMARIES, TOTAL_QUESTIONS } from "./level-summary.js";
import { dueAt, reviewStage } from "../../lib/spaced-repetition.js";
import {
  questionKey,
  levelMastery,
  averageMastery,
  regionAccuracy as regionAccuracyOf,
  meanOf,
  questionCountOf,
} from "../../lib/game-metrics.js";

// The metrics themselves live in a game-data-free module so the teacher page can
// reuse them, and so they stay covered by unit tests. Re-exported here because
// the player's screens have always imported them from this file.
export { questionKey, levelMastery, averageMastery };

// How many questions the whole game asks, from the brief rather than from the
// questions: the statistics tab counts against it, and the map screen carries it
// without carrying a single question.
export { TOTAL_QUESTIONS };


/**
 * Questions the review session should ask back right now, following the spaced
 * repetition schedule: the most overdue first, then the ones missed most often.
 * A question missed a minute ago is not in the list yet, it comes back later.
 */
export function collectDueReviews(questionStats = {}, levels = LEVEL_SUMMARIES, { max = 12, now = Date.now() } = {}) {
  const items = [];
  levels.forEach((level) => {
    for (let index = 0; index < questionCountOf(level); index += 1) {
      const stat = questionStats[questionKey(level.id, index)];
      if (!stat) continue;
      const due = dueAt(stat, now);
      if (due > now) continue;
      // The question itself travels along when the caller had the content to
      // hand over; a screen working from the brief gets the position and the
      // schedule, and asks the full levels for the wording when it shows it.
      items.push({ levelId: level.id, index, question: level.questions?.[index], due, wrong: stat.wrong || 0 });
    }
  });
  items.sort((a, b) => a.due - b.due || b.wrong - a.wrong);
  return items
    .slice(0, max)
    .map(({ levelId, index, question }) => ({ levelId, index, question }));
}

/**
 * The whole review inbox: every question still in the rotation, whether it is
 * due right now or scheduled for later, sorted by when it comes back. Each item
 * carries the question's position and its schedule, so a screen can show the
 * waiting time of every one and let the player choose what to practise instead
 * of always being handed the same due batch.
 */
export function collectReviewQueue(questionStats = {}, levels = LEVEL_SUMMARIES, { now = Date.now() } = {}) {
  const items = [];
  levels.forEach((level) => {
    for (let index = 0; index < questionCountOf(level); index += 1) {
      const stat = questionStats[questionKey(level.id, index)];
      // A question the player has never missed is not in the rotation at all.
      if (!stat || (stat.wrong || 0) === 0) continue;
      const due = dueAt(stat, now);
      items.push({
        levelId: level.id,
        index,
        question: level.questions?.[index],
        // Carried along so the list can name the lesson each question comes
        // from without looking it up again.
        levelTitle: level.title,
        region: level.region,
        due,
        isDue: due <= now,
        stage: reviewStage(stat),
        right: stat.right || 0,
        wrong: stat.wrong || 0,
        lastSeen: stat.lastSeen || 0,
      });
    }
  });
  // Overdue first, then the ones most often missed, then a stable tie break.
  items.sort(
    (a, b) => a.due - b.due || b.wrong - a.wrong || a.levelId - b.levelId || a.index - b.index
  );
  return items;
}

/**
 * Delay before the next question comes back, in milliseconds, or null when the
 * review queue is empty. Lets the app tell the player when to return.
 */
export function nextReviewDelay(questionStats = {}, levels = LEVEL_SUMMARIES, now = Date.now()) {
  let soonest = Infinity;
  levels.forEach((level) => {
    for (let index = 0; index < questionCountOf(level); index += 1) {
      const stat = questionStats[questionKey(level.id, index)];
      if (!stat) continue;
      const due = dueAt(stat, now);
      if (due > now && due < soonest) soonest = due;
    }
  });
  return soonest === Infinity ? null : soonest - now;
}

/**
 * A review delay as { value, unit }, in the largest unit that keeps it readable:
 * 10 minutes, 3 hours or 4 days rather than a raw number of milliseconds.
 */
export function reviewDelayParts(ms) {
  if (!ms || ms <= 0) return { value: 0, unit: "minute" };
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return { value: minutes, unit: "minute" };
  const hours = Math.round(minutes / 60);
  if (hours < 24) return { value: hours, unit: "hour" };
  return { value: Math.round(hours / 24), unit: "day" };
}

/** Localized delay such as "3 jours", or null when nothing is scheduled. */
export function formatReviewDelay(ms, t) {
  if (!ms || ms <= 0) return null;
  const { value, unit } = reviewDelayParts(ms);
  const key = `unit${unit[0].toUpperCase()}${unit.slice(1)}${value === 1 ? "" : "s"}`;
  return `${value} ${t?.[key] || unit}`;
}

/** Build a synthetic "level" so the existing quiz screen can run a review session. */
export function buildReviewLevel(items, { title, region, subtitle }) {
  const questions = items.map(({ levelId, index, question }) => ({
    ...question,
    __key: questionKey(levelId, index),
  }));
  return {
    id: 0,
    title,
    subtitle,
    region,
    color: "from-amber-600 to-orange-800",
    icon: RotateCcw,
    questions,
  };
}

/** Questions the player has already answered correctly at least once. */
export function countMastered(questionStats = {}) {
  return Object.values(questionStats).filter((stat) => (stat?.right || 0) > 0).length;
}

/** How many questions the review session would offer right now. */
export function countDueReviews(questionStats = {}, levels = LEVEL_SUMMARIES, now = Date.now()) {
  return collectDueReviews(questionStats, levels, { max: Infinity, now }).length;
}

/** Questions still waiting in the rotation, scheduled for a later date. */
export function countScheduledReviews(questionStats = {}, levels = LEVEL_SUMMARIES, now = Date.now()) {
  let total = 0;
  levels.forEach((level) => {
    for (let index = 0; index < questionCountOf(level); index += 1) {
      const stat = questionStats[questionKey(level.id, index)];
      if (stat && (stat.wrong || 0) > 0 && dueAt(stat, now) > now) total += 1;
    }
  });
  return total;
}

/**
 * The levels a player may open right now.
 *
 * The game is a timeline, so the ladder follows `order` rather than the id a
 * level happens to be stored under: a level is open when the player has already
 * finished it, or when it is the first one of the timeline still waiting. That
 * way a player who finished three levels of an older, shorter game keeps every
 * level they completed and is sent back to the beginning of the story, which is
 * exactly where the levels added since then begin.
 */
export function unlockedLevelIds(levels = LEVEL_SUMMARIES, completedLevels = []) {
  const done = new Set((completedLevels || []).map(Number));
  const timeline = [...levels].sort((a, b) => a.order - b.order);
  const waiting = timeline.find((level) => !done.has(level.id));

  return new Set(
    timeline
      .filter((level) => done.has(level.id) || (waiting && level.order <= waiting.order))
      .map((level) => level.id)
  );
}

/**
 * How the player does on each difficulty, one row per difficulty, in the order
 * the game offers them.
 *
 * Built from the finished games rather than from the best scores: the question
 * here is how well the player succeeds, so every game counts, at the difficulty
 * it was really played on. The rate is computed over all the questions answered
 * at that difficulty rather than as an average of percentages, so a short quiz
 * does not weigh as much as a long one. A difficulty never tried has no rate at
 * all instead of a zero, and comparing them needs at least two of them: the one
 * played alone is not the best one, it is the only one.
 */
export function difficultyBreakdown(history = [], difficulties = Object.keys(DIFFICULTIES)) {
  const played = new Map();

  (history || []).forEach((entry) => {
    const id = entry?.difficulty;
    const total = entry?.total || 0;
    const score = Math.max(0, entry?.score || 0);
    if (!id || !difficulties.includes(id) || total <= 0) return;

    const stat = played.get(id) || { games: 0, correct: 0, questions: 0, bestAccuracy: 0 };
    stat.games += 1;
    stat.correct += score;
    stat.questions += total;
    stat.bestAccuracy = Math.max(stat.bestAccuracy, Math.round((score / total) * 100));
    played.set(id, stat);
  });

  const rows = difficulties.map((id) => {
    const stat = played.get(id);
    if (!stat) return { id, games: 0, accuracy: null, bestAccuracy: null };
    return {
      id,
      games: stat.games,
      accuracy: Math.round((stat.correct / stat.questions) * 100),
      bestAccuracy: stat.bestAccuracy,
    };
  });

  const tried = rows.filter((row) => row.games > 0);
  const leader =
    tried.length >= 2 ? tried.reduce((best, row) => (row.accuracy > best.accuracy ? row : best)) : null;

  return { rows, leader };
}

/**
 * Stars earned per day, cumulated over time. `history` entries are the gains
 * recorded after each finished level, so the last point always matches the
 * player's real star total. Input stays untouched when it is empty.
 */
export function starsOverTime(history = [], windowDays = 14) {
  const perDay = {};
  history.forEach((entry) => {
    const date = entry?.date;
    if (!date) return;
    perDay[date] = (perDay[date] || 0) + (entry.stars || 0);
  });

  const days = Object.keys(perDay).sort();
  if (days.length === 0) return [];

  let running = 0;
  const series = days.map((date) => {
    running += perDay[date];
    return { date, stars: perDay[date], cumulative: running };
  });

  return series.slice(-windowDays);
}

/**
 * How the game that just ended sits next to the ones before it.
 *
 * Only the same level at the same difficulty is compared: a hard run has no
 * business being measured against an easy one. `played` counts the games that
 * were already recorded, which is exactly what the results screen needs, since
 * the finished game is written to the history only once the player leaves it.
 * Every field is null rather than a made up zero when there is nothing to
 * compare with.
 */
export function sessionRecap(history = [], { levelId, difficulty = "easy", score = 0 } = {}) {
  const previous = (history || []).filter(
    (entry) => entry && entry.level === levelId && entry.difficulty === difficulty
  );
  const played = previous.length;
  if (played === 0) {
    return {
      played: 0,
      lastScore: null,
      lastTotal: null,
      bestScore: null,
      bestStars: null,
      scoreDelta: null,
      isNewBest: false,
    };
  }

  const last = previous[played - 1];
  const best = Math.max(...previous.map((entry) => entry.score || 0));
  return {
    played,
    lastScore: last.score || 0,
    lastTotal: last.total || 0,
    bestScore: best,
    bestStars: Math.max(...previous.map((entry) => entry.stars || 0)),
    scoreDelta: score - (last.score || 0),
    isNewBest: score > best,
  };
}

/**
 * How often the player gets a question right in each region, from the per
 * question memory. A region with no answers yet reports a null accuracy so the
 * UI can say so instead of showing a fake zero.
 */
export function regionAccuracy(questionStats = {}, levels = LEVEL_SUMMARIES) {
  return regionAccuracyOf(questionStats, levels);
}

/** Mean accuracy over the regions that have answers, or null when there are none. */
export function averageAccuracy(questionStats = {}, levels = LEVEL_SUMMARIES) {
  return meanOf(regionAccuracy(questionStats, levels).map((region) => region.accuracy));
}
