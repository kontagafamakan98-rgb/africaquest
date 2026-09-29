import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * House rules of this app, checked automatically so they cannot creep back in.
 *
 * These are the traps that make a project look machine made: borrowed purple
 * gradients, pill shaped buttons, invented reviews or figures, emoji standing in
 * for icons, long dashes, and scroll gimmicks. Nothing here is a matter of taste:
 * each rule below was asked for explicitly, and each one fails the build if the
 * code ever breaks it again.
 *
 * The checks read the source as text, so the test file itself is left out of the
 * scan: it has to name the very patterns it forbids.
 */

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCANNED_EXTENSIONS = /\.(js|jsx|css|html|json)$/;
const SKIPPED_DIRECTORIES = new Set(["node_modules", "dist", ".git"]);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) walk(path.join(directory, entry.name), files);
      continue;
    }
    if (!SCANNED_EXTENSIONS.test(entry.name)) continue;
    if (entry.name.endsWith(".test.js")) continue;
    files.push(path.join(directory, entry.name));
  }
  return files;
}

const sourceFiles = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "public"))];
const indexHtml = readFileSync(path.join(ROOT, "index.html"), "utf8");

/** Every line of the app, ready to be scanned for a forbidden pattern. */
function scan(pattern) {
  const hits = [];
  for (const file of [...sourceFiles, path.join(ROOT, "index.html")]) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (pattern.test(line)) {
          hits.push(`${path.relative(ROOT, file)}:${index + 1} ${line.trim().slice(0, 90)}`);
        }
      });
  }
  return hits;
}

test("the scan really covers the app", () => {
  // Guards against a rule that silently passes because it looks at nothing.
  assert.ok(sourceFiles.length > 40, `only ${sourceFiles.length} files scanned`);
  assert.ok(sourceFiles.some((file) => file.endsWith("index.css")));
  assert.match(indexHtml, /<div id="root">/);
});

test("every component used in JSX is imported or declared", () => {
  // A tag that is neither imported nor declared renders a blank page at run
  // time, and neither the bundler nor the linter fails on it: JSX tag names are
  // not regular references, so `no-undef` stays quiet. This check is the only
  // thing standing between that typo and a white screen in front of the user.
  //
  // A name is accepted as soon as it appears somewhere other than as a tag,
  // which covers imports, aliases, destructuring and props renamed to a
  // component. That keeps the rule free of false alarms.
  const ALLOWED = new Set(["Fragment"]);
  const offenders = [];

  for (const file of sourceFiles.filter((candidate) => candidate.endsWith(".jsx"))) {
    const source = readFileSync(file, "utf8");
    const tags = new Set([...source.matchAll(/<([A-Z][\w$]*)[\s/>]/g)].map((match) => match[1]));
    for (const name of tags) {
      if (ALLOWED.has(name)) continue;
      const occurrences = [...source.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
      const tagOccurrences = [...source.matchAll(new RegExp(`<${name}[\\s/>]`, "g"))].length;
      if (occurrences <= tagOccurrences) {
        offenders.push(`${path.relative(ROOT, file)} -> ${name}`);
      }
    }
  }

  assert.deepEqual(offenders, []);
});

test("no purple or violet anywhere in the interface", () => {
  const hits = scan(/purple|violet|indigo|fuchsia|#(7c3aed|8b5cf6|a855f7|c084fc|a78bfa|6366f1)/i);
  assert.deepEqual(hits, []);
});

test("no pill shaped buttons", () => {
  // A rounded-full class is fine on a progress bar, a chip or a sheet handle;
  // it is not on something that behaves like a button.
  const hits = [];
  for (const file of sourceFiles) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (!line.includes("rounded-full")) return;
      const context = lines.slice(Math.max(0, index - 6), index + 6).join(" ");
      const looksLikeButton = /<button|<Button/.test(context);
      const looksPillSized = /px-[34]|py-2|py-3|h-1[012]\b/.test(context);
      if (looksLikeButton && looksPillSized) {
        hits.push(`${path.relative(ROOT, file)}:${index + 1} ${line.trim().slice(0, 90)}`);
      }
    });
  }
  assert.deepEqual(hits, []);
});

