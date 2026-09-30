/**
 * What is written down when a screen fails to be drawn.
 *
 * An application that draws everything on the reader's own device has no log to
 * look at afterwards: when a screen breaks, the only witness is the person in
 * front of it. So the failure has one shape here - the name of the error, what
 * it said, where it was thrown, and the last place in the page that was being
 * drawn - turned into a few lines of text the reader can copy and send on.
 *
 * Three things about that text are deliberate. It is bounded, because a stack
 * trace is thousands of lines of bundler output and nobody reads the end of it.
 * It is built here rather than printed raw, so the same failure reads the same
 * way whoever reports it. And it never leaves the device by itself: nothing is
 * sent anywhere, nothing is written to storage, and the lines exist only while
 * the crash screen is open, which is what keeps a "trace of every error" from
 * turning into a register of what people were doing.
 *
 * What the log of the session keeps is smaller than this on purpose: the name,
 * the message and the screen, bounded twice over (src/lib/error-log.js). The
 * stack is here for the person reading the screen, and it goes when they do.
 *
 * Plain module: the screen and the tests both read it, and it touches nothing.
 */

/** How many lines of a stack trace are worth reading, and no more. */
export const REPORT_STACK_LINES = 6;

/** How long a message may be before it stops being a message. */
export const REPORT_MESSAGE_LIMIT = 300;

/** The name of an error, for a value that may not be one at all. */
function nameOf(error) {
  if (!error || typeof error !== "object") return "Error";
  if (typeof error.name === "string" && error.name.trim() !== "") return error.name.trim().slice(0, 40);
  return "Error";
}

/** What an error said, trimmed and capped. */
function messageOf(error) {
  const raw = error && typeof error === "object" && typeof error.message === "string" ? error.message : String(error ?? "");
  const message = raw.trim().replace(/\s+/g, " ");
  if (message === "") return "no message";
  return message.length > REPORT_MESSAGE_LIMIT ? `${message.slice(0, REPORT_MESSAGE_LIMIT)}…` : message;
}

/** The first lines of a stack, which are the ones that say where it came from. */
function stackLines(stack, limit = REPORT_STACK_LINES) {
  if (typeof stack !== "string" || stack.trim() === "") return [];
  return stack
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .slice(0, limit);
}

/**
 * One failure, as the few facts a person can act on.
 *
 * The component stack is kept apart from the stack: one says which screen was
 * being drawn, the other says which line threw, and a report that mixes them is
 * harder to read than either.
 */
/**
 * A moment, from either of the two shapes a caller has: the date it made, or
 * the string a screen already wrote down and re-reads on every render.
 */
function momentOf(at) {
  if (at instanceof Date) return Number.isNaN(at.getTime()) ? null : at.toISOString();
  if (typeof at === "string" && /^\d{4}-\d{2}-\d{2}T/.test(at)) return at.slice(0, 40);
  return null;
}

export function describeFailure(error, { componentStack = "", address = "", at = null } = {}) {
  return {
    name: nameOf(error),
    message: messageOf(error),
    stack: stackLines(error && typeof error === "object" ? error.stack : ""),
    component: stackLines(componentStack, 4).map((line) => line.replace(/^\s*at\s+/, "")),
    address: typeof address === "string" ? address.slice(0, 200) : "",
    at: momentOf(at),
  };
}

/** The same failure, as the lines the reader copies. */
export function failureReport(failure) {
  const described = failure && typeof failure === "object" ? failure : describeFailure(failure);
  const lines = [
    `${described.name}: ${described.message}`,
    described.at ? `When: ${described.at}` : "",
    described.address ? `Where: ${described.address}` : "",
  ];

  if (described.stack?.length) lines.push("Stack:", ...described.stack.map((line) => `  ${line}`));
  if (described.component?.length) lines.push("Screen:", ...described.component.map((line) => `  ${line}`));

  return lines.filter((line) => line !== "").join("\n");
}
