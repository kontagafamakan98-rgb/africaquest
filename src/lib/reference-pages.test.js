import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CONTACT_EMAIL } from "./contact.js";
import { getBibliography } from "../components/game/references.js";
import {
  INSTITUTION_ENOUGH,
  REFERENCE_AGENT,
  TITLE_ENOUGH,
  nameHeld,
  nameWords,
  pageIsWrong,
  pageNamesAWork,
  pageNamesTheInstitution,
  pageVerdict,
  referencePages,
  titleOf,
} from "./reference-pages.js";

// The pages the verified references point at, and what a followed page is judged
// to have named.
//
// A link under a question is a claim that somebody here read the work at that
// address. The page staying up is only half of that claim: the other half is that
// it is still the work, and a site that answers a retired article with a landing
// page and a 200 keeps the first half while breaking the second. Nothing in a
// build can see that, because the page is somebody else's: it takes following it
// and reading its title, which is what scripts/check-reference-pages.mjs does.
//
// Nothing here touches the network either. The script does that when somebody
// asks it to, and what it makes of an answer is decided by these functions.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPT = readFileSync(path.join(ROOT, "scripts", "check-reference-pages.mjs"), "utf8");
const MODULE = readFileSync(path.join(import.meta.dirname, "reference-pages.js"), "utf8");

