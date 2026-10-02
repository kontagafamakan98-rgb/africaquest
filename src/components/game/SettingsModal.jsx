import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Info, AlertTriangle, Globe, ShieldCheck, FileText, GraduationCap, ChevronRight, Download, Upload, Camera, BookOpen, Bell, BellOff, BellRing, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { progressStore } from "@/api/progress-store";
import { activeProfile } from "@/api/profiles-store";
import { backupFileName, buildBackup, checkBackupFile, readBackup } from "@/lib/progress-file";
import { useQueryClient } from "@tanstack/react-query";
import { useT, useLang, LANGUAGES, setLang } from "../i18n";
import { useModalA11y } from "@/lib/use-modal-a11y";
import BackupNotice from "./BackupNotice";
import LiquidMark from "./LiquidMark";

/**
 * What the reminder switch says when it could not do what it was asked to.
 *
 * Every one of them is a fact about this browser rather than a failure of the
 * game, and each is written out on the screen instead of leaving a switch that
 * looks on while nothing can reach the player.
 */
const REMINDER_NOTES = {
  blocked: "reminderBlocked",
  dismissed: "reminderDismissed",
  unsupported: "reminderUnsupported",
  noBackground: "reminderNoBackground",
};

export default function SettingsModal({ open, onClose, reminder }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // A file the player picked, waiting for them to confirm the replacement, and
  // the one line that tells them how the last save or load went.
  const [pendingBackup, setPendingBackup] = useState(null);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [backupNote, setBackupNote] = useState(null);
  const queryClient = useQueryClient();
  const t = useT();
  const currentLang = useLang();
  const dialogRef = useRef(null);
  // Whose progress is being recorded right now, so a student can check they are
  // playing under their own profile before answering anything.
  const profile = activeProfile();
  const profileName = profile.name || t.defaultProfileName;

  useModalA11y({ open, onClose, containerRef: dialogRef });

  const handleDeleteProgress = async () => {
    setDeleting(true);
    try {
      await progressStore.remove();
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
      onClose();
    }
  };

  // Every component subscribes to the language, so the whole app, this dialog
  // included, redraws on the spot. Nothing else to do here.
  const handleLangChange = (code) => {
    setLang(code);
  };

  // The file leaves the browser through a temporary link: no server, no account
  // and no library, which is the same promise the rest of the game keeps.
  const handleExportBackup = async () => {
    setBackupNote(null);
    try {
      const [current] = await progressStore.list();
      const backup = buildBackup({ progress: current, profileName: profile.name || "" });
      downloadTextFile(backupFileName(profile.name || ""), JSON.stringify(backup, null, 2));
      setBackupNote("exported");
    } catch {
      setBackupNote("failed");
    }
  };

  const handleBackupFile = async (event) => {
    const file = event.target.files?.[0];
    // Cleared straight away so picking the same file twice in a row still counts.
    event.target.value = "";
    if (!file) return;
    setBackupNote(null);

    // What the file claims to be is checked before it is read, not after: a
    // file that is not one of ours has no business being in memory at all.
    const looked = checkBackupFile(file);
    if (!looked.ok) {
      setBackupNote(looked.reason);
      return;
    }

    let text = "";
    try {
      text = await file.text();
    } catch {
      setBackupNote("notJson");
      return;
    }

    const read = readBackup(text);
    if (!read.ok) {
      setBackupNote(read.reason);
      return;
    }
    setPendingBackup(read);
  };

  const applyBackup = async () => {
    if (!pendingBackup) return;
    setLoadingBackup(true);
    try {
      await progressStore.replace(pendingBackup.progress);
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      setBackupNote("imported");
    } catch {
      setBackupNote("failed");
    } finally {
      setLoadingBackup(false);
      setPendingBackup(null);
    }
  };

  return (
    <>
      {/* The scrim and the sheet are drawn only while the sheet is open, and
          they animate in. They are deliberately not handed to AnimatePresence,
          which is what the other sheets of the application use: this is the one
          sheet that offers the language, so it can be open when the language
          changes, and that change re-renders the whole application. The pair
          that was leaving was then never taken back out of the document - an
          invisible scrim across the page, on which nothing could be clicked any
          more until the tab was reloaded. Arriving is animated here and leaving
          is not, which is the trade this failure is worth. */}
      {open && (
        <>
          {/* A tap on the scrim closes the sheet: a convenience for a thumb,
              with the close button inside the sheet as the way a keyboard
              reader leaves. It is kept out of the accessibility tree rather
              than announced as an unnamed control. */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto focus:outline-none"
            style={{ paddingBottom: "calc(4.5rem + var(--sab))" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-5 pb-2 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 id="settings-title" className="text-lg font-extrabold text-slate-800">{t.settings}</h2>
                <button onClick={onClose} aria-label={t.close} className="p-3 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* About */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-3 flex gap-3 items-start">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-800">{t.about}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.aboutDesc}</p>
                </div>
              </div>

              {/* The Android app: the same game, installed rather than opened
                  in a tab. The screen it opens says which version is the newest
                  and how a phone installs it. */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Smartphone className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-700">{t.androidApp}</p>
                </div>
                <Link
                  to="/Android"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{t.androidApp}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.androidAppDesc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </Link>
              </div>

              {/* Language picker */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-slate-700">{t.language}</p>
                </div>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      aria-pressed={currentLang === lang.code}
                      // Only the wording changes colour here. The outline and the
                      // paper stay put, so nothing flashes while the mark slides
                      // from one language to the other.
                      className={`relative isolate flex-1 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold transition-colors ${
                        currentLang === lang.code
                          ? "text-amber-800"
                          : "text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {currentLang === lang.code && (
                        <LiquidMark
                          layoutId="settings-language"
                          className="-inset-0.5 rounded-xl border-2 border-amber-500 bg-amber-50"
                        />
                      )}
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminders: the count on the icon follows the schedule on its
                  own, and the notification is the one thing that needs the
                  player's permission, which this switch is the gesture for. */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <BellRing className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-700">{t.reminderTitle}</p>
                </div>
                <p className="text-xs text-slate-500 px-1 mb-2 leading-relaxed">{t.reminderDesc}</p>
                <button
                  onClick={reminder.toggle}
                  disabled={reminder.busy || !reminder.support.notifications}
                  aria-pressed={reminder.enabled}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border-2 text-xs font-bold transition-colors disabled:opacity-60 ${
                    reminder.enabled
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-amber-800"
                  }`}
                >
                  {reminder.enabled ? (
                    <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {reminder.enabled ? t.reminderOn : t.reminderTurnOn}
                </button>
                {reminderNote(reminder, t) && (
                  <p className="text-[11px] text-slate-500 px-1 mt-2 leading-relaxed">
                    {reminderNote(reminder, t)}
                  </p>
                )}
              </div>

              {/* Backup: this browser holds the only copy of the progress, so
                  taking it out and putting it back has to be possible. */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Download className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-700">{t.backupTitle}</p>
                </div>
                <p className="text-xs text-slate-500 px-1 mb-2 leading-relaxed">{t.backupDesc}</p>

                {pendingBackup ? (
                  <ConfirmBox
                    message={t.backupImportConfirm}
                    onCancel={() => setPendingBackup(null)}
                    onConfirm={applyBackup}
                    deleting={loadingBackup}
                    t={t}
                    confirmLabel={t.backupImport}
                    busyLabel={t.backupImporting}
                  />
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.backupExport}
                    </button>
                    {/* A file picker is a label around a real input: it works with
                        the keyboard and with a screen reader, unlike a hidden input
                        opened from a script. */}
                    <label className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 focus-within:border-amber-500 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.backupImport}
                      <input
                        type="file"
                        accept=".json,application/json"
                        className="sr-only"
                        onChange={handleBackupFile}
                      />
                    </label>
                  </div>
                )}

                {backupNote && !pendingBackup && (
                  <BackupNotice note={backupNote} t={t} />
                )}
              </div>

              {/* Delete Progress */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-orange-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-700 text-sm">{t.deleteProgress}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{t.deleteProgressDesc}</p>
                  </div>
                </button>
              ) : (
                <ConfirmBox
                  message={t.deleteProgressConfirm}
                  onCancel={() => setConfirmDelete(false)}
                  onConfirm={handleDeleteProgress}
                  deleting={deleting}
                  t={t}
                />
              )}

              {/* Teacher space: reachable only from here, and protected by a code on the page itself. */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-slate-700">{t.teacherSpace}</p>
                </div>
                <Link
                  to="/TeacherPage"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{t.teacherSpace}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.teacherSpaceDesc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
                <p className="text-[11px] text-slate-500 px-1 mt-2">
                  {t.activeProfile}: <span className="font-bold text-slate-700">{profileName}</span>
                </p>
              </div>

              {/* Legal */}
              <div className="mt-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-slate-700">{t.legal}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/PrivacyPolicy"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.privacyPolicy}
                  </Link>
                  <Link
                    to="/TermsOfService"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {t.termsOfService}
                  </Link>
                </div>
                {/* Who made the pictures, and under which licence. A credit line
                    under a photograph is the whole of the debt, but a reader who
                    wants to check one, or reuse it themselves, needs the list. */}
                <Link
                  to="/PhotoCredits"
                  onClick={onClose}
                  className="mt-2 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.photoCredits}
                </Link>
                {/* What the explanations are drawn from. A reference under one
                    question is what a player checks there and then; a teacher
                    preparing a lesson wants the works and what they support. */}
                <Link
                  to="/Bibliography"
                  onClick={onClose}
                  className="mt-2 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.bibliography}
                </Link>
                {/* Who edits the game, why it exists and how it is funded: the
                    question a free app with no advertising raises first. */}
                <Link
                  to="/About"
                  onClick={onClose}
                  className="mt-2 flex items-center justify-center gap-2 py-2.5 min-h-11 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.aboutPage}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

/**
 * The one line under the reminder switch, or nothing when there is nothing to
 * explain. A browser that cannot raise a notification says so before the player
 * has to find out by pressing the switch, and a reminder that is on says the one
 * thing that stays true whatever the browser does: the hour of the notification
 * is not ours to promise, and the count on the icon is refreshed on every
 * opening.
 */
function reminderNote(reminder, t) {
  const key = reminder.note || (reminder.support.notifications ? null : "unsupported");
  if (key) return t[REMINDER_NOTES[key]] || t.reminderUnsupported;
  return reminder.enabled ? t.reminderBrowserDecides : null;
}

// The two labels are optional and default to nothing, which is what the body
// already expects: it falls back to the dictionary when a caller does not name
// its own. Saying so in the signature is what keeps a caller that leaves them
// out from reading as a mistake.
function ConfirmBox({ message, onCancel, onConfirm, deleting, t, confirmLabel = "", busyLabel = "" }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex gap-2 items-start mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 font-medium">{message}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="flex-1 rounded-xl">
          {t.cancel}
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
        >
          {deleting ? busyLabel || t.deleting : confirmLabel || t.yesDelete}
        </Button>
      </div>
    </div>
  );
}

/** Hands a text file to the browser without a server or a download library. */
function downloadTextFile(fileName, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
