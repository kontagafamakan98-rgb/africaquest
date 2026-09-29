import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LEVELS } from "./gameData.js";
import { LEVELS_FR } from "./content-fr.js";
import { PUBLISHERS, getBibliography, noticeTitle, publisherName, publisherOf, searchUrl } from "./references.js";

// The reference is one of the promises the app makes: an explanation is not an
// assertion the player has to take on trust, it is a line out of a work someone
// else can open. These tests hold that promise question by question, which a
// list per level could not: nothing here reads the level, only the explanation.
//
// The second half holds the other end of it: the bibliography page, which lists
// the same works grouped by the institution that publishes them. A work quoted
// in the quiz and missing from that page, or a question filed under a work that
// does not document it, would be the same broken promise seen from the other
// side, so both ends are read from the one list of institutions.

const ROOT = path.resolve(import.meta.dirname, "..", "..", "..");
const DATA_FILE = path.join(import.meta.dirname, "gameData.js");
const FRENCH_FILE = path.join(import.meta.dirname, "content-fr.js");
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

/** Every question of one language, flattened, with the level it belongs to. */
const flatten = (levels) =>
  levels.flatMap((level) =>
    level.questions.map((question, index) => ({ level: level.id, index, question }))
  );

const QUESTIONS = flatten(LEVELS).length;
/** Where each level falls in the timeline the game is told in. */
const RANK = new Map(
  [...LEVELS].sort((one, other) => one.order - other.order).map((level, index) => [level.id, index])
);

test("every explanation carries one reference, and one only", () => {
  flatten(LEVELS).forEach(({ level, index, question }) => {
    const where = `level ${level} question ${index + 1}`;
    const source = question.source;

    assert.ok(source && !Array.isArray(source), `${where}: the reference is one entry, not a list`);
    assert.ok(nonEmpty(source.label), `${where}: the reference needs a label`);
    // A citation names the work and the point it backs: "Britannica" on its own
    // would send the reader looking for the passage themselves.
    assert.match(source.label, /,\s*\S/, `${where}: "${source.label}" does not say what it is about`);
    assert.ok(!/[\r\n]/.test(source.label), `${where}: the label stays on one line`);

    if (source.url !== undefined) {
      assert.match(source.url, /^https:\/\/[^\s]+$/, `${where}: reference url`);
    }
  });
});

test("every reference names an institution the reader can go and check", () => {
  const quoted = new Set();

  flatten(LEVELS).forEach(({ level, index, question }) => {
    const publisher = publisherOf(question.source.label);
    assert.ok(
      publisher,
      `level ${level} question ${index + 1}: "${question.source.label}" names no institution the game quotes from`
    );
    quoted.add(publisher.id);
  });

  assert.equal(quoted.size, PUBLISHERS.length, "every institution in the list is actually quoted");
});

test("the French reference is the same institution, named in French", () => {
  LEVELS.forEach((level) => {
    const french = LEVELS_FR[level.id];

    // The question for question pairing is what keeps a reference with its own
    // explanation: a shorter French list falls back to English as a whole rather
    // than sliding every reference up by one.
    if (!french || french.questions.length !== level.questions.length) {
      assert.equal(LEVELS_FR[level.id], undefined, `level ${level.id} is translated in part`);
      return;
    }

    level.questions.forEach((question, index) => {
      const where = `level ${level.id} question ${index + 1}`;
      const publisher = publisherOf(question.source.label);
      const label = french.questions[index].source;

      assert.ok(nonEmpty(label), `${where}: the French reference is missing`);
      // Read with the French names, the reference has to land on the same
      // institution as its English counterpart: it is one work in two
      // languages, not two works that happen to be cited next to each other.
      assert.equal(
        publisherOf(label, "fr")?.id,
        publisher.id,
        `${where}: "${label}" is not how ${publisherName(publisher, "fr")} is named in French`
      );
    });
  });
});

test("the links stay on the site of the work they name", () => {
  let linked = 0;
  let writtenOut = 0;

  flatten(LEVELS).forEach(({ level, index, question }) => {
    const where = `level ${level} question ${index + 1}`;
    const source = question.source;
    const publisher = publisherOf(source.label);
    assert.ok(publisher, `${where}: "${source.label}" names no institution the game quotes from`);

    if (source.url === undefined) {
      writtenOut += 1;
      assert.equal(publisher.host, null, `${where}: ${publisherName(publisher)} has a page to link to`);
      return;
    }

    linked += 1;
    assert.ok(publisher.host, `${where}: ${publisherName(publisher)} is quoted without a page to link to`);
    assert.equal(new URL(source.url).host, publisher.host, `${where}: the link leaves ${publisher.host}`);
  });

  // Both halves have to stay real: the linked entries are the ones a teacher can
  // open in one click, the written out ones the works that are quoted by title.
  assert.ok(linked >= 50, `only ${linked} references carry a verified link`);
  assert.ok(writtenOut >= 50, `only ${writtenOut} references are written out in full`);
});