test("no invented reviews, ratings or client figures", () => {
  // A rating is written like "4.5/5" or "5/5 étoiles", never as a bare "5/5":
  // Wikimedia thumbnail paths such as thumb/5/53/ would otherwise look like one.
  const hits = scan(
    /testimonial|témoignage|avis client|trusted by|satisfaction|\u2605|\b[0-5](?:[.,]\d)?\s*\/\s*5\b|10 ?000 ?(élèves|users|clients)|schools trust|écoles partenaires/i
  );
  assert.deepEqual(hits, []);
});

test("no emoji standing in for icons", () => {
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
  const hits = scan(emoji);
  assert.deepEqual(hits, []);
});

test("no em dash and no en dash", () => {
  // The rule is about the copy the reader sees. Two of the photographs come
  // from Wikimedia Commons files whose real names contain an en dash, and the
  // API would not find them without it. A line that is nothing but a quoted
  // image file name is therefore the one documented exception; this test reads
  // whole lines rather than the truncated summaries `scan` returns, so the file
  // extension is still visible.
  const isBareFileName = (line) => /^\s*(commonsTitle:\s*)?"[^"]+\.(jpe?g|png|tiff?)",?$/.test(line);
  const hits = [];

  for (const file of [...sourceFiles, path.join(ROOT, "index.html")]) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (!/\u2014|\u2013/.test(line) || isBareFileName(line)) return;
        hits.push(`${path.relative(ROOT, file)}:${index + 1} ${line.trim().slice(0, 90)}`);
      });
  }

  assert.deepEqual(hits, []);
});

test("no scroll driven animation", () => {
  assert.deepEqual(scan(/whileInView|useScroll|useTransform\(|onWheel|window\.onscroll/), []);
});

test("no custom cursor or cursor animation", () => {
  assert.deepEqual(scan(/cursor-none|custom-cursor|animateCursor|mix-blend-|data-cursor/), []);
});

test("nothing advertises the tooling behind the app", () => {
  assert.deepEqual(scan(/freebuff|made with ai|built with ai|generated by ai|base44/i), []);
});

test("the app ships a favicon and a web manifest", () => {
  assert.match(indexHtml, /rel="icon"[^>]+href="\/favicon\.svg"/);
  assert.ok(existsSync(path.join(ROOT, "public", "favicon.svg")), "public/favicon.svg");
  assert.ok(existsSync(path.join(ROOT, "public", "manifest.json")), "public/manifest.json");

  const icon = readFileSync(path.join(ROOT, "public", "favicon.svg"), "utf8");
  assert.match(icon, /<svg/);
  assert.doesNotMatch(icon, /purple|violet|#(7c3aed|8b5cf6|a855f7)/i);
});

test("the data protection notice and the terms are routed as real pages", () => {
  const config = readFileSync(path.join(ROOT, "src", "pages.config.js"), "utf8");
  assert.match(config, /PrivacyPolicy/);
  assert.match(config, /TermsOfService/);

  const privacy = readFileSync(path.join(ROOT, "src", "pages", "PrivacyPolicy.jsx"), "utf8");
  const terms = readFileSync(path.join(ROOT, "src", "pages", "TermsOfService.jsx"), "utf8");
  // Both pages must answer in English and in French, and name a contact address.
  assert.match(privacy, /en:/);
  assert.match(privacy, /fr:/);
  assert.match(terms, /en:/);
  assert.match(terms, /fr:/);
  // The address comes from one module both pages read, so the notice and the
  // terms can never disagree about who publishes the app or how to reach them.
  assert.match(privacy, /from "\.\.\/lib\/publisher"/);
  assert.match(terms, /from "\.\.\/lib\/publisher"/);
  const publisher = readFileSync(path.join(ROOT, "src", "lib", "publisher.js"), "utf8");
  assert.match(publisher, /CONTACT_EMAIL/);
  assert.match(publisher, /PUBLISHER/);
  assert.match(publisher, /HOST/);
  assert.match(publisher, /DPO/);
});

test("no gradient text, and no texture laid over a gradient", () => {
  // A heading whose colour comes out of a gradient is unreadable the moment that
  // gradient runs light, and a noise or grid layer over one is something standing
  // between the reader and the words. Neither is a decision about what the screen
  // is for.
  assert.deepEqual(scan(/bg-clip-text|text-transparent|feTurbulence|repeating-linear-gradient|noise\.(png|svg)/i), []);
});

test("a blur is a scrim over a photograph, never a card", () => {
  // Glass: a translucent panel over a blurred backdrop, which reads as a surface
  // nobody chose. The one place a blur earns its cost is a control or a scrim
  // over a photograph, where the page behind it cannot be read anyway.
  const hits = [];
  for (const file of sourceFiles) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (!line.includes("backdrop-blur")) return;
        if (/bg-black\/|fixed inset-0|absolute inset-0/.test(line)) return;
        hits.push(`${path.relative(ROOT, file)}:${index + 1} ${line.trim().slice(0, 90)}`);
      });
  }
  assert.deepEqual(hits, []);
});

