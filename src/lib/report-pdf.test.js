import test from "node:test";
import assert from "node:assert/strict";
import { buildReportPdf, reportFileName } from "./report-pdf.js";
import { buildProgressReport } from "./progress-report.js";

// The PDF a teacher or a parent is handed.
//
// Nothing else in this project looks at a drawing: the screens are checked by
// reading the source, and a page that came out wrong is found by the person who
// opened it. A PDF is worse than that, because the section nobody expects - what
// failed on the device - is exactly the one that would print "undefined" rather
// than empty. So the drawing is built here, in the test runner, and the document
// itself is read: the same code that hands the file to the browser, with the
// saving left out.
//
// jsPDF is loaded by the module on demand, which is why importing it here costs
// what a report costs and nothing on the screens that never export one.

const t = {
  appTitle: "Quête Historique Africaine",
  reportTitle: "Récapitulatif de progression",
  reportGeneratedOn: "Généré le",
  reportFor: "Élève",
  reportSummary: "Résumé",
  reportLevels: "Résultat par niveau",
  reportRegions: "Exactitude par région",
  reportErrors: "Ce qui a échoué sur cet appareil",
  reportErrorsNote: "Gardé en mémoire sur cet appareil, envoyé nulle part.",
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
  { id: 1, title: "Égypte antique", region: "Afrique du Nord", questions: [{}, {}] },
  { id: 2, title: "Royaume de Kouch", region: "Afrique du Nord-Est", questions: [{}] },
];

const progress = { total_xp: 40, stars_earned: 2, completed_levels: [1], question_stats: { "1:0": { right: 1, wrong: 0 } } };

const failure = (index) => ({
  at: `2026-09-29T20:${String(10 + index).padStart(2, "0")}:00.000Z`,
  name: "TypeError",
  message: `messagesizeprobe${index}`,
  where: "LevelGallery",
  count: index === 0 ? 3 : 1,
});

/** The document as the bytes a browser would receive, decoded as text. */
async function pdfText(report) {
  const doc = await buildReportPdf(report);
  return Buffer.from(doc.output("datauristring").split(",")[1], "base64").toString("latin1");
}

test("the report draws what failed, with the place and the repeats", async () => {
  const report = buildProgressReport({
    progress,
    levels,
    t,
    failures: [failure(0), failure(1)],
  });
  const pdf = await pdfText(report);

  // The title and the note are drawn, not merely present in the data: a section
  // that the drawing forgot is a section the reader never sees.
  assert.ok(pdf.includes("chou"), "the section title is not drawn");
  assert.ok(pdf.includes("Gard"), "the note saying where the list comes from is not drawn");
  assert.ok(pdf.includes("TypeError"), "the failure itself is not drawn");
  assert.ok(pdf.includes("messagesizeprobe0"), "the first failure is missing");
  assert.ok(pdf.includes("messagesizeprobe1"), "the second failure is missing");
  assert.ok(pdf.includes("LevelGallery"), "the screen a failure came from is missing");
  assert.ok(pdf.includes("×3"), "a failure that happened three times is not shown as one");
  assert.match(pdf, /^%PDF-/, "what is handed over is not a PDF at all");
});

test("a report drawn from a device where nothing failed says so, and stays short", async () => {
  const report = buildProgressReport({ progress, levels, t });
  const pdf = await pdfText(report);

  assert.ok(pdf.includes("chou"), "the section is missing altogether");
  assert.ok(pdf.includes("Rien n'a"), "a report with no failure does not say so");
  assert.equal(pdf.includes("TypeError"), false);
});

test("every failure the log can hold is drawn, across as many pages as it takes", async () => {
  // The log holds twelve failures at most, and the section comes last: a long
  // list runs into the bottom of the page, where a drawing that forgets to break
  // the page simply stops. Every one of them has to be findable in the document.
  const failures = Array.from({ length: 12 }, (_unused, index) => failure(index));
  const report = buildProgressReport({ progress, levels, t, failures });
  const doc = await buildReportPdf(report);
  const pdf = Buffer.from(doc.output("datauristring").split(",")[1], "base64").toString("latin1");

  assert.ok(doc.internal.getNumberOfPages() >= 1);
  for (let index = 0; index < failures.length; index += 1) {
    assert.ok(pdf.includes(`messagesizeprobe${index}`), `failure ${index} was dropped`);
  }

  // And a message longer than the page is wrapped rather than run off the edge:
  // the words of it are all in the document, on more than one line.
  const long = Array.from({ length: 20 }, (_unused, index) => `mot${index}`).join(" ");
  const wrapped = buildProgressReport({
    progress,
    levels,
    t,
    failures: [{ ...failure(0), message: long }],
  });
  const wrappedPdf = await pdfText(wrapped);
  assert.ok(wrappedPdf.includes("mot0") && wrappedPdf.includes("mot19"), "a long message lost its end");
  // And the end of it is on another line rather than past the right edge: the two
  // ends of the message never share one run of drawn text.
  assert.equal(
    /\([^)]*mot0[^)]*mot19/.test(wrappedPdf),
    false,
    "a message longer than the page was drawn in one line, off the edge"
  );
});

test("the file name still names the student and the day", () => {
  assert.equal(
    reportFileName({ student: "Awa" }, new Date("2026-09-29T10:00:00Z")),
    "recapitulatif-awa-2026-09-29.pdf"
  );
});
