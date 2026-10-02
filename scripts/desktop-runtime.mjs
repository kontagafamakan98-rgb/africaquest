/**
 * The Electron runtime the desktop shell runs on, fetched when it is missing.
 *
 *   node scripts/desktop-runtime.mjs
 *
 * An ordinary install lets a package run its own install script, and Electron's
 * script is the one that downloads the browser it runs: a hundred megabytes or
 * so, taken from GitHub the first time and cached on the machine afterwards.
 * Recent versions of npm put that behind an approval list - `allowScripts` in
 * package.json - and a script that is not approved is neither run nor left in
 * the installed package to be run later. What is left is a checkout where the
 * shell is present and the runtime it starts is not, and every command after it
 * fails with a message about a folder that does not exist.
 *
 * So the runtime is fetched here, by the package's own installer, when it is
 * missing and only then. A machine that already has one - which is what an
 * ordinary install leaves behind, and what the approval above is for - reaches
 * the first check and stops.
 *
 * It is run by `desktop:start` and `desktop:build` rather than by an install
 * hook of this project's own: a fetch of a hundred megabytes that happens on
 * every `npm install` is a cost paid by everybody who never opens the desktop
 * build, and this way it is paid by whoever asks for one.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE = path.join(ROOT, "node_modules", "electron");
const INSTALLER = path.join(PACKAGE, "install.js");
const RUNTIME = path.join(PACKAGE, "dist");

if (existsSync(RUNTIME)) {
  console.log("desktop runtime: Electron is already installed, nothing to fetch");
  process.exit(0);
}

if (!existsSync(INSTALLER)) {
  console.error("desktop runtime: electron is not installed at all. Run: npm install");
  process.exit(1);
}

console.log("desktop runtime: fetching the Electron runtime, which the install did not run");
const fetched = spawnSync(process.execPath, [INSTALLER], { cwd: ROOT, stdio: "inherit" });

if (fetched.status !== 0 || !existsSync(RUNTIME)) {
  console.error("desktop runtime: the runtime could not be fetched; the desktop build cannot run without it");
  process.exit(fetched.status || 1);
}

console.log("desktop runtime: Electron is installed");
