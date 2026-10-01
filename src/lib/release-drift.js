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
 * That is the failure this module decides, and the decision is made from the
 * commits rather than from a version number: what matters is not that `main` has
 * moved, it is that it moved over something the APK is built from. A README
 * paragraph, a workflow, a note about signing: none of them changes what is
 * inside the APK, and a check that failed on them would be a check people learn
 * to ignore. A screen, a lesson, a photograph, the Android project itself: each
 * of them does.
 *
 * Plain module: no network, no disk, and no imports. What a list of changed
 * files means is decided here; fetching that list is the script's job.
 */

/**
 * What the APK is built from, as paths in the repository.
 *
 * A directory entry ends with a slash and matches everything under it. The list
 * is deliberately about the built application and not about the repository: the
 * Android project is here because the wrapper itself is part of what a device
 * installs, and the configuration files are here because they decide how the
 * application is assembled.
 *
 * `scripts/` is deliberately absent. Those programs run during the build, but
 * what they write is committed: the level modules under `src/`, the icons under
 * `public/` and `android/`. A change to a generator therefore shows up here as
 * the change it produced, and a change to one that produces nothing different
 * ships nothing different.
 */
export const APP_PATHS = [
  "src/",
  "public/",
  "android/",
  "build/",
  "index.html",
  "capacitor.config.json",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "tailwind.config.js",
  "postcss.config.js",
];

/**
 * Whether one file is part of what the installed application is made of.
 *
 * A path is compared as the repository writes it, with any leading `./` taken
 * off, since a comparison against a path prefix would otherwise miss the first
 * file of a directory.
 */
export function shipsInTheApp(file) {
  const path = String(file ?? "").replace(/^\.\//, "");
  if (path.length === 0) return false;
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
export function shippingChanges(files = []) {
  const names = (Array.isArray(files) ? files : [])
    .map((file) => (typeof file === "string" ? file : file?.filename))
    .filter((name) => typeof name === "string" && name.length > 0);

  return [...new Set(names)].filter(shipsInTheApp).sort();
}

/**
 * What the latest release means for a site that has moved on.
 *
 * `aheadBy` is how many commits `main` carries after the tag, as GitHub counts
 * them, and `files` the files those commits touched. The answer says whether
 * anything that ships changed, which files, and how far the branch has moved:
 * the three things a message needs to be actionable rather than alarming.
 *
 * A release with nothing after it is not drift, and neither is a branch that has
 * moved only over files the application does not contain. Those two are said
 * apart, because "up to date" and "ahead, but nothing that ships" are different
 * states of the repository and only one of them is a reason to cut a version.
 */
export function driftOf({ version = "", tag = "", aheadBy = 0, files = [] } = {}) {
  const changed = shippingChanges(files);
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