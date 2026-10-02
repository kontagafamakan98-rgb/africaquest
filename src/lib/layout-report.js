/**
 * The report with the faults that were read more than once said once.
 *
 * A screen is read at two widths, and four of the screens a quiz is made of are
 * the same shell with a different question drawn in it. So a fault of that shell
 * is read once per question and again at the other width: six lines that say the
 * same thing, and a reader who has to compare them by eye to find out that they
 * do. They are one fault. What repeats is the reading, not the fault, and the
 * report should say so in one line rather than six.
 *
 * Two entries belong together when they are the same rule about the same thing:
 *
 * - an axe rule is about the screen as a whole and names no element of its own
 *   that a fix would touch - `landmark-one-main` on the quiz, on the sheet over
 *   it and at both widths is one screen that wants a landmark - so every entry
 *   that names the same axe rule is gathered, whatever it found there;
 * - a rule of the geometry reading names the element it found, and two readings
 *   of one element differ only in where it was drawn, so the measurement is
 *   taken out of the words before they are compared. The paragraph whose words
 *   are cut off is the same paragraph at both widths, and it is one cut to fix.
 *
 * What is not gathered is a rule that found two different things on one screen:
 * two paragraphs cut short are two paragraphs, and a report that named only the
 * first would be hiding work rather than shortening itself. So the gathering is
 * on the rule and on what it found, never on the rule alone.
 *
 * Plain module: no browser, no files. An entry's `where` is added by the caller,
 * which is the only part of it that knows about a screen; this reads it and
 * keeps it, and judges nothing.
 */

/**
 * An entry as the report holds it: the rule that found something, what it found,
 * and the reading it was found in.
 *
 * @typedef {{ where: string, rule: string, what: string }} Finding
 */

/**
 * The same finding, once, with the readings it was found in.
 *
 * @typedef {Finding & { screens: string[], count: number }} Gathered
 */

/**
 * What an entry is about, with the reading's own numbers taken out.
 *
 * The words of a finding name the element it is about and then measure it: where
 * the box was drawn, how many pixels it lost, how many controls were counted. Of
 * those, only the element is the same at both widths, so only the measurements
 * are removed - and removed as a shape rather than as this run's figures, so
 * that a stand-in reading and a real one compare the same way.
 *
 * @param {string} what one finding's own words
 * @returns {string} the same words with the measurements drawn as their shape
 */
function withoutMeasurements(what) {
  return what
    // "at 150x16 (x 77, y 3615)": where a box ended up, which is the one thing
    // that always differs between two readings of one element.
    .replace(/at \d+x\d+ \(x -?\d+, y -?\d+\)/g, "at its place")
    // "84px", "44px": a measurement, wherever it is on the line.
    .replace(/\d+(?=px)/g, "N")
    // "30 control(s)", "3 node(s)": a count of what was found.
    .replace(/\d+(?= (?:control|node)\(s\))/g, "N");
}

/**
 * What two entries have to share to be the same fault read twice.
 *
 * @param {Finding} entry
 * @returns {string} the key that gathers it with its repeats
 */
function sameness(entry) {
  // An axe entry names the rule, and the rule is the whole of what it is about:
  // the nodes it happens to name travel with the finding rather than define it.
  // The rule as it stands carries the severity too, so a rule read as a failure
  // is never gathered with the same rule read as a note.
  if (/^axe/.test(entry.rule)) return entry.rule;
  // Any other finding names its element, and the element is what it is about.
  return `${entry.rule}\u0000${withoutMeasurements(entry.what)}`;
}

/**
 * The report's entries, each fault once, in the order it was first read.
 *
 * The order is the order of first sight rather than of frequency: a report is
 * read from the top, and the first screen a fault was found on is the one a
 * reader goes to first. Every entry keeps the words of that first reading, and
 * the readings it was found in are beside it, so the gathering hides nothing but
 * the repetition.
 *
 * @param {Finding[]} entries what the audit read, in the order it read it
 * @returns {Gathered[]} one entry per distinct fault
 */
export function collapseRepeats(entries) {
  /** @type {Map<string, Gathered>} */
  const gathered = new Map();
  /** @type {string[]} */
  const order = [];

  for (const entry of entries) {
    const key = sameness(entry);
    const already = gathered.get(key);
    if (!already) {
      gathered.set(key, { ...entry, screens: [entry.where], count: 1 });
      order.push(key);
      continue;
    }
    already.count += 1;
    // A fault read twice in one reading - two findings that say the same thing
    // of the same screen - is still one screen, and the count is what carries
    // the repetition there.
    if (!already.screens.includes(entry.where)) already.screens.push(entry.where);
  }

  return order.map((key) => gathered.get(key));
}
