import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The app is bilingual: switching the language must never leave a raw key on
 * screen or a sentence in the wrong language. Nothing in the build catches a
 * missing translation, so this test reads the translation file and compares the
 * two key lists.
 *
 * It reads the source rather than the module: importing it would touch
 * localStorage, which does not exist under the test runner.
 */
const source = readFileSync(path.resolve(import.meta.dirname, "i18n.jsx"), "utf8");

/** Top level keys of one language block, in the order they are written. */
function keysOf(language) {
  const start = source.indexOf(`\n  ${language}: {`);
  assert.ok(start > -1, `the ${language} block exists`);
  const end = source.indexOf("\n  },", start);
  assert.ok(end > start, `the ${language} block is closed`);
  // Nested objects (badge names, for instance) are indented deeper, so only
  // exactly four spaces in front of a key counts as a top level wording.
  return [...source.slice(start, end).matchAll(/^ {4}([A-Za-z0-9_]+):/gm)].map((match) => match[1]);
}

test("every wording exists in both languages", () => {
  const english = keysOf("en");
  const french = keysOf("fr");

  assert.ok(english.length > 150, `only ${english.length} English wordings were found`);
  assert.ok(french.length > 150, `only ${french.length} French wordings were found`);
  assert.deepEqual(
    english.filter((key) => !french.includes(key)),
    [],
    "keys missing from the French dictionary"
  );
  assert.deepEqual(
    french.filter((key) => !english.includes(key)),
    [],
    "keys missing from the English dictionary"
  );
});
