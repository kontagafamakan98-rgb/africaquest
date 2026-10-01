/**
 * Whether the published site is still there, and still itself.
 *
 * The application has no server of its own to watch: it is a folder of files
 * served by GitHub Pages, and the way it fails is quiet. A repository whose
 * Pages setting is turned off, a deployment that stopped half way, a build that
 * published an empty directory: in all three the address answers, and what it
 * answers with is not the application. So a check that only asked "does it
 * reply?" would be the wrong check, and the one below asks for the four files
 * that say what the site is:
 *
 * - the page itself, which has to carry the application's own root element;
 * - `robots.txt`, which the build writes;
 * - `sitemap.xml`, which the build writes and which lists the addresses;
 * - the link preview, which is a PNG and not a page;
 * - `404.html`, which is what answers a deep link;
 * - the service worker, which names every file the application installs;
 * - a photograph of a level, the first picture a reader is ever shown;
 * - a page opened by its own address, which is how a link to the privacy
 *   notice is shared and how a reader comes back to a level.
 *
 * The last four are the ones that were missing, and the gallery of photographs
 * being empty on the published site is what showed it. Every one of those files
 * was addressed under the path the site is served from, every one of them had
 * been written by a script that runs with no such path, and no check looked at a
 * single one of them: the four files above are all served from the root of the
 * site, where a path cannot be wrong. What a check has to read is the files that
 * move when the site moves.
 *
 * A static host answers a path it does not have with the single page
 * application's own HTML, so a missing file comes back with the right status and
 * the wrong content, and only reading what arrived tells the two apart. A deep
 * link is that same answer on purpose: Pages serves 404.html with the status
 * 404, which is the site working rather than failing, and the verdict for a deep
 * link says so.
 *
 * Plain module: no network, no disk. The script hands in what it received and
 * this decides what it means; the tests hand in the answers they mean to be
 * wrong.
 */

import { LEVEL_PHOTOS } from "./level-images.js";
import { webpPath } from "./photo-formats.js";

/** The first photograph of the game, as the browser asks for it: the picture the
 * map draws on its first card, and the one a reader is shown before any other.
 * Read from the photograph table rather than written here, so a picture replaced
 * is a picture this check follows. */
export const FIRST_PHOTO = webpPath(LEVEL_PHOTOS[0].file).replace(/^\/+/, "");

/** How long to wait for one address before calling the site unreachable. */
export const TIMEOUT_MS = 15000;

/** How many addresses are asked at once. Four of them, so it is a detail. */
export const CONCURRENCY = 4;

/** Between two requests, so a daily check is never a small flood. */
export const SPACING_MS = 250;

/**
 * How many times the whole site is read before a total absence is believed.
 *
 * One read is the reading; the ones after it are the waiting. Three of them,
 * with the wait below, come to a window of a minute and a half: longer than a
 * GitHub Pages deployment takes to be published, and short enough that a site
 * that is really gone is still reported in the same run.
 */
export const SETTLE_ATTEMPTS = 3;

/**
 * How long to wait between two of those reads.
 *
 * A deployment in flight is a state that passes on its own, and the whole point
 * of reading again is to let it. A minute is more than the minute or so a
 * publication takes, and it is spent only when nothing answered at all.
 */
export const SETTLE_WAIT_MS = 45000;

/** What the site is made of, in the order a reader meets it. */
export const SITE_FILES = [
  { path: "", kind: "page", what: "the application itself" },
  { path: "robots.txt", kind: "robots", what: "the crawler file" },
  { path: "sitemap.xml", kind: "sitemap", what: "the list of addresses" },
  { path: "social-preview.png", kind: "picture", what: "the link preview" },
  { path: "404.html", kind: "page", what: "the page a deep link is answered with" },
  { path: "sw.js", kind: "worker", what: "the offline worker" },
  { path: FIRST_PHOTO, kind: "photo", what: "a photograph of a level" },
  { path: "PrivacyPolicy", kind: "deeplink", what: "a page opened by its own address" },
];

/**
 * The scripts the worker installs, the ones worth asking for by name.
 *
 * The worker names every file the application precaches, hashed names included,
 * which is the only place in the published site where a built asset can be
 * found by a checker: `index-4f2a1c.js` is not a name anybody can write down
 * here. Three of them are enough to say whether the assets are where the worker
 * says they are: the entry, the first level and the last. A site published under
 * a path it does not answer on fails all three at once, which is the fault this
 * looks for; a single chunk that failed to publish is a worker that does not
 * install, and no fetch of one file can see that.
 *
 * @param {string[]} urls what the worker said it installs
 * @returns {{path: string, what: string}[]} the two or three to ask for
 */
