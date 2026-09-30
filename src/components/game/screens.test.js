import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { Landmark } from "lucide-react";
import { JSDOM } from "jsdom";
import axe from "axe-core";

/**
 * The four screens that carry the application, rendered for real.
 *
 * Every other test here reads source as text, which cannot catch the mistake
 * this file exists for: a screen that throws while it draws. A value the data
 * does not have, a prop renamed on one side, a hook called in the wrong order -
 * each of them is invisible to a grep and a white screen in front of a player.
 *
 * The screens are written in JSX, which the Node runner cannot read, so they are
 * bundled with the esbuild the build already depends on, into one module this
 * test imports. React, the router and the query client are kept out of that
 * bundle and resolved from node_modules instead, so the providers this test
 * mounts and the components under them share one copy of each.
 *
 * Once a screen has been drawn, the same markup is handed to axe, which is what
 * turns the accessibility of a screen from a promise into a check: the focus
 * trap, the labels and the roles are already there, and now something reads them
 * back.
 */

const ROOT = path.resolve(import.meta.dirname, "..", "..", "..");
const SRC = path.join(ROOT, "src");
// Elements are built with createElement rather than JSX: this file is read by
// the Node runner itself, which cannot parse a tag.
const h = React.createElement;

const ENTRY = `
export { default as QuizScreen } from "@/components/game/QuizScreen.jsx";
export { default as ReviewScreen } from "@/components/game/ReviewScreen.jsx";
export { default as StatsScreen } from "@/components/game/StatsScreen.jsx";
export { default as TeacherPage } from "@/pages/TeacherPage.jsx";
export { getLevels } from "@/components/game/gameData.js";
`;

/** Build the screens once, and hand back the imported module. */
const loadScreens = (() => {
  let pending = null;
  return () => {
    if (!pending) {
      pending = (async () => {
        const result = await build({
          stdin: { contents: ENTRY, resolveDir: SRC, loader: "jsx" },
          bundle: true,
          write: false,
          format: "esm",
          platform: "browser",
          jsx: "automatic",
          target: "es2022",
          alias: { "@": SRC },
          loader: { ".js": "jsx", ".jsx": "jsx" },
          define: { "process.env.NODE_ENV": "\"test\"" },
          // Kept out of the bundle so the providers mounted here and the screens
          // under them share one copy: two copies of React is two hook systems,
          // and two copies of the query client is a context nobody finds.
          external: ["react", "react-dom", "react-router-dom", "@tanstack/react-query", "lucide-react"],
          logLevel: "silent",
        });
        // Written inside the project, so the packages kept out of the bundle - 
        // react, the router, the query client - resolve from node_modules the
        // same way they do for the application itself. A temporary directory
        // outside the project cannot see them at all.
        const directory = path.join(ROOT, "node_modules", ".cache", "aq-screens");
        mkdirSync(directory, { recursive: true });
        const file = path.join(directory, "screens.mjs");
        writeFileSync(file, result.outputFiles[0].text, "utf8");
        // The module itself, not the path to it: the caller destructures the
        // four screens out of what comes back, and a URL string has no screens
        // on it, which is a render of nothing that looks like a broken screen.
        return import(pathToFileURL(file).href);
      })();
    }
    return pending;
  };
})();

/** The browser a screen needs in order to be drawn outside a browser. */
function installDom() {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  // Some of these names are read-only on the Node global (navigator, and the
  // window itself on recent versions), so each one is defined rather than
  // assigned. A name that cannot be replaced is left as it is: the test needs
  // most of them, not all of them, and a hard failure here would hide the
  // screens behind a detail of the runner.
  const define = (name, value) => {
    try {
      Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
    } catch {
      // Left alone, and said so above rather than swallowed on purpose.
    }
  };

  define("window", window);
  define("document", window.document);
  define("navigator", window.navigator);
  define("localStorage", window.localStorage);
  define("sessionStorage", window.sessionStorage);
  define("location", window.location);
  // Every name an animation library reaches for while drawing a moving box,
  // taken from the window rather than listed one by one and found wanting.
  for (const name of [
    "HTMLElement",
    "HTMLDivElement",
    "HTMLButtonElement",
    "HTMLAnchorElement",
    "HTMLInputElement",
    "Element",
    "SVGElement",
    "Node",
    "NodeList",
    "Event",
    "CustomEvent",
    "KeyboardEvent",
    "MouseEvent",
    "PointerEvent",
    "MutationObserver",
    "CSS",
  ]) {
    if (window[name]) define(name, window[name]);
  }
  define("getComputedStyle", window.getComputedStyle.bind(window));
  define("requestAnimationFrame", (callback) => setTimeout(() => callback(Date.now()), 0));
  define("cancelAnimationFrame", (id) => clearTimeout(id));
  define("IS_REACT_ACT_ENVIRONMENT", true);
  // The browser features a screen may ask for that a jsdom window does not
  // implement: present, inert, and enough for a render to finish.
  const matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  });
  define("matchMedia", matchMedia);
  window.matchMedia = matchMedia;
  define(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  define(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
}

// Installed once, at load, before the bundle is ever imported: a module that
// reads the browser it is running in reads it as it loads.
installDom();

/** One level of the game, shaped the way the quiz screen expects it. */
const LEVEL = {
  id: 1,
  order: 2,
  era: "ancient",
  from: -3100,
  title: "Ancient Egypt",
  subtitle: "Land of the Pharaohs",
  region: "North Africa",
  color: "from-amber-400 to-yellow-500",
  icon: Landmark,
  questions: Array.from({ length: 6 }, (_unused, index) => ({
    question: `Question number ${index + 1}?`,
    options: ["First", "Second", "Third", "Fourth"],
    correct: index % 4,
    fact: `The explanation of question ${index + 1}.`,
    source: { label: "Encyclopaedia Britannica" },
  })),
};

/** A player who has never played, and one who has finished a level. */
const EMPTY_PROGRESS = {
  current_level: 1,
  total_xp: 0,
  stars_earned: 0,
  completed_levels: [],
  badges: [],
  level_scores: {},
  total_time_seconds: 0,
  streak_days: 0,
  last_played: null,
  question_stats: {},
  studied_levels: [],
  history: [],
};

const PLAYED_PROGRESS = {
  ...EMPTY_PROGRESS,
  current_level: 2,
  total_xp: 240,
  stars_earned: 4,
  completed_levels: [1],
  badges: ["first_step"],
  level_scores: { "1": { easy: { score: 4, stars: 2, total: 5 } } },
  question_stats: { "1:0": { right: 2, wrong: 1, stage: 1, dueAt: Date.now() + 60000, lastSeen: Date.now() } },
  history: [{ date: "2026-09-30", level: 1, difficulty: "easy", score: 4, total: 5, stars: 2, xp: 130 }],
};

const queryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });

