import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CONCURRENCY,
  SITE_FILES,
  SPACING_MS,
  TIMEOUT_MS,
  addressOf,
  looksLike,
  verdictIsAlarming,
  verdictLine,
  verdictOf,
} from "./site-health.js";
import { PREVIEW_FILE, ROBOTS_FILE, SITEMAP_FILE, siteOrigin } from "../../build/site-files.js";

// Whether the published site is still there.
//
// The application has no server to watch, and the way a static site fails is
// quiet: the address keeps answering, and what it answers with is the wrong
// thing. These tests are about telling those apart, since a check that only asks
// "does it reply?" would pass on a site that no longer exists.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

test("the addresses checked are the files the build writes", () => {
  const paths = SITE_FILES.map((file) => file.path);
  assert.deepEqual(paths, ["", ROBOTS_FILE, SITEMAP_FILE, PREVIEW_FILE]);
  assert.equal(paths[0], "", "the landing page is the first thing checked");
  for (const file of SITE_FILES) {
    assert.ok(file.what && file.kind, `${file.path || "/"} says what it is`);
  }

  // Built from the one address in the repository, so the check cannot be pointed
  // at a site the application is not published at.
  assert.equal(addressOf("https://example.org/quest", ""), "https://example.org/quest/");
  assert.equal(addressOf("https://example.org/quest/", "robots.txt"), "https://example.org/quest/robots.txt");
  assert.equal(addressOf("https://example.org", "sitemap.xml"), "https://example.org/sitemap.xml");
  assert.ok(SITE_FILES.every((file) => addressOf(siteOrigin({}), file.path).startsWith("https://")));
});

test("each file is recognised by something it cannot be without", () => {
  // A real file of each kind, as the build writes it: the page the application
  // is mounted on, the crawler file, the sitemap, the signature of a PNG.
  const page = '<!doctype html><html><head><title>Africa History Quest</title></head><body><div id="root"></div>';
  const robots = "User-agent: *\nAllow: /\n\nSitemap: https://example.org/quest/sitemap.xml\n";
  const sitemap = '<?xml version="1.0"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.org/quest/</loc></url></urlset>';
  const picture = "\u0089PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR";

  assert.equal(looksLike("page", page), true);
  assert.equal(looksLike("robots", robots), true);
  assert.equal(looksLike("sitemap", sitemap), true);
  assert.equal(looksLike("picture", picture), true);

  // And by something it must have: a page without the root element is not the
  // application, a crawler file without a sitemap line is an empty promise, a
  // sitemap without an address is a file rather than a list.
  assert.equal(looksLike("page", "<html><body>Not found</body></html>"), false);
  assert.equal(looksLike("robots", "User-agent: *\nDisallow: /\n"), false);
  assert.equal(looksLike("sitemap", "<html>Nothing here</html>"), false);
  assert.equal(looksLike("picture", "PNG"), false);
  assert.equal(looksLike("nothing-like-this", page), false);
});

test("the bytes of a picture are read with the decoder that keeps them", () => {
  // Node labels TextDecoder("latin1") as windows-1252, where the byte 0x89 of a
  // PNG decodes to U+2030 rather than U+0089: the signature the check looks for
  // then never matches a real file, and the link preview is reported as wrong
  // however well it was published. Buffer's latin1 maps every byte to its own
  // character, and it is the one a picture is read with.
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  ]);
  assert.equal(looksLike("picture", png.toString("latin1")), true, "a real PNG is recognised");
  assert.equal(
    looksLike("picture", new TextDecoder("latin1").decode(png)),
    false,
    "and the platform's latin1 is not the decoder that keeps the bytes"
  );
  assert.match(
    read("scripts/check-site.mjs"),
    /toString\("latin1"\)/,
    "the check reads a picture through the platform decoder again"
  );
});

test("what an answer means is not the same question as whether it answered", () => {
  const page = { kind: "page" };
  const good = { status: 200, body: '<div id="root"></div><title>Africa History Quest</title>' };

  assert.equal(verdictOf({ ...page, ...good }), "healthy");
  assert.equal(verdictIsAlarming("healthy"), false);

  // A file that is not there, and the two ways a host says so.
  assert.equal(verdictOf({ ...page, status: 404, body: "Not Found" }), "missing");
  assert.equal(verdictOf({ ...page, status: 410, body: "Gone" }), "missing");

  // The half published site, which is the failure this check exists for: a
  // success status, and the application itself where another file should be.
  const wrong = verdictOf({ ...page, status: 200, body: good.body });
  assert.equal(wrong, "healthy");
  assert.equal(verdictOf({ kind: "robots", status: 200, body: good.body }), "wrong");
  assert.equal(verdictOf({ kind: "picture", status: 200, body: good.body }), "wrong");
  assert.equal(verdictIsAlarming("wrong"), true);

  // A refusal that is neither a success nor a "not here": a deployment in
  // flight, or a host that has something to say about the request.
  for (const status of [301, 403, 429, 500, 502, 503]) {
    assert.equal(verdictOf({ ...page, status, body: "" }), "refused", `status ${status}`);
  }

  // And the answer that says nothing at all about the site.
  assert.equal(verdictOf({ ...page, error: new Error("ETIMEDOUT") }), "unreachable");
  assert.equal(verdictOf({ ...page, status: 0, body: "" }), "unreachable");

  // Every verdict reads as a sentence, in one line, naming the address.
  for (const verdict of ["healthy", "missing", "refused", "unreachable", "wrong"]) {
    const line = verdictLine(SITE_FILES[1], verdict);
    assert.match(line, /^\/robots\.txt \(the crawler file\) /);
    assert.ok(line.length < 120, line);
  }
});

test("the check is asked for, paced, and stays out of the verification", () => {
  const { scripts } = JSON.parse(read("package.json"));
  assert.match(scripts["check:site"], /check-site\.mjs/, "package.json registers the site check");
  assert.ok(!scripts.verify.includes("check-site"), "the verification needs no network");

  const script = read("scripts/check-site.mjs");
  // The address is the one the build writes, from the same module: one address
  // in this repository rather than three that can disagree.
  assert.match(script, /siteOrigin/, "the check invents its own address");
  // What was fetched is handed to the verdict with its kind beside the entry.
  // The verdict reads the answer and not the request, so an answer carrying no
  // kind is a file recognised by nothing: the script once passed the entry
  // alone, and every healthy file came back as "wrong" the day the site was
  // first published and answered with the content it should have.
  assert.match(script, /return \{ entry, kind: entry\.kind,/, "the verdict is not told what it is looking at");
  assert.match(script, /SITE_FILES/, "the check no longer follows the list the tests read");
  assert.match(script, /site-health\.js/, "the verdicts are not the ones the tests read");
  // A refusal is not read as a verdict of its own: only four files are asked
  // for, four at a time, spread out, with a timeout on each.
  assert.ok(CONCURRENCY <= 4 && SPACING_MS >= 100 && TIMEOUT_MS >= 5000, "the pacing is a flood");

  // And a failing run is what tells the publisher: GitHub notifies the owner of
  // a scheduled workflow that failed, which is why no third party watches this.
  const uptime = read(".github/workflows/uptime.yml");
  assert.match(uptime, /^name: Uptime$/m);
  assert.match(uptime, /schedule:/, "the check never runs by itself");
  assert.match(uptime, /cron: "\d+ \d+ \* \* \*"/, "the schedule is not a daily one");
  assert.match(uptime, /node scripts\/check-site\.mjs/);
  assert.match(uptime, /workflow_dispatch/, "the check cannot be asked for by hand");
  assert.doesNotMatch(uptime, /continue-on-error/, "a failed check is ignored");
});
