/**
 * Whether the APK a release published is the one the tag promised.
 *
 *   npm run check:apk -- --apk africa-history-quest-1.0.7.apk --tag v1.0.7
 *
 * The file is read back from the release rather than from the run that built it:
 * what a device downloads is a copy, and this is the only check that looks at the
 * copy. What is read out of it, and what would make it wrong, is decided in
 * src/lib/apk-release.js; this is the part that needs two Android tools and a
 * keystore, and it is why that judgment is a plain module a test can drive.
 *
 * `aapt2` and `apksigner` come from the Android build tools and have to be on
 * PATH; `keytool` comes with a JDK. The signing key is read the same way the
 * build read it - the environment names android/app/build.gradle already uses,
 * ANDROID_KEYSTORE, ANDROID_KEY_ALIAS and ANDROID_KEYSTORE_PASSWORD - so that
 * the key is named in one vocabulary rather than two. Without a keystore the
 * signature is still read and it is said that it was not compared, which is the
 * honest answer rather than a pass.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { versionFromTag } from "./android-version.mjs";
import { apkNameFor } from "../src/lib/release-drift.js";
import { badgingFrom, judgeApk, signerFrom } from "../src/lib/apk-release.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

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

/**
 * A tool, run, with what it said handed back either way.
 *
 * `apksigner` exits non-zero on a file it cannot verify, and that is an answer
 * rather than a failure: the point of running it is to find out, and a file with
 * no signature is exactly the finding this check exists for. A tool that is not
 * installed is different - it is the run that is wrong, not the APK - and it is
 * said so at once rather than read as an unsigned file.
 */
function tool(command, args) {
  try {
    return { ok: true, out: execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) };
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${command} is not on PATH. Install the Android build tools (aapt2, apksigner) and a JDK (keytool) first.`);
    }
    return { ok: false, out: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

/**
 * The SHA-256 of the certificate the project signs with.
 *
 * `keytool -exportcert` writes the certificate itself, in DER, which is the same
 * bytes the digest `apksigner` prints is taken over: the two numbers can be
 * compared directly, with no certificate parsing in between and no chance of
 * reading one of them the other way round.
 */
function certificateOf(keystore, alias, password) {
  const der = execFileSync(
    "keytool",
    ["-exportcert", "-keystore", keystore, "-alias", alias, "-storepass", password],
    { stdio: ["ignore", "pipe", "ignore"] }
  );
  return createHash("sha256").update(der).digest("hex");
}

/** The application the file has to be, read from the build's own configuration. */
function applicationId() {
  const config = JSON.parse(readFileSync(path.join(ROOT, "capacitor.config.json"), "utf8"));
  return typeof config.appId === "string" ? config.appId : null;
}

async function main() {
  const argv = process.argv.slice(2);
  const apk = option(argv, "apk");
  const tag = option(argv, "tag");
  if (!apk) throw new Error("Name the file to read with --apk, like --apk africa-history-quest-1.0.7.apk.");
  if (!tag) throw new Error("Name the tag the release is for with --tag, like --tag v1.0.7.");

  const version = versionFromTag(tag);
  const fileName = path.basename(apk);
  const appId = option(argv, "app-id") ?? applicationId();

  // The key, named the way the build names it; a fingerprint may stand in for it
  // when somebody has the key elsewhere or only knows its digest.
  const keystore = option(argv, "keystore") ?? process.env.ANDROID_KEYSTORE ?? null;
  const alias = option(argv, "alias") ?? process.env.ANDROID_KEY_ALIAS ?? null;
  const password = option(argv, "storepass") ?? process.env.ANDROID_KEYSTORE_PASSWORD ?? null;
  let certificate = option(argv, "certificate");
  if (!certificate && keystore && alias && password) {
    certificate = certificateOf(keystore, alias, password);
  }

  const badging = tool("aapt2", ["dump", "badging", apk]);
  const certs = tool("apksigner", ["verify", "--print-certs", apk]);

  const { faults, notes } = judgeApk({
    fileName,
    badging: badgingFrom(badging.out),
    signer: signerFrom(certs.out),
    expected: {
      tag,
      appId,
      versionName: version.versionName,
      versionCode: version.versionCode,
      assetName: apkNameFor(version.versionName),
      certificateSha256: certificate ? certificate.toLowerCase() : null,
    },
  });

  console.log(`apk: ${fileName}, released as ${tag}`);
  if (faults.length > 0) {
    console.error("\napk: what is wrong with the file a device would be given:\n");
    for (const fault of faults) console.error(`  x ${fault.rule}\n      ${fault.what}`);
  } else {
    console.log(`\napk: the file is signed with this project's key and carries ${version.versionName} / ${version.versionCode}`);
  }
  for (const note of notes) console.log(`  - ${note.rule} - ${note.what}`);

  process.exitCode = faults.length > 0 ? 1 : 0;
}

// The command runs only when this file is the program, so the module can be
// imported without a keystore, a tool or an APK anywhere near it.
const isProgram = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isProgram) {
  main().catch((error) => {
    console.error(`apk: ${error.message}`);
    process.exitCode = 1;
  });
}
