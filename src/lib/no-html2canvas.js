/**
 * The stand-in for html2canvas, the package this app never draws with.
 *
 * jsPDF's own html() path imports html2canvas the moment it runs, and Rollup has
 * to resolve that import when it cuts the bundle, which is why the package had to
 * stay a dependency even though nothing here ever called html(). This app writes
 * its PDFs by hand - src/lib/report-pdf.js lays the export out and never hands
 * jsPDF a piece of the page to render - so the alias in vite.config.js points
 * that import here instead: a module of a few hundred bytes rather than the two
 * hundred kilobytes a reader would otherwise be shipped for a path nobody takes,
 * and a manifest that no longer claims a library nothing loads.
 *
 * The function throws rather than returning nothing quietly, so that if html()
 * were ever called it would name the reason on the spot instead of failing
 * somewhere further along: this is where that path would find out it is not one
 * this app takes.
 */
export default function html2canvas() {
  throw new Error("This app draws its PDFs directly and never calls jsPDF's html().");
}
