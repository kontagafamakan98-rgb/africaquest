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
 * The database is the source, and the repository is the snapshot of it that
 * ships. Content is edited in Neon; `pull` writes the four modules the game is
 * read from out of the tables; the change is reviewed as the diff of those files
 * and committed like any other. The direction is the point: without it, every
 * edit made in the console would be a fork of the content nobody could see.
 *
 * The four modules are only partly generated. Each keeps its imports, its helpers
 * and the prose that explains it, and only the declaration of data - the lines
 * between a pair of marker comments - is written from the database. So a command
 * run against Neon cannot quietly delete a comment somebody wrote to explain a
 * level; it replaces what it owns and leaves the rest exactly as it is.
 *
 * So this script is the door between the two, and it is opened by hand:
 *
 *   npm run content:pull    Neon, written into the four modules of the game
 *   npm run content:push    the repository's content, written back into Neon
 *   npm run content:check   Neon read back, and compared with the repository
 *
 * `push` is a mirror rather than a merge. It applies db/schema.sql, empties the
 * six tables and writes every row again, so a level deleted from the database is
 * a level the repository no longer has. It also records the moment and the counts
 * in a row of its own (`content_sync`), which is what the backend's `/health`
 * answers with: the six mirrored tables say what the content is, and that row says
 * since when. `check` reads all six back, compares them row for row with the
 * repository, and also rebuilds the four modules and compares their generated
 * lines: a file whose content between the markers is not what the database would
 * write is a fault in exactly the same way a table that differs is one. A silent
 * two-way merge would be the one thing nobody could reason about, so there is
 * none; `check` is what makes the difference visible instead.
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
 *   node --env-file-if-exists=.env.local scripts/neon-content.mjs pull
 *   node --env-file-if-exists=.env.local scripts/neon-content.mjs push
 *   node --env-file-if-exists=.env.local scripts/neon-content.mjs check
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { neon } from "@neondatabase/serverless";

import { LEVELS } from "../src/components/game/gameData.js";
import { LEVELS_FR } from "../src/components/game/content-fr.js";
import { LEVEL_STUDY } from "../src/components/game/level-study.js";
import { LEVEL_PHOTOS } from "../src/lib/level-images.js";
// The way a value of the content is written: the same text the script that writes
// a level into a module of its own produces, so the two writers of content agree.
import { Raw, pretty } from "../build/content-format.js";

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
      "webp_sha256", "avif_sha256", "thumb_sha256", "card_sha256",
    ],
  },
];

/**
 * The one row that says when this content was written, and how much of it there
 * was.
 *
 * Kept out of TABLES on purpose: it is a record of the last write rather than a
 * copy of the content, so it changes on every push and could never be compared
 * with the repository. `check` reads the six mirrored tables and leaves this one
 * alone; the backend's `/health` reads it to be able to answer with a date.
 */
const SYNC = {
  name: "content_sync",
  upsert: `insert into content_sync (id, pushed_at, levels, questions, study_notes, photographs, source)
    values (1, now(), $1, $2, $3, $4, $5)
    on conflict (id) do update set
      pushed_at = excluded.pushed_at,
      levels = excluded.levels,
      questions = excluded.questions,
      study_notes = excluded.study_notes,
      photographs = excluded.photographs,
      source = excluded.source`,
};

/**
 * Who is writing, and from where, as the one row that records it says it.
 *
 * The names are the runner's own when this runs in the Content workflow, where
 * "who pushed this" is a question somebody will ask of a database that drifted -
 * and the answer is worth more there than on a laptop, where it is always the
 * person who typed the command.
 */
function pushSource() {
  const parts = [];
  if (process.env.GITHUB_ACTOR) parts.push(`github:${process.env.GITHUB_ACTOR}`);
  if (process.env.GITHUB_SHA) parts.push(process.env.GITHUB_SHA.slice(0, 7));
  return parts.length > 0 ? parts.join(" ") : "local";
}

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
      photo.cardSha256 ?? null,
    ]);
  }

  return rows;
}

/**
 * The four modules the game reads its content from, and the declaration inside
 * each one that this command owns.
 *
 * The content of those files is written from the database; everything else in
 * them - the imports, the helpers, the prose that says why a thing is the way it
 * is - stays hand-written and is left exactly as it is. That is what the two
 * marker lines in each file are for: `pull` replaces what stands between them and
 * touches nothing outside, so a command run against a database cannot quietly
 * delete the comment somebody wrote to explain it.
 *
 * The declaration is built from the rows here rather than read out of the file,
 * which is also what makes the check mean something: a module is up to date when
 * the bytes between its markers are the bytes this command would write.
 */
const MARKERS = {
  start: "// >>> content from Neon: generated by scripts/neon-content.mjs pull, do not edit here",
  end: "// <<< end of the content from Neon",
};

