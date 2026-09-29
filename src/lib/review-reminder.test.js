import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { countDueReviews } from "../components/game/learning.js";
import { createServiceWorkerSource, REVIEW_TAG } from "../../build/offline-plugin.js";
import {
  REMINDER_KEY,
  REMINDER_MIN_INTERVAL_MS,
  REMINDER_TAG,
  applyBadge,
  disableReminder,
  enableReminder,
  postReminder,
  reminderEnabled,
  reminderMessage,
  reminderPermission,
  reminderSupport,
  reminderWording,
  rememberReminder,
  reviewSchedule,
} from "./review-reminder.js";

// The reminder is the only thing in this application that has to be right while
// the application is closed, and it is built out of two halves that never meet
// in the same process: a page that knows the answers, and a worker the browser
// wakes. What can go wrong is therefore always a drift between the two, or a
// promise made to the player that nothing keeps: a count that lags behind the
// game, a notification for something that is not due, or a switch that says on
// while nothing can be raised. Each of those is held here.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const MINUTE = 60 * 1000;
const DAY = 24 * MINUTE;
const NOW = 1_700_000_000_000;

const LEVELS = [
  {
    id: 1,
    title: "Level one",
    region: "North",
    questions: [{ question: "q1" }, { question: "q2" }, { question: "q3" }],
  },
  {
    id: 2,
    title: "Level two",
    region: "South",
    questions: [{ question: "q4" }, { question: "q5" }],
  },
];

const worker = (options = {}) =>
  createServiceWorkerSource({ shell: ["/index.html"], images: [], version: "v", ...options });

test("the schedule is the moments the rotation comes back, and how many are due now", () => {
  const schedule = reviewSchedule(
    {
      // Never missed: not in the rotation at all, so not in the list either.
      "1:0": { right: 4, wrong: 0 },
      // Missed, and due ten minutes ago.
      "1:1": { right: 0, wrong: 2, stage: 0, dueAt: NOW - 10 * MINUTE },
      // Missed, and scheduled for tomorrow.
      "2:0": { right: 1, wrong: 1, stage: 1, dueAt: NOW + DAY },
      "2:1": { right: 2, wrong: 3, stage: 2, dueAt: NOW + 3 * DAY },
    },
    LEVELS,
    NOW
  );

  assert.deepEqual(schedule.times, [NOW - 10 * MINUTE, NOW + DAY, NOW + 3 * DAY], "in the order they come back");
  assert.equal(schedule.at, NOW, "and stamped with the moment it was counted");
  assert.equal(schedule.due, 1, "one question is behind us");

  // The number on the icon and the number on the review tab are the same fact,
  // and they are computed from two different walks of the game: the count the
  // player reads inside has to be the count on the launcher, or the icon is
  // telling them something the game contradicts.
  const stats = {
    "1:1": { right: 0, wrong: 2, stage: 0, dueAt: NOW - 10 * MINUTE },
    "2:0": { right: 1, wrong: 1, stage: 1, dueAt: NOW + DAY },
  };
  assert.equal(
    reviewSchedule(stats, LEVELS, NOW).due,
    countDueReviews(stats, LEVELS, NOW),
    "the count on the icon is the count in the game"
  );

  // A moment that is not a moment - a stored record the app cannot make sense of
  // - is dropped rather than carried to the worker as a question due forever.
  const odd = reviewSchedule({ "1:1": { right: 0, wrong: 1, dueAt: Infinity } }, LEVELS, NOW);
  assert.deepEqual(odd.times, []);
  assert.equal(odd.due, 0);
});

test("the worker is given the wording, and one place to put the count of the day", () => {
  const dict = { reminderNotifyTitle: "T", reminderNotifyOne: "1", reminderNotifyMany: "%d x" };
  const wording = reminderWording(dict);
  assert.deepEqual(wording, { title: "T", one: "1", many: "%d x" });

  // A dictionary without these wordings still produces a notification rather
  // than the word "undefined" on a lock screen.
  for (const value of Object.values(reminderWording({}))) {
    assert.ok(typeof value === "string" && value.trim().length > 0);
  }

  const message = reminderMessage({ at: NOW, times: [NOW + DAY], due: 0 }, wording);
  assert.equal(message.type, "review-schedule");
  assert.deepEqual(message.times, [NOW + DAY]);
  assert.equal(message.title, "T", "the wording travels with the schedule");
  assert.equal(message.one, "1");

  // Both languages carry exactly one %d in the counted form: the count on the
  // day of the notification is not the count of the day it was handed over, so
  // the worker substitutes it, and a wording with no %d would lose the number.
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  for (const forms of [["reminderNotifyOne", "reminderNotifyMany"]]) {
    for (const key of forms) {
      assert.equal(
        [...dictionary.matchAll(new RegExp(`^ {4}${key}:`, "gm"))].length,
        2,
        `${key} is not written in both languages`
      );
    }
  }
  assert.equal(
    [...dictionary.matchAll(/%d/g)].length,
    2,
    "the counted form carries one placeholder in each language, and only one"
  );
});

