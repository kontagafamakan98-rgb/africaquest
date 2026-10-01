import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// The game used to arrive as one file of 780 kB: a player waiting for the map was
// also downloading the quiz, the lesson reader, the statistics tab and the PDF
// export, with the difficulty picker, the narrator and the charts behind them.
// It is now cut along the line the reader draws themselves, between what the map
// needs and what a tap opens, which brings the entry file far below the 500 kB
// at which the build starts warning.
//
// Such a cut is undone by one ordinary import at the top of a file, and the
// build only warns when it happens: it never fails. So the line is written down
// here. The first half reads the source and refuses a screen that is imported up
// front again; the second half measures the build that came out of it against
// the very limit Vite warns about.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

/** The threshold the build warns at. */
const WARNING_LIMIT = 500 * 1024;

// Everything a deliberate tap opens. None of it belongs in the file the first
// screen waits for: the quiz with its difficulty picker, its narrator and its
// hint sheet; the lesson reader with its flash quiz; the review inbox and the
// session it starts; and the statistics tab with its charts, its knowledge map
// and its PDF export.
const DEFERRED = [
  "src/pages/QuizPage.jsx",
  "src/components/game/QuizScreen.jsx",
  "src/components/game/DifficultyPicker.jsx",
  "src/components/game/HintModal.jsx",
  "src/components/game/AudioNarrator.jsx",
  "src/components/game/LearnScreen.jsx",
  "src/components/game/LessonScreen.jsx",
  "src/components/game/FlashQuiz.jsx",
  "src/components/game/ReviewScreen.jsx",
  "src/components/game/ReviewSession.jsx",
  "src/components/game/StatsScreen.jsx",
  "src/components/game/ProgressCharts.jsx",
  "src/components/game/KnowledgeMap.jsx",
  "src/lib/report-pdf.js",
];

// The content of the game, which the map is drawn without. It arrives in its own
// file, asked for by the screens that really need every level (the review inbox,
// the bibliography, the statistics) and not by the map at all, and a single
// ordinary import at the top of one of the files above would put it back in
// front of the map. A lesson asks for one level instead, through the modules the
// test below holds, rather than for the whole game.
// The photograph table is here for the same reason: the gallery it carries -
// sixty captions, their authors and their licences - is only read by the screens
// that show it. So are the two modules the references come from: the list of
// institutions, read by the bibliography and by the quiz, which offers a search
// under a notice that carries no page, and the bibliography itself, which joins
// that list to the levels and is read by the page that lists them.
const CONTENT = [
  "src/components/game/gameData.js",
  "src/components/game/content-fr.js",
  "src/components/game/references.js",
  "src/components/game/publishers.js",
  "src/lib/level-images.js",
];

const ENTRY = "src/main.jsx";
const EXTENSIONS = ["", ".jsx", ".js", "/index.jsx", "/index.js"];

const resolve = (specifier, from) => {
  const base = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(path.join(ROOT, from)), specifier)
      : null;
  if (!base) return null;

  for (const extension of EXTENSIONS) {
    const candidate = base + extension;
    if (existsSync(candidate) && !candidate.endsWith(path.sep)) return path.relative(ROOT, candidate);
  }
  return null;
};

/**
 * The files the browser has to have before it can draw anything.
 *
 * Only imports written at the top of a file are followed: a `lazy(() => import(...))`
 * or an `await import(...)` is a request the browser makes later, which is
 * exactly what a deferred screen is. A re-export is a static import too, so it
 * counts as well.
 */
