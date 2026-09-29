import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { auditLegalReadiness } from "./legal-audit.js";

/**
 * What a store submission still needs from the publisher, and the wiring of the
 * two legal pages that show it.
 *
 * The audit is exercised on fixtures rather than on the real publisher module:
 * a test that fails the day the publisher finally fills in a real address would
 * punish the very thing it is meant to encourage.
 */

const ROOT = path.resolve(import.meta.dirname, "..", "..");

const complete = {
  publisher: {
    name: "Example",
    legalName: "Example SAS",
    legalForm: "SAS",
    address: "1 rue de Test, 75001 Paris, France",
    registration: "123 456 789 R.C.S. Paris",
    email: "contact@example.com",
  },
  host: { name: "Example Host", address: "2 rue de Test, Paris", phone: "+33 1 23 45 67 89" },
  dpo: { required: false, email: "" },
};

const fields = (gaps) => gaps.map((gap) => gap.field);

test("a fully identified publisher has nothing left to fill in", () => {
  assert.deepEqual(auditLegalReadiness(complete), []);
});

test("every missing fact is reported, with a reason a human can act on", () => {
  const gaps = auditLegalReadiness({
    publisher: { ...complete.publisher, address: "", registration: "   " },
    host: { ...complete.host, phone: "" },
    dpo: complete.dpo,
  });

  assert.deepEqual(fields(gaps), ["publisher.address", "publisher.registration", "host.phone"]);
  // A blank string and a whitespace only string are both a gap, and each one
  // says why a store or an authority asks for it.
  assert.equal(gaps[0].why, "the postal address of the registered office");
  for (const gap of gaps) assert.ok(gap.why && gap.why.length > 5, gap.field);
});

test("a data protection officer is only required when one exists", () => {
  const withDpo = { ...complete, dpo: { required: true, email: "" } };
  assert.deepEqual(fields(auditLegalReadiness(withDpo)), ["dpo.email"]);

  const appointed = { ...complete, dpo: { required: true, email: "dpo@example.com" } };
  assert.deepEqual(auditLegalReadiness(appointed), []);

  // Naming no officer is not a gap by itself: it only has to be said.
  assert.deepEqual(auditLegalReadiness({ ...complete, dpo: { required: false, email: "" } }), []);
});

test("both legal pages build every block of facts they ask for", () => {
  // A `facts: "contact"` marker with no matching builder would render nothing at
  // all, which is exactly the kind of silent hole this whole check exists for.
  for (const page of ["PrivacyPolicy.jsx", "TermsOfService.jsx"]) {
    const source = readFileSync(path.join(ROOT, "src", "pages", page), "utf8");
    assert.match(source, /from "\.\.\/lib\/publisher"/, `${page} must read the publisher module`);

    const markers = new Set([...source.matchAll(/facts: "([A-Za-z]+)"/g)].map((match) => match[1]));
    const builders = new Set(
      [...source.matchAll(/^\s{2}([A-Za-z]+): \(lang\)/gm)].map((match) => match[1])
    );

    assert.ok(markers.size > 0, `${page} must show at least one block of facts`);
    for (const marker of markers) {
      assert.ok(builders.has(marker), `${page} declares facts "${marker}" without a builder`);
    }
  }
});
