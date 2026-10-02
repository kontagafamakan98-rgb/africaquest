import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import * as rules from "./layout-audit.js";
import {
  INTERACTIVE_SELECTOR,
  OVERLAP_MIN_PX,
  PHONE_SIZES,
  TAP_COMFORTABLE,
  collectInPage,
  describe,
  judge,
} from "./layout-audit.js";

// The rules of the phone-size layout audit, read as a reader would read them.
//
// A layout fault is a measurement, and a measurement is what a window with no
// layout cannot make: jsdom gives every element a rectangle of nothing, so the
// faults this file judges are invisible there and were invisible to the check
// that draws every screen. What is tested here is the judgment, not the
// measurement: `judge` is handed screens that are wrong in one way each - a page
// too wide, a word cut off, two texts on top of each other - and asked which of
// them it noticed. The measuring itself is exercised by running the audit in a
// real browser, which is the only place it can mean anything.

const VIEWPORT = { width: 390, height: 844 };

/**
 * One measured screen, with a node's own defaults filled in.
 *
 * The rules of the audit read a good many fields, and a test that has to name
 * all of them says less about the rule it is testing than about the shape of a
 * record. Only the fields a rule uses are named here.
 */
function node(shape) {
  const filled = {
    id: 0,
    parent: -1,
    sel: "div:nth-child(1)",
    tag: "div",
    text: "",
    label: "",
    x: 0,
    y: 0,
    width: 100,
    height: 40,
    fontSize: 14,
    interactive: false,
    inline: false,
    pinned: false,
    clipX: false,
    clipY: false,
    scrollWidth: 100,
    clientWidth: 100,
    scrollHeight: 40,
    clientHeight: 40,
    ellipsis: false,
    scrolls: false,
    inScrollerX: false,
    ...shape,
  };
  // The measuring fills the name a line is read by from the text an element
  // holds, so a test that names neither is a test of what a real screen says.
  if (filled.label === "" && filled.text) filled.label = filled.text;
  return filled;
}

/** A screen that is exactly what it should be. */
function screen(overrides = {}) {
  return {
    viewport: VIEWPORT,
    page: { width: VIEWPORT.width, scrollWidth: VIEWPORT.width, scrollHeight: 2000, height: VIEWPORT.height },
    nodes: [],
    ...overrides,
  };
}

/** The rules a screen was found to break, and what each of them is. */
const broken = (measured) => judge(measured).faults.map((fault) => fault.rule);

test("a screen that fits is not accused of anything", () => {
  const clean = screen({
    nodes: [
      node({ id: 0, sel: "main", tag: "main", width: 390, height: 800 }),
      node({ id: 1, parent: 0, sel: "h1", tag: "h1", text: "Africa History Quest", x: 16, y: 16, width: 300, height: 24 }),
      node({ id: 2, parent: 0, sel: "button", tag: "button", label: "Play", interactive: true, x: 16, y: 60, width: 358, height: 56 }),
    ],
  });
  assert.deepEqual(judge(clean), { faults: [], notes: [] });
});

test("a page that is wider than the phone is a fault, and it says by how much", () => {
  const wide = screen({
    page: { width: VIEWPORT.width, scrollWidth: 412, scrollHeight: 2000, height: VIEWPORT.height },
  });
  assert.deepEqual(broken(wide), ["the page scrolls sideways"]);
  assert.match(judge(wide).faults[0].what, /412px of page on a 390px screen, which is 22px too wide/);
});

test("an element that hangs off the screen is named, worst first", () => {
  const hanging = screen({
    nodes: [
      node({ id: 0, sel: "aside", tag: "aside", x: 380, y: 10, width: 40, height: 40 }),
      node({ id: 1, sel: "span", tag: "span", text: "A name that does not fit", x: -60, y: 200, width: 200, height: 20 }),
    ],
  });
  const faults = judge(hanging).faults;
  assert.deepEqual(faults.map((fault) => fault.rule), ["it hangs off the screen", "it hangs off the screen"]);
  // Sixty pixels past the left edge is worse than thirty past the right, so the
  // left one is read first, and each says which edge it went past.
  assert.match(faults[0].what, /60px past the left edge/);
  assert.match(faults[1].what, /30px past the right edge/);
});

test("a row that means to be wider than the phone is not a fault", () => {
  // A gallery scrolls sideways because it is meant to, and its photographs are
  // past the right edge in every correct layout: this is the third photograph of
  // a lesson, half of it out of sight until somebody drags the row.
  const gallery = screen({
    nodes: [node({ id: 0, sel: "li", tag: "li", text: "A caption", x: 340, y: 100, width: 320, height: 200, inScrollerX: true })],
  });
  assert.deepEqual(broken(gallery), []);
});

