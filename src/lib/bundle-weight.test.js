import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  BUDGETS_FILE,
  BUNDLE_ALLOWANCE,
  BUNDLE_BUDGETS,
  WEIGHTS_FILE,
  budgetOf,
  bundleName,
  compareWeights,
  groupOf,
  missingBudgets,
  overBudget,
  weightsFileBody,
} from "../../build/bundle-weight.js";
import { listBuiltFiles } from "../../build/offline-plugin.js";

// A build's weight is the one thing nobody decides on purpose: every change
// that adds a few kilobytes adds them for a reason, and the total only shows up
// in somebody's download. Two references are held against it, and this suite
// holds both ends of each: that a bundle is recognised as the same bundle from
// one build to the next, that the refusal fires on a growth that is real and on
// a bundle past the budget it is allowed, and that the budget table is one
// somebody keeps rather than one that drifts with the build.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const WEIGHTS = path.join(ROOT, WEIGHTS_FILE);
const SCRIPT = readFileSync(path.join(ROOT, "scripts", "report-weights.mjs"), "utf8");

test("a bundle is recognised from one build to the next, whatever the hash in its name", () => {
  // The bundler writes the hash of the content into the file name, so a comment
  // added to one module renames its chunk. Comparing the names as they are would
  // make every build look like a set of new files and a set of vanished ones,
  // which is noise rather than a measurement.
  assert.equal(bundleName("/assets/index-D6otARU8.js"), "/assets/index.js");
  assert.equal(bundleName("/assets/gameData-Ws8p2oa0.js"), "/assets/gameData.js");
  assert.equal(bundleName("/assets/jspdf.es.min-BLPNOTgK.js"), "/assets/jspdf.es.min.js");
  // The hash is not always letters and digits: this one carries a dash of its
  // own, and a rule that stopped at the first dash would leave it in the name.
  assert.equal(bundleName("/assets/index-B8Ys-ZrX.css"), "/assets/index.css");

  // Everything that is not named by the bundler keeps the name it was given: the
  // photographs, the icons, the manifest, the service worker, the page itself.
  assert.equal(bundleName("/photos/level-1-1-thumb.webp"), "/photos/level-1-1-thumb.webp");
  assert.equal(bundleName("/photos/level-18-2.jpg"), "/photos/level-18-2.jpg");
  assert.equal(bundleName("/index.html"), "/index.html");
  assert.equal(bundleName("/manifest.json"), "/manifest.json");
  assert.equal(bundleName("/sw.js"), "/sw.js");
  assert.equal(bundleName("/icon-maskable-512.png"), "/icon-maskable-512.png");

  // A name that merely looks like it ends in a hash is left alone: the rule is
  // about the files the bundler emits, and the bundler emits none of these.
  assert.equal(bundleName("/photos/level-1-1.jpg"), "/photos/level-1-1.jpg");
  assert.equal(bundleName("/photos/foto-8charsz.jpg"), "/photos/foto-8charsz.jpg", "outside assets, nothing is stripped");
});

test("a built file is sorted into what it is, so the report can weigh each kind apart", () => {
  assert.equal(groupOf("/assets/index-D6otARU8.js"), "bundle");
  assert.equal(groupOf("/assets/index-B8Ys-ZrX.css"), "style");
  assert.equal(groupOf("/photos/level-1-1.webp"), "photo");
  assert.equal(groupOf("/index.html"), "shell");
  assert.equal(groupOf("/sw.js"), "shell");
  assert.equal(groupOf("/icon-192.png"), "shell");
});

