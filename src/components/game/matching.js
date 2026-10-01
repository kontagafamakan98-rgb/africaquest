/**
 * The matching question: the second shape a question can take, after the
 * chronology.
 *
 * A run used to open on a chronology and then ask four answers to choose
 * between, question after question. A player who has learned the trick of that
 * shape - the right option is the one that reads like a sentence from the lesson
 * - is answering a different game from the one the lesson played. Matching is
 * the other half of what a lesson teaches: not the order of events but who is
 * who. The lesson already keeps that material in its own sections, the people it
 * names, the places it visits and the words it defines, and each entry is
 * already written out in both languages with the description that belongs to it.
 *
 * So the question is assembled from those sections rather than written here, for
 * the reason the chronology is assembled from the timeline: a question built
 * from the lesson can never disagree with the lesson it comes from, costs no
 * translation, and is repaired the day the lesson is. The names come from the
 * first section the lesson holds enough of, and the descriptions are the
 * lesson's own sentences, shown in an order that is never the one they belong in.
 *
 * What is checked about it - that every level has three usable pairs and that no
 * description is ever shown beside the name it belongs to - lives in
 * matching.test.js, because a matching question whose answers were already
 * lined up would teach the reverse of nothing while every screen still drew it.
 */

// The two halves of the chronology are exactly what a matching question needs:
// the pairs are spread across the lesson the way the moments of a timeline are,
// and the descriptions are shuffled the way the moments are, seeded the same way
// and never left in their own order.
import { shuffledOrder, spreadMoments } from "./chronology.js";

/**
 * How many pairs one matching question asks.
 *
 * Three, where a lesson holds five of each. Four pairs on a phone is a screen of
 * scrolling between a name and the description that belongs to it, and two would
 * be a coin toss: three is the smallest number where knowing one pair does not
 * give away the others.
 */
export const MATCHING_PAIRS = 3;

/**
 * The lesson sections a question can be built from, in the order they are worth
 * asking, and the field that names the left half of each pair.
 *
 * The people come first because a name is the shortest thing a player can hold
 * and the description that follows it is the lesson's own sentence about them.
 * The places are read next, and the glossary last, whose left half is a word
 * rather than a name: all three ask the same thing, which is whether the reader
 * took in what the lesson said about each one.
 */
const SOURCES = [
  { section: "people", name: "name" },
  { section: "places", name: "name" },
  { section: "glossary", name: "term" },
];

const readable = (value) => typeof value === "string" && value.trim().length > 0;

/**
 * The pairs a lesson can be matched from, from the first section it holds enough
 * of.
 *
 * A pair is only usable when both halves are written: a name with no
 * description, or a description with no name, would draw as an empty row and be
 * counted as a question the player cannot answer. A section with fewer than
 * three usable pairs is skipped rather than padded from another one, because a
 * matching question mixing the people with the words would be two questions
 * wearing one heading.
 *
 * @param {object} [study] the study pack of a level, as the lesson reads it
 * @returns {Array<{ left: string, right: string }>} the pairs, or nothing
 */
function usablePairs(study) {
  for (const { section, name } of SOURCES) {
    const entries = Array.isArray(study?.[section]) ? study[section] : [];
    const pairs = entries
      .filter((entry) => entry && readable(entry[name]) && readable(entry.text))
      .map((entry) => ({ left: entry[name].trim(), right: entry.text.trim() }));
    if (pairs.length >= MATCHING_PAIRS) return pairs;
  }
  return [];
}

