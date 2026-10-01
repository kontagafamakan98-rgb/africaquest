-- The content of the game, in the database.
--
-- The application itself is a static site: it ships as files, it works with no
-- network at all, and nothing a player does leaves their device. What lives here
-- is what a lesson is made of, in the one place it can be edited, counted and
-- translated without opening a code editor: the levels, their wording in both
-- languages, the questions and their answers, the study material of each lesson
-- and the photographs with the credit each one owes.
--
-- Nothing in the built application talks to this database. A script reads it and
-- writes the tables back into the modules the game ships with (see
-- scripts/neon-content.mjs), so the site keeps working offline, on a checked-out
-- branch, on a runner with no credential.
--
-- The shape follows the content rather than the screens. A level is a row; its
-- wording is one row per language, because a title is a translation of a title
-- and not a column that appears twice; a question is a row, the four answers it
-- offers and the explanation that follows are one row per language, because the
-- right answer is the third option in both. The study material is one row per
-- line of the lesson: a paragraph of the essay, a dated moment, a name, a place,
-- a word.
--
-- Applied with: neon psql production -f db/schema.sql
-- (or by scripts/neon-content.mjs, which applies it before it writes).

-- One level of the game: the twenty periods, in the order the map draws them.
create table if not exists levels (
  id         integer primary key,
  ordering   integer not null unique,
  era        text not null,
  from_year  integer not null,          -- negative before our era
  color      text not null,             -- the tailwind pair the card is painted with
  icon       text not null              -- the name of the lucide icon the card carries
);

-- The wording of a level, one row per language. A missing row is a level left
-- untranslated, which is a fault rather than a fallback: the tests refuse it.
create table if not exists level_texts (
  level_id  integer not null references levels (id) on delete cascade,
  lang      text not null check (lang in ('en', 'fr')),
  title     text not null,
  subtitle  text not null,
  region    text not null,
  primary key (level_id, lang)
);

-- One question, in the facts that do not change with the language. The right
-- answer is one of them: it is an index into the options, and it belongs here
-- rather than beside the wording so that a translation cannot mark another
-- answer than the one the question was written with.
create table if not exists questions (
  level_id      integer not null references levels (id) on delete cascade,
  position      integer not null,        -- 0 based, the order the level asks them
  right_answer  integer not null check (right_answer between 0 and 3),
  source_url    text,                    -- the page the reference was read on, when there is one
  primary key (level_id, position)
);

-- The same question as a reader meets it: what is asked, what is offered, what
-- is explained afterwards. The four options are one jsonb array so the order of
-- the answers cannot drift from the index that names the right one.
create table if not exists question_texts (
  level_id     integer not null,
  position     integer not null,
  lang         text not null check (lang in ('en', 'fr')),
  prompt       text not null,
  options      jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  explanation  text not null,
  source_label text not null,            -- the work the explanation comes from, in this language
  primary key (level_id, position, lang),
  foreign key (level_id, position) references questions (level_id, position) on delete cascade
);

-- One line of the study material: a paragraph of the history, a dated moment, a
-- person, a place, a word. `label` is what the line is called (the year, the
-- name, the term) and is null for a paragraph, which is its own text.
create table if not exists study_notes (
  level_id  integer not null references levels (id) on delete cascade,
  lang      text not null check (lang in ('en', 'fr')),
  kind      text not null check (kind in ('essay', 'timeline', 'people', 'places', 'glossary')),
  position  integer not null,
  label     text,
  body      text not null,
  primary key (level_id, lang, kind, position)
);

-- One photograph of a level. Every column is owed to somebody: the author and
-- the licence are what the credit line under the picture repeats, the captions
-- are the two languages it is written in, and the fingerprints are what ties
-- the credit to the exact bytes the game ships.
create table if not exists photographs (
  level_id      integer not null references levels (id) on delete cascade,
  position      integer not null,
  file          text not null,           -- the name in public/photos, without a base
  caption_en    text not null,
  caption_fr    text not null,
  author        text,
  licence       text not null,
  licence_fr    text,
  collection    text not null,
  commons_title text,
  origin        text,
  width         integer,
  sha256        text,
  webp_sha256   text,
  avif_sha256   text,
  thumb_sha256  text,
  primary key (level_id, position)
);

-- What the database knows about every photograph, for the credits screen and for
-- anyone checking a licence. A view rather than a query kept in a script.
create or replace view photograph_credits as
  select p.level_id,
         p.position,
         p.file,
         coalesce(p.author, p.collection) as credit_holder,
         p.licence,
         p.collection,
         p.caption_en,
         p.caption_fr
    from photographs p
   order by p.level_id, p.position;
