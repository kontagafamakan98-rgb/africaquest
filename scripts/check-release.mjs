/**
 * Whether the Android app people can download is older than the site.
 *
 *   node scripts/check-release.mjs                          # the published repository
 *   node scripts/check-release.mjs owner/name               # another one, to try it
 *   node scripts/check-release.mjs owner/name --branch dev  # another branch than main
 *   node scripts/check-release.mjs owner/name --release v1.0.0  # another release than the latest
 *   node scripts/check-release.mjs --report drift.json      # leave the verdict for another step
 *
 * The site is published on every push to `main`; the APK only when a version tag
 * is pushed, because it is signed and attached to a release. So the site can be
 * carrying changes no installed application has, and nothing says so. This reads
 * the latest release and the commits the branch has made after its tag, and
 * fails when any of those commits touched a file the APK is built from (see
 * src/lib/release-drift.js, which is where that decision is written down and
 * tested).
 *
 * It reads a public repository, so it needs no credential to work; a token in
 * `GH_TOKEN` or `GITHUB_TOKEN` is used when there is one, which is what the
 * Uptime workflow passes so the daily run is not counted against the anonymous
 * rate limit. Nothing else about the request is secret, and no token is ever
 * printed.
 *
 * It is deliberately not part of `npm run verify`: the verification says whether
 * the project can be built, and this asks what has been published, which needs a
 * network and a release that exists. The Uptime workflow runs it once a day
 * beside the site check, so a divergence reaches the publisher as a failing run
 * rather than as a silent gap between two downloads.
 *
 * `--report` writes what the check concluded as JSON, for a step that acts on it
 * rather than only failing: the Uptime workflow hands it to
 * scripts/announce-drift.mjs, which opens an issue naming the files the release
 * is missing and closes it again once a version carries them. The verdict is
 * written before the exit code is decided, so a run that ends red still leaves
 * the list behind for the issue to name.
 *
 * Exit code 0 when the release covers everything that ships, 1 when it does not
 * or when the release itself is not shaped the way the workflow publishes it,
 * and 2 when there was nothing to compare at all.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ANDROID_REPO } from "../src/lib/android-release.js";
import { appModules, apkNameFor, driftOf } from "../src/lib/release-drift.js";
import { versionFromTag } from "./android-version.mjs";

const ARGUMENTS = process.argv.slice(2);

/** The options that carry a value, so that the value is not mistaken for the repository. */
const VALUED_OPTIONS = new Set(["--branch", "--release", "--report"]);

/** The value of `--name value`, or the fallback when it was not given. */
function option(name, fallback) {
  const at = ARGUMENTS.indexOf(`--${name}`);
  const value = at === -1 ? "" : ARGUMENTS[at + 1] || "";
  return value.startsWith("--") || value === "" ? fallback : value;
}

/**
 * The first argument that is not an option and not the value of one.
 *
 * The repository is the only thing here written without a `--name`, so it must
 * not be read out of the value of the option in front of it: `--report drift.json`
 * names a file, not a repository to check.
 */
function positional() {
  for (let at = 0; at < ARGUMENTS.length; at += 1) {
    if (!ARGUMENTS[at].startsWith("--")) return ARGUMENTS[at];
    if (VALUED_OPTIONS.has(ARGUMENTS[at])) at += 1;
  }
  return "";
}

const REPO = positional() || ANDROID_REPO;
const BRANCH = option("branch", "main");
// Which release to compare with, when it is not the latest one: checking a past
// release is how the drift this script exists for is looked at again, after it
// has been dealt with or before it has.
const RELEASE = option("release", "");
// Where to leave the machine-readable verdict, when a caller wants to act on it
// rather than only read the exit code. Nothing is written unless it is asked for.
const REPORT = option("report", "");

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const AGENT = "AfricaHistoryQuest/1.0 (release check; kojoapp98@gmail.com)";
const TIMEOUT_MS = 15000;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The text of every file under `src/`, keyed by the path the repository writes.
 *
 * Which files the application is made of is decided by what its sources import,
 * and that is a property of the checkout being compared: the branch whose commits
 * are read here is the code that is on this disk.
 */
function appSources() {
  const sources = {};
  const dir = path.join(ROOT, "src");
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const full = path.join(entry.parentPath ?? entry.path, entry.name);
    const file = path.relative(ROOT, full).replace(/\\/g, "/");
    sources[file] = readFileSync(full, "utf8");
  }
  return sources;
}

if (!/^[\w.-]+\/[\w.-]+$/.test(REPO)) {
  console.error(`release: "${REPO}" is not a repository to check`);
  process.exit(2);
}

/**
 * Leave the verdict where an announcing step can read it, when one was asked
 * for. The repository and the branch travel with it, since the step that acts on
 * it needs both and should not have to be told them a second time.
 */
function emitReport(verdict) {
  if (REPORT.length === 0) return;
  writeFileSync(REPORT, `${JSON.stringify({ repo: REPO, branch: BRANCH, ...verdict }, null, 2)}\n`, "utf8");
}

/**
 * One GitHub answer, read.
 *
 * A 404 is an answer rather than a failure: it is how GitHub says there is no
 * published release, which is a different thing from a request that never
 * arrived. The token, when there is one, travels in the header and is never
 * written to the log.
 */
