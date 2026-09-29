import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

// The indicator and the update banner are the only two things the application
// says about itself, and both are easy to get wrong in ways nobody notices: a
// chip that never goes away, a prompt that greets every first visit, copy that
// is only in English, or a banner that covers the buttons underneath it.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");
const source = read("src/components/AppStatus.jsx");

test("the status layer says nothing when there is nothing to say", () => {
  // Something that is always on screen stops being information. On a device
  // with a network, running the version it was loaded with, nothing is drawn.
  assert.match(source, /if \(online && !updateReady\) return null;/, "silent when there is nothing to report");
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

  for (const key of ["offline", "offlineNote", "updateReady", "reloadNow"]) {
    assert.match(source, new RegExp(`t\\.${key}\\b`), `${key} comes from the translations`);
  }
});

test("it is mounted once, for the whole application", () => {
  const app = read("src/App.jsx");
  assert.match(app, /import AppStatus from ['"]@\/components\/AppStatus['"]/, "the application imports it");
  assert.equal(app.match(/<AppStatus \/>/g)?.length, 1, "and draws one of it, never a second");
});