test("a box made invisible on purpose is not hiding words", () => {
  // What is kept for a screen reader is a box of one pixel that clips its own
  // text: it holds words past its edge because there is no edge to hold them in.
  // Two hundred lines of the first run this audit ever made were that shape.
  const hidden = screen({
    nodes: [
      node({
        id: 0,
        sel: "span",
        tag: "span",
        text: "Locked, finish the previous level first",
        label: "Locked, finish the previous level first",
        x: 15,
        y: 497,
        width: 1,
        height: 1,
        clipY: true,
        scrollWidth: 1,
        clientWidth: 1,
        scrollHeight: 24,
        clientHeight: 1,
      }),
    ],
  });
  assert.deepEqual(judge(hidden), { faults: [], notes: [] });
});

test("only the worst few elements that hang off are reported, and the rest are counted", () => {
  const many = screen({
    page: { width: VIEWPORT.width, scrollWidth: 480, scrollHeight: 2000, height: VIEWPORT.height },
    nodes: Array.from({ length: 9 }, (unused, index) =>
      node({ id: index, sel: `span:nth-child(${index + 1})`, tag: "span", text: `word ${index}`, x: 300 + index * 10, y: index * 20, width: 200, height: 20 })
    ),
  });
  const faults = judge(many).faults;
  assert.equal(faults.filter((fault) => fault.rule === "it hangs off the screen").length, 7);
  assert.match(faults.at(-1).what, /and 3 other element\(s\) do too/);
});

test("words cut off by the box that holds them are a fault, and an ellipsis is a note", () => {
  const cutting = screen({
    nodes: [
      node({ id: 0, sel: "h3", tag: "h3", text: "Kingdom of Kush", label: "Kingdom of Kush", clipY: true, scrollHeight: 60, clientHeight: 40, height: 40 }),
      node({
        id: 1,
        sel: "p",
        tag: "p",
        text: "A long caption that is cut",
        label: "A long caption that is cut",
        clipX: true,
        ellipsis: true,
        scrollWidth: 160,
        clientWidth: 100,
        width: 100,
      }),
    ],
  });
  const judged = judge(cutting);
  assert.deepEqual(judged.faults.map((fault) => fault.rule), ["words are cut off"]);
  assert.match(judged.faults[0].what, /20px of what it holds past the box/);
  assert.deepEqual(judged.notes.map((note) => note.rule), ["words are cut off"]);
  assert.match(judged.notes[0].what, /60px of what it holds past the box/);
});

test("a box that clips but hands the scrolling to a screen inside it hides nothing", () => {
  // The shape of the application itself: the shell hides its overflow, and the
  // screen inside it scrolls. Its content is not lost, it is further down.
  const shell = screen({
    nodes: [node({ id: 0, sel: "body", tag: "body", text: "the whole game", label: "the whole game", clipY: true, scrollHeight: 4000, clientHeight: 844, scrolls: true })],
  });
  assert.deepEqual(judge(shell), { faults: [], notes: [] });
});

test("two pieces of text of one parent drawn on each other are a fault", () => {
  const over = screen({
    nodes: [
      node({ id: 0, parent: 9, sel: "h3", tag: "h3", text: "Kingdom of Axum", x: 16, y: 100, width: 200, height: 20 }),
      node({ id: 1, parent: 9, sel: "span", tag: "span", text: "Not studied", x: 40, y: 104, width: 160, height: 20 }),
    ],
  });
  const faults = judge(over).faults;
  assert.deepEqual(faults.map((fault) => fault.rule), ["one text is drawn on another"]);
  assert.match(faults[0].what, /Kingdom of Axum.*and span "Not studied"/);
});

test("text nested in another box is not drawn on it, and a clipped corner is not a collision", () => {
  // Text inside a box is over it by definition, which is not a fault; and two
  // texts sharing a couple of pixels of padding are sharing a border.
  const nested = screen({
    nodes: [
      node({ id: 0, parent: 1, sel: "h3", tag: "h3", text: "Ancient Egypt", x: 16, y: 100, width: 200, height: 20 }),
      node({ id: 1, parent: -1, sel: "div", tag: "div", text: "Ancient Egypt", x: 16, y: 100, width: 200, height: 20 }),
      node({ id: 2, parent: 3, sel: "span:nth-child(1)", tag: "span", text: "Level 1", x: 16, y: 100, width: 100, height: 20 }),
      node({ id: 3, parent: 3, sel: "span:nth-child(2)", tag: "span", text: "Level 2", x: 114, y: 100, width: 100, height: 20 }),
    ],
  });
  assert.deepEqual(judge(nested), { faults: [], notes: [] });
});

test("a control smaller than a thumb wants is worth saying, and a hidden input is not", () => {
  const small = screen({
    nodes: [
      node({ id: 0, sel: "button", tag: "button", label: "Android", interactive: true, width: 62, height: 22 }),
      node({ id: 1, sel: "input", tag: "input", label: "", interactive: true, width: 1, height: 1 }),
      node({ id: 2, sel: "button:nth-child(3)", tag: "button", label: "Play", interactive: true, width: 358, height: 56 }),
    ],
  });
  const judged = judge(small);
  assert.deepEqual(judged.faults, []);
  assert.deepEqual(judged.notes.map((note) => note.rule), ["smaller than a thumb wants"]);
  assert.match(judged.notes[0].what, /button "Android" at 62x22/);
  assert.ok(TAP_COMFORTABLE > 0 && OVERLAP_MIN_PX > 0);
});

