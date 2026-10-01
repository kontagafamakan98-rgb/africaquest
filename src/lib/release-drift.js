/**
 * Whether the published Android app is older than the published site.
 *
 * The two are published from the same repository but not by the same thing. The
 * site goes out on every push to `main`, from the workflow that builds it. The
 * APK goes out only when a version tag is pushed, because it has to be signed,
 * versioned and attached to a release. So the site can carry weeks of changes
 * that no installed application has, and nothing anywhere would say so: the
 * Android screen keeps offering the same download, and the people who installed
 * it keep the older game.
 *
 * That is the failure this module decides, and what matters is not that `main`
 * has moved, it is that it moved over something the installed application is
 * made of. A README paragraph, a workflow, a note about signing: none of them
 * changes what is installed, and a check that failed on them would be a check
 * people learn to ignore.
 *
 * "Made of" is read the way the build reads it, and that is the part worth
 * stating. Under `src/`, only the modules the application really reaches count:
 * the build starts from one entry and pulls in what it imports, so a module
 * nothing imports never lands in the bundle. Two kinds of file sit in `src/`
 * without ever being reached, and both would otherwise make this check lie. A
 * test file beside the code it checks runs under Node and ships nowhere. And a
 * module of pure logic written for a script - the verdicts of the published
 * site, the decision below - is imported by that script and by its own test and
 * by nothing a reader ever loads. So the reachable set is walked from the entry
 * (see `appModules`, and `src/main.jsx` is what `index.html` starts the app
 * from), and everything else under `src/` is left out of the count.
 *
 * The rest of the list is about the built application rather than about the
 * repository: the Android project is here because the wrapper itself is what a
 * device installs, `public/` because it is copied into the build as it stands,
 * and the build modules because they decide how it is assembled. `package.json`
 * is deliberately absent and `package-lock.json` is what stands in for it: the
 * lockfile is what fixes the packages the application is built with, and a
 * change to a script or a note in the manifest does not move it, which is the
 * difference between a change that ships and a change that does not. `scripts/`
 * is absent for the same reason: those programs run during the build, but what
 * they write is committed, so a change to one shows up here as the change it
 * produced.
 *
 * Plain module: no network, no disk, no imports. What a list of changed files
 * means is decided here; fetching that list, and reading this repository to
 * learn what the application reaches, are the script's job.
 */

/** The file `index.html` starts the application from: what the bundle grows out of. */
export const APP_ENTRY = "src/main.jsx";

/**
 * What the APK is built from, outside of `src/`, as paths in the repository.
 *
 * A directory entry ends with a slash and matches everything under it.
 */
export const APP_PATHS = [
  "public/",
  "android/",
  "build/",
  "index.html",
  "capacitor.config.json",
  "package-lock.json",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];

/** What a specifier without an extension is tried against, in order. */
const MODULE_SUFFIXES = [".js", ".jsx", ".mjs", ".css", ".json"];

/**
 * An extension this project writes, and not merely a dot in a file name.
 *
 * `src/pages.config` ends in `.config`, which is not a module, so a specifier is
 * held to carry an extension only when its last segment ends in one of these.
 * Reading any dot as an extension would leave `./pages.config` unresolved and
 * silently drop a whole screen out of what ships.
 */
const EXTENSION_RE = /\.(?:js|jsx|mjs|cjs|css|json|ts|tsx)$/i;

const FROM_RE = /\bfrom\s*['"]([^'"]+)['"]/g;
const BARE_RE = /\bimport\s*['"]([^'"]+)['"]/g;
const DYNAMIC_RE = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const CSS_RE = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g;

/** The directory part of a repository path, without the file name. */
function dirOf(file) {
  const at = String(file).lastIndexOf("/");
  return at === -1 ? "" : String(file).slice(0, at);
}

/** One path with a relative specifier folded into it. */
function fold(dir, specifier) {
  const parts = String(dir).split("/").filter(Boolean);
  for (const piece of String(specifier).split("/")) {
    if (piece === "" || piece === ".") continue;
    if (piece === "..") parts.pop();
    else parts.push(piece);
  }
  return parts.join("/");
}

