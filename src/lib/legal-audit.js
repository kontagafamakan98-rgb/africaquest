/**
 * What a store submission still needs from the publisher.
 *
 * A privacy notice and terms of use can be worded perfectly and still be turned
 * down: Apple, Google and the GDPR all want the publisher to be identified, the
 * host of the site to be named, and a way to reach whoever answers for personal
 * data. Those facts cannot be guessed from the code, so they live in
 * `publisher.js` and this module turns them into a checklist.
 *
 * Plain module: the check script and the tests both read it, and it never
 * writes anything.
 */
import { PUBLISHER, HOST, DPO } from "./publisher.js";

const filled = (value) => typeof value === "string" && value.trim().length > 0;

/**
 * Lists the missing facts, in the order they appear in the documents.
 *
 * Each gap carries the field to fill and, in plain words, why a store or a data
 * protection authority asks for it. A gap list that reads like a rejection
 * notice is the point: the publisher fixes it here rather than after a review.
 *
 * @returns {Array<{ field: string, why: string }>} empty when everything is in place
 */
export function auditLegalReadiness({ publisher = PUBLISHER, host = HOST, dpo = DPO } = {}) {
  const gaps = [];
  const need = (value, field, why) => {
    if (!filled(value)) gaps.push({ field, why });
  };

  need(publisher.name, "publisher.name", "the trade name the reader sees");
  need(publisher.legalName, "publisher.legalName", "the registered company name");
  need(publisher.legalForm, "publisher.legalForm", "the legal form of the publisher");
  need(publisher.address, "publisher.address", "the postal address of the registered office");
  need(publisher.registration, "publisher.registration", "the SIREN or RCS registration number");
  need(publisher.email, "publisher.email", "an address for legal and data protection notices");

  need(host.name, "host.name", "the company serving the application files");
  need(host.address, "host.address", "the postal address of the host");
  need(host.phone, "host.phone", "the telephone number of the host");

  // Only asked for when the publisher has appointed one: many small publishers
  // do not need a data protection officer, and naming a fake one would be worse
  // than saying there is none.
  if (dpo.required) need(dpo.email, "dpo.email", "who answers data protection requests");

  return gaps;
}
