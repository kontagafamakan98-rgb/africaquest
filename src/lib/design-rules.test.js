import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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

  // A screen that fails to be drawn is the one failure with nothing left to draw
  // it: the boundary sits above the router, so a value the data does not have, a
  // chunk that could not be fetched and a mistake in the drawing itself all end
  // in a message rather than a white page. And the message says what to do, and
  // keeps the trace for the person who has to send it on.
  const crash = readFileSync(path.join(ROOT, "src", "components", "AppCrash.jsx"), "utf8");
  assert.match(app, /AppCrash/, "nothing catches a screen that fails to be drawn");
  assert.ok(
    app.indexOf("<AppCrash>") < app.indexOf("<Router"),
    "the boundary is inside the router, so a failure in the router itself escapes it"
  );
  assert.match(crash, /getDerivedStateFromError/, "the boundary does not catch a render");
  assert.match(crash, /componentDidCatch/, "the boundary forgets which screen was being drawn");
  assert.match(crash, /t\.appCrashedReload/, "the crash screen offers no way out");
  assert.match(crash, /t\.appCrashedCopy/, "the crash screen keeps no trace to send on");
  assert.match(crash, /role="alert"/, "a reader who cannot see the screen is not told it broke");
  assert.match(crash, /failureReport/, "the trace is not the one the tests read");

  // The screen that breaks while writing the trace of a break is the one screen
  // that has to hold, and the module that writes it is tested on its own.
  assert.ok(
    existsSync(path.join(ROOT, "src", "lib", "failure-report.js")),
    "the trace is built by a module of its own"
  );

  // A browser that refuses to save is the one failure the player cannot see for
  // themselves: the game keeps scoring and everything is gone at the next
  // reload. So the refusal is remembered, and said out loud.
  const status = readFileSync(path.join(ROOT, "src", "components", "AppStatus.jsx"), "utf8");
  assert.match(status, /watchSaveRefusal/, "a save the browser refused is never mentioned");
  assert.match(status, /t\.saveFailed/, "the reader is not told their progress cannot be saved");
  assert.match(
    readFileSync(path.join(ROOT, "src", "api", "progress-store.js"), "utf8"),
    /rememberRefusal\(error\)/,
    "a refused write is not remembered anywhere"
  );

  // And the failures nobody can be shown on the way in: an address the app does
  // not know, and a device that has lost its network.
  assert.match(app, /PageNotFound/, "an unknown address has no page of its own");
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "AppStatus.jsx"), "utf8"),
    /t\.offline/,
    "a device with no network is not told"
  );
});