test("every verified link is followed once, with the works that point at it", () => {
  const pages = referencePages();
  const linked = [];
  for (const lang of ["en", "fr"]) {
    for (const institution of getBibliography(lang)) {
      for (const work of institution.works) if (work.url) linked.push(work.url);
    }
  }

  // Derived from the bibliography rather than written down again: a second list
  // of addresses would go on being followed after the references stopped pointing
  // at them, which is the drift this whole check is built to avoid.
  assert.deepEqual(
    pages.map((page) => page.url),
    [...new Set(linked)].sort(),
    "the pages followed are not the ones the references point at"
  );
  // The project has twenty-eight linked references and considerably fewer pages,
  // since the seven volumes of the General History share one. A number written
  // here is a floor rather than a count: what it catches is the day the links go
  // out of the content altogether and this check starts passing on nothing.
  assert.ok(pages.length >= 20, `only ${pages.length} pages are followed`);

  for (const page of pages) {
    assert.match(page.url, /^https:\/\//, `${page.url} is not an address a reader can open`);
    // The host is what the bibliography files the work under, and it is the host
    // the address really has: a link under the wrong institution would be a
    // reference credited to somebody who did not publish it.
    assert.equal(new URL(page.url).host, page.host, `${page.url} is not on the host its institution names`);
    assert.ok(page.works.length > 0, `${page.url} is followed with no work to hold it to`);
    // The line the report names it by is one the page really carries, so a
    // failure can always be traced back to a reference in the content.
    assert.ok(page.works.some((work) => work.label === page.label), `${page.url} is reported under a line no work carries`);
    for (const work of page.works) {
      assert.ok(work.label.length > 0 && work.name.length > 0, `${page.url} carries a work with no name`);
      assert.ok(work.institution.length > 0, `${page.url} carries a work with no institution`);
    }
  }

  // The addresses live in the content, and are read from it here: a module that
  // wrote one down would be a second place for a reference to point from.
  assert.doesNotMatch(MODULE, /https?:\/\//, "the module carries an address of its own");
});

test("a title is read out of an answer, and the words it is compared by are the name's", () => {
  // The title is what a browser tab shows, and it is read from the answer rather
  // than from the status: a page can answer 200 with anything on it.
  assert.equal(titleOf("<html><head><title>Timbuktu - UNESCO</title></head></html>"), "Timbuktu - UNESCO");
  assert.equal(titleOf("<TITLE>\n  Member States\n</TITLE>"), "Member States");
  assert.equal(titleOf("<html><head><title>Côte d&#39;Ivoire &amp; Ghana</title></head>"), "Côte d'Ivoire & Ghana");
  assert.equal(titleOf("<html><head></head><body>nothing</body>"), null);
  assert.equal(titleOf("<title>   </title>"), null);

  // The small words and the single letters carry no name: a citation and the page
  // it names rarely write the same sentence, and a volume's numeral is not what
  // the page is about.
  assert.deepEqual(nameWords("UNESCO, General History of Africa, volume I"), ["unesco", "general", "history", "africa", "volume"]);
  assert.deepEqual(nameWords("Nécropole"), ["necropole"]);

  // How much of a name a title holds, and the three ways two words are one word:
  // the same word, one grown out of the other, and two spellings of one word.
  assert.equal(nameHeld("Timbuktu", "Timbuktu - UNESCO World Heritage Centre"), 1);
  assert.equal(nameHeld("General History of Africa, volume I", "General History of Africa | UNESCO"), 0.75);
  assert.equal(nameHeld("the Trans-Atlantic Slave Trade Database", "SlaveVoyages"), 0.2);
  assert.equal(nameHeld("Memphis et sa nécropole", "Memphis and its Necropolis - UNESCO"), 1);
  assert.equal(nameHeld("Agenda 2063", "Agenda 2063 | African Union"), 1);
  // A name that came down to nothing is held by no title at all, which is what an
  // empty citation has to be read as rather than as a page that named it.
  assert.equal(nameHeld("", "anything"), 0);
  assert.ok(TITLE_ENOUGH > 0 && TITLE_ENOUGH <= 1, "the bar is not a fraction of a name");
  // Naming the institution is the weaker answer, and the bar says so: half of
  // `UNESCO World Heritage List` is held by a page titled `World Heritage Centre`
  // while naming the work not at all.
  assert.ok(INSTITUTION_ENOUGH > TITLE_ENOUGH && INSTITUTION_ENOUGH <= 1, "the weaker answer is held to less");
  assert.equal(nameHeld("UNESCO World Heritage List", "World Heritage Centre"), 0.5);
});

test("what an answer means is kept apart from whether the link is wrong", () => {
  const page = {
    url: "https://whc.unesco.org/en/list/119/",
    host: "whc.unesco.org",
    works: [
      {
        label: "UNESCO World Heritage List, Timbuktu",
        name: "Timbuktu",
        institution: "UNESCO World Heritage List",
        lang: "en",
      },
    ],
  };
  const answer = (title, extra = {}) => ({
    status: 200,
    url: page.url,
    body: `<html><head><title>${title}</title></head></html>`,
    ...extra,
  });

  // The promise being kept: the page answers under the title of the work.
  const named = pageVerdict(page, answer("Timbuktu - UNESCO World Heritage Centre"));
  assert.deepEqual(named, {
    kind: "named",
    how: "work",
    title: "Timbuktu - UNESCO World Heritage Centre",
    label: "UNESCO World Heritage List, Timbuktu",
  });
  assert.equal(pageNamesAWork(named), true);
  assert.equal(pageNamesTheInstitution(named), false);
  assert.equal(pageIsWrong(named), false);

  // The weaker answer: the site, not the work. A reader lands on the institution
  // that publishes it, which is worth saying and is not a page to correct.
  const institution = pageVerdict(
    {
      ...page,
      url: "https://www.slavevoyages.org/",
      host: "www.slavevoyages.org",
      works: [
        {
          label: "Slave Voyages, the Trans-Atlantic Slave Trade Database",
          name: "the Trans-Atlantic Slave Trade Database",
          institution: "Slave Voyages",
          lang: "en",
        },
      ],
    },
    { status: 200, url: "https://www.slavevoyages.org/", body: "<title>SlaveVoyages</title>" }
  );
  assert.equal(institution.kind, "named");
  assert.equal(institution.how, "institution");
  assert.equal(institution.institution, "Slave Voyages");
  assert.equal(pageNamesAWork(institution), false);
  assert.equal(pageNamesTheInstitution(institution), true);
  assert.equal(pageIsWrong(institution), false);

  // The failure this check exists for: the address answers, and it is not the
  // work. Nothing but reading the title would find it. A page of the same
  // institution is one of these, which is why the institution's own bar is the
  // higher of the two rather than a promise that anything on the site will do.
  const elsewhere = pageVerdict(page, answer("Bienvenue - Musee national du Mali"));
  assert.equal(elsewhere.kind, "elsewhere");
  assert.equal(elsewhere.title, "Bienvenue - Musee national du Mali");
  assert.equal(pageIsWrong(elsewhere), true);
  assert.equal(pageVerdict(page, answer("World Heritage Centre")).kind, "elsewhere");

  // A page that answered from somewhere else is its own kind of wrong, reported
  // as moved even when what it moved to is missing, because the address is the
  // thing that changed.
  assert.equal(
    pageVerdict(page, answer("Timbuktu", { url: "https://whc.unesco.org/en/list/1190/" })).kind,
    "moved"
  );
  assert.equal(
    pageVerdict(page, { status: 404, url: "https://whc.unesco.org/en/list/1190/" }).kind,
    "moved",
    "an address that moved is reported as moved rather than as missing"
  );

  // A page that is not there, in both answers a server gives for it.
  assert.deepEqual(pageVerdict(page, { status: 404, url: page.url }), { kind: "gone", detail: "404" });
  assert.equal(pageIsWrong(pageVerdict(page, { status: 410, url: page.url })), true);

  // And the answers that say nothing about the reference: a refusal, a rate
  // limit, a server that fell over. Kept apart so a lesson is never reported as
  // badly sourced because a publisher declined to answer a script.
  for (const status of [403, 429, 500, 301, 400]) {
    const result = pageVerdict(page, { status, url: page.url, body: "<title>Sorry</title>" });
    assert.equal(result.kind, "refused", `${status} was read as an answer about the work`);
    assert.equal(pageIsWrong(result), false, "a refusal is not a page to correct");
  }
  // A page that could not be read is the other thing: the run did not check it,
  // and a green run holding one of those is how a check stops meaning anything.
  const unreadable = pageVerdict(page, { error: "ETIMEDOUT" });
  assert.equal(unreadable.kind, "unreadable");
  assert.equal(pageIsWrong(unreadable), true);
  // An answer with a status and no title at all is not a page this can judge.
  assert.equal(pageVerdict(page, { status: 200, url: page.url, body: "<html></html>" }).kind, "unreadable");
});

test("the check is asked for, reads the page rather than asking about it, and stays out of the verification", () => {
  // It needs the network, so it is not part of `npm run verify`: a gate that
  // fails on a train is a gate somebody turns off. It still has to exist, and to
  // be the rules this suite read rather than a copy of them.
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts["check:references"], /check-reference-pages\.mjs/, "package.json registers the check");

  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.doesNotMatch(verify, /check-reference-pages/, "the check is part of the verification");

  assert.match(SCRIPT, /from "\.\.\/src\/lib\/reference-pages\.js"/, "the script reads the module these tests read");
  assert.match(SCRIPT, /referencePages\(\)/, "it follows the pages the references point at rather than a list of its own");
  // Read rather than asked about: whether a page is there can be learned with a
  // HEAD, and whether it is still the work cannot, because a title lives in the
  // page. This is why these twenty-two are downloaded and sixty credits are not.
  assert.match(SCRIPT, /await response\.text\(\)/, "the page is not read, so no title can be read from it");
  assert.doesNotMatch(SCRIPT, /method:\s*"HEAD"/, "the pages are asked about without being read");
  assert.match(SCRIPT, /redirect:\s*"follow"/, "and followed where the publisher sends them");
  assert.match(SCRIPT, /process\.exit\(1\)/, "a failure stops the run");

  // The failures the report has to say apart, in the words it says them in.
  assert.match(SCRIPT, /under a title that names neither the work nor its institution/, "another page is not named as such");
  assert.match(SCRIPT, /answered from another address/, "a moved page is not named as such");
  assert.match(SCRIPT, /no longer there/, "a deleted page is not named as such");
  assert.match(SCRIPT, /answered with a refusal/, "a refusal is not named as such");
  assert.match(SCRIPT, /could not be read/, "an unreadable page is not named as such");
  assert.match(SCRIPT, /names its institution alone/, "the weaker answer is not named as such");
  assert.match(SCRIPT, /the url in the level's source/, "the failure does not say where to look");

  // A dropped connection is asked about again rather than reported, because a
  // run that reported the network as a broken link would be believed.
  assert.match(SCRIPT, /ATTEMPTS = [3-9]/, "one attempt is not enough for a network");
  assert.match(SCRIPT, /askAgainAfter/, "and nothing asks again");

  // The requests say who is asking, and the address is the one the project
  // publishes rather than a second copy of it.
  assert.match(REFERENCE_AGENT, /^AfricaHistoryQuest\//, "the requests do not say who is asking");
  assert.ok(REFERENCE_AGENT.includes(CONTACT_EMAIL), "the requests name no way to be reached");
  assert.match(SCRIPT, /REFERENCE_AGENT/, "the script does not use the agent the project names");
  assert.doesNotMatch(SCRIPT, /user-agent":\s*"/, "the script carries an agent of its own");
});
