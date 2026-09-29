import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  AVIF_QUALITY_LADDER,
  AVIF_SPEED,
  AVIF_WORTH_IT,
  FIDELITY_PROGRAM,
  LIGHT_QUALITY,
  WEBP_METHOD,
  findPython,
} from "../../build/photo-fidelity.js";

// The rule that decides the third format, measured rather than read.
//
// A photograph is offered as an AVIF only where the AVIF reaches the fidelity of
// the WebP it would stand in front of, at the cheapest quality that does, and
// where it is also light enough to be worth a third copy. The script checks the
// weight of what shipped, because re-measuring sixty pictures would cost a minute
// and a half on every build; what it does not check, nothing did. The rule behind
// the weight was held by a test that read `if gain >= 0` in the source and agreed
// with the words, which is a test of the words.
//
// So it is measured here, on one witness picture and through the very code the
// script runs, in half a second rather than a minute and a half. The witness is
// small on purpose and its detail is on purpose: noise and edges are what an
// encoder struggles with, so a cheap AVIF of it is genuinely less faithful, which
// is what gives the rule something to refuse. A flat witness has nothing to lose,
// and would decide nothing.
//
// What is asserted is the shape of the decision rather than the numbers: which
// quality the walk stops at is the encoder's business and changes with it, but
// that it stops on fidelity, that it refuses a lighter file that is less
// faithful, and that both halves have to hold, are this rule's business.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
/** Small enough to stay out of the way of every other test, big enough to decide. */
const WITNESS_SIZE = 96;
const WITNESS_SEED = 20260929;
/**
 * A ladder with one quality in it, far below the real one.
 *
 * The real walk starts at forty; this starts at five, where the AVIF is a
 * fraction of the size of the WebP and clearly not as faithful. It stands for
 * every candidate the rule has to say no to: a rule that only weighed files
 * would write this one and call it a saving.
 */
const TOO_CHEAP_LADDER = [5];

/** The Python program: one witness in, one decision and the numbers out. */
const PROGRAM = `
import io, json, random, sys, time
${FIDELITY_PROGRAM}

SIZE = ${WITNESS_SIZE}
SEED = ${WITNESS_SEED}
LADDER = ${JSON.stringify(AVIF_QUALITY_LADDER)}
TOO_CHEAP = ${JSON.stringify(TOO_CHEAP_LADDER)}
SPEED = ${AVIF_SPEED}
WORTH_IT = ${AVIF_WORTH_IT}
LIGHT_QUALITY = ${LIGHT_QUALITY}
WEBP_METHOD = ${WEBP_METHOD}

def witness(size, seed):
    """A small picture with real detail: a gradient, hard edges and noise.

    Encoders are measured on pictures like this rather than on flat ones: a flat
    picture has nothing to lose, so both formats land on nearly the same bytes
    and the comparison between them says nothing about either.
    """
    rng = random.Random(seed)
    pixels = []
    for y in range(size):
        for x in range(size):
            base = (x * 3 + y * 2) % 256
            if (x // 8 + y // 8) % 2 == 0:
                base = (base + 90) % 256
            pixels.append((base, (base * 2) // 3, (base // 3 + rng.randrange(-14, 15)) % 256))
    image = Image.new("RGB", (size, size))
    image.putdata(pixels)
    return image

def as_webp(image):
    """The file the application would draw, written the way the gallery is."""
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=LIGHT_QUALITY, method=WEBP_METHOD)
    return buffer.getvalue()

def psnr_of(image, data):
    with Image.open(io.BytesIO(data)) as decoded:
        return psnr(image, decoded.convert("RGB"))

def without_pixels(decision):
    """The decision, minus the bytes the script writes and a report never prints."""
    return None if decision is None else {key: value for key, value in decision.items() if key != "data"}

started = time.perf_counter()
picture = witness(SIZE, SEED)
webp = as_webp(picture)
with Image.open(io.BytesIO(webp)) as decoded:
    wanted = psnr(picture, decoded.convert("RGB"))

decided = choose_avif(picture, webp, LADDER, SPEED, WORTH_IT)
# The same picture, decided again with a bar so low that nothing lighter counts as
# worth carrying: the fidelity half is unchanged, and only the weight half moves.
stingy = choose_avif(picture, webp, LADDER, SPEED, 0.0001)

cheap_buffer = io.BytesIO()
picture.save(cheap_buffer, "AVIF", quality=TOO_CHEAP[0], speed=SPEED)
cheap = cheap_buffer.getvalue()

json.dump({
    "size": SIZE,
    "wanted": round(wanted, 3),
    "decided": without_pixels(decided),
    "stingy": without_pixels(stingy),
    "cheap": {"quality": TOO_CHEAP[0], "bytes": len(cheap), "psnr": round(psnr_of(picture, cheap), 3)},
    "cheap_accepted": choose_avif(picture, webp, TOO_CHEAP, SPEED, WORTH_IT) is not None,
    "elapsed_ms": round((time.perf_counter() - started) * 1000),
}, sys.stdout)
`;

