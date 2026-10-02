import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import * as pass from "./keyboard-pass.js";
import {
  RING,
  TABBABLE_SELECTOR,
  describeControl,
  focusInPage,
  focusIsVisible,
  judgeKeyboard,
  tabbablesInPage,
} from "./keyboard-pass.js";

// The keyboard's own reading of a screen, read as a reader would read it.
//
// A sweep of Tab is a sequence of numbers, and the whole of "the order is the one
// it is drawn in, and nothing is skipped" is that those numbers run from zero
// upwards without a gap and without a repeat. So what is tested here is that
// judgement: sweeps that are wrong in one way each - a control the keyboard never
// arrives at, one it arrives at twice, one it passes a second time, a step that
// leaves the controls altogether, a control with nothing to show for the focus,
// a press that changes nothing - and the clean sweep they are all measured
// against. Whether the browser really walks them in that order is what the pass
// itself is for, and it is exercised by running it against a real browser.

/** A control a Tab may reach, with everything but what the rule needs left out. */
function control(shape) {
  return {
    index: 0,
    tag: "button",
    sel: "button:nth-child(1)",
    label: "Play",
    positive: false,
    hiddenFromReader: false,
    value: 0,
    ...shape,
  };
}

/** A press of Tab: where the focus went, and how it showed. */
function visit(shape) {
  return {
    index: 0,
    tag: "button",
    sel: "button:nth-child(1)",
    label: "Play",
    outline: "3px solid rgb(227, 167, 46)",
    shadow: "",
    onThePage: false,
    reached: true,
    ...shape,
  };
}

