/**
 * Follows the page every verified reference points at, reads the title it
 * answers with, and says when a link lands on something other than the work.
 *
 *   node scripts/check-reference-pages.mjs
 *   node scripts/check-reference-pages.mjs --record <url> --title "<what the tab says>" \
 *     --by "<your name>" [--answer work|institution|elsewhere|moved|gone] [--on YYYY-MM-DD] [--note "..."]
 *
 * This is the third check in the project that needs the network, and it is on
 * demand for the same reason as the other two: a gate that fails on a train is a
 * gate somebody turns off. Run it when a lesson is about to be relied on, or
 * when a site is suspected of having rebuilt itself, which is the day nobody
 * wants to find that out by hand.
 *
 * The pages are asked about, and their answer is read. A title is not part of a
 * status code: the other checks can ask with HEAD and learn whether a page is
 * there, and whether it is the page the table names, and this one cannot, because
 * the failure it looks for is a page that is there and is not the work. So the
 * pages are downloaded, which is why there are thirty-seven of them and not seventy-eight,
 * and why the run reads them four at a time.
 *
 * What is read is a page's own title, held against the two names the citation
 * carries: the work's, and its institution's. That is a heuristic and the report
 * says so. It is not a proof that the page is the work, since only a person can
 * read a page; it is the difference between a link that opens the work and a link
 * that opens another page, which is the difference nobody sees until a reader
 * follows it.
 *
 * Some publishers refuse a script whatever the address says, and no run of this
 * can ever read a title out of a page it was never handed. That is what the
 * second command is for: a person opens the page the way a reader would, and
 * records what they read, with their name and the day. Those readings are kept in
 * build/reference-checks.json and reported here as confirmed by hand instead of
 * unconfirmed - until they come due, since a page read a year ago has not been
 * read today. A person may record a finding just as easily as a confirmation, and
 * it is reported as a failure like any other.
 *
 * Nothing here is part of the build, and the check itself writes nothing: the
 * file is written only by the recording command, through the same rules the tests
 * read (src/lib/reference-checks.js). A run with no network says so instead of
 * pretending.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  REFERENCE_AGENT,
  pageIsWrong,
  pageNamesAWork,
  pageNamesTheInstitution,
  pageVerdict,
  referencePages,
} from "../src/lib/reference-pages.js";
import {
  CHECKS_FILE,
  CONFIRMATION_AGE_DAYS,
  RECORD_ANSWERS,
  RECORD_REASONS,
  ageInDays,
  recordBody,
  recordCountsOver,
  recordDisagreesWith,
  recordFor,
  recordIsFresh,
  recordsOf,
  verdictOfRecord,
  withRecord,
} from "../src/lib/reference-checks.js";

/** How many pages are read at once, so no publisher is hammered. */
const CONCURRENCY = 4;
/** And how long the run waits between two groups of them. */
const SPACING_MS = 250;
/** Long enough for a slow site, short enough that a hang is not a night. */
const TIMEOUT_MS = 15_000;
/**
 * How many times one page is asked about before the run gives up on it.
 *
 * Five, for the reason the credits check gives the same answer: a dropped
 * connection is common enough to measure, and a page is only reported once every
 * one of these has failed. The pages here are heavier than a HEAD answer, so a
 * run that gave up after two would report the network rather than the references.
 */
const ATTEMPTS = 5;
/** How long to wait before asking again, by why the last ask failed. */
const DROPPED_BACKOFF_MS = 400;
const LATER_BACKOFF_MS = 2_000;

/** Where the readings by hand are kept, and the words this script takes. */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKS_PATH = path.join(ROOT, CHECKS_FILE);
const ANSWERS = Object.keys(RECORD_ANSWERS).join(", ");
const RECORD_COMMAND = `npm run check:references:record -- <url> --title "<what the tab says>" --by "<your name>"`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The flags that are followed by a value, which is every flag this takes. */
const TAKES_VALUE = new Set(["answer", "by", "note", "on", "title", "url"]);

/**
 * The flags on the command line, and the words that are not flags.
 *
 * Only a flag this script knows is allowed to swallow the word after it, and a
 * flag followed by another flag is taken as a yes rather than as a page whose
 * title is `--by`. Both are there so that a word meant as the address is never
 * quietly read as the value of something else: npm passes its own flags through
 * to the script, and `npm run check:references:record --silent -- <url>` puts one
 * of them right where the address would be.
 */
