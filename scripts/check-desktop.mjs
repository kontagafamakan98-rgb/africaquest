/**
 * Whether the installer a release published is the one the tag promised.
 *
 *   npm run check:desktop -- --exe Africa-History-Quest-Setup-1.0.8.exe --tag v1.0.8
 *
 * The file is read back from the release rather than from the run that built it:
 * what a reader downloads is a copy, and this is the only check that looks at the
 * copy, the way `check:apk` is the only one that looks at a published APK. What
 * is read out of it, and what would make it wrong, is decided in
 * src/lib/desktop-release.js; this is the part that opens the file and prints
 * the verdict, and it needs nothing on PATH, because the version a Windows
 * program carries is read out of the file itself rather than asked of a tool.
 *
 * That is why it runs anywhere: unlike the APK, which needs the Android build
 * tools and a JDK, this is one file read as bytes. A CI job can run it on Linux
 * just as well as on Windows, and a machine that only has Node can still read a
 * file somebody sent it.
 *
 * The version the tag names is worked out by the same script the Android tag
 * uses, so that one place decides what a version tag means rather than two.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { versionFromTag } from "./android-version.mjs";
import {
  PRODUCT_NAME,
  installerNameFor,
  isExecutable,
  isSigned,
  judgeInstaller,
  windowsVersionFrom,
} from "../src/lib/desktop-release.js";

/** What `--name value` reads, and where an argument was left out. */
function option(argv, name) {
  const at = argv.indexOf(`--${name}`);
  if (at === -1) return null;
  const value = argv[at + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`--${name} was given without a value.`);
  }
  return value;
}

/** A version is a name and an integer to Android and a name alone to Windows. */
function versionOf(tag) {
  return versionFromTag(tag).versionName;
}

function main() {
  const argv = process.argv.slice(2);
  const file = option(argv, "exe") ?? option(argv, "file");
  const tag = option(argv, "tag");
  if (!file) {
    throw new Error("Name the installer to read with --exe, like --exe Africa-History-Quest-Setup-1.0.8.exe.");
  }
  if (!tag) throw new Error("Name the tag the release is for with --tag, like --tag v1.0.8.");

  const version = versionOf(tag);
  const fileName = path.basename(file);
  const bytes = readFileSync(file);

  const versionInfo = windowsVersionFrom(bytes);
  const { faults, notes } = judgeInstaller({
    fileName,
    executable: isExecutable(bytes),
    versionInfo,
    signed: isSigned(bytes),
    expected: {
      tag,
      version,
      productName: PRODUCT_NAME,
      assetName: installerNameFor(version),
      signingRequired: argv.includes("--require-signature"),
    },
  });

  console.log(`installer: ${fileName}, released as ${tag} (${bytes.length} bytes)`);
  if (faults.length > 0) {
    console.error("\ninstaller: what is wrong with the file a reader would be given:\n");
    for (const fault of faults) console.error(`  x ${fault.rule}\n      ${fault.what}`);
    // What the file says about itself, because a finding about a file is only
    // actionable while the reading it came from is still on the screen.
    const shown = versionInfo ?? {};
    console.error("\ninstaller: what the file says about itself:\n");
    for (const [name, value] of Object.entries(shown)) {
      console.error(`  ${name}: ${value ?? "(absent)"}`);
    }
  } else {
    console.log(`\ninstaller: the file carries ${version} and names itself ${PRODUCT_NAME}`);
  }
  for (const note of notes) console.log(`  - ${note.rule} - ${note.what}`);

  process.exitCode = faults.length > 0 ? 1 : 0;
}

// The command runs only when this file is the program, so the module can be
// imported without an installer anywhere near it.
const isProgram = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isProgram) {
  try {
    main();
  } catch (error) {
    console.error(`installer: ${error.message}`);
    process.exitCode = 1;
  }
}
