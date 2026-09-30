/**
 * Progress backup files.
 *
 * A player's progress exists in exactly one place: this browser. Exporting it as
 * a file is the only way it survives a cleared cache, a new phone or a shared
 * classroom tablet, so the file has to be trustworthy in both directions.
 *
 * A file coming back in is therefore treated as untrusted input, never as a
 * record to store as-is. It is read, identified, and rebuilt field by field
 * against the known shape, so a truncated, hand-edited or hostile file can
 * neither break the dashboard nor corrupt the spaced repetition schedule.
 *
 * Explicit extension on the import: the file is also loaded by the test runner.
 */
import { defaultProgress } from "../api/progress-store.js";
import { MAX_REVIEW_STAGE } from "./spaced-repetition.js";

/** Marker that identifies one of our files among any other JSON document. */
export const BACKUP_FORMAT = "africa-quest-progress";

/** Bumped only when a saved file stops being readable by the current reader. */
export const BACKUP_VERSION = 1;

/** Why a file was refused, so the interface can say something precise. */
export const BACKUP_REASONS = {
  empty: "empty",
  tooLarge: "tooLarge",
  wrongType: "wrongType",
  notJson: "notJson",
  notBackup: "notBackup",
  newer: "newer",
};

/**
 * The largest a progress file may be, and the types one may arrive as.
 *
 * The game's own worst case is under a megabyte: the ceilings below allow a few
 * thousand answers, and every one of them is a handful of short fields. Two
 * megabytes is therefore far above anything this app writes, and small enough
 * that a file which is not one of ours is refused before its bytes are read into
 * memory rather than after.
 */
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

/**
 * The media types a JSON document arrives as. `text/plain` is allowed because a
 * file moved between machines or through a mail client often loses its type, and
 * what a file claims to be is only a hint in any case: the guarantee is that the
 * record is rebuilt field by field before it is stored.
 */
const JSON_TYPES = new Set(["application/json", "text/json", "text/plain"]);

/**
 * What an arriving file is, before a single byte of it is read.
 *
 * The picker's `accept` attribute is not a check: it is a hint, and a hint a
 * hand-edited page can change. What is checked here is everything the browser
 * knows without reading the file - its name, its declared type and its size -
 * and the reading only happens for a file that could be one of ours. Nothing is
 * ever executed from a file and nothing is ever stored as one: what comes out of
 * one is text, and what comes out of that text is a record rebuilt field by
 * field by readBackup(), which is what keeps a hostile file out of the storage.
 */
export function checkBackupFile(file) {
  if (!file || typeof file !== "object") return { ok: false, reason: BACKUP_REASONS.empty };

  const size = typeof file.size === "number" && Number.isFinite(file.size) ? file.size : null;
  if (size === 0) return { ok: false, reason: BACKUP_REASONS.empty };
  if (size !== null && size > MAX_BACKUP_BYTES) return { ok: false, reason: BACKUP_REASONS.tooLarge };

  const name = typeof file.name === "string" ? file.name.trim().toLowerCase() : "";
  const type = typeof file.type === "string" ? file.type.split(";")[0].trim().toLowerCase() : "";
  if (!name.endsWith(".json") && !JSON_TYPES.has(type)) return { ok: false, reason: BACKUP_REASONS.wrongType };

  return { ok: true, name: file.name, size };
}

// Ceilings that keep a hand-made file from exhausting memory on load. They sit
// far above anything the game itself can produce. They are exported because a
// reader can be handed a file that reaches them, and what the application does
// at that size is measured rather than assumed: see src/lib/load-stress.js.
export const MAX_QUESTIONS = 4000;
export const MAX_HISTORY = 5000;
export const MAX_LIST_ITEMS = 200;
const MAX_LEVEL_ID = 200;
const QUESTION_KEY = /^\d+:\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DIFFICULTIES = ["easy", "medium", "hard"];

/** A non-negative whole number, accepting "240" from a hand-edited file. */
function toCount(value, fallback = 0, minimum = 0) {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(number)) return fallback;
  return Math.max(minimum, Math.trunc(number));
}

function toText(value, maxLength = 60) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/** A stored date, "2026-09-27" or nothing at all. */
function toDate(value) {
  return typeof value === "string" && DATE.test(value) ? value : null;
}

/** A level id, or null when the value is not one. Rejected, never clamped: a
 * zero is not level one, it is a file the app cannot make sense of. */
function toLevelId(value) {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(number)) return null;
  const id = Math.trunc(number);
  return id >= 1 && id <= MAX_LEVEL_ID ? id : null;
}