function flags(argv) {
  const named = new Map();
  const bare = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      bare.push(argument);
      continue;
    }
    const name = argument.slice(2);
    const value = argv[index + 1];
    if (!TAKES_VALUE.has(name) || value === undefined || value.startsWith("--")) {
      named.set(name, true);
      continue;
    }
    named.set(name, value);
    index += 1;
  }
  return {
    has: (name) => named.has(name),
    get: (name) => (typeof named.get(name) === "string" ? named.get(name) : null),
    bare,
  };
}

const args = flags(process.argv.slice(2));

/** The readings a person has recorded, or none when there is no file yet. */
function readChecks() {
  try {
    return recordsOf(readFileSync(CHECKS_PATH, "utf8"));
  } catch {
    // No file, or one that cannot be read: nothing has been read by hand yet,
    // which is where every project starts, and an absent file is not a failure.
    return [];
  }
}

/** What to add for each reason a record cannot be written. */
const REASON_FIX = {
  [RECORD_REASONS.noAddress]: "the address is missing: pass <url>, the one the report listed",
  [RECORD_REASONS.notHttps]: "the address has to be https, as every page the references point at is",
  [RECORD_REASONS.unknownPage]: "that address is not one of the pages the references point at: the report lists the ones that are",
  [RECORD_REASONS.unknownAnswer]: `--answer must be one of ${ANSWERS}`,
  [RECORD_REASONS.noName]: "--by <your name> is missing: a reading nobody made is not a check",
  [RECORD_REASONS.noDate]: "--on must be a day written YYYY-MM-DD",
  [RECORD_REASONS.futureDate]: "--on is after today: a reading is written down the day it is made",
  [RECORD_REASONS.noTitle]: `--title "<what the tab says>" is missing: it is what was read`,
};

/**
 * The reading command: what a person saw, written into the file.
 *
 * It asks the network for nothing. The address is checked against the pages the
 * references really point at, so a typo cannot become a check for a page nobody
 * cites, and the day defaults to today, which is when a reading is made.
 */
function recordOne() {
  const written = withRecord(
    readChecks(),
    {
      url: args.get("url") || args.bare[0],
      answer: args.get("answer") || "work",
      title: args.get("title"),
      by: args.get("by"),
      on: args.get("on") || undefined,
      note: args.get("note") || undefined,
    },
    { known: referencePages().map((page) => page.url) }
  );

  if (!written.ok) {
    console.error(`references: nothing was recorded. ${REASON_FIX[written.reason] || written.reason}`);
    console.error(`  ${RECORD_COMMAND}`);
    process.exit(1);
  }

  writeFileSync(CHECKS_PATH, recordBody(written.records));
  const record = recordFor(written.records, args.get("url") || args.bare[0]);
  console.log(
    `references: recorded ${record.url} as "${record.answer}"` +
      `${record.title ? `, under the title "${record.title}"` : ""}, read by ${record.by} on ${record.on}` +
      `${written.replaced ? " (replacing the reading that was there)" : ""}`
  );
  console.log(`  ${CHECKS_FILE} now holds ${written.records.length} ${written.records.length === 1 ? "reading" : "readings"}`);
  console.log(`  ${RECORD_COMMAND}`);
  // Recording asks the network for nothing, and this run was not asked to check
  // anything: reporting the pages as well would be answering a question nobody put.
  process.exit(0);
}

if (args.has("help")) {
  console.log(
    "references: the pages the verified references point at are followed and read, four at a time.\n" +
      "  node scripts/check-reference-pages.mjs                  follow the pages and report\n" +
      "  node scripts/check-reference-pages.mjs --record <url> --title \"<what the tab says>\" --by \"<your name>\"\n" +
      `                                                          record what a person read, as ${ANSWERS}`
  );
  process.exit(0);
}

if (args.has("record")) recordOne();

/**
 * One page, read once. Never throws: a refusal, a name that does not resolve and
 * a server that never answered are all things this has to report.
 */
