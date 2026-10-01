/**
 * The content of a level, asked for one level at a time.
 *
 * The whole game lives in gameData.js, which is what the screens that really
 * need every level read: the review inbox, the bibliography, the statistics.
 * A lesson is not one of them. It shows one level, so it asks the browser for
 * one level, and the twenty-six modules below are what the bundler turns into
 * twenty-six requests instead of one of four hundred kilobytes. The study material
 * travels with each level for the same reason: a lesson draws its own history,
 * timeline, people, places and words, and not the nineteen other lessons.
 *
 * Each module is written by scripts/generate-level-content.mjs from the same
 * three tables the rest of the game is written from, and the tests hold a level
 * loaded this way to the level the whole game holds, field for field. So there
 * is one level, read through two doors, rather than two levels that agree today.
 *
 * A level that does not exist is `null` here, the same way an unknown address is
 * a page that says so rather than a crash.
 */

import { localizeLevel } from "./localize-level.js";
import { servedPath } from "../../lib/base-path.js";

const LOADERS = {
  1: () => import("./levels/level-01.js"),
  2: () => import("./levels/level-02.js"),
  3: () => import("./levels/level-03.js"),
  4: () => import("./levels/level-04.js"),
  5: () => import("./levels/level-05.js"),
  6: () => import("./levels/level-06.js"),
  7: () => import("./levels/level-07.js"),
  8: () => import("./levels/level-08.js"),
  9: () => import("./levels/level-09.js"),
  10: () => import("./levels/level-10.js"),
  11: () => import("./levels/level-11.js"),
  12: () => import("./levels/level-12.js"),
  13: () => import("./levels/level-13.js"),
  14: () => import("./levels/level-14.js"),
  15: () => import("./levels/level-15.js"),
  16: () => import("./levels/level-16.js"),
  17: () => import("./levels/level-17.js"),
  18: () => import("./levels/level-18.js"),
  19: () => import("./levels/level-19.js"),
  20: () => import("./levels/level-20.js"),
  21: () => import("./levels/level-21.js"),
  22: () => import("./levels/level-22.js"),
  23: () => import("./levels/level-23.js"),
  24: () => import("./levels/level-24.js"),
  25: () => import("./levels/level-25.js"),
  26: () => import("./levels/level-26.js"),
};

/** The ids a level module was written for, in order. */
export const LEVEL_CONTENT_IDS = Object.keys(LOADERS)
  .map(Number)
  .sort((a, b) => a - b);

/**
 * The content of one level, in both languages, as it is stored.
 *
 * The module itself rather than the level, because a caller that wants the two
 * languages - a test, a generator - should not have to load the level twice.
 *
 * @param {number|string} levelId
 * @returns {Promise<{ default: object }|null>}
 */
export function loadLevelContent(levelId) {
  const load = LOADERS[Number(levelId)];
  return load ? load() : Promise.resolve(null);
}

/**
 * One level, ready for a screen: its wording in the language on screen, the
 * study pack and the gallery that go with it.
 *
 * @param {number|string} levelId
 * @param {string} [lang]
 * @returns {Promise<object|null>}
 */
export async function loadLevel(levelId, lang = "en") {
  const module = await loadLevelContent(levelId);
  const content = module?.default;
  if (!content) return null;

  const code = lang === "fr" ? "fr" : "en";
  return {
    ...localizeLevel(content, lang),
    // The study pack and the gallery are keyed by language rather than nested
    // in the level's wording, so they are chosen here: it keeps the translation
    // logic about text only, and both languages carry the same shape.
    study: content.study?.[code] || content.study?.en || null,
    // Each photograph is put under the path the application is served from as
    // it is handed over, because the module carries the file as the photograph
    // table names it and a module cannot know that path: a lesson published
    // under a directory would ask for /photos/ and be shown nothing at all,
    // which is what a gallery of captions with no pictures is.
    gallery: (content.gallery?.[code] || content.gallery?.en || []).map((photo) => ({
      ...photo,
      file: servedPath(photo.file),
    })),
  };
}
