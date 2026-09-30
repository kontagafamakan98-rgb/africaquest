/**
 * The application icons, drawn from the favicon.
 *
 * The favicon is the one place the app's mark is described, so the PNG icons a
 * launcher asks for are rasterised from it instead of being drawn a second
 * time. Change favicon.svg, regenerate, and the tab and the home screen agree
 * again; forget to regenerate and the check in `npm run verify` says so.
 *
 * Only the subset of SVG the favicon actually uses is understood: a square
 * viewBox, an optional clip path, and rects, circles and ellipses filled with a
 * flat colour. Anything else makes the reader throw, because the alternative is
 * worse: a hand written rasteriser that silently leaves a shape out ships a
 * blank or half drawn icon that nobody notices until it is on a phone.
 *
 * Shapes are painted through signed distance functions, so the edges are
 * antialiased at any size and the same code draws the 180px touch icon and the
 * 512px launcher icon. Nothing here touches the file system: the script and the
 * tests read the favicon, hand the text in, and get PNG bytes back.
 */

import { deflateSync } from "node:zlib";

/** Where the mark is described. Also the file the icons are generated from. */
export const FAVICON_FILE = "public/favicon.svg";

/**
 * The icons an installed app needs, and how each one is cropped.
 *
 * `bleed` fills the square and leaves no transparent corner: Android crops a
 * maskable icon to the shape of its launcher and iOS rounds a touch icon
 * itself, so the artwork has to reach every edge in both cases. The plain
 * icons keep the favicon's rounded corners, transparent outside them.
 */
export const ICON_TARGETS = [
  { file: "icon-192.png", size: 192, bleed: false },
  { file: "icon-512.png", size: 512, bleed: false },
  { file: "icon-maskable-512.png", size: 512, bleed: true, safe: true },
  { file: "apple-touch-icon.png", size: 180, bleed: true },
];

/**
 * How far the subject of the icon may reach from its centre, as a fraction of
 * the icon width.
 *
 * Android draws an adaptive icon on a 108dp canvas and only promises that the
 * central circle of 66dp stays visible, whatever shape the launcher crops it
 * to. Its radius is 33dp, a little over 30% of the width, so a mark drawn any
 * further out than that can lose its edges on someone's home screen. The
 * favicon is drawn for a browser tab, where nothing is cropped, so an icon that
 * has to survive a launcher pulls the mark back inside this circle instead.
 */
export const SAFE_ZONE_REACH = 0.3;

const COLOUR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
// Tags that hold no shape of their own: reading past them loses nothing.
const TRANSPARENT_TAGS = new Set(["svg", "defs", "title", "desc", "metadata"]);
const SHAPE_TAGS = new Set(["rect", "circle", "ellipse"]);

/* ------------------------------------------------------------------ PNG --- */

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

