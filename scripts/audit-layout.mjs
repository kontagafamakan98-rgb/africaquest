/**
 * Every screen of the application, opened in a real browser at the size of a
 * phone.
 *
 *   node scripts/audit-layout.mjs [--only <part of a name>] [--keep] [--report <path>]
 *
 * `npm run verify` draws every screen for real and hands the markup to axe, and
 * that is what turns the accessibility of a screen from a promise into a check.
 * But the document it hands over is jsdom, and jsdom lays nothing out: every
 * rectangle in it is zero, so the rules axe itself marks as needing a layout
 * engine cannot run there. Two of those matter most on a phone. The contrast of
 * a word is measured against what is really behind it, and the size of a target
 * is measured in the pixels it really takes, and both were switched off in that
 * check - rightly, since a rule that cannot run must not be read as a rule that
 * passed, and wrongly, since nothing else ran them either.
 *
 * So this opens the built site in a browser that lays out, at two widths of
 * phone, and reads two things from each screen: axe again, with every rule it
 * has, and the geometry no rule expresses - a page that scrolls sideways, an
 * element that hangs off the screen, words cut off by the box that holds them,
 * two pieces of text drawn on each other. The rules of that second reading live
 * in src/lib/layout-audit.js with tests of their own; this file is the part that
 * needs a browser and a site to read.
 *
 * It is not part of `npm run verify`. A browser is a heavy thing to hand a check
 * that has to come back in a couple of minutes, and a runner without one would
 * turn a missing browser into a failing build. It is a workflow of its own, and
 * it can be run by hand from here.
 *
 * About the browser: no package is installed for this. Playwright and Puppeteer
 * each bring their own copy of Chromium, which is a hundred megabytes of
 * dependency for a script whose whole job is to ask an already-installed browser
 * for numbers. What every platform already has is a Chrome or an Edge, and what
 * every Node of this project's vintage already has is a WebSocket: the DevTools
 * protocol is spoken over one, so the browser is launched with a debugging port
 * and asked directly. CHROME_PATH points this at a browser it did not think of.
 */

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { INTERACTIVE_SELECTOR, PHONE_SIZES, collectInPage, judge } from "../src/lib/layout-audit.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
/** How long a screen is given to be drawn before the walk says it never was. */
const STEP_TIMEOUT_MS = 8000;
/** How long to let a screen rest after it stopped changing, so that what is
 * measured is the layout it settled on rather than the one it passed through. */
const SETTLE_MS = 400;

/** The types the built site is made of, so the browser is given real ones. */
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/** The command line, read once and passed down. */
function options(argv) {
  const read = (name) => {
    const index = argv.indexOf(name);
    return index >= 0 && argv[index + 1] ? argv[index + 1] : null;
  };
  return {
    only: read("--only"),
    report: read("--report"),
    keep: argv.includes("--keep"),
  };
}

/**
 * The built site, served from memory of the disk it is on.
 *
 * Deliberately the dullest server that can answer: a path that names a file is
 * that file, a path that names no file is the application itself, which is what
 * a single page site is and what GitHub Pages answers too. Nothing is cached, so
 * a screen audited twice is the same bytes both times, and no service worker is
 * registered by the audit at all: a check that reads its own cache is a check
 * that can pass on a site that is gone.
 *
 * @param {string} directory the built site
 * @returns {Promise<{origin: string, close: () => Promise<void>}>} where it is
 *   answering, and how to stop it
 */