async function askOnce(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": REFERENCE_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // The body is read, unlike the check on the credits: the title is the thing
    // being asked for, and a title lives in the page rather than in its status.
    // Reading it also releases the connection, which dropping it would not.
    return { status: response.status, url: response.url, body: await response.text() };
  } catch (error) {
    return { error: error.cause?.message || error.message || String(error) };
  }
}

/**
 * Why an answer is worth asking about again, or nothing when it is an answer.
 *
 * Two things are: nothing was answered at all, which on this side of the network
 * is usually the connection rather than the publisher, and a page a publisher
 * says to come back for later. Everything else is an answer, and asking for it
 * again would only turn a refusal into five of them.
 */
function askAgainAfter(answer) {
  if (answer.error) return DROPPED_BACKOFF_MS;
  if (answer.status === 429 || answer.status === 503) return LATER_BACKOFF_MS;
  return null;
}

/** One page, asked about until it answers or until the run has asked enough. */
async function ask(url) {
  let last = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    last = await askOnce(url);
    const wait = askAgainAfter(last);
    if (wait === null) return last;
    if (attempt < ATTEMPTS) await sleep(attempt * wait);
  }
  return last;
}

const now = Date.now();
const pages = referencePages();
if (pages.length === 0) {
  console.error(
    "references: no verified reference points at a page, so this check held nothing to anything.\n" +
      "Every reference the game has opened a page for carries it as `url` in the level's source."
  );
  process.exit(1);
}

const checks = readChecks();
console.log(
  `references: ${pages.length} ${pages.length === 1 ? "page" : "pages"} cited by a verified link, read ${CONCURRENCY} at a time\n` +
    `  ${checks.length} of them ${checks.length === 1 ? "carries" : "carry"} a reading by hand, kept in ${CHECKS_FILE}`
);

const results = [];
for (let index = 0; index < pages.length; index += CONCURRENCY) {
  const group = pages.slice(index, index + CONCURRENCY);
  const answers = await Promise.all(group.map((page) => ask(page.url)));
  answers.forEach((answer, position) => {
    // The page first and the verdict over it, so a verdict that named one of the
    // page's works is the line the report shows and the page's own line is what
    // every other answer is reported with.
    results.push({ ...group[position], ...pageVerdict(group[position], answer) });
  });
  if (index + CONCURRENCY < pages.length) await sleep(SPACING_MS);
}

/**
 * One page's answer, with a reading by hand standing over a silence.
 *
 * A refusal is the only thing a reading fills: it is the publisher declining to
 * answer this kind of request, and the person who opened the page has answered
 * the question the run was asking. Any other answer is today's evidence about
 * today's page, so it stands and the reading is carried along beside it - printed
 * together when the two disagree, rather than one of them being dropped here.
 */
function withReading(entry) {
  const record = recordFor(checks, entry.url);
  if (!record) return entry;

  const fresh = recordIsFresh(record, now);
  if (!recordCountsOver(record, entry, now)) return { ...entry, byHand: record, byHandIsDue: !fresh };

  // The refusal's own details are dropped rather than kept: a status code is what
  // the machine was told, and what stands now is what the person read.
  const { detail: _silence, ...silent } = entry;
  return { ...silent, ...verdictOfRecord(record), byHand: record, byHandCounts: true };
}

const resolved = results.map(withReading);
const namedWork = resolved.filter(pageNamesAWork);
const namedInstitution = resolved.filter(pageNamesTheInstitution);
const wrong = resolved.filter(pageIsWrong);
const elsewhere = wrong.filter((entry) => entry.kind === "elsewhere");
const moved = wrong.filter((entry) => entry.kind === "moved");
const gone = wrong.filter((entry) => entry.kind === "gone");
const unreadable = wrong.filter((entry) => entry.kind === "unreadable");
const refused = resolved.filter((entry) => entry.kind === "refused");
// The confirmations a person stands behind, and nothing else: taken from the two
// lists of named pages rather than from every entry carrying a reading, so a page
// somebody read as moved or gone is reported as the finding it is and never as a
// confirmation. That is the same expression the closing line counts.
const byHandCounts = namedWork.concat(namedInstitution).filter((entry) => entry.byHandCounts);
// A reading that came due is only worth reporting where it was the only thing
// holding the page: a page the run answered for itself is confirmed today, and an
// old note beside it is not a page to go and read again.
const due = resolved.filter(
  (entry) => entry.byHandIsDue && (entry.kind === "refused" || entry.kind === "unreadable")
);
const disagreements = resolved.filter(
  (entry) => entry.byHand && !entry.byHandCounts && recordIsFresh(entry.byHand, now) && recordDisagreesWith(entry.byHand, entry)
);