test("text on the dark surfaces stays above the contrast floor", () => {
  // Measured rather than guessed: white at 50 % over #14100A is 5.3 to 1 and at
  // 40 % it is 3.8 to 1, which is below what ordinary sight needs for a word, so
  // half is where the floor is. On the raised surface at #241B10 half is 5.1 to
  // 1, which is why the floor is not lower.
  const hits = [];
  for (const file of sourceFiles) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        for (const match of line.matchAll(/text-white\/(?:\[0?\.(\d+)\]|(\d{1,3}))(?![0-9])/g)) {
          const percent = match[1] ? Number(`0.${match[1]}`) * 100 : Number(match[2]);
          if (percent < 50) hits.push(`${path.relative(ROOT, file)}:${index + 1} ${line.trim().slice(0, 90)}`);
        }
      });
  }
  assert.deepEqual(hits, []);
});

test("no serif, no italic, and no web font is fetched", () => {
  // One typographic voice, the one the operating system already has. A serif
  // italic accent over a sans body, or a display face fetched from a font CDN, is
  // a second voice saying nothing the words were not already saying.
  assert.deepEqual(
    scan(/font-serif|\bitalic\b|@font-face|fonts\.googleapis|@import url|Space Grotesk|Instrument Serif|\bInter\b/),
    []
  );
});

test("one icon set, and it is the one the package depends on", () => {
  assert.deepEqual(
    scan(/from\s+"(react-icons|@heroicons|@radix-ui\/react-icons|feather-icons|@tabler\/icons|phosphor-react|@iconify)/),
    []
  );

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const ICON_LIBRARY =
    /^(lucide-react|react-icons|@heroicons\/|@radix-ui\/react-icons|feather-icons|react-feather|@tabler\/icons|phosphor-react|bootstrap-icons|@iconify\/)/;
  const installed = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((name) => ICON_LIBRARY.test(name));
  assert.deepEqual(installed, ["lucide-react"], "a second icon set is how two of them end up on one screen");

  // The weight of a stroke is set once, by the set itself: an icon drawn thinner
  // than the one beside it looks like a different kind of thing. The chart draws
  // its own geometry rather than icons, which is why it is not caught here.
  assert.deepEqual(scan(/<[A-Z][\w$]*\s[^>]*strokeWidth=/), []);
});

test("motion is short, and says only that something is happening", () => {
  // A hundred and fifty to three hundred milliseconds is a movement a reader
  // follows; half a second is a movement they wait for. The two animations left
  // are the two that carry a meaning: a spinner where a request is in flight, and
  // the breathing of a skeleton, which is what stops it reading as a screen that
  // has stopped loading.
  assert.deepEqual(scan(/duration-(?:[4-9]\d\d|1000)|animate-(?:bounce|ping|wiggle|jello|heartBeat)/), []);

  const css = readFileSync(path.join(ROOT, "src", "index.css"), "utf8");
  assert.match(css, /prefers-reduced-motion: reduce/, "whoever asked their device for less motion is not listened to");
});

test("nothing fades on hover, and the big targets take a press", () => {
  // A control that changes only its opacity on hover is a control with no hover
  // state. What a tap target owes instead is a colour, and a press the thumb can
  // feel on the way down.
  assert.deepEqual(scan(/hover:opacity-|group-hover:opacity-/), []);

  const pressed = sourceFiles.filter((file) => readFileSync(file, "utf8").includes("active:scale-[0.99]"));
  assert.ok(pressed.length >= 2, "no tap target answers a press");
  for (const file of ["src/components/game/LevelCard.jsx", "src/components/ui/button.jsx"]) {
    assert.match(readFileSync(path.join(ROOT, file), "utf8"), /active:scale-\[0\.99\]/, `${file} does not answer a press`);
  }
});

test("spacing comes from the scale rather than from a bracket", () => {
  // Every arbitrary padding is a measurement somebody made once, and a reader
  // then meets it beside a padding two pixels away from it.
  assert.deepEqual(scan(/\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[/), []);
});

test("the waiting, the empty and the failed states are all drawn", () => {
  const skeleton = readFileSync(path.join(ROOT, "src", "components", "game", "ScreenSkeleton.jsx"), "utf8");
  assert.match(skeleton, /role="status"/, "the waiting screen says nothing to a reader who cannot see it");
  assert.match(skeleton, /t\.loadingScreen/, "nothing on the waiting screen says that it is loading");
  for (const variant of ["map", "quiz"]) {
    assert.match(skeleton, new RegExp(`variant === "${variant}"`), `the ${variant} screen has no shape of its own`);
  }
  // The third shape is the one a screen gets when nobody named another.
  assert.match(skeleton, /LIST_ROWS/, "the list of rows has no shape of its own");

  const app = readFileSync(path.join(ROOT, "src", "App.jsx"), "utf8");
  const home = readFileSync(path.join(ROOT, "src", "pages", "Home.jsx"), "utf8");
  assert.match(app, /ScreenSkeleton/, "a page loaded on demand waits on a blank screen");
  assert.match(home, /ScreenSkeleton variant="map"/, "the map waits on a blank screen");
  assert.match(home, /ScreenSkeleton variant="quiz"/, "a quiz waits on a blank screen");

  // An empty state is not the absence of one: a screen with nothing to show says
  // which nothing it is rather than leaving a reader to guess at a fault.
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "game", "ReviewScreen.jsx"), "utf8"),
    /t\.reviewEmptyTitle/,
    "the review inbox has nothing to say when it is empty"
  );
  const stats = readFileSync(path.join(ROOT, "src", "components", "game", "StatsScreen.jsx"), "utf8");
  assert.match(stats, /t\.noDataYet/, "a player who has not played gets a screen of zeroes");
  assert.match(stats, /t\.exportFailed/, "a report that could not be written says nothing");

  // And the failures nobody can be shown on the way in: an address the app does
  // not know, and a device that has lost its network.
  assert.match(app, /PageNotFound/, "an unknown address has no page of its own");
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "AppStatus.jsx"), "utf8"),
    /t\.offline/,
    "a device with no network is not told"
  );
});

