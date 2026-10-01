/**
 * The site's answer, kept where it can be read a month later.
 *
 * A daily check that fails tells the owner, and that is the alarm. It says
 * nothing else, though: a run is one of hundreds, it says nothing about the days
 * before it, and a run that was green every day for a month looks exactly like a
 * check that never ran at all. So the verdict of each check is written down
 * instead, in one issue, and the issue is the place a person can look in
 * September to see what August was like.
 *
 * The record is a list of runs, each with the day, what the check found and how
 * many addresses answered. It is carried inside the issue body between two
 * markers so that the body is both the thing to read and the thing to append to:
 * nothing else is stored anywhere, which is what keeps this a log rather than a
 * database.
 *
 * Plain module: no files, no network, no GitHub. The script reads the issues and
 * hands them in; this decides what the body should say and whether anything
 * deserves a comment.
 */

/** The title of the one issue this log lives in, and no other issue carries it. */
export const UPTIME_LOG_TITLE = "How the site has been answering, day after day";

/** How many checks are kept. One a day, so this is a little over a month. */
export const HISTORY_KEPT = 40;

/**
 * The two ends of the machine-readable history inside the issue body.
 *
 * HTML comments, so a reader of the issue never sees them and a parser always
 * finds them: the list is written between the markers and read back from the
 * same place, which is what lets the body be appended to rather than replaced.
 */
export const HISTORY_OPEN = "<!--uptime-history ";

/** And the end of it. */
export const HISTORY_CLOSE = " -->";

/** What one check found, as it is stored. */
const VERDICTS = new Set(["up", "down"]);

/**
 * One check, as the log keeps it.
 *
 * @typedef {{ at: string, verdict: "up"|"down", answered?: number, asked?: number }} Run
 */

/**
 * One issue as this module reads it, which is only ever a title, a number and a
 * body: everything else GitHub returns about the log is not its business.
 *
 * @typedef {{ number?: unknown, title?: unknown, body?: unknown }} Issue
 */

/**
 * Whether a value is a run this log can keep.
 *
 * A body can be edited by hand, and a list read back from it is a list somebody
 * else wrote: an entry that is not a run is dropped rather than rendered as a
 * row of `undefined`.
 *
 * @param {unknown} value
 * @returns {value is Run}
 */
function isRun(value) {
  if (!value || typeof value !== "object") return false;
  const run = /** @type {{ at?: unknown, verdict?: unknown }} */ (value);
  return typeof run.at === "string" && typeof run.verdict === "string" && VERDICTS.has(run.verdict);
}

/** When a run was made, as a person reads it in a table. */
function when(at) {
  const text = typeof at === "string" ? at : "";
  const day = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text) ? text.slice(0, 16).replace("T", " ") : text;
  return day || "an unknown day";
}

/**
 * What one run found, in one line.
 *
 * @param {Run|null} run
 * @returns {string}
 */
export function describeRun(run) {
  const asked = Number(run?.asked) || 0;
  const answered = Number(run?.answered) || 0;
  if (run?.verdict === "up") return `every address answered (${answered} of ${asked})`;
  if (answered === 0) return `nothing answered (0 of ${asked})`;
  return `${asked - answered} of ${asked} addresses are not what they should be`;
}

/**
 * The runs a body records, oldest first.
 *
 * A body with no markers, markers with something in them that is not a list, and
 * a list with entries that are not runs all come back as what could be read,
 * which for the first two is nothing at all: a log that cannot be parsed is a
 * log to start again rather than a reason to fail the check that writes it.
 *
 * @param {unknown} body the issue body, as GitHub returns it
 * @returns {Run[]}
 */
export function parseHistory(body) {
  const text = typeof body === "string" ? body : "";
  const start = text.indexOf(HISTORY_OPEN);
  if (start < 0) return [];
  const end = text.indexOf(HISTORY_CLOSE, start);
  if (end < 0) return [];
  try {
    const runs = JSON.parse(text.slice(start + HISTORY_OPEN.length, end));
    return Array.isArray(runs) ? runs.filter(isRun) : [];
  } catch {
    return [];
  }
}

/**
 * The history with one more run on the end, and the oldest ones dropped.
 *
 * @param {unknown} history what was read back
 * @param {unknown} run the check that just ran
 * @param {number} kept how many to keep
 * @returns {Run[]}
 */