// Each line is written in the number it has: "1 name the work" is the kind of
// thing that makes a reader stop trusting the other lines.
const tally = [
  [namedWork.length, "names the work it is cited for", "name the work they are cited for"],
  [namedInstitution.length, "names its institution alone", "name their institution alone"],
  [elsewhere.length, "answers under another title", "answer under another title"],
  [moved.length, "is answered from another address", "are answered from another address"],
  [gone.length, "is no longer there", "are no longer there"],
  [refused.length, "answered with a refusal", "answered with a refusal"],
  [unreadable.length, "could not be read", "could not be read"],
]
  .filter(([count]) => count > 0)
  .map(([count, one, many]) => `${count} ${count === 1 ? one : many}`);
console.log(`  ${tally.join(", ")}`);

/** A reading by hand, named by who made it and when: that is the whole claim it carries. */
const readBy = (record) => `read by ${record.by} on ${record.on}`;

if (elsewhere.length > 0) {
  // The failure this whole check exists for: the link opens, and it is not the
  // work. A site that answers a retired article with a landing page and a 200 is
  // how this happens, and nothing but reading the title would find it.
  console.error(
    `\nreferences: ${elsewhere.length} ${elsewhere.length === 1 ? "page answers" : "pages answer"} under a title that names neither the work nor its institution:`
  );
  for (const entry of elsewhere) {
    console.error(
      entry.byHand
        ? `  ${entry.url} was ${readBy(entry.byHand)} and the tab said "${entry.title}" (${entry.label})`
        : `  ${entry.url} answered "${entry.title}" (${entry.label})`
    );
  }
  console.error("  Open the link and look: either the work is on another page of that site, in which case");
  console.error("  the url in the level's source is to be corrected, or the citation now names a work that");
  console.error("  page never carried, in which case the reference itself is what to correct.");
}

if (moved.length > 0) {
  console.error(
    `\nreferences: ${moved.length} ${moved.length === 1 ? "page is" : "pages are"} answered from another address:`
  );
  for (const entry of moved) {
    console.error(
      entry.byHand
        ? `  ${entry.url} was ${readBy(entry.byHand)} as a page that had moved${entry.byHand.note ? `: ${entry.byHand.note}` : ""} (${entry.label})`
        : `  ${entry.url} answered from ${entry.detail} (${entry.label})`
    );
  }
  console.error("  A publisher that moved a page has left a redirect, so a reader still arrives: what is");
  console.error("  broken is the address the lesson names, which no longer exists on its own. Write the");
  console.error("  address it answers from into the level's source, or check that it is the same work.");
}

if (gone.length > 0) {
  console.error(
    `\nreferences: ${gone.length} ${gone.length === 1 ? "page is" : "pages are"} no longer there, and the reference still points at it:`
  );
  for (const entry of gone) {
    console.error(
      entry.byHand
        ? `  ${entry.url} was ${readBy(entry.byHand)} as a page that is gone${entry.byHand.note ? `: ${entry.byHand.note}` : ""} (${entry.label})`
        : `  ${entry.url} answered ${entry.detail} (${entry.label})`
    );
  }
  console.error("  A reference to a page that was deleted is a citation nobody can check. Either quote the");
  console.error("  work from a page that exists, or drop the link and let the reference be written out in");
  console.error("  full: a line of text is honest, and a link to nothing is not.");
}

