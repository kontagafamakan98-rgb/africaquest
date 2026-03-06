import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, Clock, Zap, Star } from "lucide-react";
import { DIFFICULTIES, LEVEL_IMAGES } from "./gameData";
import { useT } from "../i18n";
import AudioNarrator from "./AudioNarrator";

export default function DifficultyPicker({ level, levelScores, onSelect, onBack }) {
  const t = useT();
  const img = LEVEL_IMAGES[level.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero image header */}
      <div className="relative h-52 overflow-hidden">
        {img && (
          <img src={img} alt={level.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          style={{ marginTop: "var(--sat)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-0.5">{level.region}</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold text-white drop-shadow">{level.title}</h2>
            <span className="text-4xl">{level.icon}</span>
          </div>
          <p className="text-white/70 text-sm">{level.subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <AudioNarrator levelId={level.id} />

        <h3 className="text-center text-lg font-bold text-slate-700 mb-1">{t.chooseDifficulty}</h3>
        <p className="text-center text-sm text-slate-500 mb-5">{t.chooseDifficultyDesc}</p>

        <div className="space-y-3">
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
                    {diff.timeLimit > 0 ? `${diff.timeLimit}${t.perQuestion}` : (t.easyDesc?.split("·")[0]?.trim() || "No time limit")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {diff.xpMultiplier}{t.xpMultiplier}
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