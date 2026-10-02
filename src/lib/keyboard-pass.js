/**
 * What a reader with no mouse can reach, in what order, and whether it shows.
 *
 * The check that draws every screen reads what a screen *says*: names, roles,
 * announcements, the contrast of a word and the size of a target. None of that
 * is a keyboard. A reader who cannot use a pointer has three questions the
 * markup does not answer:
 *
 * - can a Tab reach every control at all, and does it reach them in the order
 *   they are drawn rather than jumping about;
 * - when the focus arrives, can it be seen - because a reader who can see
 *   nothing of the focus has lost their place in a screen they cannot scroll by
 *   hand;
 * - when a control has the focus, does pressing it do what the control promised.
 *
 * Those three are what a session with a screen reader would otherwise be the
 * first to find, and they are exactly what a browser can be asked for: it knows
 * the tab order, it computes the ring the stylesheet draws, and it can be made
 * to press a key. So this file holds the judgement of that pass, and
 * `scripts/audit-layout.mjs` walks a lesson and a quiz with nothing but Tab,
 * Shift+Tab and Enter, and hands what it saw to the rules below.
 *
 * Plain module: no files, no browser. `tabbablesInPage` and `focusInPage` are
 * written to be handed to a browser and run there, so they read nothing but
 * their own argument and the document; `judgeKeyboard` is handed what they
 * returned, which is what makes the rules testable with a sweep that is wrong
 * on purpose.
 */

/**
 * The elements a Tab may reach, before the list is narrowed to the ones it
 * really does.
 *
 * Written wide rather than narrow on purpose. What is left out here would be a
 * control the pass never looks for, and a control nobody looks for is a control
 * nobody finds missing; what is too wide is only ever narrowed below, and
 * narrowing is a rule with a test.
 */
export const TABBABLE_SELECTOR =
  "a[href], button, input, select, textarea, summary, iframe, [contenteditable=true], [tabindex]";

/**
 * How many presses one sweep may take before it is called a fault.
 *
 * A screen of this application holds well under a hundred controls - the lesson
 * with its references is the longest - and a sweep that runs past this is not
 * counting controls any more but chasing a tab order that never ends. That is a
 * fault of the screen, and it is reported as one rather than waited out.
 */
export const SWEEP_LIMIT = 400;

/** How the focus ring is written, so that a fault can name what it expected. */
export const RING = "outline: 3px solid #e3a72e";

/**
 * The controls a Tab reaches on this screen, in the order it reaches them.
 *
 * The browser's own rules, written down: a control with a negative `tabindex` is
 * reachable by script and not by a Tab, a disabled one is reachable by neither,
 * and one that is not drawn - hidden, or of no size at all - is not there to be
 * reached. What remains is ordered as the browser orders it, which is not quite
 * document order: a positive `tabindex` is taken before every one of the zeros,
 * in the order of its number. The application uses none, and a note below says
 * so if that ever changes.
 *
 * @param {string} selector the elements worth considering, handed in rather than
 *   written again here, so that the list cannot quietly stop matching the one
 *   above
 * @returns {{index: number, tag: string, sel: string, label: string,
 *   positive: boolean, hiddenFromReader: boolean}[]} what a Tab can reach
 */
export function tabbablesInPage(selector) {
  /** How to find this element again, by the shortest path that names it. */
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

  /**
   * Whether this control is on the screen at all, hidden ancestors included.
   *
   * A browser gives a control inside a hidden box a rectangle of nothing, so the
   * measure below would find it on its own - but only where there is a layout to
   * measure. Asking the stylesheet as well says the same thing in a document that
   * draws nothing, which is the document this rule is tested in, and it is the
   * rule that matters: a Tab does not reach what is not drawn.
   */
  const isDrawn = (element) => {
    for (let step = element; step; step = step.parentElement) {
      if (getComputedStyle(step).display === "none") return false;
    }
    return getComputedStyle(element).visibility !== "hidden";
  };

  const reached = [];
  for (const element of document.querySelectorAll(selector)) {
    if (element.hasAttribute("disabled")) continue;
    if (element.closest("[inert]")) continue;
    const written = element.getAttribute("tabindex");
    const value = written === null ? 0 : Number(written);
    // A control with no number a Tab can use, and one a Tab is told to skip.
    if (!Number.isFinite(value) || value < 0) continue;
    if (!isDrawn(element)) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    reached.push({
      index: reached.length,
      tag: element.tagName.toLowerCase(),
      sel: name(element),
      label: (element.getAttribute("aria-label") || element.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 60),
      positive: value > 0,
      hiddenFromReader: element.getAttribute("aria-hidden") === "true",
      value,
    });
  }

  // A positive tabindex is taken before the zeros, smallest number first, and
  // the shape of this sort is the browser's rather than a convenience: reading
  // the order wrong would report a fault of the screen that is a fault of this
  // function. Nothing here uses one, and a note says so when that changes.
  return reached
    .sort((left, right) => {
      if (left.positive !== right.positive) return left.positive ? -1 : 1;
      if (left.positive && left.value !== right.value) return left.value - right.value;
      return left.index - right.index;
    })
    .map((control, index) => ({ ...control, index }));
}

