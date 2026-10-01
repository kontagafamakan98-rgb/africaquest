/**
 * The weight of a build, bundle by bundle, against the pass recorded last time,
 * against the budget each one is allowed, and against the table that has to hold
 * every bundle the build writes.
 *
 * An application grows one small change at a time, and every one of those
 * changes looks reasonable on its own: a library here, a screen there, a
 * photograph re-downloaded at a slightly larger size. What nobody notices is the
 * total, and by the time it is noticed, it is a rewrite rather than a decision.
 * So the weights of the last build are written down in build/bundle-weights.json,
 * and the next build is weighed against them: a file more than a tenth heavier
 * than it was stops the verification, which turns a growth nobody chose into a
 * line of output somebody has to read.
 *
 * Two questions then, and they are not the same one.
 *
 * A budget says what a bundle may weigh, whatever it weighed yesterday. It is a
 * decision written down, and it is the only thing that notices a bundle which
 * crept up in silence: a tenth here, a tenth there, never more than the pass
 * before allows, and after a year it is twice what it started as. It is also
 * what keeps a page from being assembled out of whatever libraries happened to
 * be nearest, since a library that does not fit has to be argued for rather than
 * merely imported.
 *
 * The growth allowance says how much heavier a bundle may be than at the last
 * recorded pass, and it catches the opposite failure: a bundle that is nowhere
 * near its budget and twice what it was this morning, which is what one ordinary
 * import at the top of a screen does. A budget never sees that.
 *
 * Both are checked, and the report prints both: the size it reached against the
 * budget it is allowed, and the change since the last pass.
 *
 * There is a third rule, and it is not about a weight at all: a bundle the build
 * writes and nobody has written a line for. A ceiling used to stand in for the
 * missing line - the heaviest budget in the table - and it was the wrong answer.
 * A bundle that arrives without a decision is precisely the bundle that needs
 * one, and a bundle that is under a ceiling nobody chose passes for as long as
 * it stays small, which is how a table stops describing the build. So the table
 * has to be complete: the report refuses a bundle that is not in it, and says
 * which file to add rather than what number to write, because the number is a
 * judgement this module cannot make.
 *
 * All three are held to the same thing, which is that none of them may move on
 * its own. A budget is edited by hand, in this file, and the recorded pass is
 * written by a command somebody ran; a gate that adjusted itself would be
 * measuring nothing, and a table that fills itself in would be deciding nothing.
 *
 * The name a weight is recorded under has its content hash taken out, and that
 * is the whole reason the comparison works at all. The bundler writes the hash
 * of the content into the file name, so a comment added to one module renames
 * it: without this, every build would look like twenty new files and twenty
 * vanished ones, and the report would be noise rather than a measurement. What
 * is compared is the weight of a bundle - of a thing the application draws - not
 * the bytes of one particular build of it.
 *
 * Plain module: the reporting script and the tests both read it, and it never
 * touches the disk itself.
 */

/**
 * How much heavier a file may be than the recorded one before it fails.
 *
 * A tenth of a bundle is a change somebody meant: a page that grew a few
 * hundred bytes, a dependency that was upgraded. Twice that in one pass is a
 * decision, and the point of the gate is that it cannot be made by accident.
 */
export const BUNDLE_ALLOWANCE = 1.1;

/** Where the recorded weights live, relative to the project root. */
export const WEIGHTS_FILE = "build/bundle-weights.json";

/**
 * Where the budgets live, relative to the project root.
 *
 * A failure has to send whoever reads it to the line that has to change, and it
 * is this module that holds that line: named here rather than written a second
 * time in the message, so moving the budgets cannot leave the advice pointing at
 * a file that is not there.
 */
export const BUDGETS_FILE = "build/bundle-weight.js";

/**
 * What each bundle of the application is allowed to weigh, in bytes.
 *
 * One line per bundle, written by hand, in round numbers. The numbers are not
 * "what it weighs today": they are what somebody decided this bundle may cost a
 * reader, with room to grow into, and the difference matters. A budget set at
 * the weight of the day fails on the next honest feature, which teaches everyone
 * to edit the table without reading it; one set with room left fails on a change
 * of direction instead, which is the thing worth stopping.
 *
 * Every bundle the build writes has a line here. A bundle without one is not
 * given a ceiling instead: it stops the verification, and the failure names the
 * file and the table it is missing from. That is the whole of the rule, and a
 * test holds the table to the build it describes, so a chunk added, renamed or
 * removed cannot leave this behind.
 *
 * The three groups below are not a taxonomy but three different reasons for a
 * number to be what it is: what a reader waits for before the map appears, a
 * library that arrives with one screen, and the content of the game itself.
 */