export function appendRun(history, run, kept = HISTORY_KEPT) {
  const rows = Array.isArray(history) ? history.filter(isRun) : [];
  if (!isRun(run)) return rows.slice(-kept);
  return [...rows, run].slice(-kept);
}

/**
 * The issue body: what the log is, how the site has been, and the list itself.
 *
 * The table is newest first, because that is the end a reader wants, while the
 * list behind the markers stays oldest first, because that is the end an append
 * belongs at.
 *
 * @param {{ site?: string, entries?: Run[] }} [log]
 * @returns {string} the markdown of the whole body
 */
export function renderLog({ site = "", entries = [] } = {}) {
  const rows = (Array.isArray(entries) ? entries : []).filter(isRun);
  const last = rows[rows.length - 1];
  const up = rows.filter((run) => run.verdict === "up").length;

  const lines = [
    "The daily check reads the published site and says what it found. Its verdict is",
    "kept here as well as in the run, because a run is one of hundreds, it says nothing",
    "about the days before it, and a month of green ones is impossible to tell from a",
    "check that never ran at all.",
    "",
    `- The site: ${site || "not recorded"}`,
    `- The last check: ${last ? `${when(last.at)} UTC, ${describeRun(last)}` : "none recorded yet"}`,
    `- Of the last ${rows.length} check(s) kept here: ${up} found the site up, ${rows.length - up} did not.`,
  ];

  if (rows.length > 0) {
    lines.push(
      "",
      "| when (UTC) | what the check found |",
      "| --- | --- |",
      ...[...rows].reverse().map((run) => `| ${when(run.at)} | ${describeRun(run)} |`)
    );
  }

  lines.push("", `${HISTORY_OPEN}${JSON.stringify(rows)}${HISTORY_CLOSE}`, "");
  return lines.join("\n");
}

/**
 * What to say out loud when the site changes state, and nothing when it has not.
 *
 * The body is the record; a comment is the news. One is written only when the
 * verdict differs from the check before it, so a site that is down for a week
 * says so once and then sits in the table, and the day it comes back is a
 * comment too. Anything else would be a comment a day, which is a notification a
 * day and a log nobody reads.
 *
 * @param {{ previous?: Run|null, run?: Run|null, site?: string }} [change]
 * @returns {string} the comment, or an empty string when there is nothing to say
 */
export function transitionComment({ previous = null, run = null, site = "" } = {}) {
  if (!isRun(run) || !previous || typeof previous.verdict !== "string") return "";
  if (previous.verdict === run.verdict) return "";
  const where = site ? ` (${site})` : "";

  if (run.verdict === "down") {
    return [
      `The check found the site down at ${when(run.at)} UTC${where}: ${describeRun(run)}.`,
      "",
      "The failing run is what GitHub tells the owner about; this is the same news with a",
      "place to stand. The checks below will keep the day-by-day record either way.",
    ].join("\n");
  }

  return [
    `The site answered again at ${when(run.at)} UTC${where}: ${describeRun(run)}.`,
    "",
    `It did not at ${when(previous.at)} UTC, and the table below holds both.`,
  ].join("\n");
}

/**
 * What the script should do with the issues it was handed.
 *
 * One decision, made here rather than in the script, so the part that talks to
 * GitHub is a list of ifs with nothing to decide. A log that does not exist is
 * created; a log that exists is brought up to date, and answered only when the
 * verdict changed.
 *
 * @param {{ run?: Run|null, issues?: Issue[], site?: string }} [state]
 * @returns {{ action: "create"|"update", number?: number, title: string, body: string, comment: string }}
 */
export function upkeepDecision({ run = null, issues = [], site = "" } = {}) {
  const list = Array.isArray(issues) ? issues : [];
  const existing = list.find((issue) => issue && issue.title === UPTIME_LOG_TITLE);
  const history = existing ? parseHistory(existing.body) : [];
  const entries = appendRun(history, run, HISTORY_KEPT);
  const body = renderLog({ site, entries });

  if (!existing) {
    return { action: "create", title: UPTIME_LOG_TITLE, body, comment: "" };
  }

  return {
    action: "update",
    number: Number(existing.number),
    title: UPTIME_LOG_TITLE,
    body,
    comment: transitionComment({ previous: history[history.length - 1] ?? null, run, site }),
  };
}
