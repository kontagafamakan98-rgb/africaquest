import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { apkNameFor, driftOf, shippingChanges, shipsInTheApp } from "./release-drift.js";
import { versionFromTag } from "../../scripts/android-version.mjs";

// Whether the Android app people can download is older than the site.
//
// The site goes out on every push to main; the APK only when a version tag is
// pushed, because it is signed, versioned and attached to a release. Nothing
// said so before this. What is checked here is the decision and not the request,
// since fetching the comparison is the script's job: which files count as part
// of the installed application, what the three states of the repository mean,
// and where the check is wired in.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

test("a file the installed application is built from is one the check counts", () => {
  // The application itself: its screens, its content, its photographs.
  for (const file of [
    "src/pages/Home.jsx",
    "src/components/game/QuizScreen.jsx",
    "src/components/StartupLanguage.jsx",
    "public/favicon.svg",
    "public/photos/level-1-1.webp",
  ]) {
    assert.equal(shipsInTheApp(file), true, `${file} ships in the app`);
  }

  // The wrapper and the way it is assembled: a device installs these too.
  for (const file of [
    "android/app/src/main/AndroidManifest.xml",
    "android/app/src/main/res/values/styles.xml",
    "android/app/src/main/res/drawable-mdpi/splash_mark.png",
    "android/app/build.gradle",
    "build/offline-plugin.js",
    "index.html",
    "capacitor.config.json",
    "package.json",
    "package-lock.json",
    "vite.config.js",
  ]) {
    assert.equal(shipsInTheApp(file), true, `${file} is part of what is built`);
  }

  // And what does not: the documentation, the workflows, the checks themselves.
  // A check that failed on these would be one nobody keeps, and a paragraph
  // about signing a release is exactly the commit that follows a release
  // without changing the application at all.
  for (const file of [
    "README.md",
    "ANDROID_RELEASE.md",
    "ACCESSIBILITY.md",
    "CONTRIBUTING.md",
    ".github/workflows/uptime.yml",
    ".github/workflows/android.yml",
    "scripts/check-site.mjs",
    "scripts/android-version.mjs",
  ]) {
    assert.equal(shipsInTheApp(file), false, `${file} does not ship`);
  }

  // A path is compared as the repository writes it, and a name that merely
  // starts like an entry is not under it: `srcfile.js` is not under `src/`.
  assert.equal(shipsInTheApp("src"), false, "a directory name alone is not a file of it");
  assert.equal(shipsInTheApp("srcfile.js"), false, "a name that merely starts with src is not src/");
  assert.equal(shipsInTheApp("./src/App.jsx"), true, "a leading ./ is the same file");
  assert.equal(shipsInTheApp(""), false);
  assert.equal(shipsInTheApp(null), false);
  assert.equal(shipsInTheApp(undefined), false);
});

test("only the files that ship are reported, once each and in order", () => {
  // GitHub answers a comparison with an object per file, and another endpoint
  // with the name alone: both shapes are read, and a file touched by three
  // commits is listed once.
  const changed = shippingChanges([
    { filename: "src/pages/Android.jsx" },
    { filename: "README.md" },
    "src/pages/Android.jsx",
    { filename: "android/app/src/main/res/values/styles.xml" },
    { filename: ".github/workflows/verify.yml" },
    { filename: "src/components/StartupLanguage.jsx" },
    { filename: null },
    {},
    null,
  ]);

  assert.deepEqual(changed, [
    "android/app/src/main/res/values/styles.xml",
    "src/components/StartupLanguage.jsx",
    "src/pages/Android.jsx",
  ]);

  assert.deepEqual(shippingChanges([]), []);
  assert.deepEqual(shippingChanges(null), [], "no list at all is not a list of changes");
  assert.deepEqual(shippingChanges(["README.md"]), [], "a commit over documentation alone ships nothing");
});

test("the three states of the repository are told apart", () => {
  // The release is the branch: nothing to do, and no version to cut.
  assert.deepEqual(driftOf({ version: "1.0.1", tag: "v1.0.1", aheadBy: 0, files: [] }), {
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
    files: ["README.md", ".github/workflows/uptime.yml", "scripts/check-release.mjs"],
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
  });
  assert.equal(behind.drifting, true);
  assert.deepEqual(behind.files, ["android/app/build.gradle", "src/pages/Home.jsx"]);

  // A count that is missing or nonsense reads as none rather than as a crash:
  // the list of files is what decides, and a number only says how far behind.
  for (const aheadBy of [undefined, null, -2, Number.NaN, "3"]) {
    assert.equal(driftOf({ aheadBy }).aheadBy, 0, `${aheadBy} is not a count of commits`);
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

  // And it is registered where a person can run it by hand, with the same shape
  // as the other on-demand checks.
  const { scripts } = JSON.parse(read("package.json"));
  assert.match(scripts["check:release"], /check-release\.mjs/, "package.json registers the release check");
  assert.ok(!scripts.verify.includes("check:release"), "the verification runs the release check");
});