export const BUNDLE_BUDGETS = {
  // The critical path. These are the files a reader on a slow connection waits
  // for before anything is drawn, so they are the tightest numbers here, and the
  // entry is the tightest of them.
  "/assets/index.js": 200 * 1024,
  "/assets/index.css": 120 * 1024,
  "/assets/react.js": 175 * 1024,
  "/assets/motion.js": 140 * 1024,
  "/assets/router.js": 35 * 1024,
  "/assets/query.js": 60 * 1024,
  "/assets/icons.js": 60 * 1024,

  // The content of the game, and the libraries one screen needs to draw it.
  // gameData is the questions and the lessons, so it grows with the game rather
  // than with the code, and its budget is the one that is meant to be raised as
  // levels are added. It stood at 240 KB while twelve of the twenty levels were
  // still short ones; every level now teaches a full lesson of twenty-one
  // questions in both languages, which is the growth this line was written for.
  "/assets/gameData.js": 400 * 1024,
  // The institutions the references come from: read by the bibliography, and by
  // the quiz, which offers a search under a notice that carries no page. Small
  // today, and the room here is for the institutions a longer game would quote.
  "/assets/publishers.js": 15 * 1024,
  // One lesson's own material, asked for only when that lesson is opened: its
  // questions, their references, their study pack and the gallery of the level.
  // The content of the whole game used to arrive in the lesson's chunk, which
  // meant a player who opened one level downloaded all twenty. These twenty
  // lines are what the split costs: they are read one at a time, never together,
  // so each is a budget of its own rather than a share of one big number. The
  // room left is for a level that grows a few questions or a longer essay.
  "/assets/level-01.js": 48 * 1024,
  "/assets/level-02.js": 48 * 1024,
  "/assets/level-03.js": 48 * 1024,
  "/assets/level-04.js": 48 * 1024,
  "/assets/level-05.js": 48 * 1024,
  "/assets/level-06.js": 48 * 1024,
  "/assets/level-07.js": 48 * 1024,
  "/assets/level-08.js": 48 * 1024,
  "/assets/level-09.js": 48 * 1024,
  "/assets/level-10.js": 48 * 1024,
  "/assets/level-11.js": 48 * 1024,
  "/assets/level-12.js": 48 * 1024,
  "/assets/level-13.js": 48 * 1024,
  "/assets/level-14.js": 48 * 1024,
  "/assets/level-15.js": 48 * 1024,
  "/assets/level-16.js": 48 * 1024,
  "/assets/level-17.js": 48 * 1024,
  "/assets/level-18.js": 48 * 1024,
  "/assets/level-19.js": 48 * 1024,
  "/assets/level-20.js": 48 * 1024,
  // The one function that turns a level - whole game or single lesson - into the
  // language on screen. Both roads to a level go through it, so it is shared
  // rather than copied, and it is small because it is only the rule for swapping
  // wording and nothing about the levels themselves.
  "/assets/localize-level.js": 15 * 1024,
  "/assets/index.es.js": 200 * 1024,
  "/assets/jspdf.es.min.js": 450 * 1024,
  "/assets/html2canvas.esm.js": 240 * 1024,
  "/assets/purify.es.js": 35 * 1024,
  "/assets/report-pdf.js": 15 * 1024,
  "/assets/progress-report.js": 15 * 1024,

  // One screen each, opened by a tap. A screen that outgrows these is carrying
  // more than a screen.
  // It carries the lesson story of every level in both languages, which is the
  // material a player listens to before the quiz, rather than a screen of code.
  // The stories were rewritten at twice their former length, and this line
  // follows the text rather than the code.
  "/assets/AudioNarrator.js": 55 * 1024,
  "/assets/TeacherPage.js": 35 * 1024,
  "/assets/StatsScreen.js": 35 * 1024,
  // The quiz is no longer one screen: it draws four shapes of question - four
  // answers to choose between, a chronology to put in order, three names to
  // match to their descriptions, and an exam that is marked rather than fed
  // back - and it carries the screen that ends a run, with the recap and the
  // corrigé an exam hands back. It stood at 30 KB when a run was one shape.
  // The room left is for a question type and not for a library: a screen that
  // needs twice this is a screen that has become two.
  "/assets/QuizScreen.js": 36 * 1024,
  "/assets/ReviewScreen.js": 25 * 1024,
  // The lesson screen is a screen again: the study pack of every level used to
  // travel inside this chunk, which made it a library of lessons a player
  // downloaded in full to read one. The material now travels with the level the
  // lesson opened, in that level's own chunk above, so this line follows the
  // screen rather than the text and sits with the other screens.
  "/assets/LessonScreen.js": 30 * 1024,
  "/assets/QuizPage.js": 20 * 1024,
  "/assets/PhotoCredits.js": 20 * 1024,
  "/assets/Bibliography.js": 20 * 1024,
  "/assets/LearnScreen.js": 15 * 1024,
  "/assets/ReviewSession.js": 10 * 1024,
  "/assets/SourceReference.js": 10 * 1024,
};

/**
 * What a bundle is allowed to weigh, or nothing when nobody has decided.
 *
 * Nothing rather than a fallback number, and that is the point: a bundle with no
 * line of its own is a bundle nobody has judged, and a number borrowed from
 * another line would let it pass as though somebody had. What the caller does
 * with the empty answer is its own decision - the report refuses it, the tests
 * name it - but it is never quietly turned into a weight.
 */
