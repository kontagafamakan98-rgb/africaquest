import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  ERROR_LOG_KEY,
  ERROR_LOG_LIMIT,
  ERROR_MESSAGE_LIMIT,
  ERROR_WHERE_LIMIT,
  FAILURE_PLACES,
  clearFailures,
  failureCount,
  recentFailures,
  recordFailure,
  watchWindowFailures,
} from "./error-log.js";

// The last few things that failed, kept on the device.
//
// A crash screen writes down the failure it is showing, and reloading the page
// is the one thing that screen offers, so the list is kept in the tab's own
// session storage: still there after a reload, gone when the tab is closed, and
// carried into the report a teacher exports. The tests below are about what
// makes that acceptable: that the memory is bounded whatever happens to it - a
// loop that throws a thousand times must not grow it or empty it - that what
// comes back out of storage is read as a stranger wrote it, and that it holds
// nothing about the reader and goes nowhere.
//
// The tests pass their own moments, so a list built twice is one list.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const MOMENT = "2026-09-29T20:15:00.000Z";

/** A failure at a known moment, so nothing here depends on the clock. */
const at = (extra = {}) =>
  recordFailure(new Error("Cannot read properties of undefined (reading 'gallery')"), {
    where: "LevelGallery",
    at: new Date(MOMENT),
    ...extra,
  });

/**
 * A stand-in for the tab's storage, which the test runner does not have.
 *
 * Shaped like the real thing and no more: what this module may do with storage
 * is get, set and remove by key, and a stand-in that offered anything else would
 * be testing a browser this application does not run in.
 */
function tabStorage(initial = {}) {
  const held = new Map(Object.entries(initial));
  return {
    getItem: (key) => (held.has(key) ? held.get(key) : null),
    setItem: (key, value) => held.set(key, String(value)),
    removeItem: (key) => held.delete(key),
  };
}

/**
 * The module as a page that has just been built would have it: a second copy,
 * with nothing in it but what it reads back. Two of these with one storage
 * between them are what a reload is, and the counter in the query is what stops
 * the runner handing back the copy it already has.
 */
let built = 0;
const rebuilt = () => import(`./error-log.js?built=${(built += 1)}`);

test("a failure is a name, a message and where it happened, and nothing else", () => {
  clearFailures();
  const error = new TypeError("Cannot read properties of undefined (reading 'gallery')");
  error.stack = [
    "TypeError: Cannot read properties of undefined (reading 'gallery')",
    "    at LevelGallery (http://localhost/assets/LevelGallery.js:42:11)",
  ].join("\n");

  const entry = recordFailure(error, {
    where: "\n    at LevelGallery\n    at QuizScreen\n",
    at: new Date(MOMENT),
  });

  // A component stack arrives as several frames; the first one is the screen
  // that was being drawn, which is the fact worth keeping.
  assert.equal(entry.where, "LevelGallery");
  assert.equal(entry.name, "TypeError");
  assert.equal(entry.message, "Cannot read properties of undefined (reading 'gallery')");
  assert.equal(entry.at, MOMENT);
  assert.equal(entry.count, 1);
  // Exactly these six fields: a field added "just in case" is how a log of what
  // broke turns into a record of who was using it.
  assert.deepEqual(Object.keys(entry).sort(), ["at", "count", "message", "name", "where"]);

  // A place that is not a stack is kept as it was written. The three the
  // application reports from itself are codes, and the report translates them;
  // a screen's name is code as well, and reads the same in every language.
  assert.equal(recordFailure("boom", { where: FAILURE_PLACES.window, at: new Date(MOMENT) }).where, FAILURE_PLACES.window);
  assert.deepEqual(Object.values(FAILURE_PLACES), ["failurePlaceSave", "failurePlaceWindow", "failurePlacePromise"]);
  const thrown = recordFailure({ anything: true }, { at: new Date(MOMENT) });
  assert.equal(thrown.name, "Error");
  assert.ok(thrown.message.length > 0, "a value that is not an error still says something");
  assert.equal(recordFailure(null, { at: new Date(MOMENT) }).message, "no message");
});

