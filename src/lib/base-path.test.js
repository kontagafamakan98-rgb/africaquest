import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { basePath, servedPath, underBase } from "./base-path.js";

// The application is published to the root of a domain or under a path, the way
// a project site on GitHub Pages is, and Vite tells the build which of the two
// it is. Everything of ours that the browser is asked to fetch goes through
// here, so this is the one place that decides whether the eighth level shows
// /photos/level-8-1.jpg or /repository/photos/level-8-1.jpg.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

test("a file of ours is addressed under the path the app is served from", () => {
  assert.equal(underBase("/photos/level-1-1.jpg", "/"), "/photos/level-1-1.jpg", "at a domain root nothing changes");
  assert.equal(underBase("/photos/level-1-1.jpg", "/repository/"), "/repository/photos/level-1-1.jpg");
  assert.equal(underBase("photos/level-1-1.jpg", "/repository/"), "/repository/photos/level-1-1.jpg", "one separator, not two");
  assert.equal(underBase("/index.html", "/repository"), "/repository/index.html", "a base written without its slash");
  assert.equal(underBase("/x", ""), "/x", "an empty base is a root");
  assert.equal(underBase("/x", undefined), "/x", "and so is no base at all");
  assert.equal(underBase("", "/repository/"), "/repository/", "the base alone is the application directory");
});

test("outside a browser build there is no base, and the root is the answer", () => {
  // No Vite build, no BASE_URL. This module is also read by the build plugin
  // and by these tests, and both address our files from what they have.
  assert.equal(basePath(), "/");
  assert.equal(servedPath("/photos/level-1-1.jpg"), "/photos/level-1-1.jpg");
});

test("the app asks for its own files through this module, and only its own", () => {
  // The photograph table names its files from the root of the build, so a path
  // handed straight to the browser would leave every picture missing under a
  // path. The three places that hand one over go through servedPath, and the
  // router keeps its routes under the same directory, or a link to the privacy
  // notice would leave the application.
  //
  // A build under a path is what really proves this, and the deployment does
  // exactly that; what is checked here is that nothing has quietly started
  // handing raw paths to the browser again.
  const game = read("src/components/game/gameData.js");
  assert.match(game, /import \{ servedPath \} from "\.\.\/\.\.\/lib\/base-path\.js";/, "the game reads the module");
  assert.match(game, /file: servedPath\(photo\.file\)/, "the gallery of a level");

  // The picture on a level's card is addressed here now: it comes from the brief
  // of the game, which is the module the first screen reads, so a build under a
  // path has to put that card under it as well.
  const summary = read("src/components/game/level-summary.js");
  assert.match(summary, /import \{ servedPath \} from "\.\.\/\.\.\/lib\/base-path\.js";/, "the brief reads it too");
  assert.match(summary, /servedPath\(fact\.image\)/, "and the picture on its card");
  assert.match(summary, /AVIF_FILES\.map\(\(file\) => servedPath\(file\)\)/, "so are the light formats of the gallery");

  const app = read("src/App.jsx");
  assert.match(app, /<Router basename=\{basePath\(\)\}>/, "the routes live under the same path");

  // The addresses we do not own are left alone: a photograph's source page on
  // Wikimedia Commons is not ours to rewrite.
  const images = read("src/lib/level-images.js");
  assert.match(
    images,
    /^ {2}return `https:\/\/commons\.wikimedia\.org\/wiki\/File:\$\{/m,
    "the Commons page stays as it is"
  );
  assert.doesNotMatch(images, /servedPath/, "and the table itself stays free of the base");
});

test("a lesson read on its own prepares its gallery the same way", () => {
  // The lesson is the one screen that downloads a single level, and the
  // photographs it draws come out of that level rather than out of the game.
  // So the level has to be prepared on the way in, or the gallery of a lesson
  // published under a directory is a strip of captions with no pictures in it:
  // every file asked for at the root of the domain, and every one of them 404.
  //
  // What is checked here is the shape of that, because a base only exists in a
  // browser build, and the deployment is what really exercises it.
  const content = read("src/components/game/level-content.js");
  assert.match(
    content,
    /import \{ servedPath \} from "\.\.\/\.\.\/lib\/base-path\.js";/,
    "the reader of a single level reads the module"
  );
  assert.match(content, /file: servedPath\(photo\.file\)/, "and puts each photograph under the base");

  // The modules those levels live in are written by a script that runs outside
  // a browser, where there is no BASE_URL to read, so they keep the file as the
  // photograph table names it. One that baked a path in would have it asked for
  // twice, under two directories, once the lesson prepared it again.
  const dir = path.join(ROOT, "src", "components", "game", "levels");
  const modules = readdirSync(dir).filter((file) => file.endsWith(".js"));
  assert.equal(modules.length, 20, "one module per level");
  const files = modules.flatMap((file) =>
    [...read(`src/components/game/levels/${file}`).matchAll(/file: "([^"]+)"/g)].map((match) => match[1])
  );
  assert.equal(files.length, 120, "three photographs per level, in both languages");
  assert.deepEqual(
    files.filter((file) => !file.startsWith("/photos/")),
    [],
    "these carry a path the lesson would then prepare a second time"
  );
});

test("no journey through the app sends the browser to the root of the domain", () => {
  // A route that does not exist is sent back to the game. Written as a bare "/"
  // that is the root of the domain, which under a project site is somebody
  // else's address: the visitor would leave the game without a word. Every
  // journey inside the app is either a router Link, whose paths are relative to
  // the basename, or goes through basePath().
  const files = readdirSync(path.join(ROOT, "src"), { recursive: true })
    .filter((file) => /\.[jt]sx?$/.test(file) && !file.includes(".test."))
    .map((file) => path.join("src", file));

  const escapes = [];
  for (const file of files) {
    const source = read(file);
    // A slash at the start of the address the browser is sent to, in any of the
    // three ways that is written: the href property, assign, replace.
    for (const match of source.matchAll(/location\.(?:href\s*=\s*|(?:assign|replace)\()\s*["'`]\//g)) {
      escapes.push(`${file}: ${match[0]}`);
    }
  }
  assert.deepEqual(escapes, [], "these would leave the application for the domain root");

  const notFound = read("src/lib/PageNotFound.jsx");
  assert.match(notFound, /window\.location\.replace\(basePath\(\)\)/, "an unknown route comes back to the game");
});