test("a level cites several works rather than leaning on one page", () => {
  const works = new Set();

  LEVELS.forEach((level) => {
    const distinct = new Set(level.questions.map((question) => question.source.label));
    assert.ok(distinct.size >= 3, `level ${level.id} cites ${distinct.size} work(s) for its whole quiz`);
    distinct.forEach((label) => works.add(label));
  });

  assert.ok(works.size >= 40, `the game quotes ${works.size} works in total`);
});

test("in the file, the reference follows the explanation it belongs to", () => {
  // The two are paired by position when the level is translated, so each
  // explanation has to be written with its own reference right after it.
  const english = readFileSync(DATA_FILE, "utf8").match(/fact: "(?:[^"\\]|\\.)*",\n\s*source: \{/g) || [];
  const french = readFileSync(FRENCH_FILE, "utf8").match(/fact: "(?:[^"\\]|\\.)*",\n\s*source: "/g) || [];
  const questions = flatten(LEVELS).length;

  assert.equal(english.length, questions, "every English explanation is followed by its reference");
  assert.equal(french.length, questions, "every French explanation is followed by its reference");
  assert.ok(questions >= 150, `expected the whole game to be checked, found ${questions} explanations`);
});

test("the bibliography accounts for every question of the game, once, in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const institutions = getBibliography(lang);
    const told = institutions.reduce((total, institution) => total + institution.questions, 0);

    // What the page leaves out is what a reader cannot check, so the count is
    // the whole game: every question is documented by some work, and none twice.
    assert.equal(told, QUESTIONS, `${lang}: ${told} of ${QUESTIONS} questions are accounted for`);
    assert.equal(
      institutions.length,
      PUBLISHERS.length,
      `${lang}: an institution the game quotes has no section of its own`
    );

    const listed = new Set();
    for (const institution of institutions) {
      for (const work of institution.works) {
        assert.ok(work.questions.length > 0, `${lang}: ${work.label} documents no question`);
        for (const entry of work.questions) {
          const key = `${work.label} | ${entry.level}.${entry.number}`;
          assert.ok(!listed.has(key), `${lang}: ${key} is listed twice`);
          listed.add(key);
          assert.ok(nonEmpty(entry.question), `${lang}: ${key} has no question to show`);
          assert.ok(nonEmpty(entry.levelTitle), `${lang}: ${key} has no level`);
        }
      }
    }
    assert.equal(listed.size, QUESTIONS, `${lang}: the entries are the questions of the game, one for one`);
  }
});

test("a work sits under the institution whose name opens its reference", () => {
  for (const lang of ["en", "fr"]) {
    for (const institution of getBibliography(lang)) {
      const publisher = PUBLISHERS.find((entry) => entry.id === institution.id);
      assert.ok(publisher, `${institution.id} is not in the list of institutions`);
      assert.equal(institution.name, publisherName(publisher, lang), `${lang}: the name of ${institution.id}`);

      for (const work of institution.works) {
        assert.equal(
          publisherOf(work.label, lang)?.id,
          institution.id,
          `${lang}: ${work.label} is filed under ${institution.name}`
        );
      }
    }
  }
});

