/**
 * Whether the Windows installer a release carries is the one the tag promised.
 *
 * The installer is built, assembled and attached to a release by
 * `.github/workflows/desktop.yml`, and until it is read back from the release
 * nobody has looked at the file a person will actually download. Every step
 * before this one works on what the build produced: the artifact the build kept,
 * the name it was uploaded under, the version the manifest was given. The file
 * on the release page is a copy, and a copy is where three failures live that
 * nothing else would catch.
 *
 * - The version. The whole promise of a version tag is that the installed
 *   program reports the tag's three numbers, and that Windows shows the same
 *   numbers in Apps and features. A build that read the wrong `package.json`, or
 *   a tag published with the installer of the release before it, says a version
 *   the tag never named.
 * - The program. A release whose asset is another build entirely would otherwise
 *   pass everything below, since a wrong installer still has a version and a
 *   name. The one thing that tells this project's installer from a stranger's is
 *   what the file says about itself.
 * - The name. A reader is told the file is
 *   `Africa-History-Quest-Setup-<version>.exe`, and two releases arriving on one
 *   disk as two files of the same name is the small version of the same mistake
 *   as a version that is not the tag's.
 *
 * Plain module: no files, no tools, no network. What is read here is the file
 * itself, byte by byte: the version a Windows program carries lives in a
 * resource inside it, and this project reads that resource rather than shelling
 * out to PowerShell, so the judgment can be tested on a buffer a test builds and
 * so the same check runs on any machine rather than only on Windows.
 */

/** The program the installer has to be, as Windows shows it in its properties. */
export const PRODUCT_NAME = "Africa History Quest";

/** The stem of the file name the release carries, before the version and `.exe`. */
export const INSTALLER_STEM = "Africa-History-Quest-Setup";

/** The key the whole version resource hangs from, found before anything inside it. */
const VERSION_ROOT = "VS_VERSION_INFO";

/** The two bytes every Windows program starts with, and where the PE header is. */
const DOS_MAGIC = [0x4d, 0x5a];
const PE_SIGNATURE = [0x50, 0x45, 0x00, 0x00];

/**
 * The name of the installer a release of this version carries.
 *
 * electron-builder writes this name from `artifactName` in electron-builder.yml
 * and the workflow uploads the file under it; the two are held together by a
 * test, so a version and its file name can never drift apart in one place and
 * agree in another.
 */
export function installerNameFor(version) {
  return `${INSTALLER_STEM}-${String(version).trim()}.exe`;
}

/** A file as bytes, whether it arrived as a Node Buffer or any other view. */
function asBytes(file) {
  return file instanceof Uint8Array ? file : new Uint8Array(0);
}

/** Two bytes little endian, the way a PE header writes a word. */
function readU16(bytes, at) {
  return bytes[at] | (bytes[at + 1] << 8);
}

