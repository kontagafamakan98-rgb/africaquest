/**
 * Say it where it can be read: open an issue while the app is behind the site,
 * and close it again once a version carries what the site has.
 *
 *   node scripts/announce-drift.mjs                     # reads drift-report.json
 *   node scripts/announce-drift.mjs --report <path>     # ... or somewhere else
 *   node scripts/announce-drift.mjs --dry-run           # say what it would do, and change nothing
 *
 * A failing scheduled run is what GitHub tells the owner about, and that is the
 * alarm the Uptime workflow already gives. A run is easy to lose, though: it is
 * one of hundreds, it says nothing once it is green again, and a drift that
 * lasts a month is a month of identical red marks with nothing to read at the
 * end of them. An issue is the same alarm with a place to stand: it names the
 * files the release is missing, it can be assigned and answered, and the check
 * that opened it closes it by itself once those files are in a release.
 *
 * It reads the report `scripts/check-release.mjs --report` wrote rather than
 * asking GitHub a second time, so the two steps cannot end up disagreeing about
 * what was found, and it is the only thing here that writes to the repository.
 *
 * It needs a token with `issues: write`, which is what the Uptime workflow
 * passes; the run's own, so no secret is stored for it. On the usual day the
 * report says the two are in step and no issue is open, and this writes nothing
 * at all.
 */
import { readFileSync } from "node:fs";
import { DRIFT_ISSUE_TITLE, issueDecision } from "../src/lib/release-drift.js";

const ARGUMENTS = process.argv.slice(2);

/** The value of `--name value`, or the fallback when it was not given. */
function option(name, fallback) {
  const at = ARGUMENTS.indexOf(`--${name}`);
  const value = at === -1 ? "" : ARGUMENTS[at + 1] || "";
  return value.startsWith("--") || value === "" ? fallback : value;
}

const REPORT = option("report", "drift-report.json");
const DRY_RUN = ARGUMENTS.includes("--dry-run");
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const AGENT = "AfricaHistoryQuest/1.0 (drift announce; kojoapp98@gmail.com)";
const TIMEOUT_MS = 15000;

/** The report the check left for this step, or null when the run never got there. */
function readReport() {
  try {
    return JSON.parse(readFileSync(REPORT, "utf8"));
  } catch {
    return null;
  }
}

/**
 * One GitHub request, read.
 *
 * The token travels in the header and is never written to the log. A refusal is
 * reported with what GitHub said about it, because the one that matters here -
 * a token that may not open an issue - is the one worth reading the log for.
 */
async function ask(method, path, payload) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": AGENT,
    authorization: `Bearer ${TOKEN}`,
  };
  if (payload) headers["content-type"] = "application/json";

  try {
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      let said = "";
      try {
        const body = await response.json();
        said = String(body?.message ?? "");
      } catch {
        said = "";
      }
      return { failed: true, status: response.status, message: said || response.statusText };
    }
    return { body: await response.json(), status: response.status };
  } catch (error) {
    return { failed: true, status: 0, message: error.message };
  }
}

/** How a failed request is put in the log, without ever naming the token. */
function why(result) {
  return `status ${result.status}${result.message ? `, ${result.message}` : ""}`;
}

const report = readReport();
if (report === null) {
  console.log(`drift: there is no report at ${REPORT}, so this run never got as far as the check`);
  process.exit(0);
}

const REPO = String(report.repo ?? "").trim();
if (!/^[\w.-]+\/[\w.-]+$/.test(REPO)) {
  console.error(`drift: "${REPO}" is not a repository to speak in`);
  process.exit(1);
}

if (TOKEN.length === 0) {
  console.error("drift: there is no token in GH_TOKEN, so nothing can be written");
  process.exit(1);
}

console.log(
  `drift: ${REPO}, and the check said ${report.outcome ?? "nothing"} for ${report.release || "the last release"}`
);

const open = await ask("GET", `/repos/${REPO}/issues?state=open&per_page=100`);
if (open.failed) {
  console.error(`drift: the open issues could not be read (${why(open)})`);
  process.exit(1);
}

// A pull request is an issue to this endpoint, and one that happened to carry
// the same title would otherwise be updated or closed by name.
const issues = (Array.isArray(open.body) ? open.body : [])
  .filter((issue) => !issue?.pull_request)
  .map((issue) => ({ number: issue.number, title: String(issue.title ?? "") }));

const decision = issueDecision({ report, issues });

if (decision.action === "nothing") {
  console.log("drift: the download and the site are in step, and nothing is open, so there is nothing to say");
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`drift: would ${decision.action} ${decision.number ? `#${decision.number}` : `"${DRIFT_ISSUE_TITLE}"`}`);
  console.log(`\n${decision.body}`);
  process.exit(0);
}

if (decision.action === "open") {
  const made = await ask("POST", `/repos/${REPO}/issues`, { title: decision.title, body: decision.body });
  if (made.failed) {
    console.error(`drift: the issue could not be opened (${why(made)})`);
    process.exit(1);
  }
  console.log(`drift: opened #${made.body?.number}, ${made.body?.html_url ?? ""}`);
  process.exit(0);
}

if (decision.action === "update") {
  const kept = await ask("PATCH", `/repos/${REPO}/issues/${decision.number}`, { body: decision.body });
  if (kept.failed) {
    console.error(`drift: #${decision.number} could not be brought up to date (${why(kept)})`);
    process.exit(1);
  }
  console.log(`drift: #${decision.number} is still open, and now says what the check finds`);
  process.exit(0);
}

const comment = await ask("POST", `/repos/${REPO}/issues/${decision.number}/comments`, {
  body: decision.body,
});
if (comment.failed) {
  console.error(`drift: #${decision.number} could not be answered (${why(comment)})`);
  process.exit(1);
}

const closed = await ask("PATCH", `/repos/${REPO}/issues/${decision.number}`, { state: "closed" });
if (closed.failed) {
  console.error(`drift: #${decision.number} could not be closed (${why(closed)})`);
  process.exit(1);
}

console.log(`drift: closed #${decision.number}, since a version now carries what the site has`);
process.exit(0);