test("a notice quoted by title is looked up through the search its publisher publishes", () => {
  // The site refuses a request from a script, so no page of a Britannica notice
  // can be opened and checked from here, and none is claimed. What a reader can
  // follow is the search the institution publishes itself, and the title it is
  // given is the one the reference quotes, without the institution around it.
  assert.equal(noticeTitle('Encyclopaedia Britannica, "Ancient Egypt"'), "Ancient Egypt");
  assert.equal(noticeTitle("Encyclopaedia Britannica, notice « Ancient Egypt »"), "Ancient Egypt");
  assert.equal(noticeTitle('Encyclopaedia Britannica, "Musa I of Mali"'), "Musa I of Mali");
  assert.equal(
    noticeTitle("UNESCO World Heritage List, Tombouctou"),
    "Tombouctou",
    "a reference written without quotation marks falls back to what follows the name"
  );

  const english = searchUrl('Encyclopaedia Britannica, "Great Sphinx of Giza"');
  const french = searchUrl("Encyclopaedia Britannica, notice « Great Sphinx of Giza »", "fr");
  assert.equal(english, "https://www.britannica.com/search?query=Great%20Sphinx%20of%20Giza");
  assert.equal(french, english, "the same notice in two languages is the same search");
  assert.equal(new URL(english).searchParams.get("query"), "Great Sphinx of Giza");
  // Everything a title can hold travels in the query, punctuation included. The
  // shape of the address is not invented either: it is the one Wikidata records
  // as the search formatter URL for Encyclopaedia Britannica.
  assert.equal(
    searchUrl('Encyclopaedia Britannica, "Mali empire & Songhai"'),
    "https://www.britannica.com/search?query=Mali%20empire%20%26%20Songhai"
  );

  // An institution that publishes no search of its own is not given a guessed
  // one, and neither is a line that names no institution at all.
  assert.equal(searchUrl("UNESCO World Heritage List, Timbuktu"), null);
  assert.equal(searchUrl('Somewhere else, "Nubia"'), null);
});

test("a work is linked where the game has a page for it, and searched for where it has none", () => {
  // The same rule as under a question, seen on the page rather than in the quiz:
  // a link is a claim that somebody checked it. The list shows both halves, and
  // a work moved from one to the other by accident fails here.
  for (const lang of ["en", "fr"]) {
    const works = getBibliography(lang).flatMap((institution) => institution.works);
    const linked = works.filter((work) => work.url);
    const writtenOut = works.filter((work) => !work.url);

    assert.ok(linked.length >= 20, `${lang}: only ${linked.length} works carry a link`);
    assert.ok(writtenOut.length >= 50, `${lang}: only ${writtenOut.length} works are quoted by title`);

    for (const work of linked) {
      const publisher = publisherOf(work.label, lang);
      assert.ok(publisher.host, `${lang}: ${work.label} carries a link while its publisher is quoted without one`);
      assert.equal(new URL(work.url).host, publisher.host, `${lang}: ${work.label} links away from its publisher`);
      // A page somebody opened is enough: nothing offers a search beside it,
      // since a reader who can read the work does not need one for it.
      assert.equal(work.search, null, `${lang}: ${work.label} is searched for although it has a page`);
    }
    for (const work of writtenOut) {
      const publisher = publisherOf(work.label, lang);
      assert.equal(publisher.host, null, `${lang}: ${work.label} is quoted by title although its publisher has a page`);
      // And the other half is not left as dead text: the notice is searched for
      // on the site of the institution that publishes it.
      assert.ok(work.search, `${lang}: ${work.label} is quoted by title and offers no way to look it up`);
      assert.ok(publisher.search, `${lang}: ${publisherName(publisher)} has no search for ${work.label}`);
      assert.equal(
        new URL(work.search).host,
        new URL(publisher.search.replace("{query}", "x")).host,
        `${lang}: ${work.label} leaves for another site to be searched for`
      );
      assert.equal(
        new URL(work.search).searchParams.get("query"),
        noticeTitle(work.label),
        `${lang}: ${work.label} searches for something other than its own title`
      );
    }
  }
});

test("the two kinds of link are shown as two different things, on both screens that show one", () => {
  const page = readFileSync(path.join(ROOT, "src", "pages", "Bibliography.jsx"), "utf8");
  const reference = readFileSync(path.join(ROOT, "src", "components", "game", "SourceReference.jsx"), "utf8");

  for (const [what, source] of [
    ["the bibliography", page],
    ["the reference under a question", reference],
  ]) {
    // A search leaves the app like a verified link does, so it is drawn apart
    // from it rather than beside it looking the same: the icon of a search, a
    // decoration of its own, and the word that says what it does.
    assert.match(source, /<Search\b/, `${what}: a search is shown without the icon of one`);
    assert.match(source, /decoration-dashed/, `${what}: a search is underlined like a page somebody checked`);
    assert.match(source, /t\.searchNotice\b/, `${what}: neither link says which one it is`);
    assert.match(source, /rel="noopener noreferrer"/, `${what}: a link into the site of a publisher`);

    // The verified link keeps its own decoration, and the two do not meet: a
    // reader is not left comparing two amber underlines for the difference.
    const verified = source.split("\n").find((line) => line.includes("decoration-amber-400"));
    assert.ok(verified, `${what}: the verified link is gone`);
    assert.doesNotMatch(verified, /dashed/, `${what}: the verified link is drawn like a search`);
  }

  // A search is only ever offered where there is no page to open: the game is
  // not asking a reader to choose between two links to the same work.
  assert.match(reference, /source\.url \? null : searchUrl\(source\.label\)/, "a reference with a page is searched for as well");
  assert.match(page, /!work\.url && work\.search/, "a work with a page is searched for as well");

  // And the difference is said once, where the reader meets it, rather than left
  // to the colour of an underline.
  assert.match(page, /t\.searchNoticeNote/, "the bibliography never says a search is not a page");
  assert.match(reference, /title=\{t\.searchNoticeNote\}/, "the reference never says it either");
});

