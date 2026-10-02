/**
 * The Windows icon, packed from the PNGs the rest of the application draws.
 *
 * Windows asks a program for its icon in a format of its own, which is a small
 * directory of images rather than a single picture: the shell draws a 16px one
 * in a list of files and a 256px one in the task switcher, and it picks from
 * what the file holds rather than scaling what it finds. So the mark is rendered
 * at each of those sizes from the favicon - the same source every other icon of
 * this application comes from - and packed here.
 *
 * The packing is the whole of this module, and it is arithmetic on byte offsets:
 * a header, one entry per image, then the images. An image inside an ICO may be
 * a PNG, which is what a Windows version new enough to run Electron reads, so
 * the bytes the renderer already produces are stored as they are rather than
 * re-encoded into the older uncompressed form.
 *
 * Plain module, no file system and no Electron: the script writes the file, the
 * tests read the bytes.
 */

/**
 * The sizes a Windows icon carries.
 *
 * A small one per size Windows really draws, rather than only the largest: the
 * shell takes the size it needs when the file has it, and a 256px mark squeezed
 * into a 16px slot is a smudge rather than a smaller icon. 256 is the largest
 * the format can name, and it is where the directory stores a zero: the width
 * and the height are single bytes, so 256 is written as 0.
 */
export const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

/** The number of bytes one entry in the directory takes. */
const ENTRY_BYTES = 16;

/**
 * An ICO file, from the images it should hold.
 *
 * Each image is `{ size, png }` and is stored as it is given, so the caller
 * decides what the mark looks like and this decides only how Windows is told
 * about it. The sizes are checked rather than trusted because the directory
 * cannot describe anything outside one byte: an image of 300px written as a byte
 * arrives as 44px, and an icon that is quietly the wrong size is worse than a
 * build that stops.
 */
export function encodeIco(images) {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("ico: an icon file holds at least one image");
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1: an icon rather than a cursor
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * ENTRY_BYTES;
  const entries = images.map(({ size, png }) => {
    if (!Number.isInteger(size) || size < 1 || size > 256) {
      throw new Error(`ico: ${size} is not a size this format can name`);
    }
    if (!Buffer.isBuffer(png) || png.length === 0) {
      throw new Error(`ico: the ${size}px image carries no bytes`);
    }

    const entry = Buffer.alloc(ENTRY_BYTES);
    // 256 does not fit in the byte the width and the height are written in, and
    // the format says a zero stands for it.
    entry[0] = size === 256 ? 0 : size;
    entry[1] = size === 256 ? 0 : size;
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel, which a PNG always says
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}
