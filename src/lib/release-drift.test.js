import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  APP_ENTRY,
  DRIFT_ISSUE_TITLE,
  appModules,
  apkNameFor,
  candidatePaths,
  closeComment,
  driftOf,
  importedFrom,
  issueBody,
  issueDecision,
  resolvedPath,
  shippingChanges,
  shipsInTheApp,
} from "./release-drift.js";
import { versionFromTag } from "../../scripts/android-version.mjs";

// Whether the Android app people can download is older than the site.
//
// The site goes out on every push to main; the APK only when a version tag is
// pushed, because it is signed, versioned and attached to a release. Nothing
// said so before this. What is checked here is the decision and not the request,
// since fetching the comparison is the script's job: which modules the build
// really carries, what the three states of the repository mean, and where the
// check is wired in.
//
// The rule is only as good as it is quiet: a check that fires on a commit nobody
// installs is a check people learn to ignore, and that is what the walk below is
// here to prevent. The second test walks this very repository, so a change that
// put a script-only module or a test file back into the count would fail here.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

/** The text of every file under a directory here, keyed as the repository writes it. */
function sourcesUnder(dir) {
  const sources = {};
  for (const entry of readdirSync(path.join(ROOT, dir), { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const full = path.join(entry.parentPath ?? entry.path, entry.name);
    sources[path.relative(ROOT, full).replace(/\\/g, "/")] = readFileSync(full, "utf8");
  }
  return sources;
}

// A small application of the shape this one has, with the imports it really
// writes: the `@` alias, a specifier with no extension, a dynamic import, and a
// stylesheet importing another.
const SOURCES = {
  "src/main.jsx": "import App from '@/App.jsx';\nimport '@/index.css';\n",
  "src/App.jsx":
    "import { pagesConfig } from './pages.config';\nimport Home from './pages/Home.jsx';\nimport { helper } from '@/lib/helper';\n",
  "src/pages.config.js": "export const pagesConfig = {};\n",
  "src/pages/Home.jsx": 'const Quiz = () => import("./QuizPage");\n',
  "src/pages/QuizPage.js": "import { helper } from '../lib/helper';\nexport default 1;\n",
  "src/lib/helper.js": "export const helper = 1;\n",
  "src/index.css": '@import "./tokens.css";\n',
  "src/tokens.css": ":root { --x: 1; }\n",
  // Both are under src/ and neither is reached from the entry: the first is a
  // module only a build script imports, the second a test beside the code.
  "src/lib/tool.js": "export const tool = 1;\n",
  "src/lib/tool.test.js": "import { tool } from './tool.js';\n",
};

test("a module is part of the build only when the application really reaches it", () => {
  // A specifier is read in each shape the application writes, and a specifier
  // built from a variable is not followed since the build cannot follow it
  // either.
  assert.deepEqual(importedFrom("import x from './a.js';\n"), ["./a.js"]);
  assert.deepEqual(importedFrom("import './side.css';\n"), ["./side.css"]);
  assert.deepEqual(importedFrom('export { a } from "./b.js";\n'), ["./b.js"]);
  assert.deepEqual(importedFrom('const c = await import("./c.js");\n'), ["./c.js"]);
  assert.deepEqual(importedFrom('@import "./d.css";\n'), ["./d.css"]);
  assert.deepEqual(importedFrom("const e = await import(name);\n"), [], "a variable is not a path");

  // The alias and the relative forms resolve as Vite resolves them; a package
  // does not resolve to a file of this repository at all.
  assert.equal(resolvedPath("@/lib/offline.js", "src/main.jsx"), "src/lib/offline.js");
  assert.equal(resolvedPath("./pages/Home.jsx", "src/App.jsx"), "src/pages/Home.jsx");
  assert.equal(resolvedPath("../lib/helper", "src/pages/QuizPage.js"), "src/lib/helper");
  assert.equal(resolvedPath("react", "src/App.jsx"), null, "a package is not a file here");
  assert.equal(resolvedPath("node:fs", "src/lib/x.js"), null);

  // An extension is honoured when there is one, and a specifier without one is
  // tried against the extensions this project uses, with the index last.
  assert.deepEqual(candidatePaths("src/App.jsx"), ["src/App.jsx"]);
  assert.equal(candidatePaths("src/lib/helper")[0], "src/lib/helper.js");
  assert.deepEqual(candidatePaths("src/components/")[0], "src/components/index.js");

  // And the walk: the entry and what it reaches, and nothing beside it.
  const reached = appModules({ sources: SOURCES });
  for (const file of [
    APP_ENTRY,
    "src/App.jsx",
    "src/index.css",
    "src/tokens.css",
    "src/pages.config.js",
    "src/pages/Home.jsx",
    "src/pages/QuizPage.js",
    "src/lib/helper.js",
  ]) {
    assert.ok(reached.has(file), `${file} is reached from the entry`);
  }
  assert.equal(reached.size, 8, "only the reachable files are part of the build");
  assert.ok(!reached.has("src/lib/tool.js"), "a module only a script imports does not ship");
  assert.ok(!reached.has("src/lib/tool.test.js"), "a test file does not ship");
  assert.deepEqual([...appModules({ sources: {} })], [], "no sources is no build");
  assert.deepEqual([...appModules()], [], "and no entry is nothing reached either");
});

test("a file ships only as part of the application or of the wrapper it installs", () => {
  const appFiles = appModules({ sources: SOURCES });

  // What the application reaches: its screens, its styles, its helpers.
  for (const file of ["src/App.jsx", "src/pages/Home.jsx", "src/lib/helper.js", "src/index.css"]) {
    assert.equal(shipsInTheApp(file, appFiles), true, `${file} ships in the app`);
  }

  // The wrapper and the way it is assembled: a device installs these too.
  for (const file of [
    "android/app/src/main/AndroidManifest.xml",
    "android/app/src/main/res/values/styles.xml",
    "android/app/src/main/res/drawable-mdpi/splash_mark.png",
    "android/app/build.gradle",
    "build/offline-plugin.js",
    "public/favicon.svg",
    "public/photos/level-1-1.webp",
    "index.html",
    "capacitor.config.json",
    "package-lock.json",
    "vite.config.js",
    "tailwind.config.js",
  ]) {
    assert.equal(shipsInTheApp(file), true, `${file} is part of what is built`);
  }

  // And what does not. Under src/, a module the application does not reach and a
  // test beside the code both ship nowhere, which is the whole reason the walk
  // exists: a check that failed on them would be one nobody keeps.
  for (const file of [
    "src/lib/tool.js",
    "src/lib/tool.test.js",
    "README.md",
    "ANDROID_RELEASE.md",
    "package.json",
    ".github/workflows/uptime.yml",
    ".github/workflows/android.yml",
    "scripts/check-site.mjs",
    "scripts/check-release.mjs",
    "scripts/android-version.mjs",
  ]) {
    assert.equal(shipsInTheApp(file, appFiles), false, `${file} does not ship`);
  }

  // A path is compared as the repository writes it, and a name that merely
  // starts like an entry is not under it: `srcfile.js` is not under `src/`.
  assert.equal(shipsInTheApp("src", appFiles), false, "a directory name alone is not a file of it");
  assert.equal(shipsInTheApp("srcfile.js", appFiles), false, "a name that merely starts with src is not src/");
  assert.equal(shipsInTheApp("./src/App.jsx", appFiles), true, "a leading ./ is the same file");
  assert.equal(shipsInTheApp("", appFiles), false);
  assert.equal(shipsInTheApp(null, appFiles), false);
  assert.equal(shipsInTheApp(undefined, appFiles), false);
});

test("this repository's own application is the files its entry reaches", () => {
  // The walk above is only as good as it is on the real tree: this is the same
  // decision the daily check makes, read from the sources that are here.
  const appFiles = appModules({ sources: sourcesUnder("src") });

  assert.ok(appFiles.has(APP_ENTRY), "the entry the site starts from is part of the build");
  assert.ok(appFiles.has("src/App.jsx"), "the application itself is part of the build");
  assert.ok(appFiles.has("src/pages/Home.jsx"), "a screen the first route reaches is part of it");
  assert.ok(appFiles.size > 40, `the application is more than a handful of files (found ${appFiles.size})`);

  // And the files that must not be in it, which is what a commit that adds a
  // check would otherwise be counted for. A module of pure logic written for a
  // script is imported by that script and by its own test and by nothing a
  // reader loads; a test file runs under Node and ships nowhere.
  for (const file of [
    "src/lib/release-drift.js",
    "src/lib/release-drift.test.js",
    "src/lib/site-health.js",
    "src/lib/site-health.test.js",
  ]) {
    assert.equal(appFiles.has(file), false, `${file} is not reached from the entry`);
    assert.equal(shipsInTheApp(file, appFiles), false, `${file} does not ship`);
  }

  for (const file of appFiles) {
    assert.match(file, /^src\//, `${file} is a file of the application under src/`);
    assert.ok(!file.endsWith(".test.js"), `${file} is a test and does not ship`);
  }

  // A dependency change moves the lockfile and is seen; a script or a note does
  // not, and is not a reason to cut a version.
  assert.equal(shipsInTheApp("package-lock.json", appFiles), true);
  assert.equal(shipsInTheApp("package.json", appFiles), false);
});

test("only the files that ship are reported, once each and in order", () => {
  const appFiles = appModules({ sources: SOURCES });

  // GitHub answers a comparison with an object per file, and another endpoint
  // with the name alone: both shapes are read, and a file touched by three
  // commits is listed once.
  const changed = shippingChanges(
    [
      { filename: "src/pages/Home.jsx" },
      { filename: "README.md" },
      "src/pages/Home.jsx",
      { filename: "android/app/src/main/res/values/styles.xml" },
      { filename: ".github/workflows/verify.yml" },
      { filename: "src/lib/helper.js" },
      { filename: "src/lib/tool.js" },
      { filename: null },
      {},
      null,
    ],
    appFiles
  );

  assert.deepEqual(changed, [
    "android/app/src/main/res/values/styles.xml",
    "src/lib/helper.js",
    "src/pages/Home.jsx",
  ]);

  assert.deepEqual(shippingChanges([], appFiles), []);
  assert.deepEqual(shippingChanges(null, appFiles), [], "no list at all is not a list of changes");
  assert.deepEqual(shippingChanges(["README.md"], appFiles), [], "a commit over documentation alone ships nothing");
  assert.deepEqual(
    shippingChanges(["src/lib/tool.js", "package.json"], appFiles),
    [],
    "a script-only module and the manifest ship nothing"
  );
});

test("the three states of the repository are told apart", () => {
  const appFiles = appModules({ sources: SOURCES });

  // The release is the branch: nothing to do, and no version to cut.
  assert.deepEqual(driftOf({ version: "1.0.1", tag: "v1.0.1", aheadBy: 0, files: [], appFiles }), {
    version: "1.0.1",
    tag: "v1.0.1",
    aheadBy: 0,
    files: [],
    drifting: false,
  });

  // The branch moved, and only over things the APK is not built from: said as
  // exactly that, since it is not a reason to publish a version.
  const quiet = driftOf({
    version: "1.0.1",
    tag: "v1.0.1",
    aheadBy: 3,
    files: [
      "README.md",
      ".github/workflows/uptime.yml",
      "scripts/check-release.mjs",
      "src/lib/tool.js",
      "src/lib/tool.test.js",
      "package.json",
    ],
    appFiles,
  });
  assert.equal(quiet.aheadBy, 3);
  assert.equal(quiet.drifting, false);
  assert.deepEqual(quiet.files, []);

  // And the failure: a screen changed, and the release does not carry it.
  const behind = driftOf({
    version: "1.0.1",
    tag: "v1.0.1",
    aheadBy: 5,
    files: ["src/pages/Home.jsx", "README.md", "android/app/build.gradle"],
    appFiles,
  });
  assert.equal(behind.drifting, true);
  assert.deepEqual(behind.files, ["android/app/build.gradle", "src/pages/Home.jsx"]);

  // A count that is missing or nonsense reads as none rather than as a crash:
  // the list of files is what decides, and a number only says how far behind.
  for (const aheadBy of [undefined, null, -2, Number.NaN, "3"]) {
    assert.equal(driftOf({ aheadBy, appFiles }).aheadBy, 0, `${aheadBy} is not a count of commits`);
  }
});

test("the name of the file a release carries is the one the workflow writes", () => {
  // The Android screen downloads whatever the workflow uploaded, so the two ends
  // have to agree on the name. It is built in one place and the workflow is read
  // here for the line that renames the file Gradle produced.
  assert.equal(apkNameFor("1.0.1"), "africa-history-quest-1.0.1.apk");

  const workflow = read(".github/workflows/android.yml");
  assert.ok(
    workflow.includes('mv apk/app-release.apk "apk/africa-history-quest-$VERSION.apk"'),
    "the workflow no longer renames the built file after the version the tag names"
  );
  assert.ok(
    workflow.includes('gh release upload "$TAG" "apk/africa-history-quest-$VERSION.apk"'),
    "the workflow no longer uploads the file under that name"
  );

  // The version in the name comes from the tag through the one module that
  // decides it, so a tag of three numbers is the only thing a release can be
  // named after, and a tag this module refuses is refused here too.
  assert.equal(apkNameFor(versionFromTag("v1.0.1").versionName), "africa-history-quest-1.0.1.apk");
  assert.throws(() => versionFromTag("1.0.0-rc.1"), /not a version tag/);
});

test("the issue says what is missing and what to do about it", () => {
  const behind = issueBody({
    outcome: "behind",
    branch: "main",
    release: "v1.0.1",
    files: ["src/pages/Home.jsx", "android/app/build.gradle"],
  });
  assert.match(behind, /`v1\.0\.1`/);
  assert.match(behind, /`main`/);
  assert.match(behind, /2 file\(s\)/);
  assert.match(behind, /- `src\/pages\/Home\.jsx`/);
  assert.match(behind, /- `android\/app\/build\.gradle`/);
  assert.match(behind, /version tag/, "the body says what to do about it");

  // A long list is cut so the issue stays readable, and the count stays whole
  // rather than being cut with it.
  const many = Array.from({ length: 60 }, (_, at) => `src/file-${at}.js`);
  const cut = issueBody({ outcome: "behind", release: "v1.0.0", files: many });
  assert.match(cut, /60 file\(s\)/);
  assert.match(cut, /- and 10 more/);
  assert.ok(!cut.includes("src/file-59.js"), "the list stops before the end of it");

  // And the other alarm, which has no files to name and is about the download
  // being absent rather than merely old.
  const missing = issueBody({
    outcome: "no-download",
    release: "v1.0.2",
    asset: "africa-history-quest-1.0.2.apk",
  });
  assert.match(missing, /does not carry `africa-history-quest-1\.0\.2\.apk`/);
  assert.ok(!missing.includes("- `src/"), "a missing asset is not a list of files");
});

test("the closing line says which of the two quiet verdicts it was", () => {
  // The version caught up, or the branch moved on over things the app is not
  // built from: a reader of the closed issue should be able to tell them apart.
  assert.match(
    closeComment({ outcome: "in-sync", release: "v1.0.2" }),
    /`v1\.0\.2` is the commit the site is published from/
  );
  assert.match(
    closeComment({ outcome: "ahead-quiet", release: "v1.0.2" }),
    /`v1\.0\.2` is behind the branch, but only over files the app is not built from/
  );
  assert.match(closeComment({}), /The release/);
});

test("the issue is opened, kept, and closed by the state of the release", () => {
  const openIssue = { number: 7, title: DRIFT_ISSUE_TITLE };
  const otherIssue = { number: 3, title: "Something else entirely" };
  const behind = { outcome: "behind", release: "v1.0.1", files: ["src/pages/Home.jsx"] };

  // Behind, and nothing open: it is opened, with the body that names the files.
  const opened = issueDecision({ report: behind, issues: [otherIssue] });
  assert.equal(opened.action, "open");
  assert.equal(opened.number, 0);
  assert.equal(opened.title, DRIFT_ISSUE_TITLE);
  assert.match(opened.body, /src\/pages\/Home\.jsx/);

  // Behind, and one already open: the same issue is brought level, rather than a
  // second one being opened every day the drift lasts.
  const kept = issueDecision({ report: behind, issues: [otherIssue, openIssue] });
  assert.equal(kept.action, "update");
  assert.equal(kept.number, 7);

  // A release with no APK attached is the same alarm, and is closed the same way.
  assert.equal(issueDecision({ report: { outcome: "no-download" }, issues: [] }).action, "open");

  // In step: an open issue is closed, and nothing is opened where there is none.
  for (const outcome of ["in-sync", "ahead-quiet"]) {
    const settled = issueDecision({ report: { outcome, release: "v1.0.2" }, issues: [openIssue] });
    assert.equal(settled.action, "close", `${outcome} closes the issue`);
    assert.equal(settled.number, 7);
    assert.match(settled.body, /`v1\.0\.2`/);
    assert.equal(issueDecision({ report: { outcome }, issues: [] }).action, "nothing");
  }

  // And when the check could not answer, the alarm that is up stays up: a
  // repository with no release, a tag that is not a version, or a request that
  // never arrived is not the news that the drift is over.
  for (const outcome of ["no-release", "unreadable", "bad-tag", "", undefined]) {
    const quiet = issueDecision({ report: { outcome }, issues: [openIssue] });
    assert.equal(quiet.action, "nothing", `${outcome} does not close the issue`);
    assert.equal(quiet.number, 0);
    assert.equal(quiet.body, "");
  }

  // The title is the whole mark, so an issue that merely contains it is somebody
  // else's and is never touched.
  const nearly = { number: 9, title: `${DRIFT_ISSUE_TITLE} (again)` };
  assert.equal(issueDecision({ report: { outcome: "in-sync" }, issues: [nearly] }).action, "nothing");
  assert.equal(issueDecision().action, "nothing");
  assert.equal(issueDecision({ report: behind, issues: [null, {}] }).action, "open");
});

test("the check is asked for by the daily run, and stays out of the verification", () => {
  // It is a check of what is published, and what is published is different every
  // day: it needs a network and a release that exists, so it cannot be a gate on
  // a change. The Uptime workflow runs it beside the site check, and a failing
  // scheduled run is what tells the publisher.
  const uptime = read(".github/workflows/uptime.yml");
  assert.match(uptime, /node scripts\/check-release\.mjs/, "the daily check no longer asks about the release");
  assert.match(uptime, /node scripts\/check-site\.mjs/, "and it no longer reads the site");
  assert.match(uptime, /schedule:/, "the check never runs by itself");
  assert.doesNotMatch(uptime, /continue-on-error/, "a failed check is ignored");
  // The run's own token is handed over so the daily check is not counted against
  // the anonymous rate limit, and it is the only credential this check uses.
  assert.match(uptime, /GH_TOKEN: \$\{\{ github\.token \}\}/, "the check no longer reads with the run's token");

  // The verification says whether the project can be built, and it is run on a
  // pull request by a machine that may hold no credential: this check reads a
  // public repository, but it reads it over the network, which the verification
  // deliberately does not do.
  const verify = read("scripts/verify.mjs");
  assert.doesNotMatch(verify, /check-release/, "the verification now needs the network");

  // And what decides is what the application is built from, walked from its
  // entry, so the script reads this checkout rather than counting every file
  // under src/.
  const script = read("scripts/check-release.mjs");
  assert.match(script, /appModules\(\{ sources:/, "the check no longer walks the application's imports");
  assert.match(script, /appFiles,/, "the check no longer hands the reachable set to the verdict");

  // And the verdict is left behind, where a second step turns it into something
  // that can be read a week later, and takes it down again once it is stale.
  assert.match(uptime, /--report drift-report\.json/, "the check no longer leaves its verdict for the issue");
  assert.match(uptime, /node scripts\/announce-drift\.mjs/, "the daily run no longer leaves an issue");
  assert.match(uptime, /if: always\(\)/, "the issue would be skipped exactly when it matters");
  // The permission is read out of the block rather than out of the file: the
  // words appear in the header comment too, and a test that matched them there
  // would pass on a workflow that grants nothing at all.
  const granted = uptime.slice(uptime.indexOf("\npermissions:"), uptime.indexOf("\njobs:"));
  assert.match(granted, /^ {2}contents: read\s*$/m, "the run no longer reads the repository");
  assert.match(granted, /^ {2}issues: write\s*$/m, "the run is not allowed to open the issue it is asked to open");

  // And the run can be asked about one older release by hand, which is how a
  // drift is looked at again after it was dealt with, and how the check and the
  // issue it leaves are seen to work on the day nothing has drifted at all.
  assert.match(uptime, /inputs:/, "the run can no longer be asked about a release by hand");
  assert.match(uptime, /inputs\.release/, "the release named by hand is not handed to the check");
  assert.match(uptime, /--release "\$RELEASE"/, "the named release is not what the check compares with");
  assert.match(
    uptime,
    /node scripts\/check-release\.mjs --report drift-report\.json/,
    "a run that names no release no longer asks about the latest one"
  );
  assert.match(
    read("scripts/announce-drift.mjs"),
    /issueDecision\(/,
    "the announcing step no longer decides from the report and the issues open"
  );

  // It is registered where a person can run it by hand, with the same shape as
  // the other on-demand checks.
  const { scripts } = JSON.parse(read("package.json"));
  assert.match(scripts["check:release"], /check-release\.mjs/, "package.json registers the release check");
  assert.ok(!scripts.verify.includes("check:release"), "the verification runs the release check");
});
