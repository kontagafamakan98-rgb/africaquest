/**
 * The last few things that failed, kept on the device, for whoever has to
 * explain them.
 *
 * An application that draws everything on the reader's own device has no server
 * log to look at afterwards. When something goes wrong the only witness is the
 * person in front of the screen, and the person in front of the screen is
 * usually a child, or a teacher who has thirty of them. So the crash screen
 * writes down the failure it is showing - and then a reload takes it away, which
 * is exactly the moment somebody would want it: reloading the page is the one
 * thing that screen offers.
 *
 * This is the small memory that survives that: the last few failures, newest
 * first, added to by everything that can fail - a screen that could not be
 * drawn, a browser that refused to save, an error nobody caught - and carried
 * into the progress report a teacher exports. The person who has to explain what
 * happened then has the facts in front of them rather than a description of
 * them.
 *
 * It is kept for the browser session and no longer than that. Session storage is
 * the tab's own: what is written there is still there after a reload, which is
 * the whole point, and the browser drops it when the tab is closed, which is the
 * promise. Two tabs never read each other's log, nothing outlives the visit, and
 * nothing is sent anywhere. A browser that will not keep it at all - private
 * browsing, a school that blocks storage - is not a failure either: the log
 * still works in memory for as long as the page is open.
 *
 * Four rules keep that from becoming a register of what people were doing.
 *
 * It is bounded twice: twelve failures at most, and each one is a name, a
 * message capped at a couple of hundred characters, and where it happened. A
 * failure that happens again is counted rather than stored again, so a loop that
 * throws a thousand times cannot push the beginning out of the log or make it
 * grow.
 *
 * What comes back is read as a stranger wrote it. Session storage belongs to
 * whoever is holding the device, so the stored list is parsed behind a guard,
 * every entry is rebuilt into the five fields this module knows and nothing
 * else, and each field is capped again on the way in. A sixth field would be
 * exactly where a name typed into a field, or an answer given, could be smuggled
 * into a report.
 *
 * And what is kept is about the application, not about the reader: an error's
 * own name and message, and which screen was being drawn. Never an answer
 * given, never a name typed, never an address.
 *
 * Plain module: the browser and the tests both read it. The moment a failure
 * happened defaults to now and is passed in by every caller that knows it better,
 * which is what lets two runs of a test build one list.
 */
import { describeFailure } from "./failure-report.js";

/** How many failures are kept. The rest are older news than the report needs. */
export const ERROR_LOG_LIMIT = 12;

/** How long one message may be, after the reader in failure-report.js has trimmed it. */
export const ERROR_MESSAGE_LIMIT = 180;

/** How long the place a failure came from may be, screen name included. */
export const ERROR_WHERE_LIMIT = 60;

/** How long the name of a failure may be, matching the reader in failure-report.js. */
const ERROR_NAME_LIMIT = 40;

/** How long the moment of a failure may be. An ISO stamp is twenty-four characters. */
const ERROR_AT_LIMIT = 40;

/**
 * Where the tab keeps the log it wants to find again.
 *
 * Named like the other keys the application writes - `aq_progress_v1` for the
 * progress, `aq_lang` for the language - with the version in the name, so a
 * later shape of this list can be told apart from this one instead of being read
 * as it.
 */
export const ERROR_LOG_KEY = "aq_failures_v1";

/**
 * The places the application itself reports from, as the names the report
 * translates. A screen that failed to be drawn is not one of these: its place is
 * the name of the component, which is code rather than wording and reads the
 * same in every language.
 */
export const FAILURE_PLACES = {
  save: "failurePlaceSave",
  window: "failurePlaceWindow",
  promise: "failurePlacePromise",
};

/**
 * How close two reports of one failure are, in milliseconds.
 *
 * One failure can reach the log twice, from two watchers: React re-throws a
 * render error to the window in development, so the boundary and the page both
 * see it, and a browser reports an unhandled rejection for a promise that a
 * screen did in fact handle. Inside this moment they are one failure.
 */
const MOMENT_MS = 1000;

/** The places that say what the application was doing rather than where it broke. */
const GENERIC_PLACES = new Set(Object.values(FAILURE_PLACES));

/** The last failures, newest first. */
const failures = [];

/** Whether what the tab was already keeping has been read into this module. */
let restored = false;

