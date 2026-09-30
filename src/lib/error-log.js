/**
 * The last few things that failed, kept on the device, for whoever has to
 * explain them.
 *
 * An application that draws everything on the reader's own device has no server
 * log to look at afterwards. When something goes wrong the only witness is the
 * person in front of the screen, and the person in front of the screen is
 * usually a child, or a teacher who has thirty of them. So the crash screen
 * writes down the failure it is showing - and then a reload takes it away, which
 * is exactly the moment somebody would want it.
 *
 * This is the small memory that survives that: the last few failures, newest
 * first, added to by everything that can fail - a screen that could not be
 * drawn, a browser that refused to save, an error nobody caught - and carried
 * into the progress report a teacher exports. The person who has to explain what
 * happened then has the facts in front of them rather than a description of
 * them.
 *
 * Four rules keep that from becoming a register of what people were doing.
 *
 * It is bounded twice: twelve failures at most, and each one is a name, a
 * message capped at a couple of hundred characters, and where it happened. A
 * failure that happens again is counted rather than stored again, so a loop that
 * throws a thousand times cannot push the beginning out of the log or make it
 * grow.
 *
 * Nothing is written to storage and nothing is sent: the list lives in memory,
 * it is gone when the tab is closed, and there is no key, no file and no
 * request anywhere in this module - which its tests check, because that is the
 * claim, and the claim is the feature.
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
 */
export function recordFailure(error, { where = "", at = new Date() } = {}) {
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
    return { ...kept };
  }

  failures.unshift({ ...entry, count: 1 });
  if (failures.length > ERROR_LOG_LIMIT) failures.length = ERROR_LOG_LIMIT;
  return { ...failures[0] };
}

/** The last failures, newest first, as copies: a caller cannot edit the log. */
export function recentFailures(limit = ERROR_LOG_LIMIT) {
  const wanted = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : ERROR_LOG_LIMIT;
  return failures.slice(0, wanted).map((entry) => ({ ...entry }));
}

/** How many failures have been logged altogether, repeats included. */
export function failureCount() {
  return failures.reduce((total, entry) => total + entry.count, 0);
}

/**
 * Forgets everything, which is what the tests do between two of their own runs
 * and what a device handed to somebody else would need. Nothing calls it on the
 * way past: a log that clears itself is a log nobody can read.
 */
export function clearFailures() {
  failures.length = 0;
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