test("nothing a reader typed or picked is ever placed in the page as markup", () => {
  // Everything a reader gives this app - a name, a file - reaches the screen as
  // a text node, which React escapes, or through a store that trims and caps it
  // before it is kept. What would break that is a raw HTML sink, and there is
  // none: no innerHTML, no dangerouslySetInnerHTML, no eval. A string can only
  // be shown; it can never be run.
  assert.deepEqual(
    scan(/dangerouslySetInnerHTML|\.innerHTML\b|\.outerHTML\b|insertAdjacentHTML|document\.write|new Function|\beval\(/),
    []
  );

  // And what is kept is bounded: a name is forty characters and a text field is
  // capped at the width of its column, whether it came from a form or from a file
  // somebody hand-edited.
  assert.match(readFileSync(path.join(ROOT, "src", "api", "profiles-store.js"), "utf8"), /\.trim\(\)[\s\S]{0,20}slice\(0, ?40\)/);
  assert.match(
    readFileSync(path.join(ROOT, "src", "lib", "progress-file.js"), "utf8"),
    /\.trim\(\)[\s\S]{0,20}slice\(0, ?maxLength\)/
  );

  // A link that leaves the app opens in its own window, and carries nothing back
  // with it: without `noopener` the page it opens holds a handle on this one.
  for (const file of sourceFiles.filter((candidate) => candidate.endsWith(".jsx"))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (!line.includes('target="_blank"')) return;
      const context = lines.slice(index, index + 4).join(" ");
      assert.match(context, /rel="noopener/, `${path.relative(ROOT, file)}:${index + 1} opens a window it does not give back`);
    });
  }
});

