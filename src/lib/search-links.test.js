import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  REGISTRY_API,
  SHAPE_PROPERTY,
  declaredShapes,
  outcome,
  outcomeIsWrong,
  registryUrl,
  searchLinks,
  shapeFromRegistry,
  shapeIsWrong,
  shapeVerdict,
} from "./search-links.js";

// One screen in the app offers a search instead of a page: the notice that
// carries no address somebody opened is searched for on the publisher's own
// site. It is the only link in the project that cannot be confirmed by following
// it, since the publisher refuses a request from a script whatever the address
// says, so the shape it is built from is held to the registry it was taken from
// instead. These tests are the rules of that check, read here rather than only
// in the script: which links are offered, how an answer from the registry is
// read, and what a followed link is judged to have done.
//
// Nothing here touches the network. The script does, on demand, and what it
// makes of an answer is decided by these functions.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCRIPT = readFileSync(path.join(ROOT, "scripts", "check-search-links.mjs"), "utf8");

test("every search the app offers is built from a shape somebody recorded", () => {
  const shapes = declaredShapes();
  assert.ok(shapes.length > 0, "no publisher declares a search of its own");

  for (const shape of shapes) {
    // A shape written the way the registry writes it is a shape the check can
    // compare as a string: a template in a notation of our own would be one
    // nothing else could ever agree with, which is the whole point of holding it
    // to a record rather than to a memory.
    assert.match(shape.template, /^https:\/\//, `${shape.id} is not an address`);
    assert.match(shape.template, /%1/, `${shape.id} has no place for the terms`);
    assert.ok(shape.item, `${shape.id} offers a search and names no registry item to hold it to`);
    assert.match(shape.item, /^Q\d+$/, `${shape.id} names something that is not an item of a registry`);
  }

  assert.match(registryUrl("Q455"), new RegExp(`^${REGISTRY_API.replace(/[/.?]/g, "\\$&")}`), "the registry is asked");
  assert.match(registryUrl("Q455"), /action=wbgetclaims/, "through the claim of one item");
  assert.match(registryUrl("Q455"), new RegExp(`property=${SHAPE_PROPERTY}`), "and one property");
  assert.match(registryUrl("Q4 55"), /Q4%2055/, "an item name travels as an address, not as it is written");
});

test("the shape the registry records is read back as it stands, or not at all", () => {
  const claimed = (value) => ({
    claims: { [SHAPE_PROPERTY]: [{ mainsnak: { datavalue: { value } } }] },
  });

  assert.equal(shapeFromRegistry(claimed("https://www.britannica.com/search?query=%1")), "https://www.britannica.com/search?query=%1");
  assert.equal(shapeFromRegistry(claimed("")), null, "an empty claim records nothing");
  assert.equal(shapeFromRegistry({ claims: {} }), null, "an item that records no shape records nothing");
  assert.equal(shapeFromRegistry(null), null, "and an answer that is not the registry's records nothing");

  const declared = "https://www.britannica.com/search?query=%1";
  assert.equal(shapeVerdict(declared, declared).kind, "holds");
  assert.deepEqual(shapeVerdict(declared, "https://www.britannica.com/search?q=%1"), {
    kind: "changed",
    declared,
    recorded: "https://www.britannica.com/search?q=%1",
  });
  // Nothing to compare is not the same as the same as before: a claim removed at
  // the registry leaves the template exactly as unconfirmed as a changed one, and
  // counting it as a pass is how a check stops meaning anything.
  assert.equal(shapeVerdict(declared, null).kind, "unreadable");
  assert.equal(shapeIsWrong(shapeVerdict(declared, declared)), false);
  assert.equal(shapeIsWrong(shapeVerdict(declared, null)), true);
  assert.equal(shapeIsWrong(shapeVerdict(declared, "https://example.org/?q=%1")), true);
});

test("the links the check follows are the ones the app offers, once each", () => {
  const links = searchLinks();
  assert.ok(links.length >= 50, `only ${links.length} searches were found`);

  const urls = links.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length, "a search is followed twice");
  assert.deepEqual(urls, [...urls].sort(), "the order changes from one run to the next");

  for (const { url, label } of links) {
    // Both halves matter: the address is what is requested, and the label is what
    // the report says when it has to name the reference somebody would fix.
    assert.match(url, /^https:\/\/www\.britannica\.com\/search\?query=/, `${url} is not a search of this publisher`);
    assert.match(label, /Britannica/, `${label} is not the reference that opened ${url}`);
  }

  // The two languages are two sets of references, and a notice is often quoted
  // in both: the address is what is checked, so the same address twice is one
  // link rather than a failure waiting to be counted twice.
  const one = searchLinks(["en"]);
  const both = searchLinks(["en", "fr"]);
  assert.ok(one.length > 0 && both.length >= one.length, "the French references add searches");
  assert.equal(new Set([...one, ...both].map((entry) => entry.url)).size, both.length);
});

