/**
 * The icon file, read back the way the Windows shell reads it.
 *
 * A packing mistake here is invisible: the file is written, the installer is
 * built, and the icon is simply missing on somebody's desktop. So the layout is
 * asserted byte by byte - the header, one entry per image with the offset the
 * image really sits at, and the largest size written as the zero the format asks
 * for - rather than only that something was produced.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ICO_SIZES, encodeIco } from "./icon.js";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Some bytes that look like a PNG, of a length only this size produces. */
const image = (size) => Buffer.concat([PNG_SIGNATURE, Buffer.alloc(size, size % 251)]);

test("the file opens with the signature and the number of images", () => {
  const ico = encodeIco([{ size: 16, png: image(3) }, { size: 32, png: image(5) }]);

  assert.equal(ico.readUInt16LE(0), 0, "the reserved word is not zero");
  assert.equal(ico.readUInt16LE(2), 1, "the file does not say it is an icon");
  assert.equal(ico.readUInt16LE(4), 2, "the directory does not count the images");
});

test("every entry says the size, the depth and where its image starts", () => {
  const images = ICO_SIZES.map((size) => ({ size, png: image(size) }));
  const ico = encodeIco(images);

  let at = 6 + images.length * 16;
  images.forEach(({ size, png }, index) => {
    const entry = 6 + index * 16;
    // 256 is the one size the single byte a width is written in cannot hold, and
    // the format writes it as a zero.
    const written = size === 256 ? 0 : size;
    assert.equal(ico[entry], written, `${size}px: the width is not ${written}`);
    assert.equal(ico[entry + 1], written, `${size}px: the height is not ${written}`);
    assert.equal(ico.readUInt16LE(entry + 4), 1, `${size}px: the colour planes`);
    assert.equal(ico.readUInt16LE(entry + 6), 32, `${size}px: the bit depth`);
    assert.equal(ico.readUInt32LE(entry + 8), png.length, `${size}px: the image's length`);
    assert.equal(ico.readUInt32LE(entry + 12), at, `${size}px: the image's offset`);
    assert.ok(ico.subarray(at, at + 8).equals(PNG_SIGNATURE), `${size}px: not a PNG where the entry points`);
    at += png.length;
  });

  assert.equal(ico.length, at, "the file carries bytes past the last image");
});

test("an icon that could not be read back is refused rather than written", () => {
  assert.throws(() => encodeIco([]), /at least one image/);
  assert.throws(() => encodeIco([{ size: 300, png: image(2) }]), /not a size/);
  assert.throws(() => encodeIco([{ size: 0, png: image(2) }]), /not a size/);
  assert.throws(() => encodeIco([{ size: 16, png: Buffer.alloc(0) }]), /no bytes/);
  assert.throws(() => encodeIco([{ size: 16, png: "not a buffer" }]), /no bytes/);
});