/** A screen whose sweep is exactly what it should be. */
function clean(overrides = {}) {
  return {
    name: "the lesson",
    controls: [
      control({ index: 0, label: "Listen" }),
      control({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference" }),
      control({ index: 2, sel: "button:nth-child(3)", label: "Start the quiz" }),
    ],
    visits: [
      visit({ index: 0, label: "Listen" }),
      visit({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference" }),
      visit({ index: 2, sel: "button:nth-child(3)", label: "Start the quiz" }),
    ],
    activations: [],
    ...overrides,
  };
}

/** The rules a journey was found to break. */
const broken = (screen) => judgeKeyboard({ screens: [screen] }).faults.map((fault) => fault.rule);

test("a sweep that reaches every control, in order, with a ring is not accused of anything", () => {
  const judged = judgeKeyboard({ screens: [clean()] });
  assert.deepEqual(judged.faults, []);
  assert.deepEqual(
    judged.notes.map((note) => note.rule),
    ["what the keyboard passes through"]
  );
  assert.match(judged.notes[0].what, /3 control\(s\) on the lesson are reached by Tab, in 3 press\(es\)/);
});

test("a control a Tab never arrives at is a fault, and it is named", () => {
  const screen = clean({
    visits: [visit({ index: 0 }), visit({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference" })],
  });
  assert.deepEqual(broken(screen), ["the keyboard never reaches a control"]);
  const fault = judgeKeyboard({ screens: [screen] }).faults[0];
  assert.match(fault.what, /1 of 3 on the lesson/);
  assert.match(fault.what, /button "Start the quiz"/);
});

test("a control a Tab arrives at twice, or goes back to, is a fault", () => {
  const twice = clean({
    visits: [
      visit({ index: 0, label: "Listen" }),
      visit({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference" }),
      visit({ index: 0, label: "Listen" }),
      visit({ index: 2, sel: "button:nth-child(3)", label: "Start the quiz" }),
    ],
  });
  const rules = broken(twice);
  assert.ok(rules.includes("the keyboard reaches a control twice"), "a control reached twice");
  assert.ok(rules.includes("the keyboard goes back and forth"), "and a step that goes back");
});

test("a press of Tab that leaves the controls is the keyboard losing its place", () => {
  const lost = clean({
    visits: [
      visit({ index: -1, sel: "the page", onThePage: true, reached: false }),
      visit({ index: 0, label: "Listen" }),
    ],
  });
  const rules = broken(lost);
  assert.ok(rules.includes("the keyboard loses its place"));
  assert.ok(rules.includes("the keyboard never reaches a control"), "and two controls were never reached");
  const fault = judgeKeyboard({ screens: [lost] }).faults.find((entry) => entry.rule === "the keyboard loses its place");
  assert.match(fault.what, /1 press\(es\) on the lesson leave the controls/);
});

test("a control with nothing to show for the focus is a fault, and it says what it expected", () => {
  const blank = clean({
    visits: [
      visit({ index: 0, label: "Listen" }),
      visit({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference", outline: "0px none rgb(0, 0, 0)" }),
      visit({ index: 2, sel: "button:nth-child(3)", label: "Start the quiz" }),
    ],
  });
  const faults = judgeKeyboard({ screens: [blank] }).faults;
  assert.deepEqual(faults.map((fault) => fault.rule), ["the focus cannot be seen"]);
  assert.match(faults[0].what, /a "A reference"/);
  assert.match(faults[0].what, new RegExp(RING));
});

test("a shadow counts as a ring, and an outline of no width does not", () => {
  assert.equal(focusIsVisible(visit({ outline: "3px solid rgb(227, 167, 46)" })), true);
  assert.equal(focusIsVisible(visit({ outline: "0px none rgb(0, 0, 0)", shadow: "0 0 0 3px #000" })), true);
  assert.equal(focusIsVisible(visit({ outline: "0px none rgb(0, 0, 0)", shadow: "" })), false);
  assert.equal(focusIsVisible(visit({ outline: "2px none rgb(0, 0, 0)", shadow: "" })), false);
});

test("a control that does nothing when it is pressed is a fault", () => {
  const silent = clean({ activations: [{ what: "pressing \"Start the quiz\"", changed: false }] });
  const faults = judgeKeyboard({ screens: [silent] }).faults;
  assert.deepEqual(faults.map((fault) => fault.rule), ["pressing a control does nothing"]);
  assert.match(faults[0].what, /the screen was the same afterwards/);
});

test("a control taken before the others, and one hidden from a screen reader, are worth knowing", () => {
  const odd = clean({
    controls: [
      control({ index: 0, label: "Listen", positive: true, value: 1 }),
      control({ index: 1, sel: "a:nth-child(2)", tag: "a", label: "A reference", hiddenFromReader: true }),
      control({ index: 2, sel: "button:nth-child(3)", label: "Start the quiz" }),
    ],
  });
  const judged = judgeKeyboard({ screens: [odd] });
  assert.deepEqual(judged.faults, []);
  assert.deepEqual(judged.notes.map((note) => note.rule), [
    "a positive tabindex reorders the screen",
    "a control a Tab reaches is hidden from a screen reader",
    "what the keyboard passes through",
  ]);
});

test("several screens are judged one by one, and each fault names its own", () => {
  const judged = judgeKeyboard({
    screens: [clean(), clean({ name: "the quiz", visits: [visit({ index: 0 })] })],
  });
  assert.deepEqual(judged.faults.map((fault) => fault.rule), ["the keyboard never reaches a control"]);
  assert.match(judged.faults[0].what, /on the quiz/);
});

test("which control a fault is on can be found again from the line", () => {
  assert.equal(
    describeControl(control({ tag: "button", label: "Move down one place: Lomekwi", sel: "li:nth-child(2)>button:nth-child(2)" })),
    'button "Move down one place: Lomekwi" - li:nth-child(2)>button:nth-child(2)'
  );
  assert.equal(describeControl(control({ tag: "a", label: "", sel: "a:nth-child(9)" })), "a - a:nth-child(9)");
});

test("the functions that run in a browser travel alone", () => {
  // Both are handed to the browser as text and run there, where nothing of this
  // module exists: a constant either of them reached for would be a name that is
  // not defined, and the pass would fail on every screen at once rather than say
  // what is wrong with one.
  for (const [name, fn] of Object.entries({ tabbablesInPage, focusInPage })) {
    const source = fn
      .toString()
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    const borrowed = Object.keys(pass).filter(
      (exported) => exported !== name && new RegExp(`\\b${exported}\\b`).test(source)
    );
    assert.deepEqual(borrowed, [], `${name} reads a name that will not be there`);
  }
});

test("the tab order is read out of a document that can be measured", () => {
  // jsdom lays nothing out and gives every element a rectangle of nothing, which
  // is the one thing this needs and the one thing it has not got. So the test
  // hands it a size, and the whole of what is left to check - a disabled control
  // is not reachable, a negative tabindex is not a Tab stop, a hidden control is
  // not there, and a positive number is taken first - is the browser's own rule.
  const dom = new JSDOM(
    `<!doctype html><html><body>
      <button id="first">Listen</button>
      <button id="disabled" disabled>Gone</button>
      <button id="scripted" tabindex="-1">Reached by script</button>
      <div id="hidden" style="display: none"><button>Hidden</button></div>
      <input id="early" tabindex="2" aria-label="Early" />
      <a id="link" href="#somewhere">A reference</a>
    </body></html>`,
    { pretendToBeVisual: true }
  );
  const window = dom.window;
  const previous = { getComputedStyle: globalThis.getComputedStyle, document: globalThis.document, window: globalThis.window };
  // A document where everything is drawn, since this one cannot draw.
  window.HTMLElement.prototype.getBoundingClientRect = function sized() {
    return { x: 0, y: 0, width: 10, height: 10, top: 0, left: 0, right: 10, bottom: 10 };
  };
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  globalThis.document = window.document;
  globalThis.window = window;
  try {
    const controls = tabbablesInPage(TABBABLE_SELECTOR);
    assert.deepEqual(
      controls.map((entry) => entry.label),
      ["Early", "Listen", "A reference"],
      "the positive number first, then the document order"
    );
    assert.deepEqual(
      controls.map((entry) => entry.index),
      [0, 1, 2]
    );
    // Neither a disabled control, nor one a Tab is told to skip, nor one inside
    // a box that is not drawn is in the list a Tab walks.
    assert.deepEqual(
      controls.filter((entry) =>
        ["Gone", "Reached by script", "Hidden"].includes(entry.label)
      ),
      [],
      "a control a Tab skips is not in the list"
    );
    for (const entry of controls) assert.match(entry.sel, /\w/);

    // And what the browser is focused on is read back as where it stands in that
    // list: nothing focused is the page, and the page is not a control.
    const atThePage = focusInPage(TABBABLE_SELECTOR);
    assert.equal(atThePage.onThePage, true);
    assert.equal(atThePage.index, -1);
    assert.equal(atThePage.reached, false);

    window.document.querySelector("#link").focus();
    const onTheLink = focusInPage(TABBABLE_SELECTOR);
    assert.equal(onTheLink.onThePage, false);
    assert.equal(onTheLink.index, 2);
    assert.equal(onTheLink.tag, "a");
    assert.equal(typeof onTheLink.outline, "string");
  } finally {
    globalThis.getComputedStyle = previous.getComputedStyle;
    globalThis.document = previous.document;
    globalThis.window = previous.window;
  }
});
