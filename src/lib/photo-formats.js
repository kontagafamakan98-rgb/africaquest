/**
 * The files one level photograph is served in.
 *
 * Each picture exists in public/photos as the JPEG that was downloaded and
 * re-encoded, a WebP written beside it by scripts/optimize-photos.mjs, and - for
 * the pictures where it is worth it - an AVIF beside that. The light ones are
 * what a browser draws, and each is smaller than the one it stands in front of,
 * which on a school connection is the difference between a picture arriving and
 * a reader waiting for it. The JPEG is what `<picture>` keeps for a browser that
 * can read neither.
 *
 * The AVIF is not written for every picture, on purpose. At the size these are
 * drawn - five hundred to six hundred and forty pixels across - AV1 pays for its
 * headers more than it saves, so on some of the gallery the WebP is already the
 * smaller file. scripts/optimize-photos.mjs measures both against the same
 * pixels and only keeps an AVIF that is at least as faithful and lighter; the
 * fingerprint recorded for it in the table is what tells the application that
 * this particular picture has one, so no list of names is kept twice.
 *
 * The later names are derived from the first rather than written a second time
 * in the table, because the three files are one picture: a photograph cannot end
 * up with a drawing and no light version, or the other way round. The table
 * stays about the photographs; this stays about their names.
 *
 * It rewrites the extension and nothing else, so a path the application already
 * prepared for the address it is served from comes out prepared in the same way.
 * An address that names a scheme, such as the Wikimedia Commons page a picture
 * was found on, is somebody else's file and is handed back untouched: renaming
 * one of those would ask a stranger's server for a picture that does not exist
 * there.
 */

/**
 * The two widths a card of the map may be drawn from, in pixels.
 *
 * A card is three hundred and fifty eight pixels wide on a phone, and the two
 * files offered for it are written at these sizes: the small copy, which is what
 * a screen of one pixel density asks for, and the light version, which is what a
 * screen of two asks for. They are named here rather than in the component that
 * offers them, because they are facts about the files and not about a screen.
 * The light version is six hundred and forty across because a card is drawn from
 * a banner, and a banner is written at that size (see scripts/optimize-photos.mjs).
 */
export const CARD_WIDTH = 480;
export const LIGHT_WIDTH = 640;

/** The light version of a photograph of ours, drawn by every current browser. */
export function webpPath(jpegPath) {
  const path = String(jpegPath);
  // A scheme means the address leaves this site, and its files are not ours.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return /\.jpe?g$/i.test(path) ? path.replace(/\.jpe?g$/i, ".webp") : path;
}

/**
 * The lighter version, where one was written: the smallest of the three.
 *
 * Whether it exists is not answered here but by the table, because it is a fact
 * about the shipped gallery rather than about a name. Asking a browser for an
 * AVIF that is not there would not fall back to the WebP beside it - it would
 * simply show no picture at all - so a caller has to know.
 */
export function avifPath(jpegPath) {
  const path = String(jpegPath);
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return /\.jpe?g$/i.test(path) ? path.replace(/\.jpe?g$/i, ".avif") : path;
}

/**
 * The small copy of a photograph: what a list of credits draws beside a name.
 *
 * It is written for the size it is drawn at, a couple of hundred pixels across,
 * by the same script that prepares every other file of a photograph. Unlike the
 * AVIF it is not a decision: every photograph has one, because the screen that
 * lists the gallery would otherwise download sixty pictures at the size of a
 * lesson page to show them as thumbnails.
 *
 * It is a WebP and nothing else. At this size the WebP is already the lighter
 * file - about two to four kilobytes - and an AVIF carries a header that costs
 * more than the pixels it saves: measured on the gallery, the third format came
 * out heavier than the WebP it would stand in front of, every time. A file that
 * saves nothing is a second file to keep, ship and pin, so none is written.
 *
 * The browser that reads it is the browser that draws the game: the one thing
 * behind it is the photograph itself, which ships as a JPEG like every other, so
 * a browser that reads no WebP is still shown the picture rather than a hole.
 */
/**
 * The copy of a photograph written for the cards of the map.
 *
 * The map draws twenty-six cards, one picture each, three hundred and fifty eight
 * pixels wide on a phone, and those twenty-six pictures are the first screen a
 * reader downloads. The light version of the same picture is six hundred and
 * forty across, which is what a screen of doubled pixel density asks for and
 * twice what a screen of one density needs: this is that fourth hundred and
 * eighty pixels wide copy, offered to the browser as a candidate rather than as
 * a replacement, so a sharper screen still receives the sharper file.
 *
 * It is written for the pictures a card is drawn from, which is the first
 * photograph of each level, and in WebP alone: at this size the AVIF's header
 * costs more than its pixels save, exactly as it does for a thumbnail.
 */
export function cardPath(jpegPath) {
  const path = String(jpegPath);
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return /\.jpe?g$/i.test(path) ? path.replace(/\.jpe?g$/i, "-card.webp") : path;
}

export function thumbPath(jpegPath) {
  const path = String(jpegPath);
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return /\.jpe?g$/i.test(path) ? path.replace(/\.jpe?g$/i, "-thumb.webp") : path;
}
