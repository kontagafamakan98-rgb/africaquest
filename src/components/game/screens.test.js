import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import path from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
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
export { default as LessonScreen } from "@/components/game/LessonScreen.jsx";
export { default as LearnScreen } from "@/components/game/LearnScreen.jsx";
export { default as ReviewSession } from "@/components/game/ReviewSession.jsx";
export { default as DifficultyPicker } from "@/components/game/DifficultyPicker.jsx";
export { default as LevelGallery } from "@/components/game/LevelGallery.jsx";
export { default as FlashQuiz } from "@/components/game/FlashQuiz.jsx";
export { default as KnowledgeMap } from "@/components/game/KnowledgeMap.jsx";
export { default as Bibliography } from "@/pages/Bibliography.jsx";
export { default as PhotoCredits } from "@/pages/PhotoCredits.jsx";
export { default as Android } from "@/pages/Android.jsx";
export { default as StartupLanguage } from "@/components/StartupLanguage.jsx";
export { default as About } from "@/pages/About.jsx";
export { default as PrivacyPolicy } from "@/pages/PrivacyPolicy.jsx";
export { default as TermsOfService } from "@/pages/TermsOfService.jsx";
export { translations } from "@/components/i18n.jsx";
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
          external: ["react", "react-dom", "react-dom/client", "react-router-dom", "@tanstack/react-query", "lucide-react"],
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

/** What a screen drew, read back by axe in a document of its own. */
async function auditMarkup(html) {
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

/** Draw one element to markup, then read it back with axe. */
async function draw(element) {
  return auditMarkup(renderToStaticMarkup(element));
}

/**
 * Draw one element the way a browser does, effects and all, then read it back.
 *
 * The screens that read their own content - the lesson asks for its level when
 * it is opened - draw the wait first and the content on a later render, and a
 * server render runs no effect at all. So these are mounted for real, into the
 * jsdom this file already installs, and given the turns of the event loop the
 * data needs before what they drew is read back. `settled` is the screen's own
 * content arriving: without it the wait would be read as the screen.
 */
async function drawLive(element, settled) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(element);
    });
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (settled && settled(container.innerHTML)) break;
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }
    return await auditMarkup(container.innerHTML);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
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

/** The markup a piece of text becomes inside an element the DOM wrote, where
 * only what could be read as markup is escaped and a quote is just a character.
 * A screen mounted in a browser is read this way; one serialized to a string is
 * read the way above. */
