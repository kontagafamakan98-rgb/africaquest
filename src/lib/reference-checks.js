/**
 * The checks a person made, recorded with a date so that "unconfirmed" stops
 * being the last word about a page.
 *
 * Some publishers answer a script with a refusal, and no check here can read a
 * title out of a page it was never given. That leaves a hole in the report that
 * is nobody's fault: Britannica answers 403 to every address, the World Heritage
 * Centre answers 403 to all fourteen of its, and the references behind them are
 * counted as unconfirmed rather than as checked - which is honest, and which is
 * also where it used to stop, since no run of a script can ever close that hole.
 *
 * A person can. They open the page in a browser, the way a reader would, and
 * what they read is the answer the check was asking for. What is written down
 * here is that reading: the address, what it was found to be, what the title
 * said, who read it and on which day. The check then reports those pages as
 * confirmed by hand, under the name and the date, rather than as unconfirmed.
 *
 * Three things keep that from being a way to make a report green.
 *
 * The record is dated and it comes due: a confirmation is a claim about a
 * moment, and a page read a year ago has not been read today, so the check says
 * so and asks for the address again. Nothing is confirmed forever.
 *
 * A person may record a finding as easily as a confirmation. A page that moved,
 * a page that is gone, a page that answered under another title are all records
 * this holds, and they are reported as failures exactly like the machine's own -
 * a by-hand check is evidence, and evidence goes both ways.
 *
 * And a person's word is only held where the machine is silent. A page that
 * answered under another title is today's answer about today's page, and it
 * stands over a note written last spring: the two are printed together as a
 * disagreement rather than one being quietly preferred. What a record fills is a
 * refusal, not a verdict.
 *
 * The file is build/reference-checks.json, and it is written only by the record
 * command: the check reads it and never writes it. Nothing here touches the
 * network or the disk.
 */
import { localDay } from "./streak.js";
import { sameAddress } from "./urls.js";

/** Where the checks a person made are kept, beside the weights of the last build. */
export const CHECKS_FILE = "build/reference-checks.json";

/**
 * What a person may record, in the words the command takes and the file holds.
 *
 * Five answers and not six, because a person is not a request: they cannot be
 * refused or dropped by the network, and they cannot come back with an answer
 * that says nothing about the page. What they read is the work's own title, its
 * institution's, something else, or a page that moved or is gone, and each of
 * those is one entry here.
 *
 * The first two are a confirmation and the other three are a finding. The
 * `kind` and `how` are the words the rest of the report already uses, so a
 * recorded answer is printed by the same lines as a read one and not in a
 * vocabulary of its own.
 */
export const RECORD_ANSWERS = {
  work: { kind: "named", how: "work" },
  institution: { kind: "named", how: "institution" },
  elsewhere: { kind: "elsewhere" },
  moved: { kind: "moved" },
  gone: { kind: "gone" },
};

/**
 * How long a reading by hand is held for, in days, before it comes due again.
 *
 * A year, and the number is a judgement rather than a measurement. The pages
 * that need a person are the ones a script cannot read at all, and the works
 * cited there are older than the students reading about them: a year is long
 * enough that recording a check is worth doing once and short enough that a site
 * which rebuilt itself is found by whoever comes after, rather than standing as
 * an answer given by somebody who has left.
 */
export const CONFIRMATION_AGE_DAYS = 365;

/** Why a record cannot be written, so the command can say which field to fix. */
export const RECORD_REASONS = {
  noAddress: "noAddress",
  notHttps: "notHttps",
  unknownPage: "unknownPage",
  unknownAnswer: "unknownAnswer",
  noName: "noName",
  noDate: "noDate",
  futureDate: "futureDate",
  noTitle: "noTitle",
};

const DAY_MS = 86_400_000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RECORDS = 200;
const MAX_TITLE = 200;
const MAX_TEXT = 120;

