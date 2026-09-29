import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// The mark that flows between the items of a strip is one element moved from
// place to place, which is easy to get subtly wrong: two strips sharing it make
// the highlight fly across the screen, an item that also paints its own
// selection flashes while the mark travels, and a mark that swallows the
// accessibility of the strip leaves a reader with no idea what is selected.
//
// Every surface that shows one item as the chosen one is listed here, with the
// mark it carries and how it says the same thing to a reader who cannot see the
// screen. The register is checked against what the app actually loads, so a new
// strip cannot appear without being registered here as well.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const MARK = path.join("src", "components", "game", "LiquidMark.jsx");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

/** Comments are prose: only the code is counted. */
const code = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

// `marks` are the layout ids the strip carries. `chosenWhen` is the expression
// that decides which item is chosen, so the item can be checked for painting
// its own selection. `spoken` is how the same choice reaches a reader's ear,
// and `byAttribute` says whether that is an attribute the scan can find.
const SURFACES = [
  {
    file: "src/pages/Home.jsx",
    where: "the main tab bar",
    marks: ["main-tab", "main-tab-underline"],
    chosenWhen: /isActive\s*\?\s*"([^"]*)"/g,
    spoken: /aria-current/,
    byAttribute: true,
  },
  {
    file: "src/components/game/ReviewScreen.jsx",
    where: "the review scopes, levels and regions",
    marks: ["review-scope", "review-level", "review-region"],
    chosenWhen:
      /(?:entry\.active|scope\.id === row\.id|scope\.region === row\.region)\s*\?\s*"([^"]*)"/g,
    spoken: /aria-current/,
    byAttribute: true,
  },
  {
    file: "src/components/game/SettingsModal.jsx",
    where: "the language picker",
    marks: ["settings-language"],
    chosenWhen: /currentLang === lang\.code\s*\?\s*"([^"]*)"/g,
    spoken: /aria-pressed/,
    byAttribute: true,
  },
  {
    file: "src/pages/TeacherPage.jsx",
    where: "the class register",
    marks: ["teacher-student"],
    // The other `isActive` in this page styles a button that is switched off
    // while it is the active student, which is a disabled control rather than a
    // strip item, so it is left out on purpose.
    chosenWhen: null,
    // This one names the chosen student in words instead of an attribute: the
    // button that would carry `aria-current` is the one that is switched off.
    spoken: /t\.activeProfile/,
    byAttribute: false,
  },
];

// The file the bundle starts from, so "shipped" means what the app really
// loads rather than every file that happens to sit in the tree.
const ENTRY = "src/main.jsx";
const EXTENSIONS = ["", ".jsx", ".js", "/index.jsx", "/index.js"];

function resolve(specifier, from) {
  const base = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(path.join(ROOT, from)), specifier)
      : null;
  if (!base) return null;

  for (const extension of EXTENSIONS) {
    const candidate = base + extension;
    if (existsSync(candidate) && !candidate.endsWith(path.sep)) return path.relative(ROOT, candidate);
  }
  return null;
}

/** Everything the app loads, following the imports from the entry point. */
function shipped(file = ENTRY, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);

  const source = readFileSync(path.join(ROOT, file), "utf8");
  // `from "./x"`, `import "./x"` and the lazy `import("./x")` of a route.
  for (const match of source.matchAll(/(?:\bfrom\b|\bimport\b)\s*\(?\s*["']([^"']+)["']/g)) {
    const next = resolve(match[1], file);
    if (next) shipped(next, seen);
  }
  return seen;
}

const sources = () =>
  [...shipped()]
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => /\.jsx?$/.test(file))
    .sort();

/** How many items in a file say "this one is chosen". */
const announcements = (source) =>
  [...code(source).matchAll(/aria-current|aria-pressed/g)].length;