function serve(directory) {
  const server = createServer((request, response) => {
    const asked = decodeURIComponent(String(request.url).split("?")[0]);
    // One blank page for the walk to write a profile into before it opens a
    // screen: storage belongs to an origin, and an address that is answering
    // nothing is an origin where localStorage does not exist at all.
    if (asked === "/__empty.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      response.end("<!doctype html><html lang=en><head><title>empty</title></head><body></body></html>");
      return;
    }
    const wanted = path.join(directory, path.normalize(asked));
    // A path that climbs out of the directory is not a file here, whatever it
    // asks for; and a directory is not a page.
    const inside = wanted === directory || wanted.startsWith(directory + path.sep);
    const isFile = inside && asked !== "/" && existsSync(wanted) && statSync(wanted).isFile();
    // A path that names no file is the application itself: that is what a single
    // page site is, and it is what a deep link to /About is answered with.
    const file = isFile ? wanted : path.join(directory, "index.html");
    try {
      const body = readFileSync(file);
      response.writeHead(200, {
        "content-type": CONTENT_TYPES[path.extname(file)] || "application/octet-stream",
        "cache-control": "no-store",
        "content-length": body.length,
      });
      response.end(body);
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end(`the built site could not be read: ${error.message}`);
    }
  });

  return new Promise((resolve) => {
    // A port of its own, asked for rather than guessed: another thread of work
    // may well be running something on the usual ones.
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        origin: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

/** Where a browser is on this machine, in the order worth trying. */
function browserCandidates() {
  const local = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Microsoft", "Edge", "Application") : null;
  const home = process.env.HOME || process.env.USERPROFILE || "";
  return [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    local && path.join(local, "msedge.exe"),
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
    "/snap/bin/chromium",
    home && path.join(home, "chrome", "chrome"),
  ].filter((candidate) => typeof candidate === "string" && candidate.length > 0);
}

/** The browser to read the site with, or a reason there is none. */
function findBrowser() {
  const found = browserCandidates().find((candidate) => existsSync(candidate));
  if (found) return found;
  throw new Error(
    "no Chrome or Edge was found to lay the site out with. Set CHROME_PATH to a browser, " +
      "or install one: the audit reads the real layout, and a document that lays nothing out cannot answer it."
  );
}

/**
 * A browser, with a profile of its own and a debugging port nobody guessed.
 *
 * Its window is opened at the smaller of the two phone sizes to begin with, and
 * each size is set again before every screen, because the browser answers what
 * the emulation says rather than what the window is. Two settings are worth
 * naming: the motion the application asks to reduce is reduced, so what is
 * measured is the layout a screen settles on rather than the one it flies
 * through, and the device is emulated as a phone, which is what makes the
 * viewport meta tag in the page mean anything.
 *
 * @param {string} browser the program to run
 * @param {string} profile a directory of its own, thrown away afterwards
 * @returns {Promise<{child: import("node:child_process").ChildProcess, endpoint: string}>}
 *   the browser, and the WebSocket that speaks to it
 */
function open(browser, profile) {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-features=Translate,MediaRouter",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--window-size=390,844",
    "about:blank",
  ];
  // A container running as the one user it has cannot be given a sandbox: the
  // browser is not allowed to set one up there, and it refuses to start.
  if (typeof process.getuid === "function" && process.getuid() === 0) args.unshift("--no-sandbox");

  const child = spawn(browser, args, { stdio: ["ignore", "ignore", "pipe"] });
  return new Promise((resolve, reject) => {
    let said = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`the browser did not answer within 30s. It said:\n${said.trim()}`));
    }, 30000);
    child.stderr.on("data", (chunk) => {
      said += String(chunk);
      const found = said.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (found) {
        clearTimeout(timer);
        resolve({ child, endpoint: found[1] });
      }
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`the browser exited with ${code} before it could be asked anything:\n${said.trim()}`));
    });
  });
}

/**
 * The DevTools protocol, over the WebSocket every Node of this vintage has.
 *
 * A request carries an id, the answer carries it back, and everything else is an
 * event; that is the whole of the protocol this needs. One target is followed -
 * the one tab every screen is opened in - so a session id is attached to each
 * message and events are only listened for on that session.
 *
 * @param {string} endpoint the browser's own WebSocket
 * @returns {Promise<{send: Function, evaluate: Function, close: () => void}>}
 *   how to ask the page something
 */