test("only a file that grew past the allowance is refused, and it is named with both sizes", () => {
  const recorded = { "/assets/index.js": 100_000, "/photos/a.jpg": 200_000, "/assets/old.js": 5_000 };

  // Exactly at the allowance passes: the rule is a tenth, not a per cent, and a
  // boundary that refused its own value would fail on rounding.
  const atTheEdge = compareWeights(recorded, { "/assets/index.js": 110_000, "/photos/a.jpg": 200_000 });
  assert.deepEqual(atTheEdge.growth, [], "a tenth heavier is allowed");

  // One byte past it does not, and what comes back is everything a reader needs
  // to judge it: both sizes, and by how much.
  const past = compareWeights(recorded, { "/assets/index.js": 110_001, "/photos/a.jpg": Math.round(200_000 * 0.5) });
  assert.equal(past.growth.length, 1);
  assert.deepEqual(past.growth[0], {
    file: "/assets/index.js",
    size: 110_001,
    was: 100_000,
    ratio: 110_001 / 100_000,
  });

  // Shrinking and vanishing are the direction this exists to encourage, and a
  // new file has no recorded weight to have grown past: none of them is refused.
  assert.equal(past.growth.some((entry) => entry.file === "/photos/a.jpg"), false, "a lighter file is not a growth");
  assert.deepEqual(past.gone, [{ file: "/assets/old.js", was: 5_000 }], "a chunk that is no longer built is reported");
  assert.deepEqual(compareWeights(recorded, { ...recorded, "/assets/new.js": 900_000 }).added, [
    { file: "/assets/new.js", size: 900_000 },
  ]);

  // The worst growth is the first one read: what has to be explained is the file
  // that grew the most, proportionally, not the heaviest one.
  const several = compareWeights(
    { "/a.js": 1000, "/b.js": 1000, "/c.js": 1000 },
    { "/a.js": 1200, "/b.js": 1900, "/c.js": 3000 }
  );
  assert.deepEqual(
    several.growth.map((entry) => entry.file),
    ["/c.js", "/b.js", "/a.js"]
  );
  assert.equal(BUNDLE_ALLOWANCE, 1.1, "the allowance is the tenth the report says it is");
});

test("a bundle is held to the budget declared for it, and a bundle nobody declared is named", () => {
  // A budget is not the weight of the day: it is what this bundle is allowed to
  // cost, written down once. A bundle that grew until it touched its own budget
  // is a bundle somebody decided about, and one that cleared it is the change
  // worth stopping.
  const budgets = { "/assets/index.js": 200 * 1024, "/assets/LessonScreen.js": 10 * 1024 };
  assert.equal(budgetOf("/assets/index.js", budgets), 200 * 1024);
  assert.equal(
    budgetOf("/assets/index-abc12345.js", budgets),
    200 * 1024,
    "the hash the bundler writes is not a different bundle"
  );
  // Nothing rather than a number borrowed from another line: a bundle without a
  // line of its own has not been judged, and answering with somebody else's
  // budget is what makes the missing line invisible.
  assert.equal(
    budgetOf("/assets/Bibliography.js", budgets),
    undefined,
    "a bundle nobody wrote down is not given a number anyway"
  );

  // Exactly its budget is within it: the rule is what a bundle is allowed, and
  // a boundary that refused its own value would fail on rounding.
  assert.deepEqual(overBudget({ "/assets/index.js": 200 * 1024 }, budgets), []);

  const over = overBudget(
    {
      "/assets/index.js": Math.round(200 * 1024 * 1.1),
      "/assets/LessonScreen.js": 1000,
      "/assets/Bibliography.js": 900 * 1024,
    },
    budgets
  );

  // Both numbers come back, so the report says by how much rather than only
  // that it happened.
  assert.deepEqual(over, [
    { file: "/assets/index.js", size: Math.round(200 * 1024 * 1.1), budget: 200 * 1024, ratio: 1.1 },
  ]);
  // And the bundle with no line is not weighed here at all, however heavy it is:
  // its own gate names it once, and being told twice would only bury the one
  // thing the reader has to do about it.
  assert.equal(
    over.some((entry) => entry.file === "/assets/Bibliography.js"),
    false,
    "a bundle with no budget is left to the list that names it"
  );

  // That list is what the third rule is about, and it carries the weight each
  // one already has, since that is where the decision starts from.
  const missing = missingBudgets(
    { "/assets/index.js": 200 * 1024, "/assets/Bibliography.js": 4 * 1024, "/assets/NewScreen.js": 40 * 1024 },
    budgets
  );
  assert.deepEqual(missing, [
    { file: "/assets/NewScreen.js", size: 40 * 1024 },
    { file: "/assets/Bibliography.js", size: 4 * 1024 },
  ]);
  assert.deepEqual(missingBudgets({ "/assets/index.js": 200 * 1024 }, budgets), [], "a complete table has nothing to add");
});