function firstPaint(file = ENTRY, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);

  const source = readFileSync(path.join(ROOT, file), "utf8");
  const staticImports =
    /^\s*import\s+(?:[^;"']*?\s+from\s+)?["']([^"']+)["']|^\s*export\s+[^;"']*?\bfrom\s+["']([^"']+)["']/gm;

  for (const match of source.matchAll(staticImports)) {
    const next = resolve(match[1] || match[2], file);
    if (next) firstPaint(next, seen);
  }
  return seen;
}

test("the quiz, the lesson, the review and the statistics arrive when they are opened", () => {
  const upfront = [...firstPaint()].map((file) => file.split(path.sep).join("/"));

  // The walk has to have walked: a broken pattern would find nothing at all and
  // quietly pass, which is the one way this test could lie. The brief of the
  // game is what the map is drawn from, so it is the file that has to be there.
  for (const file of [
    "src/App.jsx",
    "src/pages/Home.jsx",
    "src/components/game/LevelCard.jsx",
    "src/components/game/level-summary.js",
  ]) {
    assert.ok(upfront.includes(file), `${file} is part of the first screen`);
  }

  for (const file of [...DEFERRED, ...CONTENT]) {
    assert.ok(!upfront.includes(file), `${file} is downloaded before the map can be drawn`);
  }
});

test("a level's questions are asked for one level at a time, when it is opened", () => {
  // The map is drawn from the brief and no longer asks for the whole game: the
  // twenty levels were four hundred kilobytes, and a player who opens one of
  // them was downloading all twenty. What a lesson reads now is one level, and
  // the loader below is what turns them into twenty requests. The walk above
  // proves no *static* import reaches the content; this proves a lesson can
  // still get at it, one level at a time.
  const upfront = [...firstPaint()].map((file) => file.split(path.sep).join("/"));
  assert.ok(
    !upfront.some((file) => file.includes("/game/levels/")),
    "a level module is downloaded before the map can be drawn"
  );

  const loader = read("src/components/game/level-content.js");
  const asked = [...loader.matchAll(/import\(\s*["']\.\/levels\/([^"']+)["']\s*\)/g)].map(
    (match) => match[1]
  );
  assert.equal(asked.length, 26, "every level has a loader of its own");
  assert.equal(new Set(asked).size, 26, "and none of them is declared twice");

  // Each loader points at a file that is really there, and the two lists are the
  // same twenty: a level added to the game whose module nobody asks for, or a
  // module left behind by a level that was renumbered, fails here.
  const directory = path.join(ROOT, "src", "components", "game", "levels");
  assert.ok(existsSync(directory), "the levels have a directory of their own");
  assert.deepEqual(readdirSync(directory).sort(), [...asked].sort(), "the loaders and the level files are the same twenty");

  // The screens that open a level go through the loader, and none of the three
  // reads the whole game, which is what keeps twenty levels out of the chunk a
  // lesson downloads.
  for (const [file, what] of [
    ["src/components/game/LessonScreen.jsx", "the lesson"],
    ["src/pages/QuizPage.jsx", "the quiz"],
  ]) {
    assert.match(read(file), /loadLevel\(/, `${what} no longer loads one level at a time`);
  }
  for (const [file, what] of [
    ["src/components/game/LessonScreen.jsx", "the lesson"],
    ["src/pages/QuizPage.jsx", "the quiz"],
    ["src/components/game/LearnScreen.jsx", "the study list"],
  ]) {
    assert.doesNotMatch(
      read(file),
      /from\s*["'][^"']*gameData["']/,
      `${what} imports the whole game again`
    );
  }

  // The study pack of all twenty levels used to be read from one module by the
  // lesson, which put the material of the whole game in front of a player who
  // opened one level. It now travels with the level the lesson downloaded, so
  // the lesson must not read that module and must draw what came with the level.
  assert.doesNotMatch(
    read("src/components/game/LessonScreen.jsx"),
    /from\s*["'][^"']*level-study["']/,
    "the lesson downloads the study pack of every level again"
  );
  assert.match(
    read("src/components/game/LessonScreen.jsx"),
    /level\.study/,
    "the lesson draws the study pack of the level it downloaded"
  );

  // And the map prefetches none of it: asking for the whole game beside the map
  // would put the four hundred kilobytes straight back on the first screen.
  assert.doesNotMatch(
    read("src/pages/Home.jsx"),
    /import\(\s*["'][^"']*gameData["']\s*\)/,
    "the map asks for the whole game again"
  );
});

// The pages that ask for a screen on demand, and what that screen is.
const ON_DEMAND = [
  ["src/pages/Home.jsx", "./QuizPage", "the quiz"],
  ["src/pages/Home.jsx", "../components/game/LearnScreen", "the study list"],
  ["src/pages/Home.jsx", "../components/game/LessonScreen", "the lesson reader"],
  ["src/pages/Home.jsx", "../components/game/ReviewScreen", "the review inbox"],
  ["src/pages/Home.jsx", "../components/game/ReviewSession", "the review session"],
  ["src/pages/Home.jsx", "../components/game/StatsScreen", "the statistics tab"],
  ["src/pages.config.js", "./pages/QuizPage", "the quiz route"],
  ["src/pages.config.js", "./pages/TeacherPage", "the teacher space"],
  ["src/pages.config.js", "./pages/PhotoCredits", "the photo credits"],
  ["src/pages.config.js", "./pages/Bibliography", "the bibliography"],
];

test("every screen the map opens is asked for on demand, and never at the top", () => {
  // The specifier is quoted on both sides, and either quote style is a valid
  // JavaScript string: the route file happens to use single quotes.
  const escape = (text) => text.replace(/[/.]/g, (character) => `\\${character}`);
  const onDemand = (specifier) => new RegExp(`import\\(\\s*["']${escape(specifier)}["']\\s*\\)`);
  const upfront = (specifier) => new RegExp(`from\\s*["']${escape(specifier)}["']`);

  for (const [file, specifier, what] of ON_DEMAND) {
    const source = read(file);
    assert.match(
      source,
      onDemand(specifier),
      `${what}: ${file} no longer loads ${specifier} on demand`
    );
    assert.doesNotMatch(
      source,
      upfront(specifier),
      `${what}: ${file} imports ${specifier} at the top again, which puts it back on the first screen`
    );
  }
});

test("the libraries every screen needs travel in chunks of their own", () => {
  const config = read("vite.config.js");
  assert.match(config, /manualChunks/, "the build is told how to cut its output");

  // React, the router, the query cache, the animation library and the icons only
  // change when their version does, so a returning player downloads the game and
  // nothing else. Everything left unnamed follows its own import graph, which is
  // what keeps the libraries only an export needs travelling with the export.
  for (const chunk of ["react", "router", "query", "motion", "icons"]) {
    assert.match(config, new RegExp(`\\["${chunk}",\\s*/`), `the ${chunk} chunk is declared`);
  }
});

test("no chunk of the built application reaches the size the build warns about", (t) => {
  const dist = path.join(ROOT, "dist");
  const page = path.join(dist, "index.html");
  if (!existsSync(page)) {
    t.skip("run npm run build first");
    return;
  }

  const html = readFileSync(page, "utf8");
  const entry = /<script[^>]*type="module"[^>]*>/.exec(html)?.[0];
  const entryFile = /src="([^"]+)"/.exec(entry || "")?.[1];
  assert.ok(entryFile, "the page loads an entry module");

  // What the browser is told to fetch before it can draw anything: the entry
  // module and the files the page preloads. The list is read from the page
  // rather than kept as names here, so it follows whatever the build produced.
  const eager = new Set([entryFile.replace(/^\//, "")]);
  for (const match of html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+\.js)"/g)) {
    eager.add(match[1].replace(/^\//, ""));
  }

  // And the files those import, since a statically imported chunk is needed just
  // as much, whether the page names it or not.
  const waiting = [...eager];
  for (let index = 0; index < waiting.length; index += 1) {
    const file = waiting[index];
    const source = readFileSync(path.join(dist, file), "utf8");
    for (const match of source.matchAll(/\bfrom\s*["']([^"']+)["']|\bimport\s*["']([^"']+)["']/g)) {
      const next = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1] || match[2]));
      if (!eager.has(next) && existsSync(path.join(dist, next))) {
        eager.add(next);
        waiting.push(next);
      }
    }
  }

  const kilobytes = (file) => Math.round(statSync(path.join(dist, file)).size / 1024);

  for (const file of eager) {
    assert.ok(
      statSync(path.join(dist, file)).size < WARNING_LIMIT,
      `${file} is ${kilobytes(file)} kB, over the 500 kB the build warns about`
    );
  }

  // The warning is about one file, so a lazy chunk that outgrows the limit is
  // the same problem moved rather than solved.
  for (const name of readdirSync(path.join(dist, "assets"))) {
    const file = path.join("assets", name);
    assert.ok(
      statSync(path.join(dist, file)).size < WARNING_LIMIT,
      `${file} is ${kilobytes(file)} kB, over the 500 kB the build warns about`
    );
  }

  // The entry file is the one file that cannot be fetched in parallel with
  // anything, so it carries the map and the level data and stops there. The
  // budget is what the screens above would not fit into.
  const entryBytes = statSync(path.join(dist, entryFile.replace(/^\//, ""))).size;
  assert.ok(
    entryBytes < 400 * 1024,
    `the entry file is ${kilobytes(entryFile.replace(/^\//, ""))} kB: a screen a tap opens belongs in its own chunk`
  );
});
