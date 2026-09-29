/**
 * An address, and whether two of them are the same one.
 *
 * Two checks in this project follow an address that somebody else publishes: the
 * search the app offers under a notice it cannot point at a page, and the page
 * the credits name for each photograph. Both have to answer the same question
 * when the answer arrives from somewhere other than where they asked - "is this
 * still the thing I asked for?" - and both have to answer it the way a reader
 * would, rather than the way two strings compare.
 *
 * Written once because it is the same question twice, and because the answer is
 * less obvious than it looks: a publisher is allowed to re-escape a title on its
 * way through, and a check that called that a moved address would teach its
 * readers to ignore it.
 *
 * Plain module: no network, no disk. What an answer means is decided by whoever
 * asked; this only says whether two addresses name the same thing.
 */

/** A path as a reader would see it, with the escaping that carries no meaning taken off. */
function readablePath(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    // A stray percent sign is part of the address, not an encoding mistake.
    return pathname;
  }
}

/**
 * Whether two addresses stand for the same thing, whatever the escaping says.
 *
 * Compared as addresses rather than as strings, because an answer may come back
 * with a title spelled the way the server writes it: this publisher answers a
 * query holding an apostrophe with `%27` where the app sent `'`, and that wiki
 * answers a file page with its parentheses escaped where the table wrote them
 * out. Both are the same address, and neither is something to wake anybody for.
 *
 * What is compared is what a reader would land on: the site, the path, the
 * parameters asked for, and their values as the server understood them. A
 * renamed parameter, a moved path, a dropped term and another site are all
 * differences this keeps.
 */
export function sameAddress(one, other) {
  let asked = null;
  let answered = null;
  try {
    asked = new URL(one);
    answered = new URL(other);
  } catch {
    return false;
  }

  if (asked.protocol !== answered.protocol || asked.host !== answered.host) return false;
  if (readablePath(asked.pathname) !== readablePath(answered.pathname)) return false;

  const names = [...asked.searchParams.keys()].sort();
  const otherNames = [...answered.searchParams.keys()].sort();
  if (names.join("\u0000") !== otherNames.join("\u0000")) return false;

  return names.every(
    (name) => asked.searchParams.getAll(name).join("\u0000") === answered.searchParams.getAll(name).join("\u0000")
  );
}