const MODULES = [
  {
    file: "src/components/game/gameData.js",
    declaration: (content) => `export const LEVELS = ${pretty(content.levels, 0)};`,
  },
  {
    file: "src/components/game/content-fr.js",
    declaration: (content) => `export const LEVELS_FR = ${pretty(content.french, 0)};`,
  },
  {
    file: "src/components/game/level-study.js",
    declaration: (content) => `export const LEVEL_STUDY = ${pretty(content.study, 0)};`,
  },
  {
    file: "src/lib/level-images.js",
    declaration: (content) => `export const LEVEL_PHOTOS = ${pretty(content.photographs, 0)};`,
  },
];

/** The columns of the photograph table, as the mirror writes them. */
const PHOTO_COLUMNS = TABLES.find((table) => table.name === "photographs").columns;

/** The five parts of a study pack, in the order the module writes them. */
const STUDY_KINDS = ["essay", "timeline", "people", "places", "glossary"];
/** The field each of the four labelled kinds of line carries its name in. */
const STUDY_LABEL = { timeline: "year", people: "name", places: "name", glossary: "term" };

/** The reference under a question: the work, and the page it was read on when there is one. */
function sourceOf(url, label) {
  return url ? { label, url } : { label };
}

/**
 * The four answers of a question as the list they are.
 *
 * A jsonb column comes back either as the value it holds or as the text it was
 * written as, depending on how the driver was asked for it, and both are true at
 * once here: the mirror writes text and the read gives an array. So both are
 * accepted, and a shape that is neither is a fault rather than a silent guess.
 */
function optionsOf(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return JSON.parse(value);
  throw new Error("a question's four answers did not come back as a list");
}

/**
 * The content of the game, read back out of the database and shaped the way the
 * modules hold it.
 *
 * This is the inverse of contentRows(), written to be exactly that: every field
 * of every module is here, and a row that cannot be turned back into one is a
 * fault rather than a gap. The two together are what make the database the source
 * rather than a copy - one writes it, the other reads it, and neither holds a
 * fact the other does not.
 */
async function contentFrom(sql) {
  const levels = await sql.query("select id, ordering, era, from_year, color, icon from levels order by id");
  const texts = await sql.query("select level_id, lang, title, subtitle, region from level_texts");
  const questions = await sql.query(
    "select level_id, position, right_answer, source_url from questions order by level_id, position"
  );
  const wordings = await sql.query(
    "select level_id, position, lang, prompt, options, explanation, source_label from question_texts order by level_id, position"
  );
  const notes = await sql.query(
    "select level_id, lang, kind, position, label, body from study_notes order by level_id, lang, kind, position"
  );
  const photographs = await sql.query(
    `select ${PHOTO_COLUMNS.join(", ")} from photographs order by level_id, position`
  );

  const textOf = (levelId, lang) => {
    const row = texts.find((entry) => entry.level_id === levelId && entry.lang === lang);
    if (!row) throw new Error(`level ${levelId}: the database holds no wording in ${lang}`);
    return row;
  };
  const wordingOf = (levelId, position, lang) => {
    const row = wordings.find(
      (entry) => entry.level_id === levelId && entry.position === position && entry.lang === lang
    );
    if (!row) throw new Error(`level ${levelId}: question ${position + 1} is not written in ${lang}`);
    return row;
  };

  const content = { levels: [], french: {}, study: {}, photographs: [] };

  for (const level of levels) {
    const en = textOf(level.id, "en");
    const mine = questions.filter((question) => question.level_id === level.id);

    content.levels.push({
      id: level.id,
      order: level.ordering,
      era: level.era,
      from: level.from_year,
      title: en.title,
      subtitle: en.subtitle,
      // The icon is a component the module imports, so it is written as the bare
      // name lucide exports rather than as the string the database holds.
      icon: new Raw(level.icon),
      region: en.region,
      color: level.color,
      questions: mine.map((question) => {
        const wording = wordingOf(level.id, question.position, "en");
        return {
          question: wording.prompt,
          options: optionsOf(wording.options),
          correct: question.right_answer,
          fact: wording.explanation,
          source: sourceOf(question.source_url, wording.source_label),
        };
      }),
    });

    const fr = textOf(level.id, "fr");
    content.french[level.id] = {
      title: fr.title,
      subtitle: fr.subtitle,
      region: fr.region,
      questions: mine.map((question) => {
        const wording = wordingOf(level.id, question.position, "fr");
        return {
          question: wording.prompt,
          options: optionsOf(wording.options),
          fact: wording.explanation,
          // The French wording carries its reference as a line rather than as a
          // work and a page, because it never links out on its own.
          source: wording.source_label,
        };
      }),
    };

    const pack = { en: {}, fr: {} };
    for (const lang of ["en", "fr"]) {
      for (const kind of STUDY_KINDS) {
        const lines = notes
          .filter((note) => note.level_id === level.id && note.lang === lang && note.kind === kind)
          .sort((one, other) => one.position - other.position);
        if (lines.length === 0) throw new Error(`level ${level.id} in ${lang}: the database holds no ${kind}`);
        pack[lang][kind] =
          kind === "essay"
            ? lines.map((line) => line.body)
            : lines.map((line) => ({ [STUDY_LABEL[kind]]: line.label, text: line.body }));
      }
    }
    content.study[level.id] = pack;
  }

  for (const photo of photographs) {
    const row = {
      level: photo.level_id,
      file: photo.file,
      sha256: photo.sha256,
      webpSha256: photo.webp_sha256,
    };
    // The three optional fingerprints and the two optional credits are left out
    // rather than written as null: a picture with no third format has no such
    // field, which is what the file has always said.
    if (photo.avif_sha256) row.avifSha256 = photo.avif_sha256;
    row.thumbSha256 = photo.thumb_sha256;
    if (photo.card_sha256) row.cardSha256 = photo.card_sha256;
    row.width = photo.width;
    if (photo.commons_title) row.commonsTitle = photo.commons_title;
    if (photo.origin) row.origin = photo.origin;
    row.author = photo.author;
    row.licence = photo.licence;
    if (photo.licence_fr) row.licenceFr = photo.licence_fr;
    row.collection = photo.collection;
    row.caption = { en: photo.caption_en, fr: photo.caption_fr };
    content.photographs.push(row);
  }

  return content;
}

