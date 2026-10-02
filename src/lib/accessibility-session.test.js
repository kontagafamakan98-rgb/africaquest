import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

// The promise and the page it is kept on.
//
// ACCESSIBILITY.md says what to do in a screen reader session and what counts as
// a failure; ACCESSIBILITY_SESSION.md is the form the next person fills while
// doing it. Two documents about one sitting drift the moment a checkpoint is
// added to the protocol and not to the form, and the person who finds out is the
// one holding the form in front of a reader. This is what holds the two ends
// together, the way the drift tests hold a release to the site.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

const PROTOCOL = "ACCESSIBILITY.md";
const FORM = "ACCESSIBILITY_SESSION.md";

/** The checkpoint headings, `### 1. The map`, as the two files write them. */
function checkpoints(text) {
  return [...text.matchAll(/^### (\d+)\. (.+)$/gm)].map((match) => ({
    number: match[1],
    title: match[2].trim(),
  }));
}

/**
 * The body of one checkpoint, up to the next heading of any size.
 *
 * The heading line itself is dropped before the next heading is looked for: it
 * matches the very pattern being searched, so a slice that kept it would end at
 * once and answer every question below with an empty string.
 */
function section(text, number) {
  const start = text.search(new RegExp(`^### ${number}\\. `, "m"));
  assert.ok(start >= 0, `no section ${number} in the file`);
  const rest = text.slice(start).split("\n").slice(1).join("\n");
  const end = rest.search(/^#{1,3} /m);
  return end === -1 ? rest : rest.slice(0, end);
}

test("the form asks for every checkpoint the protocol walks through", () => {
  const protocol = checkpoints(read(PROTOCOL));
  const form = checkpoints(read(FORM));

  assert.ok(protocol.length >= 5, `only ${protocol.length} checkpoints in the protocol`);
  assert.deepEqual(
    form.map((checkpoint) => checkpoint.number),
    protocol.map((checkpoint) => checkpoint.number),
    "the form numbers its checkpoints differently from the protocol"
  );
  assert.deepEqual(
    form.map((checkpoint) => checkpoint.title),
    protocol.map((checkpoint) => checkpoint.title),
    "a checkpoint was renamed in one file and not the other"
  );
});

test("every checkpoint can be marked, and none of them silently cannot", () => {
  const form = read(FORM);
  for (const { number, title } of checkpoints(read(PROTOCOL))) {
    const marked = section(form, number);
    // The three words a person writes, and the one the protocol calls the last
    // line of a section: a checkpoint nobody can mark pass or failure is a
    // checkpoint the session cannot report on.
    assert.match(marked, /pass/i, `checkpoint ${number} (${title}) has nowhere to say it passed`);
    assert.match(marked, /note/i, `checkpoint ${number} (${title}) has nowhere to say it was a note`);
    assert.match(marked, /failure/i, `checkpoint ${number} (${title}) has nowhere to say it failed`);
    assert.match(marked, /what was heard/i, `checkpoint ${number} (${title}) has nowhere for the words`);
  }
});

test("a shape of question added to the quiz is a shape the form asks about", () => {
  // The quiz is the one checkpoint that is really several, and its own section is
  // where the protocol lists them. Read from there rather than written here, so a
  // fifth shape is asked about the day it is added.
  const shapes = [...section(read(PROTOCOL), 4).matchAll(/^- \*\*(.+?)\*\*/gm)].map((match) =>
    match[1].trim().replace(/\.$/, "")
  );
  assert.ok(shapes.length >= 6, `only ${shapes.length} shapes read out of the quiz section`);

  const form = section(read(FORM), 4);
  for (const shape of shapes) {
    assert.ok(
      form.replace(/\.$/, "").includes(shape),
      `the quiz form does not ask about "${shape}"`
    );
  }
});

test("the five things that make a session reproducible are asked for first", () => {
  const form = read(FORM);
  const preamble = form.slice(form.indexOf("## Before you start"), form.indexOf("## The route"));
  for (const [what, pattern] of [
    ["the date", /\*\*Date:\*\*/],
    ["the reader", /\*\*Reader:\*\*/],
    ["the screen reader and its version", /\*\*Screen reader and its version:\*\*/],
    ["the browser", /\*\*Browser:\*\*/],
    ["the language", /\*\*Language:\*\*/],
    ["where the reading happened", /\*\*Where you are reading:\*\*/],
  ]) {
    assert.match(preamble, pattern, `${what} is not asked for before the first word is spoken`);
  }
});

test("the two documents name each other, and the promise in the README keeps its pointer", () => {
  // A form nobody is sent to is a form nobody fills, and the README paragraph is
  // where the project says the session is still owed.
  assert.match(read(PROTOCOL), /\[ACCESSIBILITY_SESSION\.md\]/, "the protocol never mentions its own form");
  assert.match(read("CONTRIBUTING.md"), /\[ACCESSIBILITY_SESSION\.md\]/, "a contributor is never sent to the form");
  assert.match(read(FORM), /\[ACCESSIBILITY\.md\]/, "the form never mentions the protocol it fills in");
  assert.match(read(FORM), /\[README\.md\]/, "the form does not say where the promise is recorded");
  assert.match(
    read("README.md"),
    /\[ACCESSIBILITY\.md\]/,
    "the README no longer points at the session it owes"
  );
});
