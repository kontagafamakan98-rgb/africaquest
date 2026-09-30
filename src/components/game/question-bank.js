/**
 * Which questions each difficulty actually asks.
 *
 * The three difficulties used to be one quiz with a different clock: the timer
 * and the XP multiplier changed and nothing else did, so a player who chose hard
 * was asked exactly what an easy player was asked, only faster. That made the
 * choice a promise the game did not keep, and it is what this module exists for.
 *
 * A level's questions are written in teaching order: the ones that open it
 * recall the essentials, and the ones near the end ask for the details, the
 * dates and the names that come with a careful reading. So a level is split into
 * three bands by its own order, and each difficulty draws on a different one:
 *
 *   easy   the opening band, the essentials, with no clock at all;
 *   medium the opening and middle bands, the whole story at a steady pace;
 *   hard   the middle and closing bands, the details, and it never spends a
 *          question on what a hard player already knows by heart.
 *
 * The bands are a third of the level each. A difficulty that would end up with
 * too few questions tops itself up from the band next to it, so an eight
 * question level is still a fair quiz on every setting rather than a three
 * question one on easy.
 *
 * The counts below are the ones the difficulty rows announce on the picker, so
 * the choice is made with the number in front of the player rather than
 * discovered on the first question.
 */

/** The band of one question, 1 (opening) to 3 (closing), from its place alone. */
export function questionBand(index, total) {
  if (!(total > 0)) return 1;
  const band = Math.floor((index * 3) / total) + 1;
  return band < 1 ? 1 : band > 3 ? 3 : band;
}

/**
 * What each difficulty draws on: the bands it asks, the floor it never drops
 * below, and the band it tops itself up from when the level is short. Kept as a
 * table rather than written into the test so the two can never drift apart.
 */
export const DIFFICULTY_BANDS = {
  easy: { bands: [1], min: 5, fill: [2] },
  medium: { bands: [1, 2], min: 7, fill: [3] },
  hard: { bands: [2, 3], min: 5, fill: [1] },
};

/**
 * The questions a difficulty asks, in the order the level teaches them.
 *
 * Every returned question carries `__index`, its position in the level it came
 * from. It travels with the question because the review memory is keyed by that
 * position: an answer recorded against the wrong index would bring back a
 * question the player never got wrong.
 *
 * @param {Array<object>} questions the level's questions, in teaching order
 * @param {string} difficulty one of the keys of DIFFICULTY_BANDS
 * @returns {Array<object>} the questions to ask, each with its original `__index`
 */
export function selectQuestions(questions, difficulty) {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  const rule = DIFFICULTY_BANDS[difficulty] || DIFFICULTY_BANDS.easy;
  const total = questions.length;
  const chosen = new Set();

  questions.forEach((_question, index) => {
    if (rule.bands.includes(questionBand(index, total))) chosen.add(index);
  });

  // A short level, or a band that holds fewer questions than the floor, is
  // topped up from the band next to it rather than handed to the player half
  // empty. The fill bands are searched in order, so the result stays the same
  // every time the level is opened.
  for (const band of rule.fill) {
    for (let index = 0; index < total && chosen.size < rule.min; index += 1) {
      if (questionBand(index, total) === band) chosen.add(index);
    }
  }

  return [...chosen].sort((a, b) => a - b).map((index) => ({ ...questions[index], __index: index }));
}

/**
 * How many questions a difficulty asks of a level, without building the list.
 * The picker announces this before the level is opened, so it is a count of the
 * real selection rather than a second number that could disagree with it.
 */
export function questionCount(questions, difficulty) {
  return selectQuestions(questions, difficulty).length;
}
