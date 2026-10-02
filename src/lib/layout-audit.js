/**
 * The faults a real browser shows and no window without a layout can.
 *
 * `src/components/game/screens.test.js` draws every screen for real and hands
 * the markup to axe, which is what turns the accessibility of a screen from a
 * promise into a check. But that document is jsdom, and jsdom lays nothing out:
 * every rectangle in it is zero, so the rules axe reports as needing a layout
 * engine cannot run there, and axe itself says so rather than guessing. The two
 * that matter most on a phone are among them - the contrast of a word is
 * measured against what is really behind it, and the size of a target is
 * measured against the pixels it really occupies - and both were turned off
 * there, because a rule that cannot run must not be read as a rule that passed.
 *
 * So this is the other half. The screens are opened in a real browser set to a
 * phone, with the layout engine running and the stylesheets applied, and two
 * things are read from the result:
 *
 * - axe, run again, with every rule it has: the same checks as before, plus the
 *   ones that only a browser can run;
 * - the geometry below, which no rule expresses: a page that scrolls sideways,
 *   an element that hangs off the screen, words cut off with nothing saying
 *   they were, and two pieces of text drawn on top of each other.
 *
 * The fourth is why this exists at all. The study list once drew the name of a
 * level in about a hundred and twenty pixels on a phone, cut fourteen of the
 * twenty-six names short, and nothing caught it: jsdom has no width to be short
 * of. A measurement is what a check needs here, and a measurement needs a
 * browser.
 *
 * Plain module: no files, no network, no browser. `collectInPage` is written to
 * be handed to a browser as it stands, so it reads nothing but its own argument,
 * the selector below, and the document; `judge` is handed what that returned and
 * decides what it means, so the rules can be tested with measurements that are
 * wrong on purpose.
 */

/**
 * The screens a phone is used at, smallest first.
 *
 * Three hundred and twenty is the narrowest width still in use - it is where a
 * row that fits on every other phone comes apart - and three hundred and ninety
 * is the width of the phone most readers hold. A screen is read at both, because
 * a layout fault on the narrow one is the fault nobody ever sees.
 */
export const PHONE_SIZES = [
  { name: "a narrow phone", width: 320, height: 568 },
  { name: "a common phone", width: 390, height: 844 },
];

/** How far a rectangle may pass an edge before it counts as passing it. */
export const SLACK = 1;

/**
 * How much of two pieces of text may share pixels before one is drawn on the
 * other.
 *
 * A quarter of the smaller of the two, and at least four pixels on each axis:
 * enough that a border, a rounded corner or a shadow is not a collision, and
 * little enough that a word printed over another word always is.
 */
export const OVERLAP_SHARE = 0.25;
export const OVERLAP_MIN_PX = 4;

/** What a thumb wants a control to be, and not a rule anybody broke. */
export const TAP_COMFORTABLE = 44;

/** What a control may be focused or tapped with, below which there is nothing
 * to aim at: an element of one or two pixels is a hidden input or a piece of
 * text kept for a screen reader, and both are deliberate. */
export const TAP_PRESENT = 2;

/** The elements a reader can act on, as the browser itself sees them. */
export const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  '[role="button"]',
  '[role="radio"]',
  '[role="checkbox"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="switch"]',
].join(", ");

/**
 * What a screen looks like, measured in the browser it was drawn in.
 *
 * Written to be serialized into a browser and called there, so it takes no
 * argument, reaches for nothing outside itself, and hands back something a
 * message can carry: numbers, strings and booleans, nothing else. Every element
 * is walked - a name for a parent has to be its own name - but only the ones
 * worth judging are kept:
 *
 * - everything a reader can act on, for the size of a target;
 * - everything that holds text of its own, which is what can end up on top of
 *   another piece of text or outside the screen;
 * - everything that cuts its own content off, which is where words are lost;
 * - everything pinned in place, which is what content scrolls under.
 *
 * @param {string} interactiveSelector the elements a reader can act on, handed
 *   in rather than written again here: the list lives above, and a copy of it
 *   inside this function would be a list that stops matching it
 * @returns {{ viewport: {width: number, height: number}, page: object, nodes: object[] }}
 *   the screen as it was laid out: the page's own size, and one record per
 *   element worth judging
 */