if (refused.length > 0) {
  // The honest half of the report. A publisher is entitled to refuse a script,
  // and a refusal is not evidence that the address is right, so it is counted and
  // printed rather than passed off as a page that read as the work. What it is
  // not any more is the end of the story: a person can read the page, and the
  // pages nobody has are the ones that stay open.
  const never = refused.filter((entry) => !entry.byHand);
  console.log(
    `\nreferences: ${refused.length} ${refused.length === 1 ? "page" : "pages"} answered with a refusal, which says nothing about the reference:`
  );
  for (const entry of refused) {
    console.log(`  ${entry.url} (${entry.label})`);
  }
  console.log("  A site may refuse every request from a script, as Britannica does, or answer a script with a");
  console.log("  rate limit and a request to come back later, and then no title can be read from here at all.");
  if (never.length > 0) {
    console.log(`  ${never.length} of them ${never.length === 1 ? "has" : "have"} never been read by a person. Open the page the way a reader`);
    console.log("  would, and record what the tab says:");
    console.log(`    ${RECORD_COMMAND}`);
    console.log(`  A recorded reading is reported as confirmed by hand, with the name and the day, until it is`);
    console.log(`  ${CONFIRMATION_AGE_DAYS} days old, when it comes due and asks to be read again.`);
  }
}

if (due.length > 0) {
  console.log(
    `\nreferences: ${due.length} ${due.length === 1 ? "page" : "pages"} read by hand and the reading has come due:`
  );
  for (const entry of due) {
    console.log(
      `  ${entry.url} (${entry.label}) ${readBy(entry.byHand)}, ${ageInDays(entry.byHand, now)} days ago: older than the ${CONFIRMATION_AGE_DAYS} days a reading is held for.`
    );
  }
  console.log("  Open the page again and record it with today's date, which is the same command:");
  console.log(`    ${RECORD_COMMAND}`);
}

if (disagreements.length > 0) {
  console.error(
    `\nreferences: ${disagreements.length} ${disagreements.length === 1 ? "page was" : "pages were"} read by a person and ${disagreements.length === 1 ? "answers" : "answer"} differently today:`
  );
  for (const entry of disagreements) {
    console.error(
      `  ${entry.url} (${entry.label}) was read as "${entry.byHand.answer}" by ${entry.byHand.by} on ${entry.byHand.on}, and answered "${entry.title}" today.`
    );
  }
  console.error("  Today's answer is the one about today's page, so it is the one reported above: either the");
  console.error("  page changed since that reading, in which case record it again, or the reading was of");
  console.error("  another page, in which case it is the recorded line that is to be corrected.");
}

if (byHandCounts.length > 0) {
  // The good news, printed as evidence rather than as a count: what stands here is
  // a person's reading, and the report says who made it and when.
  console.log(
    `\nreferences: ${byHandCounts.length} ${byHandCounts.length === 1 ? "page is" : "pages are"} confirmed against a reading by hand, which no script can read:`
  );
  for (const entry of byHandCounts) {
    console.log(`  ${entry.url} (${entry.label}) ${readBy(entry.byHand)}: "${entry.title}"`);
  }
}

if (unreadable.length > 0) {
  console.error(
    `\nreferences: ${unreadable.length} ${unreadable.length === 1 ? "page" : "pages"} could not be read, which says nothing about them:`
  );
  for (const entry of unreadable) {
    console.error(`  ${entry.url} ${entry.detail} (${entry.label})`);
  }
  console.error("  This is a failure of the run rather than of the reference: run it again, and if a page");
  console.error("  stays unreadable, open it by hand before believing anything about the link.");
}

// A run that read no title at all is not a run that found everything in order:
// this is what a machine with no network produces, or a project whose references
// lost their pages, and both of those have to fail rather than pass quietly. A
// reading by hand counts here, since a page a person opened and wrote down has
// been looked at, which is more than this run managed.
if (namedWork.length + namedInstitution.length === 0) {
  console.error(
    "\nreferences: not one page answered with a title naming the work or its institution, by machine or by\n" +
      "hand, so nothing was confirmed. A run that read no title has not checked a link, whatever it printed above."
  );
  process.exit(1);
}

if (wrong.length > 0) process.exit(1);

const oldest = byHandCounts
  .map((entry) => entry.byHand.on)
  .sort()
  .at(0);
console.log(
  `  no page answered under another title and no address moved: ${namedWork.length} of ${resolved.length} ` +
    "answer under the title of the work their reference cites" +
    (byHandCounts.length > 0
      ? `, and ${byHandCounts.length} more ${byHandCounts.length === 1 ? "was" : "were"} read by a person, the oldest on ${oldest}`
      : "")
);
