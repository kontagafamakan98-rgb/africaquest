/**
 * Follows the search links the app offers, and holds their shape to the registry
 * the shape was taken from.
 *
 *   node scripts/check-search-links.mjs            # the shapes, then every link
 *   node scripts/check-search-links.mjs --shapes   # the shapes alone, one request
 *
 * This is the one check in the project that needs the network, so it is on
 * demand rather than part of `npm run verify`: a gate that fails on a train is a
 * gate somebody turns off. Run it when a publisher is suspected of having moved
 * something, which is the day nobody wants to find that out by hand.
 *
 * It does two things, because a search link here has two halves.
 *
 * The shapes first. Every publisher that offers a search declares, in
 * publishers.js, the address that search is reached at and the registry item
 * that records it. The shape is read back from the registry and the two are
 * compared, so a publisher that renames its search parameter fails here rather
 * than in front of a reader. This is the only way to catch it: the address of a
 * search cannot be confirmed by opening it, since opening it is what gets
 * refused.
 *
 * The links second. Each distinct search the app offers is requested for real,
 * redirects followed, and what came back decides. Reaching nothing, and being
 * sent to another search altogether, are the two failures: an address that
 * differs only in how a term is escaped is the same search, and is not reported
 * as though a publisher had moved something. This publisher refuses a request
 * from a script whatever its address says, so those refusals are counted and
 * printed rather than passed off as a confirmation: the report says plainly that
 * the responses told nothing, and points at the shapes for what did.
 *
 * Nothing here is part of the build. It writes nothing, it is not wired into the
 * verification, and a run with no network says so instead of pretending.
 */
import {
  declaredShapes,
  outcome,
  outcomeIsWrong,
  registryUrl,
  searchLinks,
  shapeFromRegistry,
  shapeIsWrong,
  shapeVerdict,
} from "../src/lib/search-links.js";

/** How many links are asked about at once, so the publisher is not hammered. */
const CONCURRENCY = 4;
/** And how long the run waits between two groups of them. */
const SPACING_MS = 250;
/** Long enough for a slow site, short enough that a hang is not a night. */
const TIMEOUT_MS = 15_000;
/** What the requests say they are: an anonymous script is what gets refused. */
const AGENT = "AfricaHistoryQuest/1.0 (on demand search link check)";
/** The flag that skips the links and checks the shapes alone. */
const shapesOnly = process.argv.includes("--shapes");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One address, asked about for real. Never throws: a refusal, an empty answer
 * and a connection that never opened are all things this check has to report.
 *
 * The body is read rather than dropped, so the connection is released, and so a
 * page that stops halfway counts as a failure instead of as a quiet success.
 */
async function ask(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: response.status, url: response.url, body: await response.arrayBuffer() };
  } catch (error) {
    return { error: error.cause?.message || error.message || String(error) };
  }
}

/** The shapes the app declares, each held to the registry item it names. */
async function readShapes() {
  const results = [];

  for (const shape of declaredShapes()) {
    if (!shape.item) {
      results.push({ ...shape, kind: "unrecorded" });
      continue;
    }

    const answer = await ask(registryUrl(shape.item));
    if (answer.error) {
      results.push({ ...shape, kind: "unreachable", detail: answer.error });
      continue;
    }

    let payload = null;
    try {
      payload = JSON.parse(new TextDecoder().decode(answer.body));
    } catch {
      payload = null;
    }
    results.push({ ...shape, ...shapeVerdict(shape.template, shapeFromRegistry(payload)) });
  }

  return results;
}

/** Every distinct search the app offers, followed four at a time. */
async function followLinks(links) {
  const results = [];

  for (let index = 0; index < links.length; index += CONCURRENCY) {
    const group = links.slice(index, index + CONCURRENCY);
    const answers = await Promise.all(group.map((entry) => ask(entry.url)));
    answers.forEach((answer, position) => {
      results.push({ ...outcome(group[position].url, answer), label: group[position].label });
    });
    if (index + CONCURRENCY < links.length) await sleep(SPACING_MS);
  }

  return results;
}

const shapes = await readShapes();
const brokenShapes = shapes.filter(shapeIsWrong);

