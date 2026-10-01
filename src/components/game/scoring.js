/**
 * What a run is worth: the stars it earns and the experience behind them.
 *
 * It sits outside gameData.js for the same reason the badges and the
 * difficulties do: that file carries the whole content of the game - the
 * questions, their facts and their references - and the quiz has to be able to
 * score a finished run without downloading the questions of twenty-six levels to do
 * it. Re-exported from gameData.js so the screens that already read them there
 * keep working.
 */

/** How many stars a score is worth, out of three. */
export function calculateStars(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

/** The experience a run earns, before the difficulty multiplier. */
export function getXPForScore(score, total) {
  const base = score * 20;
  const bonus = score === total ? 50 : 0;
  return base + bonus;
}
