/**
 * Whether the Android app people can download is older than the site.
 *
 *   node scripts/check-release.mjs                          # the published repository
 *   node scripts/check-release.mjs owner/name               # another one, to try it
 *   node scripts/check-release.mjs owner/name --branch dev  # another branch than main
 *   node scripts/check-release.mjs owner/name --release v1.0.0  # another release than the latest
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
 * Exit code 0 when the release covers everything that ships, 1 when it does not
 * or when the release itself is not shaped the way the workflow publishes it,
 * and 2 when there was nothing to compare at all.
 */
import { ANDROID_REPO } from "../src/lib/android-release.js";
import { apkNameFor, driftOf } from "../src/lib/release-drift.js";
import { versionFromTag } from "./android-version.mjs";

const ARGUMENTS = process.argv.slice(2);

/** The value of `--name value`, or the fallback when it was not given. */
function option(name, fallback) {
  const at = ARGUMENTS.indexOf(`--${name}`);
  const value = at === -1 ? "" : ARGUMENTS[at + 1] || "";
  return value.startsWith("--") || value === "" ? fallback : value;
}

const REPO = ARGUMENTS.find((argument) => !argument.startsWith("--")) || ANDROID_REPO;
const BRANCH = option("branch", "main");
// Which release to compare with, when it is not the latest one: checking a past
// release is how the drift this script exists for is looked at again, after it
// has been dealt with or before it has.
const RELEASE = option("release", "");

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const AGENT = "AfricaHistoryQuest/1.0 (release check; kojoapp98@gmail.com)";
const TIMEOUT_MS = 15000;

if (!/^[\w.-]+\/[\w.-]+$/.test(REPO)) {
  console.error(`release: "${REPO}" is not a repository to check`);
  process.exit(2);
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
  console.error(`release: the latest release could not be read (status ${release.status}${release.message ? `, ${release.message}` : ""})`);
  process.exit(2);
}
if (release.missing) {
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
  console.error(`release: ${error.message}`);
  process.exit(1);
}

// The file the Android screen downloads is the file the workflow renamed before
// uploading it, so a release without it is a release nobody can install from.
const asset = apkNameFor(version);
const assets = Array.isArray(release.body?.assets) ? release.body.assets : [];
const carried = assets.some((entry) => entry?.name === asset);
if (!carried) {
  console.error(
    `release: ${tag} carries no ${asset}, so the download the Android screen offers is not there\n` +
      `  the release lists: ${assets.map((entry) => entry?.name).filter(Boolean).join(", ") || "nothing"}`
  );
  process.exit(1);
}

const comparison = await ask(`/repos/${REPO}/compare/${encodeURIComponent(tag)}...${encodeURIComponent(BRANCH)}`);
if (comparison.failed) {
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

const drift = driftOf({
  version,
  tag,
  aheadBy: Number(body.ahead_by ?? body.total_commits ?? 0),
  files,
});

console.log(`  the release ${tag} (${version}), carrying ${asset}`);
console.log(`  ${BRANCH} is ${drift.aheadBy} commit(s) past it\n`);

if (!drift.drifting) {
  console.log(
    drift.aheadBy === 0
      ? `release: ${tag} is the site, so the download and the site are the same application`
      : `release: ${BRANCH} has moved on, but only over files the APK is not built from, so the download is not older`
  );
  process.exit(0);
}

console.error(`release: the APK people download is older than the site, by ${drift.files.length} file(s) the application is built from:`);
for (const file of drift.files.slice(0, 20)) console.error(`  ${file}`);
if (drift.files.length > 20) console.error(`  and ${drift.files.length - 20} more`);
console.error(
  `\n  ${BRANCH} carries them and the release ${tag} does not: whoever installs the Android app from the site\n` +
    "  gets the older game. Push a version tag to publish what the site already has (see ANDROID_RELEASE.md)."
);
process.exit(1);