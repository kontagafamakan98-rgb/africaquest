import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Eraser, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "../i18n";
import { useModalA11y } from "@/lib/use-modal-a11y";

export const MAX_ELIMINATIONS = 2;

export default function HintModal({
  open,
  onClose,
  question,
  removedOptions = [],
  onRemoveOption,
  revealLetter,
  onRevealLetter,
}) {
  const t = useT();
  const dialogRef = useRef(null);

  useModalA11y({ open, onClose, containerRef: dialogRef });

  const eliminationsLeft = Math.max(0, MAX_ELIMINATIONS - removedOptions.length);
  const canEliminate = eliminationsLeft > 0;
  const canReveal = !revealLetter;
  const allUsed = !canEliminate && !canReveal;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* A tap on the scrim closes the sheet, which is what a thumb tries
              first. It carries nothing a reader can act on by keyboard, and the
              sheet has a close button of its own, so it is kept out of the
              accessibility tree rather than announced as an unnamed control. */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hint-title"
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto focus:outline-none"
            style={{ paddingBottom: "calc(1.5rem + var(--sab))" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-5 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h2 id="hint-title" className="text-lg font-extrabold text-slate-800">{t.hintTitle}</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label={t.close}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-amber-800 leading-relaxed">{question}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onRemoveOption}
                  disabled={!canEliminate}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors",
                    canEliminate
                      ? "border-amber-300 bg-amber-50 hover:border-amber-400 text-amber-900"
                      : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Eraser className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-sm font-bold">{t.hintRemoveWrong}</span>
                  <span className="text-[11px] font-semibold">
                    {eliminationsLeft} {t.hintLeft}
                  </span>
                </button>

                <button
                  onClick={onRevealLetter}
                  disabled={!canReveal}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors",
                    canReveal
                      ? "border-slate-200 bg-white hover:border-amber-400 text-slate-700"
                      : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-sm font-bold">{t.hintRevealLetter}</span>
                  {revealLetter && (
                    <span className="text-sm font-black text-amber-700">{revealLetter}</span>
                  )}
                </button>
              </div>

              {revealLetter && (
                <p className="text-xs text-slate-500 mt-3">
                  {t.hintStartsWith} <span className="font-black text-slate-700">{revealLetter}</span>
                </p>
              )}

              {allUsed && <p className="text-xs text-slate-600 mt-3">{t.hintNoneLeft}</p>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