/**
 * The matching question of a level, or null when its lessons cannot carry one.
 *
 * Null is the honest answer for a lesson with fewer than three named pairs, and
 * not an empty question: the run simply asks what it has, and it is the content
 * test that refuses a lesson published that way rather than a player meeting a
 * screen with two rows and a third that cannot be filled.
 *
 * The question carries no `__index`, and that is deliberate for the same reason
 * the chronology carries none: the review memory is keyed by the position a
 * question holds in the bank it was written in, and this one holds none. It is
 * scored with the rest of the run, and it does not enter the rotation.
 *
 * `solution` is the whole question in one array: for the term at position `i`,
 * the position in `definitions` where its own description is shown. Every screen
 * and the marking read that one array, so a row cannot be drawn against one
 * answer and judged against another.
 *
 * @param {object} [study] the study pack of a level, as the lesson reads it
 * @param {number} [seed] what decides the order the descriptions are shown in
 * @returns {{ type: "match", terms: string[], definitions: string[], solution: number[] }|null}
 */
export function matchingQuestion(study, seed = 0) {
  const pairs = usablePairs(study);
  if (pairs.length < MATCHING_PAIRS) return null;

  const chosen = spreadMoments(pairs.length, MATCHING_PAIRS).map((position) => pairs[position]);
  // Seeded one past the chronology's, so the two questions of one level do not
  // move together: the same shuffle twice is a pattern a player learns instead
  // of an answer.
  const order = shuffledOrder(chosen.length, seed + 1);

  return {
    type: "match",
    terms: chosen.map((pair) => pair.left),
    // The descriptions as they are shown, in the order they are shown in.
    definitions: order.map((position) => chosen[position].right),
    // For each term, where its own description sits in the list above.
    solution: chosen.map((_pair, index) => order.indexOf(index)),
  };
}

/**
 * A blank sheet for one matching question: nothing chosen anywhere yet.
 *
 * Minus one rather than zero, because zero is a real position in the list of
 * descriptions and a blank that read as "the first one" would be an answer the
 * player never gave.
 *
 * @param {{ terms?: string[] } | null | undefined} question
 * @returns {number[]} one blank per term
 */
export function emptyAssignment(question) {
  const terms = Array.isArray(question?.terms) ? question.terms : [];
  return terms.map(() => -1);
}

/**
 * Whether a player's matches are the lesson's: every term beside its own
 * description. One question, one point, so a nearly right answer is a wrong one;
 * the feedback says which rows are right, and the score counts the question.
 *
 * An assignment of the wrong length is not an answer, and neither is one that
 * leaves a term blank: every position has to hold a description, and it has to
 * be the right one.
 *
 * @param {{ solution?: number[] } | null | undefined} question
 * @param {number[]|null} assignment the position chosen for each term
 * @returns {boolean}
 */
export function isMatchingRight(question, assignment) {
  const solution = Array.isArray(question?.solution) ? question.solution : [];
  if (solution.length === 0) return false;
  if (!Array.isArray(assignment) || assignment.length !== solution.length) return false;
  return solution.every((place, index) => assignment[index] === place);
}

/**
 * What the player matched, in words, for a corrigé read back.
 *
 * A term left blank is dropped rather than written as "undefined": the caller
 * adds its own words for an empty answer, because the wording belongs to the
 * translations and not to a module that knows none of them.
 *
 * @param {{ terms?: string[], definitions?: string[] } | null | undefined} question
 * @param {number[]|null} assignment
 * @returns {string}
 */
export function matchingGivenText(question, assignment) {
  const terms = Array.isArray(question?.terms) ? question.terms : [];
  const definitions = Array.isArray(question?.definitions) ? question.definitions : [];
  if (!Array.isArray(assignment)) return "";
  return terms
    .map((term, index) => {
      const chosen = definitions[assignment[index]];
      return chosen ? `${term}: ${chosen}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}

/**
 * The matches the lesson tells, in words, for the same corrigé.
 *
 * @param {{ terms?: string[], definitions?: string[], solution?: number[] } | null | undefined} question
 * @returns {string}
 */
export function matchingRightText(question) {
  const terms = Array.isArray(question?.terms) ? question.terms : [];
  const definitions = Array.isArray(question?.definitions) ? question.definitions : [];
  const solution = Array.isArray(question?.solution) ? question.solution : [];
  return terms.map((term, index) => `${term}: ${definitions[solution[index]]}`).join(" · ");
}
