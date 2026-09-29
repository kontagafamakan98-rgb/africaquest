/**
 * Class aggregation for the teacher page.
 *
 * Each student has their own progress record on the device; this module turns a
 * list of { id, name, progress } into the numbers a teacher needs, using exactly
 * the same rules as the player's own Stats tab. It stays free of React and of the
 * game data so it can be unit tested: the levels it works on are passed in.
 */
import { questionKey, averageMastery, answerAccuracy, meanOf } from "./game-metrics.js";
import { dueAt } from "./spaced-repetition.js";

/** How many questions of this record are waiting in the review rotation. */
function countDue(questionStats, levels, now) {
  let due = 0;
  levels.forEach((level) => {
    level.questions.forEach((_question, index) => {
      const stat = questionStats?.[questionKey(level.id, index)];
      if (stat && dueAt(stat, now) <= now) due += 1;
    });
  });
  return due;
}

/** One student's numbers, or zeros when they have not played yet. */
export function studentSummary(profile, levels = [], now = Date.now()) {
  const progress = profile?.progress || {};
  const levelScores = progress.level_scores || {};
  const questionStats = progress.question_stats || {};
  const completedIds = progress.completed_levels || [];
  const { accuracy, attempts } = answerAccuracy(questionStats, levels);
  const xp = progress.total_xp || 0;
  const stars = progress.stars_earned || 0;

  return {
    id: profile?.id ?? "",
    name: profile?.name || "",
    hasData: xp > 0 || stars > 0 || attempts > 0 || completedIds.length > 0,
    completedIds,
    levelsCompleted: levels.filter((level) => completedIds.includes(level.id)).length,
    totalLevels: levels.length,
    mastery: averageMastery(levelScores, levels),
    accuracy,
    answers: attempts,
    stars,
    xp,
    studied: (progress.studied_levels || []).length,
    dueNow: countDue(questionStats, levels, now),
    lastPlayed: progress.last_played || null,
    badges: (progress.badges || []).length,
  };
}

/**
 * Whole-class picture: per student rows, the class totals, and how far the group
 * has got in each level. Averages only cover students who have actually played,
 * otherwise one empty profile would sink the class figures.
 */
export function classSummary(profiles = [], levels = [], now = Date.now()) {
  const students = profiles.map((profile) => studentSummary(profile, levels, now));
  const played = students.filter((student) => student.hasData);
  const sum = (key) => students.reduce((total, student) => total + (student[key] || 0), 0);

  return {
    students,
    summary: {
      students: students.length,
      withData: played.length,
      averageMastery: meanOf(played.map((student) => student.mastery)) ?? 0,
      averageAccuracy: meanOf(played.map((student) => student.accuracy)),
      totalStars: sum("stars"),
      totalXp: sum("xp"),
      answers: sum("answers"),
      dueNow: sum("dueNow"),
      studied: sum("studied"),
    },
    levels: levels.map((level) => ({
      id: level.id,
      title: level.title,
      region: level.region,
      students: students.length,
      completed: students.filter((student) => student.completedIds.includes(level.id)).length,
    })),
  };
}