test("the log is bounded, and a failure that repeats is counted instead of stored", () => {
  clearFailures();

  // More distinct failures than the log holds: the oldest are the ones that go,
  // and what is left is the newest first.
  for (let index = 0; index < ERROR_LOG_LIMIT + 5; index += 1) {
    recordFailure(new Error(`failure ${index}`), { where: "LevelGallery", at: new Date(MOMENT) });
  }
  const kept = recentFailures();
  assert.equal(kept.length, ERROR_LOG_LIMIT);
  assert.equal(kept[0].message, `failure ${ERROR_LOG_LIMIT + 4}`, "the newest failure is first");
  assert.equal(kept.at(-1).message, "failure 5");
  assert.equal(failureCount(), ERROR_LOG_LIMIT, "five failures were forgotten, not seven");

  // And a loop that throws the same failure a thousand times is one line with a
  // count on it: the log cannot grow, and it cannot push the rest of the story
  // out either.
  clearFailures();
  for (let index = 0; index < 1000; index += 1) {
    recordFailure(new Error("stuck"), { where: "LevelGallery", at: new Date(MOMENT) });
  }
  assert.equal(recentFailures().length, 1, "a failure that keeps happening filled the whole log");
  assert.equal(recentFailures()[0].count, 1000);
  assert.equal(failureCount(), 1000, "the count is what says it keeps happening");
  // It also moves back to the front: a failure that has just happened again is
  // the news, whatever else is in the log.
  recordFailure(new Error("later"), { where: "LevelGallery", at: new Date(MOMENT) });
  assert.equal(recentFailures()[0].message, "later");
  assert.equal(recentFailures()[1].count, 1000);

  // A message is capped, so one enormous error cannot hold the memory either.
  clearFailures();
  const long = recordFailure(new Error("x".repeat(ERROR_MESSAGE_LIMIT * 3)), { at: new Date(MOMENT) });
  assert.equal(long.message.length, ERROR_MESSAGE_LIMIT);
  assert.ok(recentFailures().every((entry) => entry.message.length <= ERROR_MESSAGE_LIMIT));

  // What a caller takes away is a copy: the log cannot be edited from outside.
  recentFailures()[0].message = "edited";
  assert.equal(recentFailures()[0].message, long.message);

  clearFailures();
  assert.deepEqual(recentFailures(), []);
  assert.equal(failureCount(), 0);
});

test("the log keeps the tab's session, and sends nothing anywhere", () => {
  // The claim is the feature, and it is now a precise one: the list lives in the
  // tab's own session storage, which is why a reload does not take it away and
  // why closing the tab does. Every other way of keeping something - the storage
  // that outlives the visit, a database, a cookie - is a register of what people
  // were doing rather than a memory of what broke, so none of them may appear
  // here, and neither may a request.
  const source = readFileSync(path.join(import.meta.dirname, "error-log.js"), "utf8");
  assert.match(source, /\bsessionStorage\b/, "the log no longer says where the session keeps it");
  for (const forbidden of [
    "localStorage",
    "indexedDB",
    "document.cookie",
    "fetch(",
    "XMLHttpRequest",
    "sendBeacon",
    "navigator",
  ]) {
    assert.equal(source.includes(forbidden), false, `the failure log uses ${forbidden}`);
  }

  // The name it writes under is the name the README gives, so where the browser
  // puts the list and what the file says about it cannot drift apart.
  assert.ok(source.includes(`"${ERROR_LOG_KEY}"`), "the log writes under a name of its own");
  const readme = readFileSync(path.join(ROOT, "README.md"), "utf8");
  assert.match(readme, new RegExp(ERROR_LOG_KEY), "the README no longer says where the log is kept");
  assert.match(readme, /tab is closed/, "the README no longer says when it is gone");

  // What it holds is about the application rather than about the reader: an
  // error's own name and message, the screen that was being drawn, the moment,
  // and how often. Five fields and no sixth, which is where a name typed into a
  // field, an answer given, or a location would have had to live.
  clearFailures();
  const entry = at();
  assert.deepEqual(Object.keys(entry).sort(), ["at", "count", "message", "name", "where"]);
  assert.equal("address" in entry || "stack" in entry || "component" in entry, false);
});

test("one failure that two watchers explain is one line, from the nearer place", () => {
  clearFailures();

  // A render error reaches two watchers: the page, because React rethrows it to
  // the window, and the boundary, which knows which screen was being drawn. The
  // rethrow comes first, so the vaguer report is the earlier one - which is
  // exactly why the merge cannot keep whichever arrived first, and the order is
  // asserted both ways below.
  const crashed = new TypeError("Cannot read properties of undefined (reading 'gallery')");
  const componentStack = "\n    at LevelGallery (http://localhost:5173/src/game/LevelGallery.jsx:42:11)\n";

  recordFailure(crashed, { where: FAILURE_PLACES.window, at: new Date(MOMENT) });
  const described = recordFailure(crashed, { where: componentStack, at: new Date(Date.parse(MOMENT) + 9) });

  assert.equal(recentFailures().length, 1, "one failure was written down twice");
  assert.equal(described.where, "LevelGallery", "the vaguer of the two places was kept");
  assert.equal(described.count, 2, "the second report is not counted");

  // And the same in the other order, since React's timing is not a promise.
  clearFailures();
  recordFailure(crashed, { where: componentStack, at: new Date(MOMENT) });
  const later = recordFailure(crashed, { where: FAILURE_PLACES.window, at: new Date(Date.parse(MOMENT) + 9) });
  assert.equal(later.where, "LevelGallery", "a screen that named itself lost to the page");
  assert.equal(later.count, 2);

  // A moment is a moment: the same message half a minute later is another
  // failure, and it gets its own line.
  recordFailure(crashed, { where: FAILURE_PLACES.window, at: new Date(Date.parse(MOMENT) + 30_000) });
  assert.equal(recentFailures().length, 2);
  assert.equal(recentFailures()[0].where, FAILURE_PLACES.window);

  // And what a development build writes after the name - the file, the line -
  // is dropped: what the report prints is the screen.
  assert.doesNotMatch(recentFailures()[1].where, /http|\d+:\d+/);
});

