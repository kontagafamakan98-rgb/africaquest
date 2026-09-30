import test from "node:test";
import assert from "node:assert/strict";
import { FAILURE_PLACES } from "./error-log.js";
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
  reportErrors: "Ce qui a échoué sur cet appareil",
  reportErrorsNote: "Gardé en mémoire, envoyé nulle part.",
  reportNoErrors: "Rien n'a échoué.",
  failurePlaceSave: "pendant l'enregistrement de la progression",
  failurePlaceWindow: "une erreur que personne n'a attrapée",
  failurePlacePromise: "une promesse qui a échoué",
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

test("the report carries what failed on the device, and says so when nothing did", () => {
  const failures = [
    {
      at: "2026-09-29T20:15:00.000Z",
      name: "TypeError",
      message: "Cannot read properties of undefined (reading 'gallery')",
      where: "LevelGallery",
      count: 1,
    },
    {
      at: "2026-09-29T20:16:00.000Z",
      name: "QuotaExceededError",
      message: "The quota has been exceeded.",
      // Exactly what the store writes into the log, so the report is held to the
      // value that really arrives rather than to a tidier one invented here.
      where: FAILURE_PLACES.save,
      count: 3,
    },
  ];

  const report = buildProgressReport({ progress, levels, t, failures });
  assert.equal(report.failuresTitle, "Ce qui a échoué sur cet appareil");
  assert.equal(report.failures.length, 2);
  assert.equal(report.failures[0].what, "TypeError: Cannot read properties of undefined (reading 'gallery')");
  assert.equal(report.failures[0].where, "LevelGallery", "a screen keeps its own name");
  assert.equal(report.failures[0].times, "", "a failure that happened once says nothing about repeats");
  // The three places the application reports from itself are codes here and
  // words in the report, because they are the only part of an entry that is
  // wording rather than code.
  assert.equal(report.failures[1].where, "pendant l'enregistrement de la progression");
  assert.equal(report.failures[1].times, "×3");
  // A moment is a day and an hour a person reads, never a timestamp, and it is
  // the reader's own time rather than the server's.
  assert.match(report.failures[0].when, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.equal(report.failuresNote, "Gardé en mémoire, envoyé nulle part.");

  // A report made on a device where nothing failed says that, rather than
  // leaving a reader to wonder whether the section is missing.
  const clean = buildProgressReport({ progress, levels, t });
  assert.deepEqual(clean.failures, []);
  assert.equal(clean.noFailures, "Rien n'a échoué.");
  // And an entry that came back from a hand-edited place does not break it.
  const odd = buildProgressReport({ progress, levels, t, failures: [{ where: "nowhere" }, null] });
  assert.equal(odd.failures.length, 2);
  assert.equal(odd.failures[0].where, "nowhere");
  assert.equal(odd.failures[1].what, "Error: ");
  assert.equal(odd.failures[1].when, "");
});

test("the file name is readable and safe for any system", () => {
  assert.equal(
    reportFileName({ student: "Awa N'Diaye" }, new Date("2026-09-27T10:00:00Z")),
    "recapitulatif-awa-n-diaye-2026-09-27.pdf"
  );
  assert.equal(reportFileName({}, new Date("2026-09-27T10:00:00Z")), "recapitulatif-2026-09-27.pdf");
});
