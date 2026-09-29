/**
 * Lists the legal facts a store submission still needs.
 *
 *   node scripts/check-legal.mjs
 *
 * A store review, and a data protection authority, ask for facts the code
 * cannot know: who publishes the app, where that publisher is registered, which
 * company serves the files and who answers for personal data. They live in
 * src/lib/publisher.js and are shown on both legal pages. This script turns
 * them into a checklist, so the gap is found here rather than in a rejection
 * email.
 *
 * It is deliberately not part of the build: the app can be built and tested
 * before those facts are known, and failing every build until a company is
 * registered would help nobody.
 */
import { auditLegalReadiness } from "../src/lib/legal-audit.js";

const gaps = auditLegalReadiness();

if (gaps.length === 0) {
  console.log("legal: publisher, host and data protection contact are all identified");
  process.exit(0);
}

console.error(`legal: ${gaps.length} fact(s) missing before a store submission\n`);
gaps.forEach((gap) => {
  console.error(`  ${gap.field}: needs ${gap.why}`);
});
console.error("\nFill them in src/lib/publisher.js; both legal pages read them from there.");
process.exit(1);