export function chosenScripts(urls) {
  const scripts = urls.filter((url) => typeof url === "string" && /\.js$/.test(url));
  // A level chunk is written `level-09.js` in the source and published as
  // `level-09-DY2Tac4I.js`: the hash is not decoration, it is what makes the
  // file cacheable for ever, so the name is read with it and not without.
  const level = (name) => /\/level-\d+(?:-[A-Za-z0-9_-]+)?\.js$/.test(name);
  const levels = scripts.filter(level).sort();
  // The entry is the chunk the page loads first, `index-<hash>.js`. A worker
  // that installs no entry has nothing to start from, and the first script of
  // the list is then the answer, whatever it is.
  const entry = scripts.find((url) => /\/index-[^/]*\.js$/.test(url)) || scripts.find((url) => !level(url));

  // The addresses the worker holds are written from the root of the host, the
  // path of the site included: they are the addresses a browser caches, and the
  // worker that installs them runs at that root. So they are marked as absolute
  // rather than joined to the site's path a second time, which is exactly what
  // the first version of this did, and every asset came back as a 404 under
  // /africaquest/africaquest/assets/.
  // `kind` travels with each address, the way it travels with the files of the
  // site: the verdict reads the answer and not the request, so an address
  // carrying no kind is a file recognised by nothing, and every asset came back
  // as a fault of its own the first time this ran.
  const wanted = [];
  if (entry) {
    wanted.push({ path: entry, what: "the script the application starts with", kind: "script", absolute: true });
  }
  if (levels.length > 0) {
    wanted.push({ path: levels[0], what: "the first level of the game", kind: "script", absolute: true });
    if (levels.length > 1) {
      wanted.push({
        path: levels[levels.length - 1],
        what: "the last level of the game",
        kind: "script",
        absolute: true,
      });
    }
  }
  return wanted;
}

/** One address of the site, from the address the site is served at. */
export function addressOf(origin, path) {
  const root = String(origin).replace(/\/+$/, "");
  return path === "" ? `${root}/` : `${root}/${path}`;
}

/**
 * One address of the host, from the root of the domain.
 *
 * The files the worker installs are named that way: `/africaquest/assets/...`
 * on a project site, `/assets/...` on a site served from the root. They are the
 * addresses a browser stores, so they are the addresses a check has to ask for,
 * and joining them to the site's own path asks for a directory inside a
 * directory. Only the paths the worker gave are read this way; everything else
 * is a path of the site.
 */
export function hostAddressOf(origin, path) {
  const root = new URL(String(origin)).origin;
  return new URL(String(path), `${root}/`).href;
}

const PNG_SIGNATURE = "\u0089PNG\r\n\u001a\n";

/** The first twelve bytes of a WebP, read one byte to one character. */
function looksLikeWebp(text) {
  return text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
}

/**
 * What the worker said it installs.
 *
 * The build writes the list it precaches as a JavaScript array of addresses, and
 * that array is a document like any other: read as text, cut out and parsed,
 * which is exact where a regular expression over minified code would be a guess.
 * An answer that is not the worker, or a worker with no list in it, comes back
 * empty rather than as a fault of its own: the file itself has already been
 * judged by `looksLike`.
 */
