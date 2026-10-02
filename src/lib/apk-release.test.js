import test from "node:test";
import assert from "node:assert/strict";
import { badgingFrom, judgeApk, signerFrom } from "./apk-release.js";

// Whether the file a release hands a device is the one the tag promised.
//
// The reading of the file needs `aapt2` and `apksigner`, which is the script's
// job; the judgment needs neither, so it is here, driven by the text those tools
// really print. The outputs below are the shapes of aapt2 and apksigner, cut to
// the lines this module reads, so that a rule is tested against what a tool says
// rather than against a summary of it.

const BADGING = `package: name='com.africaquest.app' versionCode='10007' versionName='1.0.7' platformBuildVersionName='15' platformBuildVersionCode='35' compileSdkVersion='35' compileSdkVersionCodename='15'
sdkVersion:'23'
targetSdkVersion:'35'
application-label:'Africa History Quest'
`;

const CERTS = `Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): true
Verified using v4 scheme (APK Signature Scheme v4): false
Number of signers: 1
Signer #1 certificate DN: CN=Africa Quest, O=Africa History Quest
Signer #1 certificate SHA-256 digest: 4a6ade807d1ffd707203c3c91f70b73e9f73d8a79429074c5f6e50e8d60204fe
Signer #1 certificate SHA-1 digest: 0123456789abcdef
`;

const expected = (over = {}) => ({
  tag: "v1.0.7",
  appId: "com.africaquest.app",
  versionName: "1.0.7",
  versionCode: 10007,
  assetName: "africa-history-quest-1.0.7.apk",
  certificateSha256: "4a6ade807d1ffd707203c3c91f70b73e9f73d8a79429074c5f6e50e8d60204fe",
  ...over,
});

const judge = (over = {}) =>
  judgeApk({
    fileName: "africa-history-quest-1.0.7.apk",
    badging: badgingFrom(BADGING),
    signer: signerFrom(CERTS),
    verified: true,
    expected: expected(),
    ...over,
  });

test("the package line is read, and the platform is not mistaken for the version", () => {
  const read = badgingFrom(BADGING);
  assert.deepEqual(read, { appId: "com.africaquest.app", versionName: "1.0.7", versionCode: 10007 });

  // The same line carries `platformBuildVersionName='15'` and
  // `compileSdkVersionCodename='15'`, which end in the words being searched for.
  assert.notEqual(read.versionName, "15", "the platform was read as the version name");
  assert.notEqual(read.appId, "15", "a compile-sdk name was read as the application");

  assert.equal(badgingFrom("sdkVersion:'23'\n"), null, "a file with no package line was read as one");
  assert.equal(badgingFrom(""), null, "empty input was read as a package");
});

test("the key the file was signed with is read from what apksigner printed", () => {
  const signer = signerFrom(CERTS);
  assert.equal(signer.sha256, "4a6ade807d1ffd707203c3c91f70b73e9f73d8a79429074c5f6e50e8d60204fe");
  assert.equal(signer.dn, "CN=Africa Quest, O=Africa History Quest");
  assert.deepEqual(signer.schemes, ["v2", "v3"], "the schemes that say the file is signed");

  // A tool that writes to a console writes the line ending that console wants.
  const windows = signerFrom(CERTS.replace(/\n/g, "\r\n"));
  assert.equal(windows.sha256, signer.sha256, "a carriage return hid the certificate");
  assert.equal(windows.dn, signer.dn, "a carriage return was kept in the name");

  const unsigned = signerFrom("DOES NOT VERIFY\nERROR: Missing META-INF/MANIFEST.MF\n");
  assert.equal(unsigned.sha256, null, "a file that does not verify named a signer");
});

test("the APK the tag promised passes with nothing to say", () => {
  assert.deepEqual(judge(), {
    faults: [],
    notes: [{ rule: "the schemes the signature carries", what: "v2, v3" }],
  });
});

test("a published file that says another version than the tag fails", () => {
  const stale = badgingFrom(BADGING.replace("versionCode='10007' versionName='1.0.7'", "versionCode='10006' versionName='1.0.6'"));
  const { faults } = judgeApk({
    fileName: "africa-history-quest-1.0.7.apk",
    badging: stale,
    signer: signerFrom(CERTS),
    verified: true,
    expected: expected(),
  });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /another version than the tag/);
  assert.match(faults[0].what, /1\.0\.6/, "the version it really is is not named");
  assert.match(faults[0].what, /v1\.0\.7 names 1\.0\.7/, "the version the tag names is not named");
});

test("an APK signed with a key that is not the project's fails", () => {
  const { faults } = judge({
    signer: signerFrom(CERTS.replace("4a6ade80", "deadbeef")),
  });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /a key that is not this project's/);
  assert.match(faults[0].what, /deadbeef/, "the certificate it really carries is not shown");
});

test("a file with no signature fails, whatever else it says", () => {
  const { faults } = judge({ signer: signerFrom("DOES NOT VERIFY\n"), verified: false });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /not signed with anything a device will trust/);
});

test("whether the file verifies is the tool's exit status, and not something read out of its words", () => {
  // This is the fault the check shipped with. A quiet `apksigner` prints the
  // certificate and no verdict at all - the verdict is its exit status - so a
  // reading of the words found nothing to trust and reported a signed release as
  // unsigned. The words are enough to name the key, and they are not enough to
  // say that the key was ever checked.
  const { faults } = judge({ verified: false });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /not signed with anything a device will trust/);
  assert.match(faults[0].what, /did not verify the file/, "the reading of the words was reported as the verdict");
});

test("another application is caught even when its version and key are right", () => {
  const other = badgingFrom(BADGING.replace("com.africaquest.app", "com.example.other"));
  const { faults } = judge({ badging: other });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /another application/);
});

test("the file a release carries is named for the version it holds", () => {
  const { faults } = judge({ fileName: "app-release.apk" });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /under a name the version does not make/);
  assert.match(faults[0].what, /africa-history-quest-1\.0\.7\.apk/, "the name it should carry is not shown");
});

test("with no keystore the signature is read and the comparison is said to have been skipped", () => {
  const { faults, notes } = judge({ expected: expected({ certificateSha256: null }) });

  assert.deepEqual(faults, [], "an uncompared signature was reported as a failure");
  assert.ok(
    notes.some((note) => /not compared/.test(note.rule)),
    "nothing said that the key was never compared"
  );
});

test("a file that is not a package at all fails rather than passing on nothing", () => {
  const { faults } = judge({ badging: null });

  assert.equal(faults.length, 1);
  assert.match(faults[0].rule, /does not read as a package/);
});
