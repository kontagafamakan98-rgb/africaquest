import test from "node:test";
import assert from "node:assert/strict";

import { contentRows } from "../../scripts/neon-content.mjs";
import { LEVELS } from "../components/game/gameData.js";
import { LEVEL_PHOTOS } from "./level-images.js";

/**
 * The content of the game as the database receives it.
 *
 * This checks what `npm run content:push` writes, without a database: the six
 * tables of rows are built from the game's own tables, so what is held here is
 * that every level, every question and every photograph arrives in Neon whole,
 * in both languages, with the facts the credit and the right answer are made of.
 *
 * The counts are not the point by themselves; the completeness of each row is.
 * A question written in English and left in French is the mistake a database
 * makes visible, because a column that is empty is a column somebody sees.
 */

const rows = contentRows();
const by = (table) => rows[table];

test("every level reaches the database, in both languages", () => {
  assert.equal(by("levels").length, LEVELS.length, "one row per level");

  for (const level of LEVELS) {
    const held = by("levels").find((row) => row[0] === level.id);
    assert.ok(held, `level ${level.id} is not in the rows written to the database`);
    assert.equal(held[3], level.from, `level ${level.id}: the year it starts in`);
    assert.match(held[5], /^[A-Z][A-Za-z0-9]*$/, `level ${level.id}: the icon is written as a name`);

    for (const lang of ["en", "fr"]) {
      const text = by("level_texts").find((row) => row[0] === level.id && row[1] === lang);
      assert.ok(text, `level ${level.id} has no wording in ${lang}`);
      const [, , title, subtitle, region] = text;
      for (const [what, value] of [["title", title], ["subtitle", subtitle], ["region", region]]) {
        assert.equal(typeof value, "string", `level ${level.id} in ${lang}: the ${what} is not text`);
        assert.ok(value.trim().length > 0, `level ${level.id} in ${lang}: the ${what} is empty`);
      }
    }
  }
});

test("every question keeps its right answer and both of its wordings", () => {
  const questions = LEVELS.reduce((sum, level) => sum + level.questions.length, 0);
  assert.equal(by("questions").length, questions, "one row per question");
  assert.equal(by("question_texts").length, questions * 2, "one wording per language, per question");

  for (const level of LEVELS) {
    level.questions.forEach((question, position) => {
      const held = by("questions").find((row) => row[0] === level.id && row[1] === position);
      assert.ok(held, `level ${level.id}: question ${position + 1} is not in the rows written`);
      assert.equal(held[2], question.correct, `level ${level.id}: the right answer of question ${position + 1}`);

      for (const lang of ["en", "fr"]) {
        const text = by("question_texts").find(
          (row) => row[0] === level.id && row[1] === position && row[2] === lang
        );
        assert.ok(text, `level ${level.id}: question ${position + 1} is not written in ${lang}`);
        const [, , , prompt, options, explanation, source] = text;
        assert.ok(prompt.trim().length > 0, `level ${level.id}: the question asked in ${lang}`);
        assert.equal(JSON.parse(options).length, 4, `level ${level.id}: four answers offered in ${lang}`);
        assert.ok(explanation.trim().length > 0, `level ${level.id}: the explanation in ${lang}`);
        assert.ok(source.trim().length > 0, `level ${level.id}: the reference in ${lang}`);
      }
    });
  }
});

test("the study material of a level is written whole, in both languages", () => {
  const kinds = ["essay", "timeline", "people", "places", "glossary"];

  for (const level of LEVELS) {
    for (const lang of ["en", "fr"]) {
      for (const kind of kinds) {
        const lines = by("study_notes").filter(
          (row) => row[0] === level.id && row[1] === lang && row[2] === kind
        );
        assert.ok(lines.length > 0, `level ${level.id}: no ${kind} in ${lang}`);
        lines.forEach((line) => {
          assert.ok(line[5].trim().length > 0, `level ${level.id}: a line of ${kind} in ${lang} is empty`);
          if (kind !== "essay") {
            assert.equal(typeof line[4], "string", `level ${level.id}: a line of ${kind} in ${lang} has no label`);
          }
        });
      }
    }
  }
});

test("every photograph arrives with its licence, its author and its two captions", () => {
  assert.equal(by("photographs").length, LEVEL_PHOTOS.length, "one row per photograph");

  for (const photo of LEVEL_PHOTOS) {
    const held = by("photographs").find((row) => row[2] === photo.file);
    assert.ok(held, `${photo.file} is not in the rows written to the database`);
    const [, , file, captionEn, captionFr, author, licence, , collection] = held;
    assert.equal(file, photo.file);
    assert.ok(captionEn.trim().length > 0, `${file}: the caption in English`);
    assert.ok(captionFr.trim().length > 0, `${file}: the caption in French`);
    assert.ok((author || collection).trim().length > 0, `${file}: somebody has to be credited`);
    assert.ok(licence.trim().length > 0, `${file}: the licence it is used under`);
  }
});
