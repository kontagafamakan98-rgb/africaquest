/**
 * The flash quiz: a short self check shown at the end of a lesson, before the
 * graded quiz. It gives no stars and no XP, but a question missed here does join
 * the review rotation: forgetting something a minute after reading it is exactly
 * what spaced repetition is for.
 */

/** How many questions a flash quiz asks. */
export const FLASH_QUIZ_SIZE = 3;

/**
 * Questions to ask in the flash quiz, spread across the whole level so the check
 * is not limited to the opening of the lesson. Picking is deterministic on
 * purpose: the same lesson always gives the same three questions, so the result
 * is comparable between attempts.
 *
 * Each item carries its position in the original level. The review memory is
 * keyed by that position, so losing it would record an answer against the wrong
 * question and bring back something the player never got wrong.
 */
export function pickFlashQuizQuestions(questions = [], size = FLASH_QUIZ_SIZE) {
  if (!Array.isArray(questions) || questions.length === 0 || size <= 0) return [];

  const positions = [];
  if (questions.length <= size) {
    for (let index = 0; index < questions.length; index += 1) positions.push(index);
  } else if (size === 1) {
    positions.push(0);
  } else {
    const stride = (questions.length - 1) / (size - 1);
    for (let step = 0; step < size; step += 1) positions.push(Math.round(step * stride));
  }

  return positions.map((index) => ({ index, question: questions[index] }));
}

/**
 * How the attempt reads, so the player knows whether to start the real quiz or
 * go back to the lesson first. "ready" needs a clean sheet: a self check that
 * still gets something wrong is a signal, not a pass.
 */
export function quickQuizVerdict(correct, total) {
  if (!(total > 0)) return "review";
  if (correct >= total) return "ready";
  if (correct * 3 >= total * 2) return "close";
  return "review";
}

/** i18n key for each verdict, kept next to the verdicts themselves. */
export const FLASH_QUIZ_VERDICT_KEYS = {
  ready: "flashQuizReady",
  close: "flashQuizClose",
  review: "flashQuizReview",
};

/**
 * Facts behind the questions that were missed, in the order they were asked and
 * without repeating a point that two questions happened to share. This is what
 * the player is invited to reread before starting the quiz.
 */
export function flashQuizMissedFacts(questions = [], answers = []) {
  const facts = [];
  questions.forEach((question, index) => {
    if (answers[index] !== false) return;
    const fact = question?.fact;
    if (typeof fact === "string" && fact.trim() !== "" && !facts.includes(fact)) {
      facts.push(fact);
    }
  });
  return facts;
}
