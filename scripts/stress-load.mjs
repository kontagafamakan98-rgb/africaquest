/**
 * What the application does when one device holds the largest record it accepts.
 *
 *   node scripts/stress-load.mjs
 *
 * A hundred thousand readers is not a load this application can feel. It is a
 * folder of files on a static host, and nothing in it runs per reader: the
 * server that would be measured is somebody else's, and the only thing the
 * application owns is what one device stores. So what is measured here is the
 * one thing that really grows - a player's own progress - and every path that
 * has to walk it.
 *
 * Two shapes are weighed, and the distance between them is the point:
 *
 * - a player who finished the game, which is what a real device holds. Every
 *   question of every level answered once - some forty a level, twenty-six levels -
 *   a dozen badges, one history entry per level per difficulty;
 * - the heaviest record the reader accepts, which is what an imported file may
 *   be: four thousand answers, five thousand finished levels, every list full.
 *   Nothing the game itself writes comes close; a hand-made file can, and it has
 *   to be survived rather than argued with.
 *
 * Both are built by the reader the application really uses, so what is timed is
 * the code the game runs rather than a model of it. Each path is timed on the
 * median of a few passes after a warm one, because the first pass pays for the
 * compiler rather than for the work.
 *
 * The budgets are not here: they live in src/lib/load-stress.js, so this script
 * cannot raise one on its way past, and the tests read the same table. A path
 * over its budget ends the run with a non-zero status; the numbers are printed
 * either way, since what a report says is what the reader came for.
 *
 * What is deliberately not measured: the browser's own write to the disk. Only
 * the application's work is timed - reading the record, rebuilding it, and
 * turning it back into text - because that is the part this project owns, and a
 * device's storage is the part it does not.
 *
 * It is not part of `npm run verify`: a timing on a shared runner is a coin
 * toss, and a check that fails at random is a check people learn to ignore.
 */
import { performance } from "node:perf_hooks";
import { MAX_BACKUP_BYTES, buildBackup, cleanProgress, readBackup } from "../src/lib/progress-file.js";
import {
  QUOTA_BYTES,
  STRESS_BUDGETS,
  backupDocument,
  finishedProgress,
  heaviestProgress,
  recordsPerQuota,
  sizeOf,
} from "../src/lib/load-stress.js";
import { getLevels } from "../src/components/game/gameData.js";
import { collectReviewQueue } from "../src/components/game/learning.js";
import { classSummary } from "../src/lib/class-stats.js";
import { DEFAULT_PROFILE_ID, progressKeyFor } from "../src/api/profiles-store.js";
import { progressStore } from "../src/api/progress-store.js";

/**
 * The one browser API the store and the roster use, given here.
 *
 * The bytes of each write are counted as they go past, because the number that
 * explains everything else on this page is that every answer rewrites the whole
 * record: what a tap costs is a function of how much the device already holds.
 */
const store = new Map();
let lastWriteBytes = 0;
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => {
    lastWriteBytes = String(value).length;
    store.set(key, String(value));
  },
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

const PROGRESS_KEY = progressKeyFor(DEFAULT_PROFILE_ID);
const RUNS = 5;
/** How many students a classroom tablet may hold in one roster. */
const CLASS_SIZE = 40;

const levels = getLevels("en");
const questions = levels.reduce((total, level) => total + level.questions.length, 0);
const now = Date.now();
const finished = finishedProgress(levels, now);
const ceiling = heaviestProgress(now);

/** A weight in the unit a reader holds in their head. */
const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** The median of the passes, which is the pass nobody's compiler was warming. */
function median(samples) {
  const sorted = [...samples].sort((one, other) => one - other);
  return sorted[Math.floor(sorted.length / 2)];
}

/** Milliseconds one pass of `run` takes, once the path has been walked once. */
function time(run) {
  run();
  const samples = [];
  for (let pass = 0; pass < RUNS; pass += 1) {
    const start = performance.now();
    run();
    samples.push(performance.now() - start);
  }
  return median(samples);
}

async function timeAsync(run) {
  await run();
  const samples = [];
  for (let pass = 0; pass < RUNS; pass += 1) {
    const start = performance.now();
    await run();
    samples.push(performance.now() - start);
  }
  return median(samples);
}

const measured = new Map();
/** One timing, refused if the table has nothing to say about that path. */
function measuredWith(key, ms, note) {
  if (!(key in STRESS_BUDGETS)) {
    console.error(
      `stress: the script measures "${key}", which has no budget in src/lib/load-stress.js.\n` +
        "A path nobody decided about is a path nobody is watching: add the line, or stop measuring it."
    );
    process.exit(1);
  }
  measured.set(key, { ms, note });
}

