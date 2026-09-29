import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// The workflow is the gate a change passes before it reaches main, and it is
// the only place the project's checks are wired together outside somebody's
// machine. It is also a file nobody opens: a step quietly removed, a trigger
// narrowed to one branch, or a failing command told to continue anyway would
// leave every badge green and nothing checked. These tests read it the way the
// runner does, and hold it to the one command the project verifies itself with.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const WORKFLOW_FILE = path.join(ROOT, ".github", "workflows", "verify.yml");
const workflow = readFileSync(WORKFLOW_FILE, "utf8");
const pagesFile = path.join(ROOT, ".github", "workflows", "pages.yml");
const pages = readFileSync(pagesFile, "utf8");
const nvmrc = readFileSync(path.join(ROOT, ".nvmrc"), "utf8").trim();
const { engines, scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));

/** The `on:` block alone, so a trigger is never found in a comment above it. */
function triggerBlock(source) {
  const start = source.search(/^on:/m);
  assert.ok(start > 0, "the workflow says when it runs");
  const end = source.indexOf("\njobs:", start);
  assert.ok(end > start, "the triggers come before the job they start");
  return source.slice(start, end);
}

test("the verification runs on every pull request and on every push to main", () => {
  assert.ok(existsSync(WORKFLOW_FILE), ".github/workflows/verify.yml");

  const triggers = triggerBlock(workflow);
  assert.match(triggers, /^ {2}pull_request:/m, "a pull request is verified");

  const push = triggers.slice(triggers.indexOf("push:"));
  assert.ok(push.length > 0, "a push is verified");
  assert.match(push, /branches:\s*\[?main\]?/, "the push trigger watches main");

  // The gate is only worth something if a failure stops it.
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/, "a failing verification is not ignored");
  assert.match(workflow, /^permissions:\n {2}contents: read/m, "the job only reads the repository");
  assert.match(workflow, /concurrency:/, "a run that has been pushed over is cancelled");
  assert.match(workflow, /timeout-minutes:\s*\d+/, "a hung job cannot hold a runner for hours");

  // What runs is the real command, after the dependencies it needs.
  const installed = workflow.indexOf("run: npm ci");
  const verified = workflow.indexOf("run: npm run verify");
  assert.ok(installed > 0, "the dependencies are installed from the lockfile");
  assert.ok(verified > installed, "the verification runs after the dependencies are installed");
  assert.match(scripts.verify, /scripts\/verify\.mjs/, "and it is the script a developer runs");
});

test("the workflow runs on the Node version the app is developed on", () => {
  assert.match(nvmrc, /^\d+(\.\d+){0,2}$/, ".nvmrc names one version");
  assert.match(workflow, /node-version-file:\s*\.nvmrc/, "the workflow reads that same file");
  assert.match(workflow, /cache:\s*npm/, "the npm cache is reused between runs");

  const declared = engines?.node;
  assert.match(declared || "", /^>=\d+/, "package.json says which Node versions the app runs on");

  const floor = Number(declared.replace(/[^\d.]/g, "").split(".")[0]);
  const pinned = Number(nvmrc.split(".")[0]);
  assert.ok(floor >= 22, `Node 22 is the oldest line still maintained, and ${declared} is older`);
  assert.ok(pinned >= floor, `.nvmrc names Node ${nvmrc}, below the declared minimum ${declared}`);
});

test("the built application is published to Pages on every push to main", () => {
  assert.ok(existsSync(pagesFile), ".github/workflows/pages.yml");

  const triggers = triggerBlock(pages);
  const push = triggers.slice(triggers.indexOf("push:"));
  assert.match(push, /branches:\s*\[?main\]?/, "the site follows main");
  assert.match(triggers, /workflow_dispatch:/, "and can be published by hand");

  // A deployment already in flight is allowed to finish: cutting it off would
  // leave the site between two versions.
  assert.match(
    pages,
    /^concurrency:\n {2}group: pages\n {2}cancel-in-progress: false$/m,
    "one deployment at a time, and none interrupted"
  );

  // Reading is all the build needs; writing is the publication's business.
  assert.match(pages, /^permissions:\n {2}contents: read$/m, "the build only reads the repository");
  assert.match(
    pages,
    /^ {4}permissions:\n {6}pages: write\n {6}id-token: write$/m,
    "the publication is the only step allowed to write"
  );
  assert.match(pages, /^ {4}environment:\n {6}name: github-pages$/m, "the run is tied to the Pages environment");
  assert.match(pages, /^ {4}needs: build$/m, "the publication waits for the build");
  assert.match(pages, /actions\/upload-pages-artifact@v\d+\n\s+with:\n\s+path: dist/, "the built site is published");
  assert.match(pages, /actions\/deploy-pages@v\d+/, "through the Pages deployment");

  // The service worker travels inside dist, and a deep link has to reach the
  // application: a single page site has no other file to serve for one. Both
  // are the build's own doing, so the workflow publishes the build untouched
  // rather than patching it on its way out, and what is deployed is what
  // `npm run build` produces on any machine.
  const viteConfig = readFileSync(path.join(ROOT, "vite.config.js"), "utf8");
  assert.match(viteConfig, /pagesFallback\(\)/, "the build writes the page an unknown path is answered with");
  assert.match(
    viteConfig,
    /pagesFallback\(\)[\s\S]{0,400}offlineApp\(/,
    "before the worker lists what the build produced"
  );
  assert.ok(!/cp\s+dist\//.test(pages), "the built site is published as it is");
});

test("the site is built for the address Pages serves it from", () => {
  // A project site lives under /<repository>, and every file the build refers to
  // is otherwise looked for at the root of the domain: a blank page, with a
  // working service worker wondering where its files went.
  assert.match(pages, /id: pages\n\s+uses: actions\/configure-pages@v\d+/, "Pages says where the site will live");
  assert.match(
    pages,
    /run: npm run build -- --base="\$\{\{ steps\.pages\.outputs\.base_path \}\}\/"/,
    "and the build is given that address"
  );
  assert.match(pages, /actions\/setup-node@v\d+\n\s+with:\n\s+node-version-file: \.nvmrc/, "on the same Node version");
  assert.match(pages, /run: npm ci/, "from the lockfile");
});

test("the workflow installs the image library the photograph check reads with", () => {
  // Half of `npm run verify` opens every JPEG and reads its pixels through
  // Pillow. A runner that has Python but not Pillow fails on the gallery, which
  // reads as a broken photograph rather than as a dependency nobody installed.
  assert.match(workflow, /actions\/checkout@v\d+/, "the repository is checked out");
  assert.match(workflow, /actions\/setup-node@v\d+/, "Node is set up");
  assert.match(workflow, /actions\/setup-python@v\d+/, "Python is set up");
  assert.match(workflow, /pip install[\s\S]{0,80}Pillow/, "Pillow is installed before the verification");
  assert.ok(
    workflow.indexOf("pip install") < workflow.indexOf("run: npm run verify"),
    "and it is installed first"
  );
});
