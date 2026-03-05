import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, Clock, Zap, Star } from "lucide-react";
import { DIFFICULTIES } from "./gameData";
import { useT } from "../i18n";

export default function DifficultyPicker({ level, levelScores, onSelect, onBack }) {
  const t = useT();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{level.region}</p>
            <h2 className="text-xl font-extrabold text-slate-800">{level.title}</h2>
          </div>
          <span className="text-3xl ml-auto">{level.icon}</span>
        </div>

        <h3 className="text-center text-lg font-bold text-slate-700 mb-2">{t.chooseDifficulty}</h3>
        <p className="text-center text-sm text-slate-500 mb-8">{t.chooseDifficultyDesc}</p>

        <div className="space-y-4">
          {Object.values(DIFFICULTIES).map((diff, i) => {
            const best = levelScores?.[diff.id];
            return (
              <motion.button
                key={diff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onSelect(diff.id)}
                className={cn(
                  "w-full text-left rounded-2xl border-2 p-5 transition-all hover:scale-[1.02] active:scale-[0.98]",
                  diff.borderColor, diff.bgColor
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diff.icon}</span>
                    <div>
                      <p className={cn("font-extrabold text-lg", diff.textColor)}>{diff.label}</p>
                      <p className="text-xs text-slate-500">{diff.description}</p>
                    </div>
                  </div>
                  {best && (
                    <div className="flex items-center gap-1 bg-white/70 rounded-xl px-3 py-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-700">{best.stars}/3</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {diff.timeLimit}s per question
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {diff.xpMultiplier}× XP
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}