import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

// The three things the application says about itself - the network, a new
// version, and a browser that refuses to save - and each is easy to get wrong in
// ways nobody notices: a chip that never goes away, a prompt that greets every
// first visit, copy that is only in English, or a layer that covers the buttons
// underneath it.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");
const source = read("src/components/AppStatus.jsx");

test("the status layer says nothing when there is nothing to say", () => {
  // Something that is always on screen stops being information. On a device
  // with a network, running the version it was loaded with and a browser that
  // saves, nothing is drawn.
  assert.match(
    source,
    /if \(online && !updateReady && !saveRefused\) return null;/,
    "silent when there is nothing to report"
  );
});

test("a browser that refuses to save is said out loud rather than swallowed", () => {
  // The one failure the player cannot see for themselves: the game keeps
  // scoring, and everything is gone at the next reload. It is watched like the
  // network is, and it goes away when the browser saves again.
  assert.match(source, /watchSaveRefusal\(\(failed\) => setSaveRefused\(failed !== null\)\)/, "a refused write is not watched");
  assert.match(source, /\{saveRefused && \(/, "the refusal is never drawn");
  assert.match(source, /\{t\.saveFailed\}/, "the line is not in the language on screen");
  assert.match(source, /t\.saveFailedNote/, "nothing tells the reader what to do about it");
  // It says nothing about the site or about the network: what broke is this
  // browser's storage, and a message about the wrong thing is worse than none.
  assert.match(source, /border-red-400\/40/, "the refusal does not read as a warning");
});

test("a device that lost its network is told so, and told that nothing is lost", () => {
  assert.match(source, /const \[online, setOnline\] = useState\(\(\) => isOnline\(\)\)/, "the state starts from the device");
  // Called with no target, so the module reads the window for the events and
  // the navigator for the answer, which is where the browser keeps each.
  assert.match(source, /watchConnection\(setOnline\)/, "and follows it while the app is open");
  assert.doesNotMatch(source, /watchConnection\((window|navigator)/, "neither one alone can do both");
  assert.match(source, /role="status"/, "the change is announced, not only drawn");
  assert.match(source, /\{t\.offline\}/, "in the language on screen");
  assert.match(source, /sr-only/, "with the reassurance a reader who cannot see the chip still needs");
});

test("the failures nobody catches are written into the log of the session", () => {
  // An error thrown outside a render, and a promise nobody handled, never reach
  // the boundary above the router: they are caught here, where the two other
  // things that are true of the whole application are already watched. Nothing is
  // drawn for them - a child does not need a line of red text about a stray
  // error, and the person who does need one has the report they export - so the
  // only thing to check is that they are written down at all.
  assert.match(source, /watchWindowFailures\(\)/, "a stray failure is not written down anywhere");
  assert.match(source, /from "@\/lib\/error-log\.js"/, "it does not go through the log of the session");
  assert.match(
    source,
    /useEffect\(\(\) => watchWindowFailures\(\), \[\]\)/,
    "the listeners are not installed once, or not removed with the layer"
  );
  assert.doesNotMatch(source, /failureCount|recentFailures/, "the status layer shows failures to a child");
});

test("a version that took over offers a reload, and nothing else happens", () => {
  assert.match(source, /watchForUpdates\(\(\) => setUpdateReady\(true\)\)/, "the worker is watched for a takeover");
  assert.match(source, /\{t\.updateReady\}/, "the banner is worded in the language on screen");
  assert.match(source, /const reload = \(\) => window\.location\.reload\(\);/, "reloading is a plain reload");
  // A reload through the router, or a redirect, would leave the reader on a
  // page that no longer exists in the version they just moved to.
  assert.match(source, /onClick=\{reload\}/, "and the button is the only thing that does it");
});

test("the layer lets taps through, except on the one button", () => {
  assert.match(source, /pointer-events-none/, "the layer does not stand between the reader and the page");
  assert.match(source, /pointer-events-auto/, "while the button stays pressable");
  assert.match(source, /<button/, "the one thing meant to be pressed is a real button");
  // Nothing here is shaped like a pill: the house rule forbids it on anything
  // that behaves like a button.
  assert.doesNotMatch(source, /rounded-full/, "no pill shaped button");
});

test("the copy lives in the translations, not in the component", () => {
  // Hard coded English would appear in the French application and only there,
  // which is the kind of thing nobody notices until a reader does.
  assert.doesNotMatch(source, /\b(Offline|Reload|Hors ligne|Recharger)\b/, "no wording of its own");

  for (const key of ["offline", "offlineNote", "updateReady", "reloadNow", "saveFailed", "saveFailedNote"]) {
    assert.match(source, new RegExp(`t\\.${key}\\b`), `${key} comes from the translations`);
  }
});

test("it is mounted once, for the whole application", () => {
  const app = read("src/App.jsx");
  assert.match(app, /import AppStatus from ['"]@\/components\/AppStatus['"]/, "the application imports it");
  assert.equal(app.match(/<AppStatus \/>/g)?.length, 1, "and draws one of it, never a second");
});
