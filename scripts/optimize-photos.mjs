/**
 * Prepares the level photographs: a re-encoded JPEG, and the light WebP drawn
 * beside it.
 *
 *   node scripts/optimize-photos.mjs            # rewrites public/photos
 *   node scripts/optimize-photos.mjs --check     # measures, writes nothing
 *   node scripts/optimize-photos.mjs --light     # writes only the light versions
 *   node scripts/optimize-photos.mjs --avif      # writes only the third format
 *
 * --light is for the day the JPEGs are already right: adopting WebP for a
 * gallery that predates it, or tuning the light version without paying for it
 * with another generation of JPEG re-encoding. It leaves every JPEG exactly as
 * it is, so the fingerprints recorded for them stay true. The thumbnails are
 * written with it, since they are the same decision at another size.
 *
 * --avif is for the day the two files are already right and only the third
 * format is wanted: it leaves both of them exactly as they are, so the
 * fingerprints recorded for them stay true as well.
 *
 * Run it after scripts/fetch-photos.mjs, which downloads the originals at the
 * size their source offers. Those originals are made for an archive, not for a
 * phone: the gallery weighed almost seven megabytes, which is a slow install on
 * a school connection and a needless cost on a data plan.
 *
 * The two kinds of picture in a level are treated differently, because they are
 * looked at differently, and the difference is the whole point of this script.
 *
 * A gallery picture opens in the lesson at nearly the full width of a phone.
 * Its source is only five hundred pixels wide, so it is already stretched on a
 * phone with doubled pixels: taking a single pixel away from it would be the
 * one change a reader could actually see. It is therefore re-encoded, never
 * resized. Writing it at quality eighty beside its own original is invisible,
 * around thirty-seven decibels of difference over the area that is drawn.
 *
 * A banner is the first picture of a level, the one behind the title on the
 * home screen and above the quiz. It is only ever drawn as a wide band, about
 * twice as wide as it is tall, under a dark overlay. A portrait photograph of
 * nine hundred by fourteen hundred pixels therefore hides more than half of
 * itself behind that crop, every time it is shown. Keeping those rows was the
 * single heaviest thing in the gallery. The script crops them away first, then
 * fits what is left to the width a doubled phone screen draws. The result is
 * both lighter and sharper than a plain resize of the whole picture, which had
 * to throw the same rows away on every level card while still storing them.
 *
 * Beside each of those JPEGs the script writes a WebP of the same picture. It
 * is what the application actually draws, through `<picture>`, and it weighs
 * about forty per cent less than the JPEG it was made from: on a phone, that is
 * the difference between a picture arriving on a slow connection and a reader
 * waiting for it. The JPEG stays as the fallback a browser without WebP reads.
 * Because the light version is drawn rather than optional, this script treats
 * one that is missing, or one that came out no lighter than its JPEG, as a
 * failure: the gallery would be heavier and worse for nothing.
 *
 * A third format now sits in front of the WebP where - and only where - it earns
 * its place. AVIF carries the same picture in fewer bytes than WebP at the same
 * fidelity, but at the size these are drawn, five hundred to six hundred and
 * forty pixels across, AV1 pays for its headers more than it saves, and on part
 * of the gallery the WebP is already the smaller file.
 *
 * So the two are measured against each other rather than assumed. The AVIF is
 * encoded at the lowest quality at which it is at least as faithful as the WebP
 * that would otherwise be drawn - the same pixels, the same decibels - and is
 * written only when it also weighs at least a twentieth less. Where it does not,
 * nothing is written, and a stale AVIF from an earlier run is taken away: what
 * ships is what this rule decided, not what a previous run left behind.
 *
 * A fourth file is written for every picture: the thumbnail the list of credits
 * draws beside a name, at the size that screen really shows it. It is the same
 * picture out of the same encoder at the same quality, only smaller, so it is
 * written here rather than by a script or a tool of its own. It is WebP alone,
 * and that is a measurement: at a hundred and sixty pixels the AVIF's header
 * costs more than its pixels save, so it came out heavier than the WebP it would
 * stand in front of every time the two were weighed. Like the light version it
 * is required rather than hoped for - one that is missing, or one no lighter
 * than the picture it stands for, stops the run.
 *
 * --check does not re-run that measurement, which would cost a minute and a
 * half on every build; it reads the files on disk and refuses an AVIF that is
 * not lighter than the WebP it stands in front of. The fidelity behind that
 * weight is measured by the tests instead, on one witness picture of their own,
 * through the same code this script runs: half a second of the verification
 * rather than a minute and a half of it, and nobody has to trust a rule nobody
 * measured.
 *
 * The pixels are handled by Pillow, through whichever Python interpreter the
 * machine already has. Node ships no image codec, and pulling a native encoder
 * into a static site build would cost more than it saves; the script says so
 * plainly when Pillow is missing rather than failing halfway through.
 *
 * Meant to be run once on freshly downloaded files. Running it twice re-encodes
 * an already re-encoded JPEG, which costs a little quality for no real saving.
 *
 * The light versions are written for the size a phone draws them at rather than
 * for the size of the JPEG: a banner is a band on a screen about four hundred
 * pixels wide, so the light one is capped at what a denser screen asks for,
 * while a gallery picture already fits and is encoded as it stands.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AVIF_QUALITY_LADDER,
  AVIF_SPEED,
  AVIF_WORTH_IT,
  FIDELITY_PROGRAM,
  LIGHT_QUALITY,
  WEBP_METHOD,
  findPython,
} from "../build/photo-fidelity.js";
import { LEVEL_GALLERIES, LEVEL_PHOTOS } from "../src/lib/level-images.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Banner width, in pixels, and the shape it is drawn in.
 *
 * A level card band is drawn 150 to 208 pixels tall across the width of a
 * phone, so 840 is what a screen with a doubled pixel density asks for. Two
 * parts wide for one part tall is the shape every band in the game shares.
 */
