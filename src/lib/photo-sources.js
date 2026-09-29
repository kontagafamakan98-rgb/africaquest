/**
 * The pages the credits name for each photograph, and what an answer about one
 * of them means.
 *
 * Every photograph carries the page it was taken from: a file page on Wikimedia
 * Commons for fifty-nine of them, the address it was downloaded from for the
 * one that comes from a stock library. The credits screen offers that page to
 * whoever wants to check a licence, and the terms list the same works, so it is
 * not a decoration: it is where a reader goes to see that the picture is really
 * free and really made by whoever is named beside it.
 *
 * A page that has been emptied or deleted does not stop the application: the
 * picture is served from public/photos, and the game plays on. What breaks is
 * the promise, silently, in front of a reader. So the pages are followed for
 * real, on demand, by scripts/check-photo-sources.mjs, and a page that answers
 * that it is not there is a thing to fix rather than to discover later.
 *
 * This is a module rather than part of that script so the tests read the same
 * rules it runs: which pages the credits point at, and what a followed page is
 * judged to have told us. It touches neither the network nor the disk.
 */
import { CONTACT_EMAIL } from "./contact.js";
import { LEVEL_PHOTOS, photoSourcePage } from "./level-images.js";
import { sameAddress } from "./urls.js";

/**
 * What the requests say they are.
 *
 * Wikimedia asks to be told who is asking, and answers an anonymous script from
 * a shared address with a refusal. It is the same agent the download script
 * uses, so one address in the project is one polite visitor rather than two.
 */
export const SOURCE_AGENT = `AfricaHistoryQuest/1.0 (level photographs; ${CONTACT_EMAIL})`;

/**
 * Every page the credits offer, in the order the photographs are listed.
 *
 * In table order rather than sorted by address, because that is the order a
 * person reads them in: the report names a level, and the list follows the game
 * from its first level to its last. Two photographs sharing a page would mean
 * one of them is credited to work its author did not make, which
 * src/lib/photo-credits.test.js refuses on the table itself; what is checked
 * here is only that the rule the tests read is the rule the check runs.
 */
export function photoSources(photos = LEVEL_PHOTOS) {
  return photos.map((photo) => ({
    url: photoSourcePage(photo),
    file: photo.file,
    label: `level ${photo.level} (${photo.caption.en})`,
  }));
}

/**
 * What following one credit page turned out to be.
 *
 * Three answers matter and one does not fit at all. A page that answers is a
 * credit a reader can still check. A page that answers 404 or 410 has been
 * deleted or emptied, and the credit now points at nothing. A page the host
 * sends somewhere else is a credit whose address is no longer the one the table
 * names, which on a wiki is usually a file that was renamed. Anything else - a
 * refusal, a rate limit, a server that fell over, a name that does not resolve -
 * is not an answer about the page at all, and is kept apart so the report can
 * say that instead of calling a photograph's credit broken.
 *
 * The order matters: an address that moved is reported as moved even when the
 * place it moved to is missing, because the fix is to look the title up again
 * rather than to hunt for a page.
 */
export function pageOutcome(link, answer) {
  if (answer.error) return { link, kind: "unreadable", detail: answer.error };
  if (answer.url && !sameAddress(link, answer.url)) return { link, kind: "moved", detail: answer.url };
  if (answer.status === 404 || answer.status === 410) return { link, kind: "gone", detail: String(answer.status) };
  if (answer.status >= 200 && answer.status < 300) return { link, kind: "answered", detail: String(answer.status) };
  return { link, kind: "unreadable", detail: String(answer.status) };
}

/** Whether an answer about a credit page is a thing to fix. */
export const pageIsWrong = (result) => result.kind !== "answered";

/** Whether that thing to fix is a page that is no longer there. */
export const pageIsGone = (result) => result.kind === "gone";
