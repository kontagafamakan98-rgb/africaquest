/**
 * Whether the APK a release carries is the one the tag promised.
 *
 * The APK is built, signed and attached to a release by `.github/workflows/
 * android.yml`, and until it is read back from the release nobody has looked at
 * the file a device will actually be given. Every step before this one works on
 * what the build produced: the artifact the signed build kept, the name it was
 * uploaded under, the notes beside it. The file on the release page is a copy,
 * and a copy is where three failures live that nothing else would catch.
 *
 * - The version. The whole promise of a version tag is that the installed app
 *   reports the tag's three numbers, and that Android orders updates by the same
 *   arithmetic. A build that read the wrong `version.properties`, or a tag that
 *   was published with the APK of the release before it, says a name and an
 *   integer that a person and a device would each read differently.
 * - The signature. A device refuses an APK with no signature, and it refuses an
 *   update signed with a key other than the one that installed it. The key lives
 *   in repository secrets and is used once, at build time; this reads the
 *   certificate back out of the published file and asks whether it is the
 *   project's key. That is the one check that makes "the key was lost" a red run
 *   rather than a support message six months later.
 * - The name. A reader is told the file is `africa-history-quest-<version>.apk`,
 *   and two releases arriving on one disk as two files of the same name is the
 *   small version of the same mistake as a version that is not the tag's.
 *
 * Plain module: no files, no tools, no network. `aapt2` and `apksigner` print
 * text, and reading that text is what happens here; running them, and hashing
 * the project's own certificate with `keytool`, is the script's job. That split
 * is what lets the judgment be tested with the output of a tool nobody has to
 * install to run the tests.
 */

/**
 * What a build says about itself, read from `aapt2 dump badging`.
 *
 * The tool prints one line per fact, and the package line is the one that names
 * the application and its two version numbers:
 *
 *   package: name='com.africaquest.app' versionCode='10007' versionName='1.0.7' ...
 *
 * Each value is read with the space in front of its name, because the same line
 * carries several facts whose names end in those words - `Codename='15'`,
 * `platformBuildVersionCode='35'` - and matching the tail of one of those would
 * read the platform the app was compiled against as the version it installed as.
 *
 * @param {string} text what `aapt2 dump badging` printed
 * @returns {{ appId: string|null, versionName: string|null, versionCode: number|null }|null}
 *   what the package line said, or nothing when there was no package line
 */
export function badgingFrom(text) {
  const line = String(text)
    .split("\n")
    .find((one) => one.startsWith("package:"));
  if (!line) return null;

  const read = (name) => {
    const match = new RegExp(` ${name}='([^']*)'`).exec(line);
    return match ? match[1] : null;
  };

  const code = read("versionCode");
  return {
    appId: read("name"),
    versionName: read("versionName"),
    versionCode: code === null ? null : Number(code),
  };
}

/**
 * The certificate an APK is signed with, read from `apksigner verify --print-certs`.
 *
 * The digest is the SHA-256 of the signer's X.509 certificate, which is the same
 * number the project's own keystore has: it is what makes the comparison below a
 * statement about keys rather than about signatures in general. A file that does
 * not verify carries no signer, so both the flag and the digest are read and
 * either being missing is the same finding.
 *
 * @param {string} text what `apksigner verify --print-certs` printed
 * @returns {{ verified: boolean, sha256: string|null, dn: string|null, schemes: string[] }}
 *   whether it verified, who signed it, and which schemes say so
 */
export function signerFrom(text) {
  const printed = String(text);
  const digest = /Signer #1 certificate SHA-256 digest:\s*([0-9a-fA-F]{2,})/.exec(printed);
  const name = /Signer #1 certificate DN:\s*(.+)/.exec(printed);
  const schemes = ["v1", "v2", "v3", "v4"].filter((scheme) =>
    new RegExp(`Verified using ${scheme} scheme \\([^)]*\\): true`).test(printed)
  );

  return {
    // `apksigner` prints "Verifies" on its own line when the file verifies, and
    // exits non-zero with "DOES NOT VERIFY" when it does not. The line may end in
    // a carriage return, since a tool that writes to a console writes whichever
    // ending that console wants.
    verified: /^Verifies\r?$/m.test(printed),
    sha256: digest ? digest[1].toLowerCase() : null,
    dn: name ? name[1].trim() : null,
    schemes,
  };
}

/**
 * Whether the published file is the release the tag named.
 *
 * @param {object} read what was read out of the published file
 * @param {string} read.fileName the name the file is published under
 * @param {ReturnType<typeof badgingFrom>} read.badging the package line, or nothing
 * @param {ReturnType<typeof signerFrom>} read.signer the signature, as `apksigner` saw it
 * @param {object} read.expected what the tag promised
 * @param {string} read.expected.tag the tag the release is named after
 * @param {string|null} read.expected.appId the application the file has to be, or null to skip
 * @param {string} read.expected.versionName the name the tag names, like "1.0.7"
 * @param {number} read.expected.versionCode the integer the tag names, like 10007
 * @param {string|null} read.expected.assetName the file name the release should carry, or null to skip
 * @param {string|null} read.expected.certificateSha256 the project's certificate, or null when unknown
 * @returns {{ faults: {rule: string, what: string}[], notes: {rule: string, what: string}[] }}
 */
export function judgeApk({ fileName, badging, signer, expected }) {
  const faults = [];
  const notes = [];

  if (!badging) {
    faults.push({
      rule: "the published APK does not read as a package",
      what: "no package line was found in what aapt2 printed about it",
    });
    return { faults, notes };
  }

  // The application the file has to be. A release whose asset is another build
  // entirely would otherwise pass everything below, since a wrong APK still has
  // a version and a signature.
  if (expected.appId && badging.appId !== expected.appId) {
    faults.push({
      rule: "the published APK is another application",
      what: `it is ${badging.appId}, and this application is ${expected.appId}`,
    });
  }

  // The version, both numbers, in one finding: they come out of the same tag and
  // a file that disagrees about one disagrees about the release.
  if (badging.versionName !== expected.versionName || badging.versionCode !== expected.versionCode) {
    faults.push({
      rule: "the published APK says another version than the tag",
      what: `it is ${badging.versionName ?? "no name"} / ${badging.versionCode ?? "no integer"}, and ${expected.tag} names ${expected.versionName} / ${expected.versionCode}`,
    });
  }

  // The name a reader is told. It is not what the file is, which is the version
  // above; it is what two releases arriving on one disk are told apart by.
  if (expected.assetName && fileName && fileName !== expected.assetName) {
    faults.push({
      rule: "the release carries the APK under a name the version does not make",
      what: `it is ${fileName}, and the version it says names the file ${expected.assetName}`,
    });
  }

  if (!signer.verified || !signer.sha256) {
    faults.push({
      rule: "the published APK is not signed with anything a device will trust",
      what: signer.verified
        ? "apksigner verified the file but named no signer"
        : "apksigner did not verify the file: it carries no signature, or one that is broken",
    });
  } else if (expected.certificateSha256 && signer.sha256 !== expected.certificateSha256) {
    faults.push({
      rule: "the published APK is signed with a key that is not this project's",
      what: `its certificate is ${signer.sha256}, and the signing key's is ${expected.certificateSha256}`,
    });
  } else if (!expected.certificateSha256) {
    notes.push({
      rule: "the signature was read but not compared",
      what: "no keystore was given, so the file is signed and that is all that can be said",
    });
  }

  if (signer.verified && signer.schemes.length > 0) {
    notes.push({
      rule: "the schemes the signature carries",
      what: signer.schemes.join(", "),
    });
  }

  return { faults, notes };
}