function text(value, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * A record as the file holds it: the same fields in the same order, whatever the
 * input had, with unknown fields dropped.
 *
 * The order matters for the diff rather than for the reader: recording one page
 * again rewrites one line of the file, and a record built in a different order
 * would rewrite three.
 */
function shaped(url, answer, title, by, on, note) {
  const record = { url, answer, title, by, on };
  if (note) record.note = note;
  return record;
}

/**
 * Whether a value can be one of our records, and what is wrong with it when it
 * cannot.
 *
 * Two doors into the same rule, because the file and the command fail the same
 * way but say different things about it: the command prints the reason with the
 * flag to fix, and the check drops the record and reports the page as
 * unconfirmed, which is what an unreadable record has always meant here.
 *
 * `known` is the addresses the references really point at, passed in rather than
 * imported, so a typo in one recorded line cannot create a check for a page
 * nobody cites. An empty list means the rule is not applied, which is what
 * reading the file does: what is in the file was written through the other door.
 */
export function checkRecord(raw, { known = [], now = Date.now() } = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, reason: RECORD_REASONS.noAddress };

  const url = text(raw.url, 300);
  if (!url) return { ok: false, reason: RECORD_REASONS.noAddress };
  if (!/^https:\/\//i.test(url)) return { ok: false, reason: RECORD_REASONS.notHttps };
  if (known.length > 0 && !known.some((page) => sameAddress(page, url))) {
    return { ok: false, reason: RECORD_REASONS.unknownPage };
  }

  const answer = text(raw.answer, 20).toLowerCase();
  if (!(answer in RECORD_ANSWERS)) return { ok: false, reason: RECORD_REASONS.unknownAnswer };

  const by = text(raw.by, 40);
  if (!by) return { ok: false, reason: RECORD_REASONS.noName };

  const on = text(raw.on, 10);
  if (!ISO_DAY.test(on)) return { ok: false, reason: RECORD_REASONS.noDate };
  if (on > localDay(now)) return { ok: false, reason: RECORD_REASONS.futureDate };

  const title = text(raw.title, MAX_TITLE);
  // What the person read is the whole point of the record, with one exception: a
  // page that is not there may answer with no title at all, and the browser's own
  // message is what there is to write down.
  if (!title && answer !== "gone") return { ok: false, reason: RECORD_REASONS.noTitle };

  return { ok: true, record: shaped(url, answer, title, by, on, text(raw.note)) };
}

/** One record, or nothing when it cannot be one. */
export function cleanRecord(raw) {
  const checked = checkRecord(raw);
  return checked.ok ? checked.record : null;
}

/**
 * The records a file holds, in one order, with anything unusable left out.
 *
 * The file is ours and it is also a file on disk: it can be hand-edited, it can
 * be half-written by an editor that was interrupted, it can be a list of things
 * somebody believed. So every line is put through the same rule as a new one,
 * a line that fails is dropped rather than kept as a half record, and the result
 * is sorted by address so that two people comparing two checks of this
 * repository are looking at the same list in the same order.
 *
 * One record per address: a second one for the same page would be two answers to
 * one question, and keeping the first is what makes a duplicate line in a
 * hand-edited file change nothing at all.
 */
export function recordsOf(text_) {
  let parsed = null;
  try {
    parsed = JSON.parse(typeof text_ === "string" ? text_ : "");
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const records = [];
  for (const raw of parsed) {
    if (records.length >= MAX_RECORDS) break;
    const record = cleanRecord(raw);
    if (!record || records.some((kept) => sameAddress(kept.url, record.url))) continue;
    records.push(record);
  }
  return records.sort(byAddress);
}

/** Two addresses in the one order every reader of the file shares. */
function byAddress(one, other) {
  return one.url < other.url ? -1 : one.url > other.url ? 1 : 0;
}

/** The file's own text: sorted, indented, and ending in a newline like the others. */
export function recordBody(records = []) {
  return `${JSON.stringify([...records].sort(byAddress), null, 2)}\n`;
}

/**
 * The records with one more in them, or the reason it cannot be written.
 *
 * The address and the person are required, since a record nobody made is not a
 * check, and the day defaults to today: a reading is written down the day it is
 * made, and the flag exists for the one case where that is not so, which is a
 * page read yesterday and recorded this morning.
 */
export function withRecord(records = [], entry = {}, { known = [], now = Date.now() } = {}) {
  const checked = checkRecord(
    {
      url: entry.url,
      answer: entry.answer,
      title: entry.title,
      by: entry.by,
      on: entry.on || localDay(now),
      note: entry.note,
    },
    { known, now }
  );
  if (!checked.ok) return { ok: false, reason: checked.reason };

  const kept = records.filter((record) => !sameAddress(record.url, checked.record.url));
  return {
    ok: true,
    replaced: kept.length !== records.length,
    records: [...kept, checked.record].sort(byAddress),
  };
}

/** The record for one address, or nothing when no person has read it. */
export function recordFor(records = [], url = "") {
  return records.find((record) => sameAddress(record.url, url)) || null;
}

/** How many whole days ago a page was read, and never a negative number. */
export function ageInDays(record, now = Date.now()) {
  const days = Math.round((Date.parse(localDay(now)) - Date.parse(record.on)) / DAY_MS);
  return Math.max(0, days);
}

/** Whether a reading is still recent enough to be held. */
export function recordIsFresh(record, now = Date.now()) {
  return ageInDays(record, now) <= CONFIRMATION_AGE_DAYS;
}

/**
 * Whether a reading stands in for this answer.
 *
 * Only where the machine is silent: a refusal and a page that could not be read
 * say nothing about the address, and that silence is exactly the hole a person
 * fills. Everything else the machine said about a page - that it answered under
 * another title, that it moved, that it is gone - is today's evidence about
 * today's page, and it stands over a note written months ago rather than being
 * overruled by it. The two are printed together in that case, so the difference
 * is read rather than resolved here.
 */
export function recordCountsOver(record, machine, now = Date.now()) {
  if (!record || !recordIsFresh(record, now)) return false;
  return machine?.kind === "refused" || machine?.kind === "unreadable";
}

/**
 * The answer a record stands for, in the words the rest of the report uses, so a
 * page read by a person is printed by the same lines as a page read by a script.
 */
export function verdictOfRecord(record) {
  const answer = RECORD_ANSWERS[record.answer];
  return { kind: answer.kind, ...(answer.how ? { how: answer.how } : {}), title: record.title };
}

/** Whether two answers disagree about the same page, a title read by hand or not. */
export function recordDisagreesWith(record, machine) {
  const one = record.answer === "work" || record.answer === "institution" ? `named:${record.answer}` : record.answer;
  const other = machine?.kind === "named" ? `named:${machine.how}` : machine?.kind;
  return one !== other;
}
