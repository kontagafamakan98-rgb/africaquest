/**
 * The pages the verified references point at, the title each one answers with,
 * and what an answer about one of them means.
 *
 * A reference under a question is either linked to a page somebody here opened
 * or written out in full and offered as a search. This is about the first kind:
 * the address a lesson says the work was read at. Such an address is a promise
 * in two halves, and only one of them is visible from here. That the page still
 * answers is the first, and it is the easy one. That it is still *that* page is
 * the second, and it is the one nobody sees: a site that reuses a path, or that
 * answers a missing article with a landing page and a 200, leaves a link that
 * opens something, under a title that is not the work it was cited for.
 *
 * So the pages are followed on demand, by scripts/check-reference-pages.mjs,
 * and the title is read out of each answer and held against the two names the
 * citation carries: the work's own name, and the institution that publishes it.
 * Reading a title is a heuristic and the report says so. It is not a proof that
 * the page is the work, and it cannot be: only a person can read a page. What it
 * is, is the difference between a link that opens the work and a link that opens
 * something else, which is otherwise found by a reader rather than by us.
 *
 * This is a module rather than part of that script so the tests read the same
 * rules it runs: which pages the references point at, how a title is read, and
 * what a page that answered is judged to have named. It touches neither the
 * network nor the disk, and it carries no address of its own.
 */
import { CONTACT_EMAIL } from "./contact.js";
import { noticeTitle } from "../components/game/publishers.js";
import { getBibliography } from "../components/game/references.js";
import { sameAddress } from "./urls.js";

/**
 * What the requests say they are.
 *
 * A publisher is entitled to know who is reading its pages, and the address it
 * is told is the one the project publishes rather than a second copy of it. It
 * names reference pages rather than photographs, since a reader of a server log
 * is owed the difference between a check on the credits and a check on the
 * works the questions quote.
 */
export const REFERENCE_AGENT = `AfricaHistoryQuest/1.0 (reference pages; ${CONTACT_EMAIL})`;

/**
 * The words that carry no name, and so are not looked for in a title.
 *
 * A citation and the page it names rarely spell the same sentence: one writes
 * "and" and the other "et", and neither carries what the work is called. Landing
 * on the article is what is being judged, not the grammar of the headline.
 */
const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "aux", "by", "dans", "de", "des", "du", "en", "et",
  "for", "from", "in", "into", "its", "la", "le", "les", "of", "on", "or", "par",
  "pour", "sa", "son", "sur", "the", "to", "un", "une", "with",
]);

/** The characters an answer writes in place of the ones a title is read with. */
const NAMED_ENTITIES = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };

/**
 * An answer's text with the entities that hide letters taken out of it.
 *
 * A title is compared as words, so the entities that change a word are the ones
 * that matter: an apostrophe written as `&#39;` would otherwise split a name in
 * two, and a non-breaking space would make one word of the two it stands between.
 */
function decodeEntities(text) {
  return text.replace(/&(#[0-9a-fx]+|[a-z]+);/gi, (whole, body) => {
    if (body.startsWith("#")) {
      const code =
        body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
  });
}

/**
 * The title a page answers with, or nothing when it answers without one.
 *
 * The title is what a browser tab shows and what a reader takes the page to be,
 * which is exactly the claim being checked. A page that carries none is not a
 * page this can say anything about, and is reported as such rather than as a
 * page whose title is wrong.
 */
export function titleOf(html) {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html ?? ""));
  if (!match) return null;
  const text = decodeEntities(match[1]).replace(/\s+/g, " ").trim();
  return text.length > 0 ? text : null;
}

/**
 * The words of a name, as a comparison sees them: case, accents and the small
 * words are all put aside, and a single letter is not a name.
 *
 * A letter is dropped because a roman numeral beside a volume is not what the
 * page is about, and a name that came down to one character would be found
 * everywhere. The rest of the name is what has to be found in the title.
 */
export function nameWords(name) {
  const words = String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().match(/[\p{L}\p{N}]+/gu);
  return (words || []).filter((word) => word.length > 1 && !SMALL_WORDS.has(word));
}

/**
 * Whether two words of a name are the same word.
 *
 * Three ways, because a citation and a page disagree in three ways and none of
 * them is a different work: the same word, a word the other one grew out of
 * (`Slave` in `SlaveVoyages`, `trans` in `transatlantic`), and two spellings of
 * one word whose ends differ (`Nécropole` and `Necropolis`, a plural in one
 * language and not in the other). The last is a shared beginning of five
 * characters, which is long enough that two different words rarely share it.
 */
function sameNameWord(one, other) {
  if (one === other) return true;
  if (one.length >= 4 && other.includes(one)) return true;
  if (other.length >= 4 && one.includes(other)) return true;
  let shared = 0;
  while (shared < one.length && shared < other.length && one[shared] === other[shared]) shared += 1;
  return shared >= 5;
}

/**
 * How much of a name a page title holds, as a fraction of the name's words.
 *
 * A fraction rather than yes or no, because a page may name most of a work: the
 * first of the General History of Africa is cited as volume I and its page is
 * the whole series, which is the work it names with one word to spare. What the
 * fraction is held to is the bar below.
 */
export function nameHeld(name, title) {
  const wanted = nameWords(name);
  if (wanted.length === 0) return 0;
  const offered = new Set(nameWords(title));
  const held = wanted.filter((word) => [...offered].some((other) => sameNameWord(word, other)));
  return held.length / wanted.length;
}