// A tap rewrites the whole record, so it is timed against both shapes of it: the
// one a player really has, and the one a file can bring. The keys rotate so that
// each pass writes what a real answer writes rather than the same key twice.
async function timeAnswer(record) {
  store.set(PROGRESS_KEY, JSON.stringify(record));
  const keys = Object.keys(record.question_stats);
  let pass = 0;
  return timeAsync(() => {
    const question = keys[pass % keys.length];
    pass += 1;
    return progressStore.recordAnswer(question, pass % 4 === 0);
  });
}

measuredWith("answer", await timeAnswer(finished), `${kilobytes(sizeOf(finished))} rewritten`);
measuredWith("answerAtCeiling", await timeAnswer(ceiling), `${kilobytes(sizeOf(ceiling))} rewritten`);

// A file arriving: the text is parsed, then every field is rebuilt against the
// known shape. The document is the one the export writes, so what is timed is a
// round trip through the application rather than through a fixture.
const document = backupDocument(ceiling);
const parsed = JSON.parse(document);
measuredWith("import", time(() => readBackup(document)), `${kilobytes(document.length)} read and rebuilt`);
measuredWith("repair", time(() => cleanProgress(parsed.progress)), "the ceiling, rebuilt on its own");
measuredWith("export", time(() => buildBackup({ progress: ceiling, profileName: "Kofi", now })), "a backup written");
const inbox = collectReviewQueue(finished.question_stats, levels).length;
measuredWith(
  "reviewQueue",
  time(() => collectReviewQueue(finished.question_stats, levels)),
  `${inbox} questions in the inbox`
);

const classroom = Array.from({ length: CLASS_SIZE }, (_unused, index) => ({
  id: `p${index}`,
  name: `Student ${index}`,
  progress: finished,
}));
measuredWith("classPage", time(() => classSummary(classroom, levels, now)), `${CLASS_SIZE} students`);

console.log(
  `stress: ${levels.length} levels, ${questions} questions, node ${process.version.slice(1)}\n\n` +
    `  what one device holds\n` +
    `    a finished player           ${kilobytes(sizeOf(finished)).padStart(9)}` +
    `  ${recordsPerQuota(sizeOf(finished))} of them in a ${QUOTA_BYTES / 1024 / 1024} MB quota\n` +
    `    the ceiling a file may bring${kilobytes(sizeOf(ceiling)).padStart(9)}` +
    `  ${recordsPerQuota(sizeOf(ceiling))} of them in the same quota\n` +
    `    and that ceiling as a file  ${kilobytes(document.length).padStart(9)}` +
    `  under the ${MAX_BACKUP_BYTES / 1024 / 1024} MB a file may weigh\n\n` +
    `  every answer rewrites the whole record, so what a tap costs follows what the device already\n` +
    `  holds: the last one written was ${kilobytes(lastWriteBytes)}, and the bytes are the string the\n` +
    `  browser is handed rather than the disk's own work.\n`
);

const over = [];
for (const [key, { budget, what }] of Object.entries(STRESS_BUDGETS)) {
  const entry = measured.get(key);
  if (!entry) {
    console.error(
      `stress: src/lib/load-stress.js allows "${key}" ${budget} ms and nothing here measures it.\n` +
        "A budget for a path this script no longer walks is a claim nobody checks."
    );
    process.exit(1);
  }
  const share = Math.round((entry.ms / budget) * 100);
  const line = `  ${what.padEnd(52)} ${entry.ms.toFixed(1).padStart(7)}/${budget} ms ${String(share).padStart(3)}%`;
  console.log(`${line}  ${entry.note}`);
  if (entry.ms > budget) over.push({ key, what, ...entry, budget });
}

if (over.length === 0) {
  console.log(`\nstress: every path is within its budget, on the record a device really holds`);
  process.exit(0);
}

console.error(`\nstress: ${over.length} of ${Object.keys(STRESS_BUDGETS).length} paths are over their budget:`);
for (const entry of over) {
  console.error(`  ${entry.what}: ${entry.ms.toFixed(1)} ms against ${entry.budget} ms allowed`);
}
console.error(
  "  A budget is a decision and not a measurement: either the path got slower, or the record it walks\n" +
    "  got heavier, or the line in src/lib/load-stress.js no longer describes what a reader feels."
);
process.exit(1);
