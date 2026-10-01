import {
  Anchor, Building2, Castle, Church, Coins, Crown, Flag, Footprints, Gem, Globe,
  Hammer, Landmark, Map, Mountain, Rocket, Scale, Scroll, Shield, Ship, Swords,
} from "lucide-react";
import { servedPath } from "../../lib/base-path.js";
// The facts themselves are written by scripts/generate-level-facts.mjs, from the
// level table, the French wording and the photograph table. This module turns
// them into what a screen can draw, and is the only door the first screen uses:
// the questions, the lesson stories and the rest of the gallery live in
// gameData.js and level-images.js, which are fetched right after the map.
import { AVIF_FILES, CARD_FILES, LEVEL_FACTS } from "./level-facts.js";

/**
 * The brief of the game, ready for the screen that is shown first.
 *
 * The map draws twenty cards, and a card needs a title in the language on
 * screen, its place in the timeline, an icon, a colour and a picture. That is
 * everything here, and it is deliberately the only copy of those facts the entry
 * file carries: without it the map would wait for the quiz, the lessons and
 * sixty photographs before painting anything.
 *
 * The icon is named in the facts and resolved here, because a component cannot
 * be written down in a generated file. Every name used by the levels is in the
 * map below, and the tests refuse a fact whose icon is not.
 */
const ICONS = {
  Anchor, Building2, Castle, Church, Coins, Crown, Flag, Footprints, Gem, Globe,
  Hammer, Landmark, Map, Mountain, Rocket, Scale, Scroll, Shield, Ship, Swords,
};

/** The twenty levels, in the order they are stored, with their card picture ready. */
export const LEVEL_SUMMARIES = LEVEL_FACTS.map((fact) => ({
  id: fact.id,
  order: fact.order,
  era: fact.era,
  from: fact.from,
  title: fact.title,
  subtitle: fact.subtitle,
  region: fact.region,
  color: fact.color,
  icon: ICONS[fact.icon],
  image: servedPath(fact.image),
  questionCount: fact.questionCount,
  fr: fact.fr,
}));

/** The picture on each level's card, as the browser has to ask for it. */
export const LEVEL_IMAGES = Object.fromEntries(
  LEVEL_SUMMARIES.map((level) => [level.id, level.image])
);

/**
 * The photographs that also ship an AVIF, as the browser has to ask for them.
 *
 * Whether a picture has one is recorded in the photograph table as a
 * fingerprint, written by the script that made the file, and the generated list
 * is read from those fingerprints rather than from a list of names kept beside
 * them. A browser cannot ask for a file and fall back when it is not there: a
 * source that cannot be loaded shows no picture at all, so a photograph without
 * one is offered as WebP alone.
 */
export const AVIF_PHOTOS = new Set(AVIF_FILES.map((file) => servedPath(file)));

/**
 * The photographs that also ship a copy at the width of a card.
 *
 * The map draws twenty cards and they are the first screen a reader downloads:
 * five hundred kilobytes of pictures for a hundred and seventy of application.
 * Those cards are three hundred and fifty eight pixels wide on a phone, and the
 * light version of the same picture is six hundred and forty across, so a copy
 * is written at four hundred and eighty for the screens that ask for no more.
 * Whether a given picture has one is recorded as a fingerprint by the script
 * that writes the files, exactly as the AVIF is, and a browser cannot ask for a
 * file and fall back when it is not there: a picture without a copy is drawn
 * from the light version alone.
 */
export const CARD_PHOTOS = new Set(CARD_FILES.map((file) => servedPath(file)));

/** How many questions the game asks in total, from the brief alone. */
export const TOTAL_QUESTIONS = LEVEL_SUMMARIES.reduce(
  (sum, level) => sum + level.questionCount,
  0
);

/**
 * The levels as a screen displays them, in the order the timeline runs.
 *
 * A missing French wording falls back to the English one, exactly as the full
 * levels do, so switching the language can never leave a gap on a card.
 *
 * The result is kept, one list per language, because none of it can change
 * while the application is running: the facts are a generated file, the order is
 * the writing of that file, and the language is one of two. The map paints on
 * every frame that the clock ticks, and rebuilding twenty cards each time to
 * throw them away is work nobody asked for; two lists, built once, are what a
 * map of twenty cards costs. The same list object comes back for the same
 * language, which is also what lets a caller hand it to a dependency array.
 */
// Kept in an object rather than a Map, and not by preference: this module
// imports the Map *icon* from the icon set, which shadows the constructor of the
// same name, so `new Map()` here is a TypeError and nothing else.
const summariesByLang = { en: null, fr: null };

export function getLevelSummaries(lang = "en") {
  const code = lang === "fr" ? "fr" : "en";
  const kept = summariesByLang[code];
  if (kept) return kept;

  const levels = [...LEVEL_SUMMARIES]
    .sort((a, b) => a.order - b.order)
    .map((level) => {
      const french = code === "fr" ? level.fr : null;
      return {
        ...level,
        title: french?.title || level.title,
        subtitle: french?.subtitle || level.subtitle,
        region: french?.region || level.region,
      };
    });

  summariesByLang[code] = levels;
  return levels;
}