/**
 * How much of a work's own name a page title has to hold to count as naming it,
 * and half is where the bar is: a title that holds the smaller part of a name is
 * a title about something else, and a title that holds the larger part is a title
 * about that thing, however it is worded.
 */
export const TITLE_ENOUGH = 0.5;

/**
 * And how much of the institution's name, where that is all the title holds.
 *
 * Higher, because naming the institution is the weaker of the two answers and the
 * bar has to say so: a work called `Timbuktu` on a page titled `World Heritage
 * Centre` holds half of `UNESCO World Heritage List` while naming the work not at
 * all, and that is a page of the right institution which is not the page promised.
 * A whole site named after its own publisher, which is where this answer really
 * comes from, holds all of it.
 */
export const INSTITUTION_ENOUGH = 0.75;

/**
 * Every page a verified reference points at, with the works cited for it.
 *
 * Both languages are walked, because a French citation is a different line
 * pointing at the same page: `liste du patrimoine mondial de l'UNESCO,
 * Tombouctou` and `UNESCO World Heritage List, Timbuktu` are one address, and a
 * page is judged against either of them. The two are kept in one entry rather
 * than checked twice, since the address is what is followed.
 *
 * Each work carries three strings rather than one: the line as the reference
 * writes it, the work's own name out of that line, and the institution that
 * publishes it. The second is what the page title is expected to name, and the
 * third is what the page may name instead when the work is a whole site, which
 * is a weaker answer and is reported as the weaker one.
 *
 * Each page also carries the one line a report names it by. One rather than all
 * of them, because a page is one page: the seven volumes of the General History
 * share an address, and a failure line listing fourteen references for it would
 * be a line nobody reads. The English one is preferred where both languages cite
 * the page, since the report is written in English and the two are the same
 * reference written twice.
 *
 * The order is by address rather than by the order of the levels: the report is
 * a list of pages, and a list whose lines move when a lesson is added is a list
 * two people cannot compare. Addresses are compared as code units for the same
 * reason, and not by anybody's idea of what comes first.
 */
export function referencePages(langs = ["en", "fr"], bibliography = getBibliography) {
  const pages = new Map();

  for (const lang of langs) {
    for (const institution of bibliography(lang)) {
      for (const work of institution.works) {
        if (!work.url) continue;
        let page = pages.get(work.url);
        if (!page) pages.set(work.url, (page = { url: work.url, host: institution.host, works: [] }));
        page.works.push({
          label: work.label,
          name: noticeTitle(work.label),
          institution: institution.name,
          lang,
        });
      }
    }
  }

  return [...pages.values()]
    .map((page) => ({ ...page, label: (page.works.find((work) => work.lang === "en") || page.works[0]).label }))
    .sort((one, other) => (one.url < other.url ? -1 : one.url > other.url ? 1 : 0));
}

/**
 * What following one reference page turned out to be.
 *
 * Six answers and not two, because only some of them are about the reference.
 * A page that answered under the work's own title is the one being promised. A
 * page that answered under the title of its institution alone is the weaker
 * answer: the reader lands on the right site, in front of the work the site is
 * named after, and the title does not name the work itself. A page that
 * answered under neither has left the reference behind, and that is the failure
 * this check exists for. A page the site sends somewhere else has moved. A page
 * that says it is not there is gone.
 *
 * The sixth pair is the two answers that say nothing about the reference: a
 * refusal, which is what a publisher answers a script with whatever the address
 * says, and a connection that never came back. Neither may be printed as a
 * confirmation, and neither is a page to go and correct.
 *
 * The order matters twice. An address that moved is reported as moved even when
 * what it moved to is missing, because the address is the thing that changed. And
 * an answer is only read for a title when it is an address that answered: a
 * refusal carries a page that says nothing about the work, and reading it would
 * be reading the publisher's error page as the publisher's article.
 */
export function pageVerdict(page, answer) {
  if (answer.error) return { kind: "unreadable", detail: answer.error };
  if (answer.url && !sameAddress(page.url, answer.url)) return { kind: "moved", detail: answer.url };

  const status = Number(answer.status);
  if (status === 404 || status === 410) return { kind: "gone", detail: String(status) };
  if (!(status >= 200 && status < 300)) return { kind: "refused", detail: String(status) };

  const title = titleOf(answer.body);
  if (!title) return { kind: "unreadable", detail: "the answer carries no title" };

  const work = page.works.find((entry) => nameHeld(entry.name, title) >= TITLE_ENOUGH);
  if (work) return { kind: "named", how: "work", title, label: work.label };
  const institution = page.works.find((entry) => nameHeld(entry.institution, title) >= INSTITUTION_ENOUGH);
  if (institution) {
    return { kind: "named", how: "institution", title, label: institution.label, institution: institution.institution };
  }
  return { kind: "elsewhere", title };
}

/** Whether an answer names the work the reference is cited for. */
export const pageNamesAWork = (result) => result.kind === "named" && result.how === "work";

/** Whether it names the institution alone, which is not the work itself. */
export const pageNamesTheInstitution = (result) => result.kind === "named" && result.how === "institution";

/**
 * Whether a result is a thing to fix rather than a thing to read.
 *
 * A refusal is not: it is the publisher declining to answer this kind of request,
 * which says nothing about the address, and a check that failed on one would be
 * failing on the publisher's terms of use. A page that could not be read is,
 * because a run that could not open a page is a run that did not check it, and
 * one of those left in a green run is how the whole check stops meaning anything.
 */
export const pageIsWrong = (result) =>
  result.kind === "elsewhere" || result.kind === "moved" || result.kind === "gone" || result.kind === "unreadable";
