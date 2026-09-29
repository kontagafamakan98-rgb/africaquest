import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CONTACT_EMAIL } from "./contact.js";
import { LEVEL_PHOTOS, photoSourcePage } from "./level-images.js";
import {
  SOURCE_AGENT,
  pageIsGone,
  pageIsWrong,
  pageOutcome,
  photoSources,
} from "./photo-sources.js";

// The pages the credits name, and what an answer about one of them means.
//
// A photograph in this game is served from public/photos, so nothing breaks the
// day one of those pages is deleted: the game plays on and the credit line goes
// on naming an author nobody can check. That is the failure this holds: not a
// broken picture but a broken promise, and it can only be found by asking the
// wiki, on demand, because a page on somebody else's site is not in this
// repository and no build can carry it.
//
// Nothing here touches the network either. scripts/check-photo-sources.mjs does
// that when somebody asks it to, and what it makes of an answer is decided by
// these functions.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPT = readFileSync(path.join(ROOT, "scripts", "check-photo-sources.mjs"), "utf8");
const MODULE = readFileSync(path.join(import.meta.dirname, "photo-sources.js"), "utf8");

test("every photograph of the game has a credit page to follow, in the order the game lists it", () => {
  const sources = photoSources();
  assert.equal(sources.length, LEVEL_PHOTOS.length, "a photograph has no page to check");

  sources.forEach((source, index) => {
    const photo = LEVEL_PHOTOS[index];
    // Derived from the table rather than written down again: a second list of
    // addresses would go on being checked after the credits stopped pointing at
    // them, which is the drift the whole gallery is built to avoid.
    assert.equal(source.url, photoSourcePage(photo), `${photo.file}: the page is not the one the credits name`);
    assert.equal(source.file, photo.file, `${photo.file}: the picture this page belongs to`);
    // The report names a level and a picture, because that is what somebody
    // fixes: an address on its own says nothing about which row to open.
    assert.match(source.label, new RegExp(`^level ${photo.level} \\(`), `${photo.file}: the label names another level`);
  });

  // The order is the table's, so the report reads from the first level to the
  // last rather than from one address to the next: this is the one list in the
  // project a person reads as a list of the game.
  const levels = sources.map((source) => Number(/^level (\d+)/.exec(source.label)[1]));
  assert.deepEqual(levels, [...levels].sort((one, other) => one - other), "the pages are not in level order");

  // The addresses live in the table, and are derived from it here: a module that
  // wrote one down would be a second place for a licence to be credited from.
  assert.doesNotMatch(MODULE, /https?:\/\//, "the module carries an address of its own");
});

test("what an answer means is kept apart from whether the credit is broken", () => {
  const page = "https://commons.wikimedia.org/wiki/File:Welcome_to_Soweto.jpg";

  assert.deepEqual(pageOutcome(page, { status: 200, url: page }), { link: page, kind: "answered", detail: "200" });
  assert.equal(pageIsWrong(pageOutcome(page, { status: 200, url: page })), false);

  // The failure this check exists for: the page is not there any more. Both
  // answers a server gives for that are read the same way, because 410 is a page
  // somebody took down on purpose and 404 is the one that never came back.
  assert.deepEqual(pageOutcome(page, { status: 404, url: page }), { link: page, kind: "gone", detail: "404" });
  assert.deepEqual(pageOutcome(page, { status: 410, url: page }), { link: page, kind: "gone", detail: "410" });
  assert.equal(pageIsGone(pageOutcome(page, { status: 404, url: page })), true);
  assert.equal(pageIsWrong(pageOutcome(page, { status: 410, url: page })), true);

  // A page answered from somewhere else is its own kind of wrong, and the fix is
  // a title to look up rather than a page to hunt for: a file renamed on the wiki
  // answers from its new name, which the table no longer names.
  assert.deepEqual(pageOutcome(page, { status: 200, url: "https://commons.wikimedia.org/wiki/File:Renamed.jpg" }), {
    link: page,
    kind: "moved",
    detail: "https://commons.wikimedia.org/wiki/File:Renamed.jpg",
  });
  // Reported as moved even where it lands on nothing, since the address is the
  // thing that changed and that is what something has to be done about.
  assert.equal(
    pageOutcome(page, { status: 404, url: "https://commons.wikimedia.org/wiki/File:Renamed.jpg" }).kind,
    "moved"
  );
  // The escaping of the address is not a move: this wiki answers a file page with
  // its parentheses escaped where the table wrote them in the open.
  assert.equal(
    pageOutcome(page, { status: 200, url: "https://commons.wikimedia.org/wiki/File:Welcome_to_Soweto.jpg" }).kind,
    "answered"
  );
  assert.equal(
    pageOutcome(
      "https://commons.wikimedia.org/wiki/File:Soweto_(1976).jpg",
      { status: 200, url: "https://commons.wikimedia.org/wiki/File:Soweto_%281976%29.jpg" }
    ).kind,
    "answered",
    "the same page, written the way the wiki writes it"
  );

  // And the answers that say nothing about the credit: a rate limit, a refusal,
  // a server that fell over, a name that does not resolve. Kept apart so a
  // photograph is never reported as badly credited because the network was busy.
  for (const answer of [
    { status: 429, url: page },
    { status: 403, url: page },
    { status: 500, url: page },
    { status: 301, url: page },
    { error: "ETIMEDOUT" },
  ]) {
    const result = pageOutcome(page, answer);
    assert.equal(result.kind, "unreadable", `${JSON.stringify(answer)} was read as an answer about the credit`);
    assert.equal(pageIsGone(result), false, "an unreadable page is not a deleted page");
    // It is still a failure of the run: a check that could not read a page must
    // not be mistaken for a check that found everything in order.
    assert.equal(pageIsWrong(result), true);
  }
});

test("the check is asked for, asks rather than downloads, and keeps the two failures apart", () => {
  // It needs the network, so it is not part of `npm run verify`: a gate that
  // fails on a train is a gate somebody turns off. It still has to exist, and to
  // be the rules this suite read rather than a copy of them.
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts["check:photos"], /check-photo-sources\.mjs/, "package.json registers the check");

  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.doesNotMatch(verify, /check-photo-sources/, "the check is part of the verification");

  assert.match(SCRIPT, /from "\.\.\/src\/lib\/photo-sources\.js"/, "the script reads the module these tests read");
  assert.match(SCRIPT, /photoSources\(\)/, "it follows the pages the credits name rather than a list of its own");
  // Asked about rather than downloaded: sixty wiki pages read to learn whether
  // they exist would be sixty pages of somebody else's bandwidth.
  assert.match(SCRIPT, /method: "HEAD"/, "the pages are not asked about without being read");
  assert.match(SCRIPT, /redirect:\s*"follow"/, "and followed where the wiki sends them");
  assert.match(SCRIPT, /process\.exit\(1\)/, "a failure stops the run");

  // The three things the report has to say apart, in the words it says them in.
  assert.match(SCRIPT, /are no longer there|is no longer there/, "a deleted page is not named as such");
  assert.match(SCRIPT, /answered from another address/, "a moved page is not named as such");
  assert.match(SCRIPT, /could not be read/, "an unreadable page is not named as such");
  assert.match(SCRIPT, /commonsTitle/, "the failure does not say which line to correct");

  // A dropped connection is asked about again rather than reported: on the
  // machine this was written on, one request in ten to the wiki never comes
  // back, and a good half of the gallery would be reported unreadable without
  // this.
  assert.match(SCRIPT, /ATTEMPTS = [3-9]/, "one attempt is not enough for a network");
  assert.match(SCRIPT, /askAgainAfter/, "and nothing asks again");

  // Wikimedia asks to be told who is asking, and the address it is told is the
  // one address the project publishes, not a second copy of it.
  assert.match(SOURCE_AGENT, /^AfricaHistoryQuest\//, "the requests do not say who is asking");
  assert.ok(SOURCE_AGENT.includes(CONTACT_EMAIL), "the requests name no way to be reached");
  assert.match(SCRIPT, /SOURCE_AGENT/, "the script does not use the agent the project names");
  assert.doesNotMatch(SCRIPT, /user-agent":\s*"/, "the script carries an agent of its own");
});