/**
 * Every module specifier one source file names, in the order they appear.
 *
 * Four shapes are read: the `from` of a static import or re-export, a bare
 * `import "..."` for its side effect, the call of a dynamic `import(...)` whose
 * argument is a literal, and the `@import` of a stylesheet. A specifier built
 * from a variable is not something anything here can follow, and the build
 * cannot follow it either, so it is left out rather than guessed at.
 */
export function importedFrom(source) {
  const text = String(source ?? "");
  const found = new Set();
  for (const pattern of [FROM_RE, BARE_RE, DYNAMIC_RE, CSS_RE]) {
    pattern.lastIndex = 0;
    let match = pattern.exec(text);
    while (match !== null) {
      found.add(match[1]);
      match = pattern.exec(text);
    }
  }
  return [...found];
}

/**
 * The path in this repository a specifier points at, or null for a package.
 *
 * `@` is the alias for `src/`, which is how the application writes most of its
 * imports; a relative specifier is folded at the file that named it. Anything
 * else is a package, and packages are not files of this repository.
 */
export function resolvedPath(specifier, fromFile) {
  const spec = String(specifier ?? "");
  if (spec.startsWith("@/")) return `src/${spec.slice(2)}`;
  if (spec.startsWith("./") || spec.startsWith("../")) return fold(dirOf(fromFile), spec);
  return null;
}

/**
 * The files a specifier could be, in the order they are tried.
 *
 * A specifier the application writes may carry its extension or leave it out, so
 * an extension is honoured when it is there and tried against the few this
 * project uses when it is not, with the `index` of a directory last.
 */
export function candidatePaths(base) {
  if (base.endsWith("/")) {
    return [`${base}index.js`, `${base}index.jsx`];
  }
  if (EXTENSION_RE.test(base)) return [base];
  return [
    ...MODULE_SUFFIXES.map((suffix) => `${base}${suffix}`),
    `${base}/index.js`,
    `${base}/index.jsx`,
  ];
}

/**
 * Every file of this repository the installed application is built from.
 *
 * `sources` is what the script read off the disk: a path to its text, the whole
 * of `src/`. The walk starts at the entry and follows what each file imports, so
 * what comes back is the reachable set and it is deliberately not a list of
 * everything under `src/`: a test file and a module only a script imports are
 * both absent from it, and both are exactly the files that would otherwise make
 * the check fire on a change nobody installs.
 *
 * Nothing is guessed: a specifier that points at a package, or at a file that is
 * not in `sources`, ends the branch rather than being assumed to ship.
 */
export function appModules({ entry = APP_ENTRY, sources = {} } = {}) {
  const files = sources && typeof sources === "object" ? sources : {};
  const known = new Set(Object.keys(files));
  const reached = new Set();
  const waiting = [entry];

  while (waiting.length > 0) {
    const file = waiting.pop();
    if (reached.has(file) || !known.has(file)) continue;
    reached.add(file);
    const source = typeof files[file] === "string" ? files[file] : "";
    for (const specifier of importedFrom(source)) {
      const base = resolvedPath(specifier, file);
      if (base === null) continue;
      const candidate = candidatePaths(base).find((one) => known.has(one));
      if (candidate !== undefined) waiting.push(candidate);
    }
  }

  return reached;
}

/**
 * Whether one file is part of what the installed application is made of.
 *
 * `appFiles` is the set `appModules` walked out of this repository, and it is
 * what decides a file under `src/`: a module the application really reaches is
 * part of it, and a test file, or a module only a build script imports, is not.
 * Everything else is decided by path alone.
 *
 * A path is compared as the repository writes it, with any leading `./` taken
 * off, since a comparison against a path prefix would otherwise miss the first
 * file of a directory.
 */
