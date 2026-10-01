/**
 * Whether the backend is gone, or only asleep.
 *
 *   node scripts/check-backend.mjs                          # the configured address
 *   node scripts/check-backend.mjs https://host/            # another one, while deploying
 *
 * The backend is a Neon function with the branch's database behind it. It is not
 * part of the game - the site is a folder of files, it reads the content at build
 * time and talks to nobody - so it is exactly the kind of service that is left
 * alone for most of the day, and exactly the kind whose failure nobody notices.
 *
 * The one thing that makes it hard to watch is that "not answering" and "asleep"
 * look alike from outside. A Neon compute scales to zero after a few idle
 * minutes, and a suspended database still answers the next request, after
 * waking: a slow 200 rather than a 500. A check that alarmed on the slowness
 * would cry wolf every morning and be turned off within a week, and a check that
 * only asked whether the host answered would call a dead database healthy,
 * because the function in front of it stays up. So the function answers for
 * both: `/health` reads the database as well as itself and reports which of the
 * two it found (see hello.ts). This only reads that answer and says which state
 * it is - up, woken from sleep, or really down.
 *
 * The address is the function's invocation URL, public by nature and therefore
 * carried as a repository variable rather than a secret. A repository that has
 * not set it gets a line saying the check was skipped instead of a red run: a
 * workflow that fails on somebody else's missing configuration is a workflow
 * people stop reading, and the site check beside this one still runs.
 *
 * Exit code 0 when the backend answered - asleep or awake, both are up - 1 when
 * the function or the database behind it is really gone, and 0 with a notice
 * when there was no address to check.
 */
const AGENT = "AfricaHistoryQuest/1.0 (backend check; kojoapp98@gmail.com)";
/** Long enough for a cold start on a slow morning, short enough that a hang is not a day. */
const TIMEOUT_MS = 20_000;
/** How many times the function is asked before a silence is reported as a failure. */
const ATTEMPTS = 3;
/** And how long to wait between two of those asks: a compute waking needs a moment. */
const WAKE_BACKOFF_MS = 1_500;
/**
 * Above this, the database had gone to sleep and woke to answer this call.
 *
 * A warm read is a dozen milliseconds and a wake is a few hundred - a sleeping
 * compute measured here took 576 ms where the warm one took 13 - so a quarter of
 * a second separates the two with room to spare.
 */
const WAKE_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const given = process.argv.slice(2).find((argument) => !argument.startsWith("--"));
const base = (given || process.env.NEON_FUNCTION_API_BASE_URL || "").replace(/\/+$/, "");

if (!/^https:\/\//i.test(base)) {
  console.log(
    "backend: skipped - no backend address to check.\n" +
      "  Set the repository variable NEON_FUNCTION_API_BASE_URL to the function's invocation URL\n" +
      "  (the one `neon functions list` prints), and this step reads the function and the database behind it."
  );
  process.exit(0);
}

const health = `${base}/health`;

/** One ask, never thrown: a refusal and a host that did not answer are both answers here. */
async function ask(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: response.status, body: (await response.text()).slice(0, 20_000) };
  } catch (error) {
    return { status: 0, error: error.cause?.message || error.message || String(error) };
  }
}

console.log(`backend: ${base}`);
console.log(`  the function and the database behind it, asked at ${health}\n`);

let answer = null;
for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  answer = await ask(health);
  if (answer.status !== 0) break;
  if (attempt < ATTEMPTS) await sleep(attempt * WAKE_BACKOFF_MS);
}

// The one case that is not a fault: the host answered, and what it answered with
// says whether the database is up. A body that does not parse is a function that
// answered without a health route rather than a backend that is gone.
let state = null;
try {
  state = JSON.parse(answer.body);
} catch {
  state = null;
}

if (answer.status >= 200 && answer.status < 300 && state && typeof state.status === "string") {
  const took = Number(state.tookMs) || 0;
  if (state.status === "ok") {
    console.log(`  the function answered, and its read of the database answered${took ? ` in ${took}ms` : ""}`);
    if (state.wokeFromSleep || took >= WAKE_MS) {
      console.log(
        "  the database had gone to sleep before this call, and woke to answer it: that is the compute\n" +
          "  scaling to zero, which is how it is meant to behave, and not an outage."
      );
    }
    console.log("\nbackend: up");
    process.exit(0);
  }

  console.error(`  the function answered, and its read of the database failed${state.detail ? `: ${state.detail}` : ""}`);
  console.error("\nbackend: the database is down, while the function in front of it still answers.");
  console.error("  Open the branch in the Neon console, and read the endpoint's own state before the code:");
  process.exit(1);
}

// The host answered, and not with a health document: the function is up and
// carries no `/health` route yet, whether it answers a greeting for every path
// or a 404 for this one. That is a deployment to make, not an outage.
if (answer.status >= 200 && answer.status < 300) {
  console.log(`  the host answered ${answer.status}, and the body is not a health document: the function is up.`);
  console.log("\nbackend: up, with nothing deeper to read. Deploy the function to add the route:");
  console.log("  neon functions deploy api --wait");
  process.exit(0);
}

if (answer.status === 404) {
  console.log("  the host answered 404: the function is up, and carries no /health route yet.");
  console.log("\nbackend: up, with nothing deeper to read. Deploy the function to add the route:");
  console.log("  neon functions deploy api --wait");
  process.exit(0);
}

if (answer.status > 0) {
  console.error(`  the host answered ${answer.status}${answer.body ? `: ${answer.body.trim().slice(0, 200)}` : ""}`);
} else {
  console.error(`  the host did not answer in ${ATTEMPTS} attempts${answer.error ? ` (${answer.error})` : ""}`);
}
console.error("\nbackend: down - not asleep, since a suspended compute answers after waking, and this did not:");
console.error(`  ${base}`);
console.error("  Read the function's own deployments and the branch's endpoints in the Neon console, then re-run this.");
process.exit(1);
