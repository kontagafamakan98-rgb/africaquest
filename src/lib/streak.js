/**
 * Day streak rules.
 *
 * Everything here works on the player's own calendar, never on UTC: playing a
 * level at 00:30 local time has to count as a new day, otherwise anyone living
 * east of Greenwich sees the streak stall for hours after midnight. The date is
 * kept as a plain "YYYY-MM-DD" string, which is what gets stored in progress.
 */

/**
 * Local calendar day of a date, as "YYYY-MM-DD".
 *
 * @param {Date|number|string} [date] A date, or what `new Date()` reads: the
 *   modules that reason in milliseconds pass `Date.now()`, and the body has
 *   always accepted both.
 * @returns {string}
 */
export function localDay(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * The local calendar day just before `date`, month and year boundaries included.
 *
 * @param {Date|number|string} [date] A date, or what `new Date()` reads.
 * @returns {string}
 */
export function previousLocalDay(date = new Date()) {
  const d = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  d.setDate(d.getDate() - 1);
  return localDay(d);
}

/**
 * Streak to store once a level is finished:
 * - very first play: 1, so the streak shows something from day one
 * - another play the same day: unchanged, and never lowered to 0
 * - a play on the day after the last one: one more day
 * - any longer gap: the streak starts over at 1
 *
 * @param {number} streakDays The streak stored with the last play.
 * @param {string} lastPlayed The local day of that play, as "YYYY-MM-DD".
 * @param {Date|number|string} [now] The day this play counts as.
 * @returns {{ streakDays: number, lastPlayed: string }}
 */
export function streakAfterPlay(streakDays, lastPlayed, now = new Date()) {
  const today = localDay(now);
  const current = Number.isFinite(streakDays) ? Math.max(0, Math.floor(streakDays)) : 0;

  if (lastPlayed === today) return { streakDays: Math.max(current, 1), lastPlayed: today };
  if (lastPlayed === previousLocalDay(now)) return { streakDays: current + 1, lastPlayed: today };
  return { streakDays: 1, lastPlayed: today };
}
