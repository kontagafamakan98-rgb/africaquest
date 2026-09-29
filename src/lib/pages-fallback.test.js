import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { FALLBACK_FILE, pagesFallback } from "../../build/pages-fallback.js";

// A deep link such as /privacy, or a level's address, is not a file: the app is
// a single page and those paths only exist once the code is running. A static
// host has no rewrite rule, and GitHub Pages answers a path it does not
// recognise with 404.html. The build writes that copy, so the built directory is
// a complete site anywhere, and the deployment publishes what the build
// produced instead of repairing it on the way out.

/** The plugin, resolved the way Vite resolves it, without running a build. */
function resolved(root, outDir, command = "build") {
  const plugin = pagesFallback();
  plugin.configResolved({ root, build: { outDir }, command });
  return plugin;
}

/** A throwaway output directory holding an index.html. */
function withOutput(run) {
  const root = mkdtempSync(path.join(tmpdir(), "aq-fallback-"));
  try {
    mkdirSync(path.join(root, "dist"), { recursive: true });
    writeFileSync(path.join(root, "dist", "index.html"), '<!doctype html><div id="root"></div>');
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("an unknown path is answered with the application itself", () => {
  withOutput((root) => {
    resolved(root, "dist").closeBundle();
    const fallback = path.join(root, "dist", FALLBACK_FILE);
    assert.ok(existsSync(fallback), `the build writes ${FALLBACK_FILE}`);
    assert.equal(
      readFileSync(fallback, "utf8"),
      readFileSync(path.join(root, "dist", "index.html"), "utf8"),
      "and it is the page itself, byte for byte"
    );
  });
});

test("nothing is invented when the build produced no page", () => {
  const root = mkdtempSync(path.join(tmpdir(), "aq-fallback-"));
  try {
    mkdirSync(path.join(root, "dist"), { recursive: true });
    resolved(root, "dist").closeBundle();
    assert.ok(
      !existsSync(path.join(root, "dist", FALLBACK_FILE)),
      "an empty output stays empty rather than gaining a broken fallback"
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a development run writes nothing at all", () => {
  withOutput((root) => {
    resolved(root, "dist", "serve").closeBundle();
    assert.ok(
      !existsSync(path.join(root, "dist", FALLBACK_FILE)),
      "the file belongs to a build, not to the dev server"
    );
  });
});