export function shipsInTheApp(file, appFiles = new Set()) {
  const path = String(file ?? "").replace(/^\.\//, "");
  if (path.length === 0) return false;
  if (path.startsWith("src/")) return appFiles.has(path);
  return APP_PATHS.some((entry) =>
    entry.endsWith("/") ? path.startsWith(entry) : path === entry
  );
}

/**
 * The files of a comparison that would change the installed application.
 *
 * GitHub answers with a file per entry, or with the file name alone depending on
 * the endpoint, so both shapes are read. Duplicates are folded and the answer is
 * sorted, because a comparison lists a file once per commit that touched it and
 * the message is easier to read without the repetition.
 */
export function shippingChanges(files = [], appFiles = new Set()) {
  const names = (Array.isArray(files) ? files : [])
    .map((file) => (typeof file === "string" ? file : file?.filename))
    .filter((name) => typeof name === "string" && name.length > 0);

  return [...new Set(names)].filter((name) => shipsInTheApp(name, appFiles)).sort();
}

/**
 * What the release means for a site that has moved on.
 *
 * `aheadBy` is how many commits `main` carries after the tag, as GitHub counts
 * them, and `files` the files those commits touched. `appFiles` is the set of
 * modules the application reaches, so that a file under `src/` counts only when
 * the build would really carry it. The answer says whether anything that ships
 * changed, which files, and how far the branch has moved: the three things a
 * message needs to be actionable rather than alarming.
 *
 * A release with nothing after it is not drift, and neither is a branch that has
 * moved only over files the application does not contain. Those two are said
 * apart, because "up to date" and "ahead, but nothing that ships" are different
 * states of the repository and only one of them is a reason to cut a version.
 */
export function driftOf({ version = "", tag = "", aheadBy = 0, files = [], appFiles = new Set() } = {}) {
  const changed = shippingChanges(files, appFiles);
  const commits = Number.isFinite(aheadBy) && aheadBy > 0 ? Math.trunc(aheadBy) : 0;

  return {
    version,
    tag,
    aheadBy: commits,
    files: changed,
    drifting: changed.length > 0,
  };
}

/**
 * What the check concluded, as the JSON it leaves for the announcing step.
 *
 * @typedef {object} DriftReport
 * @property {string} [repo]     The repository it asked about.
 * @property {string} [branch]   The branch it compared the release with.
 * @property {string} [outcome]  What it found: `in-sync`, `ahead-quiet`, `behind`, `no-download`, `no-release`, `unreadable` or `bad-tag`.
 * @property {string} [release]  The tag of the release it read.
 * @property {string} [version]  The version that tag names.
 * @property {string} [asset]    The APK the release should carry.
 * @property {number} [aheadBy]  How many commits the branch carries after the tag.
 * @property {string[]} [files]  The files that ship and the release does not have.
 * @property {string[]} [listed] The assets the release carries, when the APK is missing.
 * @property {string} [detail]   Why a check that could not answer could not.
 */

/**
 * The title of the issue the daily check opens, and how it is found again.
 *
 * A repository gives an issue no field of its own to mark it with, so the title
 * is the mark, written once here and looked for exactly. An issue whose title is
 * not this one is never touched, whoever opened it and for whatever reason.
 */
export const DRIFT_ISSUE_TITLE = "The downloadable Android app is older than the site";

/** How many files of a long list are written into the issue before it is cut. */
const FILES_IN_THE_ISSUE = 50;

/**
 * What an open issue should say, written for the person who has to act on it.
 *
 * It names the release, the branch, and the files the installed application is
 * built from that the release does not have, and then says what to do about
 * them. It is a body rather than a log because it is read once, by somebody who
 * wants to know whether the thing is really behind and by how much: the list is
 * cut after a point, since a wall of paths is an issue nobody finishes, and the
 * count stays whole even then.
 *
 * @param {DriftReport} [report] What the check concluded.
 * @returns {string} The body of the issue, or of the comment that keeps it level.
 */
export function issueBody(report = {}) {
  const release = String(report.release ?? "").trim() || "the last release";
  const branch = String(report.branch ?? "").trim() || "main";
  const files = Array.isArray(report.files) ? report.files : [];

  const lines = [
    `The site is published on every push to \`${branch}\`, and the Android app only when a`,
    "version tag is pushed, because it has to be signed and attached to a release. So the site",
    "can carry changes the downloadable app does not have.",
    "",
  ];

  if (report.outcome === "no-download") {
    const asset = String(report.asset ?? "").trim() || "the APK";
    lines.push(
      `The release \`${release}\` does not carry \`${asset}\`, which is the file the Android`,
      "screen offers as the download, so there is nothing to install from it at all.",
      "",
      "Publish the release again with its APK attached, and the next daily run closes this issue."
    );
    return `${lines.join("\n")}\n`;
  }

  const shown = files.slice(0, FILES_IN_THE_ISSUE).map((file) => `- \`${file}\``);
  if (files.length > FILES_IN_THE_ISSUE) {
    shown.push(`- and ${files.length - FILES_IN_THE_ISSUE} more`);
  }

  lines.push(
    `The daily check found ${files.length} file(s) the installed application is built from that`,
    `\`${branch}\` carries and the release \`${release}\` does not:`,
    "",
    ...shown,
    "",
    "Whoever installs the Android app from the site gets the older game. Push a version tag to",
    "publish what the site already has, and the next daily run closes this issue by itself."
  );
  return `${lines.join("\n")}\n`;
}

/**
 * The line left on the issue when the daily check no longer sees a difference.
 *
 * The two quiet verdicts are told apart, because a reader of the closed issue
 * should be able to tell a version that caught up from a branch that never
 * needed one.
 *
 * @param {DriftReport} [report] What the check concluded.
 * @returns {string} The line left on the issue as it is closed.
 */
export function closeComment(report = {}) {
  const release = String(report.release ?? "").trim();
  const named = release ? `\`${release}\`` : "The release";
  const said =
    report.outcome === "in-sync"
      ? `${named} is the commit the site is published from.`
      : `${named} is behind the branch, but only over files the app is not built from.`;

  return (
    `${said}\n\n` +
    "The daily check no longer sees anything the downloadable app is missing, so this\n" +
    "closes by itself.\n"
  );
}

/**
 * What to do with the issue, from the report and the issues already open.
 *
 * The two alarming verdicts open the issue, or keep the one already open in step
 * with the check. The two quiet ones close it, since there is nothing left to
 * act on. Everything else leaves it alone: a report that could not be read, or a
 * repository with no release at all, is not an answer, and a question that was
 * never answered is no reason to take down the alarm that is already up.
 *
 * @param {{ report?: DriftReport, issues?: Array<{ number?: number, title?: string }> }} [options]
 *   What the check concluded, and the issues already open.
 * @returns {{ action: string, number: number, title: string, body: string }} What to do about it.
 */
export function issueDecision({ report = {}, issues = [] } = {}) {
  const open = (Array.isArray(issues) ? issues : []).find(
    (issue) => issue !== null && typeof issue === "object" && issue.title === DRIFT_ISSUE_TITLE
  );
  const number = open ? Number(open.number) : 0;
  const outcome = String(report.outcome ?? "");

  if (outcome === "behind" || outcome === "no-download") {
    return {
      action: open ? "update" : "open",
      number,
      title: DRIFT_ISSUE_TITLE,
      body: issueBody(report),
    };
  }

  if ((outcome === "in-sync" || outcome === "ahead-quiet") && open) {
    return { action: "close", number, title: DRIFT_ISSUE_TITLE, body: closeComment(report) };
  }

  return { action: "nothing", number: 0, title: DRIFT_ISSUE_TITLE, body: "" };
}

/**
 * The name of the APK a release of this version carries.
 *
 * The workflow renames the file Gradle writes before uploading it, and the
 * Android screen downloads whatever the release lists, so the two have to agree
 * on the name: it is built here, and the test that reads the workflow holds the
 * two together.
 */
export function apkNameFor(version) {
  return `africa-history-quest-${String(version).trim()}.apk`;
}