const BANNER_LONG_EDGE = 840;
const BANNER_ASPECT = 2;
const QUALITY = 80;

/**
 * The light version, drawn on phones, and kept a separate decision.
 *
 * WebP carries a picture in fewer bytes than JPEG at the same quality, which is
 * most of the saving; the smaller banner is the rest, since a band on a phone
 * screen has no use for the width a desktop screen is given. The quality it is
 * written at is not a choice of this script's own - it is the bar every AVIF is
 * held to - so it lives beside that rule, in ../build/photo-fidelity.js.
 */
const LIGHT_BANNER_LONG_EDGE = 640;

/**
 * The small copy of a photograph, for the list of credits.
 *
 * That screen draws each picture as a thumbnail eighty pixels square, so a
 * screen with doubled pixels asks for a hundred and sixty across, and no more:
 * every extra pixel there is a byte downloaded sixty times over. The whole set
 * weighs about a hundred and sixty kilobytes, against two megabytes when the
 * screen was drawing the lesson versions.
 *
 * A thumbnail is written in WebP alone, and that is a measurement rather than a
 * shortcut. At this size the AVIF's header costs more than its pixels save: on
 * the gallery it came out heavier than the WebP it would stand in front of
 * every time the two were weighed, which is the same rule that leaves part of
 * the gallery without a third format.
 */
const THUMB_LONG_EDGE = 160;

const check = process.argv.includes("--check");
const lightOnly = process.argv.includes("--light");
const avifOnly = process.argv.includes("--avif");

/**
 * What Pillow runs: crop the banner to its band, re-encode, write back.
 *
 * The fidelity rule itself is not written here. It lives in
 * ../build/photo-fidelity.js, which the tests run as well, so that what decides
 * an AVIF is one piece of code rather than two that have to agree. What is here
 * is the rest of the work: which file is cropped, at which size it is written,
 * and where it goes.
 */
