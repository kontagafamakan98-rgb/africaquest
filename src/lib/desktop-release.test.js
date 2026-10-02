import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  INSTALLER_STEM,
  PRODUCT_NAME,
  installerNameFor,
  isExecutable,
  isSigned,
  judgeInstaller,
  windowsVersionFrom,
} from "./desktop-release.js";

/**
 * A Windows program, built by hand, so that the reading can be tested without
 * one on the machine. The bytes below are the smallest thing that carries what
 * the module reads: the two headers a program begins with, and a version
 * resource with the strings a real installer wears.
 */
const ROOT = path.resolve(import.meta.dirname, "..", "..");

/** A string as a Windows resource writes it: two bytes a character, then a null. */
function utf16(text) {
  const bytes = [];
  for (let at = 0; at < text.length; at += 1) {
    const unit = text.charCodeAt(at);
    bytes.push(unit & 0xff, (unit >> 8) & 0xff);
  }
  bytes.push(0, 0);
  return bytes;
}

/**
 * One named value of the version resource.
 *
 * The header is six bytes, then the name, then the value at the next four byte
 * boundary: the shape the module reads, written out here so the two are held
 * together by this test rather than by a comment.
 */
function entry(name, value) {
  const key = utf16(name);
  const text = utf16(value);
  let start = 6 + key.length;
  start += (4 - (start % 4)) % 4;

  const bytes = new Array(start + text.length).fill(0);
  const length = bytes.length;
  bytes[0] = length & 0xff;
  bytes[1] = (length >> 8) & 0xff;
  const words = value.length + 1;
  bytes[2] = words & 0xff;
  bytes[3] = (words >> 8) & 0xff;
  bytes[4] = 1;
  key.forEach((byte, at) => {
    bytes[6 + at] = byte;
  });
  text.forEach((byte, at) => {
    bytes[start + at] = byte;
  });
  return bytes;
}

/** The whole version resource: its own block, with the named strings inside it. */
function versionResource(strings) {
  const children = Object.entries(strings).flatMap(([name, value]) => entry(name, value));
  const key = utf16("VS_VERSION_INFO");
  let header = 6 + key.length;
  header += (4 - (header % 4)) % 4;

  const bytes = new Array(header).fill(0);
  key.forEach((byte, at) => {
    bytes[6 + at] = byte;
  });
  bytes.push(...children);
  bytes[0] = bytes.length & 0xff;
  bytes[1] = (bytes.length >> 8) & 0xff;
  return bytes;
}

/** Four bytes little endian, written into a buffer the way a PE header writes them. */
function putU32(bytes, at, value) {
  bytes[at] = value & 0xff;
  bytes[at + 1] = (value >> 8) & 0xff;
  bytes[at + 2] = (value >> 16) & 0xff;
  bytes[at + 3] = (value >> 24) & 0xff;
}

/** A whole program: the headers, and the version resource after them. */
function program({ signed = false, strings = {}, version = true } = {}) {
  const resource = version ? versionResource(strings) : [];
  const headerSize = 0x200;
  const bytes = new Uint8Array(headerSize + resource.length);

  bytes[0] = 0x4d;
  bytes[1] = 0x5a;
  const pe = 0x80;
  putU32(bytes, 0x3c, pe);
  bytes[pe] = 0x50;
  bytes[pe + 1] = 0x45;
  bytes[pe + 2] = 0;
  bytes[pe + 3] = 0;

  // The optional header's magic, then its directory table: the certificate table
  // is the fifth directory, and an unsigned program leaves both of its fields
  // zero.
  const optional = pe + 24;
  bytes[optional] = 0x0b;
  bytes[optional + 1] = 0x01;
  if (signed) {
    const certificate = optional + 96 + 4 * 8;
    putU32(bytes, certificate, 0x1000);
    putU32(bytes, certificate + 4, 0x100);
  }

  bytes.set(resource, headerSize);
  return bytes;
}

const SAYS = {
  ProductName: PRODUCT_NAME,
  CompanyName: PRODUCT_NAME,
  FileVersion: "1.0.8",
  ProductVersion: "1.0.8",
  LegalCopyright: PRODUCT_NAME,
  FileDescription: "Africa History Quest, an educational quiz game.",
};

test("the name is the one the build and the workflow write", () => {
  assert.equal(installerNameFor("1.0.8"), `${INSTALLER_STEM}-1.0.8.exe`);

  // The program electron-builder assembles, and the file it writes, are named in
  // electron-builder.yml; the release uploads the file under the tag's version.
  // Both are read here, so the name in the module and the name in the build
  // cannot drift apart in one place and agree in another.
  const builder = readFileSync(path.join(ROOT, "electron-builder.yml"), "utf8");
  assert.match(builder, /^productName: Africa History Quest$/m);
  assert.ok(
    builder.includes(`artifactName: ${INSTALLER_STEM}-\${version}.exe`),
    "electron-builder no longer writes the name the module builds"
  );

  const workflow = readFileSync(path.join(ROOT, ".github", "workflows", "desktop.yml"), "utf8");
  assert.ok(
    workflow.includes(`${INSTALLER_STEM}-\${TAG#v}.exe`),
    "the workflow no longer uploads the name the module builds"
  );
});

