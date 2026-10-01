#!/usr/bin/env node
/**
 * The content of the game, into the Neon database and back out of it.
 *
 * The game is a static site: a reader downloads files, plays with no network at
 * all, and nothing they do leaves their device. The database is not part of that
 * path and must not become part of it, because a lesson that needs a round trip
 * before it can be read is a lesson that does not work on the connection this
 * game was written for. What Neon holds is where the content is written down,
 * counted and translated; what the repository holds is the content the game
 * actually ships, in modules a test can read and a runner can build with no
 * credential.
 *
 * So this script is the door between the two, and it is opened by hand:
 *
 *   npm run content:push    the repository's content, written into Neon
 *   npm run content:check   Neon read back, and compared with the repository
 *
 * It reads the same four tables the game is written from: the levels in
 * gameData.js, the French wording in content-fr.js, the study material in
 * level-study.js and the photographs in level-images.js. Nothing is written a
 * second time here, which is the whole point: a question corrected in the game
 * is a question this script writes, and `check` is what says whether the two
 * still agree.
 *
 * `push` is a mirror rather than a merge. It applies db/schema.sql, empties the
 * six tables and writes every row again, so a level deleted from the repository
 * is a level the database no longer has. Content edited in the console is
 * content this command will overwrite, and that is deliberate: the repository is
 * what the game ships, the database is what the content is looked at in, and a
 * silent two-way merge between the two would be the one thing nobody could
 * reason about. `check` is what makes the difference visible instead.
 *
 * It is deliberately not a step of `npm run verify`. The verification runs on
 * every push and every pull request, on a machine holding no database
 * credential: a check that needs one would fail there, or be skipped there, and
 * both are worse than a command run when it is meant to be run.
 *
 * The connection string comes from the environment, which is where `neon link`
 * put it (.env.local, never committed). The unpooled address is preferred when
 * there is one, because a script that writes a schema and a few thousand rows is
 * the one kind of client a connection pooler is not for.
 *
 * Usage:
 *   node --env-file-if-exists=.env.local scripts/neon-content.mjs push
 *   node --env-file-if-exists=.env.local scripts/neon-content.mjs check
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { neon } from "@neondatabase/serverless";

import { LEVELS } from "../src/components/game/gameData.js";
import { LEVELS_FR } from "../src/components/game/content-fr.js";
import { LEVEL_STUDY } from "../src/components/game/level-study.js";
import { LEVEL_PHOTOS } from "../src/lib/level-images.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCHEMA = path.join(ROOT, "db", "schema.sql");

/** How many rows one insert carries. Wide enough to be quick, short enough to
 * stay inside the parameter ceiling of a single statement. */
const CHUNK = 200;

/**
 * The six tables, in the order they are emptied and the order they are written:
 * a child before its parent on the way out, after it on the way in.
 */
const TABLES = [
  { name: "levels", columns: ["id", "ordering", "era", "from_year", "color", "icon"] },
  { name: "level_texts", columns: ["level_id", "lang", "title", "subtitle", "region"] },
  { name: "questions", columns: ["level_id", "position", "right_answer", "source_url"] },
  {
    name: "question_texts",
    columns: ["level_id", "position", "lang", "prompt", "options", "explanation", "source_label"],
    jsonb: ["options"],
  },
  { name: "study_notes", columns: ["level_id", "lang", "kind", "position", "label", "body"] },
  {
    name: "photographs",
    columns: [
      "level_id", "position", "file", "caption_en", "caption_fr", "author", "licence",
      "licence_fr", "collection", "commons_title", "origin", "width", "sha256",
      "webp_sha256", "avif_sha256", "thumb_sha256",
    ],
  },
];

/** The name of the icon a level is drawn with, the way the icon set writes it. */
function iconName(level) {
  const name = level?.icon?.displayName;
  if (typeof name !== "string" || name.length === 0) {
    throw new Error(`level ${level?.id}: the icon has no name to write down`);
  }
  return name;
}

