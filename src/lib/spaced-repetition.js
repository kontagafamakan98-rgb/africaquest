/**
 * Spaced repetition schedule for the mistake review.
 *
 * A question the player misses comes back quickly, then, every time it is
 * answered correctly, it moves one step further away. The intervals follow a
 * Leitner ladder: minutes, then days, until the answer is solid enough to be
 * asked only once every two months. Nothing here touches the network: the
 * schedule is just two numbers stored next to each question in local progress.
 */
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

/** Delay before a question is asked again, indexed by the stage it reached. */
export const REVIEW_INTERVALS_MS = [10 * MINUTE, DAY, 3 * DAY, 7 * DAY, 21 * DAY, 60 * DAY];

/** Highest stage a question can reach; it then stays on the 60 day interval. */
export const MAX_REVIEW_STAGE = REVIEW_INTERVALS_MS.length - 1;

/** Delay that applies once a question has reached the given stage. */
export function intervalForStage(stage) {
  const safe = Math.min(Math.max(stage, 0), MAX_REVIEW_STAGE);
  return REVIEW_INTERVALS_MS[safe];
}

/**
 * Stage recorded for a question. Answers saved before spaced repetition existed
 * only carry right/wrong counters, so their stage is inferred: a question missed
 * at least as often as it was answered right starts over from the first rung,
 * any other one resumes mid-ladder instead of being pushed back on the player.
 */
export function reviewStage(stat) {
  if (!stat) return 0;
  if (typeof stat.stage === "number") {
    return Math.min(Math.max(Math.floor(stat.stage), 0), MAX_REVIEW_STAGE);
  }
  if ((stat.wrong || 0) === 0) return 0;
  return (stat.wrong || 0) >= (stat.right || 0) ? 0 : 2;
}

/**
 * When a question is due again, in epoch milliseconds. `Infinity` means it is
 * not part of the review rotation at all, either because it was never missed or
 * because it is already scheduled in the future.
 */
export function dueAt(stat, now = Date.now()) {
  if (!stat) return Infinity;
  if (typeof stat.dueAt === "number") return stat.dueAt;
  // Saved before this feature: a question never missed has nothing to review.
  if ((stat.wrong || 0) === 0) return Infinity;
  const stage = reviewStage(stat);
  // Stage 0 means it was missed recently, so it is due right away. Otherwise the
  // legacy answer already earned its interval.
  return stage === 0 ? now : now + intervalForStage(stage);
}

/** True when the review session should ask this question back now. */
export function isDue(stat, now = Date.now()) {
  return dueAt(stat, now) <= now;
}

/**
 * Scheduling fields to merge after an answer. A miss sends the question back to
 * the shortest interval; a correct answer climbs one rung. Questions the player
 * has never missed stay out of the rotation entirely.
 */
export function scheduleAfterAnswer(previous, correct, now = Date.now()) {
  const prev = previous || { right: 0, wrong: 0 };
  if ((prev.wrong || 0) === 0 && correct) {
    return { stage: 0, dueAt: undefined, lastSeen: now };
  }
  if (!correct) {
    return { stage: 0, dueAt: now + intervalForStage(0), lastSeen: now };
  }
  const stage = Math.min(reviewStage(prev) + 1, MAX_REVIEW_STAGE);
  return { stage, dueAt: now + intervalForStage(stage), lastSeen: now };
}
