/**
 * The Android release of this game, and how a reader gets it.
 *
 * The game itself makes no request after it has loaded its own files, and that
 * is the promise the whole application is built on. This module is the one
 * deliberate exception, and it is deliberately kept in one place: the screen
 * that offers the Android app asks GitHub what the newest release is, once,
 * when the reader opens it. Nothing calls it at load, and nothing else in the
 * application talks to another machine.
 *
 * What the answer is worth is the version and the address of the APK. Neither
 * is trusted beyond its shape: the tag has to look like a version this project
 * really tags (the same three numbers scripts/android-version.mjs accepts), and
 * an answer that does not is read as no answer at all. So a GitHub outage, a
 * rate limit, a device with no network or a page whose shape has changed all end
 * the same way: the screen falls back to the release page, which is the one
 * address GitHub always resolves to the newest release and which no answer here
 * is needed for.
 *
 * The addresses are derived from `ANDROID_REPO` rather than written twice, so
 * the page a reader is sent to and the project this repository belongs to cannot
 * drift apart.
 *
 * Plain module: the parser is a function of the answer and touches nothing, and
 * the request is handed its own `fetch`, which is what lets the tests drive the
 * whole thing without a network.
 */

/** The repository this game is published from, owner and name. */
export const ANDROID_REPO = "kontagafamakan98-rgb/africaquest";

/**
 * Where a download button sends a reader.
 *
 * `/releases/latest` is resolved by GitHub to the newest release, so this
 * address is the one thing on the screen that is right even when the request
 * below never answers.
 */
export const RELEASES_PAGE = `https://github.com/${ANDROID_REPO}/releases/latest`;

/** The release answer the version is read from, on demand. */
export const LATEST_RELEASE_API = `https://api.github.com/repos/${ANDROID_REPO}/releases/latest`;

/** How long the request is given before the screen falls back. */
export const RELEASE_TIMEOUT_MS = 8000;

/**
 * The version a release answer names, and the APK it carries, or nothing.
 *
 * A tag that is not three numbers is not a version this project tags, so it is
 * refused rather than printed: `version-1.0.0` and `1.0.0-rc.1` are tags nobody
 * here makes, and reading one as a version would put a name on the screen that
 * no installed app reports. The first `.apk` asset is the application, which is
 * the file the workflow attaches under a name it chooses.
 */
export function releaseFrom(answer) {
  if (!answer || typeof answer !== "object") return null;

  const tag = typeof answer.tag_name === "string" ? answer.tag_name.trim() : "";
  const version = tag.replace(/^v/i, "").trim();
  if (!/^\d+\.\d+\.\d+$/.test(version)) return null;

  const assets = Array.isArray(answer.assets) ? answer.assets : [];
  const apk = assets.find(
    (asset) =>
      asset &&
      typeof asset === "object" &&
      typeof asset.browser_download_url === "string" &&
      /^https:\/\//i.test(asset.browser_download_url) &&
      (typeof asset.name !== "string" || /\.apk$/i.test(asset.name))
  );

  return {
    version,
    page: RELEASES_PAGE,
    // Kept as the release page until an asset really names an https file, so a
    // click always lands on something GitHub serves rather than on nothing.
    download: apk ? apk.browser_download_url : RELEASES_PAGE,
  };
}

/**
 * The newest release, as GitHub answers for it, or nothing.
 *
 * It never rejects: a refused request, a timeout, a rate limit and an answer
 * that is not a release are all the same outcome for the caller, which is a
 * screen that offers the release page and says nothing about a version. The
 * `fetch` is an argument so a test can drive the three outcomes without a
 * network, and it defaults to the one the browser has.
 */
export async function latestAndroidRelease({
  fetchImpl = typeof fetch === "function" ? fetch : null,
  signal = undefined,
} = {}) {
  if (typeof fetchImpl !== "function") return null;
  try {
    const response = await fetchImpl(LATEST_RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
    if (!response || !response.ok) return null;
    return releaseFrom(await response.json());
  } catch {
    // Offline, aborted or malformed: the release page is the answer either way.
    return null;
  }
}
