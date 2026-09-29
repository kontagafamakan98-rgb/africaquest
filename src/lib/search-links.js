/**
 * The search links the app offers, and where the shape of one comes from.
 *
 * A reference the game cannot point at a page is offered as a search of its
 * publisher's own site, and that address is built from a template declared in
 * `publishers.js`. Such a template is the one kind of link here nobody can open
 * and read: this publisher answers a script with a refusal, whatever the address
 * says, so following a search link cannot confirm anything about it. What can be
 * confirmed is the template itself, against the registry it was taken from in
 * the first place, and that is the difference between a link somebody invented
 * and a link somebody can point at a record for.
 *
 * This is a module rather than part of the script that uses it so the tests read
 * the same rules the script runs: which links the app offers, which shapes it
 * declares, how an answer from the registry is read, and what a followed link is
 * judged to have done. None of it touches the network or the disk; the script
 * does that, and this says what to make of it.
 */
import { PUBLISHERS } from "../components/game/publishers.js";
import { getBibliography } from "../components/game/references.js";
import { sameAddress } from "./urls.js";

/**
 * The property a search address shape is recorded under.
 *
 * "search formatter URL": the address a site's own search is reached at, with
 * `%1` where the terms go. It is a statement about the publisher, kept by a
 * registry that outlives any one page of it, which is what makes it something a
 * check can hold a template against.
 */
export const SHAPE_PROPERTY = "P4354";

/** Where the shapes are read from, and the item they are read about. */
export const REGISTRY_API = "https://www.wikidata.org/w/api.php";

/** The address of one publisher's recorded shapes, ready to be fetched. */
export function registryUrl(item, property = SHAPE_PROPERTY) {
  return `${REGISTRY_API}?action=wbgetclaims&format=json&entity=${encodeURIComponent(item)}&property=${property}`;
}

/** The shape one item's claims record, or nothing when it records none. */
export function shapeFromRegistry(payload, property = SHAPE_PROPERTY) {
  const value = payload?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value;
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Whether the shape the app holds is still the one the registry records.
 *
 * Three answers and not two, because "nothing to compare" is not the same as
 * "the same as before": an item whose claim has been removed, or an answer that
 * is not the registry's at all, leaves the template exactly as unconfirmed as a
 * changed one, and reporting it as a pass is how a check stops meaning anything.
 */
export function shapeVerdict(declared, recorded) {
  if (!recorded) return { kind: "unreadable", declared, recorded: null };
  if (recorded === declared) return { kind: "holds", declared, recorded };
  return { kind: "changed", declared, recorded };
}

/** Whether a shape verdict is one the check has to report as a failure. */
export const shapeIsWrong = (result) => result.kind !== "holds";

/**
 * The shapes the app declares, each with the registry item it came from.
 *
 * A publisher that offers a search has to say where its shape came from, since a
 * template nobody recorded anywhere is one nobody can hold to anything. Saying
 * which item is part of declaring the search, not an extra: a second publisher
 * added without one is a search this check would otherwise have to take on
 * trust, and the list below says so rather than skipping it.
 */
export function declaredShapes(publishers = PUBLISHERS) {
  return publishers
    .filter((publisher) => publisher.search)
    .map((publisher) => ({
      id: publisher.id,
      template: publisher.search,
      item: publisher.wikidata || null,
    }));
}

/**
 * Every distinct search link the app offers, in the order of their addresses.
 *
 * The two languages are walked because they are two sets of references, and a
 * French notice is a different line that opens the same search: what is being
 * checked is the address, so the same address twice is one link, remembered
 * under the first reference that opened it.
 *
 * The order is the plain one, by code unit rather than by any locale's idea of
 * what comes first: a report whose lines move when the machine's collation data
 * changes is a report two people cannot compare.
 */
export function searchLinks(langs = ["en", "fr"], bibliography = getBibliography) {
  const links = new Map();

  for (const lang of langs) {
    for (const institution of bibliography(lang)) {
      for (const work of institution.works) {
        if (work.search && !links.has(work.search)) links.set(work.search, work.label);
      }
    }
  }

  return [...links]
    .map(([url, label]) => ({ url, label }))
    .sort((one, other) => (one.url < other.url ? -1 : one.url > other.url ? 1 : 0));
}

/**
 * What following one link turned out to be.
 *
 * The four answers are the four things that can happen, and only two of them are
 * the app's fault: an address that reaches nothing is a dead link, and one the
 * publisher sends somewhere else is a shape that changed under it. A refusal is
 * the publisher declining to answer this kind of request, and a page is a page;
 * neither says the address is wrong, and neither is allowed to be read as
 * confirmation that it is right.
 *
 * Whether the answer came from the address that was asked is not decided here:
 * that is src/lib/urls.js, where the same question is answered for the check the
 * credits use, and answered the same way.
 */
export function outcome(link, answer) {
  if (answer.error) return { link, kind: "unreachable", detail: answer.error };
  if (answer.url && !sameAddress(link, answer.url)) return { link, kind: "moved", detail: answer.url };
  if (answer.status >= 200 && answer.status < 300) return { link, kind: "answered", detail: String(answer.status) };
  return { link, kind: "refused", detail: String(answer.status) };
}

/** Whether an outcome is a link that has to be reported as a failure. */
export const outcomeIsWrong = (result) => result.kind === "unreachable" || result.kind === "moved";
