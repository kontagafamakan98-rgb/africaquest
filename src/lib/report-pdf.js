/**
 * PDF rendering of the progress report.
 *
 * jsPDF is imported here and loaded on demand by the caller, so the library only
 * reaches a player's browser when they actually ask for a PDF: the game itself
 * stays lean.
 */
const MARGIN = 48;
const LINE = 15;

const INK = [31, 26, 21];
const ACCENT = [138, 66, 24];
const MUTED = [110, 100, 90];

/** A tidy file name: the app, the student and the day, without odd characters. */
export function reportFileName(report, date = new Date()) {
  const slug = (text) =>
    String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
  const day = date.toISOString().split("T")[0];
  return ["recapitulatif", slug(report.student), day].filter(Boolean).join("-") + ".pdf";
}

/** Draws the report and hands the file to the browser. */
export async function exportProgressReportPdf(report, date = new Date()) {
  const doc = await buildReportPdf(report);
  doc.save(reportFileName(report, date));
}

/**
 * The report as a document, with nothing handed to the browser yet.
 *
 * The drawing and the saving are kept apart so that the layout can be read by a
 * test without a browser, which is the only way to check a section of a PDF: the
 * failures are the one part of this report nobody can see coming, and a page of
 * "undefined" would only be found by the teacher who opened it.
 */
export async function buildReportPdf(report) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  let y = MARGIN;

  const text = (value, x, size, style = "normal", color = INK) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(value), x, y);
  };

  // Header
  text(report.appTitle, MARGIN, 18, "bold", ACCENT);
  y += 22;
  text(report.title, MARGIN, 14, "bold");
  y += 18;
  text(report.generatedOn, MARGIN, 10, "normal", MUTED);
  y += LINE;
  if (report.student) {
    text(`${report.studentLabel}: ${report.student}`, MARGIN, 11, "bold");
  } else {
    y -= LINE;
  }
  y += 10;
  doc.setDrawColor(210, 200, 190);
  doc.line(MARGIN, y, right, y);
  y += 24;

  // Summary: two columns of label and value, a compact block easy to read.
  text(report.summaryTitle, MARGIN, 12, "bold");
  y += 18;
  const columnWidth = (right - MARGIN) / 2;
  report.summary.forEach((entry, index) => {
    const column = index % 2;
    if (column === 0 && index > 0) y += LINE + 2;
    const x = MARGIN + column * columnWidth;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(String(entry.label), x, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(String(entry.value), x + columnWidth - 16, y, { align: "right" });
  });
  y += LINE + 12;
  doc.line(MARGIN, y, right, y);
  y += 24;

  // Result per level
  text(report.levelsTitle, MARGIN, 12, "bold");
  y += 18;
  report.levels.forEach((level) => {
    if (y > doc.internal.pageSize.getHeight() - MARGIN - 40) {
      doc.addPage();
      y = MARGIN;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(String(level.title), MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(String(level.region), MARGIN, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(String(level.status), right, y, { align: "right" });
    doc.text(`${level.stars}   ${level.mastery}`, right, y + 11, { align: "right" });
    y += 30;
  });

  // Accuracy per region
  y += 4;
  if (y > doc.internal.pageSize.getHeight() - MARGIN - 60) {
    doc.addPage();
    y = MARGIN;
  }
  doc.line(MARGIN, y, right, y);
  y += 24;
  text(report.regionsTitle, MARGIN, 12, "bold");
  y += 18;
  report.regions.forEach((region) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(String(region.region), MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(String(region.accuracy), right, y, { align: "right" });
    y += LINE + 2;
  });

  // What failed on the device, which is the one section of this report about the
  // application rather than about the student. It is what a teacher sends on when
  // something did not work, and it is short: the log holds a dozen failures at
  // most (src/lib/error-log.js), and each of them is a line here.
  y += 6;
  if (y > doc.internal.pageSize.getHeight() - MARGIN - 60) {
    doc.addPage();
    y = MARGIN;
  }
  doc.line(MARGIN, y, right, y);
  y += 24;
  text(report.failuresTitle, MARGIN, 12, "bold");
  y += 18;

  const muted = (lines, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(lines, MARGIN, y);
  };

  if (report.failures.length === 0) {
    muted(String(report.noFailures));
    y += LINE;
  } else {
    report.failures.forEach((failure) => {
      if (y > doc.internal.pageSize.getHeight() - MARGIN - 50) {
        doc.addPage();
        y = MARGIN;
      }
      // A message is capped at a couple of hundred characters but the page is
      // narrower than that, so it is wrapped rather than run off the edge.
      const what = doc.splitTextToSize(String(failure.what), right - MARGIN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(INK[0], INK[1], INK[2]);
      doc.text(what, MARGIN, y);
      y += what.length * 12;
      muted([failure.when, failure.where, failure.times].filter(Boolean).join("   ·   "));
      y += LINE + 5;
    });
  }

  // Where the list comes from, and where it does not go: the reader of a report
  // is entitled to know that what is above was kept on the device and sent
  // nowhere, because that is also why it may be incomplete.
  y += 2;
  muted(doc.splitTextToSize(String(report.failuresNote), right - MARGIN), 8);
  y += LINE;

  // Footer on every page, counted with the public method rather than with the one
  // under `internal`: both exist and both work, and only this one is part of the
  // interface jsPDF declares - which is the difference between reading the
  // library and reaching behind it. The test reads the count back from a
  // document this module really drew, so the two can never drift apart quietly.
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(String(report.footer), MARGIN, doc.internal.pageSize.getHeight() - 28);
    doc.text(`${page} / ${pages}`, right, doc.internal.pageSize.getHeight() - 28, { align: "right" });
  }

  return doc;
}
