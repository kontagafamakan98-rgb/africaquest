import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, LogOut, Info, AlertTriangle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { useT, LANGUAGES, getLang, setLang } from "../i18n";

export default function SettingsModal({ open, onClose, progressId, onLangChange }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const t = useT();
  const currentLang = getLang();

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (progressId) {
        await base44.entities.PlayerProgress.delete(progressId);
        queryClient.invalidateQueries({ queryKey: ["progress"] });
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
      onClose();
    }
  };

  const handleLangChange = (code) => {
    setLang(code);
    onLangChange?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 modal-bg bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto"
            style={{ paddingBottom: "calc(1.5rem + var(--sab))" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-5 pb-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-slate-800">{t.settings}</h2>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* About */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-3 flex gap-3 items-start">
                <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-800">{t.about}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.aboutDesc}</p>
                </div>
              </div>

              {/* Language picker */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Globe className="w-4 h-4 text-violet-500" />
                  <p className="text-sm font-semibold text-slate-700">{t.language}</p>
                </div>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                        currentLang === lang.code
                          ? "border-violet-400 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => base44.auth.logout()}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left mb-2"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{t.signOut}</span>
              </button>

              {/* Delete progress */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 text-sm">{t.deleteProgress}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.deleteProgressDesc}</p>
                  </div>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-4"
                >
                  <div className="flex gap-2 items-start mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{t.deleteConfirm}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl">
                      {t.cancel}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                    >
                      {deleting ? t.deleting : t.yesDelete}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}