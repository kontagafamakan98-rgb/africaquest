import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  HISTORY_KEPT,
  HISTORY_OPEN,
  UPTIME_LOG_TITLE,
  appendRun,
  describeRun,
  parseHistory,
  renderLog,
  transitionComment,
  upkeepDecision,
} from "./uptime-log.js";

// The day-by-day record of what the check found.
//
// A run is easy to lose and says nothing about the days before it, so the
// verdict is written into one issue instead. These tests hold the two halves of
// that: a body that can be appended to and read back, and a decision about when
// the news is worth a comment rather than a row.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");
const SITE = "https://example.org/quest";

const up = (at = "2026-10-01T06:21:00Z", answered = 11, asked = 11) => ({ at, verdict: "up", answered, asked });
const down = (at = "2026-09-30T12:33:00Z", answered = 0, asked = 8) => ({ at, verdict: "down", answered, asked });

test("a run is described as a reader would say it", () => {
  assert.equal(describeRun(up()), "every address answered (11 of 11)");
  assert.equal(describeRun(down()), "nothing answered (0 of 8)");
  assert.equal(describeRun({ at: "x", verdict: "down", answered: 5, asked: 8 }), "3 of 8 addresses are not what they should be");
});

test("the list is written into the body and read back out of it", () => {
  const entries = [up("2026-09-29T06:20:00Z"), down(), up()];
  const body = renderLog({ site: SITE, entries });

  assert.ok(body.includes(HISTORY_OPEN), "the list has no markers to be found by");
  assert.ok(body.includes(SITE), "the body does not say which site it is about");
  // Newest first in the table, oldest first in the list: one end is for reading
  // and the other is where an append belongs.
  assert.ok(body.indexOf("2026-10-01 06:21") < body.indexOf("2026-09-30 12:33"), "the table is not newest first");

  assert.deepEqual(parseHistory(body), entries, "what was written is not what is read");
});

test("a body that says nothing, or says something odd, is read as nothing", () => {
  assert.deepEqual(parseHistory(""), []);
  assert.deepEqual(parseHistory(undefined), []);
  assert.deepEqual(parseHistory("Just a sentence about the site."), []);
  assert.deepEqual(parseHistory(`${HISTORY_OPEN}not json -->`), []);
  assert.deepEqual(parseHistory(`${HISTORY_OPEN}{"a":1} -->`), []);
  // An entry somebody deleted half of is dropped rather than drawn as a row of
  // undefined: this list can be edited by hand, and it is read from that.
  assert.deepEqual(parseHistory(`${HISTORY_OPEN}${JSON.stringify([up(), { at: "x" }, null, "junk"])} -->`), [up()]);
});

test("the list keeps the last checks and lets the older ones go", () => {
  // Real days, counted rather than written: a list of forty-five checks is the
  // point of the test, and hand-written dates run out before it ends.
  const day = (step) => new Date(Date.UTC(2026, 7, 1) + step * 86_400_000).toISOString();
  const checks = HISTORY_KEPT + 5;
  let history = [];
  for (let step = 0; step < checks; step += 1) history = appendRun(history, up(day(step)));

  assert.equal(history.length, HISTORY_KEPT);
  assert.equal(history[0].at, day(5), "the oldest checks are the ones dropped");
  assert.equal(history[history.length - 1].at, day(checks - 1));

  // A run that is not a run is not appended, and does not throw.
  assert.deepEqual(appendRun([up()], { at: "x" }), [up()]);
  assert.deepEqual(appendRun(null, up()), [up()]);
});

test("the first check opens the log, and the ones after it keep it level", () => {
  const first = upkeepDecision({ run: up(), issues: [], site: SITE });
  assert.equal(first.action, "create");
  assert.equal(first.title, UPTIME_LOG_TITLE);
  assert.equal(first.comment, "", "opening the log is not also a piece of news");
  assert.deepEqual(parseHistory(first.body), [up()]);

  // The second check finds the log and adds a row to it.
  const open = [{ number: 7, title: UPTIME_LOG_TITLE, body: first.body }];
  const second = upkeepDecision({ run: up("2026-10-02T06:21:00Z"), issues: open, site: SITE });
  assert.equal(second.action, "update");
  assert.equal(second.number, 7);
  assert.deepEqual(parseHistory(second.body), [up(), up("2026-10-02T06:21:00Z")]);
  assert.equal(second.comment, "", "a site that was up and is up again is not news");

  // An issue that is somebody else's is never touched.
  const theirs = upkeepDecision({ run: up(), issues: [{ number: 3, title: "Something else", body: "" }], site: SITE });
  assert.equal(theirs.action, "create");
});

test("a change of state is the one thing worth a comment", () => {
  const open = [{ number: 7, title: UPTIME_LOG_TITLE, body: renderLog({ site: SITE, entries: [up()] }) }];

  const fell = upkeepDecision({ run: down(), issues: open, site: SITE });
  assert.equal(fell.action, "update");
  assert.match(fell.comment, /found the site down/, "the day it goes down says nothing");
  assert.match(fell.comment, /example\.org/, "the comment does not say which site");
  assert.deepEqual(parseHistory(fell.body).map((run) => run.verdict), ["up", "down"]);

  // And the day it comes back is a comment too, which is the news a log of only
  // failures would never have.
  const recovered = upkeepDecision({
    run: up("2026-10-03T06:21:00Z", 11, 11),
    issues: [{ number: 7, title: UPTIME_LOG_TITLE, body: fell.body }],
    site: SITE,
  });
  assert.match(recovered.comment, /answered again/, "the recovery is not said out loud");
  assert.equal(transitionComment({ previous: null, run: down(), site: SITE }), "", "a first check is not a change");
});

test("the check leaves its verdict where the step that keeps the log can read it", () => {
  // The two steps are split for the same reason the drift ones are: a check that
  // fails must still be able to say so. The report is a file, and the step that
  // writes it runs whatever the check decided.
  const script = read("scripts/check-site.mjs");
  assert.match(script, /--report/, "the check cannot leave its verdict anywhere");
  assert.match(script, /outcome/, "the report says nothing about what was found");

  const uptime = read(".github/workflows/uptime.yml");
  assert.match(uptime, /check-site\.mjs[^\n]*--report/, "the daily run does not keep what it found");
  assert.match(uptime, /node scripts\/announce-uptime\.mjs/, "nothing keeps the log");
  // The last mention, not the first: the header comment names the script too, and
  // a window around that one would pass on a step that has no condition at all.
  const step = uptime.lastIndexOf("announce-uptime.mjs");
  assert.match(uptime.slice(step - 400, step), /if: always\(\)/, "the log is skipped exactly when it matters");
  assert.match(uptime, /issues: write/, "the run is not allowed to write the log it keeps");
});