/** Draw one element to markup, then read it back with axe. */
async function draw(element) {
  const html = renderToStaticMarkup(element);
  assert.ok(html.trim().length > 0, "the screen draws something rather than nothing");

  // axe is handed the very markup the screen produced, in a document of its
  // own: what it reads back is what a reader would have been given. The colour
  // of a word is measured elsewhere (src/lib/design-rules.test.js), so the one
  // rule axe cannot run without a layout engine is left out here.
  const audit = new JSDOM(`<!doctype html><html lang="en"><body>${html}</body></html>`, {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });
  const results = await axe.run(audit.window.document.body, {
    rules: { "color-contrast": { enabled: false } },
  });
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
  assert.deepEqual(
    serious.map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`),
    [],
    "the drawn screen has an accessibility fault axe can see"
  );

  return html;
}

/** The markup a piece of text becomes, so text read from the data can be looked
 * for in what the screen drew without failing on an ampersand. */
function escaped(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

test("the quiz screen draws a level, its first question and its answers", async () => {
  const { QuizScreen } = await loadScreens();
  const html = await draw(
    h(QuizScreen, { level: LEVEL, difficulty: "hard", onBack() {}, onComplete() {} })
  );

  assert.match(html, /Ancient Egypt/);
  assert.match(html, /Question number 1\?/, "the first question is on the screen");
  assert.match(html, /First/, "and so are its answers");
});

test("the review screen draws its empty state and a waiting question", async () => {
  const { ReviewScreen, getLevels } = await loadScreens();

  const empty = await draw(h(ReviewScreen, { queue: [], onBack() {}, onStart() {} }));
  assert.match(empty, /role="dialog"|review|Review/i, "the empty inbox says something");

  const waiting = await draw(
    h(ReviewScreen, {
      queue: [
        {
          levelId: 1,
          index: 0,
          levelTitle: "Ancient Egypt",
          region: "North Africa",
          due: Date.now() - 1000,
          wrong: 1,
          right: 0,
        },
      ],
      onBack() {},
      onStart() {},
    })
  );
  assert.match(waiting, /Ancient Egypt/, "the level a waiting question belongs to is named");
  // The question a waiting item shows is not carried on the item itself: the
  // screen looks it up in the level it names. Read through the same module the
  // screen reads, so the two cannot drift apart and both be wrong.
  const waitingText = getLevels("en").find((level) => level.id === 1).questions[0].question;
  assert.ok(
    waiting.includes(escaped(waitingText)),
    "and the question itself is read from the level"
  );
});

test("the statistics screen draws a new player and a played one", async () => {
  const { StatsScreen } = await loadScreens();

  await draw(h(StatsScreen, { progress: EMPTY_PROGRESS, onReviewLevel() {} }));
  const played = await draw(h(StatsScreen, { progress: PLAYED_PROGRESS, onReviewLevel() {} }));
  assert.match(played, /Ancient Egypt/, "a level is listed once it has been played");
});

test("the teacher page draws inside a router and a query client", async () => {
  const { TeacherPage } = await loadScreens();
  await draw(
    h(
      QueryClientProvider,
      { client: queryClient() },
      h(MemoryRouter, { initialEntries: ["/TeacherPage"] }, h(TeacherPage))
    )
  );
});

// A check nobody has seen fail is a check nobody knows is running. Two faults
// every screen here could have, drawn through the same door as the screens
// above, so that a green run above means something.
test("the audit behind these renders really refuses a fault", async () => {
  await assert.rejects(
    draw(h("button", { type: "button" }, "")),
    /accessibility fault axe can see/,
    "a button with no name is caught"
  );
  await assert.rejects(
    draw(h("div", null, h("img", { src: "/flag.webp" }))),
    /accessibility fault axe can see/,
    "a picture with no description is caught"
  );
});
