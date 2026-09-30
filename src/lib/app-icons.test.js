import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { inflateSync } from "node:zlib";
import {
  FAVICON_FILE,
  ICON_TARGETS,
  SAFE_ZONE_REACH,
  SOCIAL_CARD,
  readFaviconScene,
  renderIcon,
  renderSocialCard,
  safeZoneInset,
  safeZoneReach,
} from "./app-icons.js";

// The icons are what an installed app shows on a home screen, and they are the
// one piece of art nobody opens in a browser to look at. These tests hold the
// link between them and the favicon: they are drawn from that file, at the
// sizes an installer asks for, and a favicon that moves past what a launcher
// keeps is caught here rather than on somebody's phone.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const favicon = readFileSync(path.join(ROOT, FAVICON_FILE), "utf8");
const manifest = JSON.parse(readFileSync(path.join(ROOT, "public", "manifest.json"), "utf8"));

/** The width and height a PNG declares in its header. */
function pngSize(buffer) {
  assert.equal(buffer.subarray(0, 8).toString("binary"), "\u0089PNG\r\n\u001a\n", "a PNG signature");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "IHDR", "the first chunk is the header");
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

/**
 * One pixel of a PNG these tests draw.
 *
 * The reader is short because the writer is: every row is written with filter
 * 0, so the bytes after the filter byte are the pixel itself and there is
 * nothing to unwind. It is here so a test can say what the picture looks like
 * rather than only how large it is.
 */
function pixelAt(buffer, x, y) {
  const [width] = pngSize(buffer);
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    chunks.push({ type, data: buffer.subarray(offset + 8, offset + 8 + length) });
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(chunks.filter((chunk) => chunk.type === "IDAT").map((chunk) => chunk.data)));
  const start = y * (width * 4 + 1) + 1 + x * 4;
  return [raw[start], raw[start + 1], raw[start + 2], raw[start + 3]];
}

test("each icon is drawn at the size an installer asks for", () => {
  const scene = readFaviconScene(favicon);

  for (const target of ICON_TARGETS) {
    const [width, height] = pngSize(renderIcon(scene, target));
    assert.equal(width, target.size, `${target.file}: width`);
    assert.equal(height, target.size, `${target.file}: height`);
  }

  // The three an install needs: a launcher icon, a large one, and the touch icon.
  assert.ok(ICON_TARGETS.some((target) => target.size === 192), "a 192px icon");
  assert.ok(
    ICON_TARGETS.some((target) => target.size === 512 && !target.bleed),
    "a 512px icon with the favicon's own corners"
  );
  assert.ok(
    ICON_TARGETS.some((target) => target.file === "apple-touch-icon.png" && target.size === 180),
    "a 180px touch icon"
  );
});

test("the icons on disk are the ones the favicon draws today", () => {
  const scene = readFaviconScene(favicon);

  for (const target of ICON_TARGETS) {
    const onDisk = readFileSync(path.join(ROOT, "public", target.file));
    assert.ok(
      onDisk.equals(renderIcon(scene, target)),
      `public/${target.file} is not what ${FAVICON_FILE} draws: run npm run icons`
    );
  }
});

test("the manifest declares every icon that is generated, and no other", () => {
  // The two lists are the same list: an icon added here without being declared
  // is a file nobody downloads, and one declared without being generated is a
  // broken image on a home screen.
  const declared = manifest.icons
    .map((icon) => icon.src)
    .filter((src) => src.endsWith(".png"))
    .sort();
  assert.deepEqual(declared, ICON_TARGETS.map((target) => target.file).sort());

  // Named from the manifest itself, not from the root of the domain: a project
  // site on GitHub Pages is served under /<repository>/, and an icon written
  // "/icon-192.png" would send the installer to the wrong place.
  assert.ok(
    declared.every((src) => !src.startsWith("/")),
    "an icon is named relative to the manifest, so it is found under any path"
  );
});

test("the favicon decides the drawing, not the script", () => {
  const before = renderIcon(readFaviconScene(favicon), ICON_TARGETS[0]);

  // One colour changed in the favicon has to change the icon: if it did not,
  // the script would be drawing a copy of the mark and quietly drifting from it.
  const recoloured = favicon.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="#FF00FF"');
  assert.notEqual(recoloured, favicon, "the favicon paints with at least one flat colour");

  const after = renderIcon(readFaviconScene(recoloured), ICON_TARGETS[0]);
  assert.ok(!before.equals(after), "a colour changed in the favicon changes the icon");
});

