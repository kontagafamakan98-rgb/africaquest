/**
 * The server the desktop window is served from, read the way a browser reads it.
 *
 * The tests start the real server on a real port and ask it for real addresses,
 * because the things worth holding here are exactly the ones a unit test of the
 * handler would take on trust: that a route comes back as the page, that a file
 * comes back with a type a browser will use, and that an address trying to climb
 * out of the folder is refused rather than answered.
 *
 * The folder is a fixture the test writes and removes, rather than the `dist`
 * this repository builds: a test that read a build artifact would fail on a
 * fresh checkout, where the tests run before there is anything in `dist`.
 */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createStaticServer, contentType, fileFor } from "./server.js";

const PAGE = "<!doctype html><title>Africa History Quest</title><div id=\"root\"></div>";
const SCRIPT = "export const answer = 42;\n";
const MARKER = "not the page";

describe("the server the desktop window reads", () => {
  /** @type {string} */
  let root;
  /** @type {{ url: string, close: () => Promise<void> }} */
  let site;

  before(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), "africa-quest-desktop-"));
    await writeFile(path.join(root, "index.html"), PAGE);
    await mkdir(path.join(root, "assets"), { recursive: true });
    await writeFile(path.join(root, "assets", "index.js"), SCRIPT);
    await mkdir(path.join(root, "photos"), { recursive: true });
    // A file beside the served folder, which a successful traversal would hand
    // out: the test can then tell a refusal from an answer that merely 404s.
    await writeFile(path.join(root, "..", "outside.txt"), MARKER);
    site = await createStaticServer({ root });
  });

  after(async () => {
    await site.close();
    await rm(root, { recursive: true, force: true });
    await rm(path.join(root, "..", "outside.txt"), { force: true });
  });

  test("the root address is the page", async () => {
    const response = await fetch(site.url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
    assert.match(await response.text(), /Africa History Quest/);
  });

  test("a file comes back with the type a browser will use", async () => {
    const response = await fetch(new URL("assets/index.js", site.url));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/javascript/);
    assert.equal(await response.text(), SCRIPT);
  });

  test("a deep link is answered with the page rather than a 404", async () => {
    // The router reads the address after the page has loaded, so `/LessonScreen`
    // has no file behind it and still has to be the game.
    const response = await fetch(new URL("LessonScreen", site.url));
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Africa History Quest/);
  });

  test("a missing file is not answered with the page", async () => {
    // The difference that matters: a stylesheet the build should have written
    // comes back as a 404, not as the page, so a broken build is not silently
    // served as a page of unstyled text.
    const response = await fetch(new URL("assets/missing.js", site.url));
    assert.equal(response.status, 404);
  });

  test("an address that climbs out of the folder is refused", async () => {
    const response = await fetch(`${site.url}..%2Foutside.txt`);
    assert.equal(response.status, 403);
    assert.doesNotMatch(await response.text(), new RegExp(MARKER));
  });

  test("the server listens on the loopback interface only", async () => {
    assert.match(site.url, /^http:\/\/127\.0\.0\.1:\d+\/$/);
    const response = await fetch(new URL("index.html", site.url));
    assert.equal(response.status, 200);
  });
});

describe("what an address is read as", () => {
  // The folder is named through `path` rather than written as "/site", because
  // the expectations below are compared with what `path.resolve` makes of it:
  // on Windows a leading slash is drive relative, and a test that spelled it out
  // would pass here and fail on the next machine.
  const root = path.resolve(path.join(os.tmpdir(), "africa-quest-files"));

  test("an extension decides the type, whatever case it is written in", () => {
    assert.match(contentType("assets/index.JS"), /^text\/javascript/);
    assert.match(contentType("photos/site-1.webp"), /^image\/webp/);
    assert.equal(contentType("sw"), "application/octet-stream");
    assert.equal(contentType("icon.ico"), "image/x-icon");
  });

  test("the page answers a folder and a route alike", () => {
    assert.equal(fileFor("/", root), path.join(root, "index.html"));
    assert.equal(fileFor("/photos/", root), path.join(root, "photos", "index.html"));
  });

  test("a request for something outside the folder names nothing", () => {
    assert.equal(fileFor("/../secret.txt", root), null);
    assert.equal(fileFor("/..%2Fsecret.txt", root), null);
    assert.equal(fileFor("/a/%00/b", root), null);
    // A malformed escape is a refusal rather than a thrown error: the caller has
    // no better answer for an address it cannot read.
    assert.equal(fileFor("/%E0%A4%A", root), null);

    // Only Windows can be handed a drive letter, so only Windows is asked about
    // one. Written as a condition rather than left out, because this is the
    // spelling the containment check exists for: an address that is absolute in
    // its own right and does not start with `..` at all.
    if (process.platform === "win32") {
      assert.equal(fileFor("/C:/Windows/win.ini", root), null);
    }
  });

  test("the address's query and fragment are not part of the file's name", () => {
    assert.equal(fileFor("/assets/index.js?v=2", root), path.join(root, "assets", "index.js"));
    assert.equal(fileFor("/index.html#top", root), path.join(root, "index.html"));
  });
});