async function speak(endpoint) {
  const socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error(`the browser refused a connection at ${endpoint}`)), { once: true });
  });

  let counter = 0;
  const waiting = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id === undefined || !waiting.has(message.id)) return;
    const { resolve, reject } = waiting.get(message.id);
    waiting.delete(message.id);
    if (message.error) reject(new Error(`${message.error.message} (${message.error.code})`));
    else resolve(message.result);
  });

  /** One request, and its answer. */
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      counter += 1;
      waiting.set(counter, { resolve, reject });
      socket.send(JSON.stringify({ id: counter, method, params, sessionId }));
    });

  // A tab of its own rather than whatever the browser opened with: this one can
  // be followed by session, and a fresh profile has no other page in it anyway.
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);

  /**
   * What one expression answers, sent back as a value.
   *
   * A promise is awaited on the far side, which is how axe is asked: what it
   * answers with is a result rather than something subscribed to.
   */
  const evaluate = async (expression) => {
    const answer = await send(
      "Runtime.evaluate",
      { expression, returnByValue: true, awaitPromise: true },
      sessionId
    );
    if (answer.exceptionDetails) {
      const reason = answer.exceptionDetails.exception?.description || answer.exceptionDetails.text;
      throw new Error(`the page refused that: ${reason}`);
    }
    return answer.result.value;
  };

  return { send, evaluate, sessionId, close: () => socket.close() };
}

/**
 * What a device holds before a screen is opened.
 *
 * Three profiles, and the difference between them is the difference between
 * three screens: a device that has just chosen its language and never played
 * meets the map with the offer to keep a backup on it, a device that has played
 * meets the map it will really have, and one with questions waiting to be seen
 * again meets the review the game invites it back with. The keys are the ones the
 * application writes and reads; the language is set so that the screens are read
 * in English, which is one of the two languages every screen is written in.
 */
const FRESH = { aq_lang: "en" };

/** A device that has chosen its language and is otherwise the first time. */
const LANGUAGE = { ...FRESH, aq_welcome_v1: "1" };

/** The record of a player who has finished the first four levels. */
const PLAYED_PROGRESS = {
  current_level: 5,
  total_xp: 1240,
  stars_earned: 11,
  completed_levels: [1, 2, 3, 4],
  badges: ["first_steps"],
  level_scores: { "1": { easy: { score: 5, stars: 3, total: 7 } } },
  question_stats: {
    "1:0": { right: 2, wrong: 1, stage: 1, dueAt: Date.now() + 3600_000, lastSeen: Date.now() },
  },
  history: [{ date: "2026-09-30", level: 1, difficulty: "easy", score: 5, total: 7, stars: 3, xp: 130 }],
};

/** And the same player, with a question that is due to be asked again. */
const REVIEWING_PROGRESS = {
  ...PLAYED_PROGRESS,
  question_stats: {
    "1:0": { right: 2, wrong: 1, stage: 1, dueAt: Date.now() - 3600_000, lastSeen: Date.now() },
  },
};

const PLAYED = { ...LANGUAGE, aq_progress_v1: JSON.stringify(PLAYED_PROGRESS) };
const REVIEWING = { ...LANGUAGE, aq_progress_v1: JSON.stringify(REVIEWING_PROGRESS) };

/**
 * What the walk does to reach each screen, and what proves it arrived.
 *
 * Written out rather than discovered, because a screen nobody wrote down is a
 * screen nobody checks: the list is the inventory of what a reader can open, and
 * a screen added to the application without a line here is a screen this audit
 * silently stopped covering. `seed` is what the device already holds before the
 * screen is opened, `clicks` is what is pressed to get there, and `wait` is the
 * element that proves the screen really drew instead of throwing.
 */
