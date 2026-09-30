// Player progress is stored entirely in the browser. There is no account, no
// server and no network request: the game is fully playable offline.
// Explicit extension: the file is also loaded directly by the test runner.
import { FAILURE_PLACES, recordFailure } from "../lib/error-log.js";
import { scheduleAfterAnswer } from "../lib/spaced-repetition.js";
import { activeProfileId, hasProfiles, progressKeyFor } from "./profiles-store.js";

// Progress belongs to the active student profile: the teacher space can switch
// between several students on the same device without touching this module.
const progressKey = () => progressKeyFor(activeProfileId());
const LOCAL_ID = "local";

// Whether the browser last refused to save, and who wants to know. A device
// that cannot keep a record is the one failure a player cannot see for
// themselves: the game keeps scoring, and everything is gone at the next
// reload. So the refusal is held here until a write succeeds again.
let refusal = null;
const refusalWatchers = new Set();

function rememberRefusal(error) {
  const next = error ? { name: typeof error.name === "string" ? error.name : "Error" } : null;
  const changed = (next === null) !== (refusal === null);
  refusal = next;
  if (changed) refusalWatchers.forEach((listener) => listener(refusal));

  // A browser that will not save is a failure the player cannot see for
  // themselves, so it earns a line in the log the report carries. Once, when it
  // starts: a full quota stays full, and a hundred refused writes are one fact.
  if (error && changed) recordFailure(error, { where: FAILURE_PLACES.save });
}

/**
 * Tells a listener whether storage is currently refusing writes, every time that
 * changes, and returns the way to stop listening.
 */
export function watchSaveRefusal(listener) {
  refusalWatchers.add(listener);
  listener(refusal);
  // The way to stop listening, and nothing else: `Set.delete` answers whether
  // the listener was still there, which is nobody's business here. Returning it
  // made this cleanup a function that returns a value, which is not a cleanup a
  // React effect accepts.
  return () => {
    refusalWatchers.delete(listener);
  };
}

/** Whether the browser is refusing to save right now. */
export function saveIsRefused() {
  return refusal !== null;
}
// Set once the player has answered the offer to load a backup, whether they
// loaded one or chose to start from scratch.
const WELCOME_KEY = "aq_welcome_v1";

/**
 * Whether one record holds anything worth keeping: no reward, no answer given,
 * no lesson opened, no level finished. The game writes an empty record the first
 * time a device opens it, so an empty record is what "never played" looks like
 * on disk, and telling the two apart is the whole point of this function.
 */
export function isEmptyProgress(progress) {
  if (!progress) return true;
  const record = { ...defaultProgress(), ...progress };

  return (
    (record.total_xp || 0) === 0 &&
    (record.stars_earned || 0) === 0 &&
    (record.completed_levels || []).length === 0 &&
    (record.studied_levels || []).length === 0 &&
    Object.keys(record.question_stats || {}).length === 0 &&
    (record.history || []).length === 0
  );
}

/**
 * Whether the game should offer to load a backup the moment it opens.
 *
 * Three things have to hold at once, and each of them earns its place. The
 * active profile must have no progress, otherwise the offer would be about
 * replacing something. The browser must hold no roster of students, so a
 * classroom tablet does not ask every new student for a file. And the question
 * must not have been answered already: once it is, only Settings mentions
 * backups again.
 *
 * What counts as progress is decided by what the record holds rather than by
 * whether it exists, because the game writes an empty record as soon as a new
 * device opens it.
 */
export function needsBackupOffer() {
  if (localStorage.getItem(WELCOME_KEY)) return false;
  if (hasProfiles()) return false;

  const raw = localStorage.getItem(progressKey());
  if (raw === null) return true;
  try {
    return isEmptyProgress(JSON.parse(raw));
  } catch {
    // An unreadable record is still a record: the player has something on this
    // device, and Settings is the place to sort it out.
    return false;
  }
}

/** The player chose: load a file, or start from the beginning. */
export function dismissBackupOffer() {
  localStorage.setItem(WELCOME_KEY, "1");
}

export const defaultProgress = () => ({
  current_level: 1,
  total_xp: 0,
  stars_earned: 0,
  completed_levels: [],
  badges: [],
  level_scores: {},
  total_time_seconds: 0,
  streak_days: 0,
  // Null until the first level is finished: the streak then starts at one
  // instead of needing a special case for a profile created today.
  last_played: null,
  // Per-question learning memory, keyed by "<levelId>:<questionIndex>".
  // `right`/`wrong` are answer counters; `stage`, `dueAt` and `lastSeen` are the
  // spaced repetition schedule that decides when the question comes back.
  question_stats: {},
  // Level ids whose lesson has been opened at least once.
  studied_levels: [],
  // One entry per finished level: { date, level, difficulty, score, total,
  // stars, xp }, where stars and xp are the gains actually added to the totals.
  // This is what lets the stats screen draw progress over time.
  history: [],
});

function readLocal() {
  try {
    const raw = localStorage.getItem(progressKey());
    if (!raw) return null;
    return { ...defaultProgress(), ...JSON.parse(raw), id: LOCAL_ID };
  } catch {
    return null;
  }
}

function writeLocal(data) {
  const { id: _ignored, ...rest } = data;
  const record = { ...defaultProgress(), ...rest };

  try {
    localStorage.setItem(progressKey(), JSON.stringify(record));
  } catch (error) {
    // Storage refuses a write more often than it sounds: a full quota, a device
    // in private browsing, a school browser that blocks storage altogether. The
    // caller still hears about it - a change that was not saved must not look
    // saved - and the refusal is remembered so the application can say so on
    // every screen rather than losing the afternoon in silence.
    rememberRefusal(error);
    throw error;
  }

  rememberRefusal(null);
  return { id: LOCAL_ID, ...record };
}

export const progressStore = {
  async list() {
    const local = readLocal();
    return local ? [local] : [];
  },

  async create(data) {
    return writeLocal({ ...defaultProgress(), ...data });
  },

  async update(_id, data) {
    const current = readLocal() || { id: LOCAL_ID, ...defaultProgress() };
    return writeLocal({ ...current, ...data });
  },

  // Loading a backup replaces the whole record instead of merging into it: a
  // file is a snapshot, so what it does not know about must not survive it.
  // The caller passes a record already repaired by cleanProgress().
  async replace(data) {
    return writeLocal({ ...defaultProgress(), ...data });
  },

  async remove() {
    localStorage.removeItem(progressKey());
  },

  // Learning memory: remember how the player answered a specific question, and
  // reschedule it so mistakes resurface later instead of piling up forever.
  async recordAnswer(key, correct) {
    const current = readLocal() || { id: LOCAL_ID, ...defaultProgress() };
    const stats = { ...(current.question_stats || {}) };
    const prev = stats[key] || { right: 0, wrong: 0 };
    stats[key] = {
      right: correct ? (prev.right || 0) + 1 : prev.right || 0,
      wrong: correct ? prev.wrong || 0 : (prev.wrong || 0) + 1,
      ...scheduleAfterAnswer(prev, correct),
    };
    return writeLocal({ ...current, question_stats: stats });
  },

  async markStudied(levelId) {
    const current = readLocal() || { id: LOCAL_ID, ...defaultProgress() };
    const studied = current.studied_levels || [];
    if (studied.includes(levelId)) return { id: LOCAL_ID, ...current };
    return writeLocal({ ...current, studied_levels: [...studied, levelId] });
  },
};
