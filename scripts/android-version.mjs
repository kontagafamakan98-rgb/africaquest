/**
 * Writes the version an Android build carries, from the tag that names it.
 *
 *   npm run android:version -- v1.2.3
 *
 * A build by hand reads android/version.properties as it is committed, and this
 * writes that same file from a version tag, so the APK a release carries says
 * the version the release is named after. The arithmetic lives here rather than
 * in the workflow because a version is arithmetic, and YAML is a poor place to
 * do arithmetic: this way it is read by a test before it is read by a runner.
 *
 * Android orders updates by `versionCode`, an integer, and shows `versionName`,
 * the string a person reads. Both come from the same three numbers, so the two
 * can never disagree about which build is the newer one.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_FILE = path.join(ROOT, "android", "version.properties");

// A version tag is `v<major>.<minor>.<patch>` and nothing else. A shape with a
// suffix in it ("-beta", "+build.4") would need rules about which half of it is
// the version, and an app that reports a name nobody can reconstruct from the
// tag is worse than a tag refused here, in the run that pushed it.
const TAG = /^v?(\d+)\.(\d+)\.(\d+)$/;

// The integer Android compares. A major takes a hundred minor places and a minor
// a hundred patches, so v1.2.3 is 10203 and any later tag is a larger number.
// Android refuses a version code above 2100000000, which is the ceiling checked
// below rather than left to a build that fails in Gradle.
const MAJOR_STEP = 10000;
const MINOR_STEP = 100;
const SMALLEST_STEP = 100;
const LARGEST_VERSION_CODE = 2100000000;

/** The version a tag names, as Android reads it: an integer and a name. */
export function versionFromTag(tag) {
  const match = TAG.exec(String(tag ?? "").trim());
  if (!match) {
    throw new Error(
      `"${tag ?? ""}" is not a version tag. A version tag is v<major>.<minor>.<patch>, like v1.0.0.`
    );
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (minor >= SMALLEST_STEP || patch >= SMALLEST_STEP) {
    throw new Error(
      `"${tag}" would need more room than a version number has: the minor and the patch each hold two digits.`
    );
  }

  const versionCode = major * MAJOR_STEP + minor * MINOR_STEP + patch;
  if (versionCode > LARGEST_VERSION_CODE) {
    throw new Error(
      `"${tag}" is versionCode ${versionCode}, and Android refuses anything above ${LARGEST_VERSION_CODE}.`
    );
  }

  return { versionName: `${major}.${minor}.${patch}`, versionCode };
}

/**
 * The file as it is written. The name of each property is the one
 * android/app/build.gradle reads, and the comment travels with the numbers so
 * that the file explains itself on the machine that has it.
 */
export function versionFile({ versionCode, versionName }) {
  return [
    "# The version the installed application carries.",
    "#",
    "# Read by android/app/build.gradle. Committed so that a build by hand carries",
    "# something, and rewritten from the version tag that started the build, by",
    "# scripts/android-version.mjs. The integer is major * 10000 + minor * 100 +",
    "# patch, which is what Android orders updates by, and the name is the tag",
    "# without its v.",
    `versionCode=${versionCode}`,
    `versionName=${versionName}`,
    "",
  ].join("\n");
}

/** The tag's version, written where Gradle looks for it. */
export function writeVersion(tag, target = VERSION_FILE) {
  const version = versionFromTag(tag);
  writeFileSync(target, versionFile(version));
  return version;
}

// The command runs only when this file is the program, so a test can read what
// it would write without touching the checkout.
const isProgram = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isProgram) {
  const tag = process.argv[2];
  if (!tag) {
    console.error('android-version: name the tag the version comes from, like "v1.0.0".');
    process.exit(1);
  }

  try {
    const { versionCode, versionName } = writeVersion(tag);
    console.log(
      `android-version: ${tag} is versionName ${versionName} / versionCode ${versionCode}, in android/version.properties`
    );
  } catch (error) {
    console.error(`android-version: ${error.message}`);
    process.exit(1);
  }
}
