// Player progress is stored entirely in the browser. There is no account, no
// server and no network request: the game is fully playable offline.
// Explicit extension: the file is also loaded directly by the test runner.
import { scheduleAfterAnswer } from "../lib/spaced-repetition.js";
import { activeProfileId, hasProfiles, progressKeyFor } from "./profiles-store.js";

// Progress belongs to the active student profile: the teacher space can switch
// between several students on the same device without touching this module.
const progressKey = () => progressKeyFor(activeProfileId());
const LOCAL_ID = "local";
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
  localStorage.setItem(progressKey(), JSON.stringify(record));
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