test("the fidelity rule decides an AVIF, and it is measured rather than read", (t) => {
  const python = findPython();
  if (!python) {
    t.skip("no Python with Pillow on this machine: run python -m pip install Pillow");
    return;
  }

  const run = spawnSync(python, ["-c", PROGRAM], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    timeout: 60_000,
  });
  assert.equal(run.status, 0, `the rule refused to run:\n${(run.stderr || "").trim()}`);
  const result = JSON.parse(run.stdout);

  // What the witness is: a picture the encoders have to work at, so that a cheap
  // AVIF of it is measurably worse than the WebP. A flat witness would make
  // every number below infinite or identical, and the test would pass while
  // measuring nothing.
  assert.ok(Number.isFinite(result.wanted), "the witness is flat: nothing would be measured");
  assert.ok(result.wanted > 12, `the WebP of the witness is ${result.wanted} dB, which is not a picture`);
  assert.equal(result.size, WITNESS_SIZE);

  // The walk stops on fidelity. The AVIF that is written is at least as faithful
  // as the WebP it would stand in front of, and it is one of the qualities the
  // script offers, so the ladder and the rule agree about what is being tried.
  assert.ok(result.decided, "no quality of the ladder reached the WebP, which is not what the gallery shows");
  assert.ok(result.decided.gain >= 0, `the AVIF was accepted at ${result.decided.gain} dB below the WebP`);
  assert.ok(
    AVIF_QUALITY_LADDER.includes(result.decided.quality),
    `the AVIF was decided at quality ${result.decided.quality}, which is not one the script tries`
  );
  assert.ok(result.decided.gain < 3, `the walk went past the cheapest quality that reached: ${result.decided.gain} dB`);

  // And it is lighter by enough to be worth a third copy, which is the other
  // half of the same decision: the witness stands for the twenty-eight pictures
  // of the gallery that ship an AVIF at all.
  assert.equal(result.decided.worth_it, true, "the witness ships an AVIF and this one was not worth carrying");
  assert.ok(
    result.decided.bytes < result.decided.webp_bytes * AVIF_WORTH_IT,
    `the AVIF weighs ${result.decided.bytes} against ${result.decided.webp_bytes}`
  );

  // The two halves are separate rules, and neither is allowed to decide alone.
  // The same picture, with a bar so low that no saving counts as worth carrying,
  // is still as faithful and still refused on weight.
  assert.equal(result.stingy.quality, result.decided.quality, "the fidelity half moved when only the weight did");
  assert.equal(result.stingy.worth_it, false, "an AVIF that saves nothing was carried anyway");

  // The one thing that would make all of the above true for the wrong reason: a
  // rule that accepted whatever the encoder produced. This is the candidate it
  // has to say no to, and by weight alone it looks like the best one there is.
  assert.ok(result.cheap.bytes < result.decided.webp_bytes, `the cheap AVIF is not even lighter: ${result.cheap.bytes}`);
  assert.ok(
    result.cheap.psnr < result.wanted,
    `quality ${result.cheap.quality} already matches the WebP: the witness no longer shows the rule refusing`
  );
  assert.equal(result.cheap_accepted, false, "an AVIF lighter than the WebP but less faithful was accepted");

  // And it stays cheap. The gallery takes a minute and a half; this takes half a
  // second, which is why it can sit inside `npm run verify` where the whole
  // measurement cannot. A witness that grew into a real picture would fail here
  // rather than quietly slow every verification down.
  assert.ok(
    result.elapsed_ms < 4000,
    `the witness took ${result.elapsed_ms} ms: this belongs outside the verification`
  );
});

test("the script runs the rule this test measures, and does not keep a copy of it", () => {
  const script = readFileSync(path.join(ROOT, "scripts", "optimize-photos.mjs"), "utf8");
  const module = readFileSync(path.join(ROOT, "build", "photo-fidelity.js"), "utf8");

  // One rule, in one place: the script takes it, and the numbers with it, rather
  // than re-declaring them. A copy would pass this test on the day it was made
  // and disagree with the module on the day somebody changed one of the two.
  assert.match(script, /from "\.\.\/build\/photo-fidelity\.js"/, "the script does not use the shared rule");
  assert.match(module, /def psnr/, "the rule measures in decibels");
  assert.match(module, /def choose_avif/, "and chooses a quality from that measurement");
  assert.match(module, /if gain >= 0/, "accepting only a quality that reaches the WebP's fidelity");
  for (const constant of ["AVIF_QUALITY_LADDER", "AVIF_SPEED", "AVIF_WORTH_IT", "LIGHT_QUALITY", "WEBP_METHOD"]) {
    assert.match(module, new RegExp(`export const ${constant}\\b`), `${constant} is not declared in the module`);
    assert.doesNotMatch(
      script,
      new RegExp(`^const ${constant}\\b`, "m"),
      `${constant} is declared a second time in the script`
    );
    assert.match(script, new RegExp(`\\b${constant}\\b`), `${constant} is no longer used by the script`);
  }

  // The bar is part of the rule, so it travels with it rather than with the
  // sizes: an AVIF written to beat a lower quality WebP would be judged against
  // a worse picture, and every measurement above would be about that one.
  assert.match(script, /webp_method: WEBP_METHOD/, "the WebP the AVIF is measured against is not the one written");
  assert.match(script, /method=webp_method/, "and it is written with the effort the module names");

  // The interpreter is looked for once, by the code both the script and this
  // test run, so neither can skip itself over a library the other is using.
  assert.match(module, /export function findPython/, "the interpreter is found in two places");
  assert.doesNotMatch(script, /function findPython/, "the script looks for the interpreter a second time");

  // And the numbers measured above are the ones the gallery was decided with:
  // the same ladder, and the same bar for what a third file has to save. The
  // pictures themselves are not re-encoded here; their weight is held by
  // src/lib/photo-weight.test.js, and their fidelity by the witness above.
  assert.match(script, /avif_ladder: AVIF_QUALITY_LADDER/, "the script walks another ladder");
  assert.match(script, /avif_worth_it: AVIF_WORTH_IT/, "or decides with another bar");
});
