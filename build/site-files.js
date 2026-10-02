/**
 * The files a crawler and a link preview read before the application runs.
 *
 * The application is one page, and everything a reader meets inside it is drawn
 * by the code: a search engine sees the shell and a chat shows whatever the
 * shell says about itself. Three small files therefore carry that whole story,
 * and all three need the same thing the shell does not know: the address the
 * site is finally served from.
 *
 * That address is passed in at build time (`SITE_ORIGIN`), which the Pages
 * workflow fills from the address GitHub answers for the repository. Everything
 * else here is derived: the addresses in the sitemap are the pages that exist in
 * src/pages, the preview picture is the file the favicon draws, and nothing is
 * written down twice for the two to drift apart.
 *
 * Plain module: the plugin, the tests and the check all read the same functions,
 * and none of them touches the file system except where it says so.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/** The crawler file every host serves from the root of the site. */
export const ROBOTS_FILE = "robots.txt";

/** The list of the site's addresses, which is what a sitemap is. */
export const SITEMAP_FILE = "sitemap.xml";

/** The variable the deployment fills in with the address the site lives at. */
export const SITE_ORIGIN_VARIABLE = "SITE_ORIGIN";

/**
 * Where this application is published when nobody says otherwise.
 *
 * A project site on GitHub Pages is served under the name of the repository,
 * which is where this one is published from: without it a local build would
 * write addresses pointing at nothing, and a sitemap full of guesses is worse
 * than no sitemap.
 */
export const DEFAULT_SITE_ORIGIN = "https://kontagafamakan98-rgb.github.io/africaquest";

/**
 * The line index.html carries in place of the tags that need an absolute
 * address. A build replaces it; the file on its own is still valid HTML.
 */
export const PREVIEW_MARKER = "<!--site-preview-->";

/** The social card, named here because two files have to agree on it. */
export const PREVIEW_FILE = "social-preview.png";

/**
 * What the built page is allowed to load.
 *
 * GitHub Pages serves files and cannot be told to send a header, so a policy can
 * only travel inside the page, as the meta tag a browser reads before it loads
 * anything else. It is written by the build rather than kept in index.html
 * because the development server is not what it protects: Vite injects the React
 * refresh preamble as an inline script while developing, and a policy strict
 * enough to be worth having would block exactly that, and nothing in production.
 *
 * The application loads nothing from anywhere but its own origin - no font, no
 * script, no picture - so the policy is `'self'` and little more. Two allowances
 * it cannot drop:
 *
 * - an inline style, because React writes the reading position of the notch area
 *   and a few measuring styles as attributes, and a style attribute is governed
 *   by `style-src` like any other style. `script-src` deliberately does not carry
 *   that allowance: the built page has no inline script in it, and saying so is
 *   the whole point of writing this down.
 *
 * - one address outside the site, which is the one call the application ever
 *   makes: the page that installs the Android app asks GitHub for the newest
 *   release, so that it can say which version is downloadable and where. The
 *   first policy this file carried named no address at all, and the effect was
 *   that screen quietly losing its answer and saying the version could not be
 *   read - a fault no test could see, since nothing in the build makes that call.
 *   It is written here as the address a reader is sent to rather than as a
 *   wildcard, and `connect-src` is the only directive that has to carry it.
 */
export const CSP_META = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.github.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "form-action 'self'",
].join("; ");

/** The meta tag that carries the policy, as the browser reads it. */
export function cspTag() {
  return `<meta http-equiv="Content-Security-Policy" content="${CSP_META}" />`;
}

/** The address the site is served from, without a trailing slash. */
export function siteOrigin(environment = process.env) {
  const given = typeof environment?.[SITE_ORIGIN_VARIABLE] === "string"
    ? environment[SITE_ORIGIN_VARIABLE].trim()
    : "";
  const value = given || DEFAULT_SITE_ORIGIN;
  if (!/^https:\/\/[^/]+/i.test(value)) {
    throw new Error(
      `site-files: ${SITE_ORIGIN_VARIABLE}="${value}" is not an https address; ` +
        "a sitemap and a preview picture have to be fetchable by a crawler"
    );
  }
  return value.replace(/\/+$/, "");
}

/**
 * The addresses of the application, in the order a reader meets them.
 *
 * Read from the pages folder and from the one line of pages.config.js that names
 * the landing page, so a page added tomorrow appears in the sitemap without
 * anybody remembering this file exists. The landing page is listed first,
 * because that is the one worth reading first.
 */
