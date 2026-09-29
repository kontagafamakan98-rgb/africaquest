/**
 * The weight of the built application, bundle by bundle: what it weighs, the
 * share of its budget that is, and what grew.
 *
 *   node scripts/report-weights.mjs            # reports, and fails on growth or budget
 *   node scripts/report-weights.mjs --record   # records this build as the pass to compare against
 *
 * The build is the one thing in this project whose size is nobody's decision:
 * every change that adds a few kilobytes adds them for a good reason, and the
 * total only shows up in somebody's download. Two references are held against
 * it, and they refuse different things.
 *
 * The weights of the last build are kept in build/bundle-weights.json, and a
 * file more than a tenth heavier than it was stops the verification, with the
 * two sizes and the ratio in front of whoever has to explain it. That catches
 * the change somebody made this morning.
 *
 * The budgets are in build/bundle-weight.js, one per bundle, and a bundle
 * heavier than its own stops the verification too. That catches what the
 * comparison with the last pass cannot: a bundle that grew a tenth at a time,
 * every time under the allowance that pass allowed, which after a year is twice
 * what it was.
 *
 * That table has to be complete, which is the third thing refused here: a bundle
 * the build writes and nobody has written a line for stops the run as well, and
 * the failure names the file to add. A chunk that arrives is a decision somebody
 * has to make, and a ceiling standing in for the missing line would let it pass
 * as though the decision had already been taken.
 *
 * The comparison is by name and not by file, because the bundler writes the hash
 * of the content into the file name: a comment added to one module renames its
 * chunk. build/bundle-weight.js takes that hash out, so the recorded name is the
 * name of a bundle rather than of one build of it.
 *
 * Recording is a separate command rather than something this script does on its
 * way past: a threshold that moves itself is not a threshold. Growing a bundle
 * on purpose is normal, and accepting the growth is then one deliberate command,
 * which leaves a line in a diff that somebody reads. A budget is not recorded by
 * that command and never moves on its own: it is one line, edited by hand, by
 * somebody who decided this bundle earned the weight.
 *
 * Run it after the build, which is where the verification puts it: it weighs
 * `dist`, and a build that has not happened has nothing to weigh.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import {
  BUDGETS_FILE,
  BUNDLE_ALLOWANCE,
  WEIGHTS_FILE,
  budgetOf,
  bundleName,
  compareWeights,
  groupOf,
  missingBudgets,
  overBudget,
  weightsFileBody,
} from "../build/bundle-weight.js";
import { listBuiltFiles } from "../build/offline-plugin.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const WEIGHTS = path.join(ROOT, WEIGHTS_FILE);
const record = process.argv.includes("--record");

if (!existsSync(path.join(DIST, "index.html"))) {
  console.error("weights: dist has not been built. Run npm run build first, or npm run verify, which builds it.");
  process.exit(1);
}

/** A weight in kilobytes, as a number, so two of them can share one field. */
const inKilobytes = (bytes) => (bytes / 1024).toFixed(1);
/** A weight, in the unit a reader can hold in their head. */
const kilobytes = (bytes) => `${inKilobytes(bytes)} KB`;
/**
 * What a bundle weighs against what it is allowed, on the line that reports it.
 *
 * Both numbers rather than the one: a share alone needs a legend to be read, and
 * 82% says nothing about whether that is 100 KB or 400. Written this way the
 * budget is in front of the reader on every build, which is the only reason
 * anybody would think about it before the day it is exceeded.
 *
 * A bundle with no budget of its own says so on its own line rather than being
 * printed against a number nobody wrote: the line above is the first place the
 * reader meets it, and it should be the truth about how much was decided.
 */
const againstBudget = (size, budget) =>
  budget === undefined
    ? `${inKilobytes(size)} KB, no budget`
    : `${inKilobytes(size)}/${inKilobytes(budget)} KB`;
