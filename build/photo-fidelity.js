/**
 * How the third format is decided: the fidelity rule, and the numbers it uses.
 *
 * A photograph of a level ships as a JPEG, as a WebP that a browser really
 * draws, and - where it earns its place - as an AVIF in front of that one. The
 * AVIF does not replace the WebP by being smaller: at the size these are drawn,
 * five hundred to six hundred and forty pixels across, AV1 pays for its headers
 * more than it saves, and on part of the gallery the WebP is already the lighter
 * file. So the two are measured against each other, over the same pixels, in
 * decibels, and the AVIF is written only where it reaches at least the fidelity
 * of the WebP it would stand in front of, at the cheapest quality that does, and
 * where it is also lighter by enough to be worth a third copy of the picture.
 *
 * The rule is Python because it needs an image codec: it encodes, decodes and
 * compares pixels, and Node ships nothing that can read an AVIF. It lives here
 * rather than inside the script that runs it so the tests can *measure* the rule
 * the script decides with, on a picture of their own, instead of reading it as
 * text and agreeing with it. A rule copied into a test is a test of the copy:
 * the day somebody loosens the comparison, the copy fails to notice.
 *
 * The numbers are here for the same reason, and the two that describe the bar
 * matter as much as the ladder: an AVIF is held to the WebP the application
 * draws, so the quality that WebP is written at is part of the rule. Lighter,
 * and the AVIF would be at least as faithful as a worse picture.
 *
 * Plain module: it holds numbers and source, and touches nothing but the
 * interpreter it looks for, which it only asks about.
 */
import { spawnSync } from "node:child_process";

/**
 * The qualities an AVIF is tried at, cheapest first.
 *
 * The AVIF does not have to match a quality setting, it has to match a result:
 * the walk stops at the first one that is at least as faithful as the WebP, so a
 * picture the WebP handles badly gets an AVIF far down this list and one it
 * already handles well gets none at all.
 */
export const AVIF_QUALITY_LADDER = [40, 45, 50, 55, 60, 65, 70];

/** Encoder effort: the middle of the scale, where the bytes spent stop buying size. */
export const AVIF_SPEED = 6;

/**
 * How much lighter an AVIF has to be to replace a WebP.
 *
 * A third file in the repository, and a second one in the browser's cache, has
 * to buy something: saving a few hundred bytes would be a cost with no benefit.
 */
export const AVIF_WORTH_IT = 0.95;

/**
 * The quality the WebP is written at, and the effort spent on it.
 *
 * This is the bar every AVIF is held to, so it belongs beside the rule rather
 * than with the sizes: it is what the candidate is measured against, and the
 * tests write their own WebP at exactly this quality so that what they measure
 * is what the gallery was decided with.
 */
export const LIGHT_QUALITY = 70;
export const WEBP_METHOD = 6;

/**
 * The rule itself, as the program the interpreter is given.
 *
 * It expects to be handed two things: the exact pixels an encoder was given, and
 * what that encoder produced. Everything is measured against those pixels and
 * not against the original file, so the numbers mean the same thing whichever
 * format is being judged.
 *
 * The imports are written here rather than assumed from the caller, because this
 * fragment is also run on its own: a test that has to assemble the imports a
 * rule needs is a test that can quietly assemble the wrong rule.
 */
export const FIDELITY_PROGRAM = String.raw`
import io, math
from PIL import Image, ImageChops, ImageStat

def psnr(one, other):
    """How far one image is from another, in decibels.

    Both light versions are measured against the same reference - the exact
    pixels their encoder was given - so the two numbers mean the same thing.
    """
    difference = ImageChops.difference(one.convert("RGB"), other.convert("RGB"))
    stats = ImageStat.Stat(difference)
    mse = sum(value * value for value in stats.rms) / len(stats.rms)
    return float("inf") if mse == 0 else 10 * math.log10(255 * 255 / mse)

def choose_avif(light, webp_data, ladder, speed, worth_it):
    """The cheapest AVIF that is at least as faithful as the WebP, or None.

    A quality is accepted on two counts: it has to reach the fidelity of the
    WebP that would otherwise be drawn, and the file it produces has to be
    lighter by enough to be worth a third copy of the picture.
    """
    with Image.open(io.BytesIO(webp_data)) as decoded:
        webp = decoded.convert("RGB")
    if webp.size != light.size:
        webp = webp.resize(light.size, Image.LANCZOS)
    wanted = psnr(light, webp)

    for quality in ladder:
        buffer = io.BytesIO()
        light.save(buffer, "AVIF", quality=quality, speed=speed)
        candidate = buffer.getvalue()
        with Image.open(io.BytesIO(candidate)) as decoded:
            gain = psnr(light, decoded.convert("RGB")) - wanted
        if gain >= 0:
            return {
                "quality": quality,
                "bytes": len(candidate),
                "gain": round(gain, 2),
                "webp_bytes": len(webp_data),
                "worth_it": len(candidate) < len(webp_data) * worth_it,
                "data": candidate,
            }
    return None
`;

/**
 * First interpreter on this machine that really has Pillow installed.
 *
 * The script and the tests ask the same question about the same machine, and
 * answering it twice would be two answers that can disagree: a test that skips
 * itself for want of a library the script is happily using is a test nobody
 * trusts, and the other way round is a failure nobody can explain.
 */
export function findPython() {
  for (const candidate of ["python3", "python", "py"]) {
    const probe = spawnSync(candidate, ["-c", "import PIL"], { stdio: "ignore" });
    if (probe.status === 0) return candidate;
  }
  return null;
}