test("a link that lands somewhere else is a failure, and one that is re-escaped is not", () => {
  // Whether two addresses are the same address is decided in src/lib/urls.js,
  // where the check the credits use asks the same question; urls.test.js is
  // where that is tested. What is tested here is what this check makes of an
  // answer, and the one that has to stand out: the publisher answering with the
  // apostrophe escaped is the same search, and is not a failure.
  const at = "https://www.britannica.com/search?query=Battle%20of%20Rorke's%20Drift";

  assert.deepEqual(outcome(at, { status: 200, url: at }), { link: at, kind: "answered", detail: "200" });
  assert.deepEqual(
    outcome(at, { status: 403, url: "https://www.britannica.com/search?query=Battle%20of%20Rorke%27s%20Drift" }),
    { link: at, kind: "refused", detail: "403" },
    "the same search, spelled the way the server spells it"
  );
  assert.deepEqual(outcome(at, { status: 403, url: at }), { link: at, kind: "refused", detail: "403" });
  assert.deepEqual(outcome(at, { status: 403, url: "https://www.britannica.com/search?q=x" }), {
    link: at,
    kind: "moved",
    detail: "https://www.britannica.com/search?q=x",
  });
  assert.deepEqual(outcome(at, { error: "getaddrinfo ENOTFOUND" }), {
    link: at,
    kind: "unreachable",
    detail: "getaddrinfo ENOTFOUND",
  });

  // Only two of the four are the app's fault. A refusal is the publisher
  // declining to answer this kind of request, and a page is a page: neither says
  // the address is wrong, and counting either as a failure would leave the check
  // red every time it ran against a site that behaves exactly as recorded.
  assert.equal(outcomeIsWrong(outcome(at, { status: 403, url: at })), false);
  assert.equal(outcomeIsWrong(outcome(at, { status: 200, url: at })), false);
  assert.equal(outcomeIsWrong(outcome(at, { error: "no route to host" })), true);
  assert.equal(outcomeIsWrong(outcome(at, { status: 301, url: "https://www.britannica.com/search?q=x" })), true);
});

test("the check is asked for rather than wired into the verification", () => {
  // It needs the network, and a gate that fails on a train is a gate somebody
  // turns off. What it must not be is missing: the command has to exist, and it
  // has to be the script rather than a copy of its rules.
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts["check:links"], /check-search-links\.mjs/, "package.json registers the check");

  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.doesNotMatch(verify, /check-search-links/, "the check is not part of the verification");

  // What it runs has to be the rules this suite just read, and what it does with
  // an answer has to be a refusal rather than a shrug.
  assert.match(SCRIPT, /from "\.\.\/src\/lib\/search-links\.js"/, "the script reads the module these tests read");
  assert.match(SCRIPT, /searchLinks\(\)/, "it follows the links the app offers rather than a list of its own");
  assert.match(SCRIPT, /declaredShapes\(\)/, "and holds the shapes the app declares");
  assert.match(SCRIPT, /fetch\(/, "it really asks the publisher");
  assert.match(SCRIPT, /redirect:\s*"follow"/, "and follows where it is sent");
  assert.match(SCRIPT, /process\.exit\(1\)/, "a failure stops the run");

  // And the part a check like this is usually tempted to hide: a refusal is not
  // reported as a confirmation, and the report says so on the line.
  assert.match(SCRIPT, /refused/, "refusals are counted");
  assert.match(SCRIPT, /confirmed nothing/, "and named for what they are");
  assert.match(SCRIPT, /there was nothing to hold to anything/, "a run that checked nothing does not pass");
});
