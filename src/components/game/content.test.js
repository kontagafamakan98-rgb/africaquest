import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { BADGES, LEVELS, getLevels, localizeLevel } from "./gameData.js";
import { LEVELS_FR } from "./content-fr.js";
import { auditTranslations, extractLevelStories } from "../../lib/translation-audit.js";

const OPTION_COUNT = 4;
// A level is one lesson and one quiz on one period. Every level now carries at
// least ten questions, and the fuller ones fifteen: what matters is that every
// period is taught, and that every lesson is full enough to study from.
const MIN_QUESTIONS_PER_LEVEL = 10;
const MAX_QUESTIONS_PER_LEVEL = 15;
const LEVEL_COUNT = 20;
// The periods of African history, in the order they happened.
const ERAS = ["origins", "ancient", "medieval", "earlyModern", "modern", "contemporary"];
// The stories live in the lesson component, so they are checked where they are
// written rather than by importing a file the test runner cannot parse.
const STORY_FILE = path.join(import.meta.dirname, "AudioNarrator.jsx");
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

/** Every question of one language, flattened with a label used in failure messages. */
const flatten = (levels) =>
  levels.flatMap((level) =>
    level.questions.map((question, index) => ({ level: level.id, index, question }))
  );

test("the game holds the levels, questions and answers it claims", () => {
  assert.equal(LEVELS.length, LEVEL_COUNT);
  assert.deepEqual(
    LEVELS.map((level) => level.id),
    Array.from({ length: LEVEL_COUNT }, (_unused, index) => index + 1)
  );

  LEVELS.forEach((level) => {
    assert.ok(nonEmpty(level.title), `level ${level.id} needs a title`);
    assert.ok(nonEmpty(level.subtitle), `level ${level.id} needs a subtitle`);
    assert.ok(nonEmpty(level.region), `level ${level.id} needs a region`);
    assert.ok(level.icon, `level ${level.id} needs an icon`);
    assert.ok(
      level.questions.length >= MIN_QUESTIONS_PER_LEVEL &&
        level.questions.length <= MAX_QUESTIONS_PER_LEVEL,
      `level ${level.id} has ${level.questions.length} questions, outside the ${MIN_QUESTIONS_PER_LEVEL} to ${MAX_QUESTIONS_PER_LEVEL} range`
    );
  });
});

test("the levels are one timeline, from the first humans to today", () => {
  const places = LEVELS.map((level) => level.order);
  assert.deepEqual(
    [...places].sort((a, b) => a - b),
    Array.from({ length: LEVEL_COUNT }, (_unused, index) => index + 1),
    "every level holds its own place in the timeline"
  );

  const timeline = [...LEVELS].sort((a, b) => a.order - b.order);
  let openedBefore = -Infinity;
  timeline.forEach((level) => {
    assert.ok(ERAS.includes(level.era), `level ${level.id}: unknown era ${level.era}`);
    assert.ok(Number.isInteger(level.from), `level ${level.id}: the period needs the year it opens on`);
    assert.ok(
      level.from > openedBefore,
      `level ${level.id} opens in ${level.from}, before the level that comes first in the timeline`
    );
    openedBefore = level.from;
  });

  // The game really covers the whole of it, rather than a few pretty periods.
  assert.ok(timeline[0].from <= -100000, "the timeline opens with human origins");
  assert.ok(timeline[timeline.length - 1].from >= 1990, "and closes with Africa today");
  const taught = new Set(LEVELS.map((level) => level.era));
  ERAS.forEach((era) => assert.ok(taught.has(era), `no level teaches the ${era} era`));
});

test("every level has a lesson story, told in both languages", () => {
  const stories = extractLevelStories(readFileSync(STORY_FILE, "utf8"));

  LEVELS.forEach((level) => {
    const story = stories[level.id];
    assert.ok(story, `level ${level.id} has no lesson story`);

    assert.ok(story.en.trim().split(/\s+/).length >= 25, `level ${level.id}: the english story is a real one`);
    assert.ok(story.fr.trim().split(/\s+/).length >= 20, `level ${level.id}: the french story is a real one`);
    assert.notEqual(story.en, story.fr, `level ${level.id}: a story is not translated by copying it`);
  });
});

