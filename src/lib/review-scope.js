/**
 * The scope of a review session.
 *
 * The review inbox holds every question still in the rotation, which on a long
 * game is a list nobody can act on as a whole. Narrowing a session is what turns
 * it into work: one level at a time, one region at a time, or the handful of
 * questions the player keeps getting wrong.
 *
 * The queue carries everything the scopes need, so this module stays free of
 * React and of the game data and the rules are covered by unit tests.
 */

/** The ways a session can be narrowed, in the order the interface offers them. */
export const REVIEW_SCOPES = ["all", "level", "region", "mistakes"];

/**
 * How many times a question must have been missed to count as a recurring
 * mistake. Once is an accident, twice is a pattern, and a session built on
 * accidents would be the whole queue again under another name.
 */
export const MISTAKE_THRESHOLD = 2;

/**
 * One way of narrowing the session, as the interface builds and keeps it.
 *
 * `id` and `region` belong to the kind that carries them, and `title` is what the
 * screen prints on the rule it has selected - the scope is held by a screen for
 * as long as the player keeps narrowing, so it says what it shows rather than
 * making the screen look the name up again on every render.
 *
 * @typedef {{ kind: "all" | "level" | "region" | "mistakes", id?: number, region?: string, title?: string }} ReviewScope
 */

/** The scope a player starts on: the whole rotation, in the queue's own order. */
export const ALL_SCOPE = /** @type {ReviewScope} */ ({ kind: "all" });

/**
 * One queue item as a scope argument. Unknown kinds fall back to the whole queue.
 *
 * @param {number} id
 * @returns {ReviewScope}
 */
export function scopeOfLevel(id) {
  return { kind: "level", id };
}

/**
 * @param {string} region
 * @returns {ReviewScope}
 */
export function scopeOfRegion(region) {
  return { kind: "region", region };
}

export const MISTAKES_SCOPE = /** @type {ReviewScope} */ ({ kind: "mistakes" });

/**
 * Stable identity of a scope, so a screen can tell when the player changed it
 * without comparing object references that are rebuilt on every render.
 */
export function scopeKey(scope) {
  const kind = scope?.kind || "all";
  if (kind === "level") return `level:${scope.id}`;
  if (kind === "region") return `region:${scope.region}`;
  return kind;
}

/**
 * What each scope holds, so the interface can show a count beside each name
 * instead of offering a scope that turns out to be empty.
 *
 * Levels and regions keep the order they first appear in the queue, which is
 * already the order the schedule ranks them in: the most overdue level first.
 */
export function reviewScopeSummary(queue = [], { mistakeThreshold = MISTAKE_THRESHOLD } = {}) {
  const levels = new Map();
  const regions = new Map();
  let mistakes = 0;

  queue.forEach((item) => {
    if (!item) return;

    if (item.levelId !== undefined && item.levelId !== null) {
      const row = levels.get(item.levelId) || { id: item.levelId, title: item.levelTitle || "", count: 0 };
      row.count += 1;
      levels.set(item.levelId, row);
    }

    if (item.region) {
      const row = regions.get(item.region) || { region: item.region, count: 0 };
      row.count += 1;
      regions.set(item.region, row);
    }

    if ((item.wrong || 0) >= mistakeThreshold) mistakes += 1;
  });

  return {
    total: queue.length,
    levels: [...levels.values()],
    regions: [...regions.values()],
    mistakes,
  };
}

/**
 * The questions one scope holds, drawn from the queue as it was handed in.
 *
 * The frequent mistakes are ranked by how often they were missed rather than by
 * how overdue they are: the point of that scope is which question keeps coming
 * back wrong, so the worst one opens the session. The other scopes keep the
 * queue's order, which already puts the most overdue first.
 */
export function questionsInScope(
  queue = [],
  scope = ALL_SCOPE,
  { mistakeThreshold = MISTAKE_THRESHOLD } = {}
) {
  const kind = scope?.kind || "all";

  if (kind === "level") {
    return queue.filter((item) => item?.levelId === scope.id);
  }

  if (kind === "region") {
    return queue.filter((item) => item?.region === scope.region);
  }

  if (kind === "mistakes") {
    return queue
      .filter((item) => (item?.wrong || 0) >= mistakeThreshold)
      .sort(
        (a, b) =>
          (b.wrong || 0) - (a.wrong || 0) ||
          a.due - b.due ||
          a.levelId - b.levelId ||
          a.index - b.index
      );
  }

  return [...queue];
}