function escapedText(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

test("the quiz opens on the chronology of the lesson", async () => {
  // The first question of a run is no longer four answers to choose between: it
  // is the lesson's own timeline, handed over in the wrong order, to be put back
  // in the order the lesson tells. What is read back here is that the screen
  // really found it, that the moments are drawn in the order the question was
  // handed over in, and that the player has a way to move them - the two things
  // a question assembled rather than written can get wrong.
  const { QuizScreen, translations } = await loadScreens();
  const { chronologyQuestion } = await import("./chronology.js");
  const { LEVEL_STUDY } = await import("./level-study.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const study = LEVEL_STUDY[1].en;
  const level = { ...LEVEL, id: 7, study };
  const html = await draw(h(QuizScreen, { level, difficulty: "easy", onBack() {}, onComplete() {} }));
  globalThis.localStorage.removeItem("aq_lang");

  const question = chronologyQuestion(study, level.id);
  assert.ok(question, "the lesson carries a chronology question");
  assert.ok(
    html.includes(escaped(translations.en.chronologyQuestion)),
    "the question says what it asks for"
  );
  assert.ok(html.includes(escaped(translations.en.chronologyCheck)), "and offers to check the answer");
  // Nothing to cross out and nothing to spell: a hint that eliminates one of
  // four wrong moments would be a hint about nothing.
  assert.ok(!html.includes('aria-label="Hint"'), "and offers no hint it cannot give");

  const list = document.createElement("div");
  list.innerHTML = html;
  const rows = [...list.querySelectorAll("ol > li")];
  assert.equal(rows.length, question.steps.length, "every moment has a row of its own");
  const drawn = rows.map((row) => row.querySelector("p").textContent);
  assert.deepEqual(
    drawn,
    question.order.map((moment) => question.steps[moment]),
    "the moments are drawn in the order the question was handed over in"
  );
  assert.notDeepEqual(drawn, question.steps, "which is not the order the lesson tells");

  // Each row carries both moves, and the two ends can only go one way: a list
  // whose first moment silently becomes its last is a list a player loses.
  rows.forEach((row, position) => {
    const [up, down] = [...row.querySelectorAll("button")];
    assert.ok(up && down, `moment ${position + 1} can be moved both ways`);
    assert.match(up.getAttribute("aria-label"), /Move up one place/, `moment ${position + 1}`);
    assert.match(down.getAttribute("aria-label"), /Move down one place/, `moment ${position + 1}`);
    assert.equal(up.disabled, position === 0, `moment ${position + 1} cannot move above the first`);
    assert.equal(
      down.disabled,
      position === rows.length - 1,
      `moment ${position + 1} cannot move below the last`
    );
    // The name of a move names the moment it moves, so that neither button is
    // ever "the second one" to a screen reader.
    assert.ok(up.getAttribute("aria-label").includes(question.steps[question.order[position]]));
  });
});

test("a chronology answer is checked, and the screen says what happened", async () => {
  // The one part of the question a render cannot reach: what the screen does
  // once the player has answered. It is drawn for real and clicked, because the
  // two mistakes found here by hand - a verdict drawn as a flag, which a screen
  // reader never hears, and an explanation taken from a field this kind of
  // question does not have - were both invisible to every other test in this
  // file.
  const { QuizScreen, translations } = await loadScreens();
  const { chronologyQuestion } = await import("./chronology.js");
  const { LEVEL_STUDY } = await import("./level-study.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const study = LEVEL_STUDY[1].en;
  const level = { ...LEVEL, id: 7, study };
  const question = chronologyQuestion(study, level.id);

  const mounted = [];
  /** A quiz opened from scratch, the way a player opens one. */
  const open = async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container, root });
    await act(async () => {
      root.render(h(QuizScreen, { level, difficulty: "easy", onBack() {}, onComplete() {} }));
    });
    return container;
  };
  const closeAll = async () => {
    for (const { container, root } of mounted.splice(0)) {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    }
  };
  /** The one button that checks the order, on the screen it is drawn on. */
  const checkButton = (container) =>
    [...container.querySelectorAll("button")].find(
      (button) => button.textContent.trim() === translations.en.chronologyCheck
    );
  const moments = (container) =>
    [...container.querySelectorAll("ol > li")].map((row) => row.querySelector("p").textContent);

  try {
    // The right order, reached the way a player reaches it: one move at a time,
    // each its own click. A batch of clicks in one turn of the event loop would
    // all read the same arrangement, which is a property of the test and not of
    // the screen.
    const arranged = await open();
    for (let place = 0; place < question.steps.length; place += 1) {
      for (let guard = 0; guard < question.steps.length; guard += 1) {
        const rows = [...arranged.querySelectorAll("ol > li")];
        const from = rows.findIndex((row) => row.textContent.includes(question.steps[place]));
        if (from === place) break;
        const up = rows[from].querySelectorAll("button")[0];
        if (!up || up.disabled) break;
        await act(async () => up.click());
      }
    }
    assert.deepEqual(
      moments(arranged),
      question.steps,
      "the moments can be put in the order the lesson tells"
    );

    assert.ok(checkButton(arranged), "the question offers to be checked");
    await act(async () => checkButton(arranged).click());
    assert.ok(
      arranged.innerHTML.includes(translations.en.correct),
      "and the right order is announced as right"
    );
    assert.ok(
      arranged.innerHTML.includes(translations.en.chronologyFact),
      "with an explanation of what is on the screen"
    );
    for (const year of question.years) {
      assert.ok(arranged.innerHTML.includes(year), `the date ${year} is shown`);
    }
    await closeAll();

    // And the other way: the question is never handed over already in order, so
    // checking it as it stands is a wrong answer, and the screen has to say so.
    const asHandedOver = await open();
    await act(async () => checkButton(asHandedOver).click());
    assert.ok(
      asHandedOver.innerHTML.includes(translations.en.incorrect),
      "a wrong order is announced, in words"
    );
    assert.ok(
      asHandedOver.innerHTML.includes(translations.en.chronologyFact),
      "and it is explained rather than only refused"
    );
  } finally {
    await closeAll();
    globalThis.localStorage.removeItem("aq_lang");
  }
});