/** The same, for something heavy enough that a megabyte says it better. */
const weigh = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : kilobytes(bytes));
/** How much a file changed, as a percentage, signed the way the change went. */
const change = (ratio) => `${ratio >= 1 ? "+" : ""}${((ratio - 1) * 100).toFixed(1)}%`;
/**
 * The share of its budget a bundle is using, rounded to the whole per cent.
 *
 * One number, on the same line as the weight, and the reason it is there rather
 * than only in the failure is that a budget nobody can see is a budget nobody
 * keeps: 85% is a bundle with one change left in it, and the reader is the
 * person who has to make that call.
 */
const share = (size, budget) => `${Math.round((size / budget) * 100)}%`;

// Every file the build wrote, under the name it is recorded by. Two files
// cannot share a recorded name: the two would be weighed as one, and the
// heavier of them would be the only one anybody ever saw.
const current = {};
const kinds = { bundle: [], style: [], photo: [], shell: [] };
for (const file of listBuiltFiles(DIST)) {
  const name = bundleName(file);
  if (name in current) {
    console.error(`weights: ${file} and another built file would both be recorded as ${name}.`);
    process.exit(1);
  }
  const size = statSync(path.join(DIST, file.replace(/^\//, ""))).size;
  current[name] = size;
  // The recorded name and the file on disk are kept apart: the first is compared
  // with the last pass, the second is what is opened to measure what it costs to
  // transfer, and a de-hashed name is not a file that exists.
  kinds[groupOf(file)].push({ file: name, disk: file, size });
}

// The pass this build is compared with. A missing or unreadable one is not a
// reason to report nothing: the weights are printed either way, so the command
// is useful on the day it is first run.
let recorded = null;
if (existsSync(WEIGHTS)) {
  try {
    recorded = JSON.parse(readFileSync(WEIGHTS, "utf8"));
  } catch {
    recorded = null;
  }
}

// What a browser downloads as one unit per page is weighed line by line, with
// the compressed size beside it, since that is what a reader on a slow
// connection really waits for; the gate stays on the file's own weight.
const bundles = [...kinds.bundle, ...kinds.style].sort((one, other) => other.size - one.size);
const compressed = (entry) => {
  const disk = path.join(DIST, entry.disk.replace(/^\//, ""));
  return existsSync(disk) ? gzipSync(readFileSync(disk)).length : 0;
};

const distBytes = Object.values(current).reduce((total, size) => total + size, 0);
const bundleBytes = bundles.reduce((total, entry) => total + entry.size, 0);
const transferBytes = bundles.reduce((total, entry) => total + compressed(entry), 0);

console.log(
  `weights${record ? " (record)" : ""}: ${Object.keys(current).length} files, ` +
    `${(distBytes / 1024 / 1024).toFixed(2)} MB in dist, ` +
    `of which ${bundles.length} bundles of the application: ${kilobytes(bundleBytes)} on disk, ` +
    `${kilobytes(transferBytes)} compressed`
);

const vsRecorded = (file) => {
  if (!recorded) return "";
  const was = recorded[file];
  return `  ${was === undefined || was === 0 ? "new" : change(current[file] / was)}`;
};

for (const entry of bundles) {
  console.log(
    `  ${entry.file.padEnd(34)} ${againstBudget(entry.size, budgetOf(entry.file)).padStart(17)}` +
      `  gzip ${kilobytes(compressed(entry)).padStart(9)}${vsRecorded(entry.file)}`
  );
}
for (const [kind, label] of [
  ["photo", "photographs"],
  ["shell", "shell files"],
]) {
  const files = kinds[kind];
  if (files.length === 0) continue;
  const heaviest = files.reduce((worst, entry) => (entry.size > worst.size ? entry : worst));
  const bytes = files.reduce((total, entry) => total + entry.size, 0);
  console.log(
    `  ${`${files.length} ${label}`.padEnd(34)} ${weigh(bytes).padStart(9)}  ` +
      `heaviest ${path.basename(heaviest.file)} ${kilobytes(heaviest.size)}`
  );
}

// Recording comes first because it is the one thing a build cannot fail on: a
// bundle that grew on purpose is recorded by running this, and the comparison
// below is what the next build is held to.
if (record) {
  const body = weightsFileBody(current);
  if (recorded && readFileSync(WEIGHTS, "utf8") === body) {
    console.log(`weights: ${WEIGHTS_FILE} already records this build, file for file`);
    process.exit(0);
  }
  writeFileSync(WEIGHTS, body);
  console.log(`weights: ${WEIGHTS_FILE} records ${Object.keys(current).length} files from this build`);
  process.exit(0);
}

if (!recorded) {
  console.error(
    `weights: there is no recorded pass to compare this build with.\n` +
      `Run npm run weights:record, which writes down what this build weighs in ${WEIGHTS_FILE}.`
  );
  process.exit(1);
}

const { growth, added, gone } = compareWeights(recorded, current);

for (const entry of added.slice(0, 5)) {
  console.log(`  ${entry.file} is new since the recorded pass (${kilobytes(entry.size)})`);
}
if (added.length > 5) console.log(`  and ${added.length - 5} more files are new since the recorded pass`);
for (const entry of gone.slice(0, 5)) {
  console.log(`  ${entry.file} is no longer built (it weighed ${kilobytes(entry.was)})`);
}

// The three gates, and what each one refuses. A growth is a change since the
// pass before; a budget is a decision that outlives it; a bundle with no line at
// all is a decision nobody made. A build is told about all of them in one run
// rather than about whichever was measured first, since the fixes often meet in
// the same bundle.
//
// Only the bundles of the application are weighed against a budget: the
// photographs and the shell have budgets of their own, held by tests of their
// own, per picture and for the gallery as a whole.
const sized = Object.fromEntries(bundles.map((entry) => [entry.file, entry.size]));
const over = overBudget(sized);
const missing = missingBudgets(sized);
const refused = [];

if (growth.length > 0) {
  refused.push(
    [
      `weights: ${growth.length} ${growth.length === 1 ? "file is" : "files are"} more than a tenth heavier than ` +
        "at the last recorded pass:",
      ...growth
        .slice(0, 8)
        .map((entry) => `  ${entry.file} ${kilobytes(entry.size)} against ${kilobytes(entry.was)} (${change(entry.ratio)})`),
      ...(growth.length > 8 ? [`  and ${growth.length - 8} more`] : []),
      "Run npm run weights:record to record this build as the one to compare against,",
      "or bring the weight back down.",
    ].join("\n")
  );
}

if (over.length > 0) {
  refused.push(
    [
      `weights: ${over.length} ${over.length === 1 ? "bundle is" : "bundles are"} heavier than the budget ` +
        "allowed for it:",
      ...over
        .slice(0, 8)
        .map(
          (entry) =>
            `  ${entry.file} ${kilobytes(entry.size)} against the ${kilobytes(entry.budget)} allowed ` +
            `(${share(entry.size, entry.budget)} of it)`
        ),
      ...(over.length > 8 ? [`  and ${over.length - 8} more`] : []),
      `A budget is a decision and not a measurement: raise the line for that bundle in ${BUDGETS_FILE}`,
      "if it earned the weight, or bring it back under what it is allowed.",
    ].join("\n")
  );
}

if (missing.length > 0) {
  refused.push(
    [
      `weights: ${missing.length} ${missing.length === 1 ? "bundle has no budget of its own" : "bundles have no budget of their own"}:`,
      ...missing
        .slice(0, 8)
        .map((entry) => `  ${entry.file} ${kilobytes(entry.size)}`),
      ...(missing.length > 8 ? [`  and ${missing.length - 8} more`] : []),
      `A bundle that appears without one is a bundle nobody decided about, and a ceiling borrowed from`,
      `another line would let it pass as though somebody had. Add a line for it in ${BUDGETS_FILE},`,
      "at a number that leaves it room to grow into: what that number is, is a judgement to make.",
    ].join("\n")
  );
}

if (refused.length > 0) {
  console.error(refused.join("\n\n"));
  process.exit(1);
}

console.log(
  `  every file is within the ${Math.round((BUNDLE_ALLOWANCE - 1) * 100)}% the last recorded pass allows`
);
console.log("  and every bundle has a budget of its own, and is within it");
