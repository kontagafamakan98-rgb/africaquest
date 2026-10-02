import test from "node:test";
import assert from "node:assert/strict";
import { collapseRepeats } from "./layout-report.js";

// The report with its repetitions gathered, read as a reader would read it.
//
// The audit reads one screen more than once - at two widths, and as each of the
// question shapes a quiz draws - so a fault of the shell arrives several times,
// saying the same thing each time. What is tested here is the gathering: which
// findings belong together, and which two that read alike are still two things
// to fix. The reading itself needs a browser and is exercised by the audit in a
// runner; none of it is here.

/** The report lines of one gathered entry, in the shape the audit would print. */
const lines = (entries) => collapseRepeats(entries);

test("the same axe rule on five screens is one fault", () => {
  const screens = [
    "a quiz, on the chronology question (a narrow phone, 320px)",
    "a quiz, on the matching question (a narrow phone, 320px)",
    "a quiz, on a question with four answers (a narrow phone, 320px)",
    "a quiz set as an exam (a narrow phone, 320px)",
    "the hint sheet, over a question (a narrow phone, 320px)",
  ];
  const gathered = lines(
    screens.map((where) => ({
      where,
      rule: "axe, worth knowing: landmark-one-main",
      what: "1 node(s) - Document should have one main landmark. First: html",
    }))
  );

  assert.equal(gathered.length, 1, "one fault was reported five times");
  assert.equal(gathered[0].rule, "axe, worth knowing: landmark-one-main");
  assert.equal(gathered[0].count, 5);
  assert.deepEqual(gathered[0].screens, screens, "the screens it was found on are kept in order");
  assert.equal(gathered[0].where, screens[0], "the first reading is where the line stands");
});

test("a heading order read at both widths is one fault, not two", () => {
  const gathered = lines([
    {
      where: "a quiz, on the chronology question (a narrow phone, 320px)",
      rule: "axe, worth knowing: heading-order",
      what: "2 node(s) - Heading levels should only increase by one. First: h3",
    },
    {
      where: "a quiz, on the chronology question (a common phone, 390px)",
      rule: "axe, worth knowing: heading-order",
      what: "2 node(s) - Heading levels should only increase by one. First: h3",
    },
  ]);

  assert.equal(gathered.length, 1);
  assert.equal(gathered[0].count, 2);
});

test("a rule read as a failure is not gathered with the same rule read as a note", () => {
  const gathered = lines([
    { where: "a screen", rule: "axe: heading-order", what: "1 node(s) - Heading levels" },
    { where: "a screen", rule: "axe, worth knowing: heading-order", what: "1 node(s) - Heading levels" },
  ]);

  assert.equal(gathered.length, 2, "the severity is part of what the rule is");
  assert.deepEqual(
    gathered.map((entry) => entry.rule),
    ["axe: heading-order", "axe, worth knowing: heading-order"]
  );
});

test("two axe rules are two faults", () => {
  const gathered = lines([
    { where: "a screen", rule: "axe, worth knowing: region", what: "4 node(s) - Content not in a landmark. First: div" },
    { where: "a screen", rule: "axe, worth knowing: heading-order", what: "1 node(s) - Heading levels. First: h3" },
  ]);

  assert.equal(gathered.length, 2);
});

test("one element read at two widths is one fault", () => {
  const gathered = lines([
    {
      where: "the statistics (a narrow phone, 320px)",
      rule: "words are cut off",
      what: 'p "Carthage and Ancient North Africa" at 150x16 (x 77, y 3615) - div:nth-child(5)>p:nth-child(1), 84px of what it holds past the box',
    },
    {
      where: "the statistics (a common phone, 390px)",
      rule: "words are cut off",
      what: 'p "Carthage and Ancient North Africa" at 220x16 (x 77, y 3586) - div:nth-child(5)>p:nth-child(1), 14px of what it holds past the box',
    },
  ]);

  assert.equal(gathered.length, 1, "the same paragraph is one thing to fix");
  assert.equal(gathered[0].count, 2);
  assert.match(gathered[0].what, /at 150x16 \(x 77, y 3615\)/, "the words of the first reading are kept");
});

test("two controls named the same on one screen are still one fault's worth each", () => {
  const gathered = lines([
    {
      where: "a quiz (a narrow phone, 320px)",
      rule: "smaller than a thumb wants",
      what: 'button "Cancel" at 36x36 (x 264, y 14) - button[Cancel], under the 44px a thumb is given',
    },
    {
      where: "a quiz (a common phone, 390px)",
      rule: "smaller than a thumb wants",
      what: 'button "Cancel" at 36x36 (x 334, y 14) - button[Cancel], under the 44px a thumb is given',
    },
  ]);

  assert.equal(gathered.length, 1, "one control, read at both widths");
  assert.equal(gathered[0].count, 2);
});

test("two paragraphs cut off on one screen are two faults", () => {
  const gathered = lines([
    {
      where: "the statistics (a narrow phone, 320px)",
      rule: "words are cut off",
      what: 'p "Carthage and Ancient North Africa" at 150x16 (x 77, y 3615) - div:nth-child(5)>p:nth-child(1), 84px of what it holds past the box',
    },
    {
      where: "the statistics (a narrow phone, 320px)",
      rule: "words are cut off",
      what: 'p "The Amazigh Kingdoms" at 150x16 (x 77, y 3681) - div:nth-child(6)>p:nth-child(1), 8px of what it holds past the box',
    },
  ]);

  assert.equal(gathered.length, 2, "the report has to name both");
});

test("a fault read twice in one reading keeps one screen and counts two", () => {
  const gathered = lines([
    { where: "a screen", rule: "one text is drawn on another", what: 'span "A" and span "B"' },
    { where: "a screen", rule: "one text is drawn on another", what: 'span "A" and span "B"' },
  ]);

  assert.equal(gathered.length, 1);
  assert.equal(gathered[0].count, 2);
  assert.deepEqual(gathered[0].screens, ["a screen"]);
});

test("what was read once is left alone", () => {
  const entry = { where: "a lesson (a narrow phone, 320px)", rule: "the page scrolls sideways", what: "412px of page on a 320px screen" };
  const gathered = lines([entry]);

  assert.equal(gathered.length, 1);
  assert.equal(gathered[0].count, 1);
  assert.deepEqual(gathered[0].screens, [entry.where]);
  assert.equal(gathered[0].rule, entry.rule);
  assert.equal(gathered[0].what, entry.what);
});

test("the report keeps the order the faults were first read in", () => {
  const gathered = lines([
    { where: "screen one", rule: "axe, worth knowing: region", what: "1 node(s) - Content not in a landmark" },
    { where: "screen two", rule: "words are cut off", what: 'p "A" at 10x10 (x 0, y 0) - p:nth-child(1), 1px of what it holds past the box' },
    { where: "screen two", rule: "axe, worth knowing: region", what: "1 node(s) - Content not in a landmark" },
  ]);

  assert.deepEqual(
    gathered.map((entry) => entry.rule),
    ["axe, worth knowing: region", "words are cut off"],
    "the first sight of each fault is what orders them"
  );
});