test("the picker offers the exam beside the three difficulties, and says how long it is", async () => {
  // The exam is a fourth way to sit a level, and it is not a difficulty: it is
  // the whole level, no clock, no hints, and nothing awarded. What is read here
  // is that it is offered where a player decides how to sit the level, and that
  // the number on it is the number the run really asks - the same number the
  // quiz builds its run from, chronology question included.
  const { DifficultyPicker, getLevels, translations } = await loadScreens();
  const { getLevelStudy } = await import("./level-study.js");
  const { quizQuestions } = await import("./question-bank.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const summary = getLevels("en").find((level) => level.id === 7);
  const level = { ...summary, study: getLevelStudy(7, "en") };
  const run = quizQuestions(level, "exam");
  const html = await draw(
    h(DifficultyPicker, { level, levelScores: {}, onSelect() {}, onBack() {} })
  );
  globalThis.localStorage.removeItem("aq_lang");

  const list = document.createElement("div");
  list.innerHTML = html;
  const exam = [...list.querySelectorAll("button")].find((button) =>
    button.textContent.includes(translations.en.examMode)
  );
  assert.ok(exam, "the difficulty picker offers the exam");
  assert.ok(
    exam.textContent.includes(translations.en.examModeDesc),
    "and says what makes it different"
  );
  assert.ok(
    exam.textContent.includes(String(run.length)),
    `the exam announces ${run.length} questions, the number the run asks`
  );
  // The exam is a superset of every difficulty rather than a fourth band: it
  // asks the whole level, so it can never be shorter than a practice run.
  for (const difficulty of ["easy", "medium", "hard"]) {
    assert.ok(
      run.length >= quizQuestions(level, difficulty).length,
      `the exam leaves out a question ${difficulty} asks`
    );
  }
});

test("the matching question asks who is who, and is checked as one question", async () => {
  // The second shape a run can take, after the chronology. What is read here is
  // that it is drawn from the lesson's own people, that a term is never shown
  // beside the description that belongs to it without being chosen, and that a
  // nearly right answer is a wrong one - the whole question is worth one point.
  const { QuizScreen, translations } = await loadScreens();
  const { getLevelStudy } = await import("./level-study.js");
  const { MATCHING_PAIRS, matchingQuestion } = await import("./matching.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const level = { ...LEVEL, id: 3, study: getLevelStudy(3, "en") };
  const question = matchingQuestion(level.study, level.id);

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const buttons = () => [...container.querySelectorAll("button")];
  const byText = (text) => buttons().find((button) => button.textContent.trim() === text);

  try {
    await act(async () => {
      root.render(h(QuizScreen, { level, difficulty: "easy", onBack() {}, onComplete() {} }));
    });

    // The run opens on the chronology; the matching question is the one after
    // it, reached the way a player reaches it: answer, then go on.
    await act(async () => byText(translations.en.chronologyCheck).click());
    await act(async () => byText(translations.en.continue).click());

    assert.ok(
      container.innerHTML.includes(translations.en.matchingQuestion),
      "the matching question says what it asks for"
    );
    assert.ok(!buttons().some((button) => button.getAttribute("aria-label") === translations.en.hint));

    // The descriptions are listed once, and each term is answered by choosing
    // one of their numbers. Every choice names the term it belongs to, so no
    // button is ever just "2" to a reader who cannot see the row it sits in.
    const groups = [...container.querySelectorAll('[role="radiogroup"]')];
    assert.equal(groups.length, MATCHING_PAIRS, "one row of choices per term");
    groups.forEach((group, index) => {
      const label = group.getAttribute("aria-label");
      assert.ok(label.includes(question.terms[index]), `row ${index + 1} is named after its term`);
      const choices = [...group.querySelectorAll('button[role="radio"]')];
      assert.equal(choices.length, MATCHING_PAIRS, `row ${index + 1}: one choice per description`);
      choices.forEach((choice) => assert.equal(choice.getAttribute("aria-checked"), "false"));
    });

    // Nothing chosen: the question cannot be checked, and nothing has been
    // marked on the screen.
    assert.ok(
      byText(translations.en.matchingCheck).disabled,
      "a blank answer is not checkable"
    );
    assert.ok(!container.innerHTML.includes(translations.en.incorrect));

    // Every term answered with the same description: a wrong answer to the
    // question, and the screen says so in words.
    for (const group of groups) {
      await act(async () => group.querySelector('button[role="radio"]').click());
    }
    assert.ok(!byText(translations.en.matchingCheck).disabled, "an answered question is checkable");
    await act(async () => byText(translations.en.matchingCheck).click());

    assert.ok(
      container.innerHTML.includes(translations.en.incorrect),
      "a wrong set of matches is announced, in words"
    );
    assert.ok(
      container.innerHTML.includes(translations.en.matchingFact),
      "and it is explained rather than only refused"
    );
    // Every term was given the first description, so exactly the terms whose own
    // description sits first are marked right - and the rest are marked wrong
    // rather than passed because two rows out of three were close.
    const marked = [...container.querySelectorAll("li")].filter((row) =>
      row.className.includes("border-emerald-400")
    );
    const expected = question.terms.filter((_term, index) => question.solution[index] === 0).length;
    assert.equal(
      marked.length,
      expected,
      "the rows whose first description was the right one are the rows marked right"
    );
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    globalThis.localStorage.removeItem("aq_lang");
  }
});

test("an exam says nothing until it is over, then marks the run and names what to work on", async () => {
  // The one thing that makes an exam an exam is that it says nothing while it
  // runs. Every other screen of this game marks each answer as it is given, and
  // a version of the exam that did so would be a practice run with the clock
  // off. So the run is walked for real here: nothing is judged on the way, the
  // mark arrives at the end, and the corrigé names the right answers.
  const { QuizScreen, translations } = await loadScreens();
  const { getLevelStudy } = await import("./level-study.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const level = { ...LEVEL, id: 7, study: getLevelStudy(7, "en") };
  const completed = [];

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const buttons = () => [...container.querySelectorAll("button")];
  const byText = (text) => buttons().find((button) => button.textContent.trim() === text);
  const onward = () => byText(translations.en.continue) || byText(translations.en.seeResults);
  /** The four answers of an ordinary question, told apart by their letter. */
  const options = () =>
    buttons().filter((button) => /^[A-D]$/.test((button.querySelector("span")?.textContent ?? "").trim()));

  try {
    await act(async () => {
      root.render(
        h(QuizScreen, {
          level,
          difficulty: "exam",
          onBack() {},
          onComplete: (result) => completed.push(result),
        })
      );
    });

    assert.ok(container.innerHTML.includes(translations.en.examMode), "the run says it is an exam");
    assert.ok(
      !buttons().some((button) => button.getAttribute("aria-label") === translations.en.hint),
      "and offers no hint an exam should not have"
    );
    assert.ok(
      !byText(translations.en.chronologyCheck),
      "and does not check the chronology as it goes"
    );

    // Walk the whole run: take the first answer everywhere and leave the
    // chronology as it is handed over, going on after each one.
    for (let step = 0; step < 20 && completed.length === 0; step += 1) {
      const answers = options();
      if (answers.length > 0) {
        assert.ok(onward().disabled, "an unanswered question cannot be left behind");
        await act(async () => answers[0].click());
        assert.ok(
          !container.innerHTML.includes(translations.en.incorrect),
          "and picking an answer is not judged on the way"
        );
        // A chosen answer only changes a colour, which is exactly what a
        // reader who cannot see the screen does not get, so it is said out
        // loud as well.
        assert.ok(
          (document.querySelector('[role="status"]')?.textContent ?? "").includes(translations.en.examChosen),
          "and the choice is announced rather than only coloured"
        );
      }

      const next = onward();
      assert.ok(next, "the run always has a way forward");
      assert.ok(!next.disabled, "and it can be taken once the question is answered");
      await act(async () => next.click());
    }

    assert.equal(completed.length, 1, "the run ends and hands back a mark");
    const result = completed[0];
    assert.equal(result.exam, true, "and says it was an exam");
    assert.equal(result.stars, 0, "an exam awards no stars");
    assert.equal(result.xp, 0, "and no XP");
    assert.ok(result.total > 0 && result.score <= result.total, "with a mark that can be read");

    // The screen that ends it says so, does not pretend the run was paid, and
    // names what to work on and what the right answer was.
    assert.ok(container.innerHTML.includes(translations.en.examResults), "the mark is named");
    assert.ok(container.innerHTML.includes(translations.en.examNotGraded), "and says nothing was awarded");
    // The badge names the exam rather than a difficulty: a multiplier printed
    // beside it would read as a setting somebody chose and lost XP on.
    assert.ok(container.innerHTML.includes(translations.en.examMode), "and the run is named an exam");
    assert.ok(!container.innerHTML.includes("0× XP"), "with no multiplier beside it");
    assert.ok(container.innerHTML.includes(translations.en.examMissed), "and heads the list of what to work on");
    assert.ok(
      container.innerHTML.includes(translations.en.examCorrectAnswer),
      "and names the right answer for each one"
    );
    assert.ok(container.innerHTML.includes(translations.en.printSheet), "and can be printed");
    // The chronology was left in the order it was handed over in, which is never
    // the order the lesson tells, so it is on that list.
    assert.ok(
      container.innerHTML.includes(translations.en.chronologyQuestion),
      "including the chronology that was left alone"
    );
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    globalThis.localStorage.removeItem("aq_lang");
  }
});

test("a description can be chosen with the arrow keys, and the focus follows", async () => {
  // A group of choices answers the arrow keys, not only Tab: a reader who has
  // just heard "one of three" reaches for the arrows, and a group that ignores
  // them reads as three unrelated buttons. What is read back here is the
  // selection moving and the focus moving with it, because a choice made
  // somewhere else on the page is a choice the next announcement misses.
  const { QuizScreen, translations } = await loadScreens();
  const { getLevelStudy } = await import("./level-study.js");
  const { matchingQuestion } = await import("./matching.js");

  globalThis.localStorage.setItem("aq_lang", "en");
  const level = { ...LEVEL, id: 3, study: getLevelStudy(3, "en") };
  const question = matchingQuestion(level.study, level.id);

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const byText = (text) =>
    [...container.querySelectorAll("button")].find((button) => button.textContent.trim() === text);
  const row = () => [...container.querySelectorAll('[role="radiogroup"]')][0];
  const choices = () => [...row().querySelectorAll('button[role="radio"]')];
  /** The first key of a row pressed \"on the button that holds the keyboard\". */
  const press = (key) =>
    act(async () => {
      choices()[0].dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    });

  try {
    await act(async () => {
      root.render(h(QuizScreen, { level, difficulty: "easy", onBack() {}, onComplete() {} }));
    });
    await act(async () => byText(translations.en.chronologyCheck).click());
    await act(async () => byText(translations.en.continue).click());

    assert.equal(choices().length, question.definitions.length, "the row offers one choice per description");

    // Nothing chosen: the arrow that walks forwards lands on the first
    // description, and the one that walks backwards on the last.
    choices()[0].focus();
    await press("ArrowLeft");
    assert.equal(choices().at(-1).getAttribute("aria-checked"), "true", "walking back from nothing picks the last");
    assert.equal(document.activeElement, choices().at(-1), "and the focus went with it");

    await press("ArrowRight");
    assert.equal(choices()[0].getAttribute("aria-checked"), "true", "the arrow walks on from the last to the first");
    assert.equal(document.activeElement, choices()[0], "still carrying the focus");
    assert.equal(
      choices()[1].getAttribute("aria-checked"),
      "false",
      "and only one description of a term is chosen at a time"
    );
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    globalThis.localStorage.removeItem("aq_lang");
  }
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

test("the lesson screen draws the whole study pack of a level", async () => {
  const { LessonScreen, getLevels, translations } = await loadScreens();
  // Read through the same module the screen reads, so the two cannot drift
  // apart and both be wrong: the test is a copy of nothing.
  const { getLevelStudy } = await import("./level-study.js");

  // The screen follows the language the browser is set to, so it is set here
  // rather than left to whatever the last run happened to store.
  globalThis.localStorage.setItem("aq_lang", "fr");
  const levelId = 3;
  // The lesson asks for its level when it is opened, so it is mounted rather
  // than rendered to a string, and waited for: the level arriving is the moment
  // the screen is worth reading.
  const html = await drawLive(
    h(LessonScreen, {
      levelId,
      onStartQuiz() {},
      onBack() {},
      onStudied() {},
      onFlashQuizAnswer() {},
    }),
    (markup) => markup.includes("Grand Zimbabwe")
  );
  globalThis.localStorage.removeItem("aq_lang");

  const level = getLevels("fr").find((candidate) => candidate.id === levelId);
  const study = getLevelStudy(levelId, "fr");

  assert.match(html, /Grand Zimbabwe/, "the level is named in the language asked for");
  assert.ok(html.includes(escapedText(study.essay[0])), "the history opens the lesson");
  assert.ok(html.includes(escapedText(study.essay[3])), "and it runs to more than one paragraph");

  // Every part of the pack is really drawn, and says the thing it is about: a
  // section that stopped being rendered would leave the lesson a caption again.
  [
    ["the timeline", study.timeline[0].text],
    ["the people", study.people[0].text],
    ["the places", study.places[0].text],
    ["the words", study.glossary[0].text],
  ].forEach(([part, text]) => {
    assert.ok(html.includes(escapedText(text)), `${part} of the lesson is on the screen`);
  });
  assert.ok(html.includes(escapedText(study.glossary[0].term)), "a word names its term");
  assert.ok(html.includes(escapedText(level.questions[0].fact)), "and the key points are still drawn");

  // And the sheet a teacher prints, which is drawn in print alone. It has to be
  // in the markup rather than built when the button is pressed, because
  // `window.print()` prints the page as it already is: a section assembled
  // afterwards would never reach the paper.
  const parsed = document.createElement("div");
  parsed.innerHTML = html;
  const worksheet = [...parsed.querySelectorAll("section")].find((section) =>
    section.className.includes("print:block")
  );
  assert.ok(worksheet, "the lesson carries a printable sheet");
  assert.ok(worksheet.className.includes("hidden"), "and it is off the screen, where the quiz is");
  assert.ok(
    worksheet.textContent.includes(translations.fr.worksheetTitle),
    "the sheet names itself"
  );
  for (const question of level.questions) {
    assert.ok(
      worksheet.textContent.includes(question.question),
      "every question of the level is on the sheet"
    );
  }

  // The key is the level's own answers, question for question: a printed answer
  // key that disagrees with the game is a sheet a class is marked wrong with.
  const key = [...worksheet.querySelectorAll("section")].find((section) =>
    section.textContent.includes(translations.fr.worksheetAnswerKey)
  );
  assert.ok(key, "the sheet carries an answer key");
  assert.deepEqual(
    [...key.querySelectorAll("ol > li")].map((line) => line.textContent.trim()),
    level.questions.map((question, index) => `${index + 1}. ${String.fromCharCode(65 + question.correct)}`),
    "and the key is the level's own answers"
  );
});

test("a level is named in full by the screen that lists the lessons", async () => {
  // The study list used to keep the state of a level and its mastery in a
  // column of their own on the right, and draw the name of the level in what
  // was left: about a hundred and twenty pixels on a phone, which is three
  // words. Fourteen of the twenty names came out cut short, and a reader could
  // not tell "Kingdom of Kush" from "Kingdom of Axum".
  //
  // jsdom lays nothing out, so what is read back here is not how wide the
  // column is but what it holds: the name carries no truncation of its own, and
  // the state is written under the name rather than beside it.
  const { LearnScreen, getLevels, translations } = await loadScreens();
  const levels = getLevels("en");
  const html = await draw(h(LearnScreen, { progress: PLAYED_PROGRESS, onOpenLesson() {} }));

  const list = document.createElement("div");
  list.innerHTML = html;
  const names = [...list.querySelectorAll("h3")];
  assert.equal(names.length, levels.length, "every level of the list names itself");

  const cut = names.filter((name) => /truncate|ellipsis|line-clamp/.test(name.className));
  assert.deepEqual(
    cut.map((name) => name.textContent),
    [],
    "these names are drawn with an ellipsis waiting to happen"
  );

  const beside = names.filter((name) => {
    const column = name.parentElement.textContent;
    const state = column.includes(translations.en.studied) || column.includes(translations.en.notStudied);
    return !state || !column.includes(translations.en.mastery);
  });
  assert.deepEqual(
    beside.map((name) => name.textContent),
    [],
    "these keep their state outside the column the name is drawn in"
  );
});

test("the other screens a reader opens are drawn and audited too", async () => {
  // The four screens above carry the application, and the rest of it is opened
  // from the settings screen, from a card, from the review inbox or from a
  // lesson. They are drawn here for the same reason: a screen that throws while
  // it draws, or one that hands axe a fault, is a screen a player meets as a
  // blank page. Each page is mounted inside a router because it carries its way
  // back to the game as a link.
  const screens = await loadScreens();
  const {
    LearnScreen,
    ReviewSession,
    DifficultyPicker,
    LevelGallery,
    FlashQuiz,
    KnowledgeMap,
    Bibliography,
    PhotoCredits,
    Android,
    StartupLanguage,
    About,
    PrivacyPolicy,
    TermsOfService,
  } = screens;

  const photo = {
    file: "/photos/level-1-1.jpg",
    caption: "The pyramids of Giza, built as royal tombs more than 4,500 years ago.",
    credit: "Unsplash",
    author: "Unsplash",
    licence: "Unsplash",
    source: "https://example.org/photo",
  };

  const drawn = [
    ["the study list", h(LearnScreen, { progress: PLAYED_PROGRESS, onOpenLesson() {} })],
    [
      "the review session",
      h(ReviewSession, {
        items: [{ levelId: 1, index: 0, question: LEVEL.questions[0] }],
        title: "Review",
        subtitle: "Come back",
        region: "North Africa",
        onExit() {},
      }),
    ],
    ["the difficulty picker", h(DifficultyPicker, { level: LEVEL, levelScores: {}, onSelect() {}, onBack() {} })],
    ["the level gallery", h(LevelGallery, { photos: [photo] })],
    ["the flash quiz", h(FlashQuiz, { items: [{ index: 0, question: LEVEL.questions[0] }], onAnswer() {} })],
    [
      "the knowledge map",
      h(KnowledgeMap, {
        questionStats: PLAYED_PROGRESS.question_stats,
        onReviewLevel() {},
      }),
    ],
    ["the bibliography", h(Bibliography)],
    ["the photo credits", h(PhotoCredits)],
    ["the Android app", h(Android)],
    ["the language screen", h(StartupLanguage, { onChoose() {} })],
    ["the about page", h(About)],
    ["the privacy notice", h(PrivacyPolicy)],
    ["the terms of use", h(TermsOfService)],
  ];

  for (const [what, element] of drawn) {
    // Both providers, for the same reason the teacher page is drawn with them:
    // a screen that reads the query cache is one nobody can mount without it,
    // and a page carries its way back to the game as a link. A screen that draws
    // nothing is named, so the failure says which one rather than only that one
    // of them is empty.
    try {
      await draw(
        h(
          QueryClientProvider,
          { client: queryClient() },
          h(MemoryRouter, { initialEntries: ["/"] }, element)
        )
      );
    } catch (error) {
      assert.fail(`${what}: ${error.message}`);
    }
  }
});

test("the sheets that can be open while the language changes are drawn directly", () => {
  // The settings sheet is the one sheet from which the language is chosen, so
  // it is the one that can be open while the whole application re-renders. Handed
  // to AnimatePresence, the pair that was leaving was never taken back out of the
  // document after such a re-render: the sheet stayed behind, invisible, and its
  // scrim covered the page, on which nothing could be clicked any more until the
  // tab was reloaded. Both sheets therefore animate in and not out, and this is
  // what refuses a return to the shape that failed.
  for (const file of [
    "src/components/game/SettingsModal.jsx",
    "src/components/game/HintModal.jsx",
  ]) {
    const source = readFileSync(path.join(ROOT, file), "utf8");
    // The word may be written in a comment that explains why not; it is the
    // element that is refused.
    assert.doesNotMatch(
      source,
      /<AnimatePresence/,
      `${file} hands its sheet back to AnimatePresence, which can leave it in the page`
    );
  }
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
