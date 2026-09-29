/**
 * Follows the page the credits name for each photograph, and says when one of
 * them is no longer there.
 *
 *   node scripts/check-photo-sources.mjs
 *
 * This is the second check in the project that needs the network, and it is on
 * demand for the same reason as the first: a gate that fails on a train is a gate
 * somebody turns off. Run it when a licence is about to be argued about, or when
 * somebody is about to rely on the credits for a lesson, which is when a page
 * that has been deleted costs something.
 *
/**
 * The pages are asked about, not read. A HEAD request answers whether the page is
 * there and where it is, without downloading sixty wiki pages to learn it, which
 * is also the polite way to ask a project that runs on donations.
 *
 * A page that does not answer the first time is asked again, because a dropped
 * connection is nothing to do with the credit: the download script backs off for
 * the same reason. It is only what is left after that which is reported, and the
 * report keeps "I could not read it" apart from "it is not there".
 *
 * What a photograph looks like and where it is served from does not depend on any
 * of this: the pictures are in public/photos, and the game plays on with every one
 * of these pages gone. What depends on it is the promise the credits make, which
 * is checked the way a reader would check it, by following the link they can
 * follow.
 */
import {
  SOURCE_AGENT,
  pageIsWrong,
  pageOutcome,
  photoSources,
} from "../src/lib/photo-sources.js";

/** How many pages are asked about at once, so the wiki is not hammered. */
const CONCURRENCY = 4;
/** And how long the run waits between two groups of them. */
const SPACING_MS = 250;
/** Long enough for a slow wiki, short enough that a hang is not a night. */
const TIMEOUT_MS = 8_000;
/**
 * How many times one page is asked about before the run gives up on it.
 *
 * Five, because a dropped connection is common enough to measure: on the machine
 * this was written on, roughly one request in ten to the wiki never comes back,
 * and a page is only reported once every one of these has failed. Four would
 * leave a run in a hundred ending unreadable for no reason at all.
 */
const ATTEMPTS = 5;
/**
 * How long to wait before asking again, by why the last ask failed.
 *
 * A dropped connection is dropped in a quarter of a second, so waiting two
 * seconds to try again would be waiting for nothing. A page the wiki asks you to
 * come back for is the other case: it is a request that arrived too fast, and
 * coming back too fast is what earned it.
 */
const DROPPED_BACKOFF_MS = 400;
const LATER_BACKOFF_MS = 2_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One page, asked about once. Never throws: a refusal, a name that does not
 * resolve and a server that never answered are all things this has to report.
 */
async function askOnce(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": SOURCE_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // The body is dropped rather than read: a HEAD answer has none, and reading
    // it would be the sixty downloads this check exists to avoid.
    return { status: response.status, url: response.url };
  } catch (error) {
    return { error: error.cause?.message || error.message || String(error) };
  }
}

/**
 * Why an answer is worth asking about again, or nothing when it is an answer.
 *
 * Two things are: nothing was answered at all, which on this side of the network
 * is usually the connection rather than the wiki, and a page the wiki says to
 * come back for later. Everything else is an answer, and asking for it again
 * would only turn a 404 into five 404s.
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

const sources = photoSources();
if (sources.length === 0) {
  console.error(
    "sources: the credits name no page at all, so this check held nothing to anything.\n" +
      "Every photograph in src/lib/level-images.js needs the page it was taken from."
  );
  process.exit(1);
}

console.log(
  `sources: ${sources.length} credit ${sources.length === 1 ? "page" : "pages"} to follow, ${CONCURRENCY} at a time`
);

const results = [];
for (let index = 0; index < sources.length; index += CONCURRENCY) {
  const group = sources.slice(index, index + CONCURRENCY);
  const answers = await Promise.all(group.map((entry) => ask(entry.url)));
  answers.forEach((answer, position) => {
    results.push({ ...pageOutcome(group[position].url, answer), ...group[position] });
  });
  if (index + CONCURRENCY < sources.length) await sleep(SPACING_MS);
}

const counted = (kind) => results.filter((entry) => entry.kind === kind).length;
// Each line is written in the number it has: "1 are no longer there" is the kind
// of thing that makes a reader stop trusting the other lines.
const tally = [
  [counted("answered"), "answered", "answered"],
  [counted("moved"), "is answered from another address", "are answered from another address"],
  [counted("gone"), "is no longer there", "are no longer there"],
  [counted("unreadable"), "could not be read", "could not be read"],
]
  .filter(([count]) => count > 0)
  .map(([count, one, many]) => `${count} ${count === 1 ? one : many}`);
console.log(`  ${tally.join(", ")}`);

const wrong = results.filter(pageIsWrong);
const gone = wrong.filter((entry) => entry.kind === "gone");
const moved = wrong.filter((entry) => entry.kind === "moved");
const unreadable = wrong.filter((entry) => entry.kind === "unreadable");

if (gone.length > 0) {
  // The failure this whole check exists for: the picture is still in the game,
  // and the page that says where it comes from and under which licence is not.
  console.error(
    `\nsources: ${gone.length} credit ${gone.length === 1 ? "page is" : "pages are"} no longer there, ` +
      `and ${gone.length === 1 ? "the picture it credits is" : "the pictures they credit are"} still in the game:`
  );
  for (const entry of gone) {
    console.error(`  ${entry.file} ${entry.label} answered ${entry.detail}: ${entry.url}`);
  }
  console.error("  Look the title up on the wiki again and correct commonsTitle in src/lib/level-images.js,");
  console.error("  or replace the photograph: a credit line that leads nowhere is a licence nobody can check.");
}

if (moved.length > 0) {
  // Not broken for a reader, who is sent on and lands somewhere: broken for
  // whoever maintains the table, and broken for the download script, which asks
  // the wiki by the title this page no longer holds.
  console.error(
    `\nsources: ${moved.length} ${moved.length === 1 ? "credit page is" : "credit pages are"} answered from another address:`
  );
  for (const entry of moved) {
    console.error(`  ${entry.file} ${entry.label} answered from ${entry.detail}: ${entry.url}`);
  }
  console.error("  A file renamed on the wiki answers from its new name. Write the new title into");
  console.error("  src/lib/level-images.js, so the table names the page that exists.");
}

if (unreadable.length > 0) {
  console.error(
    `\nsources: ${unreadable.length} ${unreadable.length === 1 ? "page" : "pages"} could not be read, ` +
      "which says nothing about them:"
  );
  for (const entry of unreadable) {
    console.error(`  ${entry.file} ${entry.label} ${entry.detail}: ${entry.url}`);
  }
  console.error("  This is a failure of the run rather than of the credit: run it again, and if the same");
  console.error("  pages stay unreadable, look at the answer before believing anything about the pictures.");
}

if (wrong.length > 0) process.exit(1);

console.log(`  every one of them answers, and every one is still the page the table names`);