export function collectInPage(interactiveSelector) {
  const SLACK_PX = 1;
  const viewport = {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
  };
  const all = [...document.querySelectorAll("*")];
  // Every element is numbered, kept or not, so that two records can say they
  // come from the same parent: two texts are drawn on each other only when they
  // were laid out by the same box, and a parent's number is the whole of what
  // that takes.
  const ids = new Map();
  all.forEach((element, index) => {
    ids.set(element, index);
  });

  // The elements that scroll something themselves. A box that clips what it
  // holds is not hiding anything when what it holds scrolls: a shell that hides
  // its overflow and hands the scrolling to a screen inside it is the shape
  // every application of this kind has.
  const scrollers = all.filter((element) => {
    const style = getComputedStyle(element);
    return /^(auto|scroll)$/.test(style.overflowX) || /^(auto|scroll)$/.test(style.overflowY);
  });

  /**
   * Whether this element is held by something that scrolls sideways.
   *
   * A row of photographs wider than the phone is a row that scrolls, and the
   * photographs past the right edge are the point of it rather than a fault: it
   * is the row's own width that decides, and the row is reached by dragging it.
   * Only the horizontal axis counts. Everything on a phone is inside something
   * that scrolls down - the screen itself - so excusing a vertical scroller
   * would excuse every element of every screen.
   */
  const heldByScrollerX = (element) => {
    for (let step = element.parentElement; step; step = step.parentElement) {
      const style = getComputedStyle(step);
      if (style.overflowX === "auto" || style.overflowX === "scroll") return true;
    }
    return false;
  };

  /**
   * How to find this element again, by the shortest path that names it.
   *
   * Three steps up, and stopped at the first ancestor with an id: what is wanted
   * is something a person can paste into the element inspector, not the whole
   * path from the root of a screen that draws twenty-six cards.
   */
  const name = (element) => {
    const own = element.getAttribute("aria-label") || element.getAttribute("title");
    if (own) return `${element.tagName.toLowerCase()}[${own.slice(0, 30)}]`;
    let path = "";
    let step = element;
    for (let depth = 0; depth < 3 && step && step.parentElement; depth += 1) {
      if (step.id) {
        path = `#${step.id}`;
        break;
      }
      const rank = [...step.parentElement.children].indexOf(step) + 1;
      path = `${step.tagName.toLowerCase()}:nth-child(${rank})${path ? `>${path}` : ""}`;
      step = step.parentElement;
    }
    return path || element.tagName.toLowerCase();
  };

  const nodes = [];
  for (const element of all) {
    const style = getComputedStyle(element);
    // An element that is not drawn has no rectangle to judge: it is not part of
    // what a reader was given.
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = element.getBoundingClientRect();
    const clipX = style.overflowX === "hidden" || style.overflowX === "clip";
    const clipY = style.overflowY === "hidden" || style.overflowY === "clip";
    const cutX = clipX && element.scrollWidth > element.clientWidth + SLACK_PX;
    const cutY = clipY && element.scrollHeight > element.clientHeight + SLACK_PX;
    const interactive = element.matches(interactiveSelector);
    const escapes =
      rect.width > 0 &&
      rect.height > 0 &&
      (rect.left < -SLACK_PX || rect.right > viewport.width + SLACK_PX);
    const pinned = style.position === "fixed" || style.position === "sticky";
    // The text an element holds itself, rather than the text of what it
    // contains: this is the innermost holder, which is the thing that can be
    // drawn over another piece of text or past an edge.
    let own = "";
    for (const child of element.childNodes) {
      if (child.nodeType === 3) own += child.textContent;
    }
    own = own.replace(/\s+/g, " ").trim();
    if (!interactive && !pinned && !escapes && !own && !(cutX || cutY)) continue;

    nodes.push({
      id: ids.get(element),
      parent: ids.get(element.parentElement) ?? -1,
      sel: name(element),
      tag: element.tagName.toLowerCase(),
      text: own.slice(0, 60),
      label: (
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        own ||
        ""
      ).slice(0, 60),
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      // A document that computes no font size at all answers with nothing here,
      // and a record that carries a NaN is a record a message cannot carry: it
      // travels as null, and the two ends stop agreeing on what was measured.
      fontSize: Math.round((parseFloat(style.fontSize) || 0) * 10) / 10,
      interactive,
      pinned,
      clipX,
      clipY,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
      // Whether the box announces that it cut something. Two ways of saying it,
      // and both count: `text-overflow: ellipsis` writes the dots after a line,
      // and a line clamp draws them itself after the number of lines it was
      // given. The level a reader is about to play is described on the screen
      // that offers its difficulties in two clamped lines, and that is the design
      // rather than a fault. A box that clips with neither is the fault: it holds
      // words past its edge and says nothing about them.
      ellipsis:
        style.textOverflow.includes("ellipsis") ||
        (typeof style.webkitLineClamp === "string" && style.webkitLineClamp !== "none" && style.webkitLineClamp !== ""),
      scrolls: scrollers.some((scroller) => element !== scroller && element.contains(scroller)),
      inScrollerX: heldByScrollerX(element),
    });
  }

  return {
    viewport,
    page: {
      width: viewport.width,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      height: window.innerHeight,
    },
    nodes,
  };
}