test("the works follow the timeline the game is told in, and read in the language on screen", () => {
  for (const lang of ["en", "fr"]) {
    for (const institution of getBibliography(lang)) {
      const position = (entry) => RANK.get(entry.level) * 1000 + entry.number;

      // The page reads from the oldest question to the newest rather than from A
      // to Z: the order of the game is what a lesson follows.
      const firsts = institution.works.map((work) => position(work.questions[0]));
      assert.deepEqual(
        firsts,
        [...firsts].sort((one, other) => one - other),
        `${lang}: ${institution.name} quotes its works out of order`
      );
      for (const work of institution.works) {
        const positions = work.questions.map(position);
        assert.deepEqual(
          positions,
          [...positions].sort((one, other) => one - other),
          `${lang}: ${work.label} lists its questions out of order`
        );
      }
    }
  }

  // And the language is the one on screen, names included: a French page that
  // said "UNESCO World Heritage List" would be the half translated app this
  // project spends its other tests refusing.
  const french = getBibliography("fr");
  const english = getBibliography("en");
  const nameOf = (bibliography, id) => bibliography.find((entry) => entry.id === id).name;

  assert.equal(nameOf(english, "unesco-world-heritage"), "UNESCO World Heritage List");
  assert.equal(nameOf(french, "unesco-world-heritage"), "Liste du patrimoine mondial de l'UNESCO");
  assert.equal(nameOf(english, "african-union"), "African Union");
  assert.equal(nameOf(french, "african-union"), "Union africaine");

  const frenchWorks = french.flatMap((institution) => institution.works);
  const olduvai = frenchWorks.find((work) => work.label.includes("Olduvai"));
  assert.ok(olduvai, "the French list quotes the works in French");
  assert.ok(
    olduvai.questions.some((entry) => entry.question.includes("Olduvai")),
    "a French work lists the French questions it documents"
  );
  assert.match(olduvai.label, /«\s/, "the French notice is written the French way");
});

test("the bibliography page lists what the game quotes, and opens from the settings", () => {
  const page = readFileSync(path.join(ROOT, "src", "pages", "Bibliography.jsx"), "utf8");

  // A page of its own, reached from the settings screen beside the legal pages
  // and the credits, so a reader can find it without being told a route.
  assert.match(
    readFileSync(path.join(ROOT, "src", "pages.config.js"), "utf8"),
    /Bibliography/,
    "the bibliography is routed"
  );
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "game", "SettingsModal.jsx"), "utf8"),
    /to="\/Bibliography"/,
    "the settings screen opens the bibliography"
  );

  // The list is derived, never copied: an institution named by hand here, or a
  // work written out, would go on being listed after the quiz stopped quoting
  // it, which is the drift the whole suite exists to catch.
  assert.match(page, /getBibliography\(lang\)/, "the works come from the game's own references");
  assert.doesNotMatch(page, /Encyclopaedia|Britannica|UNESCO|World Heritage/, "an institution is named by hand");

  // And every wording it shows has to exist in both dictionaries: a missing key
  // is an empty line on a screen nobody opens before shipping it.
  const dictionary = readFileSync(path.join(ROOT, "src", "components", "i18n.jsx"), "utf8");
  const wordings = new Set([...page.matchAll(/\bt\.([A-Za-z0-9_]+)/g)].map((match) => match[1]));
  assert.ok(wordings.size >= 5, `only ${wordings.size} wordings were read from the bibliography page`);

  for (const wording of wordings) {
    assert.equal(
      [...dictionary.matchAll(new RegExp(`^ {4}${wording}:`, "gm"))].length,
      2,
      `${wording} is not written in both languages`
    );
  }
});
