/**
 * The chronology question: the first question of this game that is not four
 * answers to choose between.
 *
 * Every question of the game used to have the same shape, and a player who knows
 * that can pass a whole level on recognition alone: the right answer is the one
 * that looks like a fact from the lesson, and nothing has to be remembered in
 * order. A lesson, though, is a story with a before and an after, and the
 * chronology of a period is a thing a reader either holds or does not. So this
 * asks for it plainly: four dated moments of the lesson, in the wrong order, to
 * be put back in the order the lesson tells them.
 *
 * The moments are the lesson's own timeline, the one the lesson screen already
 * draws - not a second copy written here. That is the whole reason it is built
 * rather than written: a level's timeline is already written by hand, in both
 * languages, with its dates, and a question assembled from it can never
 * disagree with the lesson it comes from, costs no translation, and is repaired
 * the day the timeline is. What is checked about it - that every level has
 * enough moments to ask, that no moment is missing a date, and that a timeline
 * is written in the order it claims - lives in chronology.test.js, because a
 * timeline that is out of order would teach the reverse of the truth while every
 * screen still drew it.
 *
 * Nothing here knows what language it is in. The wording of the question belongs
 * to the translations, and this module hands over only the material: the four
 * moments in their real order, their dates, and the order they are shown in.
 */

/**
 * Where a dated moment of a timeline really sits in time, as a number, or null
 * when the label says nothing this can read.
 *
 * The chronology question trusts the order a lesson's timeline is written in,
 * which is the one thing about it no screen can check: a timeline written back
 * to front draws perfectly well and teaches the reverse of the truth. So the
 * order is checked, in the language the timeline is written in, against the
 * labels themselves - see chronology.test.js, which reads every lesson's
 * timeline in both languages with this function.
 *
 * The labels are hand written, and the two languages do not look alike: "c. 3100
 * BC" against "v. 3100 av. J.-C.", "c. 315,000 years ago" against "v. 315 000
 * ans", "c. 1.5 million years ago" against "v. 1,5 million d'années", "the
 * 1520s" against "les années 1520". What is read here is the first number and
 * what the label says about it, which is all an order needs: a date before the
 * common era counts backwards, a depth of years before now counts backwards and
 * deeper the larger it is, a decade is its first year, and a span from one date
 * to another is read at the date it opens.
 */
export function momentYear(label) {
  // Spaces go first, because the French thousands separator is one, and a
  // separator followed by exactly three digits is a thousand rather than a
  // decimal point: 315 000 is a number, 1,5 is a fraction.
  const text = String(label ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.,](\d{3})(?!\d)/g, "$1");

  // Whatever comma or dot is left is a decimal one, in whichever language: the
  // thousands separators have just been taken out, so "1,5 million" is a
  // fraction and "315 000" is not.
  const found = /(\d+(?:[.,]\d+)?)/.exec(text);
  if (!found) return null;
  const value = Number(found[1].replace(",", "."));
  if (!Number.isFinite(value)) return null;

  if (/million|milliard/.test(text)) return -value * 1e6;
  if (/ans|years|ago/.test(text)) return -value;
  if (/bc|av\.j/.test(text)) return -value;
  return value;
}

/**
 * How many moments one chronology question asks the player to put in order.
 *
 * Four, where a lesson's timeline holds five or six. All six would be a test of
 * typing rather than of memory on a phone, and two of them, the first and the
 * last, always appear: the ends of the period anchor the answer, and the middle
 * two are taken from what is left so the question is the shape of the whole
 * period rather than four neighbouring events.
 */
export const CHRONOLOGY_STEPS = 4;

/**
 * Which moments of a timeline a question is built from: the first, the last, and
 * the ones between them spread as evenly as the timeline allows.
 *
 * Read from the length alone, so the same timeline always yields the same
 * moments, and a timeline shorter than the question asks for is handed over
 * whole rather than padded.
 *
 * @param {number} total how many moments the timeline holds
 * @param {number} [count] how many the question asks for
 * @returns {number[]} the positions of the moments, in order
 */
export function spreadMoments(total, count = CHRONOLOGY_STEPS) {
  if (!(total > 0)) return [];
  const wanted = Math.min(Math.max(1, count), total);
  if (wanted === 1) return [Math.floor((total - 1) / 2)];
  const chosen = new Set();
  for (let step = 0; step < wanted; step += 1) {
    chosen.add(Math.round((step * (total - 1)) / (wanted - 1)));
  }
  return [...chosen].sort((one, other) => one - other);
}

