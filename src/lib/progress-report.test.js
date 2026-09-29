import test from "node:test";
import assert from "node:assert/strict";
import { buildProgressReport, formatDuration, levelLines } from "./progress-report.js";
import { reportFileName } from "./report-pdf.js";

const t = {
  appTitle: "Quête Historique Africaine",
  reportTitle: "Récapitulatif de progression",
  reportGeneratedOn: "Généré le",
  reportFor: "Élève",
  reportSummary: "Résumé",
  reportLevels: "Résultat par niveau",
  reportRegions: "Exactitude par région",
  reportFooter: "Données locales.",
  notStarted: "Non commencé",
  bestScore: "Meilleur score",
  levelComplete: "Terminé",
  noAnswersYet: "aucune donnée",
  badgesEarned: "Badges obtenus",
  totalXp: "XP totaux",
  stars: "Étoiles",
  levels: "Niveaux",
  dayStreak: "Série de jours",
  timePlayed: "Temps de jeu",
  averageMastery: "Maîtrise moyenne",
  accuracy: "Exactitude",
  questionsToReview: "Questions à réviser",
  minutesShort: " min",
  secondsShort: " s",
  hoursShort: " h",
};

const levels = [
  { id: 1, title: "Égypte antique", region: "Afrique du Nord", questions: [{}, {}, {}, {}] },
  { id: 2, title: "Royaume de Kouch", region: "Afrique du Nord-Est", questions: [{}, {}] },
];

const progress = {
  total_xp: 240,
  stars_earned: 3,
  streak_days: 2,
  total_time_seconds: 3725,
  completed_levels: [1],
  badges: ["first_step", "rising_star"],
  level_scores: { 1: { easy: { score: 3, stars: 2 } } },
  question_stats: {
    "1:0": { right: 3, wrong: 1 },
    "1:1": { right: 0, wrong: 1 },
    "2:0": { right: 1, wrong: 0 },
  },
};

test("playtime is worded like the Stats screen", () => {
  assert.equal(formatDuration(0, t), "0 min");
  assert.equal(formatDuration(90, t), "1 min 30 s");
  assert.equal(formatDuration(3725, t), "1 h 2 min");
});

test("levels that were never played are listed as not started", () => {
  const lines = levelLines(progress, levels, t);
  assert.equal(lines[0].status, "Meilleur score: 3/4");
  assert.equal(lines[0].stars, "2/3");
  assert.equal(lines[0].mastery, "75%");
  assert.equal(lines[1].status, "Non commencé");
  assert.equal(lines[1].stars, "0/3");
  assert.equal(lines[1].mastery, "0%");
});

test("the summary reads the stored progress, not invented numbers", () => {
  const report = buildProgressReport({ progress, levels, t, student: "Awa", date: new Date("2026-09-27T10:00:00Z") });
  const value = (label) => report.summary.find((row) => row.label === label)?.value;

  assert.equal(report.title, "Récapitulatif de progression");
  assert.equal(report.generatedOn, "Généré le 2026-09-27");
  assert.equal(report.student, "Awa");
  assert.equal(value("XP totaux"), "240");
  assert.equal(value("Étoiles"), "3");
  assert.equal(value("Niveaux"), "1 / 2");
  assert.equal(value("Série de jours"), "2");
  assert.equal(value("Temps de jeu"), "1 h 2 min");
  assert.equal(value("Maîtrise moyenne"), "38%"); // 75% et 0% sur deux niveaux
  assert.equal(value("Exactitude"), "67%"); // 4 bonnes réponses sur 6
  assert.equal(value("Questions à réviser"), "1"); // une seule erreur, et elle est due
  assert.equal(value("Badges obtenus"), "2");
});

test("a region with no answer says so instead of showing zero", () => {
  const report = buildProgressReport({
    progress: { question_stats: { "1:0": { right: 1, wrong: 0 } } },
    levels,
    t,
  });
  assert.deepEqual(report.regions, [
    { region: "Afrique du Nord", accuracy: "100%" },
    { region: "Afrique du Nord-Est", accuracy: "aucune donnée" },
  ]);
});

test("a profile with no progress still produces a usable report", () => {
  const report = buildProgressReport({ progress: null, levels, t });
  const value = (label) => report.summary.find((row) => row.label === label)?.value;
  assert.equal(value("XP totaux"), "0");
  assert.equal(value("Exactitude"), "aucune donnée");
  assert.equal(value("Questions à réviser"), "0");
  assert.equal(report.levels.length, 2);
});

test("the file name is readable and safe for any system", () => {
  assert.equal(
    reportFileName({ student: "Awa N'Diaye" }, new Date("2026-09-27T10:00:00Z")),
    "recapitulatif-awa-n-diaye-2026-09-27.pdf"
  );
  assert.equal(reportFileName({}, new Date("2026-09-27T10:00:00Z")), "recapitulatif-2026-09-27.pdf");
});