/**
 * The tab's own storage, or nothing at all.
 *
 * A browser that blocks storage can throw on the property itself rather than on
 * the call, which is why the read is inside the guard too, and a place with no
 * session storage at all - the test runner, a build machine - answers nothing
 * rather than failing: the log is still a log without it.
 */
function sessionStore() {
  try {
    const store = globalThis.sessionStorage;
    if (!store) return null;
    if (typeof store.getItem !== "function" || typeof store.setItem !== "function") return null;
    return store;
  } catch {
    return null;
  }
}

/**
 * Where a failure came from, from either shape a caller has: a plain place, or
 * the component stack React hands a boundary, whose first line is the screen
 * being drawn when it broke.
 *
 * A development build writes the file and the line after the component's name,
 * in brackets; the name is what a reader needs and what the report prints, and a
 * path from somebody's machine is neither.
 */
function whereOf(where) {
  if (typeof where !== "string") return "";
  const first = where
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line !== "");
  return (first || "")
    .replace(/^\s*at\s+/, "")
    .replace(/\s*\(.*$/, "")
    .slice(0, ERROR_WHERE_LIMIT);
}

/**
 * One stored entry, rebuilt into the five fields this module keeps.
 *
 * Storage belongs to whoever is holding the device, so nothing read back is
 * trusted: a value that is not an object is dropped, the caps are applied again
 * - a stored message is not a licence to keep a megabyte - a count that is not a
 * count becomes one, and a sixth field simply does not survive, because the
 * entry is built here rather than passed through.
 */
function cleanEntry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const name = typeof value.name === "string" ? value.name.trim().slice(0, ERROR_NAME_LIMIT) : "";
  const message = typeof value.message === "string" ? value.message.slice(0, ERROR_MESSAGE_LIMIT) : "";
  // A line with neither a name nor a message says nothing at all, so it is not
  // a failure that is worth keeping the slot of.
  if (name === "" && message === "") return null;
  return {
    at: typeof value.at === "string" ? value.at.slice(0, ERROR_AT_LIMIT) : "",
    name: name || "Error",
    message,
    where: typeof value.where === "string" ? value.where.slice(0, ERROR_WHERE_LIMIT) : "",
    count: Number.isInteger(value.count) && value.count > 0 ? value.count : 1,
  };
}

/**
 * Writes the log where the tab keeps its session, so that a reload - the one
 * thing the crash screen offers - does not take it away.
 *
 * Session storage is memory the browser holds for this tab rather than a file
 * somewhere: a loop that throws a thousand times pays for a thousand small
 * writes to memory and nothing else, and the record it writes is the bounded
 * list above, which cannot grow.
 */
function keepFailures() {
  const store = sessionStore();
  if (!store) return;
  try {
    store.setItem(ERROR_LOG_KEY, JSON.stringify(failures));
  } catch {
    // A browser with no room left, or none at all: the log in front of us is the
    // log, and a reader losing it at the next reload is better than a screen
    // that breaks while trying to remember a screen that broke.
  }
}

/**
 * The list the tab was already keeping, read once, when this module is first
 * asked for anything.
 *
 * A reload builds the page again from nothing, so this is the one moment the log
 * can come back: everything read here is rebuilt through cleanEntry, because the
 * only thing a stored list is guaranteed to be is somebody else's text.
 */
function restoreFailures() {
  if (restored) return;
  restored = true;

  const store = sessionStore();
  if (!store) return;

  let raw = null;
  try {
    raw = store.getItem(ERROR_LOG_KEY);
  } catch {
    return;
  }
  if (typeof raw !== "string" || raw === "") return;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(parsed)) return;

  const kept = parsed.map(cleanEntry).filter(Boolean).slice(0, ERROR_LOG_LIMIT);
  if (kept.length > 0) failures.push(...kept);
}

/** Whether two entries are the same failure happening again. */
function sameFailure(one, other) {
  return one.name === other.name && one.message === other.message && one.where === other.where;
}

/** How far apart two moments are, or endless when one of them cannot be read. */
function gapBetween(one, other) {
  const first = Date.parse(one);
  const second = Date.parse(other);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return Number.POSITIVE_INFINITY;
  return Math.abs(first - second);
}