export function routePaths(root = process.cwd()) {
  const written = readFileSync(path.join(root, "src", "pages.config.js"), "utf8");
  // The file opens with a commented example of itself, whose landing page is a
  // page this application does not have. Comments are therefore dropped before
  // anything is read: what names the landing page is a line of code, and the
  // example is not one.
  const code = written
    .split("\n")
    .filter((line) => !/^\s*(\*|\/\/|\/\*)/.test(line))
    .join("\n");
  const main = /^\s*mainPage:\s*"([^"]+)"/m.exec(code)?.[1] ?? null;

  const names = readdirSync(path.join(root, "src", "pages"))
    .filter((file) => file.endsWith(".jsx"))
    .map((file) => file.replace(/\.jsx$/, ""));

  if (names.length === 0) throw new Error("site-files: src/pages holds no page at all");
  if (main && !names.includes(main)) {
    throw new Error(`site-files: the landing page "${main}" is not one of the pages`);
  }

  const landing = main && names.includes(main) ? [main] : [];
  const rest = names.filter((name) => !landing.includes(name)).sort();
  return [...landing, ...rest].map((name) => (name === main ? "/" : `/${name}`));
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[character];
  });
}

/**
 * The sitemap: one entry per address, all of them absolute.
 *
 * `lastmod` is the day of the build rather than a date written by hand, which
 * would be a claim about the content that nobody keeps up to date.
 */
export function sitemapXml({ siteRoot, routes, lastmod }) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("site-files: a sitemap with no address in it says nothing");
  }
  if (typeof lastmod !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
    throw new Error(`site-files: lastmod "${lastmod}" is not a day`);
  }

  const entries = routes.map((route) => {
    const address = route === "/" ? `${siteRoot}/` : `${siteRoot}${route}`;
    return [
      "  <url>",
      `    <loc>${escapeXml(address)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "  </url>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * The crawler file. Everything is public here, and the only thing it really says
 * is where the sitemap is: a robot that reads it does not have to guess.
 */
export function robotsTxt({ siteRoot }) {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteRoot}/${SITEMAP_FILE}`,
    "",
  ].join("\n");
}

/**
 * What a link to the application shows in a chat, a feed or a search result.
 *
 * The addresses are absolute because a crawler reads this file without running
 * the application, and it has no idea what it was served under. The description
 * is the one the page already carries, so the two cannot say different things.
 */
export function previewTags({ siteRoot, description }) {
  if (typeof description !== "string" || description.trim() === "") {
    throw new Error("site-files: the link preview would have nothing to say");
  }

  return [
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${escapeXml(`${siteRoot}/`)}" />`,
    `<meta property="og:image" content="${escapeXml(`${siteRoot}/${PREVIEW_FILE}`)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join("\n    ");
}

/** Vite plugin: the crawler files, and the absolute addresses in the page. */
export function siteFiles({ root = process.cwd(), environment = process.env } = {}) {
  let projectRoot = root;
  let building = false;
  let siteRoot = DEFAULT_SITE_ORIGIN;

  return {
    name: "africa-quest-site-files",
    apply: "build",
    configResolved(config) {
      projectRoot = config.root;
      building = config.command === "build";
      // An address a crawler would not fetch stops the build here, where
      // somebody is watching, rather than being published in three files that
      // then lead every reader to a page that does not exist.
      siteRoot = siteOrigin(environment);
    },
    transformIndexHtml(html) {
      const description = /<meta\s+name="description"\s+content="([^"]*)"/.exec(html)?.[1] ?? "";
      const tags = previewTags({ siteRoot, description });
      // The policy is the first thing in the head, before the tags the build
      // adds and before anything the page could load: a browser reads a policy
      // where it stands, and what it has already fetched is not covered by it.
      return html
        .replace(/<head>/i, `<head>\n    ${cspTag()}`)
        .replace(PREVIEW_MARKER, tags);
    },
    generateBundle() {
      if (!building) return;
      const routes = routePaths(projectRoot);
      const lastmod = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: "asset", fileName: ROBOTS_FILE, source: robotsTxt({ siteRoot }) });
      this.emitFile({
        type: "asset",
        fileName: SITEMAP_FILE,
        source: sitemapXml({ siteRoot, routes, lastmod }),
      });
    },
  };
}
