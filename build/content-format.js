/**
 * How a value of the game's content is written in the source.
 *
 * Two scripts write content into the repository - the one that turns a level into
 * a module of its own for a lesson, and the one that turns the database back into
 * the four modules the game is read from - and a review of either is a review of
 * the file it wrote. So the text they produce has to be the same text: readable by
 * a person, diffable, and written the same way by both. That is why this lives
 * here rather than in one of them, where a second copy would drift.
 */

/**
 * A value that is written as it stands rather than as a string.
 *
 * One thing in the content is not data: the icon of a level is a component the
 * module imports, so `Landmark` is written bare where every other name is quoted.
 * A wrapper rather than a rule about the key, so the formatter stays about shapes
 * and the meaning stays with whoever builds the value.
 */
export class Raw {
  /** @param {string} text */
  constructor(text) {
    this.text = text;
  }
}

/**
 * A string, as it is written in the source: quoted, escaped, one line.
 *
 * @param {string} value
 * @returns {string}
 */
const quote = (value) => JSON.stringify(value);

/**
 * A value of the content, written the way a person would write it.
 *
 * The output is source rather than JSON: an array of short strings - the four
 * answers of a question - stays on one line, a row of short fields stays on one
 * line, and everything longer is broken over several. The point is a file
 * somebody can read and diff.
 *
 * @param {unknown} value
 * @param {number} indent
 * @returns {string}
 */
export function pretty(value, indent) {
  const pad = " ".repeat(indent);

  if (value instanceof Raw) return value.text;
  if (typeof value === "string") return quote(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return `[${value.map((item) => pretty(item, indent)).join(", ")}]`;
    }
    const body = value.map((item) => `${pad}  ${pretty(item, indent + 2)},`).join("\n");
    return `[\n${body}\n${pad}]`;
  }

  const object = /** @type {Record<string, unknown>} */ (value);
  const keys = Object.keys(object);
  if (keys.length === 0) return "{}";
  const primitive = keys.every((key) => object[key] === null || typeof object[key] !== "object");
  if (primitive) {
    const inner = keys.map((key) => `${key}: ${pretty(object[key], indent)}`).join(", ");
    if (pad.length + inner.length <= 100) return `{ ${inner} }`;
  }
  const body = keys.map((key) => `${pad}  ${key}: ${pretty(object[key], indent + 2)},`).join("\n");
  return `{\n${body}\n${pad}}`;
}
