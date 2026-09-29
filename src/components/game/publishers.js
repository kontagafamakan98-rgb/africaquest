/**
 * The works the game quotes, and the institutions that publish them.
 *
 * Every explanation in the quiz carries a reference, and a reference is one line
 * out of somebody else's work. This is the list of the institutions those lines
 * come from: how each one is named in the two languages, which site its pages
 * live on, and, where a reference names it differently from its own title, the
 * fragment a reference opens with.
 *
 * It is a module apart from the bibliography that reads it, and that is about
 * who else needs it. Two screens show a reference: the bibliography groups the
 * works under their institution, and the quiz prints one reference under one
 * explanation, where a notice that carries no verified page is offered as a
 * search. The second of those is a screen somebody opens on a tap, and the list
 * of institutions has to travel with it. The levels, which the bibliography also
 * needs, live in the game's own content and are read there instead, so nothing
 * here pulls the questions into a screen that only wants to name a work.
 *
 * A single copy of the list is what keeps the two ends agreeing: a work quoted
 * in the quiz and missing from the bibliography, or filed under an institution
 * the reference does not name, would be the same broken promise seen from the
 * other side. The tests read this list, the bibliography composes it with the
 * levels, and neither writes an institution out by hand.
 *
 * The English name is what a reference opens with, and the French one is how the
 * same institution is named in the French references; the two are not always
 * translations of each other - UNESCO signs its world heritage list in French,
 * and its general history in English - which is why both are written out.
 */
export const PUBLISHERS = [
  {
    id: "unesco-world-heritage",
    name: { en: "UNESCO World Heritage List", fr: "Liste du patrimoine mondial de l'UNESCO" },
    // A French reference to this list opens with the list itself, not with the
    // organisation: "Liste du patrimoine mondial de l'UNESCO, Tombouctou".
    match: { fr: "patrimoine mondial de l'UNESCO" },
    host: "whc.unesco.org",
  },
  {
    id: "unesco-general-history",
    name: { en: "UNESCO, General History of Africa", fr: "UNESCO, Histoire générale de l'Afrique" },
    host: "www.unesco.org",
  },
  {
    id: "britannica",
    name: { en: "Encyclopaedia Britannica", fr: "Encyclopaedia Britannica" },
    // Its notices carry no verified page: the site answers a request from a
    // script with a refusal, so a link to a notice would be one nobody here
    // could have opened. What a reference to it carries instead is a search, and
    // the page says so rather than passing one off as the other.
    host: null,
    // The shape of that search is not invented, and it is written the way the
    // registry records it, `%1` and all, rather than in a notation of our own:
    // `npm run check:links` reads it back and compares the two strings, which is
    // the one thing following such a link cannot tell, since the site refuses a
    // request from a script whatever the address says. The item it is recorded
    // in is named beside it for the same reason, and is part of declaring a
    // search rather than an extra about it.
    search: "https://www.britannica.com/search?query=%1",
    wikidata: "Q455",
  },
  {
    id: "sahistory",
    name: { en: "South African History Online", fr: "South African History Online" },
    host: "www.sahistory.org.za",
  },
  {
    id: "african-union",
    name: { en: "African Union", fr: "Union africaine" },
    host: "au.int",
  },
  {
    id: "world-bank",
    name: { en: "World Bank", fr: "Banque mondiale" },
    host: "documents.worldbank.org",
  },
  {
    id: "united-nations",
    name: { en: "United Nations", fr: "Nations unies" },
    host: "population.un.org",
  },
  {
    id: "met-museum",
    name: { en: "Metropolitan Museum of Art", fr: "Metropolitan Museum of Art" },
    host: "www.metmuseum.org",
  },
  {
    id: "slave-voyages",
    name: { en: "Slave Voyages", fr: "Slave Voyages" },
    host: "www.slavevoyages.org",
  },
];

/** How an institution is named in one language, falling back to English. */
export function publisherName(publisher, lang = "en") {
  return publisher.name[lang] || publisher.name.en;
}

/**
 * The institution a reference comes from, or nothing when it names none.
 *
 * The fragment a reference is matched on is the institution's own name, except
 * where the references name it another way: that exception is written in `match`
 * rather than in a second name that would then have to be kept in step.
 */
export function publisherOf(label, lang = "en") {
  const text = String(label);
  const fragmentOf = (publisher) => publisher.match?.[lang] || publisherName(publisher, lang);
  return PUBLISHERS.find((publisher) => text.includes(fragmentOf(publisher))) || null;
}

/**
 * The title a notice is quoted by, as a reader would type it into a search.
 *
 * A notice is quoted by title, and the title is the part the reference puts in
 * quotation marks: "Encyclopaedia Britannica, \"Ancient Egypt\"" in English and
 * "Encyclopaedia Britannica, notice « Ancient Egypt »" in French name the same
 * article. Only the quoted part is a search term, since the rest names the
 * institution and a search for the whole line would find nothing.
 *
 * A reference written without quotation marks falls back to what follows the
 * institution's name, which is the closest thing to a title it has.
 */
export function noticeTitle(label) {
  const text = String(label);
  const quoted = text.match(/"([^"]+)"|«\s*([^»]+?)\s*»/);
  if (quoted) return (quoted[1] ?? quoted[2]).trim();
  const afterTheName = text.split(",").slice(1).join(",").trim();
  return afterTheName || text.trim();
}

/**
 * The search a reference can be looked up with, or nothing when the institution
 * publishes no search of its own.
 *
 * A reference is either linked to a page somebody here opened, or offered as a
 * search, and the two are not the same claim: the first says the work was read
 * at that address, the second only says the institution's own search will open
 * on the title. The screens show the difference rather than leaving the reader
 * to guess which promise they are following.
 *
 * The shape a search is built from is the one the registry records for that
 * publisher, placeholder included, so an on demand check can compare the two
 * strings and fail when they part company.
 */
export function searchUrl(label, lang = "en") {
  const publisher = publisherOf(label, lang);
  if (!publisher?.search) return null;
  const title = noticeTitle(label);
  // `%1` is the placeholder the shape is recorded with, and it is the only one
  // there is: a template written in a notation of our own would be a template
  // nothing else could agree with, which is what the check is for.
  return title ? publisher.search.replace("%1", encodeURIComponent(title)) : null;
}
