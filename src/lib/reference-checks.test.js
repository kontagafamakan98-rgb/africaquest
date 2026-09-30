import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CHECKS_FILE,
  CONFIRMATION_AGE_DAYS,
  RECORD_ANSWERS,
  RECORD_REASONS,
  ageInDays,
  checkRecord,
  cleanRecord,
  recordBody,
  recordCountsOver,
  recordDisagreesWith,
  recordFor,
  recordIsFresh,
  recordsOf,
  verdictOfRecord,
  withRecord,
} from "./reference-checks.js";
import { pageIsWrong, pageNamesAWork, pageNamesTheInstitution } from "./reference-pages.js";

// The checks a person made, and what the report does with them.
//
// A publisher is allowed to refuse a script, and when it does, no run of ours can
// read a title out of a page it was never handed: those references used to stay
// unconfirmed forever, which is honest and is also where it stopped. A person can
// open the page, and these tests are about the record of that reading - that it
// says who and when, that a page read here counts where the machine is silent and
// nowhere else, that a reading comes due rather than standing, and that a finding
// read by hand is a failure like any other.
//
// Nothing here touches the network or the file on disk: the module decides, the
// command writes, and what the command reads is the same module this suite reads.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPT = readFileSync(path.join(ROOT, "scripts", "check-reference-pages.mjs"), "utf8");
const NOW = Date.parse("2026-09-29T12:00:00");

/** One reading, as a person would write it. */
const reading = (extra = {}) => ({
  url: "https://example.org/article",
  answer: "work",
  title: "Example article - Example Institute",
  by: "A Reader",
  on: "2026-09-01",
  ...extra,
});

test("a reading is one of five answers, with who read it and on which day", () => {
  // The five, as a person sees them: the work's title, the institution's, or one
  // of the three ways a page stops being the work it was cited for.
  assert.deepEqual(Object.keys(RECORD_ANSWERS), ["work", "institution", "elsewhere", "moved", "gone"]);

  const record = cleanRecord(reading());
  assert.deepEqual(record, {
    url: "https://example.org/article",
    answer: "work",
    title: "Example article - Example Institute",
    by: "A Reader",
    on: "2026-09-01",
  });

  // A note is the one optional field, and it travels with the reading or not at all.
  assert.equal(cleanRecord(reading({ note: "  paywalled,  read in the reading room " })).note, "paywalled,  read in the reading room");
  assert.equal("note" in cleanRecord(reading()), false, "an empty note is written down at all");

  // Every field a person has to supply, refused with the field named rather than
  // silently dropped: a record nobody made is not a check.
  const refused = [
    [{ ...reading(), url: "" }, RECORD_REASONS.noAddress],
    [{ ...reading(), url: "http://example.org/article" }, RECORD_REASONS.notHttps],
    [{ ...reading(), answer: "probably" }, RECORD_REASONS.unknownAnswer],
    [{ ...reading(), by: "   " }, RECORD_REASONS.noName],
    [{ ...reading(), on: "01/09/2026" }, RECORD_REASONS.noDate],
    [{ ...reading(), on: "2027-01-01" }, RECORD_REASONS.futureDate],
    [{ ...reading(), title: "" }, RECORD_REASONS.noTitle],
    [null, RECORD_REASONS.noAddress],
  ];
  for (const [raw, reason] of refused) {
    const checked = checkRecord(raw, { now: NOW });
    assert.equal(checked.ok, false, `${JSON.stringify(raw)} was accepted`);
    assert.equal(checked.reason, reason);
  }
  // A page that is not there may answer with no title at all: the browser's own
  // message is what there is to write down, and a reading of that page is still a
  // reading. Every other answer has to say what the tab said.
  assert.equal(checkRecord({ ...reading(), answer: "gone", title: "" }, { now: NOW }).ok, true);
  assert.equal(cleanRecord({ ...reading(), title: null }), null);
});