test("the badge for the end of the game asks for the whole timeline", () => {
  const hero = BADGES.find((badge) => badge.id === "history_hero");
  assert.ok(hero, "the game holds a badge for finishing every level");
  assert.equal(
    hero.requirement.count,
    LEVELS.length,
    "the badge must be earned on the last level of the timeline, not on an older count"
  );
});

test("every question is well formed and its answer is usable", () => {
  const seenQuestions = new Set();

  flatten(LEVELS).forEach(({ level, index, question }) => {
    const where = `level ${level} question ${index + 1}`;

    assert.ok(nonEmpty(question.question), `${where}: empty question`);
    assert.ok(nonEmpty(question.fact), `${where}: empty explanation`);
    assert.ok(Array.isArray(question.options), `${where}: options must be a list`);
    assert.equal(question.options.length, OPTION_COUNT, `${where}: four options expected`);

    question.options.forEach((option, position) => {
      assert.ok(nonEmpty(option), `${where}: option ${position + 1} is empty`);
    });

    // Two identical options would leave the player with a choice that is not one.
    assert.equal(
      new Set(question.options).size,
      question.options.length,
      `${where}: duplicated option`
    );

    assert.ok(
      Number.isInteger(question.correct) && question.correct >= 0 && question.correct < OPTION_COUNT,
      `${where}: the right answer must be an index between 0 and 3`
    );
    assert.ok(nonEmpty(question.options[question.correct]), `${where}: right answer is empty`);

    // The same question twice in the game would inflate the progress figures.
    assert.ok(!seenQuestions.has(question.question), `${where}: duplicated question text`);
    seenQuestions.add(question.question);
  });
});

test("every explanation cites the work it comes from", () => {
  flatten(LEVELS).forEach(({ level, index, question }) => {
    const where = `level ${level} question ${index + 1}`;
    assert.ok(question.source, `${where}: the explanation comes without a reference`);
    assert.ok(nonEmpty(question.source.label), `${where}: the reference needs a label`);
    // A citation is either a name, or a name with a secure link to it.
    if (question.source.url !== undefined) {
      assert.match(question.source.url, /^https:\/\/\S+$/, `${where}: reference url`);
    }
  });

  // The reference belongs to the explanation now, not to the level: a list left
  // behind would be read by nobody and slowly drift from the questions.
  LEVELS.forEach((level) => {
    assert.equal(level.sources, undefined, `level ${level.id}: still carries a reference list`);
  });
});

test("the French content covers exactly the same levels and questions", () => {
  const frenchIds = Object.keys(LEVELS_FR).map(Number).sort((a, b) => a - b);
  assert.deepEqual(frenchIds, LEVELS.map((level) => level.id));

  LEVELS.forEach((level) => {
    const french = LEVELS_FR[level.id];
    assert.ok(nonEmpty(french.title), `level ${level.id}: French title`);
    assert.ok(nonEmpty(french.subtitle), `level ${level.id}: French subtitle`);
    assert.ok(nonEmpty(french.region), `level ${level.id}: French region`);
    assert.equal(french.questions.length, level.questions.length, `level ${level.id}: question count`);

    // References are translated question by question, so every explanation the
    // player reads has its own French citation.
    assert.equal(french.sources, undefined, `level ${level.id}: still carries a reference list`);
    french.questions.forEach((question, index) => {
      assert.ok(nonEmpty(question.source), `level ${level.id}: French reference of question ${index + 1}`);
    });
  });
});

