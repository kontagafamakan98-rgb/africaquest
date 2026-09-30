import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  DEFAULT_SITE_ORIGIN,
  PREVIEW_FILE,
  PREVIEW_MARKER,
  ROBOTS_FILE,
  SITEMAP_FILE,
  SITE_ORIGIN_VARIABLE,
  previewTags,
  robotsTxt,
  routePaths,
  siteFiles,
  siteOrigin,
  sitemapXml,
} from "../../build/site-files.js";

// What a crawler and a link preview read.
//
// None of them runs the application, so none of them can be told anything by the
// code: three small files carry the whole story, and the address they need is
// not known until the site is deployed. These tests hold the two ends of that:
// the addresses are the pages that exist, and the address they are written under
// is the one the deployment hands in.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");
const siteRoot = "https://example.org/quest";

test("the sitemap lists the addresses of the pages that exist, and no other", () => {
  const routes = routePaths(ROOT);
  const pages = readdirSync(path.join(ROOT, "src", "pages"))
    .filter((file) => file.endsWith(".jsx"))
    .map((file) => `/${file.replace(/\.jsx$/, "")}`);

  assert.equal(routes[0], "/", "the landing page is listed first");
  assert.equal(routes.length, pages.length, `${routes.length} addresses for ${pages.length} pages`);
  for (const page of pages) {
    if (page === "/Home") continue;
    assert.ok(routes.includes(page), `${page} is a page and is in the sitemap`);
  }

  const sitemap = sitemapXml({ siteRoot, routes, lastmod: "2026-09-29" });
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  const addresses = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    addresses,
    routes.map((route) => (route === "/" ? `${siteRoot}/` : `${siteRoot}${route}`)),
    "one entry per address, in order"
  );
  for (const address of addresses) {
    assert.match(address, /^https:\/\//, `${address} is not an address a crawler can fetch`);
  }
  assert.equal(
    (sitemap.match(/<lastmod>2026-09-29<\/lastmod>/g) || []).length,
    routes.length,
    "every address carries the day it was written"
  );
});

test("the crawler file says where the sitemap is, and nothing it cannot promise", () => {
  const robots = robotsTxt({ siteRoot });
  assert.match(robots, /^User-agent: \*\nAllow: \/$/m);
  assert.match(robots, new RegExp(`Sitemap: ${siteRoot}/${SITEMAP_FILE}`));
  assert.doesNotMatch(robots, /Disallow/, "nothing in this application is hidden from a crawler");

  // A sitemap is allowed to be absent; a sitemap pointing at a file the build
  // does not write is a lie a crawler reports as an error.
  assert.equal(ROBOTS_FILE, "robots.txt");
  assert.equal(SITEMAP_FILE, "sitemap.xml");
});

test("the address the site is served from is passed in, and checked", () => {
  assert.equal(siteOrigin({}), DEFAULT_SITE_ORIGIN);
  assert.equal(siteOrigin({ [SITE_ORIGIN_VARIABLE]: "  " }), DEFAULT_SITE_ORIGIN);
  assert.equal(siteOrigin({ [SITE_ORIGIN_VARIABLE]: "https://example.org/quest/" }), "https://example.org/quest");

  // A crawler fetches these files over the network, and a plain http address is
  // one it will not follow: refusing is better than writing it and hoping.
  for (const wrong of ["http://example.org", "example.org/quest", "/quest"]) {
    assert.throws(() => siteOrigin({ [SITE_ORIGIN_VARIABLE]: wrong }), /https/, `${wrong} was accepted`);
  }

  assert.throws(() => sitemapXml({ siteRoot, routes: [], lastmod: "2026-09-29" }), /says nothing/);
  assert.throws(() => sitemapXml({ siteRoot, routes: ["/"], lastmod: "29/09/2026" }), /not a day/);
  assert.throws(() => previewTags({ siteRoot, description: "  " }), /nothing to say/);
});

test("the link preview names the file the build draws, at the address it is served from", () => {
  const tags = previewTags({ siteRoot, description: "A quiz game about the history of Africa." });

  assert.match(tags, new RegExp(`og:url" content="${siteRoot}/"`));
  assert.match(tags, new RegExp(`og:image" content="${siteRoot}/${PREVIEW_FILE}"`));
  assert.match(tags, /twitter:card" content="summary_large_image"/);
  assert.match(tags, /og:image:width" content="1200"/);
  assert.match(tags, /og:image:height" content="630"/);

  // The picture has to exist, and has to be the size the tags promise: a card
  // declared 1200x630 and drawn 512 square is cropped to a strip by every feed.
  const card = path.join(ROOT, "public", PREVIEW_FILE);
  assert.ok(existsSync(card), `public/${PREVIEW_FILE} is missing: run npm run icons`);
  const png = readFileSync(card);
  assert.equal(png.readUInt32BE(16), 1200, "the card's width");
  assert.equal(png.readUInt32BE(20), 630, "the card's height");
});

test("the page carries the marker the build fills in, and the build is wired to fill it", () => {
  const html = read("index.html");
  assert.ok(html.includes(PREVIEW_MARKER), "index.html has nowhere to put the addresses");

  // The tags that need no address are in the page itself, and the description
  // the preview repeats is the one the page already carries.
  assert.match(html, /<meta property="og:title" content="Africa History Quest" \/>/);
  assert.match(html, /<meta\s+property="og:description"/);

  // The description is handed to the preview rather than written twice, which
  // is what stops the page and the card from saying different things.
  const plugin = read("build/site-files.js");
  assert.match(plugin, /name="description"/, "the preview reads the page's own description");
  assert.match(plugin, /transformIndexHtml/, "the plugin writes the tags into the page");
  assert.match(plugin, /emitFile/, "and writes the crawler files into the build");

  const config = read("vite.config.js");
  assert.match(config, /siteFiles\(\)/, "the build registers the plugin");

  // A deployment that hands in an address no crawler would fetch stops the
  // build rather than writing three files full of addresses that lead nowhere.
  const refusing = siteFiles({ root: ROOT, environment: { [SITE_ORIGIN_VARIABLE]: "http://example.org" } });
  assert.throws(() => refusing.configResolved({ root: ROOT, command: "build", build: {} }), /https/);

  const accepted = siteFiles({ root: ROOT, environment: { [SITE_ORIGIN_VARIABLE]: siteRoot } });
  accepted.configResolved({ root: ROOT, command: "build", build: {} });
  const page = accepted.transformIndexHtml(
    `<meta name="description" content="Twenty levels of African history." />\n${PREVIEW_MARKER}`
  );
  assert.ok(!page.includes(PREVIEW_MARKER), "the marker is left in the page as a comment");
  assert.match(page, new RegExp(`og:image" content="${siteRoot}/${PREVIEW_FILE}"`));

  // A deployment is the only place that knows the address, so that is where it
  // is handed in: an origin written into the repository would be a guess.
  const workflow = read(".github/workflows/pages.yml");
  assert.match(workflow, new RegExp(SITE_ORIGIN_VARIABLE), "the workflow hands the address to the build");
  assert.match(workflow, /steps\.pages\.outputs\.base_url/, "the address GitHub answers for the repository");
});
