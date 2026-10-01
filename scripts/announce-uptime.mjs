/**
 * Keep the day-by-day record of what the site check found.
 *
 *   node scripts/announce-uptime.mjs                    # reads uptime-report.json
 *   node scripts/announce-uptime.mjs --report <path>    # ... or somewhere else
 *   node scripts/announce-uptime.mjs --dry-run          # say what it would do, and change nothing
 *
 * A failing run is the alarm, and GitHub gives it to the owner by itself. It is
 * the only thing it gives: a run is one of hundreds, it is kept for ninety days,
 * and it says nothing at all about the days before it. So a green run every day
 * for a month is indistinguishable from a check that stopped running, which is
 * the failure a daily check is least able to report about itself.
 *
 * The verdict of each run is therefore appended to one issue, whose body is both
 * the thing to read and the thing to append to. A comment is left only when the
 * verdict changes, so a site that is down for a week says so once and then sits
 * in the table, and the day it answers again is news as well. Anything more would
 * be a notification a day, which is a log nobody reads.
 *
 * It reads the report `scripts/check-site.mjs --report` wrote rather than asking
 * the site a second time, so the two steps cannot end up disagreeing about what
 * was found, and it needs a token with `issues: write`, which is what the Uptime
 * workflow passes: the run's own, so no secret is stored for it.
 */
import { readFileSync } from "node:fs";
import { UPTIME_LOG_TITLE, upkeepDecision } from "../src/lib/uptime-log.js";

const ARGUMENTS = process.argv.slice(2);

/** The value of `--name value`, or the fallback when it was not given. */
function option(name, fallback) {
  const at = ARGUMENTS.indexOf(`--${name}`);
  const value = at === -1 ? "" : ARGUMENTS[at + 1] || "";
  return value.startsWith("--") || value === "" ? fallback : value;
}

const REPORT = option("report", "uptime-report.json");
const DRY_RUN = ARGUMENTS.includes("--dry-run");
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const AGENT = "AfricaHistoryQuest/1.0 (uptime log; kojoapp98@gmail.com)";
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
 * reported with what GitHub said about it, because the one that matters here (a
 * token that may not write an issue) is the one worth reading the log for.
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
  console.log(`uptime: there is no report at ${REPORT}, so this run never reached the check`);
  process.exit(0);
}

const outcome = String(report.outcome ?? "");
if (outcome !== "up" && outcome !== "down") {
  console.log(`uptime: the report says "${outcome}", which is not a verdict to keep`);
  process.exit(0);
}

// The address this is written in. The run says which repository it is, so
// nothing here has to be configured and a fork keeps its own log.
const REPO = option("repo", String(process.env.GITHUB_REPOSITORY ?? "")).trim();
if (!/^[\w.-]+\/[\w.-]+$/.test(REPO)) {
  console.error(`uptime: "${REPO}" is not a repository to keep a log in`);
  process.exit(1);
}

if (TOKEN.length === 0) {
  console.error("uptime: there is no token in GH_TOKEN, so nothing can be written");
  process.exit(1);
}

const run = {
  at: String(report.checkedAt ?? new Date().toISOString()),
  verdict: outcome,
  answered: Number(report.answered) || 0,
  asked: Number(report.asked) || 0,
};

console.log(`uptime: ${REPO}, and the check found the site ${outcome} (${run.answered} of ${run.asked} answered)`);

// Every issue, open or closed: a log somebody closed by hand is a log to carry
// on rather than a second one to start beside it.
const listed = await ask("GET", `/repos/${REPO}/issues?state=all&per_page=100`);
if (listed.failed) {
  console.error(`uptime: the issues could not be read (${why(listed)})`);
  process.exit(1);
}

// A pull request is an issue to this endpoint, and one carrying the same title
// would otherwise be rewritten by name.
const issues = (Array.isArray(listed.body) ? listed.body : [])
  .filter((issue) => !issue?.pull_request)
  .map((issue) => ({
    number: issue.number,
    title: String(issue.title ?? ""),
    body: String(issue.body ?? ""),
    state: String(issue.state ?? "open"),
  }));

const decision = upkeepDecision({ run, issues, site: String(report.site ?? "") });

if (DRY_RUN) {
  console.log(`uptime: would ${decision.action} ${decision.number ? `#${decision.number}` : `"${UPTIME_LOG_TITLE}"`}`);
  console.log(`\n${decision.body}`);
  if (decision.comment) console.log(`\nand would comment:\n\n${decision.comment}`);
  process.exit(0);
}

if (decision.action === "create") {
  const made = await ask("POST", `/repos/${REPO}/issues`, { title: decision.title, body: decision.body });
  if (made.failed) {
    console.error(`uptime: the log could not be opened (${why(made)})`);
    process.exit(1);
  }
  console.log(`uptime: opened #${made.body?.number}, ${made.body?.html_url ?? ""}`);
  process.exit(0);
}

const existing = issues.find((issue) => issue.number === decision.number);
const payload = { body: decision.body };
// A log that was closed by hand is reopened rather than left to look like a log
// that stopped: the next check writes to it either way.
if (existing?.state === "closed") payload.state = "open";

const kept = await ask("PATCH", `/repos/${REPO}/issues/${decision.number}`, payload);
if (kept.failed) {
  console.error(`uptime: #${decision.number} could not be brought up to date (${why(kept)})`);
  process.exit(1);
}
console.log(`uptime: #${decision.number} now carries ${run.verdict} at ${run.at}`);

if (decision.comment) {
  const said = await ask("POST", `/repos/${REPO}/issues/${decision.number}/comments`, { body: decision.comment });
  if (said.failed) {
    console.error(`uptime: the change could not be commented on #${decision.number} (${why(said)})`);
    process.exit(1);
  }
  console.log(`uptime: and said so, because the verdict changed`);
}

process.exit(0);