/** Signature, IHDR, IDAT (deflate), IEND: 8 bit truecolour with alpha. */
export function encodePng(width, height, pixels) {
  const stride = width * 4;
  // One filter byte (0: none) in front of every row. Flat artwork compresses
  // well enough without the per row filters, and this keeps the reader simple.
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(pixels.buffer, pixels.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bits per channel
  header[9] = 6; // truecolour with alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------- SVG read --- */

function attributesOf(token) {
  const attributes = {};
  for (const match of token.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function numberAttribute(attributes, name, fallback) {
  const raw = attributes[name];
  if (raw === undefined) {
    if (fallback === undefined) throw new Error(`icons: a shape is missing its ${name}`);
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`icons: ${name}="${raw}" is not a number`);
  return value;
}

function colourOf(raw) {
  if (typeof raw !== "string") {
    throw new Error("icons: a shape is drawn without a fill colour");
  }
  if (!COLOUR.test(raw)) {
    throw new Error(`icons: the fill ${raw} is not a plain hex colour`);
  }
  const hex = raw.slice(1);
  const full = hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
  return [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16));
}

function shapeOf(name, attributes) {
  if (name === "rect") {
    return {
      kind: "rect",
      x: numberAttribute(attributes, "x", 0),
      y: numberAttribute(attributes, "y", 0),
      width: numberAttribute(attributes, "width"),
      height: numberAttribute(attributes, "height"),
      // A rounded rectangle carries one radius: rx, with ry as the rare second.
      rx: numberAttribute(attributes, "rx", 0),
      ry: numberAttribute(attributes, "ry", numberAttribute(attributes, "rx", 0)),
    };
  }
  if (name === "circle") {
    const r = numberAttribute(attributes, "r");
    return {
      kind: "circle",
      cx: numberAttribute(attributes, "cx", 0),
      cy: numberAttribute(attributes, "cy", 0),
      r,
    };
  }
  return {
    kind: "ellipse",
    cx: numberAttribute(attributes, "cx", 0),
    cy: numberAttribute(attributes, "cy", 0),
    rx: numberAttribute(attributes, "rx"),
    ry: numberAttribute(attributes, "ry"),
  };
}

function clipNameOf(attributes) {
  const value = attributes["clip-path"];
  if (value === undefined) return null;
  const match = /^url\(#([^)]+)\)$/.exec(value.trim());
  if (!match) throw new Error(`icons: the clip path ${value} cannot be resolved`);
  return match[1];
}

/**
 * The favicon, as a list of shapes to paint in order.
 *
 * Returns the viewBox, the outline an icon is cropped to, and the shapes with
 * the fill they inherit from their group. Throws on anything it cannot draw,
 * naming the tag or the attribute, so an unreadable favicon is a failure rather
 * than a quietly missing silhouette.
 */
export function readFaviconScene(svgText) {
  const source = String(svgText).replace(/<!--[\s\S]*?-->/g, "");

  const viewBox = /viewBox="([^"]+)"/.exec(source);
  if (!viewBox) throw new Error("icons: the favicon declares no viewBox");
  const [minX, minY, width, height] = viewBox[1].trim().split(/[\s,]+/).map(Number);
  if (![minX, minY, width, height].every(Number.isFinite)) {
    throw new Error(`icons: the viewBox "${viewBox[1]}" is not readable`);
  }
  if (width <= 0 || height <= 0) throw new Error("icons: the viewBox has no surface");
  // An icon is square, and a stretched mark is a mistake nobody wants on a home
  // screen, so a non square viewBox is refused rather than scaled and guessed.
  if (Math.abs(width - height) > 1e-6) {
    throw new Error(`icons: the viewBox is ${width}x${height}, and an icon is square`);
  }

  const shapes = [];
  const clips = new Map();
  const groupFills = [];
  const groupClips = [];
  let collecting = null;
  let outlineName = null;

  for (const token of source.match(/<[^>]+>/g) || []) {
    const name = /^<\/?([a-zA-Z][\w-]*)/.exec(token)?.[1]?.toLowerCase();
    if (!name) continue;
    const closing = token.startsWith("</");

    if (name === "clippath") {
      collecting = null;
      if (!closing) {
        collecting = attributesOf(token).id || null;
        if (collecting) clips.set(collecting, []);
      }
      continue;
    }

    if (name === "g") {
      if (closing) {
        groupFills.pop();
        groupClips.pop();
        continue;
      }
      const attributes = attributesOf(token);
      // The outermost clip is what an icon is cropped to: rounded for the
      // browser icons, square for the ones a launcher or iOS rounds itself.
      const clip = clipNameOf(attributes);
      if (groupFills.length === 0 && clip) outlineName = clip;
      groupFills.push(attributes.fill);
      groupClips.push(clip);
      continue;
    }

    if (!SHAPE_TAGS.has(name)) {
      if (TRANSPARENT_TAGS.has(name)) continue;
      throw new Error(`icons: the favicon uses <${name}>, which the icon renderer cannot draw`);
    }

    const attributes = attributesOf(token);
    const shape = shapeOf(name, attributes);

    if (collecting) {
      clips.get(collecting)?.push(shape);
      continue;
    }
    if (attributes.fill === "none") continue;

    shape.fill = colourOf(attributes.fill ?? groupFills[groupFills.length - 1]);
    shape.clip = groupClips[groupClips.length - 1] || null;
    shapes.push(shape);
  }

  if (shapes.length === 0) throw new Error("icons: the favicon draws nothing");

  const outline = outlineName ? clips.get(outlineName)?.[0] : null;
  if (outline && outline.kind !== "rect") {
    throw new Error(`icons: the icon outline is a <${outline.kind}>, and only a rectangle can be one`);
  }

  return { minX, minY, width, height, outline: outline || null, shapes };
}

/* --------------------------------------------------------------- draw ---- */

/** Signed distance to a rounded rectangle, in the units it is given. */
function roundedRectDistance(x, y, halfWidth, halfHeight, radius) {
  const dx = Math.abs(x) - (halfWidth - radius);
  const dy = Math.abs(y) - (halfHeight - radius);
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  return outside + Math.min(Math.max(dx, dy), 0) - radius;
}

/** Signed distance to the edge of one shape, negative inside it. */
function shapeDistance(shape, x, y) {
  // Shapes arrive here in the units of the surface they are painted on: the
  // favicon's own units for an icon, card pixels for a link preview.
  if (shape.kind === "circle") {
    return Math.hypot(x - shape.cx, y - shape.cy) - shape.r;
  }
  if (shape.kind === "ellipse") {
    // The usual approximation: the ellipse read as a circle in scaled
    // coordinates. It is off by a fraction of a pixel on a shape this flat,
    // which is why the distance is scaled back before it is used.
    const scaled = Math.hypot((x - shape.cx) / shape.rx, (y - shape.cy) / shape.ry);
    return (scaled - 1) * Math.min(shape.rx, shape.ry);
  }
  return roundedRectDistance(
    x - (shape.x + shape.width / 2),
    y - (shape.y + shape.height / 2),
    shape.width / 2,
    shape.height / 2,
    Math.min(shape.rx, shape.width / 2, shape.height / 2)
  );
}

/** Coverage of a pixel for a distance, antialiased over roughly one pixel. */
function coverage(distance) {
  return Math.min(Math.max(1 - distance, 0), 1);
}

/**
 * Paints one shape over the RGBA buffer, cropped to the icon's outline.
 *
 * `distance` and `crop` both work in pixels, so the antialiased edge is one
 * pixel wide whatever size the icon is drawn at.
 */
function paint(pixels, width, height, distance, colour, crop) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Written so that a shape the renderer cannot place, a distance that is
      // not a number, leaves the pixel alone instead of painting it black.
      const value = distance(x + 0.5, y + 0.5);
      if (!(value <= 1)) continue;
      const inside = coverage(value);
      if (!(inside > 0)) continue;

      const alpha = inside * coverage(crop(x + 0.5, y + 0.5));
      if (!(alpha > 0)) continue;

      const index = (y * width + x) * 4;
      const inverse = 1 - alpha;
      pixels[index] = Math.round(pixels[index] * inverse + colour[0] * alpha);
      pixels[index + 1] = Math.round(pixels[index + 1] * inverse + colour[1] * alpha);
      pixels[index + 2] = Math.round(pixels[index + 2] * inverse + colour[2] * alpha);
      pixels[index + 3] = Math.round(pixels[index + 3] * inverse + 255 * alpha);
    }
  }
}

