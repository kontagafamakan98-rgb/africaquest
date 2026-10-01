import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

// The first screen of the application, and the one decision it asks for.
//
// The game is bilingual, and until a language is chosen there is no wording to
// draw: an English line under a French button is a guess about the reader, and
// the guess this screen exists to remove. What is checked here is that both
// wordings are really drawn, that each is marked in its own language for a
// screen reader, and that the screen is what the application draws until the
// choice is made rather than something a reader can dismiss or play past.
//
// The screen is read as text, the way the rest of the house rules are: what
// matters is the two languages it offers and the key it writes, neither of which
// a render alone would tell apart from a hardcoded default.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

const screen = read("src/components/StartupLanguage.jsx");
const app = read("src/App.jsx");
const i18n = read("src/components/i18n.jsx");

test("both languages are offered, each written in its own language", () => {
  assert.match(screen, /code: "fr"[\s\S]*label: "Français"/, "the French button is named in French");
  assert.match(screen, /code: "en"[\s\S]*label: "English"/, "the English button is named in English");
  assert.match(screen, /Choisissez votre langue/, "the French prompt is drawn before a language is chosen");
  assert.match(screen, /Choose your language/, "and so is the English one");

  // Each line is marked with the language it is written in, so a screen reader
  // pronounces the French one as French and the English one as English.
  assert.match(screen, /lang={code}/, "the offered wording is not marked with its own language");

  // The mark is the one the tab and the launcher icon are drawn from, addressed
  // under the path the site is served from.
  assert.match(screen, /servedPath\("favicon\.svg"\)/, "the startup mark is not the application's own");
  assert.match(screen, /alt=""/, "a decorative mark is read out as if it said something");
  assert.match(screen, /active:scale-\[0\.99\]/, "the choice does not answer a press");
});

test("the language screen is what is drawn until a language is chosen", () => {
  // The state comes from the key the rest of the application reads, and its
  // absence is the whole answer: nothing else has to be stored to know that a
  // device has never chosen.
  assert.match(i18n, /export function hasChosenLang\(\)/, "nothing says whether a language was chosen");
  assert.match(i18n, /hasChosenLang\(\)[\s\S]{0,80}aq_lang/, "the answer does not come from the stored language");
  assert.match(i18n, /return localStorage\.getItem\("aq_lang"\) !== null/, "an empty key would read as a choice");

  assert.match(app, /useState\(hasChosenLang\)/, "the application does not ask whether a choice was made");
  assert.match(app, /languageChosen \? \(/, "the game is drawn without a language");
  assert.match(app, /<StartupLanguage onChoose={chooseLanguage} \/>/, "the language screen is never drawn");
  assert.match(app, /setLang\(code\)/, "choosing a language does not change the language");
  assert.match(app, /setLanguageChosen\(true\)/, "choosing a language does not leave the screen");

  // And the screen is the whole of what is drawn: no router, no game screen,
  // nothing a reader could reach with no language chosen. The two branches of
  // the choice are read apart, since what matters is which one is which.
  const chosen = app.slice(app.indexOf("languageChosen ? ("), app.indexOf(") : ("));
  const notChosen = app.slice(app.indexOf(") : ("), app.indexOf("</AppCrash>"));
  assert.match(chosen, /<Router/, "the game is not what is drawn once a language is chosen");
  assert.ok(!chosen.includes("<StartupLanguage"), "the language screen is drawn beside the game");
  assert.match(notChosen, /<StartupLanguage/, "nothing is drawn before a language is chosen");
  assert.ok(!notChosen.includes("<Router"), "the game is reachable with no language chosen");
});