test("a reading is only written for a page the references really point at", () => {
  const known = ["https://whc.unesco.org/en/list/119/", "https://www.britannica.com/search?query=d%27Or"];

  // The address as the report prints it.
  assert.equal(
    checkRecord(reading({ url: "https://whc.unesco.org/en/list/119/" }), { known, now: NOW }).ok,
    true
  );
  // And the same address with the escaping a person would not reproduce by hand:
  // compared as addresses rather than as strings, so a reading is not refused over
  // an apostrophe the server writes one way and the file the other.
  assert.equal(
    checkRecord(reading({ url: "https://www.britannica.com/search?query=d'Or" }), { known, now: NOW }).ok,
    true,
    "an address is compared as a reader would see it, not as two strings"
  );

  // And the typo that would otherwise become a check for a page nobody cites,
  // kept out of the file with the reason spelled out.
  const unknown = checkRecord({ ...reading({ url: "https://whc.unesco.org/en/list/911/" }) }, { known, now: NOW });
  assert.equal(unknown.ok, false);
  assert.equal(unknown.reason, RECORD_REASONS.unknownPage);

  // Read back, the same rule is not applied: what is in the file was written
  // through the other door, and a page that stopped being cited must not make the
  // whole file unusable.
  assert.equal(cleanRecord(reading({ url: "https://example.org/anything" }))?.url, "https://example.org/anything");
});

test("the file is sorted and even, so reading a page again changes one line", () => {
  const one = withRecord([], reading({ url: "https://b.example.org/" }), { now: NOW });
  const two = withRecord(one.records, reading({ url: "https://a.example.org/" }), { now: NOW });
  assert.equal(two.ok, true);

  const body = recordBody(two.records);
  assert.match(body, /\n$/, "the file ends in a newline like every other one in the repository");
  assert.deepEqual(
    recordsOf(body).map((record) => record.url),
    ["https://a.example.org/", "https://b.example.org/"],
    "the file is not in the one order two people can compare"
  );
  // Recording the same page again replaces its line rather than adding a second
  // answer to the same question.
  const again = withRecord(two.records, reading({ url: "https://a.example.org/", by: "Someone Else" }), { now: NOW });
  assert.equal(again.replaced, true);
  assert.equal(again.records.length, 2);
  assert.equal(recordFor(again.records, "https://a.example.org/").by, "Someone Else");
  assert.equal(recordBody(again.records).split("\n").length, recordBody(two.records).split("\n").length);

  // A hand-edited file is read rather than trusted: a broken line is dropped and
  // the rest of the file still stands.
  const mixed = recordsOf(
    JSON.stringify([reading({ url: "https://a.example.org/" }), { url: "https://b.example.org/" }, "junk", reading({ url: "https://a.example.org/", by: "Second" })])
  );
  assert.deepEqual(mixed.map((record) => record.url), ["https://a.example.org/"]);
  assert.equal(mixed[0].by, "A Reader", "the first record for an address is the one kept");
  assert.deepEqual(recordsOf("{ not json"), []);
  assert.deepEqual(recordsOf(JSON.stringify({ records: [] })), []);
});

test("a reading counts where the machine is silent, and comes due rather than standing", () => {
  const record = cleanRecord(reading({ on: "2026-09-29" }));

  // The hole this exists for: a publisher that refuses a script, and a page that
  // could not be read, are both answered by a person who opened them.
  assert.equal(recordCountsOver(record, { kind: "refused" }, NOW), true);
  assert.equal(recordCountsOver(record, { kind: "unreadable" }, NOW), true);
  // And nothing else: an answer about the page is today's answer, and stands.
  for (const kind of ["named", "elsewhere", "moved", "gone"]) {
    assert.equal(recordCountsOver(record, { kind }, NOW), false, `a ${kind} answer was covered by a note`);
  }
  assert.equal(recordCountsOver(null, { kind: "refused" }, NOW), false);

  // A reading is a claim about a moment, so it is dated and it comes due: the
  // day it was made it is worth nothing less, and a year later the page has not
  // been read.
  assert.equal(ageInDays(record, NOW), 0);
  assert.equal(ageInDays(cleanRecord(reading({ on: "2026-09-01" })), NOW), 28);
  assert.equal(recordIsFresh(cleanRecord(reading({ on: "2025-09-29" })), NOW), true, "a year to the day is still held");
  assert.equal(recordIsFresh(cleanRecord(reading({ on: "2025-09-28" })), NOW), false);
  assert.equal(recordCountsOver(cleanRecord(reading({ on: "2025-09-28" })), { kind: "refused" }, NOW), false);
  assert.ok(CONFIRMATION_AGE_DAYS > 0 && Number.isInteger(CONFIRMATION_AGE_DAYS));
  // And a clock that runs backwards does not turn a reading into one made before
  // it was made: the age is a whole number of days and never a negative one.
  assert.equal(ageInDays({ on: "2026-10-05" }, NOW), 0);
  assert.equal(ageInDays({ on: "2026-09-29" }, NOW), 0);
});

