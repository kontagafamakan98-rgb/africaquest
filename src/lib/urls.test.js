import test from "node:test";
import assert from "node:assert/strict";
import { sameAddress } from "./urls.js";

// One question, asked by two checks: when an answer comes back from an address
// other than the one that was asked, is it still the same thing?
//
// A publisher is allowed to re-escape a title on its way through, and both of
// the checks here have already met one doing it: a search for a notice whose
// title holds an apostrophe comes back with `%27` where the app sent `'`, and a
// wiki answers a file page with its parentheses escaped where the table wrote
// them out. Neither is a moved address, and a check that called either one moved
// would teach its readers to ignore the check.
//
// What is compared is therefore the address a reader would land on: the site,
// the path, the parameters, and the values the server understood. Everything
// else is a difference worth reporting.

test("the escaping of an address is not a difference, and its content is", () => {
  const search = "https://www.britannica.com/search?query=Battle%20of%20Rorke's%20Drift";
  assert.equal(sameAddress(search, "https://www.britannica.com/search?query=Battle%20of%20Rorke%27s%20Drift"), true);
  assert.equal(sameAddress(search, search), true, "an address is the same address as itself");

  // A title the table wrote with its parentheses in the open, and the same title
  // as the wiki spells it in a link. On the wiki these are one page.
  const page = "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).jpg";
  assert.equal(
    sameAddress(page, "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_(أبو_الهول).jpg"),
    true,
    "the same file page, spelled its two ways"
  );
  assert.equal(
    sameAddress(page, "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).JPG"),
    false,
    "a different file name is a different page, however close"
  );

  // What is a change: another parameter, another path, another site, a term the
  // server did not keep, a value it invented, and a query it added by itself.
  assert.equal(sameAddress(search, "https://www.britannica.com/search?q=Battle%20of%20Rorke's%20Drift"), false);
  assert.equal(sameAddress(search, "https://www.britannica.com/find?query=Battle%20of%20Rorke's%20Drift"), false);
  assert.equal(sameAddress(search, "https://britannica.com/search?query=Battle%20of%20Rorke's%20Drift"), false);
  assert.equal(sameAddress(search, "http://www.britannica.com/search?query=Battle%20of%20Rorke's%20Drift"), false);
  assert.equal(sameAddress(search, "https://www.britannica.com/search?query=Something%20else"), false);
  assert.equal(sameAddress(search, "https://www.britannica.com/search?query=Battle%20of%20Rorke's%20Drift&lang=en"), false);

  // A path is compared with its escaping taken off, but nothing else is: the
  // query string of a stock library's picture address is part of the address.
  const picture = "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80";
  assert.equal(sameAddress(picture, picture), true);
  assert.equal(
    sameAddress(picture, "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800"),
    false,
    "the same picture at another size is another address"
  );

  // An answer that is not an address at all is not the address that was asked
  // for: a redirect to something unreadable is a thing to look at, not a pass.
  assert.equal(sameAddress(search, "not an address"), false);
  assert.equal(sameAddress(search, ""), false);
  assert.equal(sameAddress(search, "https://www.britannica.com/search?query=%E0%A4%A"), false, "a broken escape is not a crash");

  // A percent sign that is part of a name rather than an escape is part of the
  // address, and the two spellings of it are still one page.
  assert.equal(
    sameAddress("https://example.org/wiki/File:100%_cotton.jpg", "https://example.org/wiki/File:100%25_cotton.jpg"),
    true,
    "a lone percent sign is a character, not a broken encoding"
  );
});
