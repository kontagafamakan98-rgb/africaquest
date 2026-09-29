/**
 * Whether the device has a network, and telling the caller when that changes.
 *
 * The application is built to run with no network at all: its files come from
 * the worker's cache and nothing it does needs a server. What it cannot do is
 * keep that from the reader, so the offline indicator listens here.
 *
 * The browser fires the news somewhere other than where it keeps it. The
 * `online` and `offline` events are fired on the window, while the answer they
 * announce is read from `navigator.onLine`; listening on the navigator, which
 * looks tidier, would never hear anything. Both are therefore taken as
 * arguments, which also lets a test drive the whole thing without a browser.
 *
 * `navigator.onLine` only says whether the device believes it has a network at
 * all: a captive portal, a router that answers and a server that does not all
 * read as online. It is still the only answer a page is given without probing
 * the network itself, which this app does not do, and the alternative is worse:
 * a device that went offline in a tunnel would look connected.
 */

/** Whether the device reports a network. A missing answer reads as online. */
export function isOnline(target = typeof navigator === "undefined" ? null : navigator) {
  return target ? target.onLine !== false : true;
}

/**
 * Calls `onChange` with the new state whenever the device gains or loses its
 * network, and returns the function that stops listening. An environment with no
 * such event does nothing rather than throw.
 */
export function watchConnection(
  onChange,
  {
    events = typeof window === "undefined" ? null : window,
    network = typeof navigator === "undefined" ? null : navigator,
  } = {}
) {
  if (!events || typeof events.addEventListener !== "function") return () => {};

  const report = () => onChange(isOnline(network));
  events.addEventListener("online", report);
  events.addEventListener("offline", report);

  return () => {
    events.removeEventListener("online", report);
    events.removeEventListener("offline", report);
  };
}