function toIdList(value) {
  if (!Array.isArray(value)) return [];
  const ids = [];
  // A Set for the same reason as the counter in toQuestionStats(): whether an id
  // was already kept is a question about the list, and asking the list itself
  // makes the answer slower with every entry added.
  const seen = new Set();
  for (const entry of value) {
    if (ids.length >= MAX_LIST_ITEMS) break;
    const id = toLevelId(entry);
    if (id === null || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function toTextList(value) {
  if (!Array.isArray(value)) return [];
  const items = [];
  const seen = new Set();
  for (const entry of value) {
    if (items.length >= MAX_LIST_ITEMS) break;
    const text = toText(entry);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    items.push(text);
  }
  return items;
}

/**
 * One answer's memory. The schedule fields are only written when the file
 * carries them: their absence is meaningful, it is what tells the app the answer
 * predates the schedule and should keep its inferred stage instead of being
 * pushed back to the shortest interval.
 */
function toStat(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (value.right === undefined && value.wrong === undefined) return null;
  const stat = { right: toCount(value.right), wrong: toCount(value.wrong) };
  if (typeof value.stage === "number" && Number.isFinite(value.stage)) {
    stat.stage = Math.min(Math.max(Math.trunc(value.stage), 0), MAX_REVIEW_STAGE);
  }
  if (typeof value.dueAt === "number" && Number.isFinite(value.dueAt)) {
    stat.dueAt = Math.max(0, Math.trunc(value.dueAt));
  }
  if (typeof value.lastSeen === "number" && Number.isFinite(value.lastSeen)) {
    stat.lastSeen = Math.max(0, Math.trunc(value.lastSeen));
  }
  return stat;
}

function toQuestionStats(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const stats = {};
  // The number kept is counted rather than asked for: the ceiling allows four
  // thousand answers, and calling Object.keys() on the growing record once per
  // answer would rebuild that whole key list four thousand times, which is what
  // turned a repair into most of a second. The budget for that work is held in
  // src/lib/load-stress.js, and the script that measures it is scripts/stress-load.mjs.
  let kept = 0;
  for (const [key, entry] of Object.entries(value)) {
    if (kept >= MAX_QUESTIONS) break;
    if (!QUESTION_KEY.test(key)) continue;
    const stat = toStat(entry);
    if (!stat) continue;
    stats[key] = stat;
    kept += 1;
  }
  return stats;
}

function toLevelScores(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const scores = {};
  Object.entries(value).forEach(([levelId, byDifficulty]) => {
    if (!/^\d+$/.test(levelId) || Number(levelId) > MAX_LEVEL_ID) return;
    if (!byDifficulty || typeof byDifficulty !== "object" || Array.isArray(byDifficulty)) return;
    const kept = {};
    DIFFICULTIES.forEach((difficulty) => {
      const entry = byDifficulty[difficulty];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
      kept[difficulty] = { score: toCount(entry.score), stars: toCount(entry.stars) };
    });
    if (Object.keys(kept).length > 0) scores[levelId] = kept;
  });
  return scores;
}

function toHistory(value) {
  if (!Array.isArray(value)) return [];
  const entries = [];
  value.forEach((entry) => {
    if (entries.length >= MAX_HISTORY) return;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
    const date = toDate(entry.date);
    const level = toLevelId(entry.level);
    // A result without a date or a level is not a result.
    if (!date || level === null) return;
    entries.push({
      date,
      level,
      difficulty: toText(entry.difficulty, 20),
      score: toCount(entry.score),
      total: toCount(entry.total),
      stars: toCount(entry.stars),
      xp: toCount(entry.xp),
    });
  });
  return entries;
}

/**
 * The known progress shape, rebuilt from whatever the input says. Unknown fields
 * are dropped rather than stored, and every value is repaired to the type the
 * rest of the app expects. A record that went through here always has exactly
 * the fields of `defaultProgress()`.
 */
export function cleanProgress(raw) {
  const base = defaultProgress();
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  return {
    current_level: toCount(source.current_level, base.current_level, 1),
    total_xp: toCount(source.total_xp),
    stars_earned: toCount(source.stars_earned),
    completed_levels: toIdList(source.completed_levels),
    badges: toTextList(source.badges),
    level_scores: toLevelScores(source.level_scores),
    total_time_seconds: toCount(source.total_time_seconds),
    streak_days: toCount(source.streak_days),
    last_played: toDate(source.last_played),
    question_stats: toQuestionStats(source.question_stats),
    studied_levels: toIdList(source.studied_levels),
    history: toHistory(source.history),
  };
}

/**
 * The document that gets saved: the whole record under a marker and a version,
 * plus whose progress it is, so a teacher holding several files can tell them
 * apart without opening one.
 */
export function buildBackup({ progress, profileName = "", now = Date.now() } = {}) {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date(toCount(now, Date.now(), 1)).toISOString(),
    profileName: toText(profileName, 40),
    progress: cleanProgress(progress),
  };
}

/** A file name a teacher can sort: the student, then the day of the export. */
export function backupFileName(profileName = "", now = Date.now()) {
  // Accents are folded so the name stays readable in every file manager.
  const slug = toText(profileName, 40)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const day = new Date(toCount(now, Date.now(), 1)).toISOString().slice(0, 10);
  return ["africa-quest", slug, day].filter(Boolean).join("-") + ".json";
}

/**
 * Read a file back. Refuses an empty file, an unreadable one, another app's JSON
 * and a file from a newer version of the game, and hands back the reason instead
 * of throwing: the player is the one who picked the wrong file.
 */
export function readBackup(text) {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return { ok: false, reason: BACKUP_REASONS.empty };

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: BACKUP_REASONS.notJson };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: BACKUP_REASONS.notJson };
  }
  if (parsed.format !== BACKUP_FORMAT) return { ok: false, reason: BACKUP_REASONS.notBackup };

  const version = toCount(parsed.version, 0);
  if (version < 1) return { ok: false, reason: BACKUP_REASONS.notBackup };
  if (version > BACKUP_VERSION) return { ok: false, reason: BACKUP_REASONS.newer };
  if (!parsed.progress || typeof parsed.progress !== "object" || Array.isArray(parsed.progress)) {
    return { ok: false, reason: BACKUP_REASONS.notBackup };
  }

  return {
    ok: true,
    profileName: toText(parsed.profileName, 40),
    exportedAt: typeof parsed.exportedAt === "string" ? parsed.exportedAt : null,
    progress: cleanProgress(parsed.progress),
  };
}