/**
 * The content of the game, as the rows of the six tables.
 *
 * Exported because a test reads it: the shape of what this script writes is
 * worth holding to the real content without a database in the room.
 */
export function contentRows() {
  const rows = Object.fromEntries(TABLES.map((table) => [table.name, []]));
  const push = (table, values) => rows[table].push(values);

  for (const level of LEVELS) {
    const french = LEVELS_FR[level.id];
    if (!french) throw new Error(`level ${level.id}: the French wording of this level is missing`);

    push("levels", [level.id, level.order, level.era, level.from, level.color, iconName(level)]);
    push("level_texts", [level.id, "en", level.title, level.subtitle, level.region]);
    push("level_texts", [
      level.id,
      "fr",
      french.title ?? level.title,
      french.subtitle ?? level.subtitle,
      french.region ?? level.region,
    ]);

    if (!Array.isArray(french.questions) || french.questions.length !== level.questions.length) {
      throw new Error(
        `level ${level.id}: the French questions do not match the English ones, question for question`
      );
    }

    level.questions.forEach((question, position) => {
      const fr = french.questions[position] || {};
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`level ${level.id}: question ${position + 1} does not offer four answers`);
      }
      const frenchOptions =
        Array.isArray(fr.options) && fr.options.length === question.options.length
          ? fr.options
          : question.options;

      push("questions", [level.id, position, question.correct, question.source?.url ?? null]);
      push("question_texts", [
        level.id, position, "en",
        question.question,
        JSON.stringify(question.options),
        question.fact,
        question.source?.label ?? "",
      ]);
      push("question_texts", [
        level.id, position, "fr",
        fr.question ?? question.question,
        JSON.stringify(frenchOptions),
        fr.fact ?? question.fact,
        fr.source ?? question.source?.label ?? "",
      ]);
    });

    const study = LEVEL_STUDY[level.id];
    if (!study?.en || !study?.fr) {
      throw new Error(`level ${level.id}: the study material of this level is missing`);
    }

    for (const lang of ["en", "fr"]) {
      const pack = study[lang];
      pack.essay.forEach((paragraph, position) => {
        push("study_notes", [level.id, lang, "essay", position, null, paragraph]);
      });
      for (const kind of ["timeline", "people", "places", "glossary"]) {
        (pack[kind] || []).forEach((line, position) => {
          // A dated moment carries a year and the other three a name: the first
          // of them the entry has is the label the lesson prints beside the text.
          const label = line.year ?? line.name ?? line.term ?? null;
          if (label === null) {
            throw new Error(`level ${level.id} in ${lang}: a line of ${kind} has no name to print`);
          }
          push("study_notes", [level.id, lang, kind, position, label, line.text]);
        });
      }
    }
  }

  const positions = {};
  for (const photo of LEVEL_PHOTOS) {
    positions[photo.level] = (positions[photo.level] ?? 0) + 1;
    push("photographs", [
      photo.level,
      positions[photo.level] - 1,
      photo.file,
      photo.caption?.en ?? "",
      photo.caption?.fr ?? "",
      photo.author ?? null,
      photo.licence,
      photo.licenceFr ?? null,
      photo.collection,
      photo.commonsTitle ?? null,
      photo.origin ?? null,
      photo.width ?? null,
      photo.sha256 ?? null,
      photo.webpSha256 ?? null,
      photo.avifSha256 ?? null,
      photo.thumbSha256 ?? null,
    ]);
  }

  return rows;
}