/**
 * One failure, written down. Returns the entry as it now stands in the log,
 * which is the same one when the failure has happened before.
 *
 * The message is trimmed by the same reader the crash screen uses, so the line
 * in the report and the line on the screen are one text rather than two that
 * almost agree.
 *
 * A failure that repeats after a reload finds the entry the reload kept - the
 * name, the message and the place are the same three strings they were - and is
 * counted on it rather than written beside it, which is what stops a crash loop
 * that reloads the page from filing twelve lines and forgetting the rest of the
 * story.
 */
export function recordFailure(error, { where = "", at = new Date() } = {}) {
  restoreFailures();

  const described = describeFailure(error, { at });
  const entry = {
    at: described.at || "",
    name: described.name,
    message: described.message.slice(0, ERROR_MESSAGE_LIMIT),
    where: whereOf(where),
  };

  const seen = failures.findIndex(
    (kept) =>
      sameFailure(kept, entry) ||
      // The same failure arriving twice in a moment, from the boundary and from
      // the page: one line, because one broken screen reported twice is not two
      // failures, and a log that listed it twice would read as a worse day than
      // it was.
      (kept.name === entry.name &&
        kept.message === entry.message &&
        gapBetween(kept.at, entry.at) <= MOMENT_MS)
  );
  if (seen >= 0) {
    // Counted, and moved to the front: what the reader needs to know is that
    // this keeps happening, and when it happened last.
    const kept = failures[seen];
    kept.count += 1;
    kept.at = entry.at;
    // And the place is the precise one. React rethrows a render error to the
    // window before it hands the same error to the boundary, so the vaguer report
    // usually arrives first, and a log that kept whichever came first would say
    // "an error nobody caught" about a screen that said exactly where it broke.
    if (GENERIC_PLACES.has(kept.where) && !GENERIC_PLACES.has(entry.where)) kept.where = entry.where;
    failures.splice(seen, 1);
    failures.unshift(kept);
    keepFailures();
    return { ...kept };
  }

  failures.unshift({ ...entry, count: 1 });
  if (failures.length > ERROR_LOG_LIMIT) failures.length = ERROR_LOG_LIMIT;
  keepFailures();
  return { ...failures[0] };
}

/**
 * The last failures, newest first, as copies: a caller cannot edit the log.
 *
 * The first of these is also the first read of the tab's stored list, so a
 * report built straight after a reload carries what happened before it.
 */
export function recentFailures(limit = ERROR_LOG_LIMIT) {
  restoreFailures();
  const wanted = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : ERROR_LOG_LIMIT;
  return failures.slice(0, wanted).map((entry) => ({ ...entry }));
}

/** How many failures have been logged altogether, repeats included. */
export function failureCount() {
  restoreFailures();
  return failures.reduce((total, entry) => total + entry.count, 0);
}

/**
 * Forgets everything, which is what the tests do between two of their own runs
 * and what a device handed to somebody else would need. Nothing calls it on the
 * way past: a log that clears itself is a log nobody can read.
 *
 * What the tab was keeping goes with it, or the next write would put it back.
 */
export function clearFailures() {
  failures.length = 0;
  // Nothing is read back after this, not even on the next write: cleared means
  // cleared, and a stored list that came back here would be the one thing this
  // function is named against.
  restored = true;

  const store = sessionStore();
  if (!store) return;
  try {
    store.removeItem(ERROR_LOG_KEY);
  } catch {
    // Nothing was kept, or nothing can be removed: either way there is nothing
    // left to forget.
  }
}

/**
 * The failures the application never sees coming: one thrown outside a render,
 * and a promise nobody caught. Both are the kind that leave a reader staring at
 * a screen that stopped moving, and neither reaches the boundary above the
 * router.
 *
 * The listeners are installed by the status layer, once, and removed by the
 * function this returns, so a test - or a page that unmounts everything - does
 * not leave them behind.
 */
export function watchWindowFailures(target = typeof window === "undefined" ? null : window) {
  if (!target || typeof target.addEventListener !== "function") return () => {};

  const onError = (event) => {
    recordFailure(event?.error || event?.message || "an error event", { where: FAILURE_PLACES.window });
  };
  const onRejection = (event) => {
    recordFailure(event?.reason || "a promise that failed", { where: FAILURE_PLACES.promise });
  };

  target.addEventListener("error", onError);
  target.addEventListener("unhandledrejection", onRejection);

  return () => {
    target.removeEventListener("error", onError);
    target.removeEventListener("unhandledrejection", onRejection);
  };
}