const PYTHON_PROGRAM = String.raw`
import io, json, os, sys
from PIL import Image
${FIDELITY_PROGRAM}
payload = json.load(sys.stdin)
quality = payload["quality"]
light_quality = payload["light_quality"]
webp_method = payload["webp_method"]
aspect = payload["banner_aspect"]
results = []

def fit(image, long_edge):
    """The picture at most long_edge across, or as it stands when it is smaller."""
    if long_edge <= 0:
        return image
    width, height = image.size
    scale = min(1.0, long_edge / max(width, height))
    if scale >= 1:
        return image
    return image.resize((max(1, round(width * scale)), max(1, round(height * scale))), Image.LANCZOS)

for item in payload["files"]:
    source, cap = item["path"], item["cap"]
    target = os.path.splitext(source)[0] + ".webp"
    third = os.path.splitext(source)[0] + ".avif"
    small = os.path.splitext(source)[0] + "-thumb.webp"
    before = os.path.getsize(source)
    light_before = os.path.getsize(target) if os.path.exists(target) else 0
    thumb_before = os.path.getsize(small) if os.path.exists(small) else 0
    with Image.open(source) as opened:
        image = opened.convert("RGB")
        width, height = image.size
        source_width, source_height = width, height
        # A banner is only ever drawn as a band: keep the full width, drop the
        # rows that the dark overlay covers on every screen. Both files are made
        # from this same crop, so the light one is the same picture.
        if item["banner"] and height * aspect > width:
            visible = round(width / aspect)
            top = (height - visible) // 2
            image = image.crop((0, top, width, top + visible))

        jpeg = fit(image, cap)
        buffer = io.BytesIO()
        # Progressive and optimised cost nothing to decode and shave a useful
        # slice off every file. The metadata is left out: the credit shown under
        # each picture comes from level-images.js, not from the file itself.
        jpeg.save(buffer, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=2)
        size = jpeg.size
        data = buffer.getvalue()

        light = fit(image, item["light_cap"])
        light_buffer = io.BytesIO()
        light.save(light_buffer, "WEBP", quality=light_quality, method=webp_method)
        light_size = light.size
        light_data = light_buffer.getvalue()

        # The thumbnail is the same picture for a screen that lists it small,
        # written by the same encoder at the same quality: only the size differs.
        # It is made from the picture the light version was made from, so the
        # list of credits shows the same crop a lesson does.
        thumb = fit(image, payload["thumb_edge"])
        thumb_buffer = io.BytesIO()
        thumb.save(thumb_buffer, "WEBP", quality=light_quality, method=webp_method)
        thumb_size = thumb.size
        thumb_data = thumb_buffer.getvalue()

    if payload["write_jpeg"]:
        temporary = source + ".optimized"
        with open(temporary, "wb") as handle:
            handle.write(data)
        os.replace(temporary, source)
    if payload["write_light"]:
        light_temporary = target + ".optimized"
        with open(light_temporary, "wb") as handle:
            handle.write(light_data)
        os.replace(light_temporary, target)
        thumb_temporary = small + ".optimized"
        with open(thumb_temporary, "wb") as handle:
            handle.write(thumb_data)
        os.replace(thumb_temporary, small)

    # What the AVIF has to beat is the WebP that will be on disk once this run is
    # over: the one it just produced when it is writing that file, and the one
    # already there when the two lighter formats are left alone.
    if payload["write_light"]:
        against = light_data
    elif os.path.exists(target):
        with open(target, "rb") as handle:
            against = handle.read()
    else:
        against = None

    avif = None
    if payload["write_avif"] and against:
        avif = choose_avif(light, against, payload["avif_ladder"], payload["avif_speed"], payload["avif_worth_it"])
        if avif and avif["worth_it"]:
            temporary = third + ".optimized"
            with open(temporary, "wb") as handle:
                handle.write(avif["data"])
            os.replace(temporary, third)
        elif os.path.exists(third):
            # Not lighter than the WebP any more: a file nobody draws is a file
            # the repository should not carry.
            os.remove(third)
    if avif:
        del avif["data"]

    results.append({
        "file": os.path.basename(source),
        "path": source,
        "webp_path": target,
        "banner": item["banner"],
        "before": before,
        "after": len(data),
        "light_before": light_before,
        "light_after": len(light_data),
        "thumb_path": small,
        "thumb_before": thumb_before,
        "thumb_after": len(thumb_data),
        "thumb_width": thumb_size[0],
        "thumb_height": thumb_size[1],
        "width": size[0],
        "height": size[1],
        "light_width": light_size[0],
        "light_height": light_size[1],
        "source_width": source_width,
        "source_height": source_height,
        "avif": avif,
    })
json.dump(results, sys.stdout)
`;

const megabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const python = findPython();
if (!python) {
  console.error(
    "optimize: no Python with Pillow on this machine.\n" +
      "Install it (python -m pip install Pillow) and run this again,\n" +
      "or keep the full size photographs and leave the gallery as it is."
  );
  process.exit(1);
}

// The banner of a level is its first photograph; the others only open in the
// lesson gallery, and the two are not drawn at the same size.
const bannerFiles = new Set(
  Object.values(LEVEL_GALLERIES).map((photos) => photos[0].file.replace(/^\//, ""))
);

const files = [];
for (const photo of LEVEL_PHOTOS) {
  const relative = photo.file.replace(/^\//, "");
  const full = path.join(ROOT, "public", relative);
  if (!existsSync(full)) {
    console.error(`optimize: ${photo.file} is missing. Run scripts/fetch-photos.mjs first.`);
    process.exit(1);
  }
  const banner = bannerFiles.has(relative);
  files.push({
    path: full.replace(/\\/g, "/"),
    banner,
    // A gallery picture keeps every pixel it has: zero means no cap at all.
    cap: banner ? BANNER_LONG_EDGE : 0,
    // The light version is drawn on a phone rather than on a desktop screen, so
    // its banner can be narrower; a gallery picture is already smaller than the
    // width it is shown at and keeps all of its pixels.
    light_cap: banner ? LIGHT_BANNER_LONG_EDGE : 0,
  });
}

const before = files.reduce((total, file) => total + statSync(file.path).size, 0);

const run = spawnSync(python, ["-c", PYTHON_PROGRAM], {
  input: JSON.stringify({
    files,
    quality: QUALITY,
    light_quality: LIGHT_QUALITY,
    webp_method: WEBP_METHOD,
    banner_aspect: BANNER_ASPECT,
    avif_ladder: AVIF_QUALITY_LADDER,
    avif_speed: AVIF_SPEED,
    avif_worth_it: AVIF_WORTH_IT,
    thumb_edge: THUMB_LONG_EDGE,
    // What gets written where: nothing at all in --check, only the file named on
    // the command line in --light or --avif, everything otherwise.
    write_jpeg: !check && !lightOnly && !avifOnly,
    write_light: !check && !avifOnly,
    write_avif: !check,
  }),
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});

if (run.status !== 0) {
  console.error("optimize: Pillow refused to run.\n" + (run.stderr || "").trim());
  process.exit(1);
}

let results;
try {
  results = JSON.parse(run.stdout);
} catch {
  console.error("optimize: the image writer said something unreadable.\n" + run.stdout);
  process.exit(1);
}

const after = results.reduce((total, file) => total + file.after, 0);
const saved = before === 0 ? 0 : Math.round((1 - after / before) * 100);
const banners = results.filter((file) => file.banner);
const gallery = results.filter((file) => !file.banner);
const sum = (list) => list.reduce((total, file) => total + file.after, 0);
const heaviest = (list) => Math.round(Math.max(...list.map((file) => file.after)) / 1024);
// The gallery keeps every pixel it has; the count is checked rather than
// assumed, so a future change to the caps cannot quietly shrink it.
const galleryResized = gallery.filter(
  (file) => file.width !== file.source_width || file.height !== file.source_height
);

// What is drawn where each photograph stands, read from disk rather than from
// what a fresh encode would have cost: these lines describe the gallery that
// ships. A picture is drawn as its AVIF where one was written, and as its WebP
// otherwise - never as the JPEG, which is only there for a browser that reads
// neither.
const drawn = results.map((file) => {
  const third = file.path.replace(/\.jpe?g$/i, ".avif");
  const avifBytes = existsSync(third) ? statSync(third).size : 0;
  const webpBytes = existsSync(file.webp_path) ? statSync(file.webp_path).size : 0;
  return {
    file: file.file,
    avifBytes,
    webpBytes,
    bytes: avifBytes > 0 ? avifBytes : webpBytes,
    thumbBytes: existsSync(file.thumb_path) ? statSync(file.thumb_path).size : 0,
    jpegBytes: statSync(file.path).size,
  };
});
const total = (list, pick) => list.reduce((sum, entry) => sum + pick(entry), 0);
const drawnBytes = total(drawn, (entry) => entry.bytes);
const jpegBytes = total(drawn, (entry) => entry.jpegBytes);
const drawnSaved = jpegBytes === 0 ? 0 : Math.round((1 - drawnBytes / jpegBytes) * 100);

// The AVIF only ever replaces the WebP where it beat it, so the two are counted
// apart: a photograph with no AVIF is one the WebP already wins on.
const withAvif = drawn.filter((entry) => entry.avifBytes > 0);
const avifBytes = total(withAvif, (entry) => entry.avifBytes);
const replacedBytes = total(withAvif, (entry) => entry.webpBytes);
const avifSaved = replacedBytes === 0 ? 0 : Math.round((1 - avifBytes / replacedBytes) * 100);
const qualities = results.map((file) => file.avif?.quality).filter((quality) => quality);

if (lightOnly) {
  console.log(`optimize: ${results.length} photographs, the JPEGs beside them were not touched`);
} else if (avifOnly) {
  console.log(`optimize: ${results.length} photographs, the JPEGs and the WebP beside them were not touched`);
} else {
  console.log(
    `optimize${check ? " (check)" : ""}: ${results.length} photographs, ` +
      `${megabytes(before)} to ${megabytes(after)} (${saved}% lighter)`
  );
  console.log(
    `  ${banners.length} banners cropped to their band: ${megabytes(sum(banners))}, ` +
      `heaviest ${heaviest(banners)} KB`
  );
  console.log(
    `  ${gallery.length} gallery pictures: ${megabytes(sum(gallery))}, ` +
      `heaviest ${heaviest(gallery)} KB, ` +
      `${galleryResized.length === 0 ? "all at their own resolution" : `${galleryResized.length} resized`}`
  );
}
console.log(
  `  ${drawn.length} light versions where each stands (WebP quality ${LIGHT_QUALITY}` +
    `${qualities.length > 0 ? `, AVIF quality ${Math.min(...qualities)} to ${Math.max(...qualities)}` : ""}): ` +
    `${megabytes(drawnBytes)} against ${megabytes(jpegBytes)} of JPEGs (${drawnSaved}% lighter on screen), ` +
    `heaviest ${Math.round(Math.max(...drawn.map((entry) => entry.bytes)) / 1024)} KB`
);
console.log(
  withAvif.length === 0
    ? `  no AVIF ships: at this size the WebP is already the smaller file for every picture`
    : `  ${withAvif.length} of ${drawn.length} also ship an AVIF: ${megabytes(avifBytes)} where the WebP weighed ` +
      `${megabytes(replacedBytes)} (${avifSaved}% lighter), heaviest ` +
      `${Math.round(Math.max(...withAvif.map((entry) => entry.avifBytes)) / 1024)} KB`
);
// The thumbnails are what the list of credits draws, so their weight is the
// weight of that screen: it is reported apart from the gallery, which a lesson
// opens at full width.
console.log(
  `  ${drawn.length} thumbnails for the list of credits (WebP, ${THUMB_LONG_EDGE} px on the long edge): ` +
    `${megabytes(total(drawn, (entry) => entry.thumbBytes))}, heaviest ` +
    `${Math.round(Math.max(...drawn.map((entry) => entry.thumbBytes)) / 1024)} KB`
);
if (!check && withAvif.length < drawn.length) {
  console.log(
    `  ${drawn.length - withAvif.length} keep the WebP: no AVIF at this size is both as faithful and lighter`
  );
}

// The light version is the file the application draws, so it is required rather
// than reported: one left out is a picture that never arrives, and one no
// lighter than its JPEG is a second download that saves nothing.
const missingLight = drawn.filter((entry) => entry.webpBytes === 0).map((entry) => entry.file);
const heavyLight = drawn
  .filter((entry) => entry.webpBytes > 0 && entry.webpBytes >= entry.jpegBytes)
  .map(
    (entry) =>
      `${entry.file} (${Math.round(entry.webpBytes / 1024)} KB against ${Math.round(entry.jpegBytes / 1024)} KB)`
  );

// A thumbnail is written for every photograph, so one that is missing is a hole
// in the list of credits, and one that is not lighter than the picture it stands
// for is a second download that saves nothing. Both are held to the same rule as
// the light versions: required, never hoped for.
const missingThumb = drawn.filter((entry) => entry.thumbBytes === 0).map((entry) => entry.file);
if (missingThumb.length > 0) {
  console.error(
    `optimize: ${missingThumb.length} photographs have no thumbnail: ` +
      `${missingThumb.slice(0, 5).join(", ")}${missingThumb.length > 5 ? ` and ${missingThumb.length - 5} more` : ""}.\n` +
      (check
        ? "Run node scripts/optimize-photos.mjs --light to write them."
        : "The WebP encoder did not write them; check what Pillow reported above.")
  );
  process.exit(1);
}

if (missingLight.length > 0) {
  console.error(
    `optimize: ${missingLight.length} photographs have no light version: ` +
      `${missingLight.slice(0, 5).join(", ")}${missingLight.length > 5 ? ` and ${missingLight.length - 5} more` : ""}.\n` +
      (check
        ? "Run node scripts/optimize-photos.mjs to write them."
        : "The WebP encoder did not write them; check what Pillow reported above.")
  );
  process.exit(1);
}

const heavyThumb = drawn
  .filter((entry) => entry.thumbBytes > 0 && entry.thumbBytes >= Math.min(entry.webpBytes || entry.jpegBytes, entry.jpegBytes))
  .map(
    (entry) =>
      `${entry.file} (${Math.round(entry.thumbBytes / 1024)} KB against ${Math.round(entry.jpegBytes / 1024)} KB)`
  );
if (heavyThumb.length > 0) {
  console.error(
    `optimize: ${heavyThumb.length} thumbnails are not lighter than the picture they stand for: ` +
      `${heavyThumb.slice(0, 5).join(", ")}.\n` +
      "Lower the thumbnail size, or drop the thumbnail altogether rather than ship a second download that saves nothing."
  );
  process.exit(1);
}
if (heavyLight.length > 0) {
  console.error(
    `optimize: ${heavyLight.length} light versions are not lighter than the JPEG they were made from: ` +
      `${heavyLight.slice(0, 5).join(", ")}.\n` +
      "Lower LIGHT_QUALITY, or drop the light version altogether rather than ship a second download that saves nothing."
  );
  process.exit(1);
}

// An AVIF is only ever written when it beat the WebP it stands in front of, so
// one that is not meaningfully lighter is a file left over from an earlier run:
// every browser that reads AVIF would draw it in front of the smaller WebP.
// What is checked is the weight; the fidelity behind it was measured when the
// file was made, and re-measuring the whole gallery here would cost a minute on
// every build. The rule itself is measured by src/lib/photo-fidelity.test.js, on
// one witness picture, which is what makes this half a shortcut rather than a
// hole.
const heavyAvif = withAvif
  .filter((entry) => entry.avifBytes >= entry.webpBytes * AVIF_WORTH_IT)
  .map(
    (entry) =>
      `${entry.file} (${Math.round(entry.avifBytes / 1024)} KB against ${Math.round(entry.webpBytes / 1024)} KB)`
  );

if (heavyAvif.length > 0) {
  console.error(
    `optimize: ${heavyAvif.length} AVIF are not lighter than the WebP they would replace: ` +
      `${heavyAvif.slice(0, 5).join(", ")}.\n` +
      "Run node scripts/optimize-photos.mjs --avif to decide them again, or delete them."
  );
  process.exit(1);
}

// The fingerprints in src/lib/level-images.js describe the bytes that were
// there before this run: whatever it just rewrote no longer matches them.
if (!check) {
  console.log(
    avifOnly
      ? "  the third format was decided again: run npm run photos:stamp to record their fingerprints"
      : lightOnly
        ? "  the light versions were written: run npm run photos:stamp to record their fingerprints"
        : "  the pictures were rewritten: run npm run photos:stamp to record the new fingerprints"
  );
}