test("every French question is complete and keeps the same options in the same order", () => {
  LEVELS.forEach((level) => {
    const french = LEVELS_FR[level.id];

    level.questions.forEach((english, index) => {
      const fr = french.questions[index];
      const where = `level ${level.id} question ${index + 1}`;

      assert.ok(nonEmpty(fr.question), `${where}: French question`);
      assert.ok(nonEmpty(fr.fact), `${where}: French explanation`);
      assert.ok(Array.isArray(fr.options), `${where}: French options`);
      // A different count would make the app fall back to the English answers
      // under a French question, so the two languages must line up.
      assert.equal(fr.options.length, english.options.length, `${where}: option count`);
      assert.equal(new Set(fr.options).size, fr.options.length, `${where}: duplicated French option`);
      fr.options.forEach((option, position) => {
        assert.ok(nonEmpty(option), `${where}: French option ${position + 1} is empty`);
      });

      // The right answer index belongs to the English source; if the French entry
      // ever carries one, it must agree with it.
      if (Object.hasOwn(fr, "correct")) {
        assert.equal(fr.correct, english.correct, `${where}: right answer index`);
      }
    });
  });
});

test("no English question, anecdote or story is left without its French wording", () => {
  // The same audit the build runs, on the real content: whatever the two
  // dictionaries above prove field by field, this proves there is no hole left
  // anywhere in the two hundred questions the game asks.
  const stories = extractLevelStories(readFileSync(STORY_FILE, "utf8"));
  const gaps = auditTranslations({ levels: LEVELS, french: LEVELS_FR, stories });

  const report = gaps
    .slice(0, 10)
    .map((gap) => `level ${gap.level} ${gap.field}${gap.where ? `, ${gap.where}` : ""}: ${gap.reason}`)
    .join("\n");

  assert.equal(gaps.length, 0, `English content without a French wording:\n${report}`);
  assert.equal(Object.keys(stories).length, LEVELS.length, "every level brings its lesson story");
});

test("the audit reports a missing translation instead of passing quietly", () => {
  // The failure this whole check exists for: a few lines that were never
  // translated, and nothing else wrong.
  const levels = [
    {
      id: 1,
      title: "Level one",
      subtitle: "A subtitle",
      region: "A region",
      questions: [
        {
          question: "Who was it?",
          options: ["a", "b"],
          correct: 0,
          fact: "The first anecdote",
          source: { label: "A reference" },
        },
        {
          question: "When was it?",
          options: ["a", "b"],
          correct: 1,
          fact: "The second anecdote",
          source: { label: "Another reference" },
        },
      ],
    },
  ];
  const french = {
    1: {
      title: "Niveau un",
      subtitle: "Un sous-titre",
      region: "Une region",
      questions: [
        {
          question: "Qui etait-ce ?",
          options: ["a", "b"],
          fact: "La premiere anecdote",
          source: "Une reference",
        },
        // The question was left in English, its anecdote and its reference too.
        { question: "When was it?", options: ["a", "b"], fact: "" },
      ],
    },
  };
  // A story copied across is not a translation either.
  const stories = { 1: { en: "Once upon a time", fr: "Once upon a time" } };

  const gaps = auditTranslations({ levels, french, stories });
  const reported = gaps.map((gap) => `${gap.field}${gap.where ? ` @ ${gap.where}` : ""}`);

  assert.deepEqual(reported.sort(), [
    "fact @ question 2",
    "question @ question 2",
    "source @ question 2",
    "story @ lesson story",
  ]);
  assert.match(gaps[0].reason, /French/, "each gap says what is wrong in French terms");
  assert.ok(gaps.every((gap) => gap.english || gap.level), "a gap names the level and the English line");
});

