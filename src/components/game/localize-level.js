/**
 * One level, in the language on screen.
 *
 * The levels are authored in English, and the French wording travels with the
 * level itself, under `fr`. Only the wording is swapped: the icon, the colour,
 * the order and the right answer index always come from the English entry, so a
 * translation can never mark a different answer than the one the question was
 * written with. A missing or mismatched translation falls back to English rather
 * than showing a blank, or worse, pairing a question with another question's
 * answers.
 *
 * It is a module of its own because a level is now read in two places that must
 * not share their weight: the whole game, assembled by gameData.js, and the one
 * level a lesson downloads. Both go through this one function, so the two cannot
 * disagree about what translating a level means.
 *
 * @param {object} level the English level, with its French wording under `fr`
 * @param {string} [lang] the language on screen
 * @returns {object} the same level, with its wording in that language
 */
export function localizeLevel(level, lang) {
  if (lang !== "fr") return level;

  const translated = level.fr;
  if (!translated) return level;
  // Question for question, otherwise we keep the English set rather than risk
  // pairing a question with another question's answers.
  if (!Array.isArray(translated.questions) || translated.questions.length !== level.questions.length) {
    return level;
  }

  return {
    ...level,
    title: translated.title || level.title,
    subtitle: translated.subtitle || level.subtitle,
    region: translated.region || level.region,
    questions: level.questions.map((question, index) => {
      const fr = translated.questions[index] || {};
      const options =
        Array.isArray(fr.options) && fr.options.length === question.options.length
          ? fr.options
          : question.options;
      return {
        ...question,
        question: fr.question || question.question,
        options,
        fact: fr.fact || question.fact,
        // Only the reference wording is translated; the link stays the one
        // verified for the English entry, so a translation can never point at
        // a page nobody checked.
        source: question.source
          ? { ...question.source, label: fr.source || question.source.label }
          : question.source,
      };
    }),
  };
}
