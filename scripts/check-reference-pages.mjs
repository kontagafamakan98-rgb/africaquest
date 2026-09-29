/**
 * Follows the page every verified reference points at, reads the title it
 * answers with, and says when a link lands on something other than the work.
 *
 *   node scripts/check-reference-pages.mjs
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
 * pages are downloaded, which is why there are twenty-two of them and not sixty,
 * and why the run reads them four at a time.
 *
 * What is read is a page's own title, held against the two names the citation
 * carries: the work's, and its institution's. That is a heuristic and the report
 * says so. It is not a proof that the page is the work, since only a person can
 * read a page; it is the difference between a link that opens the work and a link
 * that opens another page, which is the difference nobody sees until a reader
 * follows it.
 *
 * Nothing here is part of the build. It writes nothing, it is not wired into the
 * verification, and a run with no network says so instead of pretending.
 */
import {
  REFERENCE_AGENT,
  pageIsWrong,
  pageNamesAWork,
  pageNamesTheInstitution,
  pageVerdict,
  referencePages,
} from "../src/lib/reference-pages.js";

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const pages = referencePages();
if (pages.length === 0) {
  console.error(
    "references: no verified reference points at a page, so this check held nothing to anything.\n" +
      "Every reference the game has opened a page for carries it as `url` in the level's source."
  );
  process.exit(1);
}

console.log(
  `references: ${pages.length} ${pages.length === 1 ? "page" : "pages"} cited by a verified link, read ${CONCURRENCY} at a time`
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

const namedWork = results.filter(pageNamesAWork);
const namedInstitution = results.filter(pageNamesTheInstitution);
const wrong = results.filter(pageIsWrong);
const elsewhere = wrong.filter((entry) => entry.kind === "elsewhere");
const moved = wrong.filter((entry) => entry.kind === "moved");
const gone = wrong.filter((entry) => entry.kind === "gone");
const unreadable = wrong.filter((entry) => entry.kind === "unreadable");
const refused = results.filter((entry) => entry.kind === "refused");

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

if (elsewhere.length > 0) {
  // The failure this whole check exists for: the link opens, and it is not the
  // work. A site that answers a retired article with a landing page and a 200 is
  // how this happens, and nothing but reading the title would find it.
  console.error(
    `\nreferences: ${elsewhere.length} ${elsewhere.length === 1 ? "page answers" : "pages answer"} under a title that names neither the work nor its institution:`
  );
  for (const entry of elsewhere) {
    console.error(`  ${entry.url} answered "${entry.title}" (${entry.label})`);
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
    console.error(`  ${entry.url} answered from ${entry.detail} (${entry.label})`);
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
    console.error(`  ${entry.url} answered ${entry.detail} (${entry.label})`);
  }
  console.error("  A reference to a page that was deleted is a citation nobody can check. Either quote the");
  console.error("  work from a page that exists, or drop the link and let the reference be written out in");
  console.error("  full: a line of text is honest, and a link to nothing is not.");
}

if (refused.length > 0) {
  // The honest half of the report. A publisher is entitled to refuse a script,
  // and a refusal is not evidence that the address is right, so it is counted and
  // printed rather than passed off as a page that read as the work.
  console.log(
    `\nreferences: ${refused.length} ${refused.length === 1 ? "page" : "pages"} answered with a refusal, which says nothing about the reference:`
  );
  for (const entry of refused) {
    console.log(`  ${entry.detail} ${entry.url} (${entry.label})`);
  }
  console.log("  A site may refuse every request from a script, as Britannica does, or answer a script with a");
  console.log("  rate limit and a request to come back later, and then no title can be read from here at all:");
  console.log("  those references stay unconfirmed rather than checked, and the only way to hold one is for a");
  console.log("  person to open it in a browser.");
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
// lost their pages, and both of those have to fail rather than pass quietly.
if (namedWork.length + namedInstitution.length === 0) {
  console.error(
    "\nreferences: not one page answered with a title naming the work or its institution, so nothing was\n" +
      "confirmed. A run that read no title has not checked a link, whatever it printed above."
  );
  process.exit(1);
}

if (wrong.length > 0) process.exit(1);

console.log(
  `  no page answered under another title and no address moved: ${namedWork.length} of ${pages.length} ` +
    "answer under the title of the work their reference cites"
);