/**
 * A shape, pulled towards the centre of the favicon.
 *
 * Only the mark is moved: a band that already spans the favicon keeps its full
 * bleed, so shrinking the subject never leaves a stripe of background colour
 * down the edge of the icon.
 */
function pullIn(shape, centre, factor) {
  const towardX = (value) => centre.x + (value - centre.x) * factor;
  const towardY = (value) => centre.y + (value - centre.y) * factor;
  const moved = { ...shape };
  if (shape.kind === "rect") {
    moved.x = towardX(shape.x);
    moved.y = towardY(shape.y);
    moved.width = shape.width * factor;
    moved.height = shape.height * factor;
    moved.rx = shape.rx * factor;
    moved.ry = shape.ry * factor;
    return moved;
  }
  moved.cx = towardX(shape.cx);
  moved.cy = towardY(shape.cy);
  if (shape.kind === "circle") {
    moved.r = shape.r * factor;
  } else {
    moved.rx = shape.rx * factor;
    moved.ry = shape.ry * factor;
  }
  return moved;
}

/**
 * How much the mark has to be pulled towards the centre to fit the circle a
 * launcher keeps: 1 when the favicon already fits, less when it does not.
 */
export function safeZoneInset(scene) {
  const reach = safeZoneReach(scene);
  return reach <= SAFE_ZONE_REACH ? 1 : SAFE_ZONE_REACH / reach;
}

