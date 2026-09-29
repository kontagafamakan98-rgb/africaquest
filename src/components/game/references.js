import { getLevels } from "./gameData.js";
import { PUBLISHERS, noticeTitle, publisherName, publisherOf, searchUrl } from "./publishers.js";

// The institutions themselves, and the link a reference to one of them can be
// looked up with, live in publishers.js; they are passed on from here because
// this module is where the bibliography and the tests have always read them, and
// a second place to look for the same list is how the two copies begin.
export { PUBLISHERS, noticeTitle, publisherName, publisherOf, searchUrl };

/**
 * Every work the game quotes, grouped by the institution that publishes it.
 *
 * Each institution carries its works in the order the game first quotes them,
 * and each work carries the questions it documents, in the order they are asked.
 * That order is the timeline the rest of the game follows, so the page reads
 * from the oldest question to the newest rather than from A to Z, and a work
 * quoted twice under the same name is one entry rather than two.
 *
 * A question whose reference names no institution is left out rather than
 * gathered under a heading of its own: the bibliography is a list of works, and
 * an entry with no publisher is one nobody could go and read. A test holds that
 * no reference is left out this way.
 *
 * Each work carries the link it can be followed with, which is a page somebody
 * opened where the game has one and a search of the institution's own site
 * where it does not. The two are separate fields rather than one, so the page
 * cannot show a search as though it were a page of the work.
 *
 * The wording, like everywhere else in the game, is the wording of the language
 * on screen: the works and the questions are the French ones in French.
 */
export function getBibliography(lang = "en") {
  const institutions = PUBLISHERS.map((publisher) => ({
    id: publisher.id,
    name: publisherName(publisher, lang),
    host: publisher.host || null,
    works: [],
    questions: 0,
  }));
  const byId = new Map(institutions.map((institution) => [institution.id, institution]));
  const seen = new Map();

  for (const level of getLevels(lang)) {
    level.questions.forEach((question, index) => {
      const source = question.source;
      if (!source || typeof source.label !== "string") return;

      const publisher = publisherOf(source.label, lang);
      if (!publisher) return;

      const institution = byId.get(publisher.id);
      let works = seen.get(publisher.id);
      if (!works) seen.set(publisher.id, (works = new Map()));

      let work = works.get(source.label);
      if (!work) {
        work = {
          label: source.label,
          // A verified page and a search are kept apart on purpose: the first is
          // an address somebody opened, the second only opens the institution's
          // own search on the title, and the page shows them differently.
          url: source.url || null,
          search: searchUrl(source.label, lang),
          questions: [],
        };
        works.set(source.label, work);
        institution.works.push(work);
      }

      work.questions.push({
        level: level.id,
        levelTitle: level.title,
        number: index + 1,
        question: question.question,
      });
      institution.questions += 1;
    });
  }

  return institutions.filter((institution) => institution.works.length > 0);
}