/** How to say which element a fault was found on, in one line. */
export function describe(node) {
  const named = node.label ? ` "${node.label}"` : "";
  const where = node.sel ? ` - ${node.sel.slice(0, 80)}` : "";
  return `${node.tag}${named} at ${node.width}x${node.height} (x ${node.x}, y ${node.y})${where}`;
}

/** Whether two rectangles of the same parent cover enough of each other to be
 * one drawn on the other. */
function collides(one, other) {
  const across = Math.min(one.x + one.width, other.x + other.width) - Math.max(one.x, other.x);
  const down = Math.min(one.y + one.height, other.y + other.height) - Math.max(one.y, other.y);
  if (across < OVERLAP_MIN_PX || down < OVERLAP_MIN_PX) return false;
  const shared = across * down;
  const smaller = Math.min(one.width * one.height, other.width * other.height);
  return smaller > 0 && shared / smaller >= OVERLAP_SHARE;
}

/**
 * What one measured screen is saying.
 *
 * Four faults, and each one is something a reader loses:
 *
 * - the page scrolls sideways, which on a phone is a screen that cannot be read
 *   without dragging it back and forth, and one finger on a card drags the page
 *   instead of the list;
 * - something hangs off the screen, which is where a fault starts and the
 *   sideways scroll above is how it ends;
 * - words are cut off by the box that holds them - the silent version of a cut
 *   word, since a box that says it cut one with an ellipsis is a decision and is
 *   kept as a note;
 * - two pieces of text are drawn on each other, which is a fault no rule in axe
 *   looks for at all.
 *
 * The size of a control is deliberately not judged here. axe has a rule for it,
 * it needs the same layout engine, and it is run on the same screen in the same
 * pass: a second opinion of our own would only be a worse one, since axe knows
 * the exceptions - a target with room around it passes without being large -
 * that a rectangle in a script cannot. What is kept is the size a thumb wants,
 * as a note, because a control that is legal and unpleasant to hit is worth
 * saying out loud.
 *
 * @param {{ viewport: {width: number, height: number}, page: object, nodes: object[] }} measured
 *   one screen as `collectInPage` read it
 * @returns {{ faults: {rule: string, what: string}[], notes: {rule: string, what: string}[] }}
 *   what is wrong, and what is worth knowing about
 */