async function ask(path) {
  const headers = { accept: "application/vnd.github+json", "user-agent": AGENT };
  if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;

  try {
    const response = await fetch(`https://api.github.com${path}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 404) return { missing: true, status: 404 };
    if (!response.ok) {
      return { failed: true, status: response.status, message: response.statusText };
    }
    return { body: await response.json(), status: response.status };
  } catch (error) {
    return { failed: true, status: 0, message: error.message };
  }
}

console.log(`release: ${REPO}, branch ${BRANCH}${RELEASE ? `, release ${RELEASE}` : ""}`);
console.log(`  ${TOKEN ? "asked with the run's token" : "asked anonymously"}\n`);

const release = await ask(
  RELEASE ? `/repos/${REPO}/releases/tags/${encodeURIComponent(RELEASE)}` : `/repos/${REPO}/releases/latest`
);
if (release.failed) {
  emitReport({ outcome: "unreadable", release: RELEASE, detail: `status ${release.status}` });
  console.error(`release: the latest release could not be read (status ${release.status}${release.message ? `, ${release.message}` : ""})`);
  process.exit(2);
}
if (release.missing) {
  emitReport({ outcome: "no-release", release: RELEASE, detail: "no such release" });
  console.error(
    RELEASE
      ? `release: ${REPO} has no release named ${RELEASE}, so there is nothing to compare`
      : "release: this repository has no published release, so there is nothing to compare"
  );
  process.exit(2);
}

const tag = String(release.body?.tag_name || "").trim();
let version = "";
try {
  version = versionFromTag(tag).versionName;
} catch (error) {
  emitReport({ outcome: "bad-tag", release: tag, detail: error.message });
  console.error(`release: ${error.message}`);
  process.exit(1);
}

// The file the Android screen downloads is the file the workflow renamed before
// uploading it, so a release without it is a release nobody can install from.
const asset = apkNameFor(version);
const assets = Array.isArray(release.body?.assets) ? release.body.assets : [];
const carried = assets.some((entry) => entry?.name === asset);
if (!carried) {
  emitReport({
    outcome: "no-download",
    release: tag,
    version,
    asset,
    listed: assets.map((entry) => entry?.name).filter(Boolean),
  });
  console.error(
    `release: ${tag} carries no ${asset}, so the download the Android screen offers is not there\n` +
      `  the release lists: ${assets.map((entry) => entry?.name).filter(Boolean).join(", ") || "nothing"}`
  );
  process.exit(1);
}

const comparison = await ask(`/repos/${REPO}/compare/${encodeURIComponent(tag)}...${encodeURIComponent(BRANCH)}`);
if (comparison.failed) {
  emitReport({ outcome: "unreadable", release: tag, version, asset, detail: `status ${comparison.status}` });
  console.error(`release: the commits after ${tag} could not be read (status ${comparison.status}${comparison.message ? `, ${comparison.message}` : ""})`);
  process.exit(2);
}

// The files of a comparison are answered once for the whole thing, and per
// commit as well on some endpoints; whichever arrived is what is read. GitHub
// caps the list, so a comparison of hundreds of files is a list that has been
// cut: it can name a shipping file or miss one, and it can never invent one.
const body = comparison.body || {};
const files = Array.isArray(body.files)
  ? body.files
  : (body.commits || []).flatMap((commit) => (Array.isArray(commit?.files) ? commit.files : []));

// What the application is built from, walked from its entry in this checkout: a
// test file and a module only a script imports are both under `src/` and both
// ship nowhere, so they are left out here rather than counted as a change people
// install.
const appFiles = appModules({ sources: appSources() });

const drift = driftOf({
  version,
  tag,
  aheadBy: Number(body.ahead_by ?? body.total_commits ?? 0),
  files,
  appFiles,
});

console.log(`  the release ${tag} (${version}), carrying ${asset}`);
console.log(`  ${BRANCH} is ${drift.aheadBy} commit(s) past it, and the app is built from ${appFiles.size} file(s) here\n`);

if (!drift.drifting) {
  emitReport({
    outcome: drift.aheadBy === 0 ? "in-sync" : "ahead-quiet",
    release: tag,
    version,
    asset,
    aheadBy: drift.aheadBy,
    files: [],
  });
  console.log(
    drift.aheadBy === 0
      ? `release: ${tag} is the site, so the download and the site are the same application`
      : `release: ${BRANCH} has moved on, but only over files the APK is not built from, so the download is not older`
  );
  process.exit(0);
}

emitReport({
  outcome: "behind",
  release: tag,
  version,
  asset,
  aheadBy: drift.aheadBy,
  files: drift.files,
});

console.error(`release: the APK people download is older than the site, by ${drift.files.length} file(s) the application is built from:`);
for (const file of drift.files.slice(0, 20)) console.error(`  ${file}`);
if (drift.files.length > 20) console.error(`  and ${drift.files.length - 20} more`);
console.error(
  `\n  ${BRANCH} carries them and the release ${tag} does not: whoever installs the Android app from the site\n` +
    "  gets the older game. Push a version tag to publish what the site already has (see ANDROID_RELEASE.md)."
);
process.exit(1);