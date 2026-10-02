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
import {
  SWEEP_LIMIT,
  TABBABLE_SELECTOR,
  focusInPage,
  judgeKeyboard,
  tabbablesInPage,
} from "../src/lib/keyboard-pass.js";

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
    // The keyboard journey is walked unless it is asked not to be: it is the
    // half of the pass that no reading of a markup can do, and a run that
    // quietly left it out would be a run reporting on half a screen.
    keyboard: !argv.includes("--no-keyboard"),
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
 * screen is opened, `clicks` is what is pressed to get there, `wait` is the
 * element that proves the screen really drew instead of throwing, and `then` is
 * the one that proves the sheet a press opened is really open - a modal read
 * without it would be the screen underneath.
 */
const WALK = [
  { name: "the screen that asks for a language", url: "/", seed: {}, wait: "button" },
  // A device that has never played opens on the offer to bring a backup across,
  // before the first question: the map under it and the dialog over it are one
  // reading, and the dialog is what proves the screen is the one it should be.
  { name: "the welcome that offers to keep a backup", url: "/", seed: FRESH, wait: "[role=dialog]" },
  { name: "the map of a player who has played", url: "/", seed: PLAYED, wait: "nav button" },
  { name: "the study list", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(2)"] },
  { name: "the badges", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(3)"] },
  { name: "the statistics", url: "/", seed: PLAYED, wait: "main", clicks: ["nav button:nth-child(4)"] },
  // The fifth tab is a sheet over the tab the player was on rather than a tab of
  // its own, so what proves it drew is the dialog and not a screen of the map.
  { name: "the settings sheet", url: "/", seed: PLAYED, wait: "nav button", clicks: ["nav button:nth-child(5)"], then: "[role=dialog]" },
  { name: "a lesson", url: "/", seed: PLAYED, wait: "main button", clicks: ["nav button:nth-child(2)", "main button"] },
  // The quiz is opened by its own address, which is how a shared link to a level
  // arrives. It is not inside a `main` - the layout wraps the pages of the game
  // in a plain box - so what proves it drew is the heading of the picker, which
  // the skeleton that waits in its place does not have.
  { name: "a level, before a difficulty is chosen", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3" },
  // The four shapes of question the quiz draws, one screen each. A run opens on
  // the chronology and the matching - the when and the who of the lesson, built
  // from the lesson rather than written as a question - and then asks the band
  // the difficulty draws on; so the matching is reached by answering the
  // chronology, the four answers by answering both, and the exam is the fourth
  // setting of the picker, which opens the same run with the verdict held back.
  { name: "a quiz, on the chronology question", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Easy"], then: "text=Check my order" },
  { name: "a quiz, on the matching question", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Easy", "text=Check my order", "text=Continue"], then: "[role=radiogroup]" },
  { name: "a quiz, on a question with four answers", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Easy", "text=Check my order", "text=Continue", "all=[role=radiogroup] > button:nth-child(1)", "text=Check my matches", "text=Continue"], then: "button[aria-label='Hint']" },
  { name: "the hint sheet, over a question", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Easy", "text=Check my order", "text=Continue", "all=[role=radiogroup] > button:nth-child(1)", "text=Check my matches", "text=Continue", "button[aria-label='Hint']"], then: "[role=dialog]" },
  { name: "a quiz set as an exam", url: "/QuizPage?levelId=1", seed: PLAYED, wait: "h3", clicks: ["text=Exam mode"], then: "text=Continue" },
  { name: "the review session", url: "/", seed: REVIEWING, wait: "main button", clicks: ["main button"] },
  { name: "the about page", url: "/About", seed: LANGUAGE, wait: "main" },
  { name: "the privacy notice", url: "/PrivacyPolicy", seed: LANGUAGE, wait: "main" },
  { name: "the terms of use", url: "/TermsOfService", seed: LANGUAGE, wait: "main" },
  { name: "the photograph credits", url: "/PhotoCredits", seed: LANGUAGE, wait: "main" },
  // The credits list a picture as a button that opens it at the size it was made,
  // in a viewer over the list: one more reading per photograph shown that way.
  { name: "a photograph, opened from the credits", url: "/PhotoCredits", seed: LANGUAGE, wait: "main button", clicks: ["main button"], then: "[role=dialog]" },
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
  return `(async () => {
    const wanted = ${JSON.stringify(spec)};
    const controls = () => [...document.querySelectorAll("button, a[href], [role=button], label")];
    // A step can name every control a selector reaches rather than one. Giving
    // each row of a matching question a description is one action to a reader
    // and one press per row, and a single click cannot make it.
    const all = wanted.startsWith("all=") ? [...document.querySelectorAll(wanted.slice(4))] : null;
    const found = all
      ? all
      : wanted.startsWith("text=")
        ? controls().filter((element) =>
            ((element.getAttribute("aria-label") || "") + " " + (element.textContent || "")).includes(wanted.slice(5))
          ).slice(0, 1)
        : [document.querySelector(wanted)].filter(Boolean);
    if (found.length === 0) {
      return {
        pressed: false,
        screen: controls().slice(0, 14).map((element) =>
          (element.getAttribute("aria-label") || element.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 44)
        ),
      };
    }
    for (const target of found) {
      target.scrollIntoView({ block: "center" });
      target.click();
      // A rest between the presses. Every one of these is a React handler that
      // reads the screen as it was drawn and writes the answer it decides on,
      // so two presses in the same turn of the event loop both compute from the
      // state before the first of them and the first is lost. A person's taps
      // are never in the same turn; this gives the loop what a hand has.
      if (found.length > 1) await new Promise((done) => setTimeout(done, 60));
    }
    return { pressed: true, screen: [] };
  })()`;
}

/**
 * The expression that proves a step arrived, from the way the step writes it.
 *
 * A plain string is a CSS selector, which is what a screen drawn once can be
 * asked for. `text=` asks for the words instead, which is how the steps name a
 * control a reader would call by its name: the third question of a run is the
 * button that says "Continue", and where that button sits in the document is
 * not something a step should have to know.
 */
function findScript(spec) {
  if (spec.startsWith("text=")) {
    const wanted = JSON.stringify(spec.slice(5));
    return `[...document.querySelectorAll("button, a[href], [role=button], label, h1, h2, h3")].some((element) =>
      ((element.getAttribute("aria-label") || "") + " " + (element.textContent || "")).includes(${wanted}))`;
  }
  return `document.querySelector(${JSON.stringify(spec)})`;
}

/**
 * Press a control, waiting for it to be there.
 *
 * The application renders, fetches, renders again: the control a step names may
 * belong to the second frame rather than the first, and a press that misses it
 * would leave the walk reading the screen before it. So a press that finds
 * nothing is tried again until the wait runs out, and only then is it a step the
 * walk could not make.
 */
async function pressWhenThere(session, spec, timeoutMs = STEP_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const answer = await session.evaluate(pressScript(spec));
    if (answer.pressed) return answer;
    if (Date.now() >= deadline) return answer;
    await pause(100);
  }
}

/**
 * A key, pressed the way a keyboard presses it.
 *
 * Not a `KeyboardEvent` built in the page: one of those is a message the page
 * receives, and what a browser does with Tab - moving the focus - happens before
 * any page is told about it, which is exactly what this pass is measuring. So the
 * key goes in at the browser's own end of the pipe, and the focus moves for the
 * same reason it moves under a person's finger. Shift is a modifier on the
 * message rather than a key of its own: eight is the number the protocol gives
 * it.
 */
async function pressKey(session, key, { shift = false } = {}) {
  const keys = {
    Tab: { code: 9, dom: "Tab" },
    Enter: { code: 13, dom: "Enter", text: "\r" },
    " ": { code: 32, dom: "Space", text: " " },
    Escape: { code: 27, dom: "Escape" },
  };
  const named = keys[key];
  if (!named) throw new Error(`${key} is not a key this pass knows how to press`);
  const modifiers = shift ? 8 : 0;
  // A key that would write a character - Enter and the space bar are both given
  // as text here - is sent as a real key press. Sent raw and without text, the
  // browser moves the focus for a Tab but never activates the button a reader
  // aimed at, and the whole journey would press keys nothing listens to.
  const shared = {
    key,
    code: named.dom,
    windowsVirtualKeyCode: named.code,
    nativeVirtualKeyCode: named.code,
    modifiers,
  };
  if (named.text) {
    shared.text = named.text;
    shared.unmodifiedText = named.text;
  }
  await session.send(
    "Input.dispatchKeyEvent",
    { type: named.text ? "keyDown" : "rawKeyDown", ...shared },
    session.sessionId
  );
  await session.send("Input.dispatchKeyEvent", { type: "keyUp", ...shared }, session.sessionId);
  await pause(25);
}

/** Where the focus stands after one press of Tab, read in the page itself. */
async function pressTab(session, { shift = false } = {}) {
  await pressKey(session, "Tab", { shift });
  return session.evaluate(`(${focusInPage.toString()})(${JSON.stringify(TABBABLE_SELECTOR)})`);
}

/**
 * Tab until the focus is on the control this names, and say if it never was.
 *
 * The travel to a screen is not part of the sweep that reads it: a reader on
 * their way to the study list passes the map, and counting those presses as a
 * reading of the list would judge the wrong screen. What it does have to do is
 * arrive, and a journey that cannot is a journey worth failing: it is the whole
 * of "this screen can be opened without a mouse".
 */
async function tabUntil(session, condition, limit = 160) {
  for (let press = 1; press <= limit; press += 1) {
    const visit = await pressTab(session);
    const found = await session
      .evaluate(`Boolean(document.activeElement && !document.activeElement.matches("body") && (${condition}))`)
      .catch(() => false);
    if (found) return { arrived: true, presses: press, visit };
  }
  return { arrived: false, presses: limit, visit: null };
}

/**
 * Every control of the screen in front of the reader, one press at a time.
 *
 * The sweep starts at the first control and ends when the focus comes back to
 * it, which is the whole of the tab order of a screen: a control that is skipped
 * is then a control that never appeared in the numbers, and the rules say so. A
 * tab order is a ring, so the turn ends the first time it closes rather than
 * being pressed four hundred times.
 */
async function sweep(session) {
  const controls = await session.evaluate(`(${tabbablesInPage.toString()})(${JSON.stringify(TABBABLE_SELECTOR)})`);
  const visits = [];
  if (controls.length === 0) return { controls, visits };

  // Walk to the first control without recording anything on the way.
  //
  // The screen was opened by pressing something - the bottom bar, a level card -
  // so the focus is on that control and not at the top of the order. A sweep that
  // started there would read the order from the middle of itself: the controls
  // before the one it started on would arrive only when the tab order came back
  // round, which reads as the walk stepping backwards. So the focus is carried to
  // the first control first, and only then does the sequence begin.
  let here = await readFocus(session);
  for (let press = 0; press < SWEEP_LIMIT && here.index !== 0; press += 1) {
    await pressKey(session, "Tab");
    here = await readFocus(session);
  }
  if (here.index !== 0) return { controls, visits };
  visits.push({ ...here, at: 0 });

  // Then one press at a time, and the order has ended when it comes back to
  // where it started. Pressing on past that would loop for ever: a tab order is
  // a ring, and the whole of it is one turn.
  const wraps = [];
  for (let press = 0; press < SWEEP_LIMIT; press += 1) {
    const visit = await pressTab(session);
    if (visit.index === 0) break;
    // The browser steps out of the page - and back in at the first control -
    // exactly once per turn: the focus is not on the document at all for those
    // presses, which is where the address bar would be. That one is the end of
    // the order rather than a reader losing their place, and it is the only one
    // that is forgiven: any other is recorded below and called a loss.
    if (visit.index === -1) {
      wraps.push(visits.length);
      continue;
    }    visits.push({ ...visit, at: press + 1 });
  }

  // A step out of the controls with the whole order still ahead of it is the
  // keyboard losing its place, and it is handed on as a visit that the rules
  // read as one. The turn's own exit - taken once every control has been reached
  // - is left out, because it is the shape of a tab order and not a fault.
  for (const at of wraps.filter((position) => position !== controls.length)) {
    visits.push({
      index: -1,
      tag: "body",
      sel: "the page",
      label: "",
      outline: "",
      shadow: "",
      onThePage: true,
      reached: false,
      at,
    });
  }
  return { controls, visits };
}

/** Where the focus stands, read in the page: the same list the sweep walks. */
async function readFocus(session) {
  return session.evaluate(`(${focusInPage.toString()})(${JSON.stringify(TABBABLE_SELECTOR)})`);
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
 * what is pressed to reach it, what has to be there once it has been, and then
 * both readings of what was drawn.
 */
async function readScreen(session, origin, step) {
  await seedInto(session, origin, step.seed);
  await session.send("Page.navigate", { url: `${origin}${step.url}` }, session.sessionId);
  const arrived = await until(session, findScript(step.wait));
  if (!arrived) {
    return {
      faults: [{ rule: "the screen never drew", what: `nothing matched ${step.wait} within ${STEP_TIMEOUT_MS}ms at ${step.url}` }],
      notes: [],
    };
  }

  for (const click of step.clicks || []) {
    const answer = await pressWhenThere(session, click);
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

  // And the screen a press opened may not be the one the first wait named: a
  // sheet over the screen, the second question of a run. That is what `then` is
  // for, and it is not a formality - without it an unopened sheet would be read
  // as the screen under it, and the walk would report on a screen it never
  // reached.
  if (step.then && !(await until(session, findScript(step.then)))) {
    return {
      faults: [
        {
          rule: "the walk could not reach the screen",
          what: `nothing matched ${step.then} within ${STEP_TIMEOUT_MS}ms after pressing ${(step.clicks || []).join(", ") || "nothing"}`,
        },
      ],
      notes: [],
    };
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

/** Whether the page holds a control whose words match, asked of the page. */
const holdsControl = (words) =>
  `[...document.querySelectorAll("button, a[href]")].some((element) => ${words}.test(element.getAttribute("aria-label") || element.textContent || ""))`;

/**
 * Whether the words are on the control the focus is on.
 *
 * The two questions are not the same one. A screen holds the control that takes
 * the quiz wherever the focus happens to be, so `holdsControl` opens a screen
 * and proves it drew; a journey is looking for the moment the focus *arrives* at
 * that control, and asking the page instead would press Enter on the first thing
 * the focus reached. Which control carries the words is a question only the
 * focused element can answer.
 */
const focusedHolds = (words) =>
  `${words}.test(document.activeElement.getAttribute("aria-label") || document.activeElement.textContent || "")`;

/** What the screen says, so that a press can be seen to have changed it. */
const SIGNATURE = `document.body.innerText.replace(/\\s+/g, " ").trim().slice(0, 4000)`;

/**
 * What the keyboard leaves on a screen, and whether a press changed it.
 *
 * One press at a time, over the controls the sweep found, so what is held is not
 * "this screen has a tab order" but the order itself. A screen the journey could
 * not reach, or could not read, is a fault of its own: the rest of the route
 * would otherwise be read as if it had happened.
 *
 * @param {object} session the browser
 * @param {string} origin the site being read
 * @returns {Promise<{screens: object[], faults: {rule: string, what: string}[], notes: object[]}>}
 *   one entry per screen, and the places the journey itself broke
 */
async function keyboardPass(session, origin) {
  const screens = [];
  const faults = [];
  const notes = [];

  /** One screen, swept: the journey stops here in the report when it cannot be. */
  const read = async (name, waitFor) => {
    const arrived = await until(session, waitFor);
    if (!arrived) {
      faults.push({ rule: "the keyboard could not open a screen", what: `${name} never appeared within ${STEP_TIMEOUT_MS}ms` });
      return false;
    }
    await pause(SETTLE_MS);
    const swept = await sweep(session);
    const after = await session.evaluate(`(${tabbablesInPage.toString()})(${JSON.stringify(TABBABLE_SELECTOR)})`);
    if (after.length !== swept.controls.length) {
      notes.push({
        rule: "a screen changed while it was being read",
        what: `${name} held ${swept.controls.length} control(s) at the first press and ${after.length} at the last`,
      });
    }
    screens.push({ name, ...swept });
    return true;
  };

  /** The press that carries the reader on, and the screen it lands on. */
  const travel = async (condition, what) => {
    const found = await tabUntil(session, condition);
    if (!found.arrived) {
      faults.push({ rule: "the keyboard cannot reach a control", what: `no Tab found ${what} within ${found.presses} presses` });
      return false;
    }
    await pressKey(session, "Enter");
    await pause(SETTLE_MS);
    return true;
  };

  await seedInto(session, origin, PLAYED);
  await session.send("Page.navigate", { url: `${origin}/` }, session.sessionId);
  if (!(await until(session, `document.querySelector("nav button")`))) {
    faults.push({ rule: "the keyboard pass could not open the game", what: "the map never drew" });
    return { screens, faults, notes };
  }
  await pause(SETTLE_MS);

  // 1. The bottom bar, which is where the study list lives: reached by Tab alone.
  const toTheList = await tabUntil(session, `document.activeElement.matches("nav button:nth-child(2)")`);
  if (toTheList.arrived) {
    await pressKey(session, "Enter");
    // 2. The study list, then the first level of it, and the lesson it opens.
    // A level card is the button that carries the title of its level, and the
    // title is the `h3` drawn inside it. Asking for that rather than for the
    // first button of the list is what makes this the level and not whatever
    // else a screen may put at the top of it.
    if (await read("the study list", `document.querySelector("main button")`)) {
      if (await travel(`document.activeElement.matches("button") && Boolean(document.activeElement.querySelector("h3"))`, "the first level of the study list")) {
        if (await read("a lesson", holdsControl("/take the quiz/i"))) {
          // 3. And on from the lesson, which is where a reader goes next.
          if (await travel(focusedHolds("/take the quiz/i"), "the control that takes the quiz")) {
            if (await read("a level, before a difficulty is chosen", `document.querySelector("h3")`)) {
              if (await travel(focusedHolds("/easy/i"), "the easy setting")) {
                // 4. The quiz, with a question on it. The chronology opens it.
                if (await read("a quiz", holdsControl("/check my order/i"))) {
                  await quizPresses(session, screens, faults, notes);
                }
              }
            }
          }
        }
      }
    }
  } else {
    faults.push({
      rule: "the keyboard cannot reach a control",
      what: `no Tab found the study list in the bottom bar within ${toTheList.presses} presses`,
    });
  }

  return { screens, faults, notes };
}

/**
 * The presses that have to do something: an order moved, and an answer checked.
 *
 * This is the half of the pass no reading can reach. A control with a name, a
 * role and a ring can still do nothing when it is pressed without a pointer, and
 * a reader would find that out one question at a time. The chronology opens the
 * quiz, and it is the shape the game itself says must be playable with keys: two
 * named buttons per row rather than a drag. So the first row is moved down, the
 * order is read before and after, and then the answer is checked and the screen
 * is read again.
 */
async function quizPresses(session, screens, faults, notes) {
  const screen = screens[screens.length - 1];
  const last = screen.controls.length - 1;

  // The way back, taken first, while the whole of the quiz is still on the
  // screen: a reader who has stepped one control too far retreats with Shift and
  // Tab, and a screen where that lands on nothing hands them the whole of it
  // again instead of the one control they passed. The sweep ended on the first
  // control, so one press in and one press back is the retreat itself.
  await pressTab(session);
  const back = await pressTab(session, { shift: true });
  notes.push({
    rule: "what one press backwards lands on",
    what: `one press in on the quiz, Shift and Tab left the focus on ${back.sel} (${back.index} of ${last + 1})`,
  });

  const before = await session.evaluate(SIGNATURE);
  const moved = await tabUntil(session, `document.activeElement.getAttribute("aria-label").startsWith("Move down")`);
  if (!moved.arrived) {
    faults.push({ rule: "the keyboard cannot reach a control", what: "no Tab found a control that moves a moment down" });
    return;
  }
  const order = await session.evaluate(SIGNATURE);
  await pressKey(session, "Enter");
  await pause(SETTLE_MS);
  const after = await session.evaluate(SIGNATURE);
  screen.activations = [
    ...(screen.activations || []),
    { what: `pressing "${moved.visit.label}" moved a moment`, changed: order !== after },
  ];

  const checked = await tabUntil(session, `document.activeElement.matches("button") && /check my order/i.test(document.activeElement.textContent || "")`);
  if (!checked.arrived) {
    faults.push({ rule: "the keyboard cannot reach a control", what: "no Tab found the control that checks the order" });
    return;
  }
  const said = await session.evaluate(SIGNATURE);
  await pressKey(session, "Enter");
  await pause(SETTLE_MS);
  const told = await session.evaluate(SIGNATURE);
  screen.activations.push({ what: "pressing the order check", changed: said !== told && told !== before });
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
  const { only, report, keep, keyboard } = options(process.argv.slice(2));
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

      // And the same screens again, with no pointer: a lesson and a quiz walked
      // from the map with Tab, Enter and nothing else. Read at each width,
      // because what is hidden at one width is not in the tab order there and
      // that is part of what a reader meets.
      if (keyboard) {
        process.stdout.write("keyboard: ");
        const walked = await keyboardPass(session, site.origin);
        const judged = judgeKeyboard({
          screens: walked.screens.map((screen) => ({ ...screen, name: `${screen.name} (${size.width}px)` })),
        });
        const where = `the keyboard journey (${size.name}, ${size.width}px)`;
        faults.push(...walked.faults.map((fault) => ({ where, ...fault })));
        notes.push(...walked.notes.map((note) => ({ where, ...note })));
        for (const fault of judged.faults) faults.push({ where, ...fault });
        for (const note of judged.notes) notes.push({ where, ...note });
        readings += walked.screens.length;
        process.stdout.write(`${walked.screens.length} screen(s), ${judged.faults.length + walked.faults.length} fault(s)\n`);
      }
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