test("the failures nobody caught are caught here", () => {
  clearFailures();

  // The two the boundary above the router never sees: an error thrown outside a
  // render, and a promise nobody handled.
  const listeners = new Map();
  const target = {
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type) => listeners.delete(type),
  };

  const stop = watchWindowFailures(target);
  assert.deepEqual([...listeners.keys()].sort(), ["error", "unhandledrejection"]);

  listeners.get("error")({ error: new Error("thrown on the page") });
  listeners.get("unhandledrejection")({ reason: new Error("nobody was listening") });
  assert.deepEqual(
    recentFailures().map((entry) => entry.where),
    [FAILURE_PLACES.promise, FAILURE_PLACES.window],
    "the two uncaught failures are logged, newest first"
  );
  assert.equal(recentFailures()[0].message, "nobody was listening");
  assert.equal(recentFailures()[1].message, "thrown on the page");

  // An event that carries nothing usable is still a failure that happened, and
  // one that carries no error object at all is read from what it does carry.
  listeners.get("error")({ message: "Script error." });
  assert.equal(recentFailures()[0].name, "Error");
  assert.match(recentFailures()[0].message, /Script error/);

  // And the listeners are removed by what the installer returned, so a page that
  // unmounts everything does not leave a log behind it.
  assert.equal(stop(), undefined);
  assert.equal(listeners.size, 0);
  // A place with no window at all - the test runner, a build machine - is not an
  // error: there is simply nothing to listen to.
  assert.equal(typeof watchWindowFailures(null), "function");
});

test("every place the log records from is worded in both languages", () => {
  // The three places the application reports from itself are written down as
  // translation keys, and the report words them with the language on screen. A
  // code that is not in the dictionary is printed as itself, which is how a
  // report ends up saying "failurePlacePromise" in front of a teacher, so each one
  // is held against the dictionary here: twice, which is once in English and once
  // in French.
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  for (const key of Object.values(FAILURE_PLACES)) {
    const written = dictionary.match(new RegExp(`\\b${key}:`, "g")) || [];
    assert.equal(written.length, 2, `${key} is written ${written.length} time(s) in the dictionary`);
  }
});

test("the log outlives a reload, which is where a crash screen sends the reader", async () => {
  // A reload builds the page again from nothing, this module included, and the
  // crash screen's one button is a reload. So the reader would otherwise lose the
  // failure at the exact moment they decided to look for it. Two copies of the
  // module with one storage between them are what a reload is.
  const store = tabStorage();
  globalThis.sessionStorage = store;
  try {
    const before = await rebuilt();
    before.clearFailures();
    before.recordFailure(new Error("Cannot read properties of undefined"), {
      where: "LevelGallery",
      at: new Date(MOMENT),
    });
    before.recordFailure(new Error("Cannot read properties of undefined"), {
      where: "LevelGallery",
      at: new Date(MOMENT),
    });
    assert.equal(before.recentFailures()[0].count, 2, "the two reports were not counted as one failure");

    // What the tab holds is the bounded list itself, five fields per entry, so a
    // reload can never be how a sixth one gets in.
    const written = JSON.parse(store.getItem(ERROR_LOG_KEY));
    assert.equal(written.length, 1);
    assert.deepEqual(Object.keys(written[0]).sort(), ["at", "count", "message", "name", "where"]);

    const after = await rebuilt();
    const kept = after.recentFailures();
    assert.equal(kept.length, 1, "the reload lost the failure it was meant to keep");
    assert.equal(kept[0].name, "Error");
    assert.equal(kept[0].where, "LevelGallery");
    assert.equal(kept[0].count, 2);
    assert.equal(kept[0].at, MOMENT);
    assert.equal(after.failureCount(), 2);

    // And the same failure after the reload is still that one failure: a crash
    // loop that reloads the page becomes one line with a count on it rather than
    // twelve lines and no room for anything else.
    after.recordFailure(new Error("Cannot read properties of undefined"), {
      where: "LevelGallery",
      at: new Date(Date.parse(MOMENT) + 60_000),
    });
    assert.equal(after.recentFailures().length, 1);
    assert.equal(after.recentFailures()[0].count, 3);

    // The tab is the thing that ends this, and it ends it by taking the storage
    // with it. What can be checked here is the half that is this module's: a log
    // that is cleared leaves nothing behind to be found again.
    after.clearFailures();
    assert.equal(store.getItem(ERROR_LOG_KEY), null, "a cleared log left its copy in the tab");
    assert.deepEqual(after.recentFailures(), []);
  } finally {
    delete globalThis.sessionStorage;
  }
});

