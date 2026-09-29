import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dismissBackupOffer, needsBackupOffer, progressStore } from "@/api/progress-store";
import { checkBackupFile, readBackup } from "@/lib/progress-file";
import { useModalA11y } from "@/lib/use-modal-a11y";
import { useT } from "../i18n";
import BackupNotice from "./BackupNotice";

/**
 * The first thing a new device shows: a welcome with one question.
 *
 * The progress lives in one browser and nowhere else, so a player who already
 * played somewhere else has exactly one chance to avoid starting over, and it
 * is here, before the first question. The offer is answered once: loading a file
 * or choosing to start from the beginning closes it for good, and the settings
 * sheet stays the place to come back to later.
 *
 * Nothing is written while the card is open, so the decision is taken from
 * storage exactly once, when the app mounts, rather than on every render.
 */
export default function WelcomeBackup() {
  const t = useT();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(needsBackupOffer);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(null);
  const [restored, setRestored] = useState(null);
  const cardRef = useRef(null);

  // Escape and the backdrop deliberately do nothing here: this is a choice with
  // two answers, not a dialog to wave away, and both answers are one click away.
  useModalA11y({ open, onClose: () => {}, containerRef: cardRef });

  const startFresh = () => {
    dismissBackupOffer();
    setOpen(false);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    // Cleared straight away so picking the same file twice in a row still counts.
    event.target.value = "";
    if (!file) return;
    setNote(null);

    // Size and type first, before a byte of it is read: this is the one screen a
    // player meets a file picker on without asking for one.
    const looked = checkBackupFile(file);
    if (!looked.ok) {
      setNote(looked.reason);
      return;
    }

    let text = "";
    try {
      text = await file.text();
    } catch {
      setNote("notJson");
      return;
    }

    const read = readBackup(text);
    if (!read.ok) {
      setNote(read.reason);
      return;
    }

    setLoading(true);
    try {
      // There is nothing to lose on a device that never played, so the file is
      // applied straight away instead of asking for a confirmation it cannot need.
      await progressStore.replace(read.progress);
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      dismissBackupOffer();
      setRestored({
        profileName: read.profileName,
        xp: read.progress.total_xp,
        stars: read.progress.stars_earned,
        levels: (read.progress.completed_levels || []).length,
      });
    } catch {
      setNote("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            tabIndex={-1}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 focus:outline-none"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shrink-0">
                <Compass className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 id="welcome-title" className="text-lg font-extrabold text-slate-800 leading-tight">
                  {t.welcomeTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.appSubtitle}</p>
              </div>
            </div>

            {restored ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="font-bold text-sm text-emerald-800">{t.welcomeLoaded}</p>
                <p className="text-sm text-emerald-900 mt-1 tabular-nums">
                  {restored.xp} XP · {restored.stars} {t.stars} · {restored.levels} {t.levels}
                </p>
                {restored.profileName && (
                  <p className="text-xs text-emerald-800/90 mt-1">
                    {t.welcomeFrom} {restored.profileName}
                  </p>
                )}
                <Button
                  onClick={() => setOpen(false)}
                  className="w-full h-11 rounded-xl mt-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  {t.continue}
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{t.welcomeIntro}</p>

                <label className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-sm shadow-lg cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2">
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  {loading ? t.backupImporting : t.welcomeLoad}
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="sr-only"
                    disabled={loading}
                    onChange={handleFile}
                  />
                </label>

                <button
                  onClick={startFresh}
                  className="w-full h-11 rounded-xl mt-2 border-2 border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors"
                >
                  {t.welcomeStart}
                </button>

                {note && <BackupNotice note={note} t={t} />}

                <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{t.welcomeSettingsHint}</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