test("a finding read by hand is a finding, and a disagreeing answer is printed as one", () => {
  const verdict = (answer, title = "What the tab said") => verdictOfRecord(cleanRecord(reading({ answer, title })));

  // The two confirmations behave exactly like the machine's own, which is what
  // lets the same report lines print both.
  assert.equal(pageNamesAWork(verdict("work")), true);
  assert.equal(pageNamesTheInstitution(verdict("institution")), true);
  assert.equal(pageIsWrong(verdict("work")), false);
  assert.equal(pageIsWrong(verdict("institution")), false);
  // The three findings do not: a page a person read as moved or gone is a link to
  // correct, and a check that called it a confirmation would be worse than none.
  for (const answer of ["elsewhere", "moved", "gone"]) {
    assert.equal(pageIsWrong(verdict(answer)), true, `${answer} was read as a confirmation`);
  }
  assert.deepEqual(verdict("gone"), { kind: "gone", title: "What the tab said" });

  // An answer that disagrees with the note is printed as a disagreement rather
  // than one of them being quietly preferred by this module.
  assert.equal(recordDisagreesWith(cleanRecord(reading({ answer: "work" })), { kind: "named", how: "work" }), false);
  assert.equal(recordDisagreesWith(cleanRecord(reading({ answer: "institution" })), { kind: "named", how: "work" }), true);
  assert.equal(recordDisagreesWith(cleanRecord(reading({ answer: "gone" })), { kind: "named", how: "work" }), true);
  assert.equal(recordDisagreesWith(cleanRecord(reading({ answer: "moved" })), { kind: "moved" }), false);
});

test("the check reads the file, records through this module, and stays outside the verification", () => {
  // One file, one module, one command: the check never writes, and the command
  // writes through the rules this suite read rather than through rules of its own.
  assert.equal(CHECKS_FILE, "build/reference-checks.json");
  assert.match(SCRIPT, /from "\.\.\/src\/lib\/reference-checks\.js"/, "the script does not read the module these tests read");
  assert.match(SCRIPT, /CHECKS_FILE/, "the script does not read the file the command writes");
  assert.match(SCRIPT, /recordBody\(/, "the command writes the file through a body of its own");
  assert.match(SCRIPT, /withRecord\(/, "a record is not written through the rules the tests read");

  // The two halves of the report a person needs: where the still-unconfirmed
  // pages are, and the command that closes them, with the flags it takes.
  assert.match(SCRIPT, /--record/, "the command cannot record anything");
  assert.match(SCRIPT, /--title/, "the command does not ask what the page said");
  assert.match(SCRIPT, /--by/, "the command does not ask who read it");
  assert.match(SCRIPT, /check:references:record/, "the report does not say how to record a reading");
  // And what was read is printed with the person and the day, so a confirmation
  // in the report is always a dated one.
  assert.match(SCRIPT, /read by \$\{record\.by\} on \$\{record\.on\}/, "a reading is printed without who made it or when");
  // And a page a person read as moved or gone is a finding rather than a
  // confirmation: the pages the report credits to a person are taken from the
  // named ones, so a reading that is wrong can never be printed as one that held.
  assert.match(
    SCRIPT,
    /namedWork\.concat\(namedInstitution\)/,
    "a reading of a moved or missing page is counted among the confirmations"
  );
  assert.match(SCRIPT, /older than the \d+ days a reading is held for|a reading is held for/, "a reading that came due is not named as due");

  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts["check:references:record"], /check-reference-pages\.mjs --record/, "package.json registers the recording command");
  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.doesNotMatch(verify, /check-reference-pages/, "the checks that need the network are part of the verification");
});
