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
 * It reads four files and decides what each answer means (see
 * src/lib/site-health.js). Reading them rather than asking for their headers is
 * the point: a static host answers an unknown path with the application's own
 * page, so a file that is not there comes back with a success status and the
 * wrong content, and only what arrived tells the two apart.
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
import { addressOf, CONCURRENCY, SITE_FILES, SPACING_MS, TIMEOUT_MS, verdictIsAlarming, verdictLine, verdictOf } from "../src/lib/site-health.js";
import { siteOrigin } from "../build/site-files.js";

const AGENT = "AfricaHistoryQuest/1.0 (site check; kojoapp98@gmail.com)";
const given = process.argv.slice(2).find((argument) => !argument.startsWith("--"));
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
  const address = addressOf(origin, entry.path);
  try {
    const response = await fetch(address, {
      redirect: "follow",
      headers: { "user-agent": AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // A picture is compared byte by byte and a document is read as text: the
    // signature of a PNG starts with a byte that is not valid UTF-8, so asking
    // for it as text would replace the very thing being looked for.
    const body =
      entry.kind === "picture"
        ? new TextDecoder("latin1").decode((await response.arrayBuffer()).slice(0, 200_000))
        : (await response.text()).slice(0, 200_000);
    return { entry, status: response.status, contentType: response.headers.get("content-type") || "", body };
  } catch (error) {
    return { entry, status: 0, contentType: "", body: "", error };
  }
}

console.log(`site: ${origin}`);
console.log(`  ${SITE_FILES.length} addresses, ${CONCURRENCY} at a time, ${TIMEOUT_MS / 1000}s each\n`);

const results = [];
for (let start = 0; start < SITE_FILES.length; start += CONCURRENCY) {
  const slice = SITE_FILES.slice(start, start + CONCURRENCY);
  const answers = await Promise.all(slice.map(ask));
  for (const answer of answers) results.push(answer);
  if (start + CONCURRENCY < SITE_FILES.length) await sleep(SPACING_MS);
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

if (alarming.length === 0) {
  console.log(`\nsite: all ${results.length} addresses answered, and every one of them is what it should be`);
  process.exit(0);
}

console.error(`\nsite: ${alarming.length} of ${results.length} addresses are not what they should be:`);
for (const answer of alarming) {
  console.error(`  ${addressOf(origin, answer.entry.path)} ${answer.error ? `(${answer.error.message})` : `(status ${answer.status}${answer.contentType ? `, ${answer.contentType}` : ""})`}`);
}
console.error(
  "  A refusal or an unreachable host can be a deployment still in flight, or Pages turned off in the repository settings;\n" +
    "  an address that answered with something else means what arrived was not that file - on a single page site, that is\n" +
    "  usually the host answering a path it does not have with the application itself."
);
process.exit(1);