test("the mark is one element that travels, and it is not something a reader is told", () => {
  const source = read(MARK);
  assert.match(source, /motion\.span/, "it is an animated element");
  assert.match(source, /layoutId=\{layoutId\}/, "laid out by the id its caller gives, which is what makes it travel");
  assert.match(source, /className=\{cn\("absolute -z-10 pointer-events-none"/, "it takes no place in the item and no taps");
  assert.match(source, /aria-hidden="true"/, "it is drawn, not spoken");
  assert.doesNotMatch(source, /<button/, "it never becomes a control of its own");
});

test("whoever asked their device for less motion gets the mark in place, at once", () => {
  const source = read(MARK);
  assert.match(source, /useReducedMotion\(\)/, "the setting is read");
  assert.match(source, /still \? \{ duration: 0 \}/, "and the travel is dropped for those readers");
  assert.match(source, /type: "spring"/, "while everyone else gets the flow");
});

test("no strip is missing from the register, so none is missing its mark", () => {
  const loaded = sources();

  // A surface the app never loads is not the one the reader sees.
  for (const surface of SURFACES) {
    assert.ok(loaded.includes(surface.file), `${surface.where}: the app does not load this page`);
  }

  // Every file that tells a reader which item is chosen is a registered strip:
  // a new one cannot slip in without being given a mark of its own.
  const announcing = loaded.filter((file) => announcements(read(file)) > 0);
  const registered = SURFACES.filter((surface) => surface.byAttribute)
    .map((surface) => surface.file)
    .sort();

  assert.deepEqual(
    announcing,
    registered,
    "every surface that shows which item is chosen has to be registered, with the mark that goes with it"
  );

  for (const surface of SURFACES) {
    assert.match(read(surface.file), surface.spoken, `${surface.where}: the chosen item is not announced`);
  }
});

test("the strips the app was started from are still unshipped", () => {
  // Breadcrumbs and pagination draw a chosen page of their own. They are part
  // of the starter kit and never loaded, which is why the register can leave
  // them out. Wiring one up means registering its strip here.
  for (const forgotten of ["src/components/ui/breadcrumb.jsx", "src/components/ui/pagination.jsx"]) {
    assert.ok(!sources().includes(forgotten), `${forgotten} is now loaded, and its strip is not registered`);
  }
});

test("every strip has a mark of its own, and no two strips share one", () => {
  const ids = [];
  for (const file of sources()) {
    for (const match of code(read(file)).matchAll(/layoutId="([^"]+)"/g)) ids.push(match[1]);
  }

  const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(repeated, [], "a mark shared by two strips would fly between them");

  for (const surface of SURFACES) {
    const source = read(surface.file);
    for (const id of surface.marks) {
      assert.ok(source.includes(`layoutId="${id}"`), `${surface.where}: no mark called ${id}`);
      assert.equal(ids.filter((found) => found === id).length, 1, `${surface.where}: ${id} is used once`);
    }
  }
});

test("the chosen item is drawn by the mark alone, so nothing flashes while it travels", () => {
  // The item's own classes have to be the same whichever one is chosen: a border
  // or a background that changed by itself would appear at the destination while
  // the mark was still on its way there.
  for (const surface of SURFACES) {
    if (!surface.chosenWhen) continue;

    const chosen = [...read(surface.file).matchAll(surface.chosenWhen)].map((match) => match[1]);
    assert.ok(chosen.length > 0, `${surface.where}: nothing was found to check`);

    for (const classes of chosen) {
      assert.doesNotMatch(
        classes,
        /(^|\s)(bg|border)-/,
        `${surface.where}: "${classes}" paints the selection as well as the mark`
      );
    }
  }

  // The register paints its outline on the mark too, rather than on the row.
  assert.doesNotMatch(read("src/pages/TeacherPage.jsx"), /isActive \? "border-amber-400/);
});

test("the mark never speaks, so what a strip says stays the strip's own", () => {
  assert.match(read(MARK), /aria-hidden="true"/);
});
