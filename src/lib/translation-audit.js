/**
 * What the French side of the game has to cover, checked in one place.
 *
 * A missing translation is not something a compiler can see: the screen simply
 * shows English wording under a French interface. So the content is compared
 * here, by a function of the data, and the same check is run by the build
 * (scripts/check-translations.mjs) and by the tests. A question, an anecdote, a
 * reference or a lesson story written in one language only can then never ship
 * unnoticed.
 *
 * The check reads the content and never edits it.
 */

const text = (value) => (typeof value === "string" ? value : "");
const isBlank = (value) => text(value).trim().length === 0;
const same = (one, other) => text(one).trim().length > 0 && text(one).trim() === text(other).trim();

/** Kept on one line in a failure message, so a whole question never floods it. */
const shorten = (value) => {
  const line = text(value).replace(/\s+/g, " ").trim();
  return line.length > 90 ? `${line.slice(0, 87)}...` : line;
};

// The wording of a level, and of one of its questions, in the order they are
// written: a field added to the content one day is added here too.
const LEVEL_FIELDS = ["title", "subtitle", "region"];
const QUESTION_FIELDS = ["question", "fact"];

/**
 * Every piece of English content left without its French wording.
 *
 * `levels` is the English content, `french` the translations keyed by level id,
 * and `stories` the lesson stories keyed by level id as well. Each gap names
 * the level, the place, the field and the reason, so a failure says exactly
 * what to write rather than only that something is missing.
 */
export function auditTranslations({ levels = [], french = {}, stories = {} } = {}) {
  const gaps = [];
  const add = (level, field, reason, { where = "", english = "" } = {}) =>
    gaps.push({ level, field, reason, where, english: shorten(english) });

  (levels || []).forEach((level) => {
    const translation = french?.[level.id];

    if (!translation) {
      add(level.id, "level", "no French content for this level", { english: level.title });
      return;
    }

    LEVEL_FIELDS.forEach((field) => {
      if (isBlank(translation[field])) {
        add(level.id, field, "the French wording is missing", { english: level[field] });
      } else if (same(translation[field], level[field])) {
        // Left in English, a label is not a translation but a forgotten line.
        add(level.id, field, "the French wording is the English one", { english: level[field] });
      }
    });

    const questions = level.questions || [];
    if (!Array.isArray(translation.questions) || translation.questions.length !== questions.length) {
      const translated = Array.isArray(translation.questions) ? translation.questions.length : 0;
      add(level.id, "questions", `the French side holds ${translated} of ${questions.length} questions`);
      return;
    }

    questions.forEach((english, index) => {
      const frenchQuestion = translation.questions[index] || {};
      const where = `question ${index + 1}`;

      QUESTION_FIELDS.forEach((field) => {
        if (isBlank(frenchQuestion[field])) {
          add(level.id, field, "the French wording is missing", { where, english: english[field] });
        } else if (same(frenchQuestion[field], english[field])) {
          add(level.id, field, "the French wording is the English one", { where, english: english[field] });
        }
      });

      // The reference beside an explanation: the same work, written in the two
      // languages. Only its presence is checked, not its wording, since the
      // title of a work is legitimately the same on both sides.
      if (!english.source || isBlank(english.source.label)) {
        add(level.id, "source", "the explanation comes without a reference", { where });
      } else if (isBlank(frenchQuestion.source)) {
        add(level.id, "source", "the French reference is missing", {
          where,
          english: english.source.label,
        });
      }

      const options = english.options || [];
      if (!Array.isArray(frenchQuestion.options)) {
        add(level.id, "options", "the French answers are missing", { where, english: options.join(" / ") });
      } else if (frenchQuestion.options.length !== options.length) {
        add(level.id, "options", `the French side holds ${frenchQuestion.options.length} of ${options.length} answers`, {
          where,
        });
      } else {
        // The wording of an answer is translated; its value is not compared to
        // the English one, since a proper noun is legitimately the same in both.
        frenchQuestion.options.forEach((option, position) => {
          if (isBlank(option)) {
            add(level.id, "option", `answer ${position + 1} is empty in French`, { where, english: options[position] });
          }
        });
      }
    });

    const story = stories?.[level.id];
    if (!story) {
      add(level.id, "story", "no lesson story in French", { where: "lesson story", english: level.title });
    } else if (isBlank(story.fr)) {
      add(level.id, "story", "the French lesson story is missing", { where: "lesson story", english: story.en });
    } else if (same(story.fr, story.en)) {
      add(level.id, "story", "the French lesson story is the English one", {
        where: "lesson story",
        english: story.en,
      });
    }
  });

  return gaps;
}

/**
 * The lesson stories read out of the file that holds them.
 *
 * They live in a component, so they are read as text rather than imported, and
 * this is the only place that knows their shape: the build script and the tests
 * both come through here.
 *
 * The text is read with one line ending whatever the file carries. A checkout on
 * Windows arrives with CRLF, and the pattern below is anchored on the newline
 * that introduces each story: read without folding the two, it finds nothing on
 * such a machine and every level is reported as having no lesson story in
 * French. `.gitattributes` asks for LF everywhere, and this is the second half
 * of that, so the read is the same whichever way the file was checked out.
 */
export function extractLevelStories(source = "") {
  const stories = {};
  const block = /\n {2}(\d+): \{\n {4}en: "((?:[^"\\]|\\.)*)",\n {4}fr: "((?:[^"\\]|\\.)*)"\n {2}\},?/g;
  const text = String(source).replace(/\r\n?/g, "\n");

  for (const match of text.matchAll(block)) {
    stories[Number(match[1])] = { en: match[2], fr: match[3] };
  }

  return stories;
}
