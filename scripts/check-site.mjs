/**
 * Whether the published application is still there, and still itself.
 *
 *   node scripts/check-site.mjs                    # the published address
 *   node scripts/check-site.mjs https://host/path  # another one, while deploying
 *
 * The address is the one the build writes into robots.txt and the sitemap, taken
 * from the same place (`build/site-files.js`), so there is one address in this
 * repository rather than three that can disagree.
 *
 * It reads the site in two passes and decides what each answer means (see
 * src/lib/site-health.js). Reading the files rather than asking for their
 * headers is the point: a static host answers an unknown path with the
 * application's own page, so a file that is not there comes back with a success
 * status and the wrong content, and only what arrived tells the two apart.
 *
 * The second pass is the one that would have caught the gallery of photographs
 * being empty on the published site. A built asset is named with a content hash
 * (`level-09-DY2Tac4I.js`), so no checker can write its address down; the
 * service worker can, because it installs it. The worker is read, the addresses
 * of the three scripts that matter are taken out of it (the entry, the first
 * level, the last), and they are fetched: assets published under a path they are
 * not served from fail all three at once, which is what happened.
 *
 * A deployment in flight is not read as an outage. Pages answers a 404 for every
 * address until the new deployment is published, and a run that happened to read
 * the site in that minute would wake the publisher for a site that is about to
 * be there. So a read in which not one address came back at all is made again,
 * a few times, before it is believed; anything that did arrive is decided at
 * once.
 *
 * It is deliberately not part of `npm run verify`: the verification says whether
 * the project can be built, and this says whether the site that was built can be
 * reached, which needs a network and a deployment that has finished. The Uptime
 * workflow runs it once a day, and a failing run is what tells the publisher the
 * site is down - there is no third party here to tell them instead.
 *
 * Exit code 0 when every address answers with what it should be, 1 when any of
 * them does not, and 2 when there was nothing to check at all.
 */
import { writeFileSync } from "node:fs";
import { addressOf, chosenScripts, CONCURRENCY, hostAddressOf, inFlight, precachedFrom, SETTLE_ATTEMPTS, SETTLE_WAIT_MS, SITE_FILES, SPACING_MS, TIMEOUT_MS, verdictIsAlarming, verdictLine, verdictOf } from "../src/lib/site-health.js";
import { siteOrigin } from "../build/site-files.js";

const AGENT = "AfricaHistoryQuest/1.0 (site check; kojoapp98@gmail.com)";
const ARGUMENTS = process.argv.slice(2);

/** The options that are followed by a value, so the value is not read as an address. */
const VALUED_OPTIONS = new Set(["--report"]);

/**
 * The first argument that is not an option and not the value of one.
 *
 * Without this the address being checked would be taken from `--report` and the
 * run would read a file name as a site, which is a check that reports on nothing
 * and says it in no uncertain terms.
 */
function positional() {
  for (let at = 0; at < ARGUMENTS.length; at += 1) {
    if (VALUED_OPTIONS.has(ARGUMENTS[at])) {
      at += 1;
      continue;
    }
    if (!ARGUMENTS[at].startsWith("--")) return ARGUMENTS[at];
  }
  return "";
}

/** The value of `--name value`, or an empty string when it was not given. */
function option(name) {
  const at = ARGUMENTS.indexOf(`--${name}`);
  const value = at === -1 ? "" : ARGUMENTS[at + 1] || "";
  return value.startsWith("--") ? "" : value;
}

/** Where the verdict is left for the step that keeps the day-by-day log. */
const REPORT = option("report");

const given = positional();
const origin = given ? given.replace(/\/+$/, "") : siteOrigin();