const WALK = [
  { name: "the screen that asks for a language", url: "/", seed: {}, wait: "button" },
  { name: "the map, on a device that has never played", url: "/", seed: FRESH, wait: "nav button" },
  { name: "the map of a player who has played", url: "/", seed: PLAYED, wait: "nav button" },
  { name: "the study list", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(2)"] },
  { name: "the badges", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(3)"] },
  { name: "the statistics", url: "/", seed: PLAYED, wait: "main", clicks: ["nav button:nth-child(4)"] },
  { name: "the settings", url: "/", seed: PLAYED, wait: "main", clicks: ["nav button:nth-child(5)"] },
  { name: "a lesson", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(2)", "main button"] },
  // The quiz is opened by its own address, which is how a shared link to a level
  // arrives. It is not inside a `main` - the layout wraps the pages of the game
  // in a plain box - so what proves it drew is the heading of the picker, which
  // the skeleton that waits in its place does not have.
  { name: "a level, before a difficulty is chosen", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3" },
  { name: "a quiz, with the first question on screen", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Easy"] },
  { name: "the review session", url: "/", seed: REVIEWING, wait: "main button", clicks: ["main button"] },
  { name: "the about page", url: "/About", seed: LANGUAGE, wait: "main" },
  { name: "the privacy notice", url: "/PrivacyPolicy", seed: LANGUAGE, wait: "main" },
  { name: "the terms of use", url: "/TermsOfService", seed: LANGUAGE, wait: "main" },
  { name: "the photograph credits", url: "/PhotoCredits", seed: LANGUAGE, wait: "main" },
  { name: "the bibliography", url: "/Bibliography", seed: LANGUAGE, wait: "main" },
  { name: "the page that installs the Android app", url: "/Android", seed: LANGUAGE, wait: "main" },
  { name: "the teacher space", url: "/TeacherPage", seed: LANGUAGE, wait: "main" },
  { name: "an address that is not a page", url: "/not-a-page", seed: LANGUAGE, wait: "main" },
];

/** A rest, so that what is read is a screen that has stopped moving. */
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Whether the page says so, until it does or the wait runs out.
 *
 * The application renders, fetches, renders again: a screenshot of the first
 * frame would judge a skeleton, and a skeleton is not the screen. So each step
 * names the element that proves the screen arrived, and this waits for it.
 */
async function until(session, expression, timeoutMs = STEP_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const said = await session.evaluate(`Boolean(${expression})`).catch(() => false);
    if (said) return true;
    if (Date.now() >= deadline) return false;
    await pause(100);
  }
}

/**
 * Press one control, and say so when there was nothing to press.
 *
 * A click that finds nothing leaves the walk reading the screen before it - one
 * it has already read - and a step that silently reads the wrong screen is how a
 * check rots without ever failing. So the answer carries the controls that were
 * there instead, and the run says what it looked for and what it found.
 */
function pressScript(spec) {
  return `(() => {
    const wanted = ${JSON.stringify(spec)};
    const controls = () => [...document.querySelectorAll("button, a[href], [role=button], label")];
    const target = wanted.startsWith("text=")
      ? controls().find((element) => (element.textContent || "").includes(wanted.slice(5))) || null
      : document.querySelector(wanted);
    if (!target) {
      return {
        pressed: false,
        screen: controls().slice(0, 14).map((element) =>
          (element.getAttribute("aria-label") || element.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 44)
        ),
      };
    }
    target.scrollIntoView({ block: "center" });
    target.click();
    return { pressed: true, screen: [] };
  })()`;
}

/**
 * The device a screen is opened on, written before the screen is.
 *
 * Storage belongs to an origin, so it is written on a page of that origin that
 * draws nothing at all: an address the application itself answers with would
 * read what was stored before it was all stored. Every screen starts from a
 * device that was cleared first, so what a screen is read with is what this file
 * says it is and never what the screen before it left behind.
 */
async function seedInto(session, origin, seed) {
  await session.send("Page.navigate", { url: `${origin}/__empty.html` }, session.sessionId);
  await until(session, `document.readyState === "complete"`);
  await session.evaluate(
    `(() => {
      localStorage.clear();
      for (const [key, value] of Object.entries(${JSON.stringify(seed)})) localStorage.setItem(key, value);
      return localStorage.length;
    })()`
  );
}

/**
 * What axe has to say, in the vocabulary the report already uses.
 *
 * A screen fails on what axe rates serious or critical, which is the bar the
 * check that draws the screens for real already holds itself to: the same rule,
 * read in a browser rather than in a document that lays nothing out. What axe
 * rates less than that is worth a line and not a failure, since that is the
 * judgement it is making and this is not the place to overrule it.
 *
 * @param {object[]} violations what axe answered
 * @param {boolean} severe whether these are the ones that fail a screen
 * @returns {{rule: string, what: string}[]} one line per rule that found something
 */
function axeLines(violations, severe) {
  return violations.map((violation) => ({
    rule: severe ? `axe: ${violation.id}` : `axe, worth knowing: ${violation.id}`,
    what: `${violation.nodes.length} node(s) - ${violation.help}. First: ${violation.nodes
      .slice(0, 3)
      .map((node) => node.target.join(" "))
      .join(", ")}`,
  }));
}

/**
 * One screen, opened and read: the profile it starts from, the route it is at,
 * what is pressed to reach it, and then both readings of what was drawn.
 */
async function readScreen(session, origin, step) {
  await seedInto(session, origin, step.seed);
  await session.send("Page.navigate", { url: `${origin}${step.url}` }, session.sessionId);
  const arrived = await until(session, `document.querySelector(${JSON.stringify(step.wait)})`);
  if (!arrived) {
    return {
      faults: [{ rule: "the screen never drew", what: `nothing matched ${step.wait} within ${STEP_TIMEOUT_MS}ms at ${step.url}` }],
      notes: [],
    };
  }

  for (const click of step.clicks || []) {
    const answer = await session.evaluate(pressScript(click));
    if (!answer.pressed) {
      return {
        faults: [
          {
            rule: "the walk could not reach the screen",
            what: `nothing to press for ${click}; the controls on the screen were ${answer.screen.map((text) => `"${text}"`).join(", ")}`,
          },
        ],
        notes: [],
      };
    }
    await pause(SETTLE_MS);
  }
  await pause(SETTLE_MS);

  const measured = await session.evaluate(`(${collectInPage.toString()})(${JSON.stringify(INTERACTIVE_SELECTOR)})`);
  const judged = judge(measured);
  const axe = await session.evaluate('axe.run(document, { resultTypes: ["violations"] })');
  const serious = axe.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  const lesser = axe.violations.filter((violation) => violation.impact !== "serious" && violation.impact !== "critical");

  return {
    faults: [...judged.faults, ...axeLines(serious, true)],
    notes: [...judged.notes, ...axeLines(lesser, false)],
  };
}

/** The screens this run is about: all of them, or the one named on the command
 * line, so that one screen can be read on its own while it is being fixed. */
function chosen(only) {
  if (!only) return WALK;
  const matching = WALK.filter((step) => step.name.includes(only));
  if (matching.length > 0) return matching;
  throw new Error(`no screen matches "${only}". The walk knows: ${WALK.map((step) => step.name).join(", ")}`);
}

/** axe, the same library the drawn-screen check hands its markup to, given to a
 * browser that lays out: the rules that could only be switched off there run
 * here, and the ones that ran there run again on the screen a reader gets. */
const AXE_SOURCE = readFileSync(path.join(ROOT, "node_modules", "axe-core", "axe.min.js"), "utf8");

/**
 * The application installs a service worker, which is what makes it playable
 * with no network. A check must not read from it: the screens would then be
 * answered by a cache written during the run, and a site that is gone would
 * still be read as a site that is there.
 */
const WITHOUT_WORKER = `
  if (navigator.serviceWorker && navigator.serviceWorker.register) {
    navigator.serviceWorker.register = () => Promise.resolve({
      scope: "/",
      update: () => Promise.resolve(),
      unregister: () => Promise.resolve(true),
    });
  }`;

/**
 * Every screen, opened and read.
 *
 * The site is served from the build rather than from the published address, and
 * that is deliberate: this reads the layout of what is about to be published,
 * before it is published, and it cannot depend on a deployment or on a network.
 */
async function main() {
  const { only, report, keep } = options(process.argv.slice(2));
  const screens = chosen(only);

  if (!existsSync(path.join(DIST, "index.html"))) {
    console.error("layout: dist/ holds no site to read. Run `npm run build` first.");
    process.exitCode = 1;
    return;
  }

  const browser = findBrowser();
  const site = await serve(DIST);
  const profile = mkdtempSync(path.join(tmpdir(), "aq-layout-"));
  console.log(`layout: ${browser}`);
  console.log(
    `layout: reading ${site.origin}, ${screens.length} screen(s), at ${PHONE_SIZES.map(
      (size) => `${size.width}x${size.height}`
    ).join(" and ")}\n`
  );

  const faults = [];
  const notes = [];
  let readings = 0;
  let child = null;
  let session = null;
  try {
    const opened = await open(browser, profile);
    child = opened.child;
    session = await speak(opened.endpoint);
    // Handed to every document before the application draws in it, so that no
    // screen is ever read by something that had to be asked for later.
    await session.send("Page.addScriptToEvaluateOnNewDocument", { source: AXE_SOURCE }, session.sessionId);
    await session.send("Page.addScriptToEvaluateOnNewDocument", { source: WITHOUT_WORKER }, session.sessionId);

    for (const size of PHONE_SIZES) {
      await session.send(
        "Emulation.setDeviceMetricsOverride",
        { width: size.width, height: size.height, deviceScaleFactor: 3, mobile: true },
        session.sessionId
      );
      await session.send(
        "Emulation.setEmulatedMedia",
        // The motion the application offers to reduce is reduced. What is
        // measured is then the layout a screen settles on rather than the one it
        // flies through: a card half way across the screen is not a fault, and a
        // report full of them is a report nobody reads twice.
        { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
        session.sessionId
      );

      for (const step of screens) {
        const read = await readScreen(session, site.origin, step);
        readings += 1;
        const where = `${step.name} (${size.name}, ${size.width}px)`;
        faults.push(...read.faults.map((fault) => ({ where, ...fault })));
        notes.push(...read.notes.map((note) => ({ where, ...note })));
        process.stdout.write(read.faults.length === 0 ? "." : "!");
      }
      process.stdout.write("\n");
    }
  } finally {
    if (session) session.close();
    if (child) {
      // The browser is given a moment to let go of its profile before the folder
      // is taken away: a directory still open cannot be removed, and a temporary
      // folder is not something to hand a reader a failure over.
      child.kill();
      await new Promise((resolve) => {
        const waited = setTimeout(resolve, 5000);
        child.once("exit", () => {
          clearTimeout(waited);
          resolve();
        });
      });
    }
    await site.close();
    // A profile is a directory of caches and a log of everything asked for:
    // kept only when somebody wants to see what the browser saw.
    if (!keep) {
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {
        // Left where the browser put it. Nothing about the site is worse for it.
      }
    }
  }

  console.log(`\nlayout: ${readings} screen(s) read, ${faults.length} fault(s), ${notes.length} note(s)`);
  if (faults.length > 0) {
    console.error("\nlayout: what is wrong, in the order it was read:\n");
    for (const fault of faults) console.error(`  x ${fault.where}\n      ${fault.rule} - ${fault.what}`);
  } else {
    console.log("\nlayout: every screen fits the phone it was read at, and axe found nothing serious on it");
  }
  if (notes.length > 0) {
    console.log("\nlayout: worth knowing, and none of it a failure:\n");
    for (const note of notes) console.log(`  - ${note.where}\n      ${note.rule} - ${note.what}`);
  }
  if (report) {
    writeFileSync(report, JSON.stringify({ browser, sizes: PHONE_SIZES, readings, faults, notes }, null, 2));
    console.log(`\nlayout: the verdict left at ${report}`);
  }
  process.exitCode = faults.length > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(`layout: ${error.message}`);
  process.exitCode = 1;
});