test("a link set in a sentence is not a target a thumb is asked to hit", () => {
  // The page of works this game stands on is three hundred links laid out as
  // text, and a note naming every one of them says nothing a reader can fix. A
  // link inside a run of text is exempt from the size a target is asked for -
  // in WCAG and in axe's own rule - and it is the only thing read that way: the
  // same box on a button is a control, and the note is about those.
  const mixed = screen({
    nodes: [
      node({ id: 0, sel: "a:nth-child(1)", tag: "a", label: "A work, in a sentence of its own", interactive: true, inline: true, width: 190, height: 17 }),
      node({ id: 1, sel: "button:nth-child(2)", tag: "button", label: "Cancel", interactive: true, width: 36, height: 36 }),
    ],
  });
  const notes = judge(mixed).notes;
  assert.deepEqual(notes.map((note) => note.rule), ["smaller than a thumb wants"]);
  assert.match(notes[0].what, /button "Cancel" at 36x36/);
  assert.ok(
    !notes.some((note) => note.what.includes("in a sentence of its own")),
    "a link in a run of text is left out of the count"
  );
});

test("a screen of small controls is summed up rather than listed", () => {
  // Every card of the map carries controls of its own, and a report of seven
  // hundred lines of them is a report nobody reads to the end.
  const many = screen({
    nodes: Array.from({ length: 30 }, (unused, index) =>
      node({ id: index, sel: `button:nth-child(${index + 1})`, tag: "button", label: `Chip ${index}`, interactive: true, x: 10, y: 10 + index, width: 30 + index, height: 20 })
    ),
  });
  const notes = judge(many).notes;
  assert.equal(notes.length, 7, "the worst six, and one line that counts the rest");
  assert.match(notes[0].what, /button "Chip 0" at 30x20/);
  assert.match(notes.at(-1).what, /30 control\(s\) on this screen are under 44px, the smallest of them 20px/);
});

test("which element a fault is on can be found again from the line", () => {
  assert.equal(
    describe(node({ sel: "button:nth-child(2)", tag: "button", label: "Play", x: 16, y: 640, width: 358, height: 56 })),
    'button "Play" at 358x56 (x 16, y 640) - button:nth-child(2)'
  );
  assert.equal(describe(node({ tag: "div", sel: "div:nth-child(4)" })), "div at 100x40 (x 0, y 0) - div:nth-child(4)");
});

test("the phone sizes are the ones it audits, smallest first", () => {
  assert.deepEqual(
    PHONE_SIZES.map((size) => size.width),
    [320, 390]
  );
  for (const size of PHONE_SIZES) {
    assert.ok(size.width < size.height, `${size.name} is held upright`);
    assert.ok(size.width >= 320, `${size.name} is a phone rather than a watch`);
  }
});

test("the measuring function travels alone", () => {
  // It is handed to a browser as text and run there, where nothing of this
  // module exists: a constant it reached for would be a name that is not
  // defined, and the audit would fail on every screen at once rather than say
  // what is wrong with one. So it may read its own argument and nothing else,
  // and the selector it matches on is handed in for exactly this reason.
  const source = collectInPage
    .toString()
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const borrowed = Object.keys(rules).filter(
    (name) => name !== "collectInPage" && new RegExp(`\\b${name}\\b`).test(source)
  );
  assert.deepEqual(borrowed, [], "the function reads a name that will not be there");
  assert.match(source, /\(interactiveSelector\)/);
});

test("the measuring function runs in a document and answers with what a message can carry", () => {
  // jsdom lays nothing out, so the rectangles it reports are all zero - that is
  // the whole reason the real audit needs a real browser. What is checked here
  // is that it walks a document without throwing and returns plain data.
  const dom = new JSDOM(
    `<!doctype html><html><body>
      <div id="root">
        <h1>Africa History Quest</h1>
        <button aria-label="English">English</button>
        <div style="overflow: hidden"><p>A caption</p></div>
      </div>
    </body></html>`,
    { pretendToBeVisual: true }
  );
  const window = dom.window;
  const previous = { getComputedStyle: globalThis.getComputedStyle };
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  globalThis.document = window.document;
  globalThis.window = window;
  try {
    const measured = collectInPage(INTERACTIVE_SELECTOR);
    assert.deepEqual(Object.keys(measured).sort(), ["nodes", "page", "viewport"]);
    assert.ok(measured.nodes.length > 0, "it found something to judge");
    const button = measured.nodes.find((candidate) => candidate.tag === "button");
    assert.ok(button, "the control it can be acted on");
    assert.equal(button.interactive, true);
    assert.equal(button.label, "English");
    assert.equal(typeof button.width, "number");
    // Nothing of the module leaked into what a browser would send back.
    assert.deepEqual(JSON.parse(JSON.stringify(measured)), measured);
  } finally {
    globalThis.getComputedStyle = previous.getComputedStyle;
    delete globalThis.document;
    delete globalThis.window;
  }
});
