import test from "node:test";
import assert from "node:assert/strict";
import { auditLegalReadiness } from "./legal-audit.js";
import { DPO, HOST, PUBLISHER, contactFacts, hostFacts, publisherFacts } from "./publisher.js";

/**
 * The identity blocks of the two legal pages, held to the facts a store review
 * asks for.
 *
 * Two facts have to meet here, and neither can be checked alone. The audit
 * (`legal-audit.js`) lists what a store or a data protection authority will ask
 * for; the blocks below are what the privacy notice and the terms of use actually
 * render. A fact the audit demands and no page shows is an invisible gap, which is
 * the one failure the whole arrangement exists to prevent - and it is invisible
 * precisely because the value is empty.
 *
 * So the list of facts is taken from the audit rather than kept here: a fact added
 * to the check is a fact this test then asks the pages about. And each fact is
 * exercised with a made up value rather than with the real one, because the real
 * ones are the publisher's to supply and may not be filled in yet: a test that
 * only passed once an address existed would punish the very thing it is meant to
 * encourage. The value is written into the module, read back through the blocks
 * the pages render, and put back.
 *
 * The pages declare which blocks they render, and another test holds those
 * declarations to the builders they name (`legal-audit.test.js`); this one holds
 * the builders to the audit.
 */

/** Every block the two pages render between them, for one language. */
function blocks(lang) {
  return [
    ...publisherFacts(lang),
    ...publisherFacts(lang, { includeDpo: false }),
    ...hostFacts(lang),
    ...contactFacts(lang),
  ];
}

/** The module each field of the audit belongs to. */
const HOLDERS = { publisher: PUBLISHER, host: HOST, dpo: DPO };

/**
 * Every fact the audit can report, asked of the audit itself: everything empty,
 * and a data protection officer required, which is the widest list it has.
 */
const AUDITED = auditLegalReadiness({
  publisher: { name: "", legalName: "", legalForm: "", address: "", registration: "", email: "" },
  host: { name: "", address: "", phone: "" },
  dpo: { required: true, email: "" },
}).map((gap) => gap.field);

/** One fact set to a made up value, the blocks read back, and the value restored. */
function withFact(field, sentinel, read) {
  const [holder, key] = field.split(".");
  const target = HOLDERS[holder];
  const wasRequired = DPO.required;
  const before = target[key];

  target[key] = sentinel;
  // A field of the data protection block only reaches the page when the officer
  // is said to exist, so asking about it means asking with one.
  if (holder === "dpo") DPO.required = true;
  try {
    return read();
  } finally {
    target[key] = before;
    DPO.required = wasRequired;
  }
}

test("every fact the audit asks for is a row the pages can render, in both languages", () => {
  // The audit names the fields; if it ever stops naming them, this test has
  // nothing left to hold, and that is worth failing over.
  assert.ok(AUDITED.length >= 10, `the audit reports only ${AUDITED.length} fact(s)`);

  for (const lang of ["en", "fr"]) {
    const labels = blocks(lang).map((row) => row.label);

    for (const field of AUDITED) {
      const sentinel = `sentinel-${field.replace(".", "-")}`;
      const patched = withFact(field, sentinel, () => blocks(lang));
      const carried = patched.filter((row) => String(row.value).includes(sentinel));

      assert.ok(carried.length > 0, `${field} is asked for and shown by no page (${lang})`);
      for (const row of carried) {
        assert.equal(row.missing, false, `${field} is filled and still reads as a gap (${lang})`);
      }
      // A value appearing must not move anything else: the identity block is the
      // same list of labels whether a fact has been supplied or not, which is what
      // lets a reader see a gap where it is rather than a page that shifts as the
      // publisher fills it in.
      assert.deepEqual(
        patched.map((row) => row.label),
        labels,
        `${field} changed the rows a block renders (${lang})`
      );
    }
  }
});

test("a fact with no value yet is shown as a gap, never as a blank", () => {
  // The legal pages carry the publisher's own words; the one thing they may not
  // carry is an empty line, because an unfilled field that renders as nothing is
  // exactly the field that ships unnoticed.
  for (const lang of ["en", "fr"]) {
    const rows = blocks(lang);

    for (const row of rows) {
      assert.ok(row.label.trim() !== "", `a row lost its label (${lang})`);
      assert.ok(row.value.trim() !== "", `a row is blank, so a gap is invisible: ${row.label} (${lang})`);
    }

    // And every gap says the same thing, in the language on screen: three
    // different ways of writing "missing" would read as three different problems.
    const wordings = new Set(rows.filter((row) => row.missing).map((row) => row.value));
    assert.ok(wordings.size <= 1, `${wordings.size} different wordings for a gap (${lang})`);
  }
});

/** The value a fact holds right now, read from the module that holds it. */
function valueOf(field) {
  const [holder, key] = field.split(".");
  return HOLDERS[holder][key];
}

test("the values that are filled in reach both pages, in both languages", () => {
  // The sentinel test above proves the wiring with values that are borrowed for
  // one assertion; this one proves it with the values that are really there,
  // which is what a store review, and a reader, actually reads. A fact that is
  // filled in and rendered by no page is the same failure as an empty one: it
  // exists in the code and nowhere the law looks. The data protection officer is
  // left out of the list, since no officer has been appointed and saying there is
  // none is the whole of what that block has to say.
  const asked = AUDITED.filter((field) => !field.startsWith("dpo."));
  const missing = asked.filter((field) => String(valueOf(field)).trim() === "");
  assert.deepEqual(missing, [], `a legal page still shows a gap at: ${missing.join(", ")}`);

  for (const lang of ["en", "fr"]) {
    const page = blocks(lang);
    const shown = page.map((row) => String(row.value)).join("\n");

    for (const field of asked) {
      assert.ok(shown.includes(valueOf(field)), `${field} is filled in and reaches no page (${lang})`);
    }
    // And nothing on either page is left reading as a gap any more.
    assert.deepEqual(
      page.filter((row) => row.missing).map((row) => row.label),
      [],
      `a row still reads as a gap (${lang})`
    );
  }
});

test("the two languages word every fact, and the codes never reach the page", () => {
  // A label is a word the reader sees, not a key: the blocks are built from a
  // dictionary of two languages, and a fact that exists in one and not the other
  // would leave a hole in the page written in the second.
  const english = publisherFacts("en").map((row) => row.label);
  const french = publisherFacts("fr").map((row) => row.label);
  const englishHost = hostFacts("en").map((row) => row.label);

  assert.equal(french.length, english.length, "the two languages show a different number of facts");
  assert.equal(
    hostFacts("fr").map((row) => row.label).length,
    englishHost.length,
    "the host block is a different length in French"
  );
  for (const label of [...english, ...french, ...englishHost]) {
    assert.equal(label, label.trim(), `a label carries stray spacing: "${label}"`);
    assert.doesNotMatch(label, /^[a-z][A-Za-z]*$/, `a label looks like a code rather than a word: "${label}"`);
  }
});