export function precachedFrom(body) {
  const text = typeof body === "string" ? body : "";
  const start = text.indexOf("const SHELL = [");
  if (start < 0) return [];
  const open = text.indexOf("[", start);
  const close = text.indexOf("]", open);
  if (close < 0) return [];
  try {
    const urls = JSON.parse(text.slice(open, close + 1));
    return Array.isArray(urls) ? urls.filter((url) => typeof url === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Whether what arrived is what that address is supposed to be.
 *
 * Each file is recognised by something it cannot be without - the root element
 * the application is mounted on, the crawler file's first directive, the sitemap
 * element, the PNG signature - rather than by its size, which a wrong file can
 * also have.
 */
export function looksLike(kind, body) {
  const text = typeof body === "string" ? body : "";
  // A page and a deep link are the same file, answered twice: one from the site
  // and one from 404.html, which is why they are recognised the same way.
  if (kind === "page" || kind === "deeplink") {
    return text.includes('<div id="root">') && text.includes("<title>Africa History Quest</title>");
  }
  if (kind === "robots") return /^User-agent: \*/m.test(text) && /^Sitemap: https?:\/\//m.test(text);
  if (kind === "sitemap") return /<urlset[\s>]/.test(text) && /<loc>https?:\/\//.test(text);
  if (kind === "picture") return text.startsWith(PNG_SIGNATURE);
  if (kind === "photo") return looksLikeWebp(text);
  if (kind === "worker") return text.includes("Generated by build/offline-plugin.js") && precachedFrom(text).length > 0;
  // A built chunk is a module of JavaScript. What it must not be is the
  // application's own page, which is what a host answers with for an asset it
  // does not have: a file that carries the root element is the page, whatever
  // it was asked for as.
  if (kind === "script") {
    return text.length > 0 && !text.includes('<div id="root">') && /\b(export|import|function|const|let)\b/.test(text);
  }
  return false;
}

/**
 * What one answer means.
 *
 * Five answers, and they are not the same failure. `unreachable` is a name that
 * does not resolve, a connection the network drops, or a wait longer than the
 * timeout: nothing can be said about the site from there. `refused` is a status
 * that is neither a success nor a "not here", which on this host is usually a
 * deployment that is still being published. `missing` is the file not being
 * there. `wrong` is the site answering with something that is not what was
 * asked for, which is how a half-published site looks. Only `healthy` is the
 * site being up.
 *
 * @param {{ kind?: string, status?: number, body?: string, error?: string|null }} [answer]
 *   What was asked for, and what came back: the status of the answer, its body
 *   when there was one, and the message of the rejection when there was none.
 * @returns {"unreachable"|"missing"|"refused"|"wrong"|"healthy"}
 */
export function verdictOf({ kind, status = 0, body = "", error = null } = {}) {
  // A rejection, or an answer with no status at all: either way nothing came
  // back, which is not the same as something being refused.
  if (error || status <= 0) return "unreachable";
  // A deep link is answered by 404.html with the status 404, on purpose: the
  // page is there and it is the application, which is exactly what a reader
  // opening a shared link expects. Reading that as a missing file would fail
  // every run on a site that is working.
  if ((status === 404 || status === 410) && kind === "deeplink" && looksLike(kind, body)) return "healthy";
  if (status === 404 || status === 410) return "missing";
  if (status < 200 || status >= 300) return "refused";
  return looksLike(kind, body) ? "healthy" : "wrong";
}

/** Whether that answer is worth waking somebody up for. */
export function verdictIsAlarming(verdict) {
  return verdict !== "healthy";
}

/**
 * The three ways an address can say that the file is not there at all.
 *
 * They are held apart from `wrong`, which says that something did arrive and it
 * is not what it should be. A site that is merely not published yet answers
 * nothing, and a site that is published and broken answers with the wrong
 * content: only the first of the two is a state worth waiting out.
 */
const ABSENT = new Set(["missing", "refused", "unreachable"]);

/**
 * Whether what came back looks like a deployment that has not finished.
 *
 * A deployment in flight and a site that is gone are told apart by time rather
 * than by an answer: Pages serves a 404 for every address until the new
 * deployment is published, which is exactly what a repository whose Pages
 * setting is off says too. So when not one address came back at all, the check
 * reads the site again before it believes what it found. When even one address
 * is the application itself, the site is published, and everything else that is
 * missing or wrong is a fault of the deployment that put it there - which is the
 * failure this check exists for, and not one to wait out.
 *
 * @param {{ kind?: string, status?: number, body?: string, error?: string|null }[]} answers
 *   One answer per address that was asked for.
 * @returns {boolean} whether the whole site is absent rather than broken
 */
export function inFlight(answers) {
  if (!Array.isArray(answers) || answers.length === 0) return false;
  return answers.every((answer) => ABSENT.has(verdictOf(answer)));
}

/** The line the check prints for one address, and the whole of what it says. */
export function verdictLine(entry, verdict) {
  // A path of the site is printed with the slash that makes it one; a path the
  // worker gave already carries it, and one slash is enough.
  const written = String(entry.path ?? "");
  const where = written === "" ? "/" : written.startsWith("/") ? written : `/${written}`;
  const said = {
    healthy: "answers, and it is what it should be",
    missing: "is not there",
    refused: "answered with a refusal",
    unreachable: "could not be reached at all",
    wrong: "answered with something that is not it",
  }[verdict];
  return `${where} (${entry.what}) ${said}`;
}
