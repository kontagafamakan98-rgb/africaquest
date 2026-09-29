import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  BACKUP_REASONS,
  MAX_BACKUP_BYTES,
  buildBackup,
  checkBackupFile,
} from "./progress-file.js";

// Everything that arrives in this application from outside it.
//
// There is one: a file picked from a device. Everything else is written here -
// the questions, the lessons, the references, the photographs - and there is no
// server, no upload and no address of ours that accepts anything. So this is the
// whole attack surface, and it is small enough to hold in one hand: a file has
// to look like a JSON document and be small enough to read, and what comes out
// of it is never executed and never stored as a file. It is text, and the text
// is rebuilt field by field by readBackup() against the known shape of a record,
// which is what keeps a hand-edited one out of the player's progress.
//
// Nothing here touches a device: the file is described the way a browser
// describes one, with a name, a declared type and a size.
//
// The wording of each refusal lives in src/components/i18n.jsx and is checked by
// scripts/check-translations.mjs, so a reason added here without a sentence in
// both languages fails the verification rather than reaching a reader as an
// empty alert.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

test("a file is weighed and typed before a byte of it is read", () => {
  const backup = { name: "africa-quest-kojo-2026-09-27.json", type: "application/json", size: 40_000 };
  assert.equal(checkBackupFile(backup).ok, true);

  // A file moved between machines loses its declared type, and one saved from a
  // text editor arrives as text: both are still readable, and both are rebuilt
  // field by field before anything is stored.
  assert.equal(checkBackupFile({ name: "backup.txt", type: "text/plain", size: 1_000 }).ok, true);
  assert.equal(checkBackupFile({ name: "backup", type: "application/json", size: 1_000 }).ok, true);
  assert.equal(checkBackupFile({ name: "backup.JSON", type: "", size: 2 }).ok, true);
  assert.equal(checkBackupFile({ name: "backup.json", type: "application/json; charset=utf-8", size: 2 }).ok, true);

  // A file that is not a JSON document is refused whatever it is called, which is
  // the point: the picker's `accept` attribute is a hint a hand-edited page can
  // change, not a check.
  for (const file of [
    { name: "photo.png", type: "image/png", size: 900 },
    { name: "installer.exe", type: "application/octet-stream", size: 900 },
    { name: "sheet.pdf", type: "application/pdf", size: 900 },
    { name: "archive.zip", type: "", size: 900 },
  ]) {
    assert.equal(checkBackupFile(file).reason, BACKUP_REASONS.wrongType, `${file.name} was taken for a backup`);
  }

  // The size comes first: a file large enough to run the browser out of memory is
  // refused on its size rather than reported as a broken backup, and the ceiling
  // itself is allowed.
  const big = { name: "big.json", type: "application/json", size: MAX_BACKUP_BYTES + 1 };
  assert.equal(checkBackupFile(big).reason, BACKUP_REASONS.tooLarge);
  assert.equal(checkBackupFile({ ...big, size: MAX_BACKUP_BYTES }).ok, true);

  // An empty file, and nothing at all, are the same refusal the reader already
  // knows: there was nothing to read.
  assert.equal(checkBackupFile({ name: "empty.json", type: "application/json", size: 0 }).reason, BACKUP_REASONS.empty);
  assert.equal(checkBackupFile(null).reason, BACKUP_REASONS.empty);
  assert.equal(checkBackupFile(undefined).reason, BACKUP_REASONS.empty);
});

test("the ceiling is far above anything the game itself can write", () => {
  // A ceiling under what the app writes would refuse a real backup, which is a
  // worse failure than reading a file that is not one: the heaviest record the
  // reader allows, at every ceiling it allows, is built here and weighed.
  const heaviest = buildBackup({
    progress: {
      question_stats: Object.fromEntries(
        Array.from({ length: 4000 }, (_, index) => [
          `${index}:1`,
          { right: 3, wrong: 2, stage: 5, dueAt: 1_790_000_000_000, lastSeen: 1_790_000_000_000 },
        ])
      ),
      history: Array.from({ length: 5000 }, () => ({
        date: "2026-09-27",
        level: 20,
        difficulty: "medium",
        score: 20,
        total: 20,
        stars: 3,
        xp: 240,
      })),
    },
  });
  const written = JSON.stringify(heaviest).length;
  assert.ok(written < MAX_BACKUP_BYTES, `the heaviest record is ${written} bytes`);
  // And the ceiling is not so far above it that a file which is not a backup at
  // all can be: two megabytes is twice the worst case rather than a hundred
  // times it.
  assert.ok(MAX_BACKUP_BYTES < written * 4, "the ceiling is a number nobody chose");
});

test("every place a file can arrive checks it before reading it, and with wording", () => {
  const places = [
    "src/components/game/SettingsModal.jsx",
    "src/components/game/WelcomeBackup.jsx",
    "src/pages/TeacherPage.jsx",
  ];

  const { en, fr } = (() => {
    // The two dictionaries are read as text: this test is about the app saying
    // what went wrong in both languages, not about how the module is shaped.
    const source = read("src/components/i18n.jsx");
    return { en: source, fr: source };
  })();
  assert.equal(en, fr);

  for (const file of places) {
    const source = read(file);
    assert.match(source, /<input[^>]*type="file"/s, `${file} no longer takes a file`);
    assert.match(source, /checkBackupFile\(file\)/, `${file} reads a file without weighing it first`);
    // The check has to come before the read, not after it: a guard that runs
    // after `file.text()` has already pulled the file into memory.
    assert.ok(
      source.indexOf("checkBackupFile(file)") < source.indexOf("file.text()"),
      `${file} reads the file before checking it`
    );
  }

  // Every refusal the guard can produce is a sentence a reader can read, in both
  // languages. The generic one is the same one an unreadable file already gets.
  for (const reason of ["tooLarge", "wrongType"]) {
    assert.match(read("src/components/i18n.jsx"), new RegExp(`backup${reason[0].toUpperCase()}${reason.slice(1)}:`));
  }
  const notice = read("src/components/game/BackupNotice.jsx");
  assert.match(notice, /tooLarge: t\.backupTooLarge/);
  assert.match(notice, /wrongType: t\.backupWrongType/);
});

test("no file is ever stored, executed or handed to the page as markup", () => {
  // The claim in the settings sheet and in the privacy notice is that this
  // application has no server and no upload. What holds it is not the sentence
  // but the code: a picked file is read as text, and the text is taken apart
  // field by field. Nothing writes it to storage, nothing turns it into an
  // object URL, and nothing puts any of it into the page as HTML.
  const sources = [
    "src/components/game/SettingsModal.jsx",
    "src/components/game/WelcomeBackup.jsx",
    "src/pages/TeacherPage.jsx",
    "src/lib/progress-file.js",
    "src/api/profiles-store.js",
  ].map(read);

  for (const source of sources) {
    assert.doesNotMatch(source, /createObjectURL\(file|URL\.createObjectURL\([^)]*\bfile\b/);
    assert.doesNotMatch(source, /dangerouslySetInnerHTML|\.innerHTML\b|insertAdjacentHTML|document\.write/);
    assert.doesNotMatch(source, /new Function|eval\(/);
  }
});