/** Four bytes little endian, the way a PE header writes a double word. */
function readU32(bytes, at) {
  return (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;
}

/**
 * Where a piece of text written in UTF-16 starts, or -1.
 *
 * The resource a Windows program keeps its version in is written in UTF-16, two
 * bytes to the character, and every string in it ends with a null character. The
 * search looks for the text together with that terminator, which is what keeps
 * the name of one fact from being found inside the value of another.
 */
function findUtf16(bytes, text, from, to) {
  const needle = [];
  for (let at = 0; at < text.length; at += 1) {
    const unit = text.charCodeAt(at);
    needle.push(unit & 0xff, (unit >> 8) & 0xff);
  }
  needle.push(0, 0);

  outer: for (let at = from; at + needle.length <= to; at += 1) {
    for (let index = 0; index < needle.length; index += 1) {
      if (bytes[at + index] !== needle[index]) continue outer;
    }
    return at;
  }
  return -1;
}

/** The characters at an offset, up to the null that ends them. */
function decodeUtf16(bytes, at, length) {
  let text = "";
  for (let index = 0; index < length; index += 1) {
    const unit = readU16(bytes, at + index * 2);
    if (unit === 0) break;
    text += String.fromCharCode(unit);
  }
  return text;
}

/** Whether the bytes begin with the two headers every Windows program begins with. */
export function isExecutable(file) {
  const bytes = asBytes(file);
  if (bytes.length < 0x40) return false;
  if (DOS_MAGIC.some((byte, at) => bytes[at] !== byte)) return false;

  const pe = readU32(bytes, 0x3c);
  if (pe + PE_SIGNATURE.length > bytes.length) return false;
  return PE_SIGNATURE.every((byte, at) => bytes[pe + at] === byte);
}

/**
 * Whether the program carries an Authenticode signature.
 *
 * Windows keeps a signature in the certificate table, one of the directories in
 * the program's optional header, and that directory is empty on a program that
 * was never signed. This reads the directory rather than verifying the
 * signature: what it answers is whether there is one at all, which is the fact
 * this project has to state, since its installer is deliberately unsigned.
 */
export function isSigned(file) {
  const bytes = asBytes(file);
  if (!isExecutable(bytes)) return false;

  const optional = readU32(bytes, 0x3c) + 24;
  if (optional + 2 > bytes.length) return false;

  // A program made for a 32 bit machine and one made for a 64 bit machine put
  // their directory table at different offsets, and the first word says which
  // of the two this is. 0x20b is the 64 bit one; anything else here is read as
  // the 32 bit one, which is the header this project's installer carries.
  const dataDirectories = readU16(bytes, optional) === 0x20b ? optional + 112 : optional + 96;
  // The certificate table is the fifth directory, and each one is eight bytes:
  // where the table is, and how long it is. An unsigned program has both zero.
  const certificate = dataDirectories + 4 * 8;
  if (certificate + 8 > bytes.length) return false;

  return readU32(bytes, certificate) !== 0 && readU32(bytes, certificate + 4) !== 0;
}

/**
 * What the program says about itself, read from its version resource.
 *
 * The resource is a small tree, and what is read here is the leaves: the strings
 * a reader sees in the file's properties. The tree begins at `VS_VERSION_INFO`
 * and the length of that block is written beside it, which is the window the
 * leaves are searched in rather than the whole of a file that may be a hundred
 * megabytes.
 *
 * Each string sits behind a small header that names it, and the value follows the
 * name at the next four byte boundary. That alignment is what decides where the
 * value begins, which is why it is worked out rather than guessed: the header is
 * six bytes, so the string's own start minus six is where the boundary is counted
 * from.
 *
 * @param {Uint8Array} file the program, as bytes
 * @returns {{ productName: string|null, companyName: string|null, fileVersion: string|null, productVersion: string|null, legalCopyright: string|null, fileDescription: string|null }|null}
 *   what the program says, or nothing when it is not a Windows program or carries no version
 */
export function windowsVersionFrom(file) {
  const bytes = asBytes(file);
  if (!isExecutable(bytes)) return null;

  const root = findUtf16(bytes, VERSION_ROOT, 0, bytes.length);
  if (root < 6) return null;
  const start = root - 6;
  const length = readU16(bytes, start);
  const end = length > 0 ? Math.min(bytes.length, start + length) : bytes.length;

  const value = (name) => {
    const at = findUtf16(bytes, name, start, end);
    if (at < 0) return null;
    const header = at - 6;
    const size = readU16(bytes, header + 2);
    let valueAt = at + (name.length + 1) * 2;
    valueAt += (4 - ((valueAt - header) % 4)) % 4;
    const text = decodeUtf16(bytes, valueAt, size);
    return text.length > 0 ? text : null;
  };

  return {
    productName: value("ProductName"),
    companyName: value("CompanyName"),
    fileVersion: value("FileVersion"),
    productVersion: value("ProductVersion"),
    legalCopyright: value("LegalCopyright"),
    fileDescription: value("FileDescription"),
  };
}

/**
 * Whether the published file is the release the tag named.
 *
 * @param {object} read what was read out of the published file
 * @param {string} read.fileName the name the file is published under
 * @param {boolean} read.executable whether the file is a Windows program at all
 * @param {ReturnType<typeof windowsVersionFrom>} read.versionInfo what the program says about itself, or nothing
 * @param {boolean} read.signed whether the program carries a signature
 * @param {object} read.expected what the tag promised
 * @param {string} read.expected.tag the tag the release is named after
 * @param {string} read.expected.version the version the tag names, like "1.0.8"
 * @param {string|null} read.expected.productName the program the file has to be, or null to skip
 * @param {string|null} read.expected.assetName the file name the release should carry, or null to skip
 * @param {boolean} [read.expected.signingRequired] whether a missing signature is a fault rather than a fact
 * @returns {{ faults: {rule: string, what: string}[], notes: {rule: string, what: string}[] }}
 */
export function judgeInstaller({ fileName, executable, versionInfo, signed, expected }) {
  const faults = [];
  const notes = [];

  if (!executable) {
    faults.push({
      rule: "the published installer is not a Windows program",
      what: "the file does not begin with the headers every Windows program begins with, so what the release carries is not an installer at all",
    });
    return { faults, notes };
  }

  if (!versionInfo) {
    faults.push({
      rule: "the published installer carries no version",
      what: "no version resource was found in the file, so nothing inside it says which release it is",
    });
    return { faults, notes };
  }

  // The program the file has to be. A release whose asset is another build
  // entirely would otherwise pass everything below, since a wrong installer
  // still has a version and a name.
  if (expected.productName && versionInfo.productName !== expected.productName) {
    faults.push({
      rule: "the published installer is another program",
      what: `it says ${versionInfo.productName ?? "nothing"} as its name, and this application is ${expected.productName}`,
    });
  }

  // The version, both numbers, in one finding: electron-builder writes the same
  // version into the file's own version and into its product version, and a file
  // that disagrees about one disagrees about the release.
  if (versionInfo.fileVersion !== expected.version || versionInfo.productVersion !== expected.version) {
    faults.push({
      rule: "the published installer says another version than the tag",
      what: `it is ${versionInfo.productVersion ?? "no version"} as a product and ${versionInfo.fileVersion ?? "no version"} as a file, and ${expected.tag} names ${expected.version}`,
    });
  }

  // The name a reader is told. It is not what the file is, which is the version
  // above; it is what two releases arriving on one disk are told apart by.
  if (expected.assetName && fileName && fileName !== expected.assetName) {
    faults.push({
      rule: "the release carries the installer under a name the version does not make",
      what: `it is ${fileName}, and the version it says names the file ${expected.assetName}`,
    });
  }

  // The signature, said rather than demanded: this project's installer is not
  // code signed, and that is a decision written down in WINDOWS_RELEASE.md, so a
  // missing signature is the ordinary state and is reported as one. A run that
  // wants it to be a gate asks for that, which is how the same check becomes the
  // one a signed build would need without a second check being written.
  if (signed) {
    notes.push({
      rule: "the installer is code signed",
      what: "it carries an Authenticode signature, and which certificate signed it is not read here",
    });
  } else if (expected.signingRequired) {
    faults.push({
      rule: "the published installer is not code signed",
      what: "it carries no Authenticode signature, and this run was asked to require one",
    });
  } else {
    notes.push({
      rule: "the installer is not code signed",
      what: "which is what this project publishes: Windows shows SmartScreen once per machine, as WINDOWS_RELEASE.md explains",
    });
  }

  return { faults, notes };
}