console.log(
  shapes.length === 0
    ? "shapes: no publisher declares a search of its own"
    : `shapes: ${shapes.length} ${shapes.length === 1 ? "publisher offers" : "publishers offer"} a search of its own`
);
for (const shape of shapes) {
  if (shape.kind === "holds") {
    console.log(`  ${shape.id} ${shape.template} is what ${shape.item} records`);
  } else if (shape.kind === "changed") {
    console.log(`  ${shape.id} ${shape.template} is no longer what ${shape.item} records: ${shape.recorded}`);
  } else if (shape.kind === "unrecorded") {
    console.log(`  ${shape.id} ${shape.template} names no registry item to hold it to`);
  } else {
    console.log(`  ${shape.id} ${shape.template} could not be read back: ${shape.detail}`);
  }
}

let wrongLinks = [];
let followed = 0;

if (shapesOnly) {
  console.log("links: not followed, which is what --shapes asks for");
} else {
  const links = searchLinks();
  followed = links.length;
  console.log(
    `links: ${links.length} ${links.length === 1 ? "search" : "searches"} the app offers, followed ${CONCURRENCY} at a time`
  );

  const results = await followLinks(links);
  const counted = (kind) => results.filter((entry) => entry.kind === kind).length;
  const tally = [
    [counted("answered"), "answered with a page"],
    [counted("refused"), "answered with a refusal"],
    [counted("moved"), "answered from somewhere else"],
    [counted("unreachable"), "reached nothing"],
  ]
    .filter(([count]) => count > 0)
    .map(([count, what]) => `${count} ${what}`);

  wrongLinks = results.filter(outcomeIsWrong);
  console.log(`  ${tally.join(", ")}`);

  if (counted("refused") > 0) {
    // The honest half of this check. A refusal is the publisher declining to
    // answer a script whatever the address says, so it is not evidence that the
    // address is right, and it must not be printed as though it were.
    console.log("  a refusal is what this publisher answers a script with, whatever the address says,");
    console.log("  so those responses confirmed nothing: the shapes above are what this check knows");
  }
}

// A check that looked at nothing is not a check that passed: an empty list here
// means the templates went out of publishers.js, or every reference is linked to
// a page, and either way saying nothing would read as everything being fine.
if (shapes.length === 0 && followed === 0) {
  console.error(
    "\nlinks: there was nothing to hold to anything. Either publishers.js declares no search of\n" +
      "its own any more, or the references no longer reach one: nothing was checked."
  );
  process.exit(1);
}

if (brokenShapes.length > 0) {
  console.error(
    `\nlinks: ${brokenShapes.length} ${brokenShapes.length === 1 ? "shape is" : "shapes are"} not what the registry records:`
  );
  for (const shape of brokenShapes) {
    if (shape.kind === "changed") {
      console.error(`  ${shape.id} ${shape.template} against ${shape.recorded} recorded in ${shape.item}`);
    } else if (shape.kind === "unrecorded") {
      console.error(`  ${shape.id} ${shape.template} names no registry item, so nothing can confirm it`);
    } else {
      console.error(`  ${shape.id} ${shape.template} could not be read back: ${shape.detail}`);
    }
  }
  console.error("  The shape is declared in src/components/game/publishers.js: update it from the registry");
  console.error("  rather than from a guess, and name the item it came from beside it.");
}

if (wrongLinks.length > 0) {
  console.error(
    `\nlinks: ${wrongLinks.length} ${wrongLinks.length === 1 ? "search is" : "searches are"} no longer where the app points:`
  );
  for (const entry of wrongLinks) {
    console.error(
      entry.kind === "moved"
        ? `  ${entry.link} is answered from another search: ${entry.detail} (${entry.label})`
        : `  ${entry.link} reached nothing: ${entry.detail} (${entry.label})`
    );
  }
  console.error("  A publisher that moved its search is a template to change in publishers.js rather");
  console.error("  than a link to drop: the reference under the question is still what the game quotes.");
}

if (brokenShapes.length > 0 || wrongLinks.length > 0) process.exit(1);

console.log("  every search reaches its publisher, and every shape is still the one it was taken from");
