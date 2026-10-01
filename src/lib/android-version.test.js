import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { versionFile, versionFromTag, writeVersion } from "../../scripts/android-version.mjs";

// The version an installed app carries is decided by the tag that released it,
// and the two numbers a device reads are both made out of that one string:
// versionCode, which Android orders updates by, and versionName, which a person
// reads. Get the integer wrong and a device either refuses the update or offers
// an older one as newer, in a way nobody notices until the day it matters, so
// the arithmetic is held here rather than trusted to the run that pushed a tag.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const VERSION_FILE = path.join(ROOT, "android", "version.properties");
const APP_GRADLE = path.join(ROOT, "android", "app", "build.gradle");

test("a version tag becomes the integer a device orders updates by and the name a person reads", () => {
  assert.deepEqual(versionFromTag("v1.0.0"), { versionName: "1.0.0", versionCode: 10000 });

  // The v is how this project writes a tag, and how a shell hands it over; the
  // version is the same either way.
  assert.deepEqual(versionFromTag("1.0.0"), { versionName: "1.0.0", versionCode: 10000 });

  // A later tag is a larger number, which is the whole point of the shape: the
  // patch, the minor and the major each carry more weight than everything below
  // them together.
  const ordered = ["v1.0.0", "v1.0.1", "v1.0.99", "v1.1.0", "v1.99.99", "v2.0.0", "v10.0.0"];
  const codes = ordered.map((tag) => versionFromTag(tag).versionCode);
  const sorted = [...codes].sort((left, right) => left - right);
  assert.deepEqual(codes, sorted, `${ordered.join(", ")} do not sort in the order they were released`);
  assert.equal(new Set(codes).size, codes.length, "two tags name the same version code");

  assert.deepEqual(versionFromTag("v1.2.3"), { versionName: "1.2.3", versionCode: 10203 });
  assert.deepEqual(versionFromTag("v2.10.3"), { versionName: "2.10.3", versionCode: 21003 });
  assert.deepEqual(versionFromTag("  v1.2.3\n"), { versionName: "1.2.3", versionCode: 10203 });
  assert.equal(versionFromTag("v01.02.03").versionName, "1.2.3", "a padded tag is not normalised");
});

test("a tag that is not a version is refused rather than guessed at", () => {
  // A guess would ship an APK whose version nobody can reconstruct from the tag,
  // and the failure would be a device telling somebody their update is already
  // installed. The run that pushed the tag is where it can still be seen.
  for (const tag of ["", "  ", "main", "v1", "v1.0", "v1.0.0.0", "version-1.0.0", "1.0.0-rc.1", "v1.0.0-beta"]) {
    assert.throws(() => versionFromTag(tag), undefined, `"${tag}" was read as a version`);
  }

  assert.throws(() => versionFromTag(undefined), undefined, "no tag at all was read as a version");
  assert.throws(() => versionFromTag(null), undefined, "a missing tag was read as a version");

  // The message names the tag, because the run it appears in is often the only
  // place the tag is written down.
  assert.throws(() => versionFromTag("v1.0"), /"v1\.0"/, "the refusal does not say which tag it read");
});

test("the version Android would refuse is refused before Gradle sees it", () => {
  // Android refuses a version code above 2100000000, and two digits are all the
  // minor and the patch have room for. Both are arithmetic on the tag, so both
  // are checked where the arithmetic is.
  assert.equal(versionFromTag("v210000.0.0").versionCode, 2100000000, "the ceiling itself is allowed");
  assert.throws(() => versionFromTag("v210001.0.0"), /Android refuses/, "a version code past the ceiling was accepted");
  assert.throws(() => versionFromTag("v1.100.0"), /two digits/, "a minor of three digits was accepted");
  assert.throws(() => versionFromTag("v1.0.100"), /two digits/, "a patch of three digits was accepted");
});

