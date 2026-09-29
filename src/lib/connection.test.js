import test from "node:test";
import assert from "node:assert/strict";
import { isOnline, watchConnection } from "./connection.js";

// The offline indicator is worth something only if it follows the device rather
// than a reading taken when the page opened: a player who walks into a tunnel in
// the middle of a level has to see it appear, and see it go when they come out.

/** A window, which is where the browser fires the news. */
function windowLike() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    /** Whatever the browser does when the network comes or goes. */
    report(type) {
      (listeners.get(type) || new Set()).forEach((listener) => listener());
    },
    listening() {
      return [...listeners.values()].reduce((count, set) => count + set.size, 0);
    },
  };
}

test("a device without a network reads as offline, and an unreadable one does not", () => {
  assert.equal(isOnline({ onLine: false }), false);
  assert.equal(isOnline({ onLine: true }), true);

  // A browser that answers nothing of the sort, and the Node process these
  // tests run in, are not offline: the indicator must never accuse a device it
  // cannot read, which would put a permanent warning in front of a reader whose
  // connection is perfectly good.
  assert.equal(isOnline({}), true);
  assert.equal(isOnline(null), true);
  assert.equal(isOnline(), true);
});

test("the indicator hears the network go and come back", () => {
  const browser = windowLike();
  const network = { onLine: true };
  const seen = [];
  watchConnection((online) => seen.push(online), { events: browser, network });

  network.onLine = false;
  browser.report("offline");
  network.onLine = true;
  browser.report("online");
  assert.deepEqual(seen, [false, true], "both changes are reported, in order");

  // The state is read from the device at the moment of the event, so two events
  // without a change in between still report what is true, and the component
  // above is free to ignore a value it already has.
  network.onLine = false;
  browser.report("offline");
  browser.report("offline");
  assert.deepEqual(seen, [false, true, false, false], "each event carries the state as it is");
});

test("the news is heard on the window and the answer read from the navigator", () => {
  // The browser does not keep these in one place: the events are fired on the
  // window, and the state they announce belongs to the navigator. Listening on
  // the navigator looks tidier and would never hear anything at all, which is a
  // mistake that only shows up on a device that has actually lost its network.
  const browser = windowLike();
  const network = { onLine: true };
  const seen = [];
  watchConnection((online) => seen.push(online), { events: browser, network });

  assert.equal(browser.listening(), 2, "the window carries the listeners");

  // A window knows nothing about a network, so reading the state from it would
  // always answer the same thing.
  assert.equal(isOnline(browser), true, "the window has no answer of its own");

  network.onLine = false;
  browser.report("offline");
  assert.deepEqual(seen, [false], "the state came from the navigator");
});

test("stop listening leaves nothing behind on the device", () => {
  const browser = windowLike();
  const network = { onLine: true };
  const seen = [];
  const stop = watchConnection((online) => seen.push(online), { events: browser, network });

  assert.equal(browser.listening(), 2, "one listener for each direction");
  stop();
  assert.equal(browser.listening(), 0, "both are removed");

  network.onLine = false;
  browser.report("offline");
  assert.deepEqual(seen, [], "and nothing is reported afterwards");
});

test("an environment that reports no network is left alone", () => {
  // Older browsers have no such events, and neither does the test runner.
  // Watching has to be a silent no-op rather than the reason the app fails to
  // start, and the caller still has to get something it can call to stop.
  for (const target of [null, undefined, {}]) {
    const stop = watchConnection(() => {}, { events: target });
    assert.equal(typeof stop, "function", "a stop function is always returned");
    assert.doesNotThrow(() => stop(), "and calling it is harmless");
  }
});
