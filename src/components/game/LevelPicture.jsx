import { CARD_WIDTH, LIGHT_WIDTH, avifPath, cardPath, thumbPath, webpPath } from "@/lib/photo-formats.js";
import { hideBrokenImage } from "@/lib/utils";
// Where the third format is decided. It comes from the brief of the game and
// not from the photograph table, so drawing a picture never drags the whole
// gallery onto the first screen.
import { AVIF_PHOTOS, CARD_PHOTOS } from "./level-summary";

/**
 * A level photograph, offered in the lightest format the browser can read.
 *
 * Every picture ships as a JPEG with a WebP written beside it by
 * scripts/optimize-photos.mjs, and some of them with an AVIF in front of that.
 * Each is smaller than the one behind it, which on a school connection is the
 * difference between a picture arriving and a reader waiting for it, so they are
 * offered lightest first and the JPEG is left for a browser that reads neither.
 * All of them are labelled by type and the browser picks, so nothing here has to
 * guess what the reader's device can decode.
 *
 * The AVIF is not offered for every picture, and that is not an oversight: at
 * the size these are drawn it is not always the smaller file, so the table
 * records which ones have one, through the fingerprint of the file, and
 * AVIF_PHOTOS answers for the rest. A source
 * pointing at a file that is not there would not fall back to the WebP behind
 * it - the browser would simply show nothing - so the two have to agree.
 *
 * `thumb` draws the small copy of the picture instead: the same photograph,
 * written for a screen that lists it rather than one that opens it, which is
 * what the credits screen does with sixty of them at once. There is one
 * thumbnail for every picture and no AVIF of it, because at a hundred and sixty
 * pixels the third format measures heavier than the WebP it would stand in
 * front of; so a single source is offered, and the JPEG behind it for a browser
 * that reads no WebP. The caller asks for a thumbnail rather than this component
 * guessing from the size it is given: a band and a thumbnail can be drawn the
 * same width, and only the caller knows which of the two the reader is looking
 * at.
 *
 * `card` draws a picture at the size a card of the map shows it. The map draws
 * twenty of them and they are the first screen a reader downloads, so for those
 * the small copy written at four hundred and eighty pixels is offered as a
 * candidate beside the light version at six hundred and forty, with `sizes`
 * saying how wide the card is: a browser of one pixel density takes the smaller
 * file and one of two takes the larger, so the screen that was already being
 * served a sharp picture still is and the other one stops paying for pixels it
 * never shows. `sizes` is the caller's to give, because only the caller knows
 * how wide its card is drawn; without it the browser assumes the full width of
 * the window, which is the safe answer rather than the cheap one.
 *
 * The wrapper is given no classes of its own, on purpose. A photograph that
 * fills a band is positioned against the band rather than against this element,
 * and one laid out inline keeps the width it is given either way, so wrapping
 * changes no layout; giving the wrapper a class is the one way to break that.
 */
// The width is given a default of null rather than being left out, which is
// what makes it an optional prop: a caller that draws a band or a thumbnail says
// nothing about a width, and the default is the answer "nothing was said",
// which React turns into an attribute that is not there at all.
export default function LevelPicture({ src, className, thumb = false, card = false, sizes = null, ...rest }) {
  const hasCard = card && CARD_PHOTOS.has(src);

  return (
    <picture>
      {thumb ? (
        <source srcSet={thumbPath(src)} type="image/webp" />
      ) : (
        <>
          {AVIF_PHOTOS.has(src) && <source srcSet={avifPath(src)} type="image/avif" />}
          {hasCard ? (
            <source
              srcSet={`${cardPath(src)} ${CARD_WIDTH}w, ${webpPath(src)} ${LIGHT_WIDTH}w`}
              sizes={sizes}
              type="image/webp"
            />
          ) : (
            <source srcSet={webpPath(src)} type="image/webp" />
          )}
        </>
      )}
      <img src={src} className={className} decoding="async" onError={hideBrokenImage} {...rest} />
    </picture>
  );
}