test("the file the tag is written into is the file Gradle reads", () => {
  const written = mkdtempSync(path.join(tmpdir(), "android-version-"));
  const file = path.join(written, "version.properties");

  const version = writeVersion("v2.5.1", file);
  assert.deepEqual(version, { versionName: "2.5.1", versionCode: 20501 });

  const text = readFileSync(file, "utf8");
  assert.match(text, /^versionCode=20501$/m, "the integer is not in the file");
  assert.match(text, /^versionName=2\.5\.1$/m, "the name is not in the file");
  assert.ok(text.endsWith("\n"), "the file does not end in a newline");

  // Gradle's own format, which is what makes the two files interchangeable: a
  // line the loader cannot read is a build that carries the fallback version
  // instead of the tag's, and says nothing about it.
  const properties = Object.fromEntries(
    text
      .split("\n")
      .filter((line) => line.trim() !== "" && !line.startsWith("#"))
      .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)])
  );
  assert.deepEqual(Object.keys(properties).sort(), ["versionCode", "versionName"], "the file carries something else");
  assert.equal(properties.versionCode, "20501");
});

test("the version committed for a build by hand agrees with itself", () => {
  // The file in the repository is what `./gradlew assembleRelease` carries on a
  // machine that has no tag to work from. Its two numbers have to agree, or the
  // build says one version and orders as another.
  const committed = readFileSync(VERSION_FILE, "utf8");
  const [, code] = /^versionCode=(\d+)$/m.exec(committed) ?? [];
  const [, name] = /^versionName=(.+)$/m.exec(committed) ?? [];

  assert.ok(code, "android/version.properties has no versionCode");
  assert.ok(name, "android/version.properties has no versionName");

  assert.equal(
    Number(code),
    versionFromTag(`v${name.trim()}`).versionCode,
    `versionName ${name.trim()} and versionCode ${code} are not the same version`
  );
  assert.equal(
    versionFile({ versionCode: Number(code), versionName: name.trim() }),
    committed,
    "android/version.properties is not in the shape the script writes, so a rewrite would show a difference"
  );
});

test("the Android build reads the version and the key from where the workflow puts them", () => {
  // The script, the Gradle file and the workflow are one mechanism split across
  // three files, and nothing else reads them together: a property renamed in one
  // of them is a build that quietly carries the fallback version, or an unsigned
  // APK accepted as a signed one.
  const gradle = readFileSync(APP_GRADLE, "utf8");

  assert.match(gradle, /rootProject\.file\('version\.properties'\)/, "the build does not read the version file");
  assert.match(gradle, /versionPropertiesFile\.withInputStream/, "the version file is not loaded as properties");

  // Through the root project's extension, not through variables of the script.
  // A Gradle DSL closure answers a name the plugin also knows with the plugin's
  // own, and `version` is one of those: a plain `def version` is not the version
  // the Android block reads, which is a build that fails on a null instead of a
  // build that signs nothing.
  assert.match(
    gradle,
    /rootProject\.ext\.appVersionCode = \(versionProperties\.getProperty\('versionCode'\) \?: '1'\) as Integer/,
    "the build does not take its integer from the file"
  );
  assert.match(gradle, /versionCode rootProject\.ext\.appVersionCode/, "the Android block does not read that integer");
  assert.match(gradle, /versionName rootProject\.ext\.appVersionName/, "the Android block does not read that name");

  // The four names the workflow hands over, and the file name the version file
  // and the script agree on without either of them importing the other.
  for (const name of ["ANDROID_KEYSTORE", "ANDROID_KEYSTORE_PASSWORD", "ANDROID_KEY_ALIAS", "ANDROID_KEY_PASSWORD"]) {
    assert.match(gradle, new RegExp(`fromEnvironment\\('${name}'\\)`), `the build never reads ${name}`);
  }
  assert.match(gradle, /storeFile file\(rootProject\.ext\.appKeystore\)/, "the key file is not the one the environment names");
  assert.match(
    gradle,
    /if \(rootProject\.ext\.appSigned\) \{\n\s+signingConfig signingConfigs\.release/,
    "the release build type is not signed when there is a key"
  );
  assert.match(
    gradle,
    /file\(rootProject\.ext\.appKeystore\)\.exists\(\)/,
    "a key that is not there is signed with anyway"
  );
});