/**
 * What the browser is focused on, and how it shows that it is.
 *
 * `index` is where the focused control stands in the list a Tab walks, which is
 * what turns a sweep into a sequence of numbers: the whole of "the order is the
 * one it is drawn in, and nothing is skipped" is then that the numbers run from
 * zero upwards without a gap and without a repeat. A negative index is the
 * browser being focused on something a Tab does not reach - the body, or a
 * heading a screen moved the focus to - and it is reported as such rather than
 * counted as a control out of order.
 *
 * The ring is read as the browser computes it rather than as the stylesheet
 * writes it, because that is what a reader sees: `outline: none`, or an outline
 * of no width, or no shadow and no outline at all, is a control with nothing to
 * show for having been reached.
 *
 * @param {string} selector the same list `tabbablesInPage` was given
 * @returns {{index: number, tag: string, sel: string, label: string,
 *   outline: string, shadow: string, onThePage: boolean, reached: boolean}}
 *   the focused control, or the page being focused with nothing on it
 */
export function focusInPage(selector) {
  /** How to find this element again, by the shortest path that names it. */
  const nameOf = (element) => {
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

  /**
   * Whether a control is on the screen at all, hidden ancestors included.
   *
   * The same rule as the one in `tabbablesInPage`, written a second time because
   * neither of these two may reach for the other: what is read back is where the
   * focus stands in the list a Tab walks, and the two lists have to be the same
   * list or the number means nothing.
   */
  const isDrawn = (element) => {
    for (let step = element; step; step = step.parentElement) {
      if (getComputedStyle(step).display === "none") return false;
    }
    return getComputedStyle(element).visibility !== "hidden";
  };

  const element = document.activeElement;
  const style = getComputedStyle(element);
  const list = [];
  for (const candidate of document.querySelectorAll(selector)) {
    if (candidate.hasAttribute("disabled")) continue;
    if (candidate.closest("[inert]")) continue;
    const written = candidate.getAttribute("tabindex");
    const value = written === null ? 0 : Number(written);
    if (!Number.isFinite(value) || value < 0) continue;
    if (!isDrawn(candidate)) continue;
    const rect = candidate.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    list.push({ candidate, value, positive: value > 0 });
  }
  list.sort((left, right) => {
    if (left.positive !== right.positive) return left.positive ? -1 : 1;
    if (left.positive && left.value !== right.value) return left.value - right.value;
    return 0;
  });

  const onThePage = element === document.body || element === document.documentElement;
  return {
    index: list.findIndex((entry) => entry.candidate === element),
    tag: element ? element.tagName.toLowerCase() : "none",
    sel: element && !onThePage ? nameOf(element) : "the page",
    label: element
      ? (element.getAttribute("aria-label") || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60)
      : "",
    outline: `${Math.round(parseFloat(style.outlineWidth) || 0)}px ${style.outlineStyle} ${style.outlineColor}`,
    shadow: style.boxShadow === "none" ? "" : style.boxShadow,
    onThePage,
    reached: element ? list.some((entry) => entry.candidate === element) : false,
  };
}

/** Whether a control shows that it has the focus. */
export function focusIsVisible(visit) {
  const width = parseFloat(String(visit.outline).split(" ")[0]) || 0;
  const style = String(visit.outline).split(" ")[1];
  const outlined = width > 0 && style !== "none";
  return outlined || Boolean(visit.shadow);
}

/** How to say which control a fault was found on, in one line. */
export function describeControl(control) {
  const named = control.label ? ` "${control.label}"` : "";
  return `${control.tag}${named} - ${control.sel}`;
}

/**
 * What one keyboard journey says about the screens it walked.
 *
 * Each screen is a sweep - the presses of Tab from the first control to the last
 * - and each sweep is read as a sequence of numbers. The rules are the three
 * questions above, and they are faults rather than notes because each of them
 * makes a task impossible: a control a Tab never reaches cannot be used at all
 * by a reader who has no pointer, a focus that cannot be seen leaves that reader
 * nowhere, and a control that does nothing when it is pressed is a control that
 * lied.
 *
 * @param {{screens: {name: string, controls: object[], visits: object[],
 *   activations?: {what: string, changed: boolean}[]}[]}} journey
 *   what the walk saw
 * @returns {{faults: {rule: string, what: string}[], notes: {rule: string, what: string}[]}}
 */
export function judgeKeyboard({ screens }) {
  const faults = [];
  const notes = [];

  for (const screen of screens) {
    const { name, controls = [], visits = [], activations = [] } = screen;

    const seen = visits.map((visit) => visit.index).filter((index) => index >= 0);
    const missed = controls.filter((control) => !seen.includes(control.index));
    if (missed.length > 0) {
      faults.push({
        rule: "the keyboard never reaches a control",
        what: `${missed.length} of ${controls.length} on ${name}: ${missed
          .slice(0, 3)
          .map(describeControl)
          .join(", ")}${missed.length > 3 ? `, and ${missed.length - 3} more` : ""}`,
      });
    }

    const twice = [...new Set(seen.filter((index, at) => seen.indexOf(index) !== at))];
    if (twice.length > 0) {
      faults.push({
        rule: "the keyboard reaches a control twice",
        what: `${twice.length} control(s) on ${name}: ${twice
          .slice(0, 3)
          .map((index) => describeControl(controls[index] || { tag: "one of them" }))
          .join(", ")}`,
      });
    }

    // The order the sweep went in, once the repeats are taken out of it: a step
    // backwards is a reader being taken back to something they have already
    // passed, which is how a screen ends up read in an order nobody wrote.
    const walked = [...seen];
    const backwards = walked.filter((index, at) => at > 0 && index < walked[at - 1]);
    if (backwards.length > 0) {
      faults.push({
        rule: "the keyboard goes back and forth",
        what: `${backwards.length} step(s) on ${name} land on a control already passed, first at ${backwards[0]}`,
      });
    }

    const lost = visits.filter((visit) => visit.onThePage || !visit.reached);
    if (lost.length > 0) {
      faults.push({
        rule: "the keyboard loses its place",
        what: `${lost.length} press(es) on ${name} leave the controls: the focus was on ${lost[0].sel} after ${lost[0].at} of them`,
      });
    }

    const blank = visits.filter((visit) => visit.reached && !focusIsVisible(visit));
    if (blank.length > 0) {
      faults.push({
        rule: "the focus cannot be seen",
        what: `${blank.length} control(s) on ${name} show nothing when reached, first ${describeControl(
          blank[0]
        )}, expected ${RING}`,
      });
    }

    for (const activation of activations) {
      if (!activation.changed) {
        faults.push({
          rule: "pressing a control does nothing",
          what: `${activation.what} on ${name}: the screen was the same afterwards`,
        });
      }
    }

    const many = controls.filter((control) => control.positive);
    if (many.length > 0) {
      notes.push({
        rule: "a positive tabindex reorders the screen",
        what: `${many.length} control(s) on ${name} are taken before everything else, whatever the order they are drawn in`,
      });
    }
    const unseen = controls.filter((control) => control.hiddenFromReader);
    if (unseen.length > 0) {
      notes.push({
        rule: "a control a Tab reaches is hidden from a screen reader",
        what: `${unseen.length} on ${name}, first ${describeControl(unseen[0])}`,
      });
    }
    notes.push({
      rule: "what the keyboard passes through",
      what: `${seen.length} control(s) on ${name} are reached by Tab, in ${visits.length} press(es)`,
    });
  }

  return { faults, notes };
}
