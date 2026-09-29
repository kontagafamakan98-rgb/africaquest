/**
 * Bringing the player back when a question they missed is due again.
 *
 * Spaced repetition only works if the player comes back: a question answered
 * again three days later, then three weeks later, is the whole point of the
 * schedule, and the schedule is invisible from outside the application. So the
 * count of what is due is put on the icon of the installed app, and, when the
 * player asks for it, a notification is raised when the game is not open.
 *
 * Nothing here ever reaches the network. The application is a page that runs
 * offline, so the reminder it can honestly offer is one the browser runs on its
 * own: the schedule is handed to the service worker, which keeps it and looks at
 * it when the browser wakes it. That is periodic background sync, which most
 * browsers do not implement: where it exists it is a notification with the game
 * closed, and where it does not the count on the icon still arrives the next time
 * the application opens. Both halves are written here rather than assumed, and
 * every browser entry point is guarded, so the module is a set of no-ops under
 * Node and in a browser without any of it.
 *
 * The wording of the notification is composed by the application and travels with
 * the schedule, because the dictionary lives in the interface and the worker only
 * repeats what it was given. That is also why the counted form carries a `%d`:
 * the count on the day of the notification is not the count on the day the
 * schedule was handed over.
 */
import { collectReviewQueue } from "../components/game/learning.js";
import { LEVEL_SUMMARIES } from "../components/game/level-summary.js";

/** The tag the worker registers its wake-up under, and the one the notification carries. */
export const REMINDER_TAG = "review-due";

/** Where the player's answer to the reminder switch is kept. */
export const REMINDER_KEY = "aq_reminder";

/**
 * How often the browser is asked to wake the worker.
 *
 * A question comes back after ten minutes at the earliest and a day at the
 * latest, and the shortest interval a browser accepts for this is twelve hours
 * anyway: asking for less is asking for something that will be rounded up.
 */
export const REMINDER_MIN_INTERVAL_MS = 12 * 60 * 60 * 1000;

/** What the message to the worker is called. */
export const REMINDER_MESSAGE = "review-schedule";

/** What the worker is told when the reminder is turned off again. */
export const REMINDER_FORGET = "review-forget";

/**
 * The schedule the reminder needs: when each question still in the rotation
 * comes back, in epoch milliseconds, and how many of them are due right now.
 *
 * The moments travel rather than the questions, so the worker can answer "how
 * many are due" at any hour without knowing anything about the game. A question
 * the player has never missed is not in the rotation at all, so it is not in
 * this list either.
 */
export function reviewSchedule(questionStats = {}, levels = LEVEL_SUMMARIES, now = Date.now()) {
  const times = collectReviewQueue(questionStats, levels, { now })
    .map((item) => item.due)
    .filter((due) => Number.isFinite(due))
    .sort((one, other) => one - other);

  return { at: now, times, due: times.filter((time) => time <= now).length };
}

/**
 * The message the worker keeps: the moments, and the two forms of the sentence
 * it will raise.
 *
 * `many` carries one `%d`, which is where the count of the day goes; the single
 * form is written out in full because not every language says "1 questions".
 */
export function reminderMessage(schedule, wording) {
  return {
    type: REMINDER_MESSAGE,
    at: schedule.at,
    times: schedule.times,
    title: wording.title,
    one: wording.one,
    many: wording.many,
  };
}

/** The three wordings a notification is made of, read from the dictionary. */
export function reminderWording(t) {
  return {
    title: t?.reminderNotifyTitle || "Review",
    one: t?.reminderNotifyOne || "One question is due again.",
    many: t?.reminderNotifyMany || "%d questions are due again.",
  };
}

/** Whether the player asked to be reminded. */
export function reminderEnabled() {
  try {
    return globalThis.localStorage?.getItem(REMINDER_KEY) === "on";
  } catch {
    return false;
  }
}

/** Records the player's answer. Storage can be full or refused: never a crash. */
export function rememberReminder(on) {
  try {
    globalThis.localStorage?.setItem(REMINDER_KEY, on ? "on" : "off");
  } catch {
    // Nothing to do: the switch still works for as long as the page is open.
  }
  return Boolean(on);
}

/**
 * What this browser can actually do, so the interface can promise nothing more.
 *
 * Three separate abilities: raising a notification at all, having the browser
 * wake the worker with the application closed, and putting a count on the icon.
 * A browser may have any one of them without the others.
 */
export function reminderSupport() {
  const notifications =
    typeof globalThis.Notification === "function" &&
    typeof globalThis.Notification.requestPermission === "function";
  // The wake-up lives on the registration rather than on the navigator, so the
  // class itself is what is looked at; a browser that has no such class at all
  // has no such wake-up either.
  const Registration = globalThis.ServiceWorkerRegistration;
  const periodic =
    Boolean(globalThis.navigator?.serviceWorker) &&
    typeof Registration === "function" &&
    "periodicSync" in Registration.prototype;
  return {
    notifications,
    periodic,
    badge: typeof globalThis.navigator?.setAppBadge === "function",
  };
}