test("nothing here reaches for a browser that is not there", async () => {
  // Every one of these is called from React on a page that may be running under
  // Node, in a browser without a worker, or in one that refuses the badge. None
  // of them may throw: a reminder must never be the reason the game breaks.
  assert.deepEqual(reminderSupport(), { notifications: false, periodic: false, badge: false });
  assert.equal(reminderPermission(), "unsupported");
  assert.equal(reminderEnabled(), false, "no storage, no answer to remember");
  assert.equal(rememberReminder(true), true, "and the answer is still reported back");
  assert.equal(await applyBadge(3), false, "there is no icon to put a count on");
  assert.equal(await postReminder({ type: "review-schedule", times: [] }), false, "and no worker to hand it to");

  const enabled = await enableReminder({ times: [] });
  assert.deepEqual(enabled, { granted: false, periodic: false, reason: "unsupported" });
  assert.equal(await disableReminder(), true, "turning off what was never on is not an error");
});

/**
 * Runs a body with a few browser globals put in place, then puts the real ones
 * back. Node has none of these, so they are borrowed for the length of one test.
 */
async function withBrowser(overrides, run) {
  const saved = Object.keys(overrides).map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
  for (const [name, value] of Object.entries(overrides)) {
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  try {
    return await run();
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
}

/** A browser that has a worker, a permission, an icon and a place to remember an answer. */
function fakeBrowser() {
  const registered = [];
  const posted = [];
  const badges = [];
  const store = new Map();
  const periodicSync = {
    register: async (tag, options) => registered.push({ tag, options }),
    unregister: async (tag) => registered.push({ tag, off: true }),
  };

  function Notification() {}
  Notification.permission = "granted";
  Notification.requestPermission = async () => "granted";

  function ServiceWorkerRegistration() {}
  ServiceWorkerRegistration.prototype.periodicSync = periodicSync;

  const navigator = {
    serviceWorker: {
      controller: { postMessage: (message) => posted.push(message) },
      getRegistration: async () => ({ periodicSync }),
    },
    setAppBadge: async (count) => badges.push(count),
    clearAppBadge: async () => badges.push(0),
  };

  return {
    registered,
    posted,
    badges,
    globals: {
      navigator,
      Notification,
      ServiceWorkerRegistration,
      localStorage: {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, value),
      },
    },
  };
}

test("a browser with no worker is answered now rather than waited for", async () => {
  // The switch has to answer the player, and "there is no worker here" is an
  // answer. Waiting for `ready` in a browser that will never have one leaves it
  // looking stuck for the length of the wait, which is every development build.
  const reached = [];
  await withBrowser(
    {
      navigator: {
        serviceWorker: {
          controller: null,
          // A promise that never settles, and a record of whether it was even
          // looked at.
          get ready() {
            reached.push("ready");
            return new Promise(() => {});
          },
          getRegistrations: async () => [],
        },
      },
    },
    async () => {
      const started = Date.now();
      assert.equal(await postReminder({ type: "review-schedule", times: [] }), false);
      assert.equal(await applyBadge(2), false, "and there is no icon to count on");
      assert.ok(Date.now() - started < 500, "nothing was waited for");
    }
  );
  assert.deepEqual(reached, [], "the wait the browser never ends was not entered");
});

test("turning the reminder on registers the wake-up, hands over the schedule, counts on the icon", async () => {
  const browser = fakeBrowser();
  // Counted against the clock of the day rather than the fixed one of the other
  // tests: the count that goes on the icon is the count of now.
  const now = Date.now();
  const schedule = { at: now, times: [now - 60 * MINUTE, now + DAY], due: 1 };
  const message = reminderMessage(schedule, reminderWording({}));

  await withBrowser(browser.globals, async () => {
    assert.deepEqual(
      reminderSupport(),
      { notifications: true, periodic: true, badge: true },
      "this browser can do all three things"
    );
    assert.equal(reminderEnabled(), false, "and nothing was asked of the player yet");

    const result = await enableReminder(message);

    // The three gestures, in the order that matters: without the permission
    // nothing can be raised, and without the wake-up the reminder dies with the
    // page. The count of the day - not of the day the schedule was handed over -
    // goes on the icon straight away.
    assert.deepEqual(result, { granted: true, periodic: true, reason: "granted" });
    assert.deepEqual(browser.registered, [
      { tag: REMINDER_TAG, options: { minInterval: REMINDER_MIN_INTERVAL_MS } },
    ]);
    assert.equal(browser.posted.length, 1, "the schedule reaches the worker once");
    assert.deepEqual(browser.posted[0].times, [now - 60 * MINUTE, now + DAY]);
    assert.deepEqual(browser.badges, [1], "one question is already behind the player");
    assert.equal(reminderEnabled(), true, "and the answer is remembered");

    // Turning it off takes all three back, including the count on the icon: a
    // badge that only ever goes up is a lie the player cannot put down.
    assert.equal(await disableReminder(), true);
    assert.deepEqual(browser.registered[1], { tag: REMINDER_TAG, off: true });
    assert.equal(browser.posted.at(-1).type, "review-forget");
    assert.equal(browser.badges.at(-1), 0, "the count comes off the icon");
    assert.equal(reminderEnabled(), false);
  });
});

test("a refused permission leaves the reminder off and nothing registered", async () => {
  const browser = fakeBrowser();
  browser.globals.Notification = Object.assign(function Notification() {}, {
    permission: "default",
    requestPermission: async () => "denied",
  });

  await withBrowser(browser.globals, async () => {
    const result = await enableReminder(reminderMessage({ at: NOW, times: [NOW], due: 1 }, reminderWording({})));
    assert.deepEqual(result, { granted: false, periodic: false, reason: "denied" });
    assert.deepEqual(browser.registered, [], "no wake-up is registered for a reminder that cannot fire");
    assert.deepEqual(browser.badges, [], "and the icon is left alone");
    assert.equal(reminderEnabled(), false, "the switch does not remember a no");
  });
});

/**
 * The reminder half of the generated worker, as something that can be run.
 *
 * The reminder is the one behaviour of this application that no browser here can
 * show: a notification with the page closed is raised by the browser at an hour
 * it chooses, on a device whose permission cannot be granted from a test. So the
 * worker is not read, it is run - the same slice of the same generated source the
 * browser would run, given a browser of its own.
 */
function workerReminder() {
  const source = worker();
  const start = source.indexOf("function stateRequest");
  const end = source.indexOf("// Download the application itself");
  assert.ok(start > 0 && end > start, "the reminder section is still where the tests expect it");

  const constants = [
    `const REVIEW_TAG = ${JSON.stringify(REVIEW_TAG)};`,
    `const REVIEW_STORE = "reminder";`,
    `const REVIEW_ICON = "/icon-192.png";`,
    `const OFFLINE_URL = "/index.html";`,
  ].join("\n");

  // The browser the worker is given: a store that keeps what is put in it, an
  // icon that records what was put on it, and windows the test decides about.
  return (overrides = {}) => {
    const kept = new Map();
    const badges = [];
    const shown = [];

    const handle = (name) => ({
      get: (key) => request(() => kept.get(key)),
      put: (value, key) => request(() => kept.set(key, value)),
      delete: (key) => request(() => kept.delete(key)),
    });
    const request = (run) => {
      const made = {};
      // Deferred, because the worker assigns its handlers after asking.
      queueMicrotask(() => {
        made.result = run();
        made.onsuccess?.();
      });
      return made;
    };
    const indexedDB = {
      open: () => {
        const opened = {};
        queueMicrotask(() => {
          const fresh = !kept.has("#created");
          opened.result = {
            objectStoreNames: { contains: () => fresh },
            createObjectStore: () => kept.set("#created", true),
            transaction: () => ({ objectStore: (name) => handle(name) }),
          };
          if (fresh) opened.onupgradeneeded?.();
          opened.onsuccess?.();
        });
        return opened;
      },
    };

    const self = {
      clients: { matchAll: async () => overrides.windows || [] },
      registration: { showNotification: async (title, options) => shown.push({ title, ...options }) },
      ...overrides.self,
    };
    const navigator = {
      setAppBadge: async (count) => badges.push(count),
      clearAppBadge: async () => badges.push(0),
    };

    const built = new Function(
      "indexedDB",
      "navigator",
      "self",
      `${constants}\n${source.slice(start, end)}\nreturn { dueNow, refreshBadge, remindIfDue, keepSchedule };`
    );
    return { api: built(indexedDB, navigator, self), kept, badges, shown };
  };
}

test("the worker raises the reminder it was given, and stays quiet when it should", async () => {
  const make = workerReminder();
  const now = Date.now();
  const schedule = {
    type: "review-schedule",
    at: now,
    times: [now - 3 * MINUTE, now - MINUTE, now + 3 * DAY],
    title: "Reviews are waiting",
    one: "1 question you missed is due again.",
    many: "%d questions you missed are due again.",
  };

  // Nothing was ever handed over: no notification, and the icon is left clean.
  const empty = make();
  await empty.api.remindIfDue();
  assert.deepEqual(empty.shown, [], "a worker with no schedule says nothing");
  assert.deepEqual(empty.badges, [0], "and takes the count off the icon");

  // A schedule where two moments are behind us: the count of the day goes into
  // the wording, which is the whole reason the sentence carries a %d rather
  // than the count of the moment it was handed over.
  const due = make();
  await due.api.keepSchedule(schedule);
  await due.api.remindIfDue();
  assert.equal(due.shown.length, 1, "one reminder, not one per question");
  assert.deepEqual(due.shown[0], {
    title: "Reviews are waiting",
    body: "2 questions you missed are due again.",
    icon: "/icon-192.png",
    tag: REMINDER_TAG,
    data: { url: "/index.html" },
  });
  assert.deepEqual(due.badges, [2], "and the same count goes on the icon");

  // One question: the form written out in full is used, since not every language
  // says "1 questions".
  const one = make();
  await one.api.keepSchedule({ ...schedule, times: [now - MINUTE, now + DAY] });
  await one.api.remindIfDue();
  assert.equal(one.shown[0].body, "1 question you missed is due again.");

  // The player is looking at the game: the same count is already in front of
  // them, so the notification would be telling them what they are reading.
  const watching = make({ windows: [{ visibilityState: "visible", focused: true }] });
  await watching.api.keepSchedule(schedule);
  await watching.api.remindIfDue();
  assert.deepEqual(watching.shown, [], "a game on screen is not interrupted");
  assert.deepEqual(watching.badges, [2], "which does not stop the count on the icon");

  // A window that is open but in the background is a player who is elsewhere.
  const away = make({ windows: [{ visibilityState: "hidden", focused: false }] });
  await away.api.keepSchedule(schedule);
  await away.api.remindIfDue();
  assert.equal(away.shown.length, 1, "a window behind another one is not a player at the game");

  // Turning the reminder off forgets the schedule rather than leaving a worker
  // ready to raise one for a player who asked it to stop.
  const stopped = make();
  await stopped.api.keepSchedule(schedule);
  await stopped.api.keepSchedule(null);
  await stopped.api.remindIfDue();
  assert.deepEqual(stopped.shown, [], "what was taken back is not raised later");

  // A moment that is not a moment - whatever a future version stores - is not
  // counted as a question that has been waiting since the beginning of time.
  const odd = make();
  await odd.api.keepSchedule({ ...schedule, times: ["yesterday", null, now + DAY] });
  await odd.api.remindIfDue();
  assert.deepEqual(odd.shown, [], "only moments are counted");
});

test("the worker keeps the schedule, raises the reminder and counts on the icon", () => {
  const source = worker();
  const app = readFileSync(path.join(ROOT, "src", "lib", "review-reminder.js"), "utf8");

  // The two halves have to agree on the tag: the page registers its wake-up
  // under one name and the worker answers to it, and a mismatch is a reminder
  // that is registered and never fires, which nothing else would notice.
  assert.equal(REMINDER_TAG, REVIEW_TAG, "the page and the worker register the same tag");
  assert.match(source, new RegExp(`const REVIEW_TAG = "${REVIEW_TAG}";`));
  assert.match(app, new RegExp(`REMINDER_TAG = "${REMINDER_TAG}"`), "and the page registers it under that name");
  assert.match(source, /"periodicsync"/, "the worker answers the browser's wake-up");
  assert.match(source, /event\.tag === REVIEW_TAG/, "and only for its own tag");
  assert.match(source, /"message"/, "the page hands the schedule over as a message");
  assert.match(source, /"review-schedule"/, "which is the message it answers");
  assert.match(source, /"review-forget"/, "and the one that takes it back when the reminder is turned off");

  // Kept where a worker can keep something and the page cannot: close the game,
  // reload the device, and the moments are still there for the next wake-up.
  assert.match(source, /indexedDB\.open\("africa-quest-state", 1\)/);
  assert.match(source, /store\.put\(schedule, "schedule"\)/);
  assert.match(source, /store\.delete\("schedule"\)/);

  // The count on the icon, and the notification it decides to raise.
  assert.match(source, /navigator\.setAppBadge\(count\)/);
  assert.match(source, /navigator\.clearAppBadge/);
  assert.match(source, /self\.registration\.showNotification/);
  assert.match(source, /String\(schedule\.many \|\| \"\"\)\.replace\(\"%d\", String\(count\)\)/, "the count of the day goes in");
  assert.match(source, /count === 1 \? schedule\.one : many/, "the single form is the one written out");

  // And it refuses to say anything that is not true.
  assert.match(source, /if \(!schedule \|\| count === 0\) return/, "nothing due, no notification");
  assert.match(
    source,
    /client\.visibilityState === \"visible\" && client\.focused/,
    "a player looking at the game is not notified about it"
  );
  assert.match(source, /typeof time === \"number\" && time <= now/, "a stored record that is not a moment is not counted");

  // A tap brings the game forward rather than opening a second copy of it.
  assert.match(source, /"notificationclick"/);
  assert.match(source, /windows\.find\(\(client\) => client\.url\.startsWith\(self\.registration\.scope\)\)/);
  assert.match(source, /self\.clients\.openWindow/);

  // And a new version of the worker puts the count back on the icon, since the
  // schedule outlives the version that handed it over.
  assert.match(source, /await self\.clients\.claim\(\);\s*\/\/[^\n]*\n\s*await refreshBadge\(\);|await refreshBadge\(\);/);
});

test("the reminder is offered where the player can ask for it, in both languages", () => {
  const settings = readFileSync(
    path.join(ROOT, "src", "components", "game", "SettingsModal.jsx"),
    "utf8"
  );
  const home = readFileSync(path.join(ROOT, "src", "pages", "Home.jsx"), "utf8");
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  const manifest = JSON.parse(readFileSync(path.join(ROOT, "public", "manifest.json"), "utf8"));

  // A permission can only be asked for from something the reader did, so the
  // switch is the gesture, and the screen has to say what actually happened
  // rather than show a switch that is on while nothing can be raised.
  assert.match(settings, /reminder\.toggle/, "the settings screen carries the switch");
  assert.match(settings, /aria-pressed=\{reminder\.enabled\}/, "which reports its own state");
  assert.match(settings, /reminder\.support\.notifications/, "and says when this browser cannot do it at all");
  assert.match(settings, /reminderNote\(reminder, t\)/, "the explanation under it is shown");
  assert.match(
    settings,
    /return reminder\.enabled \? t\.reminderBrowserDecides : null/,
    "and a reminder that is on says which of the two it can promise"
  );
  assert.match(home, /useReviewReminder\(\{/, "the map keeps the schedule, where every answer is seen");
  assert.match(home, /<SettingsModal/, "the settings sheet is opened from the map");
  assert.match(home, /reminder=\{reminder\}/, "which is handed the reminder to switch on");

  // Every wording the switch and the notification use is written twice, in the
  // two languages, or the reminder arrives in one of them alone.
  for (const key of [
    "reminderTitle",
    "reminderDesc",
    "reminderTurnOn",
    "reminderOn",
    "reminderBlocked",
    "reminderDismissed",
    "reminderUnsupported",
    "reminderNoBackground",
    "reminderBrowserDecides",
    "reminderNotifyTitle",
    "reminderNotifyOne",
    "reminderNotifyMany",
  ]) {
    assert.equal(
      [...dictionary.matchAll(new RegExp(`^ {4}${key}:`, "gm"))].length,
      2,
      `${key} is not written in both languages`
    );
  }

  // Installing the application is what allows the browser to wake the worker on
  // its own, and the manifest is where that is asked for.
  assert.deepEqual(manifest.permissions, ["periodic-background-sync"]);
  assert.equal(REMINDER_KEY, "aq_reminder", "the answer to the switch has a key of its own");
});