test("a Windows program is told by the headers it begins with", () => {
  assert.equal(isExecutable(program()), true);
  assert.equal(isExecutable(new Uint8Array([0x4d, 0x5a, 0, 0])), false, "a stub is too short to hold a header");
  assert.equal(isExecutable(new Uint8Array(64).fill(0)), false, "bytes that begin with nothing");
  assert.equal(isExecutable("not bytes"), false);
});

test("what the program says about itself is read back out of it", () => {
  const says = windowsVersionFrom(program({ strings: SAYS }));
  assert.equal(says.productName, PRODUCT_NAME);
  assert.equal(says.fileVersion, "1.0.8");
  assert.equal(says.productVersion, "1.0.8");
  assert.equal(says.legalCopyright, PRODUCT_NAME);
  assert.equal(says.fileDescription, "Africa History Quest, an educational quiz game.");

  // The reading is the resource's, not a guess at a string that happens to be in
  // the file: a program carrying no version resource answers nothing, and one
  // whose resource names no version answers with the version it does not have.
  assert.equal(windowsVersionFrom(program({ version: false })), null);
  assert.equal(windowsVersionFrom(new Uint8Array(1024)), null);
  assert.equal(windowsVersionFrom(program({ strings: {} })).productVersion, null);
});

test("a signature is read from the certificate table, not assumed", () => {
  assert.equal(isSigned(program()), false);
  assert.equal(isSigned(program({ signed: true })), true);
  assert.equal(isSigned(new Uint8Array(64)), false);
});

test("the installer a tag promised passes, and the signature is said rather than demanded", () => {
  const { faults, notes } = judgeInstaller({
    fileName: "Africa-History-Quest-Setup-1.0.8.exe",
    executable: true,
    versionInfo: windowsVersionFrom(program({ strings: SAYS })),
    signed: false,
    expected: {
      tag: "v1.0.8",
      version: "1.0.8",
      productName: PRODUCT_NAME,
      assetName: "Africa-History-Quest-Setup-1.0.8.exe",
    },
  });

  assert.deepEqual(faults, []);
  assert.equal(notes.length, 1);
  assert.match(notes[0].rule, /not code signed/);
});

test("a file that says another version, program or name is a fault", () => {
  const wrong = (over) =>
    judgeInstaller({
      fileName: "Africa-History-Quest-Setup-1.0.8.exe",
      executable: true,
      versionInfo: windowsVersionFrom(program({ strings: SAYS })),
      signed: false,
      expected: {
        tag: "v1.0.8",
        version: "1.0.8",
        productName: PRODUCT_NAME,
        assetName: "Africa-History-Quest-Setup-1.0.8.exe",
        ...over,
      },
    });

  assert.match(wrong({ version: "1.0.9" }).faults[0].rule, /another version/);
  assert.match(wrong({ productName: "Another Program" }).faults[0].rule, /another program/);
  assert.match(wrong({ assetName: "Setup.exe" }).faults[0].rule, /name the version does not make/);

  // A signature a run asked for is a gate; the same file without that request
  // passes, which is the difference between a fact and a fault.
  assert.equal(wrong({ signingRequired: true }).faults[0].rule, "the published installer is not code signed");
});

test("what is not a program, or carries no version, stops the reading there", () => {
  const notAProgram = judgeInstaller({
    fileName: "setup.exe",
    executable: false,
    versionInfo: null,
    signed: false,
    expected: { tag: "v1.0.8", version: "1.0.8", productName: PRODUCT_NAME, assetName: null },
  });
  assert.equal(notAProgram.faults.length, 1);
  assert.match(notAProgram.faults[0].rule, /not a Windows program/);

  const noVersion = judgeInstaller({
    fileName: "setup.exe",
    executable: true,
    versionInfo: null,
    signed: false,
    expected: { tag: "v1.0.8", version: "1.0.8", productName: PRODUCT_NAME, assetName: null },
  });
  assert.equal(noVersion.faults.length, 1);
  assert.match(noVersion.faults[0].rule, /carries no version/);
});

test("a signed installer is named as signed", () => {
  const { faults, notes } = judgeInstaller({
    fileName: "installer.exe",
    executable: true,
    versionInfo: windowsVersionFrom(program({ strings: SAYS })),
    signed: true,
    expected: { tag: "v1.0.8", version: "1.0.8", productName: PRODUCT_NAME, assetName: null },
  });
  assert.deepEqual(faults, []);
  assert.match(notes[0].rule, /is code signed/);
});
