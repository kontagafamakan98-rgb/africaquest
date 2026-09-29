/**
 * Knowledge map: what the player knows, what is still fragile, and what they
 * have not discovered yet.
 *
 * The three buckets come from the spaced repetition schedule, which already
 * records how far each question has travelled: a question answered correctly
 * several times at growing intervals is solid, one that is due again (or was
 * only seen once) is fragile, and one never answered is undiscovered. Nothing
 * is estimated or randomised here, and the module stays free of React so the
 * rules are covered by unit tests.
 */
import { questionKey } from "./game-metrics.js";
import { dueAt, reviewStage } from "./spaced-repetition.js";

/** Stage from which a question counts as solid: it survives a week or more. */
export const SOLID_STAGE = 3;

/** Which of the three buckets one question belongs to. */
export function classifyQuestion(stat, now = Date.now()) {
  if (!stat) return "undiscovered";
  const right = stat.right || 0;
  const wrong = stat.wrong || 0;
  if (right === 0 && wrong === 0) return "undiscovered";

  // The schedule wants it back: whatever the counters say, it is not solid yet.
  if (dueAt(stat, now) <= now) return "fragile";

  if (reviewStage(stat) >= SOLID_STAGE) return "known";
  // Never missed, but only seen once or twice: discovered, not confirmed.
  if (wrong === 0 && right >= 2) return "known";
  return "fragile";
}

/**
 * The fragile questions of one level, ready to run as a review session. Each
 * item carries its position in the level, which is the key its answers are
 * written under: losing it would file an answer under the wrong question. The
 * most overdue come first so the session opens on what is really slipping,
 * then the rest in the order of the lesson.
 */
export function fragileQuestionsOf(level, questionStats = {}, now = Date.now()) {
  if (!level || !Array.isArray(level.questions)) return [];

  return level.questions
    .map((question, index) => {
      const stat = questionStats[questionKey(level.id, index)];
      return { levelId: level.id, index, question, stat, due: dueAt(stat, now) };
    })
    .filter((item) => classifyQuestion(item.stat, now) === "fragile")
    .sort((a, b) => a.due - b.due || a.index - b.index)
    .map(({ levelId, index, question }) => ({ levelId, index, question }));
}

/** Counts per bucket, plus the level and region that need work first. */
export function knowledgeMap(questionStats = {}, levels = [], now = Date.now()) {
  let known = 0;
  let fragile = 0;
  let undiscovered = 0;

  const byLevel = levels.map((level) => {
    const counts = { known: 0, fragile: 0, undiscovered: 0 };
    level.questions.forEach((_question, index) => {
      const bucket = classifyQuestion(questionStats[questionKey(level.id, index)], now);
      counts[bucket] += 1;
    });
    known += counts.known;
    fragile += counts.fragile;
    undiscovered += counts.undiscovered;

    return {
      id: level.id,
      title: level.title,
      region: level.region,
      total: level.questions.length,
      ...counts,
      knownPercent: level.questions.length
        ? Math.round((counts.known / level.questions.length) * 100)
        : 0,
    };
  });

  const regions = [];
  levels.forEach((level) => {
    if (!regions.includes(level.region)) regions.push(level.region);
  });

  const byRegion = regions.map((region) => {
    const levelsOfRegion = byLevel.filter((row) => row.region === region);
    return {
      region,
      known: levelsOfRegion.reduce((sum, row) => sum + row.known, 0),
      fragile: levelsOfRegion.reduce((sum, row) => sum + row.fragile, 0),
      undiscovered: levelsOfRegion.reduce((sum, row) => sum + row.undiscovered, 0),
    };
  });

  // The region holding the most fragile questions is where to work first.
  const priority = byRegion.reduce(
    (worst, row) => (row.fragile > (worst?.fragile || 0) ? row : worst),
    null
  );

  return {
    total: known + fragile + undiscovered,
    known,
    fragile,
    undiscovered,
    knownPercent: known + fragile + undiscovered
      ? Math.round((known / (known + fragile + undiscovered)) * 100)
      : 0,
    byLevel,
    byRegion,
    priorityRegion: priority && priority.fragile > 0 ? priority : null,
    fragileLevel: byLevel.reduce(
      (worst, row) => (row.fragile > (worst?.fragile || 0) ? row : worst),
      null
    ),
  };
}