export function judge({ viewport, page, nodes }) {
  const faults = [];
  const notes = [];
  const screen = viewport.width;

  if (page.scrollWidth > screen + SLACK) {
    faults.push({
      rule: "the page scrolls sideways",
      what: `${page.scrollWidth}px of page on a ${screen}px screen, which is ${page.scrollWidth - screen}px too wide`,
    });
  }

  // The elements that hang off the screen, worst first, and only the worst few:
  // one box that is too wide drags every text inside it past the edge with it,
  // and a report of forty lines says less than a report of six.
  const escaping = nodes
    .filter((node) => node.width > 0 && node.height > 0 && !node.inScrollerX)
    .filter((node) => node.x < -SLACK || node.x + node.width > screen + SLACK)
    .sort((left, right) => {
      const past = (node) => Math.max(-node.x, node.x + node.width - screen);
      // Two elements that hang off by the same number of pixels are read in the
      // order they were drawn in, so that the same screen says the same thing
      // twice: a report that reorders itself is a report somebody reads again.
      return past(right) - past(left) || left.id - right.id;
    });
  for (const node of escaping.slice(0, 6)) {
    const past = node.x < -SLACK ? `${-node.x}px past the left edge` : `${node.x + node.width - screen}px past the right edge`;
    faults.push({ rule: "it hangs off the screen", what: `${describe(node)}, ${past}` });
  }
  if (escaping.length > 6) {
    faults.push({ rule: "it hangs off the screen", what: `and ${escaping.length - 6} other element(s) do too` });
  }

  for (const node of nodes) {
    // A box of a pixel or two in a direction is a box that was made invisible on
    // purpose: the text kept for a screen reader is written that way, and the box
    // holds it past its own edge because there is no edge to fill. Cutting words
    // there is the intent rather than the fault, and every one of the two hundred
    // lines this reported the first time it ran was that shape.
    if (node.width < TAP_PRESENT || node.height < TAP_PRESENT) continue;
    const cutX = node.clipX && node.scrollWidth > node.clientWidth + SLACK;
    const cutY = node.clipY && node.scrollHeight > node.clientHeight + SLACK;
    if ((!cutX && !cutY) || node.scrolls || !node.label) continue;
    const lost = cutY
      ? `${node.scrollHeight - node.clientHeight}px of what it holds`
      : `${node.scrollWidth - node.clientWidth}px of what it holds`;
    const line = { rule: "words are cut off", what: `${describe(node)}, ${lost} past the box` };
    // An ellipsis is a box announcing that something was cut. It is a decision
    // rather than an accident, and it is still worth a line of its own: fourteen
    // level names came back cut short on a phone with nothing to say they were.
    if (node.ellipsis) notes.push(line);
    else faults.push(line);
  }

  // The controls a thumb would rather not be given, smallest first, and the
  // smallest few: on a screen of twenty-six cards they number in the hundreds,
  // and a list of hundreds says less about a screen than the worst six do. What
  // is kept is the size of the smallest control, which is the one thing a reader
  // of the report can act on.
  const small = nodes
    .filter((node) => node.interactive && Math.min(node.width, node.height) >= TAP_PRESENT)
    .filter((node) => Math.min(node.width, node.height) < TAP_COMFORTABLE)
    .sort((left, right) => Math.min(left.width, left.height) - Math.min(right.width, right.height) || left.id - right.id);
  for (const node of small.slice(0, 6)) {
    notes.push({
      rule: "smaller than a thumb wants",
      what: `${describe(node)}, under the ${TAP_COMFORTABLE}px a thumb is given`,
    });
  }
  if (small.length > 6) {
    notes.push({
      rule: "smaller than a thumb wants",
      what: `${small.length} control(s) on this screen are under ${TAP_COMFORTABLE}px, the smallest of them ${Math.min(
        ...small.map((node) => Math.min(node.width, node.height))
      )}px`,
    });
  }

  // Two pieces of text of the same parent: a sibling cannot hold the other, so
  // two of them sharing pixels were laid on top of each other rather than nested.
  const texts = nodes.filter((node) => node.text && node.width > 0 && node.height > 0);
  for (let left = 0; left < texts.length; left += 1) {
    for (let right = left + 1; right < texts.length; right += 1) {
      const one = texts[left];
      const other = texts[right];
      if (one.parent < 0 || one.parent !== other.parent) continue;
      if (!collides(one, other)) continue;
      faults.push({
        rule: "one text is drawn on another",
        what: `${describe(one)} and ${describe(other)}`,
      });
    }
  }

  return { faults, notes };
}