/** The permission already granted or refused, without asking for anything. */
export function reminderPermission() {
  if (!reminderSupport().notifications) return "unsupported";
  return globalThis.Notification.permission;
}

/**
 * Puts the count of what is due on the icon of the installed application.
 *
 * This needs no permission and no worker: it is the one part of the reminder
 * that works on the screen the player is looking at, and it is what tells them
 * there is something waiting before they open the game.
 */
export async function applyBadge(count) {
  const navigator = globalThis.navigator;
  if (!navigator) return false;
  try {
    if (count > 0 && typeof navigator.setAppBadge === "function") {
      await navigator.setAppBadge(count);
      return true;
    }
    if (count === 0 && typeof navigator.clearAppBadge === "function") {
      await navigator.clearAppBadge();
      return true;
    }
  } catch {
    // A browser that refuses the badge, or an application that is not installed
    // yet: the count is still on the screen, which is where it matters most.
  }
  return false;
}

/**
 * How long the page waits for a worker to take the page over before giving up.
 *
 * A page served by a worker is controlled from the first line it runs, so the
 * wait is only ever paid on the very first visit, between the moment the worker
 * is registered and the moment it is running. A browser with no worker at all is
 * not waited for: the switch would look stuck for five seconds to answer that
 * nothing is there.
 */
const READY_TIMEOUT_MS = 5000;

/** The registration of the worker, once there is one, or null. */
async function workerRegistration(timeout = READY_TIMEOUT_MS) {
  const container = globalThis.navigator?.serviceWorker;
  if (!container) return null;

  // Already controlled: the registration that owns this page is asked for, and
  // that answer is immediate rather than awaited.
  if (container.controller) {
    try {
      return (await container.getRegistration?.()) || null;
    } catch {
      return null;
    }
  }

  // Not controlled yet. Either a worker is on its way - the first visit, where
  // it is registered while the page loads and takes over a moment later - or
  // there is none and there never will be, which is every development build. A
  // registration that exists is worth waiting for; none at all is answered now.
  let registrations = null;
  if (typeof container.getRegistrations === "function") {
    try {
      registrations = await container.getRegistrations();
    } catch {
      // A browser that refuses the question is waited for rather than assumed
      // empty: the wait ends on its own.
      registrations = null;
    }
    if (Array.isArray(registrations) && registrations.length === 0) return null;
  }

  const arrived = Promise.resolve(container.ready).catch(() => null);
  const waited = new Promise((resolve) => setTimeout(() => resolve(null), timeout));
  return Promise.race([arrived, waited]);
}

/**
 * Hands the schedule to the worker, which is the only thing that can raise it
 * once the page is gone. Nothing happens in a browser without a worker, which
 * is also every development build.
 */
export async function postReminder(message) {
  const container = globalThis.navigator?.serviceWorker;
  if (!container) return false;
  const worker = container.controller || (await workerRegistration())?.active || null;
  if (!worker) return false;
  worker.postMessage(message);
  return true;
}

/**
 * Turns the reminder on: asks for the permission, registers the wake-up, and
 * hands over the schedule in the same breath.
 *
 * `requestPermission` is only answered when a reader asked for something, so
 * this is called from the switch and never on its own. What comes back says what
 * actually happened, and the interface shows it rather than claiming success.
 */
export async function enableReminder(message) {
  const support = reminderSupport();
  if (!support.notifications) return { granted: false, periodic: false, reason: "unsupported" };

  let permission;
  try {
    permission = await globalThis.Notification.requestPermission();
  } catch {
    permission = "denied";
  }
  if (permission !== "granted") {
    return { granted: false, periodic: false, reason: permission === "denied" ? "denied" : "dismissed" };
  }

  rememberReminder(true);
  // The wake-up is asked for separately from the permission: a browser that
  // raises notifications may have no way of waking the worker on its own.
  let periodic = false;
  const registration = await workerRegistration();
  if (registration?.periodicSync) {
    try {
      await registration.periodicSync.register(REMINDER_TAG, { minInterval: REMINDER_MIN_INTERVAL_MS });
      periodic = true;
    } catch {
      periodic = false;
    }
  }

  await postReminder(message);
  const times = Array.isArray(message?.times) ? message.times : [];
  await applyBadge(times.filter((time) => time <= Date.now()).length);
  return { granted: true, periodic, reason: "granted" };
}

/** Turns it off again: no more wake-ups, no more count on the icon. */
export async function disableReminder() {
  rememberReminder(false);
  const registration = await workerRegistration();
  if (registration?.periodicSync) {
    try {
      await registration.periodicSync.unregister(REMINDER_TAG);
    } catch {
      // Nothing was registered, or the browser refuses: the flag is off either
      // way, which is what the player asked for.
    }
  }
  await postReminder({ type: REMINDER_FORGET });
  await applyBadge(0);
  return true;
}