test("the maskable mark stays inside the circle a launcher keeps", () => {
  const scene = readFaviconScene(favicon);
  const reach = safeZoneReach(scene);
  assert.ok(reach > 0, "the favicon has a mark to measure");

  // However large the mark is drawn in the favicon, the icon that has to
  // survive a launcher crop pulls it back inside the guaranteed visible circle.
  assert.ok(
    safeZoneInset(scene) * reach <= SAFE_ZONE_REACH + 1e-9,
    `the mark still reaches ${(safeZoneInset(scene) * reach * 100).toFixed(1)}% once the maskable icon is drawn`
  );

  // A mark that already fits is left at the scale the favicon drew it.
  const small = readFaviconScene('<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="9" fill="#E3A72E" /></svg>');
  assert.ok(safeZoneReach(small) <= SAFE_ZONE_REACH, "the fixture fits");
  assert.equal(safeZoneInset(small), 1);
});

test("a favicon the renderer cannot draw fails loudly, naming what it found", () => {
  // The alternative is the failure that matters: a shape silently left out of
  // the icon, which nobody sees until it is on a phone.
  assert.throws(() => readFaviconScene('<svg viewBox="0 0 64 64"><path d="M0 0" fill="#ffffff" /></svg>'), /<path>/);
  assert.throws(() => readFaviconScene('<svg viewBox="0 0 64 64"><rect width="64" height="64" /></svg>'), /fill/);
  assert.throws(
    () => readFaviconScene('<svg viewBox="0 0 32 64"><rect width="32" height="64" fill="#ffffff" /></svg>'),
    /square/
  );
  assert.throws(
    () => readFaviconScene('<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="url(#sky)" /></svg>'),
    /hex colour/
  );
  assert.throws(() => readFaviconScene("<svg><rect /></svg>"), /viewBox/);
  assert.throws(() => readFaviconScene('<svg viewBox="0 0 64 64"></svg>'), /draws nothing/);
});

test("the link preview is a landscape, drawn from the same mark", () => {
  const scene = readFaviconScene(favicon);
  const card = renderSocialCard(scene);

  // A link preview is wide: a square one is cropped to a strip by every feed
  // that shows it, which cuts the mark in half.
  const [width, height] = pngSize(card);
  assert.equal(width, SOCIAL_CARD.width);
  assert.equal(height, SOCIAL_CARD.height);
  assert.ok(width > height * 1.5, `the card is ${width}x${height}, which is not a landscape`);

  // And it is the favicon that draws it. The sky and the ground span the whole
  // favicon, so they are stretched to the edges of the card; the mark between
  // them keeps its shape and rests on the horizon.
  assert.deepEqual(pixelAt(card, 2, 2), [0x2a, 0x1a, 0x0f, 255], "the sky reaches the top left corner");
  assert.deepEqual(pixelAt(card, 2, height - 3), [0x2f, 0x7d, 0x4f, 255], "the ground reaches the bottom left corner");
  // The horizon is where the favicon puts it, which is what stretching the
  // ground - rather than scaling the whole drawing - is for.
  const horizon = Math.round((42 / 64) * height);
  assert.deepEqual(pixelAt(card, 100, horizon - 2), [0x2a, 0x1a, 0x0f, 255], "the sky stops at the horizon");
  assert.deepEqual(pixelAt(card, 100, horizon + 2), [0x2f, 0x7d, 0x4f, 255], "and the ground begins there");

  // The mark is not stretched with the bands: its trunk is still a thin upright
  // rectangle at the centre, and the sun is still round behind it.
  assert.deepEqual(pixelAt(card, width / 2, height / 2), [0x1c, 0x11, 0x09, 255], "the mark is at the centre");
  assert.deepEqual(pixelAt(card, width / 2, 274), [0xe3, 0xa7, 0x2e, 255], "the sun is behind it");

  // The committed file is that drawing, so the picture a shared link shows can
  // never be a copy of a mark the app has since changed.
  const onDisk = readFileSync(path.join(ROOT, "public", SOCIAL_CARD.file));
  assert.ok(onDisk.equals(card), `public/${SOCIAL_CARD.file} is not what ${FAVICON_FILE} draws: run npm run icons`);

  const recoloured = readFaviconScene(favicon.replace(/fill="#[0-9a-fA-F]{6}"/, 'fill="#FF00FF"'));
  assert.ok(!renderSocialCard(recoloured).equals(card), "a colour changed in the favicon changes the card");
});

test("the icons are regenerated by a script the verification runs", () => {
  const { scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(scripts.icons, /generate-icons\.mjs/, "package.json registers the icon script");

  const script = readFileSync(path.join(ROOT, "scripts", "generate-icons.mjs"), "utf8");
  assert.match(script, /FAVICON_FILE/, "the script draws the favicon itself, not a copy of it");
  assert.match(script, /app-icons\.js/, "and it shares the rasteriser the tests use");
  assert.match(script, /renderSocialCard/, "it writes the link preview as well as the icons");

  // The verification compares the committed icons with the favicon instead of
  // trusting them, and writes nothing while it does.
  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.match(verify, /generate-icons\.mjs/, "npm run verify checks the icons");
  assert.match(verify, /--check/, "in check mode, which only reports");
});
