import test from "node:test";
import assert from "node:assert/strict";
import {
  REPORT_MESSAGE_LIMIT,
  REPORT_STACK_LINES,
  describeFailure,
  failureReport,
} from "./failure-report.js";

// The trace of a screen that failed to be drawn.
//
// There is no log to read afterwards in an application that runs entirely on the
// reader's device: the only witness is the person in front of it, and what they
// can send on is what this module writes down. Two dangers come with that. A
// report that is unbounded is a report nobody reads, and a report that quietly
// collects more than the failure - what the reader was doing, what they had
// typed - would be a register of them rather than a trace of a bug. The tests
// below are about both.

const failure = (error, options) => describeFailure(error, options);

test("a failure is written as the few facts a person can act on", () => {
  const error = new Error("Cannot read properties of undefined (reading 'gallery')");
  error.name = "TypeError";
  error.stack = [
    "TypeError: Cannot read properties of undefined (reading 'gallery')",
    "    at LevelGallery (http://localhost/assets/LevelGallery.js:42:11)",
    "    at renderWithHooks (http://localhost/assets/react.js:1:1)",
    "    at mountIndeterminateComponent (http://localhost/assets/react.js:2:2)",
    "    at beginWork (http://localhost/assets/react.js:3:3)",
    "    at performUnitOfWork (http://localhost/assets/react.js:4:4)",
    "    at workLoopSync (http://localhost/assets/react.js:5:5)",
    "    at renderRootSync (http://localhost/assets/react.js:6:6)",
  ].join("\n");

  const described = failure(error, {
    componentStack: "\n    at LevelGallery\n    at QuizScreen\n",
    address: "https://example.org/africaquest/#/levels/3",
    at: new Date("2026-09-29T20:15:00.000Z"),
  });

  assert.equal(described.name, "TypeError");
  assert.equal(described.message, "Cannot read properties of undefined (reading 'gallery')");
  assert.equal(described.at, "2026-09-29T20:15:00.000Z");
  assert.equal(described.address, "https://example.org/africaquest/#/levels/3");

  // Which line threw and which screen was being drawn are two different facts,
  // and the report keeps them apart.
  assert.equal(described.stack.length, REPORT_STACK_LINES);
  // A stack opens with the error's own line, then the frames; the first frame is
  // the first place the failure came from, and it is kept.
  assert.match(described.stack[0], /^TypeError:/);
  assert.match(described.stack[1], /^at LevelGallery/);
  assert.deepEqual(described.component, ["LevelGallery", "QuizScreen"]);

  const report = failureReport(described);
  assert.match(report, /^TypeError: Cannot read properties of undefined/);
  assert.match(report, /When: 2026-09-29T20:15:00\.000Z/);
  assert.match(report, /Where: https:\/\/example\.org\/africaquest\//);
  assert.match(report, /Stack:\n {2}TypeError:[^\n]*\n {2}at LevelGallery/);
  assert.match(report, /Screen:\n {2}LevelGallery/);
});

test("what is written down is bounded, and nothing else is written down", () => {
  const long = new Error("x".repeat(REPORT_MESSAGE_LIMIT * 3));
  long.stack = Array.from({ length: 400 }, (_, index) => `    at frame${index} (a.js:${index}:1)`).join("\n");

  const described = failure(long, { componentStack: "\n at A\n at B\n at C\n at D\n at E\n at F\n" });

  assert.equal(described.message.length, REPORT_MESSAGE_LIMIT + 1, "the message is capped, with the ellipsis");
  assert.ok(described.message.endsWith("…"));
  assert.equal(described.stack.length, REPORT_STACK_LINES);
  assert.equal(described.component.length, 4);
  assert.ok(described.stack.every((line) => !line.includes("\n")));

  // Exactly these six fields and no others: a field added "just in case" is how
  // a trace turns into a record of the person who sent it.
  assert.deepEqual(Object.keys(described).sort(), ["address", "at", "component", "message", "name", "stack"]);

  const report = failureReport(described);
  assert.ok(report.split("\n").length < 20, "the report is a handful of lines");
});

test("a failure that is not an error at all still produces a report", () => {
  // Anything can be thrown, including a string, and a screen that breaks while
  // writing the trace of a break is the one screen that has to hold.
  for (const thrown of [null, undefined, "boom", 42, {}, new Error("")]) {
    const described = failure(thrown);
    const report = failureReport(described);
    assert.equal(described.name, "Error", `${String(thrown)} has a name`);
    assert.ok(described.message.length > 0);
    assert.ok(report.startsWith("Error: "), `${String(thrown)} reports as an error`);
  }

  // And the same failure always reads the same way: the moment it happened is
  // passed in rather than read from the clock here, so two reports of one
  // failure are one text.
  const error = new Error("same");
  const when = new Date("2026-09-29T20:15:00.000Z");
  assert.equal(
    failureReport(failure(error, { at: when })),
    failureReport(failure(error, { at: when })),
    "the report is not a different text every time it is built"
  );
});
