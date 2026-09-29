/**
 * Student profiles on this device.
 *
 * The app has no account and no server, so several students sharing a classroom
 * tablet or computer each get their own progress record in the browser. The
 * roster lives in one key, and each profile's progress in its own, which keeps
 * the teacher page able to aggregate everybody without any network call.
 *
 * The single record that existed before profiles did keeps its original key, so
 * an existing player simply shows up as the first, unnamed profile.
 */
const ROSTER_KEY = "aq_profiles_v1";
const ACTIVE_KEY = "aq_active_profile";
const LEGACY_PROGRESS_KEY = "aq_progress_v1";

/** Id of the profile that owns the progress stored before profiles existed. */
export const DEFAULT_PROFILE_ID = "local";

/** Key holding one profile's progress; the first profile keeps the legacy key. */
export function progressKeyFor(id) {
  if (!id || id === DEFAULT_PROFILE_ID) return LEGACY_PROGRESS_KEY;
  return `aq_progress_${id}`;
}

function readRoster() {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((profile) => profile && typeof profile.id === "string");
  } catch {
    return [];
  }
}

function writeRoster(list) {
  localStorage.setItem(ROSTER_KEY, JSON.stringify(list));
}

function newProfileId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function cleanName(name) {
  return String(name || "").trim().slice(0, 40);
}

/**
 * The roster, which always contains at least one profile: a device that never
 * opened the teacher space still has the single profile holding its progress.
 */
export function listProfiles() {
  const roster = readRoster();
  if (roster.length === 0) return [{ id: DEFAULT_PROFILE_ID, name: "", created: null }];
  return roster;
}

/** Id of the profile the game currently plays as. */
export function activeProfileId() {
  const roster = listProfiles();
  const stored = localStorage.getItem(ACTIVE_KEY);
  if (stored && roster.some((profile) => profile.id === stored)) return stored;
  return roster[0]?.id || DEFAULT_PROFILE_ID;
}

/**
 * Whether this browser ever held a roster of students. A classroom tablet that
 * created profiles is not a new device, even when the student playing right now
 * has never answered a question, so it is not offered a backup on every switch.
 */
export function hasProfiles() {
  return localStorage.getItem(ROSTER_KEY) !== null;
}

export function setActiveProfile(id) {
  localStorage.setItem(ACTIVE_KEY, id || DEFAULT_PROFILE_ID);
}

export function activeProfile() {
  const id = activeProfileId();
  return listProfiles().find((profile) => profile.id === id) || { id, name: "", created: null };
}

export function createProfile(name = "") {
  const profile = { id: newProfileId(), name: cleanName(name), created: new Date().toISOString() };
  writeRoster([...listProfiles(), profile]);
  return profile;
}

export function renameProfile(id, name) {
  const roster = listProfiles().map((profile) =>
    profile.id === id ? { ...profile, name: cleanName(name) } : profile
  );
  writeRoster(roster);
  return roster;
}

/**
 * Removes a student and their stored progress. The device always keeps a place
 * to store progress, so deleting the last profile leaves a fresh empty one.
 */
export function deleteProfile(id) {
  const remaining = listProfiles().filter((profile) => profile.id !== id);
  localStorage.removeItem(progressKeyFor(id));

  if (remaining.length === 0) {
    writeRoster([{ id: DEFAULT_PROFILE_ID, name: "", created: null }]);
    setActiveProfile(DEFAULT_PROFILE_ID);
    return listProfiles();
  }

  writeRoster(remaining);
  if (localStorage.getItem(ACTIVE_KEY) === id) setActiveProfile(remaining[0].id);
  return remaining;
}

/** One profile's stored progress, or null when they have not played yet. */
export function readProfileProgress(id) {
  try {
    const raw = localStorage.getItem(progressKeyFor(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Roster plus each student's progress, the exact input classStats() expects. */
export function listStudentsWithProgress() {
  return listProfiles().map((profile) => ({
    ...profile,
    progress: readProfileProgress(profile.id),
  }));
}

/**
 * Writes or overwrites one student profile's progress record directly.
 */
export function writeProfileProgress(id, progress) {
  if (!id) return;
  const key = progressKeyFor(id);
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Imports a student backup into this device's roster.
 * If a profile with the same name already exists, updates its progress;
 * otherwise creates a new profile in the roster with this name and progress.
 * Returns { profile, updated: boolean }.
 */
export function importStudentProfile(name, progress) {
  const clean = cleanName(name);
  const roster = listProfiles();
  const existing = roster.find(
    (p) => p.name && clean && p.name.toLowerCase() === clean.toLowerCase()
  );

  if (existing) {
    writeProfileProgress(existing.id, progress);
    return { profile: existing, updated: true };
  }

  // If the device only has the default unnamed profile and it has no progress, rename it
  const defaultP = roster.find((p) => p.id === DEFAULT_PROFILE_ID);
  if (roster.length === 1 && defaultP && !defaultP.name && !readProfileProgress(DEFAULT_PROFILE_ID)) {
    renameProfile(DEFAULT_PROFILE_ID, clean || Student);
    writeProfileProgress(DEFAULT_PROFILE_ID, progress);
    return { profile: { ...defaultP, name: clean || Student }, updated: false };
  }

  const created = createProfile(clean || Student);
  writeProfileProgress(created.id, progress);
  return { profile: created, updated: false };
}