/**
 * One file with the declaration between its two markers replaced by this one.
 *
 * Everything outside the markers is carried through untouched, which is the whole
 * point: the code and the comments of these modules are not this command's to
 * write. A file missing a marker is a fault rather than something to append to,
 * since silently writing the content at the end of a file whose shape changed is
 * exactly how a generator eats a module.
 */
function spliced(source, declaration, where) {
  const lines = source.split("\n");
  const start = lines.indexOf(MARKERS.start);
  const end = lines.indexOf(MARKERS.end);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`${where}: the two marker lines that frame the content are not both there`);
  }
  return [...lines.slice(0, start + 1), declaration, ...lines.slice(end)].join("\n");
}

/** What each module would hold, as the text this command writes into it. */
async function moduleText(sql) {
  const content = await contentFrom(sql);
  return MODULES.map((module) => {
    const file = path.join(ROOT, module.file);
    const text = spliced(readFileSync(file, "utf8"), module.declaration(content), module.file);
    return { file, name: module.file, text };
  });
}

/**
 * The repository's modules, written from the database.
 *
 * The direction is the point: this is the command that makes the database the
 * source of what ships rather than a copy of it. Content is edited in the
 * database, pulled into the four modules, and reviewed as the diff of those files
 * - and the check below is what says the two still agree.
 */
async function pull(sql) {
  const modules = await moduleText(sql);
  for (const module of modules) writeFileSync(module.file, module.text, "utf8");
  for (const module of modules) console.log(`content: ${module.name}: written from the database`);
  console.log("\ncontent: the modules now hold what the database holds. Run the tests, then commit them.");
}

/**
 * The modules that no longer match the database, named.
 *
 * A file whose content between the markers differs from what the database would
 * write is the same kind of fault as a table that differs: the repository claims
 * something the database does not say.
 */
async function staleModules(sql) {
  const modules = await moduleText(sql);
  return modules.filter((module) => readFileSync(module.file, "utf8") !== module.text);
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

  // The row that dates the write, last: the moment it carries is the moment the
  // content was whole rather than the moment its first table landed.
  await sql.query(SYNC.upsert, [
    rows.levels.length,
    rows.questions.length,
    rows.study_notes.length,
    rows.photographs.length,
    pushSource(),
  ]);
  console.log(`content: ${SYNC.name}: this write recorded, ${rows.levels.length} level(s) at its moment`);

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

  // The modules are checked the same way the tables are, and for the same
  // reason: the generated lines are content too. A file that has been edited by
  // hand where it is generated is a file the next `pull` would silently rewrite,
  // so it is named here rather than at the moment somebody loses their edit.
  const stale = await staleModules(sql);
  if (stale.length > 0) {
    faults += stale.length;
    for (const module of stale) {
      console.log(`content: ${module.name}: the generated lines differ from what the database would write`);
    }
  } else {
    console.log("content: the four modules hold what the database would write");
  }

  if (faults > 0) {
    console.error(
      `\ncontent: ${faults} thing(s) out of step. Run \`npm run content:pull\` to write the\n` +
        "database's content into the modules, or `npm run content:push` to write the\n" +
        "repository's content back into the database."
    );
    process.exit(1);
  }
  console.log("\ncontent: the database and the repository hold the same content, in the same words");
}

// The commands run only when this file is the program, so that the test that
// reads what it would write does not need a database, an environment or a
// credential, and cannot reach one by importing it.
const isProgram = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isProgram) {
  const command = (process.argv[2] || "").toLowerCase();

  if (command === "pull") await pull(connect());
  else if (command === "push") await push(connect());
  else if (command === "check") await check(connect());
  else {
    console.error(`neon-content: unknown command "${process.argv[2] ?? ""}". Use "pull", "push" or "check".`);
    process.exit(1);
  }
}