/**
 * One icon, as PNG bytes. `bleed` drops the rounded corners and `safe` pulls the
 * mark back inside the circle a launcher keeps.
 */
export function renderIcon(scene, { size, bleed = false, safe = false }) {
  const pixels = new Uint8ClampedArray(size * size * 4);
  const scale = size / scene.width;
  const outline = scene.outline;
  const toSvgX = (x) => (x - scene.minX) / scale;
  const toSvgY = (y) => (y - scene.minY) / scale;

  // The browser icons keep the favicon's outline; a launcher crops a maskable
  // icon itself, so there the artwork simply fills the square.
  const crop = bleed || !outline
    ? () => -1
    : (x, y) =>
        shapeDistance(
          {
            kind: "rect",
            x: outline.x,
            y: outline.y,
            width: outline.width,
            height: outline.height,
            rx: outline.rx,
            ry: outline.ry,
          },
          toSvgX(x),
          toSvgY(y)
        ) * scale;

  const inset = safe ? safeZoneInset(scene) : 1;
  const centre = { x: scene.minX + scene.width / 2, y: scene.minY + scene.height / 2 };

  for (const shape of scene.shapes) {
    const drawn = inset === 1 || spansFrame(shape, scene) ? shape : pullIn(shape, centre, inset);
    paint(
      pixels,
      size,
      size,
      (x, y) => shapeDistance(drawn, toSvgX(x), toSvgY(y)) * scale,
      drawn.fill,
      crop
    );
  }

  return encodePng(size, size, pixels);
}

/* ---------------------------------------------------------- link card --- */

/**
 * The picture a link to the application shows: in a chat, in a feed, in a
 * search result.
 *
 * It is drawn from the favicon, like every other piece of artwork here, so the
 * mark cannot end up looking like two different things on two screens. The two
 * shapes that already span the favicon - the sky and the ground - are stretched
 * across the card, which is what turns a square icon into a landscape; the mark
 * between them keeps its proportions and rests where it reads, because a sun
 * pulled sideways is a mistake rather than a style.
 *
 * `share` is how much of the card's height the mark takes. The horizon stays on
 * the card's own centre line whatever that number is, so shrinking the mark
 * never moves the ground.
 */
export const SOCIAL_CARD = {
  file: "social-preview.png",
  width: 1200,
  height: 630,
  share: 1,
};

/**
 * One shape, placed on the card, in card pixels.
 *
 * A shape that spans the favicon is stretched to the card's width and height, so
 * the sky reaches the edges and the ground lies flat across the bottom. Every
 * other shape is moved by a single factor, which is what keeps the mark from
 * changing shape: only a rectangle spanning the frame can be stretched without
 * anybody noticing.
 */