export function budgetOf(file, budgets = BUNDLE_BUDGETS) {
  return budgets[bundleName(file)];
}

/**
 * The bundles the build wrote that nobody has written a budget for.
 *
 * This is the list the third rule is about: a chunk the bundler started writing
 * on its own, a new library it cut in two, a screen somebody added without a
 * line in the table. Each one comes back with the weight it already has, since
 * the reader has to decide what to allow it and the size is what that decision
 * starts from, and they are ordered heaviest first for the same reason.
 */
export function missingBudgets(current = {}, budgets = BUNDLE_BUDGETS) {
  return Object.entries(current)
    .filter(([file]) => budgetOf(file, budgets) === undefined)
    .map(([file, size]) => ({ file, size }))
    .sort((one, other) => other.size - one.size);
}

/**
 * The name a built file is recorded under: its name without the content hash.
 *
 * The hash is only ever put in the name of the files the bundler emits, which
 * all live in `assets`, and that is the only place it is taken out. Everything
 * else keeps the name it was given - the photographs, the icons, the manifest,
 * the service worker - so a file that appears in the repository under a stable
 * name is compared under exactly that name.
 */
export function bundleName(file) {
  const name = String(file);
  if (!name.includes("/assets/")) return name;
  return name.replace(/-[A-Za-z0-9_-]{8}(\.[a-z0-9]+)$/, "$1");
}

/**
 * What a built file is, for the report: the application's own code, its
 * stylesheet, a photograph, or the shell it is served from.
 *
 * A bundle and a stylesheet are the two things a browser downloads as one unit
 * per page, which is why they are the ones weighed apart and reported line by
 * line; the photographs are numbered in the hundreds and are counted as a set.
 */
export function groupOf(file) {
  const name = String(file);
  if (/\/assets\/[^/]+\.js$/.test(name)) return "bundle";
  if (/\/assets\/[^/]+\.css$/.test(name)) return "style";
  if (name.includes("/photos/")) return "photo";
  return "shell";
}

/**
 * How the current weights differ from the recorded ones.
 *
 * `recorded` and `current` both map a name, as `bundleName` writes it, to a size
 * in bytes. What comes back is what a report is made of: the files that grew
 * past the allowance, the ones that are new since the recorded pass, and the
 * ones that are gone. Only the first of the three can fail the run - a new file
 * has no recorded weight to have grown past, and a file that shrank or vanished
 * is the direction this whole exercise exists to encourage.
 *
 * Each growth carries the ratio rather than only the two sizes, because what is
 * reported is by how much, and the list is ordered by it: the file that grew the
 * most proportionally is the one somebody has to explain.
 */
export function compareWeights(recorded = {}, current = {}, allowance = BUNDLE_ALLOWANCE) {
  const growth = [];
  const added = [];
  const gone = [];

  for (const [file, size] of Object.entries(current)) {
    const was = recorded[file];
    if (was === undefined) {
      added.push({ file, size });
      continue;
    }
    if (size > was * allowance) growth.push({ file, size, was, ratio: size / was });
  }

  for (const [file, was] of Object.entries(recorded)) {
    if (!Object.hasOwn(current, file)) gone.push({ file, was });
  }

  growth.sort((one, other) => other.ratio - one.ratio);
  added.sort((one, other) => other.size - one.size);
  gone.sort((one, other) => other.was - one.was);
  return { growth, added, gone };
}

/**
 * The bundles heavier than the budget they are allowed.
 *
 * Only the bundles of the application are weighed against a budget: the
 * photographs and the files of the shell already have theirs, one per picture
 * and one for the whole gallery, held by tests of their own, and a budget for
 * each of the two hundred photographs would be a table nobody could keep.
 *
 * Each one comes back with the size it reached, what it was allowed, and the
 * ratio between them, so the report says how far over rather than only that it
 * is. The worst comes first: that is the one to fix, and the smaller overruns
 * behind it may well be standing on its shoulders.
 *
 * A bundle with no line of its own is left to `missingBudgets` rather than
 * weighed against a number nobody chose: it is a failure either way, and saying
 * it twice would only bury the one thing the reader has to do about it.
 */
export function overBudget(current = {}, budgets = BUNDLE_BUDGETS) {
  const over = [];

  for (const [file, size] of Object.entries(current)) {
    const budget = budgetOf(file, budgets);
    if (budget === undefined) continue;
    if (size > budget) over.push({ file, size, budget, ratio: size / budget });
  }

  over.sort((one, other) => other.ratio - one.ratio);
  return over;
}

/**
 * The recorded weights, as a sorted file body.
 *
 * Sorted and indented the way a reader would write them, and with nothing in it
 * that changes on its own - no date, no count, no version - so recording the
 * same build twice hands back the same bytes and a real change shows up as a
 * diff rather than as a rewrite.
 */
export function weightsFileBody(weights = {}) {
  const sorted = {};
  for (const name of Object.keys(weights).sort()) sorted[name] = weights[name];
  return `${JSON.stringify(sorted, null, 2)}\n`;
}