test("a whole level, or one question of it, missing from the French file is caught", () => {
  const level = (id) => ({
    id,
    title: `Level ${id}`,
    subtitle: "Sub",
    region: "Region",
    questions: [
      { question: "Q", options: ["a", "b"], correct: 0, fact: "F", source: { label: "Source" } },
    ],
  });
  const french = {
    1: { title: "Niveau", subtitle: "Sous-titre", region: "Region", questions: [] },
  };

  const gaps = auditTranslations({ levels: [level(1), level(2)], french });

  assert.equal(gaps.filter((gap) => gap.field === "level").length, 1, "the missing level is named");
  assert.equal(gaps.find((gap) => gap.level === 1 && gap.field === "questions").reason, "the French side holds 0 of 1 questions");
});

test("the build refuses to bundle content that has not been translated", () => {
  const root = path.join(import.meta.dirname, "..", "..", "..");
  const { scripts } = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

  assert.match(scripts.build, /check:translations/, "the build runs the translation check");
  assert.match(scripts["check:translations"], /check-translations\.mjs/, "and it runs the script that reads the content");
  assert.ok(
    scripts.build.indexOf("check:translations") < scripts.build.indexOf("vite build"),
    "the check runs before the bundle, not after it"
  );
  assert.equal(scripts.verify, "node scripts/verify.mjs", "package.json registers the verify script");
});

test("numbers and dates stay at the same position in both languages", () => {
  // Names and years survive translation: if one moved, the answers no longer
  // match the question they belong to.
  const numeric = /^\D*(\d{3,4})\D*$/;
  let checked = 0;

  LEVELS.forEach((level) => {
    level.questions.forEach((english, index) => {
      english.options.forEach((option, position) => {
        const match = option.match(numeric);
        if (!match) return;
        const fr = LEVELS_FR[level.id].questions[index].options[position];
        checked += 1;
        assert.ok(
          fr.includes(match[1]),
          `level ${level.id} question ${index + 1}, option ${position + 1}: "${option}" vs "${fr}"`
        );
      });
    });
  });

  assert.ok(checked >= 5, `expected several dated answers to check, found ${checked}`);
});

test("switching language changes the wording, never the answers", () => {
  const english = getLevels("en");
  const french = getLevels("fr");

  // Compared as sets: the game data is stored in its own order, and the levels
  // are handed out along the timeline.
  assert.deepEqual(
    english.map((level) => level.title).sort(),
    LEVELS.map((level) => level.title).sort(),
    "english is the wording the levels were written in"
  );
  assert.equal(french.length, english.length);

  french.forEach((level, position) => {
    const source = english[position];
    // Presentation stays with the game data, wording comes from the translation.
    assert.equal(level.id, source.id);
    assert.equal(level.icon, source.icon);
    assert.equal(level.color, source.color);
    assert.equal(level.questions.length, source.questions.length);

    level.questions.forEach((question, index) => {
      assert.ok(nonEmpty(question.options[question.correct]), `level ${level.id} question ${index + 1}`);
      assert.equal(question.correct, source.questions[index].correct);
    });

    // The French title really comes from the French content, and every
    // explanation shows the French wording of its reference while keeping the
    // link verified for the English entry.
    assert.equal(level.title, LEVELS_FR[level.id].title);
    level.questions.forEach((question, index) => {
      assert.equal(question.source.label, LEVELS_FR[level.id].questions[index].source);
      assert.equal(question.source.url, source.questions[index].source.url);
    });
  });
});

test("an unknown language, or incomplete content, falls back to English", () => {
  const german = getLevels("de");
  assert.equal(german.length, LEVELS.length);
  german.forEach((level) => {
    const source = LEVELS.find((entry) => entry.id === level.id);
    assert.ok(source, `level ${level.id} comes from the game data`);
    assert.equal(level.title, source.title, "an unknown language shows the english wording");
  });

  const synthetic = {
    id: 99,
    title: "Synthetic",
    questions: [{ question: "?", options: ["a", "b", "c", "d"], correct: 0, fact: "!" }],
  };
  // Two questions in French for one in English: the English set is kept whole
  // rather than pairing a question with another question's answers.
  const result = localizeLevel(synthetic, "fr");
  assert.equal(result, synthetic);
});