function shapeOnCard(shape, scene, { width, height, factor, midX, midY, centre }) {
  const across = spansFrame(shape, scene);
  const scaleX = across ? width / scene.width : factor;
  const scaleY = across ? height / scene.height : factor;
  const moveX = (value) => (across ? (value - scene.minX) * scaleX : midX + (value - centre.x) * factor);
  const moveY = (value) => (across ? (value - scene.minY) * scaleY : midY + (value - centre.y) * factor);

  const box = (value, scale) => value * scale;

  if (shape.kind === "rect") {
    return {
      kind: "rect",
      x: moveX(shape.x),
      y: moveY(shape.y),
      width: box(shape.width, scaleX),
      height: box(shape.height, scaleY),
      rx: box(shape.rx, scaleX),
      ry: box(shape.ry, scaleY),
    };
  }

  const radiusX = shape.kind === "circle" ? shape.r : shape.rx;
  const radiusY = shape.kind === "circle" ? shape.r : shape.ry;
  const cx = moveX(shape.cx);
  const cy = moveY(shape.cy);
  const rx = box(radiusX, scaleX);
  const ry = box(radiusY, scaleY);
  // A circle drawn about two different axes is an ellipse, and only an ellipse
  // can carry two radii.
  if (shape.kind === "circle" && Math.abs(rx - ry) < 1e-9) return { kind: "circle", cx, cy, r: rx };
  return { kind: "ellipse", cx, cy, rx, ry };
}

/** The link preview, as PNG bytes. */
export function renderSocialCard(
  scene,
  { width = SOCIAL_CARD.width, height = SOCIAL_CARD.height, share = SOCIAL_CARD.share } = {}
) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  const placement = {
    width,
    height,
    factor: share * Math.min(width / scene.width, height / scene.height),
    midX: width / 2,
    midY: height / 2,
    centre: { x: scene.minX + scene.width / 2, y: scene.minY + scene.height / 2 },
  };
  // Nothing is cropped: a link preview is a rectangle with no corners to round,
  // and the sky is meant to reach every edge of it.
  const noCrop = () => -1;

  for (const shape of scene.shapes) {
    const drawn = shapeOnCard(shape, scene, placement);
    paint(pixels, width, height, (x, y) => shapeDistance(drawn, x, y), drawn.fill ?? shape.fill, noCrop);
  }

  return encodePng(width, height, pixels);
}

/**
 * How far the subject of an icon reaches from its centre, as a fraction of the
 * icon width.
 *
 * Bands that span the whole favicon, the sky and the ground, are meant to bleed
 * to the edge and are left out of the measurement: what a launcher must not
 * crop is the mark, and this is the number that says whether it fits inside the
 * circle Android cuts a maskable icon to.
 */
export function safeZoneReach(scene) {
  const centre = { x: scene.minX + scene.width / 2, y: scene.minY + scene.height / 2 };

  let reach = 0;
  for (const shape of scene.shapes.filter((shape) => !spansFrame(shape, scene))) {
    reach = Math.max(reach, farthestPoint(shape, centre));
  }
  return reach / scene.width;
}

/** Whether a shape covers the favicon from edge to edge: the sky, the ground. */
function spansFrame(shape, scene) {
  const box = shape.kind === "rect"
    ? { width: shape.width, height: shape.height }
    : shape.kind === "circle"
      ? { width: 2 * shape.r, height: 2 * shape.r }
      : { width: 2 * shape.rx, height: 2 * shape.ry };
  return box.width >= scene.width - 1e-6 || box.height >= scene.height - 1e-6;
}

/** The furthest point of a shape's outline from a centre. */
function farthestPoint(shape, centre) {
  if (shape.kind === "rect") {
    const corners = [
      [shape.x, shape.y],
      [shape.x + shape.width, shape.y],
      [shape.x, shape.y + shape.height],
      [shape.x + shape.width, shape.y + shape.height],
    ];
    return Math.max(...corners.map(([x, y]) => Math.hypot(x - centre.x, y - centre.y)));
  }

  const radiusX = shape.kind === "circle" ? shape.r : shape.rx;
  const radiusY = shape.kind === "circle" ? shape.r : shape.ry;
  let farthest = 0;
  for (let step = 0; step < 256; step += 1) {
    const angle = (step / 256) * Math.PI * 2;
    const x = shape.cx + radiusX * Math.cos(angle);
    const y = shape.cy + radiusY * Math.sin(angle);
    farthest = Math.max(farthest, Math.hypot(x - centre.x, y - centre.y));
  }
  return farthest;
}
