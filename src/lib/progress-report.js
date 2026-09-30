/**
 * The progress report shown to a parent or a teacher.
 *
 * The document is described here as plain data (labels and values), and drawn to
 * PDF elsewhere, so the wording and the numbers can be unit tested without a
 * browser. Everything reads from the player's own stored progress.
 */
import { answerAccuracy, averageMastery, regionAccuracy } from "./game-metrics.js";
import { localDay } from "./streak.js";
import { dueAt } from "./spaced-repetition.js";

/** Playtime as "1 h 05 min", the same wording as the Stats screen. */
export function formatDuration(seconds, t) {
  const total = Math.max(0, Math.round(seconds || 0));
  if (total === 0) return `0${t.minutesShort}`;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}${t.hoursShort} ${minutes}${t.minutesShort}`;
  if (minutes > 0) return `${minutes}${t.minutesShort} ${secs}${t.secondsShort}`;
  return `${secs}${t.secondsShort}`;
}

/** How many questions of this record are waiting in the review rotation. */
function countDue(questionStats, levels, now) {
  let due = 0;
  levels.forEach((level) => {
    level.questions.forEach((_question, index) => {
      const stat = questionStats?.[`${level.id}:${index}`];
      if (stat && dueAt(stat, now) <= now) due += 1;
    });
  });
  return due;
}

/**
 * One line per level: the best score reached, its stars, and whether the level
 * was ever finished. Levels not played yet are listed too, so the reader sees
 * what is left rather than only what is done.
 */
export function levelLines(progress, levels, t) {
  const levelScores = progress?.level_scores || {};
  const completed = progress?.completed_levels || [];

  return levels.map((level) => {
    const scores = Object.values(levelScores[String(level.id)] || {});
    const best = scores.reduce(
      (top, entry) => Math.max(top, typeof entry?.score === "number" ? entry.score : 0),
      0
    );
    const stars = scores.reduce((top, entry) => Math.max(top, entry?.stars || 0), 0);
    const total = level.questions.length || 1;
    const isCompleted = completed.includes(level.id);

    let status = t.notStarted;
    if (best > 0) status = `${t.bestScore}: ${best}/${total}`;
    else if (isCompleted) status = t.levelComplete;

    return {
      title: level.title,
      region: level.region,
      status,
      stars: `${stars}/3`,
      mastery: `${Math.round((best / total) * 100)}%`,
    };
  });
}

/** A moment as the day and the hour a person reads it in, never as a timestamp. */
function momentOf(at) {
  const date = at instanceof Date ? at : new Date(typeof at === "string" && at !== "" ? at : Number.NaN);
  if (Number.isNaN(date.getTime())) return "";
  const two = (value) => String(value).padStart(2, "0");
  return `${localDay(date)} ${two(date.getHours())}:${two(date.getMinutes())}`;
}

/**
 * The failures the application logged, as lines a report can carry.
 *
 * The place is a word rather than a code: what a failure was doing is the part a
 * reader needs. The three the application reports from itself are written down as
 * translation keys (see FAILURE_PLACES in src/lib/error-log.js), and any other
 * place is the name of the screen that broke, which is code and reads the same in
 * every language, so it stays as it is.
 *
 * A failure that happened more than once says so rather than being printed as
 * many times: what the reader has to see is that it keeps happening.
 */
function failureLines(failures, t) {
  return (failures || []).map((entry) => {
    const where = entry?.where || "";
    return {
      when: momentOf(entry?.at),
      what: `${entry?.name || "Error"}: ${entry?.message || ""}`,
      where: t[where] || where,
      times: (entry?.count || 1) > 1 ? `×${entry.count}` : "",
    };
  });
}

/**
 * Everything the report needs, already worded: a summary, the per level table,
 * the accuracy per region, and what failed on the device while it was being
 * prepared. `t` is the active translation object.
 *
 * The failures are passed in rather than read here, so what the report says is
 * what the caller handed over - the log itself lives in src/lib/error-log.js and
 * is bounded there.
 */
export function buildProgressReport({ progress, levels, t, student = "", date = new Date(), failures = [] }) {
  const questionStats = progress?.question_stats || {};
  const levelScores = progress?.level_scores || {};
  const levelsCompleted = (progress?.completed_levels || []).length;
  const regions = regionAccuracy(questionStats, levels);
  // Exactitude pooled over every answer, the same number the teacher space shows.
  const { accuracy } = answerAccuracy(questionStats, levels);

  return {
    appTitle: t.appTitle,
    title: t.reportTitle,
    generatedOn: `${t.reportGeneratedOn} ${localDay(date)}`,
    studentLabel: t.reportFor,
    student,
    summaryTitle: t.reportSummary,
    summary: [
      { label: t.totalXp, value: String(progress?.total_xp || 0) },
      { label: t.stars, value: String(progress?.stars_earned || 0) },
      { label: t.levels, value: `${levelsCompleted} / ${levels.length}` },
      { label: t.dayStreak, value: String(progress?.streak_days || 0) },
      { label: t.timePlayed, value: formatDuration(progress?.total_time_seconds || 0, t) },
      { label: t.averageMastery, value: `${averageMastery(levelScores, levels)}%` },
      { label: t.accuracy, value: accuracy === null ? t.noAnswersYet : `${accuracy}%` },
      { label: t.questionsToReview, value: String(countDue(questionStats, levels, date.getTime())) },
      { label: t.badgesEarned, value: String((progress?.badges || []).length) },
    ],
    levelsTitle: t.reportLevels,
    levels: levelLines(progress, levels, t),
    regionsTitle: t.reportRegions,
    regions: regions.map((region) => ({
      region: region.region,
      accuracy: region.accuracy === null ? t.noAnswersYet : `${region.accuracy}%`,
    })),
    // What failed on this device, which is the part of the report a teacher
    // cannot reconstruct afterwards: a crash is reloaded away, and a browser that
    // refuses to save says nothing once it is closed.
    failuresTitle: t.reportErrors,
    failuresNote: t.reportErrorsNote,
    failures: failureLines(failures, t),
    noFailures: t.reportNoErrors,
    footer: t.reportFooter,
  };
}
