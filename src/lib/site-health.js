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
 * - the link preview, which is a PNG and not a page.
 *
 * The last three matter more than they look. A static host answers a path it
 * does not have with the single page application's own HTML, so a missing file
 * comes back with the right status and the wrong content, and only reading what
 * arrived tells the two apart.
 *
 * Plain module: no network, no disk. The script hands in what it received and
 * this decides what it means; the tests hand in the answers they mean to be
 * wrong.
 */

/** How long to wait for one address before calling the site unreachable. */
export const TIMEOUT_MS = 15000;

/** How many addresses are asked at once. Four of them, so it is a detail. */
export const CONCURRENCY = 4;

/** Between two requests, so a daily check is never a small flood. */
export const SPACING_MS = 250;

/** What the site is made of, in the order a reader meets it. */
export const SITE_FILES = [
  { path: "", kind: "page", what: "the application itself" },
  { path: "robots.txt", kind: "robots", what: "the crawler file" },
  { path: "sitemap.xml", kind: "sitemap", what: "the list of addresses" },
  { path: "social-preview.png", kind: "picture", what: "the link preview" },
];

/** One address of the site, from the address the site is served at. */
export function addressOf(origin, path) {
  const root = String(origin).replace(/\/+$/, "");
  return path === "" ? `${root}/` : `${root}/${path}`;
}

const PNG_SIGNATURE = "\u0089PNG\r\n\u001a\n";

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
  if (kind === "page") return text.includes('<div id="root">') && text.includes("<title>Africa History Quest</title>");
  if (kind === "robots") return /^User-agent: \*/m.test(text) && /^Sitemap: https?:\/\//m.test(text);
  if (kind === "sitemap") return /<urlset[\s>]/.test(text) && /<loc>https?:\/\//.test(text);
  if (kind === "picture") return text.startsWith(PNG_SIGNATURE);
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
  if (status === 404 || status === 410) return "missing";
  if (status < 200 || status >= 300) return "refused";
  return looksLike(kind, body) ? "healthy" : "wrong";
}

/** Whether that answer is worth waking somebody up for. */
export function verdictIsAlarming(verdict) {
  return verdict !== "healthy";
}

/** The line the check prints for one address, and the whole of what it says. */
export function verdictLine(entry, verdict) {
  const where = entry.path === "" ? "/" : `/${entry.path}`;
  const said = {
    healthy: "answers, and it is what it should be",
    missing: "is not there",
    refused: "answered with a refusal",
    unreachable: "could not be reached at all",
    wrong: "answered with something that is not it",
  }[verdict];
  return `${where} (${entry.what}) ${said}`;
}