/** The schema, one statement at a time: the endpoint answers one query a call. */
function schemaStatements() {
  return readFileSync(SCHEMA, "utf8")
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

/** One insert per chunk of rows, each carrying only its own parameters. */
function inserts(table, rows) {
  const { name, columns, jsonb = [] } = table;
  const statements = [];

  for (let start = 0; start < rows.length; start += CHUNK) {
    const chunk = rows.slice(start, start + CHUNK);
    const parameters = [];
    const tuples = chunk.map((row) => {
      const cells = row.map((value, index) => {
        parameters.push(value);
        const cast = jsonb.includes(columns[index]) ? "::jsonb" : "";
        return `$${parameters.length}${cast}`;
      });
      return `(${cells.join(", ")})`;
    });
    statements.push({
      text: `insert into ${name} (${columns.join(", ")}) values ${tuples.join(", ")}`,
      parameters,
    });
  }

  return statements;
}

/** The database, from the environment the Neon CLI filled in. */
function connect() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "neon-content: no connection string. Run `neon link` in this directory first, so that\n" +
        ".env.local holds DATABASE_URL, then pass it to Node:\n" +
        "  node --env-file-if-exists=.env.local scripts/neon-content.mjs push"
    );
    process.exit(1);
  }
  return neon(url);
}

async function push(sql) {
  const rows = contentRows();

  for (const statement of schemaStatements()) await sql.query(statement);
  console.log(`content: schema applied (${schemaStatements().length} statements)`);

  // Emptied child first, so no row is ever left pointing at a level that has
  // gone: the mirror of the repository is a clean one, not a patched one.
  for (const table of [...TABLES].reverse()) await sql.query(`delete from ${table.name}`);

  for (const table of TABLES) {
    for (const statement of inserts(table, rows[table.name])) {
      await sql.query(statement.text, statement.parameters);
    }
    console.log(`content: ${table.name}: ${rows[table.name].length} row(s) written`);
  }

  console.log("\ncontent: the database now holds the content of the repository. Run `npm run content:check` to read it back.");
}

/** Every row of every table, read in a fixed order so two reads can be compared. */
async function readBack(sql) {
  const held = {};
  for (const table of TABLES) {
    held[table.name] = await sql.query(
      `select ${table.columns.join(", ")} from ${table.name} order by ${table.columns.join(", ")}`
    );
  }
  return held;
}

/**
 * The rows as a read gives them back: the same columns, in the same order, with
 * the four answers of a question as the list they are rather than the text they
 * travel as.
 */
function asRead(table, values) {
  return values
    .map((value) => {
      const row = {};
      table.columns.forEach((column, index) => {
        const cell = value[index];
        row[column] = (table.jsonb || []).includes(column) && typeof cell === "string" ? JSON.parse(cell) : cell;
      });
      return row;
    })
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

async function check(sql) {
  const rows = contentRows();
  const held = await readBack(sql);
  let faults = 0;

  for (const table of TABLES) {
    const want = asRead(table, rows[table.name]);
    const got = held[table.name]
      .map((row) => ({ ...row }))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

    if (JSON.stringify(want) === JSON.stringify(got)) {
      console.log(`content: ${table.name}: ${got.length} row(s), the same as the repository`);
      continue;
    }

    faults += 1;
    console.log(`content: ${table.name}: the repository says ${want.length} row(s), the database holds ${got.length}`);
    const wanted = new Set(want.map((row) => JSON.stringify(row)));
    const existing = new Set(got.map((row) => JSON.stringify(row)));
    for (const fingerprint of existing) {
      if (!wanted.has(fingerprint)) console.log(`  only in the database: ${fingerprint.slice(0, 180)}`);
    }
    for (const fingerprint of wanted) {
      if (!existing.has(fingerprint)) console.log(`  only in the repository: ${fingerprint.slice(0, 180)}`);
    }
  }

  if (faults > 0) {
    console.error(`\ncontent: ${faults} table(s) out of step. Run \`npm run content:push\` to write the repository's content.`);
    process.exit(1);
  }
  console.log("\ncontent: the database holds exactly the content the repository publishes");
}

// The commands run only when this file is the program, so that the test that
// reads what it would write does not need a database, an environment or a
// credential, and cannot reach one by importing it.
const isProgram = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isProgram) {
  const command = (process.argv[2] || "").toLowerCase();

  if (command === "push") await push(connect());
  else if (command === "check") await check(connect());
  else {
    console.error(`neon-content: unknown command "${process.argv[2] ?? ""}". Use "push" or "check".`);
    process.exit(1);
  }
}
