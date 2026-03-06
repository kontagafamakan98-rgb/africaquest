import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ExternalLink, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function WebSearchModal({ open, onClose, question }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!question || loading) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `A child is playing a history quiz about Africa. Help them find hints (not the direct answer) for this question: "${question}". 
Give 3 short educational hints and a brief historical context paragraph (2-3 sentences). 
Respond in the same language as the question.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            hints: { type: "array", items: { type: "string" } },
            context: { type: "string" }
          }
        }
      });
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!results && !loading) handleSearch();
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
            onAnimationStart={handleOpen}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto"
            style={{ paddingBottom: "calc(1.5rem + var(--sab))" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-5 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-violet-500" />
                  <h2 className="text-lg font-extrabold text-slate-800">Research Hints</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="bg-violet-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-violet-700 leading-relaxed">{question}</p>
              </div>

              {loading && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                  <p className="text-sm text-slate-500">Searching history books…</p>
                </div>
              )}

              {results && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">💡 Hints</p>
                    <div className="space-y-2">
                      {results.hints?.map((hint, i) => (
                        <div key={i} className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
                          <span className="text-amber-500 font-bold text-sm shrink-0">{i + 1}.</span>
                          <p className="text-sm text-amber-800 leading-relaxed">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">📖 Context</p>
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-sm text-slate-700 leading-relaxed">{results.context}</p>
                    </div>
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