test("every package the app depends on is a package the app loads", () => {
  // A manifest is a claim about what the application is. Fifty runtime
  // dependencies nothing imports is a starter kit wearing this project's name,
  // and an installer here hands the reader a payment library for a game that
  // takes no payments, a 3D engine for a screen that draws none, and a carousel
  // for a list that is a list.
  //
  // One package is a real exception and is named here rather than hidden: jsPDF
  // resolves `html2canvas` when it is bundled, because its own html() path
  // imports it, so Rollup fails the build without it even though this app never
  // draws HTML.
  const ALONGSIDE = new Set(["html2canvas"]);

  const roots = ["src", "build", "scripts"];
  const extra = ["tailwind.config.js", "postcss.config.js", "vite.config.js", "eslint.config.js", "components.json"]
    .map((name) => path.join(ROOT, name))
    .filter((file) => existsSync(file));
  const specifiers = new Set();
  const collect = (text) => {
    for (const match of text.matchAll(/(?:from|import|require)\s*\(?\s*["']([^"']+)["']/g)) {
      specifiers.add(match[1]);
    }
  };
  for (const directory of roots) {
    for (const file of walk(path.join(ROOT, directory))) collect(readFileSync(file, "utf8"));
  }
  for (const file of extra) collect(readFileSync(file, "utf8"));
  collect(indexHtml);

  const packageOf = (specifier) => {
    if (specifier.startsWith("./" ) || specifier.startsWith("..") || specifier.startsWith("@/")) return null;
    const parts = specifier.split("/");
    return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  };
  const imported = new Set([...specifiers].map(packageOf).filter(Boolean));

  const { dependencies } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const unloaded = Object.keys(dependencies).filter((name) => !imported.has(name) && !ALONGSIDE.has(name));
  assert.deepEqual(unloaded, [], "runtime dependencies the application never loads");
});

test("the interface is this app's, not the kit it was started from", () => {
  // Every component in the ui folder is a component somebody chose: a file the
  // application never loads is the starter kit still lying in the repository,
  // waiting to be mistaken for a decision.
  const folder = path.join(ROOT, "src", "components", "ui");
  const sources = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  for (const file of readdirSync(folder)) {
    const name = file.replace(/\.jsx$/, "");
    assert.ok(sources.includes(`components/ui/${name}`), `${file} is in the app but is never loaded by it`);
  }

  // And the one button every screen uses is this app's button: the starter kit's
  // near-black default on this app's near-black background is a control nobody
  // could see.
  const button = readFileSync(path.join(folder, "button.jsx"), "utf8");
  assert.doesNotMatch(button, /bg-primary/, "the button still wears the starter kit's colour");
  assert.match(button, /bg-amber-500/, "the button does not wear this app's colour");
});

test("the app takes no payments, and never pretends to verify one", () => {
  // There is no server behind this application. It is a folder of files, and a
  // file accepts nothing: no checkout can run here and no event can arrive here.
  // A payment provider's webhook is therefore not a thing this app can verify,
  // and the reason is not missing code. Verifying a signature takes a secret,
  // a secret shipped inside a page every reader can download is public, and a
  // check anybody can forge is not a check.
  //
  // What this rule holds is the honest state rather than the clever one: the
  // day a payment library, a hosted checkout or a hand written "verified"
  // webhook shows up in this code, the test fails, because each of them would
  // need the small server-side handler the README describes before it could
  // mean anything at all. Until that handler exists, their absence is the only
  // truthful position, and here it is asserted instead of assumed.
  assert.deepEqual(
    scan(/(?:from|require\()\s*["'](?:@?stripe|paypal|@paypal|paystack|paydunya|flutterwave|paddle|lemonsqueezy|braintree|adyen)\b/i),
    [],
    "a payment library is loaded somewhere"
  );

  assert.deepEqual(
    scan(/checkout\.stripe\.com|buy\.stripe\.com|paypal\.com\/(?:cgi-bin\/webscr|checkout)|paydunya\.com|checkout\.flutterwave\.com/i),
    [],
    "the app points at a hosted checkout"
  );

  assert.deepEqual(
    scan(/\bwebhook\b|verifySignature|signatureHeader|PAYDUNYA_|PAYMENT_SECRET/i),
    [],
    "the app pretends to verify an event it has no server to receive"
  );

  // And the decision is written down where the rest of the guarantees are:
  // why such a check cannot live in the page, and what it would take instead.
  const readme = readFileSync(path.join(ROOT, "README.md"), "utf8");
  assert.match(readme, /no checkout, no payment data and no webhook/, "the README no longer says there are no payments");
  assert.match(readme, /signature check needs a secret/, "the README no longer says why a check cannot live here");
});
