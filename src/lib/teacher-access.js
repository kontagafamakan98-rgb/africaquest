/**
 * Access code for the teacher space.
 *
 * There is no server and no account in this app, so this is a door rather than a
 * vault: it stops a student from wandering into the class results on the shared
 * device. The four digits are kept hashed, which hides them from a casual look
 * at the browser storage, but anyone opening the developer tools can read or
 * clear the key. That limitation is deliberate and documented, not a bug.
 */
const PIN_KEY = "aq_teacher_pin";
const UNLOCK_KEY = "aq_teacher_unlocked";

/** Length of the code, shared with the interface. */
export const TEACHER_PIN_LENGTH = 4;

/** FNV-1a over the code and a fixed salt: short, dependency free, not crypto. */
function hashCode(code) {
  const input = `aq-teacher:${code}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/** Keeps only digits, so a code typed with spaces still matches. */
export function normalizeCode(code) {
  return String(code || "").replace(/\D/g, "").slice(0, TEACHER_PIN_LENGTH);
}

export function isValidCode(code) {
  return normalizeCode(code).length === TEACHER_PIN_LENGTH;
}

export function hasTeacherPin() {
  return Boolean(localStorage.getItem(PIN_KEY));
}

export function setTeacherPin(code) {
  localStorage.setItem(PIN_KEY, hashCode(normalizeCode(code)));
  unlockTeacher();
}

export function clearTeacherPin() {
  localStorage.removeItem(PIN_KEY);
  lockTeacher();
}

export function isTeacherCode(code) {
  return localStorage.getItem(PIN_KEY) === hashCode(normalizeCode(code));
}

// The unlock lasts for the browser session only: closing the tab asks again.
export function isTeacherUnlocked() {
  return sessionStorage.getItem(UNLOCK_KEY) === "1";
}

export function unlockTeacher() {
  sessionStorage.setItem(UNLOCK_KEY, "1");
}

export function lockTeacher() {
  sessionStorage.removeItem(UNLOCK_KEY);
}
