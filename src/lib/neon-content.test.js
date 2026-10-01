import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

import { contentRows } from "../../scripts/neon-content.mjs";
import { LEVELS } from "../components/game/gameData.js";
import { LEVEL_PHOTOS } from "./level-images.js";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

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

test("the row that dates the last push is not one of the mirrored tables", () => {
  // `content:push` leaves one row of its own behind (`content_sync`) and it is
  // deliberately not in the mirror: it changes on every push, so a mirror that
  // carried it could never pass `content:check`, and the comparison is the whole
  // of what that command is. Both ends are held here - the rows the mirror writes
  // and the table the schema defines - so neither can drift into the other
  // quietly, which is exactly how a guard stops guarding.
  assert.deepEqual(
    Object.keys(rows).sort(),
    ["level_texts", "levels", "photographs", "question_texts", "questions", "study_notes"],
    "the mirror is the six content tables, and nothing else"
  );

  const schema = readFileSync(path.join(ROOT, "db", "schema.sql"), "utf8");
  assert.match(schema, /create table if not exists content_sync/, "the date of the last push has nowhere to be written");
  assert.match(schema, /pushed_at\s+timestamptz not null/, "the row that dates a push carries no date");
});

test("the four modules frame their content with the markers the pull replaces between", () => {
  // `content:pull` writes the declaration a module holds from the database, and it
  // only touches what stands between these two lines: everything outside - the
  // imports, the helpers, the prose - is carried through untouched, which is what
  // keeps the command from eating a comment somebody wrote. A file that lost one of
  // its markers would be a file the next pull refuses to write, so the pair is
  // held here for all four rather than discovered in production.
  const start = "// >>> content from Neon: generated by scripts/neon-content.mjs pull, do not edit here";
  const end = "// <<< end of the content from Neon";
  const modules = [
    ["src/components/game/gameData.js", "export const LEVELS = ["],
    ["src/components/game/content-fr.js", "export const LEVELS_FR = {"],
    ["src/components/game/level-study.js", "export const LEVEL_STUDY = {"],
    ["src/lib/level-images.js", "export const LEVEL_PHOTOS = ["],
  ];

  for (const [file, declaration] of modules) {
    const text = readFileSync(path.join(ROOT, file), "utf8");
    assert.equal(text.split(start).length - 1, 1, `${file}: one opening marker is expected`);
    assert.equal(text.split(end).length - 1, 1, `${file}: one closing marker is expected`);

    const lines = text.split("\n");
    const opened = lines.indexOf(start);
    const closed = lines.indexOf(end);
    assert.ok(opened < closed, `${file}: the opening marker comes before the closing one`);
    assert.equal(lines[opened + 1], declaration, `${file}: the content follows the opening marker`);
  }

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(
    pkg.scripts["content:pull"] ?? "",
    /neon-content\.mjs pull/,
    "the command that writes the modules from the database is not a script"
  );
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