/**
 * The order the moments are shown in: the wrong one, always.
 *
 * A question handed over in its own order would already be answered, so the
 * shuffle leaves one alone only when it came out sorted, and then rotates it.
 * The shake is a small arithmetic one seeded by its caller rather than
 * Math.random, for a reason that is not tidiness: the question is rebuilt on
 * every render, and a real shuffle would move the moments under the player's
 * hands between two keystrokes. The seed is the level's id, so the same level
 * asks the same question in both languages and on every device.
 *
 * @param {number} count how many moments there are
 * @param {number} [seed] any integer; the same seed always gives the same order
 * @returns {number[]} the positions, in the order they are shown
 */
export function shuffledOrder(count, seed = 0) {
  const order = Array.from({ length: Math.max(0, count) }, (_unused, index) => index);
  let state = (Math.imul(seed | 0, 48271) + 7919) >>> 0;
  const next = () => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return state / 4294967296;
  };

  for (let position = order.length - 1; position > 0; position -= 1) {
    const other = Math.floor(next() * (position + 1));
    [order[position], order[other]] = [order[other], order[position]];
  }

  const sorted = order.every((value, position) => value === position);
  if (sorted && order.length > 1) order.push(order.shift());
  return order;
}

/**
 * The chronology question of a level, or null when its timeline cannot carry one.
 *
 * Null is the honest answer for a lesson whose timeline is missing or too short,
 * and not an empty question: the quiz simply asks what it has, and the content
 * test is what refuses a lesson published that way rather than a player meeting
 * a screen with three moments and a fourth empty row.
 *
 * The returned question carries no `__index`, and that is deliberate. The review
 * memory is keyed by the position a question holds in the bank it was written
 * in, and this one holds none: it is assembled when the level is opened. It is
 * scored with the rest of the run, and it does not enter the rotation.
 *
 * @param {object} [study] the study pack of a level, as the lesson reads it
 * @param {number} [seed] what decides the order it is shown in; the level's id
 * @returns {{ type: "order", steps: string[], years: string[], order: number[] }|null}
 */
export function chronologyQuestion(study, seed = 0) {
  const timeline = Array.isArray(study?.timeline) ? study.timeline : [];
  if (timeline.length < CHRONOLOGY_STEPS) return null;

  const moments = spreadMoments(timeline.length, CHRONOLOGY_STEPS).map(
    (position) => timeline[position]
  );
  const readable = (value) => typeof value === "string" && value.trim().length > 0;
  if (!moments.every((moment) => moment && readable(moment.text) && readable(moment.year))) {
    return null;
  }

  return {
    type: "order",
    // The moments in the order the lesson gives them, which is the answer; the
    // dates travel beside them, to be shown once it has been given.
    steps: moments.map((moment) => moment.text.trim()),
    years: moments.map((moment) => moment.year.trim()),
    order: shuffledOrder(moments.length, seed),
  };
}

/**
 * Whether a player's arrangement is the one the lesson tells: every moment in
 * the position it really holds. One question, one point, so a nearly right
 * answer is a wrong one - the feedback says which rows are right, and the score
 * counts the question, not the rows.
 *
 * @param {number[]|null} arrangement the positions the player has arranged
 * @returns {boolean}
 */
export function isChronological(arrangement) {
  if (!Array.isArray(arrangement) || arrangement.length === 0) return false;
  return arrangement.every((value, position) => value === position);
}

/**
 * The arrangement after one moment is moved up or down by one place.
 *
 * A move off either end changes nothing rather than wrapping: a list whose first
 * item silently becomes its last is a list a player loses track of.
 *
 * @param {number[]} arrangement
 * @param {number} position which row to move
 * @param {number} by how far, and in which direction
 * @returns {number[]} the new arrangement, the old one untouched
 */
export function movedMoment(arrangement, position, by) {
  const target = position + by;
  if (!Array.isArray(arrangement) || target < 0 || target >= arrangement.length) {
    return arrangement;
  }
  const next = [...arrangement];
  [next[position], next[target]] = [next[target], next[position]];
  return next;
}