test("what the tab hands back is read as a stranger wrote it", async () => {
  // Session storage belongs to whoever is holding the device, so the list read
  // back is not evidence: it is text. Everything in it is parsed behind a guard,
  // rebuilt into the fields this module knows, and capped again on the way in.
  const entries = [
    { at: MOMENT, name: "TypeError", message: "boom", where: "LevelGallery", count: 4, address: "not stored" },
    { at: MOMENT, name: "Error", message: "y", where: "Z".repeat(ERROR_WHERE_LIMIT * 6), count: 0 },
    { at: MOMENT, name: "Error", message: "x".repeat(ERROR_MESSAGE_LIMIT * 5) },
    "not an entry at all",
    null,
    42,
    { name: "   ", message: "" },
    { count: 3 },
    [],
  ];
  const store = tabStorage({ [ERROR_LOG_KEY]: JSON.stringify(entries) });
  globalThis.sessionStorage = store;
  try {
    const log = await rebuilt();
    const kept = log.recentFailures();

    // Three of those nine are failures: the six that say nothing - a string, a
    // null, a number, an empty name, a bare count, an array - are not.
    assert.equal(kept.length, 3, "a value that is not a failure was kept as one");
    for (const entry of kept) {
      assert.deepEqual(Object.keys(entry).sort(), ["at", "count", "message", "name", "where"]);
    }
    assert.equal("address" in kept[0], false, "a field the log does not know came back with it");
    assert.equal(kept[0].count, 4, "a count that was a count was thrown away");
    assert.equal(kept[1].where.length, ERROR_WHERE_LIMIT, "a stored place was longer than a place");
    assert.equal(kept[1].count, 1, "a count that was not a count is not a count");
    assert.equal(kept[2].message.length, ERROR_MESSAGE_LIMIT);
    assert.equal(kept[2].where, "");

    // And the ceiling is the ceiling whatever the tab hands over: twelve
    // entries, and no more because they arrived written down.
    const many = tabStorage({
      [ERROR_LOG_KEY]: JSON.stringify(
        Array.from({ length: ERROR_LOG_LIMIT * 3 }, (_, index) => ({ name: "Error", message: `failure ${index}` }))
      ),
    });
    globalThis.sessionStorage = many;
    const other = await rebuilt();
    assert.equal(other.recentFailures().length, ERROR_LOG_LIMIT);

    // Something that is not a list at all, and something that is not even JSON,
    // are both an empty log rather than a broken page.
    globalThis.sessionStorage = tabStorage({ [ERROR_LOG_KEY]: "{\"not\":\"a list\"}" });
    assert.deepEqual((await rebuilt()).recentFailures(), []);
    globalThis.sessionStorage = tabStorage({ [ERROR_LOG_KEY]: "{ truncated" });
    assert.deepEqual((await rebuilt()).recentFailures(), []);
  } finally {
    delete globalThis.sessionStorage;
  }
});

test("a browser that will not keep the log still leaves a log to read", async () => {
  // Private browsing, a school that blocks storage, a quota of its own: none of
  // them is a failure the reader should be shown, and none of them may take the
  // log in front of them away. Every touch of storage is guarded for that.
  const refusing = {
    getItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
    removeItem: () => {
      throw new Error("SecurityError");
    },
  };
  globalThis.sessionStorage = refusing;
  try {
    const log = await rebuilt();
    assert.equal(log.recordFailure(new Error("boom"), { where: "LevelGallery", at: new Date(MOMENT) }).count, 1);
    assert.equal(log.recentFailures().length, 1, "a refused write lost the failure in front of us");
    log.recordFailure(new Error("boom"), { where: "LevelGallery", at: new Date(MOMENT) });
    assert.equal(log.recentFailures()[0].count, 2);
    log.clearFailures();
    assert.deepEqual(log.recentFailures(), []);
  } finally {
    delete globalThis.sessionStorage;
  }

  // And a browser that refuses the property itself, rather than the call on it:
  // reading storage is where a blocked one throws first, so that read is inside
  // the guard too.
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    get: () => {
      throw new Error("blocked");
    },
  });
  try {
    const log = await rebuilt();
    assert.equal(log.recordFailure(new Error("boom"), { at: new Date(MOMENT) }).count, 1);
    assert.equal(log.recentFailures().length, 1);
    assert.doesNotThrow(() => log.clearFailures());
  } finally {
    delete globalThis.sessionStorage;
  }
});
