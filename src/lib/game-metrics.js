/**
 * Pure maths shared by the player's screens and the teacher's class overview.
 *
 * Nothing here imports game data, React or the DOM: every function takes the
 * levels it should work on, which keeps the metrics unit testable and lets the
 * teacher page aggregate several profiles with the same rules as the Stats tab.
 */

/** A stable key for one question inside one level: "3:7" = level 3, question 7. */
export function questionKey(levelId, index) {
  return `${levelId}:${index}`;
}

/** Best score across difficulties for a level, as a percentage. */
/**
 * How many questions a level holds.
 *
 * A level is either the brief the map reads, which carries the count, or one
 * built from the full content, which carries the questions themselves. Both are
 * read here, so the same metrics work on the screen that draws the map - which
 * must not download two hundred questions for a percentage - and on the ones
 * that really need the wording.
 */
export function questionCountOf(level) {
  return level?.questionCount ?? level?.questions?.length ?? 0;
}

export function levelMastery(level, levelScores) {
  const scores = levelScores?.[String(level.id)];
  if (!scores) return 0;
  const best = Math.max(
    0,
    ...Object.values(scores).map((d) => (d && typeof d.score === "number" ? d.score : 0))
  );
  const total = questionCountOf(level) || 1;
  return Math.round((best / total) * 100);
}

/**
 * Mastery across a set of levels, as a percentage. Untouched levels count as 0,
 * so the number only grows when the player really knows the material.
 */
export function averageMastery(levelScores, levels) {
  if (!levels || levels.length === 0) return 0;
  const sum = levels.reduce((total, level) => total + levelMastery(level, levelScores), 0);
  return Math.round(sum / levels.length);
}

/** Right answers and attempts over a set of levels, from the per-question memory. */
export function answerAccuracy(questionStats, levels) {
  let right = 0;
  let attempts = 0;
  (levels || []).forEach((level) => {
    for (let index = 0; index < questionCountOf(level); index += 1) {
      const stat = questionStats?.[questionKey(level.id, index)];
      if (!stat) continue;
      right += stat.right || 0;
      attempts += (stat.right || 0) + (stat.wrong || 0);
    }
  });
  return {
    right,
    attempts,
    accuracy: attempts > 0 ? Math.round((right / attempts) * 100) : null,
  };
}

/**
 * Accuracy per region. A region with no answers yet reports a null accuracy so
 * the caller can say so instead of showing a fake zero.
 */
export function regionAccuracy(questionStats, levels) {
  const regions = [];
  (levels || []).forEach((level) => {
    if (!regions.includes(level.region)) regions.push(level.region);
  });

  return regions.map((region) => ({
    region,
    ...answerAccuracy(questionStats, levels.filter((level) => level.region === region)),
  }));
}

/** Mean of the values that actually exist, rounded, or null when there is none. */
export function meanOf(values) {
  const known = (values || []).filter((value) => typeof value === "number" && Number.isFinite(value));
  if (known.length === 0) return null;
  return Math.round(known.reduce((sum, value) => sum + value, 0) / known.length);
}