test("the budget table holds every bundle the build has, and nothing that is gone", () => {
  // The table is the one thing here nobody's tooling can write: a number is a
  // decision. What can be checked is that it is still about this application.
  // A line kept for a chunk the bundler no longer writes, a budget below what
  // the build already weighs, and a bundle the build writes that has no line are
  // the three ways a hand written table rots, and the third is the one the
  // report refuses as well: this is the half that reads the build on record, so
  // a chunk that arrived and was left out fails here too, before anybody records
  // it as the pass to compare against.
  const recorded = JSON.parse(readFileSync(WEIGHTS, "utf8"));
  const bundles = Object.keys(recorded).filter((file) => groupOf(file) === "bundle" || groupOf(file) === "style");
  assert.ok(bundles.length > 10, `only ${bundles.length} bundles are recorded`);

  for (const file of bundles) {
    const allowed = budgetOf(file);
    // A bundle the build writes has to have a line, and the platform it ships on
    // is the recorded pass: a chunk that arrived and was not written down is the
    // failure the report refuses on the next run.
    assert.ok(
      allowed !== undefined,
      `${file} is built and has no budget of its own: add a line for it to ${BUDGETS_FILE}`
    );
    // A budget below the recorded weight would fail the verification on the
    // build that was just recorded, which is a table nobody could keep.
    assert.ok(
      allowed >= recorded[file],
      `${file} weighs ${recorded[file]} and is allowed ${allowed}: the build on record is over its budget`
    );
  }

  for (const [file, allowed] of Object.entries(BUNDLE_BUDGETS)) {
    assert.ok(
      bundles.includes(file),
      `${file} has a budget of its own and is not built: the line describes a chunk that is gone`
    );
    assert.ok(
      Number.isInteger(allowed) && allowed % 1024 === 0,
      `${file} is allowed ${allowed} bytes, which is not a round number of kilobytes`
    );
    assert.ok(allowed > 0, `${file} is allowed nothing`);
  }

  // Every table is one somebody keeps or it is a list: the two ends are held
  // together here rather than by whoever remembers, since a build that writes a
  // bundle this table does not mention is refused on the next run.
  const built = new Set(bundles);
  const written = new Set(Object.keys(BUNDLE_BUDGETS));
  assert.deepEqual(
    bundles.filter((file) => !written.has(file)),
    [],
    "a bundle the build writes and the table does not mention"
  );
  assert.deepEqual(
    [...written].filter((file) => !built.has(file)),
    [],
    "a line in the table for a chunk the build no longer writes"
  );

  // The entry file is the one file no other file can be fetched in parallel
  // with, so it is not handed the loosest number in the table, and it is held
  // within the 400 kB bundle-split.test.js refuses as well.
  assert.ok(
    BUNDLE_BUDGETS["/assets/index.js"] < Math.max(...Object.values(BUNDLE_BUDGETS)),
    "the entry file is held to a budget of its own rather than the loosest one"
  );
  assert.ok(
    BUNDLE_BUDGETS["/assets/index.js"] <= 400 * 1024,
    "and within the limit the split of the bundles is held to"
  );

  // A failure sends the reader to the line that has to change, so the line has
  // to be where it says it is.
  assert.ok(existsSync(path.join(ROOT, BUDGETS_FILE)), `${BUDGETS_FILE} is where a failure points`);
  assert.match(readFileSync(path.join(ROOT, BUDGETS_FILE), "utf8"), /BUNDLE_BUDGETS/);
});

test("the recorded pass is written the same way every time, whatever order the build walked in", () => {
  // Sorted and free of anything that changes on its own: recording the same
  // build twice has to hand back the same bytes, or every build shows up as a
  // rewrite of the whole file and a real change is lost in it.
  const one = weightsFileBody({ "/b.js": 2, "/a.js": 1 });
  assert.equal(one, weightsFileBody({ "/a.js": 1, "/b.js": 2 }), "the order of the keys does not matter");
  assert.equal(one, '{\n  "/a.js": 1,\n  "/b.js": 2\n}\n');
  assert.match(one, /\n$/, "the file ends in a newline like every other one in the repository");
  assert.doesNotMatch(one, /\d{4}-\d{2}-\d{2}/, "no date, which would change on every recording");
});