test("a list long enough to be a page is drawn a page at a time", () => {
  // Two hundred lines of credits, and every reference of the game with its
  // questions: both are reference screens, opened to settle one question, and
  // drawn in one go the reader waits for the whole list to be laid out before
  // reading the first line of it. The two counts in each header are still the
  // whole thing, so a page that has not been revealed yet never reads as absent.
  for (const [file, size, list] of [
    ["src/pages/PhotoCredits.jsx", "CREDITS_PAGE", "levels"],
    ["src/pages/Bibliography.jsx", "INSTITUTIONS_PAGE", "institutions"],
  ]) {
    const source = readFileSync(path.join(ROOT, file), "utf8");
    const first = Number(new RegExp(`const ${size} = (\\d+);`).exec(source)?.[1]);
    assert.ok(
      Number.isFinite(first) && first >= 3 && first <= 8,
      `${file}: the first page holds ${first} sections`
    );
    assert.match(source, /slice\(0, shown\)/, `${file} still draws the whole list at once`);
    assert.match(source, /t\.showMore/, `${file} has no way of seeing the rest`);
    assert.match(source, new RegExp(`${list}\\.length - shown`), `${file} does not say how much is left`);
    assert.match(source, /active:scale-\[0\.99\]/, `${file} does not answer a press`);
  }

  const credits = readFileSync(path.join(ROOT, "src", "pages", "PhotoCredits.jsx"), "utf8");
  assert.match(credits, /\{total\} \{t\.photoCreditsPhotographs\}/, "the credits screen stopped counting the whole gallery");
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

test("no key, token or password is kept where every reader can download it", () => {
  // Everything this application is made of is served to whoever asks for it. A
  // secret in here is therefore not a secret, it is a published string: the app
  // uses none, and this rule is what keeps that a fact rather than a memory.
  assert.deepEqual(
    scan(
      /(?:sk|pk)_(?:live|test)_[0-9A-Za-z]|AIza[0-9A-Za-z_-]{12,}|ghp_[0-9A-Za-z]{20,}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[0-9A-Za-z._-]{24,}/
    ),
    [],
    "something that looks like a credential is in the shipped files"
  );

  // And nothing is smuggled in beside them: an environment file is the one
  // place a key can live, it is not part of the build, and a dotfile in public/
  // would be published under its own name.
  const shipped = readdirSync(path.join(ROOT, "public"));
  assert.deepEqual(shipped.filter((name) => name.startsWith(".")), [], "public/ holds a hidden file");
  assert.match(readFileSync(path.join(ROOT, ".gitignore"), "utf8"), /^\.env$/m, ".env is not ignored");
});

test("an address is https, and nothing is fetched from anywhere else", () => {
  // The application loads its own files and nothing else: no analytics, no
  // fonts, no script from a third party, so there is no third party to audit and
  // nothing about a reader that could leave the device. The one http address
  // below is not a request, it is the name of the SVG namespace, which is a
  // fixed string that no browser ever fetches.
  const plain = scan(/http:\/\//).filter((hit) => !hit.includes("www.w3.org"));
  assert.deepEqual(plain, [], "an address that is not https");

  assert.deepEqual(
    scan(/<script[^>]+src="https?:|@import\s|url\(\s*['"]?https?:|fetch\(\s*["'`]https?:|sendBeacon|new Image\(|XMLHttpRequest/),
    [],
    "something is loaded from another origin"
  );

  assert.deepEqual(
    scan(/googletagmanager|google-analytics|analytics\.|plausible|matomo|posthog|mixpanel|hotjar|clarity\.ms|sentry|doubleclick|segment\.io/i),
    [],
    "a measuring script found its way in"
  );

  // And nothing is left on the reader's device that a banner would have to ask
  // about: this application sets no cookie at all, which is why it has no
  // consent banner to show. A banner over an application that stores nothing
  // would ask for a permission nobody needs.
  assert.deepEqual(scan(/\bdocument\.cookie\b/), [], "the app sets a cookie");
});

test("a dialog holds the keyboard while it is open, and gives it back after", () => {
  // A sheet that can be opened but not left from a keyboard, or one that keeps
  // the focus somewhere behind it, is a screen a reader without a pointer cannot
  // get out of. One hook does that work for every dialog here, so a dialog that
  // does not use it is the whole mistake, and the hook itself is held to the
  // three things it promises.
  const dialogs = sourceFiles.filter(
    (file) => file.endsWith(".jsx") && readFileSync(file, "utf8").includes('role="dialog"')
  );
  assert.ok(dialogs.length >= 4, `only ${dialogs.length} dialog(s) found`);

  for (const file of dialogs) {
    assert.match(
      readFileSync(file, "utf8"),
      /useModalA11y/,
      `${path.relative(ROOT, file)} opens a dialog the keyboard cannot leave`
    );
  }

  const hook = readFileSync(path.join(ROOT, "src", "lib", "use-modal-a11y.js"), "utf8");
  assert.match(hook, /event\.key === "Escape"/, "Escape no longer closes a dialog");
  assert.match(hook, /event\.key !== "Tab"/, "Tab no longer stays inside the dialog");
  assert.match(hook, /previouslyFocused\.current\?\.focus/, "the focus is not given back where it was");
  assert.match(hook, /FOCUSABLE/, "the dialog no longer knows what it may move the focus to");
});

test("nothing rushes a reader and nothing is ticked for them", () => {
  // A countdown, a nearly sold out class, a consent box already ticked: each one
  // takes a decision away from the person making it. This application asks for
  // nothing, sells nothing and sends nothing, so none of them belong here.
  assert.deepEqual(
    scan(/limited time|only \d+ (?:seats|left)|hurry|act now|last chance|offre limit|places restantes|derni\u00e8res places|d\u00e9p\u00eachez/i),
    [],
    "the copy puts a clock on a decision"
  );
  assert.deepEqual(scan(/defaultChecked|checked=\{true\}/), [], "something is ticked before a reader reads it");
  assert.deepEqual(scan(/aria-hidden="true"[^>]*tabIndex/), [], "something hidden can still be reached by a keyboard");
});

test("a field the browser may help with says so, and a secret says otherwise", () => {
  // A field that says nothing about itself is a field the browser guesses at,
  // and it usually guesses wrong: a student's name filled with the teacher's, a
  // teacher's code remembered from the last person who used the tablet. There
  // are three fields somebody types in, and each one carries its own answer.
  const TEXTUAL = /^(?:text|search|email|tel|url|password|number)?$/;
  const misses = [];
  let fields = 0;

  for (const file of sourceFiles.filter((candidate) => candidate.endsWith(".jsx"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/<input\b/g)) {
      const close = source.indexOf(">", match.index);
      const element = source.slice(match.index, close === -1 ? undefined : close + 1);
      const type = /\btype="([^"]*)"/.exec(element)?.[1] ?? "";
      if (!TEXTUAL.test(type)) continue;
      fields += 1;
      if (!/\bautoComplete=["{]/.test(element)) {
        misses.push(`${path.relative(ROOT, file)}: a ${type || "text"} field the browser has to guess at`);
      }
    }
  }

  assert.deepEqual(misses, []);
  assert.ok(fields >= 3, `only ${fields} field(s) somebody types in`);

  const teacher = readFileSync(path.join(ROOT, "src", "pages", "TeacherPage.jsx"), "utf8");
  // A name is a name: the browser may offer the last one that was typed.
  assert.equal(
    (teacher.match(/name="student-name"[\s\S]{0,60}autoComplete="name"/g) || []).length,
    2,
    "the two places a student is named are not both marked as a name"
  );
  // The code is not: it is the one thing on that screen a stranger must not
  // find already filled in, and it is not remembered.
  const code = teacher.slice(teacher.indexOf('id="teacher-code"'));
  assert.match(code.slice(0, 300), /autoComplete="off"/, "the teacher code is remembered by the browser");
});

test("every picture either says what it is or says that it is decoration", () => {
  // An image with no alt at all is read out as its file name, and one that
  // carries a description a screen reader has already heard is read twice. Both
  // are mistakes: a picture described by the words on it is marked decorative
  // with an empty alt, and one that says something of its own is described.
  const misses = [];

  for (const file of sourceFiles.filter((candidate) => candidate.endsWith(".jsx"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/<img\b|<LevelPicture\b/g)) {
      // A tag can span lines, so the alt is looked for in the whole of the
      // element rather than on one line. The one wrapper in the app hands its
      // remaining props to the element it draws, which is how a caller's alt
      // reaches the picture; a caller has no spread and has to write one.
      const element = source.slice(match.index, source.indexOf(">", match.index) + 1);
      const carries = /\balt[=:]/.test(element) || /\{\.\.\.(?:rest|props)\}/.test(element);
      if (!carries) misses.push(`${path.relative(ROOT, file)}: a picture without an alt`);
    }
  }

  assert.deepEqual(misses, []);

  // The wrapper really does pass the caller's alt on, rather than swallowing it
  // and giving every picture the same one.
  const wrapper = readFileSync(path.join(ROOT, "src", "components", "game", "LevelPicture.jsx"), "utf8");
  assert.match(wrapper, /<img[^>]*\{\.\.\.rest\}/s, "the picture wrapper drops the props it was given");

  // And what a picture carries when it is described is a caption written for a
  // reader, not a file name.
  assert.match(
    readFileSync(path.join(ROOT, "src", "components", "game", "LevelGallery.jsx"), "utf8"),
    /alt=\{photo\.caption\}/,
    "the gallery stopped describing its photographs"
  );
});

test("every script in the project is one the runner can read", () => {
  // The checks that need the network, the generators, the sweepers: none of them
  // runs during the build, and none of them is loaded by another test - they are
  // read as text here, and what is asserted about them is the words they print.
  // Which leaves one thing nobody looks at: whether they are a program at all.
  // A missing backtick in one of them passes the whole verification and is found
  // by whoever runs it, months later, on the afternoon a page needed checking. So
  // they are parsed, once each, by the same runner that will run them.
  const directory = path.join(ROOT, "scripts");
  const scripts = readdirSync(directory).filter((name) => name.endsWith(".mjs"));
  assert.ok(scripts.length >= 10, `only ${scripts.length} scripts were found`);

  const broken = [];
  for (const name of scripts) {
    const checked = spawnSync(process.execPath, ["--check", path.join(directory, name)], { encoding: "utf8" });
    if (checked.status === 0) continue;
    const reason = (checked.stderr || "")
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.includes("Error"));
    broken.push(`${name}: ${reason || "the runner cannot read it"}`);
  }

  assert.deepEqual(broken, []);
});

test("the annotations are read by the verification, and only the shipped code is read", () => {
  // Two decisions, and both are the kind that quietly stops being true.
  //
  // The first is that the type gate runs at all. A check outside `verify` is a
  // check nobody runs, which is what this one was: a script in package.json that
  // was red, absent from the verification, and therefore read by no one - the
  // worst of the three states, because it looked like a gate.
  const verify = readFileSync(path.join(ROOT, "scripts", "verify.mjs"), "utf8");
  assert.match(verify, /typescript\/bin\/tsc/, "the verification no longer reads the annotations");
  assert.match(verify, /jsconfig\.json/, "the type gate no longer says which program it reads");

  // The second is what that program is: the code that ships. Test files run under
  // Node, read their own fixtures and are not part of a bundle, so typing them
  // would mean checking a program nobody deploys - and the noise is what makes a
  // gate stop being read. The gate itself is the backstop for the rest: a test
  // file that found its way back in fails on the first `node:` import, not here.
  const config = readFileSync(path.join(ROOT, "jsconfig.json"), "utf8");
  assert.match(config, /"checkJs":\s*true/, "the program no longer reads the JSDoc at all");
  assert.match(config, /\*\.test\.js/, "the type program reads the test files again");
});

/** The paths a config names in one of its arrays, comments and all. */
function pathsIn(config, key) {
  const array = new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`).exec(config);
  return array ? (array[1].match(/"[^"]+"/g) || []).map((entry) => entry.slice(1, -1)) : [];
}

test("every file under src is read by one of the two type programs", () => {
  // A gate is only ever the program it declares, so a file it holds out is a
  // file nothing checks - and holding one out is exactly how a whole directory
  // once fell out of this one. Two files under src/lib call Node's own
  // libraries and cannot be in a browser program at all, so they have a program
  // of their own. This rule holds the two lists together: what the browser
  // program holds out, the Node probe must read, and the browser program must
  // still ask for the whole of src.
  const browser = readFileSync(path.join(ROOT, "jsconfig.json"), "utf8");
  const node = readFileSync(path.join(ROOT, "jsconfig.node.json"), "utf8");

  assert.deepEqual(pathsIn(browser, "include").sort(), ["src/**/*.js", "src/**/*.jsx"]);

  // The globs of the browser program are not files: what matters here is the
  // files it names one by one, and each one has to be read by the Node program.
  const heldOut = pathsIn(browser, "exclude")
    .filter((entry) => entry.startsWith("src/") && entry.endsWith(".js") && !entry.includes("*"))
    .sort();
  assert.ok(heldOut.length > 0, "nothing is held out of the browser program any more");
  assert.deepEqual(
    heldOut,
    pathsIn(node, "include").sort(),
    "a file held out of one type program is read by the other, or by neither"
  );
});

/**
 * The contrast ratio between two colours, as WCAG measures it.
 *
 * sRGB first, then the perceived brightness of each channel, then the two
 * against each other. Written out rather than pulled from a package because it
 * is one expression and the reader can check it here.
 */
function contrast(foreground, background) {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (hex) => {
    const clean = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((at) => channel(parseInt(clean.slice(at, at + 2), 16)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

test("every colour a word is written in clears the contrast floor", () => {
  // The house rules already hold the words on the dark surfaces above a floor;
  // this measures the light ones, which were never checked at all. Each pair is
  // a colour this application really writes a word in, against the surface it is
  // written on, taken from the screens rather than invented here: the muted
  // labels on white and on the near-white band, the explanations on the amber,
  // emerald and red cards, and the error lines on their pale grounds. Ordinary
  // words need 4.5 to 1; the boundary was chosen by measuring, not by taste, and
  // the assertions below fail the moment one of these colours is nudged lighter.
  const pairs = [
    ["#1e293b", "#ffffff", "slate-800 on white"],
    ["#334155", "#ffffff", "slate-700 on white"],
    ["#475569", "#ffffff", "slate-600 on white"],
    ["#475569", "#f8fafc", "slate-600 on slate-50"],
    ["#64748b", "#ffffff", "slate-500 on white"],
    ["#78350f", "#fffbeb", "amber-900 on amber-50"],
    ["#b45309", "#fffbeb", "amber-700 on amber-50"],
    ["#065f46", "#ecfdf5", "emerald-800 on emerald-50"],
    ["#b91c1c", "#fef2f2", "red-700 on red-50"],
  ];

  const failures = pairs
    .map(([foreground, background, label]) => ({ label, ratio: contrast(foreground, background) }))
    .filter((pair) => pair.ratio < 4.5)
    .map((pair) => `${pair.label}: ${pair.ratio.toFixed(2)} to 1`);

  assert.deepEqual(failures, []);

  // And the measurement really measures: a lighter grey on white is below the
  // floor, so a rule that passed everything would be caught here rather than
  // quietly passing a colour nobody can read.
  assert.ok(contrast("#cbd5e1", "#ffffff") < 4.5, "slate-300 on white should be below the floor");
  assert.ok(contrast("#000000", "#ffffff") > 20, "black on white is the top of the scale");
});
