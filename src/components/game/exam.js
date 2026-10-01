/**
 * Marking a run of questions.
 *
 * A run of the game used to be marked as it was played: each answer was judged
 * the moment it was given, and the score was the count of verdicts the player
 * had already seen. That is the right shape for practice and the wrong one for
 * a test, and it is why the exam needed a second way of counting rather than a
 * flag on the first.
 *
 * What this module holds is that second way, and only that: what a player gave
 * to a question, whether that answer is right, and the mark of a finished run
 * with the questions it did not get. It knows nothing about screens, clocks or
 * hints, and nothing about which question is which kind beyond the one field
 * that tells a chronology from an ordinary one. So the marking can be read and
 * tested on its own, which is what exam.test.js does.
 *
 * The two shapes of answer are the two the game asks for: a choice among four,
 * and an arrangement of moments. A question nobody answered is `null` rather
 * than an invented answer, because an exam has to be able to say that a
 * question was left blank.
 */

import { isChronological } from "./chronology.js";
import { isMatchingRight, matchingGivenText, matchingRightText } from "./matching.js";

/**
 * What a player gave to one question: the index they picked, the arrangement
 * they left, or null when they gave nothing.
 *
 * @typedef {{ choice: number } | { order: number[] } | { match: number[] } | null} Answer
 */

/**
 * The two kinds of question a run can ask, as the marking reads them: an
 * ordinary one, with its four options and the index of the right one, and a
 * chronology, with the moments in the order the lesson tells them.
 *
 * @typedef {{
 *   type?: string,
 *   correct?: number,
 *   options?: string[],
 *   steps?: string[],
 *   terms?: string[],
 *   definitions?: string[],
 *   solution?: number[]
 * }} Question
 */

/**
 * An empty answer sheet, one blank per question.
 *
 * @param {number} count how many questions the run asks
 * @returns {Answer[]} one null per question
 */
export function emptyAnswers(count) {
  return Array.from({ length: Math.max(0, count) }, () => null);
}

/**
 * Whether one answer is the right one.
 *
 * A question with no answer is wrong, and so is an answer of the wrong shape -
 * a choice handed to a chronology, an arrangement handed to a multiple choice.
 * Neither can happen through the screens, and both are refused here rather than
 * trusted, because a mark is the one number a teacher repeats out loud.
 *
 * @param {Question | null | undefined} question
 * @param {Answer} [answer]
 * @returns {boolean}
 */
export function answerIsRight(question, answer) {
  if (!question || !answer) return false;
  if (question.type === "match") {
    return "match" in answer && isMatchingRight(question, answer.match);
  }
  if (question.type === "order") {
    if (!("order" in answer)) return false;
    // An arrangement of the wrong length is not an answer, whatever it holds:
    // three of four moments in their right places is a short answer rather than
    // a right one, and `isChronological` alone reads it as right, because every
    // position it was given is the position it should hold.
    const steps = Array.isArray(question.steps) ? question.steps : null;
    if (steps && answer.order.length !== steps.length) return false;
    return isChronological(answer.order);
  }
  return "choice" in answer && answer.choice === question.correct;
}

/**
 * A finished run, marked: how many were right, and which ones were not.
 *
 * The wrong ones are handed back by position rather than by question, because
 * the caller still holds the run and the two lists are the same length by
 * construction. Nothing is sorted: the questions come back in the order they
 * were asked, which is the order the run was taught in and the order a reader
 * goes down the corrigé.
 *
 * @param {Question[]} questions the run that was asked
 * @param {Answer[]} answers what the player gave, one per question
 * @returns {{ score: number, total: number, missed: Array<{ index: number, answer: Answer }> }}
 */
export function gradeRun(questions, answers) {
  const list = Array.isArray(questions) ? questions : [];
  const missed = [];
  let score = 0;

  list.forEach((question, index) => {
    const answer = Array.isArray(answers) ? answers[index] ?? null : null;
    if (answerIsRight(question, answer)) score += 1;
    else missed.push({ index, answer });
  });

  return { score, total: list.length, missed };
}

/**
 * What the player gave to one question, in words, for a corrigé read back.
 *
 * An unanswered question comes back as an empty string rather than as a
 * sentence, because the wording of "you left this blank" belongs to the
 * translations and not to a module that knows none of them. The caller shows
 * its own words when there is nothing here.
 *
 * @param {Question} question
 * @param {Answer} answer
 * @returns {string} the words of the answer, or an empty string
 */
export function answerText(question, answer) {
  if (!question || !answer) return "";
  if (question.type === "match") {
    return "match" in answer ? matchingGivenText(question, answer.match) : "";
  }
  if (question.type === "order") {
    if (!("order" in answer)) return "";
    return orderText(question.steps, answer.order);
  }
  if (!("choice" in answer)) return "";
  return question.options?.[answer.choice] ?? "";
}

/**
 * The right answer to one question, in words, for the same corrigé.
 *
 * @param {Question} question
 * @returns {string} the words of the right answer, or an empty string
 */
export function rightText(question) {
  if (!question) return "";
  if (question.type === "match") return matchingRightText(question);
  if (question.type === "order") return orderText(question.steps, null);
  return question.options?.[question.correct ?? -1] ?? "";
}

/**
 * A chronology read out as one line: the moments in the order they happened.
 *
 * Shown after the answer rather than before, the right order is the lesson's
 * own, so a null arrangement is the lesson's order and a player's arrangement
 * is read through the same mapping. A moment the data does not hold is dropped
 * rather than left as "undefined" in the middle of the answer.
 *
 * @param {string[]|undefined} steps the moments, in the order the lesson tells
 * @param {number[]|null} arrangement the positions a player arranged, or null
 * @returns {string}
 */
function orderText(steps, arrangement) {
  const list = Array.isArray(steps) ? steps : [];
  const order = Array.isArray(arrangement)
    ? arrangement
    : list.map((_moment, index) => index);
  return order.map((moment) => list[moment]).filter(Boolean).join(" · ");
}