if (!/^https?:\/\//i.test(origin)) {
  console.error(`site: "${origin}" is not an address to check`);
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One address, read. A refusal is an answer like any other: what it means is
 * decided by verdictOf, not here.
 */
async function ask(entry) {
  // A path of the site is joined to the path the site is served at; a path the
  // worker gave is already written from the root of the host, and is asked for
  // as it is.
  const address = entry.absolute ? hostAddressOf(origin, entry.path) : addressOf(origin, entry.path);
  try {
    const response = await fetch(address, {
      redirect: "follow",
      headers: { "user-agent": AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // A picture is compared byte by byte and a document is read as text: the
    // signature of a PNG starts with a byte that is not valid UTF-8, so asking
    // for it as text would replace the very thing being looked for. And the
    // bytes are read with the one decoder that maps each of them to its own
    // character, because Node labels TextDecoder("latin1") as windows-1252: the
    // first byte of a PNG comes back as U+2030 there rather than U+0089, so the
    // signature never matched a real file. Buffer's latin1 is the byte one.
    const body =
      entry.kind === "picture"
        ? Buffer.from(await response.arrayBuffer()).toString("latin1").slice(0, 200_000)
        : (await response.text()).slice(0, 200_000);
    // `kind` is carried beside the entry, not left inside it: the verdict reads
    // the answer and not the request, and an answer with no kind is a file
    // recognised by nothing, which is how a healthy site comes back as four
    // wrong files. It read `entry` alone and did exactly that until the site was
    // first published and answered with the right content.
    return { entry, address, kind: entry.kind, status: response.status, contentType: response.headers.get("content-type") || "", body };
  } catch (error) {
    return { entry, address, kind: entry.kind, status: 0, contentType: "", body: "", error };
  }
}

console.log(`site: ${origin}`);
console.log(`  ${SITE_FILES.length} addresses, ${CONCURRENCY} at a time, ${TIMEOUT_MS / 1000}s each\n`);

/** Ask for a list of addresses, a few at a time, and keep every answer. */
async function askAll(entries) {
  const answers = [];
  for (let start = 0; start < entries.length; start += CONCURRENCY) {
    const slice = entries.slice(start, start + CONCURRENCY);
    for (const answer of await Promise.all(slice.map(ask))) answers.push(answer);
    if (start + CONCURRENCY < entries.length) await sleep(SPACING_MS);
  }
  return answers;
}

/**
 * One whole read of the site: the files it is made of, and then the scripts the
 * worker names, which can only be asked for once the worker itself answered.
 *
 * It is a function rather than a run of statements because it is run more than
 * once: a read in which nothing answered is a read to make again (see below).
 */
async function readSite() {
  const results = await askAll(SITE_FILES);

  // What the worker installs, asked for by the names only the worker knows. A
  // worker that did not answer is already a fault of its own above; there is
  // nothing to learn from the list inside a file that is not there.
  const worker = results.find((answer) => answer.entry.kind === "worker");
  if (worker && verdictOf(worker) === "healthy") {
    const scripts = chosenScripts(precachedFrom(worker.body));
    console.log(`\n  ${scripts.length} script(s) named by the worker, asked for in turn\n`);
    results.push(...(await askAll(scripts)));
  }
  return results;
}

// A deployment that has not finished and a site that is gone answer alike for a
// minute or two: until the new deployment is published, Pages serves a 404 (or
// nothing) for every address, which is the same thing a repository whose Pages
// setting was turned off says. Reading the site once would wake the publisher
// for a site that is about to be there, which is the alarm people learn to
// ignore. So a read in which not one address came back at all is made again,
// a few times, before it is believed. A read in which something arrived, and a
// read in which the site answered with the wrong content, are decided at once:
// the site is published, and what arrived is the failure this check exists for.
let results = await readSite();
for (let attempt = 2; attempt <= SETTLE_ATTEMPTS && inFlight(results); attempt += 1) {
  console.log(`\n  none of the ${results.length} addresses answered: a deployment may still be publishing.`);
  console.log(`  asking again in ${Math.round(SETTLE_WAIT_MS / 1000)}s (${attempt} of ${SETTLE_ATTEMPTS}).`);
  await sleep(SETTLE_WAIT_MS);
  results = await readSite();
}

const alarming = [];
for (const answer of results) {
  const verdict = verdictOf(answer);
  console.log(`  ${verdictLine(answer.entry, verdict)}`);
  if (verdictIsAlarming(verdict)) alarming.push({ ...answer, verdict });
}

if (results.length === 0) {
  console.error("site: nothing was checked, which says nothing about the site");
  process.exit(2);
}

/**
 * The verdict, written where the step after this one reads it.
 *
 * A run says nothing about the days before it, so the same answer is kept in an
 * issue as well. It is written here rather than asked for again there, for the
 * same reason the drift check leaves a report: two steps asking the same
 * question twice can end up disagreeing about what was found.
 */
function emitReport(outcome) {
  if (!REPORT) return;
  const answered = results.filter((answer) => verdictOf(answer) === "healthy").length;
  const report = {
    site: origin,
    outcome,
    checkedAt: new Date().toISOString(),
    asked: results.length,
    answered,
  };
  try {
    writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
  } catch (error) {
    console.error(`site: the verdict could not be left at ${REPORT} (${error.message})`);
  }
}

if (alarming.length === 0) {
  emitReport("up");
  console.log(`\nsite: all ${results.length} addresses answered, and every one of them is what it should be`);
  process.exit(0);
}

console.error(`\nsite: ${alarming.length} of ${results.length} addresses are not what they should be:`);
for (const answer of alarming) {
  console.error(`  ${answer.address} ${answer.error ? `(${answer.error.message})` : `(status ${answer.status}${answer.contentType ? `, ${answer.contentType}` : ""})`}`);
}
console.error(
  "  A refusal or an unreachable host can be a deployment still in flight, or Pages turned off in the repository settings;\n" +
    "  an address that answered with something else means what arrived was not that file - on a single page site, that is\n" +
    "  usually the host answering a path it does not have with the application itself."
);
emitReport("down");
process.exit(1);