test("the recorded pass covers the build, under names a rebuild cannot change", (t) => {
  assert.ok(existsSync(WEIGHTS), `run npm run weights:record to write ${WEIGHTS_FILE}`);
  const recorded = JSON.parse(readFileSync(WEIGHTS, "utf8"));
  assert.ok(Object.keys(recorded).length > 100, `only ${Object.keys(recorded).length} files are recorded`);

  for (const [file, size] of Object.entries(recorded)) {
    assert.ok(Number.isInteger(size) && size > 0, `${file} is recorded as ${size}`);
    assert.match(file, /^\//, `${file} is not the served path of a built file`);
    assert.doesNotMatch(
      file,
      /\/assets\/[^/]+-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/,
      `${file} still carries the hash the bundler writes: a rebuild would rename it and the comparison would miss`
    );
  }

  // The entry bundle has to be in there: it is the file every reader downloads
  // before anything else, and the one this gate exists for.
  assert.ok(recorded["/assets/index.js"] > 0, "the entry bundle is recorded");

  // The same names, taken from the build on disk when there is one. This is what
  // would notice a bundler that changed how it writes a hash: the name would
  // keep it, and the gate would compare two names that never meet again.
  const dist = path.join(ROOT, "dist");
  if (!existsSync(path.join(dist, "index.html"))) {
    t.diagnostic("no dist: run npm run build to have the names of a real build read back too");
    return;
  }
  const built = listBuiltFiles(dist);
  assert.ok(built.length > 100, `only ${built.length} files in dist`);
  for (const file of built) {
    const name = bundleName(file);
    assert.doesNotMatch(
      name,
      /\/assets\/[^/]+-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/,
      `${file} is recorded as ${name}, which a rebuild would change`
    );
    assert.ok(recorded[name] > 0, `${file} is built but no pass is recorded under ${name}`);
  }
});

test("weighing is a command the verification runs last, on the build it just made", () => {
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts.weights, /report-weights\.mjs/, "package.json registers the weighing");
  assert.match(scripts["weights:record"], /report-weights\.mjs --record/, "and the command that writes the pass down");
  assert.match(scripts.verify, /verify\.mjs/, "the verification is still the one command that runs everything");

  // It weighs dist, so it runs after the build rather than beside it. A report
  // on a build from a previous run would describe nothing anybody is shipping.
  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.match(verify, /report-weights\.mjs/, "npm run verify weighs the build");
  const build = verify.indexOf('id: "build"');
  const weights = verify.indexOf('id: "weights"');
  assert.ok(build > 0 && weights > 0, "both steps are registered");
  assert.ok(weights > build, "the weighing comes after the build it reads");
});

test("the weighing reads the build and the recorded pass, and refuses rather than records", () => {
  assert.match(SCRIPT, /listBuiltFiles/, "the files are read from the build rather than listed by hand");
  assert.match(SCRIPT, /bundle-weight\.js/, "the names and the comparison come from the module these tests read");
  assert.match(SCRIPT, /WEIGHTS_FILE/, "and so does the name of the pass it compares with");
  assert.match(SCRIPT, /gzipSync/, "what a reader waits for is reported beside the weight on disk");
  assert.match(SCRIPT, /process\.exit\(1\)/, "a file past the allowance stops the run");
  assert.match(SCRIPT, /more than a tenth heavier/, "with what it weighs now and what it weighed then");

  // And the budget, which is the other reason a build is refused. Each bundle's
  // own number is printed beside its weight rather than kept for the day it is
  // exceeded, since a budget nobody reads is one nobody keeps.
  assert.match(SCRIPT, /overBudget\(/, "the bundles are weighed against the budgets");
  assert.match(SCRIPT, /budgetOf\(entry\.file\)/, "and each one is reported with its own budget beside it");
  assert.match(SCRIPT, /heavier than the budget/, "a bundle past its budget is refused");
  assert.match(SCRIPT, /BUDGETS_FILE/, "and the failure points at the line that has to change");

  // And a bundle nobody wrote a line for, which is the third thing refused. It
  // is not printed against a borrowed ceiling: the report says on the line that
  // the bundle has no budget, and the failure asks for one.
  assert.match(SCRIPT, /missingBudgets\(/, "the table is held to the bundles the build writes");
  assert.match(SCRIPT, /no budget of its own/, "a bundle with no line is refused as well");
  assert.match(SCRIPT, /no budget`/, "and its line in the report says so rather than borrowing a number");

  // No gate exits on its own: a build that fails several is told about all of
  // them, because the fixes often meet in the same bundle and a run that stopped
  // at the first would send the reader round twice.
  const growth = SCRIPT.indexOf("if (growth.length > 0) {");
  const budgets = SCRIPT.indexOf("if (over.length > 0) {");
  const missing = SCRIPT.indexOf("if (missing.length > 0) {");
  const decision = SCRIPT.indexOf("if (refused.length > 0) {");
  assert.ok(
    growth > 0 && budgets > growth && missing > budgets && decision > missing,
    "the four blocks are in order"
  );
  assert.doesNotMatch(
    SCRIPT.slice(growth, decision),
    /process\.exit/,
    "the refusals are collected before anything stops the run"
  );

  // Recording is only ever the other command's job: a threshold that moves
  // itself on every run is not a threshold.
  assert.match(SCRIPT, /--record/, "recording is asked for rather than done");
  assert.equal(
    [...SCRIPT.matchAll(/writeFileSync\(/g)].length,
    1,
    "the pass is written in exactly one place"
  );
  assert.ok(
    SCRIPT.indexOf("writeFileSync(WEIGHTS") > SCRIPT.indexOf("if (record) {"),
    "and that place is the branch that was asked for with --record"
  );
});
